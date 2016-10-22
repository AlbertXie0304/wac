//全局变量
var name_space = {
    _k: {
        errcode: "errcode",
        errmsg: "errmsg"
    },
    _v: {
        success: "0"
    },
    idpref: {
        page: "Tpage-",
        addbtn: "Tadds-",
        editbtn: "Tedits-",
        delbtn: "Tdeletes-",
        copybtn: "Tcopys-"
    },
    css: {
        Dialog: {
            Window: "dialog_window",
            WindowBg: "dialog_window-bg",
            WindowMain: "dialog_window-main",
            WindowHead: "dialog_window-head",
            WindowTitle: "dialog_window-title",
            WindowCloseBtn: "dialog_window-closebtn",
            WindowContent: "dialog_window-content"
        }
    },
    cookie: {
        session: "Duncki_Session",
        user: "Duncki_User",
        size: "Duncki_Size"
    },
    requestKey: {

    },
    returnKey: {

    },
    returnValue: {
        
    },
    tip: {
        simplename: "只能输入字母、数字、-或_",
        strtegyname: "只能输入字母、数字、中文、-或_"
    },
    pageSizeArr:[
        "10", "20", "50", "100"
    ]
};

var regx = {
    ip: /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/,
    mask: /^(254|252|248|240|224|192|128)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/,
    mac: /^([a-fA-F\d]{2}(:|-|：)){5}[a-fA-F\d]{2}$/,
    url: /^(http|https):\/\/[\w\-\?\/\&\+:\.]*$/,
    domain: /^((http|https):\/\/)?[a-z0-9]+(\.[\w]+){0,2}\.[a-z]+$/
};

//用户输入合法性校验函数
T.format = function(v1, v2) {
    return {
        isIp: function() {
            if (regx.ip.test(v1))
                return true;
            else
                return false;
        },
        isMask: function() {
            if (regx.mask.test(v1))
                return true;
            else
                return false;
        },
        isUrl: function() {
            if (regx.url.test(v1))
                return true;
            else
                return false;
        },
        isDomain: function() {
            if (regx.domain.test(v1))
                return true;
            else
                return false;
        },
        /**
         * 判断两个IP是否在同一网段
         */
        isIpInSameNet: function(smask) {
            if (!regx.ip.test(v1) || !regx.ip.test(v2) || !regx.mask.test(smask))
                return false;
            var aip1 = new Array();
            var aip2 = new Array();
            var anetmask = new Array();
            aip1 = v1.split(".");
            aip2 = v2.split(".");
            anetmask = smask.split(".");

            for (var i = 0; i < 4; i++)
            {
                var iret1 = aip1[i] & anetmask[i];
                var iret2 = aip2[i] & anetmask[i];

                if (iret1 != iret2)
                    return false;
            }
            return true;
        },
        /**
         * 判断两个IP地址是否符合始末
         */
        isIpPool: function(sip) {
            if (!regx.ip.test(v1) || !regx.ip.test(sip))
                return false;
            var aip1 = new Array();
            var aip2 = new Array();
            aip1 = v1.split(".");
            aip2 = sip.split(".");

            var ip1, ip2;

            for (var i = 0; i < 4; i++)
            {
                ip1 = parseInt(aip1[i]);
                ip2 = parseInt(aip2[i]);
                if (ip1 < ip2)
                    return true;
                else if (ip1 > ip2)
                    return false;
            }
            return false;
        },
        isNumRange: function(imin, imax) {
            var ival = parseInt(v1);
            if (/^-?[0-9]*$/.test(v1))
            {
                if (imax == null)
                {
                    if (ival >= imin)
                        return true;
                }
                else if (ival >= imin && ival <= imax)
                    return true;
            }
            return false;
        }
    };
}

/**
 * 简单对话框
 */
var CDialogWindow = function() {
    this.DomObj_ = null;
    this.DomMainObj_ = null;
    this.DomId_ = "";
    this.InnerHTML_ = "";
    this.ShowHTML_ = "";
    this.Title_ = "Notes";
};

CDialogWindow.prototype.show = function(vContent) {
    var sContentHtml = "";
    var nameGroup = name_space.css.Dialog;
    if (typeof vContent === "string")
    {
        sContentHtml = vContent;
    }
    this.InnerHTML_ = "<div class='" + nameGroup.WindowBg + "'></div>"
             + "<div class='" + nameGroup.WindowMain + "'>"
             + "<div class='" + nameGroup.WindowHead + "'>"
                 + "<div class='" + nameGroup.WindowTitle + "'>" + this.Title_ + "</div>"
                 + "<div class='" + nameGroup.WindowCloseBtn + "'></div>"
             + "</div>"
             + "<div class='" + nameGroup.WindowContent + "'>" + sContentHtml + "</div>"
             + "</div>";
    
    var dialogDomObj = this.DomObj_;
    if (dialogDomObj && document.body[dialogDomObj])
        return;
    else
    {
        dialogDomObj = document.createElement("div");
        dialogDomObj.className = nameGroup.Window;
        dialogDomObj.innerHTML = this.InnerHTML_;
        this.DomObj_ = dialogDomObj;
        document.body.appendChild(dialogDomObj);
    }
    this.DomMainObj_ = dialogDomObj.childNodes[1];
    var oCloseBtn = this.DomMainObj_.childNodes[0].childNodes[1];
    T.addEvent(oCloseBtn, "click", function() {
        dialogDomObj.style.display = "none";
    });
    this.resetPosition();
}

CDialogWindow.prototype.resetPosition = function() {
    var iDialogWidth = this.DomMainObj_.offsetWidth;
    var iDialogHeight = this.DomMainObj_.offsetHeight;
    var iBodyWidth = document.body.offsetWidth;
    var iBodyHeight = document.body.offsetHeight;
    this.DomMainObj_.style.top = (iBodyHeight - iDialogHeight) / 2 + "px";
    this.DomMainObj_.style.left = (iBodyWidth - iDialogWidth) / 2 + "px";
}

