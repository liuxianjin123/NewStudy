let MakFishBone = (function (window) {
  let MakFishBone = function (canvas, options) {
    return new MakFishBone.fn.init(canvas, options)
  }
  MakFishBone.fn = MakFishBone.prototype = {
    constructor: MakFishBone,
    init: function (canvas, options) {
      this.canvas = canvas
      let dpr = window.devicePixelRatio || 1
      canvas.width = parseInt(canvas.style.width) * dpr
      canvas.height = parseInt(canvas.style.height) * dpr
      this.ctx = canvas.getContext('2d')
      let defaultConfig = {
        /*json数据*/
        data: null,
        /*是否可以拖动，默认是true */
        dragable: false,
        /*是否显示工具条 */
        showToolbar: false,
        /* debug模式 */
        debug: false,
        //交错显示
        stagger: false,
        //背景
        sceneBackgroundImage: null,
        //单击节段回调
        clickNodeCallback: null
      }
      this.cfg = $.extend(defaultConfig, options)
      let stage = new JTopo.Stage(canvas)
      this.stage = stage
      //显示工具栏
      showJTopoToobar(stage)
      this.scene = new JTopo.Scene(stage)
    },
    getFishBoneNode: function (position, text) {
      let jNode = new JTopo.Node(text || '')
      jNode.shadow = false
      jNode.showSelected = false;
      jNode.dragable = false
      if (position) {
        jNode.setLocation(position.x, position.y)
      }
      jNode.setSize(0, 0)
      if (this.cfg.debug) {
        jNode.setSize(1, 1)
      }
      return jNode
    },
    getNodeTextRect: function (node, text) {
      this.ctx.font = node.font
      let textArray = text.split('\n')
      let maxLength = 0
      maxText = textArray[0]
      for (let i = 0; i < textArray.length; i++) {
        let rowwidth = this.ctx.measureText(textArray[i]).width
        if (rowwidth > maxLength) {
          maxLength = rowwidth
          maxText = textArray[i]
        }
      }
      let lineHeight = this.ctx.measureText('田').width
      return {
        width: maxLength,
        height: lineHeight * textArray.length,
        lineHeight: lineHeight
      }
    },
    //格式化文本节点值
    getFormatText: function (text) {
      //每行文本字符数
      let textNumberRow = 10//字体长度换行
      let tmptext = ''
      if (text) {
        for (let i = 0; i < text.length; i++) {
          if (i > 0 && i % textNumberRow == 0) {
            tmptext += '\n'
          }
          tmptext += text[i]
        }
      }
      return tmptext
    },
    getNewTextNode: function (PntA, text, PntZ, depth) {
      let tmptext
      if (depth == 1) {
        tmptext = text
      } else {
        tmptext = this.getFormatText(text)
      }
      let nodeText = new JTopo.TextNode(tmptext || '')
      nodeText.shadow = false
      nodeText.dragable = false
      nodeText.fontColor = '40,40,40'
      nodeText.font = '15px 微软雅黑'//节点字体大小
      nodeText.paint = function (a) {
        a.beginPath()
        a.font = this.font
        a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'
        a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'
        let textArray = this.text.split('\n')
        let maxLength = 0
        maxText = textArray[0]
        for (let i = 0; i < textArray.length; i++) {
          let rowwidth = a.measureText(textArray[i]).width
          if (rowwidth > maxLength) {
            maxLength = rowwidth
            maxText = textArray[i]
          }
        }
        this.width = maxLength
        let lineHeight = a.measureText('田').width
        this.height = lineHeight * textArray.length
 
        let x = -this.width / 2
        let y = -this.height / 2 + lineHeight
        for (let j = 0; j < textArray.length; j++) {
          a.fillText(textArray[j], x, y)
          y += lineHeight
        }
        a.closePath()
      }
      let size = this.getNodeTextRect(nodeText, tmptext)
      nodeText.textSize = size
      let tx = 0, ty = 0
      //设置中骨文本节点坐标
      if (depth == 1) {//改成10可以将节点文本定位在线条顶端
        tx = PntZ.x + 15, ty = PntZ.y - 15
      } else {
        tx = PntA.x, ty = PntA.y
      }
      if (PntA.y == PntZ.y) {
        //横线
        tx -= size.width
        ty -= size.lineHeight / 2
      } else {
        //斜线
        tx -= size.width / 2
        ty -= size.height
      }
      nodeText.setLocation(tx, ty)
      this.scene.add(nodeText)
 
      let nodeA = this.getFishBoneNode(PntA)
      let nodeZ = this.getFishBoneNode(PntZ)
      if (depth == 0) {
        //获取鱼骨图，设置根节点x,y坐标
        let img = new Image()
        img.src = 'fish_head.png'
        //图片加载完成之后执行
        img.onload = function () {
          nodeA.y = nodeA.y - img.height / 2.5
          nodeZ.y = nodeZ.y - img.height / 2
          nodeA.setImage('fish_tail.png', true)
          nodeZ.setImage('fish_head.png', true)
        }
      }
      this.scene.add(nodeA)
      this.scene.add(nodeZ)
      nodeZ.assPnt = nodeA
      nodeA.assPnt = nodeZ
 
      let link = new JTopo.Link(nodeA, nodeZ, '')
      link.bundleOffset = 1 // 折线拐角处的长度
      link.bundleGap = 1 // 线条之间的间隔
      link.textOffsetY = 3 // 文本偏移量（向下3个像素）
      if (depth == 0) {
        link.lineWidth = 6 // 线宽
        link.strokeColor = '80,168,234'
      } else {
        link.lineWidth = 3 // 线宽
        link.strokeColor = '80,168,234'
      }
      this.scene.add(link)
 
      return {nodeA: nodeA, nodeZ: nodeZ, link: link, text: nodeText}
    },
    resetX: function (node, x) {
      node.nodes.nodeA.x += x
      node.nodes.nodeZ.x += x
      node.nodes.text.x += x
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          this.resetX(node.children[i], x)
        }
      }
    },
    resetY: function (node, x, y) {
      node.nodes.nodeA.x += x
      node.nodes.nodeA.y += y
      node.nodes.nodeZ.x += x
      node.nodes.nodeZ.y += y
      node.nodes.text.x += x
      node.nodes.text.y += y
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          this.resetY(node.children[i], x, y)
        }
      }
    },
    //水平翻转
    HorizontalFlip: function (node) {
      node.nodes.nodeA.x = -node.nodes.nodeA.x
      node.nodes.nodeZ.x = -node.nodes.nodeZ.x
      node.nodes.text.x = node.nodes.nodeA.x
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          this.HorizontalFlip(node.children[i])
        }
      }
    },
    //垂直翻转
    VerticalFlip: function (node) {
      let size
      if (node.name) {
        let tmptext = this.getFormatText(node.name)
        size = this.getNodeTextRect(node, tmptext)
      }
      node.nodes.nodeA.y = -node.nodes.nodeA.y
      node.nodes.nodeZ.y = -node.nodes.nodeZ.y
      node.nodes.text.y = -node.nodes.text.y + (size ? -size.height : 0)
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          this.VerticalFlip(node.children[i])
        }
      }
    },
    //根据节点level值画节点
    drawLevel: function (depth) {
      if (depth < 0) {
        return
      }
      let clevels = this.flatData.filter(x => x.level == depth)
      //depth最小为0，偶数为横线，奇数为斜线
      let isHorizontal = (depth % 2) === 0
      for (let i = 0; i < clevels.length; i++) {
        let arow = clevels[i]
        let lineLength = 60//每个鱼翅横向的间隔
        //筛选子节点
        let chilnodes = []
        let tnodes = []
        for (let k = 0; k < this.AllTmpNode.length; k++) {
          if (this.AllTmpNode[k].path.indexOf(arow.path + '_') === 0) {
            chilnodes.push(this.AllTmpNode[k])
          } else {
            tnodes.push(this.AllTmpNode[k])
          }
        }
        this.AllTmpNode = tnodes
        //固定间隔
        let fixedInterval = 20//二级鱼翅的上下间隔
        if (isHorizontal) {
          //横线
          //先计算子节点宽度（分斜线左边部分，和斜线右边部分
          let width_left = []
          let width_right = []
          let widthtotal = 0
          for (let j = 0; j < chilnodes.length; j++) {
            let subnode = chilnodes[j]
            if (subnode.children) {
              if (subnode.children.length === 0) {
                //没有子节点(固定间隔)
                width_left.push(fixedInterval), width_right.push(fixedInterval)
              } else if (subnode.children.length === 1) {
                //1个子节点（半幅
                width_left.push(Math.abs(subnode.children[0].nodes.nodeA.x))
                width_right.push(0)
              } else {
                //多个子节点
                let xleft = subnode.children[0].nodes.nodeA.x
                let xright = subnode.children[0].nodes.nodeA.x
                for (let k = 0; k < subnode.children.length; k++) {
                  let growNode = subnode.children[k].nodes.nodeA
                  if (growNode.x < xleft) {
                    xleft = growNode.x
                  }
                  if (growNode.x > xright) {
                    xright = growNode.x
                  }
                }
                width_left.push(Math.abs(xleft)), width_right.push(Math.abs(xright))
              }
              widthtotal += width_left[j] + width_right[j]
            }
          }
          lineLength += widthtotal
          //计算斜线的基础位置(0,0)作为目标点
          let PntA = {x: -lineLength, y: 0}
          let PntZ = {x: 0, y: 0}
          arow.lineLength = lineLength
          //返回4个节点
          arow.nodes = this.getNewTextNode(PntA, arow.name, PntZ, depth)
          this.AllTmpNode.push(arow)
          //把它的子节点全部放到当前节点上
          let newX = PntA.x
          for (let j = 0; j < chilnodes.length; j++) {
            let subnode = chilnodes[j]
            newX += width_left[j]
            this.resetX(subnode, newX)
            newX += width_right[j]
          }
          // if (i % 2 != 0) {//这里注释掉。因为二级鱼翅左右放置导致整体难看
          //   //右边(水平翻转整颗树)
          //   this.HorizontalFlip(arow)
          // }
        } else {
          //斜线
          //先计算子节点的高度（子节点的高度，上半部分和下半部分分开计算
          let height_up = []
          let height_down = []
          let heighttotal = 0
          for (let j = 0; j < chilnodes.length; j++) {
            let subnode = chilnodes[j]
            if (subnode.children) {
              if (subnode.children.length === 0) {
                //没有子节点(固定间隔)
                height_up.push(fixedInterval), height_down.push(fixedInterval)
              } else if (subnode.children.length === 1) {
                //1个子节点（半幅
                height_up.push(subnode.children[0].lineLength)
                height_down.push(0)
              } else {
                //多个子节点
                let yTop = subnode.children[0].nodes.nodeA.y
                let yBottom = subnode.children[0].nodes.nodeA.y
                for (let k = 1; k < subnode.children.length; k++) {
                  let growNode = subnode.children[k].nodes.nodeA
                  if (growNode.y < yTop) {
                    yTop = growNode.y
                  }
                  if (growNode.y > yBottom) {
                    yBottom = growNode.y
                  }
                }
                height_up.push(Math.abs(yTop)), height_down.push(Math.abs(yBottom))
              }
              heighttotal += height_up[j] + height_down[j]
            }
          }
          lineLength += heighttotal
          //计算斜线的基础位置(0,0)作为目标点
          let PntA = {x: -lineLength / 2, y: -lineLength}
          let PntZ = {x: 0, y: 0}
          arow.lineLength = lineLength
          //返回4个节点
          arow.nodes = this.getNewTextNode(PntA, arow.name, PntZ, depth)
          this.AllTmpNode.push(arow)
          //把它的子节点全部放到当前节点上
          let newX = PntA.x
          let newY = PntA.y
          for (let j = 0; j < chilnodes.length; j++) {
            newY += height_up[j]
            newX += height_up[j] / 2
            this.resetY(chilnodes[j], newX, newY)
            newY += height_down[j]
            newX += height_down[j] / 2
          }
          if (i % 2 != 0) {
            //右上斜(垂直翻转整颗树)
            this.VerticalFlip(arow)
          }
        }
      }
      //子元素花完了，画根元素
      this.drawLevel(depth - 1)
    },
    start: function () {
      let flatData = []
      let maxdepth = 0
 
      function dofloatdata (d, path, depth) {
        d.level = depth
        d.path = path
        flatData.push(d)
        if (depth > maxdepth) {
          maxdepth = depth
        }
        if (d.children) {
          for (let i = 0; i < d.children.length; i++) {
            dofloatdata(d.children[i], path + '_' + i, depth + 1)
          }
        }
      }
 
      dofloatdata(this.cfg.data, '0', 0)
      this.flatData = flatData
      if (this.cfg.debug) {
        console.log('maxdepth:' + maxdepth)
        console.log(flatData)
      }
      this.AllTmpNode = []
      this.drawLevel(maxdepth)
      this.movePntS((this.cfg.data.lineLength + this.canvas.width) / 2, this.canvas.height / 2)
      //居中显示
      this.stage.centerAndZoom()
    },
    movePntS: function (x, y) {
      for (let i = 0; i < this.scene.childs.length; i++) {
        let a = this.scene.childs[i]
        a.x += x
        a.y += y
      }
    },
  }
  MakFishBone.fn.init.prototype = MakFishBone.fn
  return MakFishBone
})(window)