function addloadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
};

$(document).scroll(function () {                    //每次窗口宽度改变则调用
    //此处应该加上事件节流
    autoHide();
});

function autoHide() {
    var backTop = $('#backTop');
    var topa = backTop.offset().top;
    // console.log(topa);
    if (topa >= 800)
    { backTop.fadeIn(); }
    else
    { backTop.fadeOut(); }
}


function pageScroll(){
    var currentPosition;
    if (document.documentElement && document.documentElement.scrollTop) {
        currentPosition = -(document.documentElement.scrollTop);
    }
    else if (document.body) {
        currentPosition = -(document.body.scrollTop);/*某些情况下Chrome不认document.documentElement.scrollTop则对于Chrome的处理。*/
    }
    window.scrollBy(0,Math.floor(currentPosition/5));
    //延时递归调用，模拟滚动向上效果
    scrolldelay = setTimeout('pageScroll()',10);
    //获取scrollTop值，声明了DTD的标准网页取document.documentElement.scrollTop，否则取document.body.scrollTop；因为二者只有一个会生效，另一个就恒为0，所以取和值可以得到网页的真正的scrollTop值
    var sTop=document.documentElement.scrollTop+document.body.scrollTop;
    //判断当页面到达顶部，取消延时代码（否则页面滚动到顶部会无法再向下正常浏览页面）
    if(sTop==0) clearTimeout(scrolldelay);
}

//出处：http://www.cnblogs.com/babycool/ 用于判断是否是移动设备。然后跳转到对应的页面。
function browserRedirect(phoneToHref,pcToHref) {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    //document.writeln("您的浏览设备为：");
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        //是移动设备则跳转
        window.location.href = phoneToHref;
    } else {
        //不是移动设备则跳转
        window.location.href = pcToHref;
    }
}

//通用事件注册函数
function addEvent(obj,type,func){
    if(obj.addEventListener){
        obj.addEventListener(type,func,false);
    }else if(obj.attachEvent){
        obj.attachEvent('on' + type, func);
    }else{
        obj["on" + type] = func;
    }
}