function CheckFormat(oformat, oconfSet) {
    for (var param in oformat)
    {
        if (param in oconfSet)
        {
            var dom = T.id(param);
            var val = oconfSet[param].val;
            
            if (val == "")
            {
                if (oformat[param].cb == 1)
                {
                    dom.focus();
                    PopCheckError(oformat[param].show + "不能为空");
                    return false;
                }
            }
            else
            {
                if (oformat[param].cf == 1 && !oformat[param].reg.test(val))
                {
                    dom.select();
                    PopCheckError(oformat[param].show + oformat[param].err);
                    return false;
                }
            }
        }
    }
    
    return true;
}

function CheckCgiReturn(vdata, fcallback) {
    var errorcode = [
        "WEB_SUCCESS",
        "WEB_CONFIG_FAILURE",
        "WEB_NOT_LOGIN",
        "WEB_LOGIN_TIMEOUT",
        "WEB_DATA_ILLEGAL",
        "WEB_NO_PRIVILRGE",
        "WEB_INNER_ERROR",
        "ERROR_CODE_MAX"   
    ];

    var serrorCode = name_space._k.errcode;
    var serrorMsg = name_space._k.errmsg;

    if (typeof vdata == "string")
    {
        try {
            vdata = $.parseJSON(vdata);
        }
        catch(e) {
            if (vdata.indexOf("failed") != -1)
                return false;
        }
    }
    
    if (typeof vdata == "object" && vdata[serrorCode] != undefined && parseInt(vdata[serrorCode]) != "0")
    {
        if (errorcode[vdata[serrorCode]] == "WEB_NOT_LOGIN")
            T.CDialog({title:"错误!", scontent:"您尚未登录，请先<a target='_top' href='/'>登录</a>", onlyone:true});
        else if (errorcode[vdata[serrorCode]] == "WEB_LOGIN_TIMEOUT")
            T.CDialog({title:"错误!", scontent:"登录超时，请重新<a target='_top' href='/'>登录</a>", onlyone:true});
        return false;
    }
    
    if (fcallback)
        fcallback(vdata);
    return true;
}

function BuildConfigSet(oconfig) {
    var obj = {};
    T.eachObject(oconfig, function(key, value) {
        obj[key] = {};
        obj[key].defVal = value;
        obj[key].dom = T.id(key);
        obj[key].oldVal = "";
        obj[key].val = "";
        obj[key].able = true;
    });
    return obj;
}

function PopCheckError(smsg, dom) {
    $("._dialog_dialog").remove();
    alert(smsg);
}

function CreateDialog(sid, stitle) {
    var diag = new Dialog();
    diag.InvokeElementId = sid;
    diag.Title = stitle;
    return diag;
}

/**
 * 给dom表单元素赋值
 * @param {HTMLElemnt} dom  dom元素
 * @param {Variable} sval 要设置的值
 */
function SetOneConfigValue(dom, sval) {
    if (!dom)
        return false;
    if (dom.type == "checkbox")
    {
        dom.checked = (sval == "1" ? true : false);
    }
    else if (dom.type == "radio")
    {
        var name = dom.name;
        if (name != undefined)
            $('input:radio[name="' + name + '"][value="' + sval + '"]').attr("checked", true);
    }
    else if (dom.type == "select-one")
    {	
		if(sval !== undefined&&sval !== null&&sval !== ""){
			dom.value=sval;		
		}else{
			dom.selectedIndex = 0;	
		}
    }
    else if (dom.type != "file")
    {	
    	dom.value = ((sval !== undefined&&sval !== null)?sval:"");
    }
}

/**
 * 给一组dom表单元素赋值
 * @param {Array} doms dom元素数组
 * @param {Variable} val  要设置的值
 */
function SetDomsToValue(doms, val) {
    if (!doms || !val)
        return false;

    for (var i = 0; i < doms.length; i++)
    {
        SetOneConfigValue(doms[i], val);
    }
}

/**
 * 将一组dom表单元素设为启用或禁用,元素要有disabled属性
 * @param {Array} doms     dom元素数组
 * @param {Boolean} bdisable true:启用 disable:禁用
 */
function SetDomsToAble(doms, bdisable) {
    if (!doms)
        return false;

    for (var i = 0; i < doms.length; i++)
    {
        if (bdisable == false)
            SetToDisable(doms[i]);
        else
            SetToEnable(doms[i]);
    }
}

function InitBox(oconfigSet) {
    for (var param in oconfigSet)
    {
        var sval = oconfigSet[param].defVal;
        var dom = T.id(param); //oconfigSet[param].dom ie bug
        if (dom)
            SetOneConfigValue(dom, sval);
    }
}

function SetOldValue(oconfigSet, orow) {
    for (var param in oconfigSet)
    {
        var sval = orow[param];
        oconfigSet[param].oldVal = sval;
    }
}

function SetConfigValue(oconfigSet, orow) {
    for (var param in oconfigSet)
    {
        var sval = orow[param];
        if (undefined != sval)
        	oconfigSet[param].oldVal = sval;
        var dom = T.id(param); //oconfigSet[param].dom ie bug
        if (dom)
            SetOneConfigValue(dom, sval);
    }
}

function GetConfigValue(oconfigSet) {
    for (var param in oconfigSet)
    {
        var dom = T.id(param); //oconfigSet[param].dom ie bug
        if (!dom)
            continue;
        if (dom.type == "checkbox")
        {
            oconfigSet[param].val = (dom.checked ? "1" : "0");
        }
        else if (dom.type == "radio")
        {
            var name = dom.name;
            if (name != undefined)
                oconfigSet[param].val = $('input:radio[name="' + name + '"]:checked').val();
        }
	else if (dom.type == "multiple")
	{
            oconfigSet[param].val = $(dom).val();
        }
        else
        {
            oconfigSet[param].val = (dom.value ? dom.value : "");
        }
        dom = null;
    }
}

function SetToEnable(vdom) {
    if (!vdom)
        return;
    if (vdom.length == undefined)
       vdom.disabled = "";
    else
    {
        T.eachArray(vdom, function(val) {
            val.disabled = "";
        })
    }
}

function SetToDisable(vdom) {
    if (!vdom)
        return;
    if (vdom.length == undefined)
       vdom.disabled = "disabled";
    else
    {
        T.eachArray(vdom, function(val) {
            val.disabled = "disabled";
        })
    }
}

