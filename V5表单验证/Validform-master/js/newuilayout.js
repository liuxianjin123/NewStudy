
//========================基于Validform插件========================
//初始化验证表单
$.fn.initValidform = function () {
    var checkValidform = function (formObj) {
        $(formObj).Validform({
            tiptype: function (msg, o, cssctl) {
                /*msg：提示信息;
                o:{obj:*,type:*,curform:*}
                obj指向的是当前验证的表单元素（或表单对象）；
                type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态；
                curform为当前form对象;
                cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）；*/
                //全部验证通过提交表单时o.obj为该表单对象;
                if (!o.obj.is("form")) {
                    //定位到相应的Tab页面
                    if (o.obj.is(o.curform.find(".Validform_error:first"))) {
                        var tabobj = o.obj.parents(".tab-content"); //显示当前的选项
                        var tabindex = $(".tab-content").index(tabobj); //显示当前选项索引
                        if (!$(".content-tab ul li").eq(tabindex).children("a").hasClass("selected")) {
                            $(".content-tab ul li a").removeClass("selected");
                            $(".content-tab ul li").eq(tabindex).children("a").addClass("selected");
                            $(".tab-content").hide();
                            tabobj.show();
                        }
                    }
                    //页面上不存在提示信息的标签时，自动创建;
                    if (o.obj.parents("dd").find(".Validform_checktip").length == 0) {
                        o.obj.parents("dd").append("<span class='Validform_checktip' />");
                        o.obj.parents("dd").next().find(".Validform_checktip").remove();
                    }
                    var objtip = o.obj.parents("dd").find(".Validform_checktip");
                    cssctl(objtip, o.type);
                    objtip.text(msg);
                }
            },
            showAllError: true
        });
    };
    return $(this).each(function () {
        checkValidform($(this));
    });
}
//======================以上基于Validform插件======================



//智能浮动层函数
$.fn.smartFloat = function () {
    var position = function (element) {
        var top = element.position().top;
        var pos = element.css("position");
        $(window).scroll(function () {
            var scrolls = $(this).scrollTop();
            if (scrolls > top) {
                if (window.XMLHttpRequest) {
                    element.css({
                        position: "fixed",
                        top: 0
                    });
                } else {
                    element.css({
                        top: scrolls
                    });
                }
            } else {
                element.css({
                    position: pos,
                    top: top
                });
            }
        });
    };
    return $(this).each(function () {
        position($(this));
    });
};

//复选框
$.fn.ruleSingleCheckbox = function () {
    var singleCheckbox = function (parentObj) {
        //查找复选框
        var checkObj = parentObj.find('input:checkbox').eq(0);
        parentObj.children().hide();
        //添加元素及样式
        var lbl_yes = "是";
        var lbl_no = "否";
        if (parentObj.children().is("span") && parentObj.children().attr("label")) {
            var ll = parentObj.children().attr("label");
            var llarr = ll.split("|");
            if (llarr.length == 2) {
                lbl_yes = llarr[0]
                lbl_no = llarr[1];
            }
        }
        var newObj = $('<a href="javascript:;">'
            + '<i class="off">' + lbl_no + '</i>'
            + '<i class="on">' + lbl_yes + '</i>'
            + '</a>').prependTo(parentObj);
        parentObj.addClass("single-checkbox");
        //判断是否选中
        if (checkObj.prop("checked") == true) {
            newObj.addClass("selected");
        }
        //检查控件是否启用
        if (checkObj.prop("disabled") == true) {
            newObj.css("cursor", "default");
            return;
        }
        //绑定事件
        $(newObj).click(function () {
            if (checkObj.is(":disabled")) return false;
            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
                //checkObj.prop("checked", false);
            } else {
                $(this).addClass("selected");
                //checkObj.prop("checked", true);
            }
            checkObj.trigger("click"); //触发对应的checkbox的click事件
        });
        $(checkObj).change(function () {
            if ($(this).prop("checked")) {
                $(this).prev().addClass("selected");
            } else {
                $(this).prev().removeClass("selected");
            }
        });
    };
    return $(this).each(function () {
        singleCheckbox($(this));
    });
};

