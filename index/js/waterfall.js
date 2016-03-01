

// $(window).resize(scrollWaterfall());
$(window).resize(function(){
    scrollWaterfall();
});

//模拟的数据。应该改为ajax后天取数据。
var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'}]};

$(window).scroll(function(){
    if(checkscrollside()){
        var oParent = document.getElementById('wraper');// 父级对象
        for(var i=0,len=dataInt.data.length;i<len;i++){
            var oPin=document.createElement('div'); //添加 元素节点
            oPin.className='resultDisplay';                   //添加 类名 name属性
            oParent.appendChild(oPin);              //添加 子节点
            var oBox=document.createElement('a');
            oBox.className='thumbnail';
            oBox.href="#";
            oPin.appendChild(oBox);
            var oImg=document.createElement('img');
            oImg.src='../img/jpg/'+dataInt.data[i].src;
            oBox.appendChild(oImg);
        }
        waterfall('wraper','.resultDisplay',cacheObj.getCache());
    }
});
//手机屏幕翻转也需要重新调整一下
window.onorientationchange = function(){
    waterfall('wraper','.resultDisplay',2);
}

function test(){
    var b = document.getElementById('backTop');
    var n = document.createElement('a');
    n.href="#";
    b.appendChild(n);
}

function cacheN(){
	var cache;
	return {
		setCache:function(num){
			cache = num;
		},
		getCache:function(){
			return cache;
		}
	}
}

//这个全局变量最好换成局部变量
var cacheObj = cacheN();

//这里也做个事件节流
function scrollWaterfall(){
	var num,cWidth = document.getElementById('container').clientWidth;
	num = getNum(cWidth);
	// 缓存num的值，不同则调用
    if(num === 2){
        cacheObj.setCache(num);
        waterfall('wraper','.resultDisplay',num);
    }
	if(cacheObj.getCache() != num && num !== 2){
		cacheObj.setCache(num);
		waterfall('wraper','.resultDisplay',num);
	}	
}

function getNum(cWidth){
	if(cWidth >= 1170){
		return 5;
	}else if(cWidth >= 970 && cWidth < 1169){
		return 4;
	}else if(cWidth >= 750 && cWidth < 969){
		return 3;
	}else{
		return 2;
	}
}

// waterfall('wraper','.resultDisplay',num);//第三个num是一排可以放多少个块
function waterfall(parent,child,num){//
    var oParent=document.getElementById(parent);// 父级对象
    var aPin=document.querySelectorAll(child);// 获取存储块框pin的数组aPin,这里是resultDisplay
    var iPinW=aPin[0].offsetWidth;// 一个块框pin的宽
    var pinHArr=[];//用于存储 每列中的所有块框相加的高度。
    for(var i=0,len=aPin.length;i<len;i++){//遍历数组aPin的每个块框元素
        var pinH=aPin[i].offsetHeight;
        if(i<num){
            pinHArr[i]=pinH; //第一行中的num个块框pin 先添加进数组pinHArr
            aPin[i].style.position='relative';
            aPin[i].style.top='0px';
            aPin[i].style.left='auto';
        }else{
            var minH=Math.min.apply(null,pinHArr);//数组pinHArr中的最小值minH
            var minHIndex=getminHIndex(pinHArr,minH);
            aPin[i].style.position='absolute';//设置绝对位移
            aPin[i].style.top=minH+'px';
            aPin[i].style.left=aPin[minHIndex].offsetLeft+'px';
            //数组 最小高元素的高 + 添加上的aPin[i]块框高
            pinHArr[minHIndex]+=aPin[i].offsetHeight;//更新添加了块框后的列高
        }
    }
}

function getminHIndex(arr,minH){
    for(var i in arr){
        if(arr[i]==minH){
            return i;
        }
    }
}

//
function checkscrollside(){
    var aPin=document.querySelectorAll(".resultDisplay");
    var lastPinH=aPin[aPin.length-1].offsetTop+Math.floor(aPin[aPin.length-1].offsetHeight/2);//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;//注意解决兼容性
    var documentH=document.documentElement.clientHeight;//页面高度
    if(scrollTop > 2000){
        return
    }
    return lastPinH<scrollTop+documentH;//到达指定高度后 返回true，触发waterfall()函数
}