function Query(scgipath, orequestSet, fcallback, fcallbackError) {
    Request(scgipath, orequestSet, function(data) {
        if (CheckCgiReturn(data))
        {
            if (fcallback)
                fcallback(data);
        }
        else
        {
            if (fcallbackError)
                fcallbackError(data);
        }
    });
}

function ModyfyS(scgi, oconfigSet, fcallback) {    
    var oparam = {};
    var bchangeFlag = false;
    T.eachObject(oconfigSet, function(key, odata) {
        if (odata.able && odata.val != odata.oldVal)
        {
            oparam[key] = odata.val;
            if (odata.oldVal != null)
                bchangeFlag = true;
        }
    });

    if (!bchangeFlag)
    {
        PopCheckError("您没有修改配置");
        return;
    }

    oparam._op = EDIT;
    Query(scgi, oparam, function(data) {
        if (fcallback)
            fcallback(data);
    }, function(data) {
        PopCheckError("配置失败: " + data.errmsg);
    });
}

function Modify(scgi, oconfig, oldData, fcallback) {
    var oconfigSet = BuildConfigSet(oconfig);
    /**
     * 可能可以省略 oldVal 
     * CheckValid可以弥补GetConfigValue的不足，
     * 下面就可以直接与oldData作对比
     * */
    SetOldValue(oconfigSet, oldData);
    GetConfigValue(oconfigSet);
    
    if (!CheckValid(oconfigSet))
        return;
    ModyfyS(scgi, oconfigSet, fcallback);
}

/**
 * ajax请求的简单封装
 * @param {String} scgipath  url
 * @param {Variable} vparam   Object或字符串形式的queryString
 * @param {Function} fcallback 回调函数
 */
function Request(scgipath, vparam, fcallback) {
    var xmlhttp;
    if (window.XMLHttpRequest) // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    else // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    var url = scgipath; 
    if (T.isFunction(vparam))
    {
        fcallback = fcallback || vparam;
        vparam = null;
    }
    var data;
    if (!vparam)
    	data = "";
    else if (typeof vparam === "string")
    {
    	data = vparam;
        vparam = null;
    }
    else if (typeof vparam === "object")
    {
    	data = "";
        for (var param in vparam)
        {
            var value = vparam[param];
            if (T.isArray(value))
            {
                for (var i = 0; i < value.length; i++)
                {
                    data += param + "=" + encodeURIComponent(value[i]) + "&";
                }
            }
            else
            {
                data += param + "=" + encodeURIComponent(value) + "&";
            }
        }
        data += "/=" + Math.random();
    }
    else
    	data = "";

    var jdata = null;
    if (url.indexOf("?") != -1)
        xmlhttp.open("POST", url, true);
    else
    {
        try {
            xmlhttp.open("POST", url + "?_=" + Math.random(), true);
        } catch (e) {
            xmlhttp.open("POST", url, true);
        }
    }
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //xmlhttp.setRequestHeader("Content-type","multipart/form-data");
    try {
        xmlhttp.send(data);
    } catch(e) {
        PopCheckError("可能由于网络原因，您的请求未能发送，请检查连接后重试。");
        return;
    }
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var sresponse = xmlhttp.responseText;
            //var vReturnHeaders = xmlhttp.getAllResponseHeaders();
            //var sreturnMIMEtype = xmlhttp.getResponseHeader("Content-Type");
            //if (/json/.test(sreturnMIMEtype)) //判断返回类型
            if (1)
            {
                try
                {
                    jdata = $.parseJSON(sresponse.replace(/\t/g, ""));
                }
                catch(e)//返回的不是正确的json字符串, 不能解析
                {
                    return;
                }
            }
            if (fcallback)
                fcallback(jdata || sresponse, true);
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status == 301)
        {
            // 重定向到登录
            seajs.use(['arale-dialog'], function(Dialog) {
                new Dialog({
                content: '<div style="padding:50px">登录超时，请重新<a href="'
                        + xmlhttp.responseText + '">登录</a></div>'
                }).show();
            });
        }
    };
}

// function Request(scgipath, vparam, fcallback) {
//     var url = scgipath; 
//     if (T.isFunction(vparam))
//     {
//         fcallback = fcallback || vparam;
//         vparam = null;
//     }
//     var data;
//     var method = "GET";
//     var dataType = "json";
//     if (vparam == null)
//         data = null;
//     else if (typeof vparam === "string")
//         data = Url.parseQueryString(vparam);
//     else if (typeof vparam === "object")
//         data = $.extend({}, vparam);
//     if (url.indexOf("callback") !== -1 || data.callback)
//         dataType = "jsonp";
//     if ((url + Url.makeQueryString(data)).length > 1024)
//         method = "POST";

//     $.ajax(url, {
//         headers: {
//             "X-Requested-With": "XMLHttpRequest"
//         },
//         data: data,
//         dataType: dataType,
//         traditional: true,
//         statusCode: {
//             301: function(data) {
//                 // 重定向到登录
//                 seajs.use(['arale-dialog'], function(Dialog) {
//                     new Dialog({
//                     content: '<div style="padding:50px">登录超时，请重新<a href="'
//                             + data + '">登录</a></div>'
//                     }).show();
//                 });
//             }
//         },
//         success: function(data) {
//             if (fcallback)
//                 fcallback(data, true);
//         }
//     });
// }

function BatchAction(index, fcall, fcallback, aselect) {
    if (index >= aselect.length)
    {
        fcallback();
        return;
    }
    var self = this;
    fcall.call(self, index, function() {
        index++;
        BatchAction.call(self, index, fcall, fcallback, aselect);
    });
}
var CTable = function() {
    this.ahead_ = [];
    this.acolum_ = [];
    this.fline_ = null;
};

CTable.prototype.setHead = function(ahead) {
    this.ahead_ = ahead;
    return this;
}

CTable.prototype.setColumn = function(acolumn, fline) {
    this.acolum_ = acolumn;
    this.fline_ = fline;
    return this;
}