//多项复选框
$.fn.ruleMultiCheckbox = function () {
    var multiCheckbox = function (parentObj) {
        parentObj.addClass("multi-checkbox"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
        parentObj.find(":checkbox").each(function () {
            var indexNum = parentObj.find(":checkbox").index(this); //当前索引
            var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a>').appendTo(divObj); //查找对应Label创建选项
            if ($(this).prop("checked") == true) {
                newObj.addClass("selected"); //默认选中
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                newObj.css("cursor", "default");
                return;
            }
            //绑定事件
            $(newObj).click(function () {
                if (parentObj.find(':checkbox').eq(indexNum).is(":disabled")) return false;
                if ($(this).hasClass("selected")) {
                    $(this).removeClass("selected");
                    //parentObj.find(':checkbox').eq(indexNum).prop("checked",false);
                } else {
                    $(this).addClass("selected");
                    //parentObj.find(':checkbox').eq(indexNum).prop("checked",true);
                }
                parentObj.find(':checkbox').eq(indexNum).trigger("click"); //触发对应的checkbox的click事件
                //alert(parentObj.find(':checkbox').eq(indexNum).prop("checked"));
            });
        });
    };
    return $(this).each(function () {
        multiCheckbox($(this));
    });
}

//多项选项PROP
$.fn.ruleMultiPorp = function () {
    var multiPorp = function (parentObj) {
        parentObj.addClass("multi-porp"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<ul></ul>').prependTo(parentObj); //前插入一个DIV
        parentObj.find(":checkbox").each(function () {
            var indexNum = parentObj.find(":checkbox").index(this); //当前索引
            var liObj = $('<li></li>').appendTo(divObj)
            var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a><i></i>').appendTo(liObj); //查找对应Label创建选项
            if ($(this).prop("checked") == true) {
                liObj.addClass("selected"); //默认选中
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                newObj.css("cursor", "default");
                return;
            }
            //绑定事件
            $(newObj).click(function () {
                if (parentObj.find(':checkbox').eq(indexNum).is(":disabled")) return false;
                if ($(this).parent().hasClass("selected")) {
                    $(this).parent().removeClass("selected");
                } else {
                    $(this).parent().addClass("selected");
                }
                parentObj.find(':checkbox').eq(indexNum).trigger("click"); //触发对应的checkbox的click事件
                //alert(parentObj.find(':checkbox').eq(indexNum).prop("checked"));
            });
        });
    };
    return $(this).each(function () {
        multiPorp($(this));
    });
}

//多项单选
$.fn.ruleMultiRadio = function () {
    var multiRadio = function (parentObj) {
        parentObj.addClass("multi-radio"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
        parentObj.find('input[type="radio"]').each(function () {
            var indexNum = parentObj.find('input[type="radio"]').index(this); //当前索引
            var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a>').appendTo(divObj); //查找对应Label创建选项
            if ($(this).prop("checked") == true) {
                newObj.addClass("selected"); //默认选中
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                newObj.css("cursor", "default");
                return;
            }
            //绑定事件
            $(newObj).click(function () {
                if (parentObj.find('input[type="radio"]').eq(indexNum).is(":disabled")) return false;
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected");
                parentObj.find('input[type="radio"]').prop("checked", false);
                parentObj.find('input[type="radio"]').eq(indexNum).prop("checked", true);
                parentObj.find('input[type="radio"]').eq(indexNum).trigger("click"); //触发对应的radio的click事件
                //alert(parentObj.find('input[type="radio"]').eq(indexNum).prop("checked"));
            });
        });
    };
    return $(this).each(function () {
        multiRadio($(this));
    });
}

//单选下拉框
$.fn.ruleSingleSelect = function () {
    var singleSelect = function (parentObj) {
        parentObj.addClass("single-select"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
        //创建元素
        var titObj = $('<a class="select-tit" href="javascript:;"><span></span><i></i></a>').appendTo(divObj);
        var itemObj = $('<div class="select-items"><ul></ul></div>').appendTo(divObj);
        var arrowObj = $('<i class="arrow"></i>').appendTo(divObj);
        var selectObj = parentObj.find("select").eq(0); //取得select对象
        //遍历option选项
        selectObj.find("option").each(function (i) {
            var indexNum = selectObj.find("option").index(this); //当前索引
            var liObj = $('<li>' + $(this).text() + '</li>').appendTo(itemObj.find("ul")); //创建LI
            if ($(this).prop("selected") == true) {
                liObj.addClass("selected");
                titObj.find("span").text($(this).text());
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                liObj.css("cursor", "default");
                return;
            }
            //绑定事件
            liObj.click(function () {
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected"); //添加选中样式
                selectObj.find("option").prop("selected", false);
                selectObj.find("option").eq(indexNum).prop("selected", true); //赋值给对应的option
                titObj.find("span").text($(this).text()); //赋值选中值
                arrowObj.hide();
                itemObj.hide(); //隐藏下拉框
                selectObj.trigger("change"); //触发select的onchange事件
                //alert(selectObj.find("option:selected").text());
            });
        });
        //设置样式
        //titObj.css({ "width": titObj.innerWidth(), "overflow": "hidden" });
        //itemObj.children("ul").css({ "max-height": $(document).height() - titObj.offset().top - 62 });

        //检查控件是否启用
        if (selectObj.prop("disabled") == true) {
            titObj.css("cursor", "default");
            return;
        }
        //绑定单击事件
        titObj.click(function (e) {
            if (selectObj.is(":disabled")) return false;
            e.stopPropagation();
            if (itemObj.is(":hidden")) {
                //隐藏其它的下位框菜单
                $(".single-select .select-items").hide();
                $(".single-select .arrow").hide();
                //位于其它无素的上面
                arrowObj.css("z-index", "10");
                itemObj.css("z-index", "10");
                //显示下拉框
                arrowObj.show();
                itemObj.show();
            } else {
                //位于其它无素的上面
                arrowObj.css("z-index", "");
                itemObj.css("z-index", "");
                //隐藏下拉框
                arrowObj.hide();
                itemObj.hide();
            }
        });
        //绑定页面点击事件
        $(document).click(function (e) {
            selectObj.trigger("blur"); //触发select的onblure事件
            arrowObj.hide();
            itemObj.hide(); //隐藏下拉框
        });
    };
    return $(this).each(function () {
        singleSelect($(this));
    });
}

//多项下拉选择
$.fn.ruleMultiSelect = function () {
    var multiSelect = function (parentObj) {
        parentObj.addClass("multi-checkbox"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
        parentObj.find(":checkbox").each(function () {
            //todo:有时间再搞
        });
    };
    return $(this).each(function () {
        multiSelect($(this));
    });
}

$.fn.fff = function () {
    var singleSelectRefresh = function (parentObj) {
        if (parentObj.parents(".single-checkbox").length) {
            if (parentObj.is(":checked")) {
                parentObj.parents(".single-checkbox").find("a").addClass("selected");
            } else {
                parentObj.parents(".single-checkbox").find("a").removeClass("selected");
            }
        } else {
            if (parentObj.is("select:hidden") && parentObj.prev().hasClass("boxwrap")) {
                var boxwrap = parentObj.prev();
                boxwrap.find("li").removeClass("selected");
                var indexNum = parentObj.find("option:selected").index(); //当前索引
                boxwrap.find("li").eq(indexNum).addClass("selected");
                boxwrap.find(".select-tit span").text(parentObj.find("option:selected").text());
            }
        }
    };
    return $(this).each(function () {
        singleSelectRefresh($(this));
    });
}
var p_Mak_checkDatatype = {
    float: function (gets, obj, param) {
        var result = false;
        var precision = param.prec || 2;
        var reg = "/^[\\-]?\\d+$|^[\\-]?\\d+\\.\\d{1," + precision + "}$/";
        if (eval(reg).test(gets)) {
            var ff = parseFloat(gets);
            if (!isNaN(ff)) {

                if (param.min != undefined && typeof param.min == "number" && ff < param.min) {
                    result = false
                } else if (param.max != undefined && typeof param.max == "number" && ff > param.max) {
                    result = false
                } else
                    result = true;
            }
        }
        if (!result) {
            var tips = "必须是整数或" + precision + "小数！";
            if (param.min != undefined && typeof param.min == "number") {
                tips += "  最小值:" + param.min;
            }
            if (param.max != undefined && typeof param.max == "number") {
                tips += "  最大值:" + param.max;
            }
            obj.attr("errormsg", tips);
        }
        return result
    },
    int: function (gets, obj, param) {
        var result = false;
        var reg = "/^[\\-]?\\d+$/";
        if (eval(reg).test(gets)) {
            var ff = parseInt(gets);
            if (!isNaN(ff)) {
                if (param.min != undefined && typeof param.min == "number" && ff < param.min) {
                    result = false
                } else if (param.max != undefined && typeof param.max == "number" && ff > param.max) {
                    result = false
                } else
                    result = true;
            }
        }
        if (!result) {
            var tips = "必须是整数!";
            if (param.min != undefined && typeof param.min == "number") {
                tips += "  最小值:" + param.min;
            }
            if (param.max != undefined && typeof param.max == "number") {
                tips += "  最大值:" + param.max;
            }
            obj.attr("errormsg", tips);
        }
        return result
    }

}

var Validform_datatype = {};
var vf;
$(function () {
    $(".ltable tr:nth-child(odd)").addClass("odd_bg"); //隔行变色
    $("#floatHead").smartFloat();
    $(".rule-single-checkbox").ruleSingleCheckbox();
    $(".rule-multi-checkbox").ruleMultiCheckbox();
    $(".rule-multi-radio").ruleMultiRadio();
    $(".rule-single-select").ruleSingleSelect();
    $(".rule-multi-porp").ruleMultiPorp();

    $("select[data-ov]").change(function () {
        var data_odc = $("#" + $(this).attr("data-odc"));
        if (data_odc) {
            if ($(this).attr("data-ov") == $(this).val()) {
                data_odc.show();
            } else {
                data_odc.hide();
            }
        }
    }).change();
    //滑块
    $(".input-range input[type=range]").each(function () {
        var timer = null;
        var tooltip = $(this).next();
        if (tooltip.is("span.iptrange-tooltip")) {
            tooltip.hide();
            var showTip = function () {
                tooltip.show();
                var offsetLeft = this.offsetLeft;
                var width = this.offsetWidth - 28;
                var tooltipWidth = tooltip.width();
                var distince = Math.abs(this.max - this.min);
                var scaleWidth = (width / distince) * Math.abs(this.value - this.min);

                tooltip.css("left", (14 + offsetLeft + scaleWidth - tooltipWidth / 2) + 'px');
                tooltip.html(this.value);
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    tooltip.hide()
                }, 1000);
            };
            this.addEventListener('input', showTip);
        }
    });

    if (typeof ($.fn.Validform) == "function") {
        Validform_datatype = $.extend({}, $.Datatype, {
            "h*": function (gets, obj, curform, regxp) {
                if (obj[0].id == 'tzjk') {
                    if (gets || $(obj.parent()).is(":hidden")) {
                        return true;
                    } else
                        return false;
                } else if (gets || $(obj).is(":hidden")) {
                    return true;
                } else {
                    return false;
                }
            },
            extcheck: function (gets, obj, curform, regxp) {
                var param = eval("(" + obj.attr("data-vfp") + ")");
                if (param != undefined && param.t != undefined) {
                    var af = p_Mak_checkDatatype[param.t];
                    if (typeof af == "function") {
                        return af(gets, obj, param);
                    }
                }
                obj.attr("errormsg", "data-vfp.t未定义");
                return false;
            }
        });
        //初始化表单验证
        vf = $("#form1").Validform({
            showAllError: true,
            datatype: Validform_datatype,
            tiptype: function (msg, o, cssctl) {
                var objCL = null;
                var dobj = null;
                if ($(o.obj).is("input")) {
                    dobj = o.obj;
                } else if ($(o.obj).is("select")) {
                    dobj = o.obj.parents(".rule-single-select");
                }
                if (dobj && dobj.is(":visible")) {
                    objCL = dobj.get(0).classList;
                    if (o.type == 2 || o.type == 4) {
                        if (o.type == 4) {
                            objCL.remove("Validform_error");
                            objCL.remove("Validform_succ");
                        } else {
                            objCL.remove("Validform_error");
                            objCL.add("Validform_succ");
                        }
                        $(dobj).nextAll("span.Validform_checktip1").hide();
                    } else {
                        objCL.remove("Validform_succ");
                        objCL.add("Validform_error");
                        //msg = o.obj.attr("errormsg");
                        if (msg && msg.trim()) {
                            var tip = $(dobj).nextAll("span.Validform_checktip1");
                            if (!tip.length) {
                                $(dobj).parent().append("<span class='Validform_checktip1'></span>");
                                tip = $(dobj).nextAll("span.Validform_checktip1");
                            }
                            if (tip.length) {
                                tip.html(msg);
                                if (tip.parent().css("position") == "relative") {
                                    tip.css({
                                        'left':10,
                                        'top': 0
                                    });
                                } else {
                                    tip.css({
                                        'left': $(dobj).offset().left + 10,
                                        'top': $(dobj).offset().top
                                    });
                                }

                                tip.show();
                                if (tip.offset().top < 0) {
                                    tip.addClass("sbl");
                                }
                            }
                        }
                    }
                }
            }
        });
        $(document).click(function (a) {
            if ($(a.target).is("span.Validform_checktip1")) {
                $(a.target).hide();
            }
        });
    }
});