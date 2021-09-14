<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="hl_print2.aspx.cs" Inherits="BPMS.WEB.Three_hospital.lchljl.hl_print2" %>

 <%=Themes_Table+Themes_jquery_1_8_2+Themes_WdatePicker+Themes_JValidator+Themes_artDialog+Themes_iframeTools+Themes_FunctionJS+Themes_jqprint+scripts_EnterChange %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<style>
    .content {
        width:1200px;
        height:808px;
        page-break-after:always;
    }
    .content table {
            width:100%;
    }

    .content h1 {
        text-align:center;
    }
    button {
        position:fixed;
        top:20px;
        right:20px;
        z-index:9;
    }
     .pages{
         position:absolute;
         bottom:0px;
         width:100px !important;
         left:50%;
         margin-left:-50px;
     }
    .pages, .pages input {
        text-align:center; 
        width:60px;
   }
    .sm {
        width:100%;
        position:absolute;
         bottom:30px;
    }
</style>
<body>
    <form id="form1" runat="server">
        <button onclick="prints()">Print</button>
        <div class="box">
        </div>
    </form>
</body>
<script>
window.onload = function(){
    loaddata();
    }
    function prints() {
        $("button").hide();
        print();
        setTimeout(function () {
            Location.reload();
        },100);
    }
   function loaddata() {
        $.ajax({
            url: "hl_print2.aspx?action=LoadAuto&zyh=<%=Request["zyh"]%>",
            dataType: "JSON",
            async: false,
            cache: false,
            success: function (data) {
                console.log(data);
                 var page = 1;
                $('.box').append(`<div class=\"content\">
                                <h1 class=\"titles\">绵阳市第三人民医院</h1>
                               <h1 class=\"FormNames\">病人**切除记录单</h1>
                              <table>
                                   <th><span>时间</span></th>
                                    <th>体温(℃)</th>
                                    <th>脉搏（次/分）</th>
                                    <th>呼吸（次/分）</th>
                                    <th>血压（mmHg）</th>
                                    <th>氧饱和度%</th>
                                    <th>意识</th>
                                    <th>瞳孔大小左</th>
                                    <th>瞳孔大小右</th>
                                    <th>对光反射左</th>
                                    <th>对光反射右</th>
                                    <th>翻身拍背</th>
                                    <th  style="width: 300px !important;">病情观察</th>
                                    <th>签名</th>
                                </tr>
                             </table>
                               <p class="sm">还好我发现的早，盆里的水黑的连植物都不想喝了，我怀疑有人给我植物下毒。还好我发现的早，盆里的水黑的连植物都不想喝了，我怀疑有人给我植物下毒。还好我发现的早，盆里的水黑的连植物都不想喝了，我怀疑有人给我植物下毒。</p>
                               <p class=\"pages\">第<input type=\"text\" value="`+page+`">页</p>
                           </div>`);
                var InnerHtml = "";
                var datas = data.d;
                    for(var x in datas){
                        InnerHtml="";
                        InnerHtml += "<tr>"+
                                "<td>"+datas[x].sjrq+"</td>"+
                                "<td>"+datas[x].T+"</td>"+
                                "<td>"+datas[x].R+"</td>"+
                                "<td>"+datas[x].R+"</td >"+
                                " <td>"+datas[x].P+"</td>"+
                                "<td>"+datas[x].ybh+"</td>"+
                                "<td>"+datas[x].ys+"</td>"+
                                "<td>"+datas[x].tkdxz+"</td>"+
                                "<td>"+datas[x].tkdxy+"</td>"+
                                "<td>"+datas[x].dgfyz+"</td>"+
                                "<td>"+datas[x].dgyyy+"</td>"+
                                "<td>"+datas[x].fspb+"</td>"+
                                "<td style='width: 300px !important;word-break: break-all;'>"+datas[x].bqgc+"</td>"+
                                "<td>"+datas[x].cUserName+"</td>"+
                                "</tr > ";
                        $("table:last").append(InnerHtml);
                        if($("table:last").outerHeight()<800){
                            InnerHtml+="";
                        }
                        if($("table:last").outerHeight()>680){ 
                            page++;
                            $("table:last").find("tr:last").remove();
                            $('.box').append(`<div class=\"content\">
                                <h1 class=\"titles\">绵阳市第三人民医院</h1>
                               <h1 class=\"FormNames\">病人**切除记录单</h1>
                              <table>
                                    <tr style="height: 30px;">
                                     <th style="width: 180px !important"><span>时间</span></th>
                                    <th style="width: 80px !important">体温(℃)</th>
                                    <th style="width: 80px !important">脉搏（次/分）</th>
                                    <th style="width: 80px !important">呼吸（次/分）</th>
                                    <th style="width: 80px !important">血压（mmHg）</th>
                                    <th style="width: 100px !important">氧饱和度%</th>
                                    <th style="width: 100px !important">意识</th>
                                    <th style="width: 100px !important">瞳孔大小左</th>
                                    <th style="width: 100px !important">瞳孔大小右</th>
                                    <th style="width: 100px !important">对光反射左</th>
                                    <th style="width: 100px !important">对光反射右</th>
                                    <th style="width: 100px !important">翻身拍背</th>
                                    <th style="width: 400px !important;">病情观察</th>
                                    <th style="width: 100px !important">签名</th>
                                </tr>
                             </table>
                               <p class="sm">还好我发现的早，盆里的水黑的连植物都不想喝了，我怀疑有人给我植物下毒。还好我发现的早，盆里的水黑的连植物都不想喝了，我怀疑有人给我植物下毒。还好我发现的早，盆里的水黑的连植物都不想喝了，我怀疑有人给我植物下毒。</p>
                               <p class=\"pages\">第<input type=\"text\" value="`+page+`">页</p>
                           </div>`);
                            $("table:last").append(InnerHtml);
                        }
                    }
            },
            error: function () {
                //alert("数据加载失败");
            }
        });
    }
</script>
</html>