CTable.prototype.render = function(adataSet, fcallback) {
    var ahead = null,
        acolumn = null,
        atable = null,
        fline = null,
        shtml = "",
        shead = "",
        sbody = "";

    ahead = this.ahead_;
    acolumn = this.acolum_;
    atable = adataSet;
    fline = this.fline_;

    if (!ahead)
    {
        for (var i = 0; i < acolumn.length; i++)
        {
            if (typeof(acolumn[i]) == "string")
            {
                ahead[i] = acolumn[i];
            }
            else if (typeof(acolumn[i]) == "object")
            {
                ahead[i] = acolumn[i].key;
            }
        }
    }

    shtml = "<table cellspacing='0' cellpadding='0'>";
    
    shead = "<tr>";
    for (var i = 0; i < ahead.length; i++)
    {
        shead += "<th>" + ahead[i] + "</th>";
    }
    shead += "</tr>";
    shtml += shead;

    sbody = "";
    for (var i = 0; i < atable.length; i++)
    {
        if (fline)
            sbody += "<tr class='" + fline(i, atable) + "'>";
        else if (i % 2 == 0)
            sbody += "<tr class='table-even'>";
        else
            sbody += "<tr class='table-odd'>";
        
        for (var j = 0; j < acolumn.length; j++)
        {
            var param;
            if (typeof(acolumn[j]) == "string" && acolumn[j] != "")
            {
                param = acolumn[j];
                var val = atable[i][param];
                val = (val === "" ? "-" : T.escapeHtml(val));
                sbody += "<td>" + val + "</td>";
            }
            else if (T.isFunction(acolumn[j]))
            {
                sbody += "<td>" + acolumn[j](i, atable) + "</td>";
            }
            else if (T.isObject(acolumn[j]))
            {
                param = acolumn[j].key;

                if (acolumn[j].enableHtml)
                    sbody += "<td>" + atable[i][param] + "</td>";
                
                else if (acolumn[j].format)
                {
                    if (param == undefined)
                        sbody += "<td>" + acolumn[j].format(i, atable) + "</td>";
                    else
                        sbody += "<td>" + acolumn[j].format(atable[i][param], i, atable) + "</td>";
                }
                else if (acolumn[j].mformat)
                {
                    // oret {span:"", total:0, cur:0, val:""}
                    var oret = acolumn[j].mformat(atable[i][param], i, atable);
                    if (oret.firstFlag)
                        sbody += "<td " + oret.span + "span=\"" + oret.total + "\">" + oret.val + "</td>";
                }
                else
                    sbody += "<td>-</td>";
            }
            else
                sbody += "<td>-</td>";
        }
        sbody += "</tr>";
    }
    shtml += sbody;
    shtml += "</table>";

    if (fcallback)
        fcallback(sbody, shtml);
    else
        return shtml;
}

var CPage = function(istart, isize) {
    this.istart_ = istart || 0;
    this.isize_ = isize || g.isize;
}

CPage.prototype.render = function(odataSet, fcallback) {
    var isize = this.isize_;
    var scount = odataSet.filternum || odataSet.total;
    var sstart = odataSet.start || this.istart_;
    var icount = isNaN(parseInt(scount)) ? odataSet.rows.length : parseInt(scount);
    var istart = isNaN(parseInt(sstart)) ? 0 : parseInt(sstart);

    var ipageMax = 0;
    if (icount > 0)
        ipageMax = parseInt((icount - 1) / isize);
    var ipageNow = parseInt(istart / isize);
    var shtml = "<span class='refresh'><i class='icon-refresh' title='刷新'></i></span>&nbsp;&nbsp;"
            + "<span class='size'>"
            + "<select class='change-size'>";
    for (var i=0; i<name_space.pageSizeArr.length; ++i) {
    	shtml += "<option value='" + name_space.pageSizeArr[i] + "'>" + name_space.pageSizeArr[i] + "</option>";
    }
    shtml += "</select>" + "&nbsp;条/页</span>&nbsp;&nbsp;";
    var apageId = [];
    var sid;
    shtml += "<span>共" + icount + "条</span>";
    if (ipageMax > 0)
    {
        shtml += ",<span>第" + (ipageNow + 1) + "/" + (ipageMax + 1) + "页</span>";
        sid = name_space.idpref.page + "0";
        shtml += '<span><a href="javascript:;" class="' + sid + '">首页</a></span>';
        apageId.push(sid);
        if (ipageNow >= 1)
        {
            sid = name_space.idpref.page + (ipageNow - 1);
            shtml += '<span><a href="javascript:;" class="' + sid + '">上一页</a></span>';
            apageId.push(sid);
        }
        if (ipageNow <= (ipageMax - 1))
        {
            sid = name_space.idpref.page + (ipageNow + 1);
            shtml += '<span><a href="javascript:;" class="' + sid + '">下一页</a></span>';
            apageId.push(sid);
        }
        sid = name_space.idpref.page + ipageMax;
        shtml += '<span><a href="javascript:;" class="' + sid + '">末页</a></span>';
        apageId.push(sid);
    }
    fcallback(shtml, apageId);
}

function GetSelectItem(scgipath, orequestSet, sparam, sid, fcall) {
    Query(scgipath, orequestSet, function(data) {
    	if (T.isFunction(sparam))
    	{
    		sparam(data);
    		return;
    	}
        var oselect = {}, aselect = [];
        T.eachArray(data.rows, function(oset) {
            var val = oset[sparam];
            var icount = oselect[val];
            oselect[val] = icount ? ++icount : 1;
        });
        T.eachObject(oselect, function(key) {
            aselect.push(key);
        });
        T.initSelectItem(T.id(sid), aselect);
        if (fcall)
            fcall(aselect);
        //aselect.length = 0;
    });
}

function ShowIndex(i) {
    var num = g.istart + i + 1;
    return "<input type='checkbox' id='rowdisp_" + i + "'/></td><td><span>"
        + num + "</span>";
}

function ShowOperate(i) {
    return "<a href='javascript:;' class='icon-edit' id='" + name_space.idpref.editbtn + i + "' title='编辑'></a> "
        + "<a href='javascript:;' class='icon-remove' id='" + name_space.idpref.delbtn + i + "' title='删除'></a>";
}

function GetCurrentCookies() {
    return document.cookie;
}

function SetCookie(key, value) {
    var expiration = new Date((new Date()).getTime() + 24 * 60 * 60000 * 30);
    document.cookie = key+"=" + value + "; expires =" + expiration.toGMTString() + "; path=/";
}

function DelCookie(key) {
    document.cookie = key + "=;"
}

function GetCookie(cookie_name) {
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);
    if (cookie_pos != -1)
    {
        cookie_pos += cookie_name.length + 1;
        var cookie_end = allcookies.indexOf(";", cookie_pos);
        if (cookie_end == -1)
        {
            cookie_end = allcookies.length;
        }
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
    }
    return value;
}

function RebootAc(smsg) {
    var action = confirm(smsg);
    if (action == true)
    {
        var url = "/cgi-bin/reboot.cgi?/=" + Math.random();
        $.get(url, function(data, status) {
            if (CheckCgiReturn(data))
            {
                PopCheckError("正在重启，稍后请手动刷新页面。");
            }
            else
            {
                PopCheckError("重启失败。");
            }
        });
    }
}

function GetSelectInnerText(sid, sval) {
    var dom = T.id(sid);
    var i = T.findSelectValue(dom, sval);
    if (i != -1)
        return T.getInnerText(dom.options[i]);
    else
        return "-";
}
var ADD = 1,
    DELETE = 2,
    EDIT = 3,
    QUERY = 4,
    OP_5 = 5,
    OP_6 = 6,
    OP_7 = 7;

var g = {scgi: "", oconfig: null, iselect:0, aselect:[], isize:10, istart:0, adata:[], astore:{}};
// 如果cookie有值，获取
var cookie_size = GetCookie(name_space.cookie.size);
if (cookie_size != undefined) {
	for (var i=0; i<name_space.pageSizeArr.length; ++i) {
		if (cookie_size == name_space.pageSizeArr[i])
			g.isize = cookie_size;
	}
}

var CFrame = function(scgi) {
    this.scgi_ = scgi;//k-m
    this.tableId_ = "table_data";
    this.vprimaryConfSet_ = "id"; //k-a
    this.oconfig_ = null;
    this.oconfigSet_ = null;

    this.iselect_ = 0;
    this.aselect_ = [];
    this.isize_ = g.isize;
    this.icount_ = 0;
    this.istart_ = 0;
    this.ipage_ = 0;
    this.adata_ = [];
    this.otableColumn_ = null;
    
    this.primaryKey = "id";

    this.oparam_ = {};
    this.op_ = QUERY;

    var otableEvent = {};
    otableEvent[name_space.idpref.editbtn] = this.Edit;
    otableEvent[name_space.idpref.delbtn] = this.Delete;

    this.otableEvent_ = otableEvent;
    this.otableEvents_ = null;
    
    this.aonceAction_ = [];

    this.atableInitProcess_ = [];

    this.fprocessShowEdit_ = null;
    this.fprocessShowAdd_ = null;
    this.fprocessSumbit_ = null;

    this.finitData_ = null;

    var self = this;
    T.addEvent(T.id("Tadd"), "click", function() {
        self.Add();
    })

    T.addEvent(T.id("Tdeletes"), "click", function() {
        self.newBatchAction("删除", self.primaryKey);
    })

    $(".tsort").click(function() {
        var shtml = $(this).html().replace(/ .*$/, "");
        var sclass = $(this).attr("class");
        var skey;
        $.each(sclass.split(" "), function(i, val) {
            if (/tsort_/.test(val))
            {
                skey = val.replace(/tsort_/, "");
                return false;
            }
        })
        if (!/sortup/.test(sclass))
        {
            self.showPage(self.ipage_, {sort:{_sort:1, _sortkey:skey}});
            $(".tsort").removeClass("sortup").removeClass("sortdown");
            $(this).addClass("sortup");
        }
        else
        {
            self.showPage(self.ipage_, {sort:{_sort:2, _sortkey:skey}});
            $(".tsort").removeClass("sortup").removeClass("sortdown");
            $(this).addClass("sortdown");
        }
    })

    this.odatabase_ = {};
}

CFrame.prototype.setPrimaryKey = function(primaryKey) {
	this.primaryKey = primaryKey;
	return this;
}

CFrame.prototype.setTableId = function(stableId) {
    this.tableId_ = stableId;
    return this;
}

CFrame.prototype.setOp = function(op) {
    this.op_ = op;
    return this;
}

CFrame.prototype.setPrimaryConfigItem = function(oconfig) {
    this.vprimaryConfSet_ = oconfig;
    return this;
}

CFrame.prototype.setConfigItem = function(oconfig) {
    this.oconfig_ = oconfig;
    this.oconfigSet_ = BuildConfigSet(oconfig);
    return this;
}

CFrame.prototype.setTableColumn = function(acolumn, fline) {
    this.otableColumn_ = {acolumn:acolumn, fline:fline};
    return this;
}

CFrame.prototype.setProcessShowEdit = function(fcall) {
    this.fprocessShowEdit_ = fcall;
    return this;
}

CFrame.prototype.setProcessShowAdd = function(fcall) {
    this.fprocessShowAdd_ = fcall;
    return this;
}

CFrame.prototype.setProcessSubmit = function(fcall) {
    this.fprocessSumbit_ = fcall;
    return this;
}

CFrame.prototype.setTableEvent = function(otableEvent) {
    this.otableEvent_ = otableEvent;
    return this;
}

CFrame.prototype.addTableEvent = function(otableEvent) {
    this.otableEvent_ = $.extend({}, this.otableEvent_, otableEvent);
    return this;
}

CFrame.prototype.setTableEvents = function(otableEvents) {
    this.otableEvents_ = otableEvents;
    return this;
}

CFrame.prototype.addTableInitProcess = function(fcall) {
    this.atableInitProcess_.push(fcall);
    return this;
}

CFrame.prototype.addOnceAction = function(fcall) {
    this.aonceAction_.push(fcall);
    return this;
}

CFrame.prototype.setInitDataProcess = function(fcall) {
    this.finitData_ = fcall;
    return this;
}

CFrame.prototype.Ade = function(orequestSet, fcallback) {
    var self = this;
    var scgi = self.scgi_;
    Query(scgi, orequestSet, function(data) {
    	$("input[id^='_ButtonOK_']").data("click",0);
        //PopCheckError("配置成功。");
        if (fcallback && T.isFunction(fcallback))
            fcallback(data);
        else
            self.showPage(self.ipage_);
    }, function(data) {
    	$("input[id^='_ButtonOK_']").data("click",0);
    	PopCheckError("配置失败: " + data.errmsg);
    });
}

CFrame.prototype.getKeys = function(key, delimiter) {
	var key = arguments[0] ? arguments[0] : "id";
	var delimiter = arguments[1] ? arguments[1] : ",";	
	
    var self = this;
    if (self.aselect_.length == 0)
    {
        PopCheckError("请选择需要批量操作的项。");
        return null;
    }else {
    	var ret = "";
    	for (var i=0; i<self.aselect_.length; ++i) {
    		ret += self.adata_[self.aselect_[i]][key];
    		if (i != self.aselect_.length - 1)
    			ret += delimiter;
    	}
    	return ret;
    }
}

CFrame.prototype.newBatchAction = function(sop, key) {
    var self = this;
    if (self.aselect_.length == 0)
    {
        PopCheckError("请选择需要批量操作的项。");
        return;
    }
    else if(window.confirm("确认要删除吗？")){
    	var icount = self.aselect_.length;
    	var url = self.scgi_;

	    var firstChar = "?";
	    if (url.indexOf(".html?") > 0)
	    	firstChar = "&";
	    for (var i=0; i<icount; i++) {
	    	url += ((0==i)?firstChar:"&") + self.primaryKey + "=" + self.adata_[self.aselect_[i]][key];
	    }
    
	    Query(url, {_op:DELETE}, function(data) {
	    	if (data.errmsg && data.errmsg != "")
	    		PopCheckError(data.errmsg);
	    	else
	    		PopCheckError("批量" + sop + "成功。");
	    	self.showPage(self.ipage_);
	    }, function(data) {
	    	PopCheckError("配置失败: " + data.errmsg);
	    });
    }
}

CFrame.prototype.batchAction = function(sop, fcall) {
    var self = this;
    if (self.aselect_.length == 0)
    {
        PopCheckError("请选择需要批量操作的项。");
        return;
    }
    var dcontent = T.CDialog({title:"批量" + sop, scontent:""});
    var icount = self.aselect_.length;
    BatchAction.call(self, 0, function(i, fcallback) {
        $(dcontent).html("正在" + sop + "第" + (i + 1) + "个，总共" + icount + "个...");
        fcall.call(self, self.aselect_[i], fcallback);
    }, function() {
        $(dcontent).html(sop + icount + "个成功。");
        self.aselect_.length = 0;
        T.id("Tselect-all").checked = false;
        self.showPage();
    }, self.aselect_);
}

CFrame.prototype.setEvent = function(sid, fcall) {
    var self = this;
    T.addEvent(T.id(sid), "click", function(e) {
        fcall.call(self, e);
    });
    return this;
}

CFrame.prototype.Edit = function(i) {
    var self = this;
    var diag = CreateDialog("strategy_box", "编辑策略");
    var oconfigSet = $.extend(true, {}, self.oconfigSet_);
    
    SetConfigValue(oconfigSet, self.adata_[i]);
    
    g_demo.resetForm();
    $('.Validform_checktip').text('');

    diag.OKEvent = function() {
        //防止用户频繁点击提交
        //$("input[id^='_ButtonOK_']").attr("disabled",true);
        //setTimeout(function(){$("input[id^='_ButtonOK_']").removeAttr("disabled");},1000);
        if($("input[id^='_ButtonOK_']").data("click")){
        	return;
        }
        //SetOldValue(oconfigSet, self.adata_[i]);
        GetConfigValue(oconfigSet);
        
        if (!CheckValid(oconfigSet))
            return;
        if (self.fprocessSumbit_)
            self.fprocessSumbit_(oconfigSet);
        var oparam = {};
        var bchangeFlag = false;
        T.eachObject(oconfigSet, function(key, odata) {
            if (odata.able)
            {
                oparam[key] = odata.val;
                if (odata.val != odata.oldVal)
                    bchangeFlag = true;
            }
        });

        if (!bchangeFlag)
        {
            PopCheckError("您没有修改配置");
            return;
        }

        oparam._op = EDIT;

        /**
         * k-a 索引字段
         */
        if (typeof self.primaryKey === "string")
        {
            oparam[self.primaryKey] = self.adata_[i][self.primaryKey];
        }
        else if (T.isArray(self.primaryKey))
        {
            for (var j = 0; j < self.primaryKey.length; j++)
            {
                oparam[self.primaryKey[j]] = self.adata_[i][self.primaryKey[j]];
            }
        }

        $("input[id^='_ButtonOK_']").data("click",1);
        //alert($("input[id^='_ButtonOK_']").data("click"));
        self.Ade(oparam, function(data) {
            diag.close();
            self.showPage(self.ipage_);
        });
    }

    diag.CancelEvent = function() {
        diag.close();
    }

    SetToDisable(T.id("name"));
    if (self.fprocessShowEdit_)
        self.fprocessShowEdit_(oconfigSet, i);
    diag.show();
    if (T.id("key_name"))
        T.id("key_name").focus();
    $("#strategy_box select.selectpicker").select2();
}

CFrame.prototype.Delete =function(i,fcallback){
	if(window.confirm("确认要删除吗？")){
		 var self = this;
		    var oparam = {};
		    T.eachObject(self.oconfig_, function(key) {
		        oparam[key] = self.adata_[i][key];
		    });
		   
		    oparam._op = DELETE;
		    /**
		     * k-a 索引字段
		     */
		    if (typeof self.primaryKey === "string")
		    {
		        oparam[self.primaryKey] = self.adata_[i][self.primaryKey];
		    }
		    else if (T.isArray(self.primaryKey))
		    {
		        for (var j = 0; j < self.primaryKey.length; j++)
		        {
		            oparam[self.primaryKey[j]] = self.adata_[i][self.primaryKey[j]];
		        }
		    }
		    self.Ade(oparam, fcallback);
	}
}

CFrame.prototype.Add = function() {
    //防止用户频繁点击提交
    //$("input[id^='_ButtonOK_']").attr("disabled",true);
    //setTimeout(function(){$("input[id^='_ButtonOK_']").removeAttr("disabled");},1000);
    if($("input[id^='_ButtonOK_']").data("click")){
    	return;
    }
    var self = this;
    var diag = CreateDialog("strategy_box", "添加策略");
    var oconfigSet = $.extend(true, {}, self.oconfigSet_);
    
    InitBox(oconfigSet);
    
    g_demo.resetForm();
    $('.Validform_checktip').text('');
    
    diag.OKEvent = function() {
        GetConfigValue(oconfigSet);
        if (window.CheckValid != null && !CheckValid(oconfigSet))
            return;
        if (self.fprocessSumbit_)
           self.fprocessSumbit_(oconfigSet);
        var oparam = {};
        T.eachObject(oconfigSet, function(key, val) {
            if (val.able)
                oparam[key] = val.val;
        });

        oparam._op = ADD;
        $("input[id^='_ButtonOK_']").data("click",1);
        //alert($("input[id^='_ButtonOK_']").data("click"));
        self.Ade(oparam, function(data) {
            diag.close();
            self.showPage(self.ipage_);
        })
    }


    diag.CancelEvent = function() {
        diag.close();        
    }

    SetToEnable(T.id("name"));
    if (self.fprocessShowAdd_)
        self.fprocessShowAdd_(oconfigSet);
    diag.show();
    if (T.id("key_name"))
        T.id("key_name").focus();
    $("#strategy_box select.selectpicker").select2();
}

CFrame.prototype.AddByParams = function(oconfigSet_) {
    var self = this;
    var diag = CreateDialog("strategy_box", "添加策略");
    var oconfigSet = $.extend(true, {}, oconfigSet_);
    
    InitBox(oconfigSet);

    diag.OKEvent = function() {
        GetConfigValue(oconfigSet);
        if (window.CheckValid != null && !CheckValid(oconfigSet))
            return;
        if (self.fprocessSumbit_)
            self.fprocessSumbit_(oconfigSet);
        var oparam = {};
        T.eachObject(oconfigSet, function(key, val) {
            if (val.able)
                oparam[key] = val.val;
        });

        oparam._op = ADD;
        self.Ade(oparam, function(data) {
            diag.close();
            self.showPage(self.ipage_);
        })
    }


    diag.CancelEvent = function() {
        diag.close();
    }

    SetToEnable(T.id("name"));
    if (self.fprocessShowAdd_)
        self.fprocessShowAdd_(oconfigSet);
    diag.show();
    if (T.id("key_name"))
        T.id("key_name").focus();
    $("#strategy_box select.selectpicker").select2();
}

/**
 * [showPage description]
 * @param  {[type]} index  [description]
 * @param  {[type]} oextra [{filer:{}, sort:{}}]
 * @return {[type]}        [description]
 */
CFrame.prototype.showPage = function(index, oextra) {
    var isize = this.isize_;
    var ipage = (!isNaN(index) && index > 0 ? index : 0);
    var istart = ipage * isize;
    this.ipage_ = ipage;

    var self = this;
    var oparam = null;
    if (oextra && T.isObject(oextra))
    {
        if (oextra.filter)
            this.oparam_.filter = oextra.filter;
        if (oextra.sort)
            this.oparam_.sort = oextra.sort;
    }

    oparam = $.extend({}, this.oparam_.filter, this.oparam_.sort);

    oparam._op = self.op_;
    oparam._start = istart;
    oparam._size = isize;

    Query(self.scgi_, oparam, function(data) {
        //self.istart_ = isNaN(parseInt(data.start)) ? 0 : parseInt(data.start);
    	self.istart_ = istart;
        g.istart = self.istart_;//global var

        self.adata_ = data.rows;
        self.icount_ = (data.rows == null ? 0 : data.rows.length);

        if (self.finitData_)
            self.finitData_.call(self);

        var otableFrame = new CTable();
        if (self.otableColumn_)
            otableFrame.setColumn(self.otableColumn_.acolumn, self.otableColumn_.fline);
        else
            otableFrame.setHead(self.oconfig_);
        otableFrame.render(data.rows, function(sbody) {
            $("#" + self.tableId_).html(sbody);
            T.eachObject(self.otableEvent_, function(key, fcall) {
                T.eachArray(data.rows, function(val, i) {
                    T.addEvent(T.id(key + i), "click", function(e) {
                        //var eve = window.event || e;
                        fcall.call(self, i, e);
                    });
                });
            });

            T.eachObject(self.otableEvents_, function(key, fcall) {
                T.eachArray(data.rows, function(val, i) {
                    var adom = T.c2ds(key + i, T.id(self.tableId_), "a");
                    T.eachArray(adom, function(dom, j) {
                        T.addEvent(dom, "click", function(e) {
                            //var eve = window.event || e;
                            fcall.call(self, i, j, e);
                        });
                    });
                });
            });

            T.addEvent(T.id("Tselect-all"), "click", function(e) {
                var dom = T.id("Tselect-all");
                if (dom.checked)
                {
                    self.aselect_.length = 0;
                    for (var i = 0; i < self.icount_; i++)
                    {
                    	if(T.id("rowdisp_" + i)!=null){
                    		T.id("rowdisp_" + i).checked = true;
                    		self.aselect_.push(i);
                    	}
                    }
                }
                else
                {
                    for (var i = 0; i < self.icount_; i++)
                    {
                    	if(T.id("rowdisp_" + i)!=null)
                        T.id("rowdisp_" + i).checked = false;
                    }
                    self.aselect_.length = 0;
                }
            });

            for (var i = 0; i < self.icount_; i++)
            {
                T.addEvent(T.id("rowdisp_" + i), "click", function(e) {
                    var dom = T.eventTarget(e);
                    var index = parseInt(dom.id.replace("rowdisp_", ""));
                    if (dom.checked)
                    {
                        if ($.inArray(index, self.aselect_) == -1)
                        {
                            self.aselect_.push(index);
                        }
                    }
                    else
                    {
                        var pos = $.inArray(index, self.aselect_);
                        if (pos != -1)
                        {
                            self.aselect_.splice(pos, 1);
                        }
                    }
                    if (self.aselect_.length == self.icount_)
                        T.id("Tselect-all").checked = true;
                    else
                        T.id("Tselect-all").checked = false;
                });
            }
            //翻页时清空选择
            self.aselect_.length = 0;
            if (T.id("Tselect-all"))
            	T.id("Tselect-all").checked = false;
        });

        var opageFrame = new CPage(istart, isize);
        opageFrame.render(data, function(sdiv, apageClass) {
        	$("#"+ self.tableId_).next().find(".page_navi").html(sdiv);
            //$(".page_navi").html(sdiv);
            T.eachArray(apageClass, function(sclass) {
                /*
                T.addEvent(T.id(sid), "click", function() {
                    var ipage = parseInt(sid.replace(name_space.idpref.page, ""));
                    self.showPage(ipage);
                });
                */
            	$("#"+ self.tableId_).next().find(".page_navi ." + sclass).click(function() {
                    var ipage = parseInt(sclass.replace(name_space.idpref.page, ""));
                    self.showPage(ipage);
                });
            });
            $("#"+ self.tableId_).next().find(".refresh").click(function() {
                self.showPage(ipage);
            });

            $("#"+ self.tableId_).next().find(".change-size").change(function() {
                self.isize_ = parseInt($(this).val());
                self.showPage();
                //保存到cookie
                SetCookie(name_space.cookie.size, self.isize_);
            });
            $("#"+ self.tableId_).next().find(".change-size").val(self.isize_);
        });


        T.eachArray(self.atableInitProcess_, function(fcall) {
            fcall.call(self);
        })

        if (self.aonceAction_ != null)
        {
            T.eachArray(self.aonceAction_, function(fcall) {
                fcall.call(self);
            });
            self.aonceAction_ = null;
        }
    },function(data){
    	PopCheckError(data.errmsg);
    });
    return this;
}

function Duration2Array(second) {
    var isecond = parseInt(second, "10");
    var a = [];
    if (!isNaN(isecond))
    {
        var day, hour, min = 0;
        day = parseInt(isecond / 3600 / 24, "10");
        hour = parseInt((isecond - day * 24 * 3600) / 3600, "10");
        min = parseInt((isecond - day * 24 * 3600 - hour * 3600) / 60, "10");  
        a[0] = day;
        a[1] = hour;
        a[2] = min;
        return a;
    }
    else
        return null;
}

function Array2Duration(atime) {
    var atmp = [];
    for (var i = 0; i < atime.length; i++)
    {
        var itmp = parseInt(atime[i], "10");
        atmp[i] = isNaN(itmp) ? 0 : itmp;
    }
    return atmp[0] * 24 * 3600 + atmp[1] * 3600 + atmp[2] * 60;
}

function Time2LocalFormat(second) {
    var time = new Date();
    time.setTime(parseInt(second, "10") * 1000);
    var year, month, date, hours, minutes, seconds;
    var intMonths,intDates,intHours, intMinutes, intSeconds;
    year = time.getFullYear();
    intMonths = time.getMonth() + 1;
    intDates = time.getDate();
    intHours = time.getHours();
    intMinutes = time.getMinutes();
    intSeconds = time.getSeconds();
    var time;
    if (intMonths < 10)
        month = "0" + intMonths;
    else
    	month = intMonths;
    if (intDates < 10)
    	date = "0" + intDates;
    else
    	date = intDates;
    if (intHours == 0)
        hours = "00:";
    else if (intHours < 10)
        hours = "0" + intHours + ":";
    else
        hours = intHours + ":";
    if (intMinutes < 10)
        minutes = "0" + intMinutes + ":";
    else
        minutes = intMinutes + ":";
    if (intSeconds < 10)
        seconds = "0" + intSeconds;
    else
        seconds = intSeconds;
    return year + "-" + month + "-" + date + " " + hours + minutes + seconds;
}

function LocalFormat2Time(stime) {
    if (time == "")
        return;
    else
    {
        var time = new Date();
        var adateTime = stime.split(".");

        var adate = adateTime[0].split("-");
        var atime = adateTime[1].split(":");
    
        time.setFullYear(parseInt(adate[0], "10"));
        time.setMonth(parseInt(adate[1],"10") - 1,1);        
        time.setDate(parseInt(adate[2], "10"));
        
        var hour, min, sec = 0;
        
        hour = parseInt(atime[0], "10");
        min = parseInt(atime[1], "10");
        sec = parseInt(atime[2], "10");
    
        time.setHours(hour);
        time.setMinutes(min);
        time.setSeconds(sec);
        
        time.setMilliseconds(0);

        return time.getTime() / 1000;
    }
}

function GenerateMixed(n) {
     var res = "";
     var chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
     for (var i = 0; i < n ; i ++)
     {
         var id = Math.ceil(Math.random() * 35);
         res += chars[id];
     }
     return res;
}

function N2Ds(sname) {
    return document.getElementsByName(sname);
}

function SelectOptionInit(dst_id, src_id) {
    $("#"+src_id+" option").each(function(){
        T.addSelectItem(T.id(dst_id), $(this).text(), $(this).val());
    });
}

function var_dump(obj) {
    if(typeof obj == "object") {
        var txt = '';
        for(key in obj)
        {
            txt +=key + '=' + obj[key] + ',';
        }
        return "Type: "+typeof(obj)+((obj.constructor) ? "\nConstructor: "+obj.constructor : "")+"\nValue: " + txt;
    } else {
        return "Type: "+typeof(obj)+"\nValue: "+obj;
    }
}

function ajaxFileUpload(url, fileElementId, moreData, func, funcErr) {
    $.ajaxFileUpload({
        url:url, 
        secureuri:false,
        fileElementId:fileElementId,
        dataType: 'json',
        data:moreData,
        success: function (data, status)
        {
            $("#loading").hide(0);
            if (CheckCgiReturn(data))
            {
                func(data, status);
            }else{
                funcErr(data, status);
            }
        },
        error: function (data, status, e)
        {
            $("#loading").hide(0);
            alert("An error occurred with the request");
        }
    });
    
    return false;
}

function showMessage(message) {
    seajs.use(['arale-dialog'], function(Dialog) {
        new Dialog({
        content: message
        }).show();
    });
}