<?php 
require_once './include.php';
checkLogined();
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<?php 
include 'tpl/header.tpl';
 ?>
<!-- <link rel="stylesheet" type="text/css" href="../lib/treeview/css/bootstrap-treeview.css"> -->
<link rel="stylesheet" type="text/css" href="../css/markdown-style.css">
<link rel="stylesheet" type="text/css" href="../css/backstage.css">
<title>后台管理</title>
<body>
<?php 
//通用导航条
include 'tpl/backstageNav.tpl';
 ?>
<div class="container-fluid">
 	<div class="row">
 		<div id="sidebar" class="col-md-3 sidebar">
			<ul class="nav nav-sidebar">
	            <li class="active"><a href="#_1">添加商品</a></li>
	            <li><a href="#_2">商品列表</a></li>
          	</ul>
          	<ul class="nav nav-sidebar">
	            <li><a href="#_3">添加分类</a></li>
	            <li><a href="#_4">分类列表</a></li>
          	</ul>
          	<ul class="nav nav-sidebar">
	            <li><a href="#_5">订单修改</a></li>
	            <li><a href="#_6">订单又修改</a></li>
          	</ul>
          	<ul class="nav nav-sidebar">
	            <li><a href="#_7">添加用户</a></li>
	            <li><a href="#_8">用户列表</a></li>
          	</ul>
          	<ul class="nav nav-sidebar">
	            <li><a href="#_9">添加管理员</a></li>
	            <li><a href="#_10">管理员列表</a></li>
          	</ul>
          	<ul class="nav nav-sidebar">
	            <li><a href="#_11">商品图片管理</a></li>
	            <li><a href="#_12">商品图片列表</a></li>
          	</ul>
 		</div>
 		<div class="col-md-9 col-md-offset-3 main">
 			<h1>这是后台管理页面</h1>
 			<article class="markdown-body"><h1 id="_1"><a name="user-content-_1" href="#_1" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>添加商品</h1>
<button id="addGoods" type="button" class="btn btn-primary btn-lg">
  添加商品
</button>
<h1 id="_2"><a name="user-content-_2" href="#_2" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>商品列表</h1>
<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
<h1 id="_3"><a name="user-content-_3" href="#_3" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>添加分类</h1>
<button id="addCate" type="button" class="btn btn-primary btn-lg">
  添加分类
</button>
<h1 id="_4"><a name="user-content-_4" href="#_4" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>分类列表</h1>
<div class="table-responsive">
    <table class="table table-bordered">
      <!-- <caption>Optional table caption.</caption> -->
      <thead>
        <tr>
          <th>编号</th>
          <th>分类</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody id="listCate">
       
      </tbody>
    </table>
    <nav style="text-align:center;">
        <ul id="listCatePag" class="pagination">

        </ul>
    </nav>
</div>
<h1 id="_5"><a name="user-content-_5" href="#_5" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>订单修改</h1>
<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
<h1 id="_6"><a name="user-content-_6" href="#_6" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>订单又修改</h1>
<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
<!-- <h1 id="_7"><a name="user-content-_7" href="#_7" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>添加用户</h1>
<button id="addUser" type="button" class="btn btn-primary btn-lg">
  添加用户
</button>
<h1 id="_8"><a name="user-content-_8" href="#_8" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>用户列表</h1>
<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p> -->
<h1 id="_9"><a name="user-content-_9" href="#_9" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>添加管理员</h1>

<!-- Button trigger modal -->
<button id="addAdmin" type="button" class="btn btn-primary btn-lg">
  添加管理员
</button>


<h1 id="_10"><a name="user-content-_10" href="#_10" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>管理员列表</h1>
<div class="table-responsive">
    <table class="table table-bordered">
      <!-- <caption>Optional table caption.</caption> -->
      <thead>
        <tr>
          <th>编号</th>
          <th>管理员名称</th>
          <th>管理员邮箱</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody id="listAdmin">
       
      </tbody>
    </table>
    <nav style="text-align:center;">
        <ul id="listAdminPag" class="pagination">

        </ul>
    </nav>
</div>

<h1 id="_11"><a name="user-content-_11" href="#_11" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>商品图片管理</h1>

<h1 id="_12"><a name="user-content-_12" href="#_12" class="headeranchor-link" aria-hidden="true"><span class="headeranchor"></span></a>商品图片列表</h1>
<div id="picList"></div>

<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h3 class="modal-title" id="myModalLabel">Modal title</h3>
      </div>
      <div class="modal-body">
        
      </div>
     <!--  <div class="modal-footer">
        <button id="modal-save" type="button" data-dismiss="modal" class="btn btn-primary">编辑</button>
      </div> -->
    </div>
  </div>
</div></article>
 		</div>
 	</div>
    
</div>
	
<?php 
include 'tpl/commonScript.tpl';
 ?>
<script type="text/jsx">
var Test = React.createClass({
    handleClick: function(e){
        $.ajax({
            url:"../doAjax.php",
            method:"get",
            data:"method=getListAdminInfo&begin=1&num=4",
            success:function(res){
                console.log(JSON.parse(res));
            },
            error:function(res){
                console.log(res);
            }
        });
    },

    render: function(){
        return (
            <button onClick={this.handleClick}>handleClick</button>
        );
    }
});
React.render(<Test source="../doAjax.php?method=getListAdminInfo&begin=1&num=4"/>,document.getElementById('picList'))
</script>
<script type="text/javascript">

var addAdminStr='<form id="form" action="./admin/doAdminAction.php?act=addAdmin" method="post"><table class="table table-bordered"><tr><td>管理员名称</td><td><input class="form-control" type="text" name="username" placeholder="请输入管理员名称"></td></tr><tr><td>管理员密码</td><td><input class="form-control" type="password" name="password"></td></tr><tr><td>管理员邮箱</td><td><input class="form-control" type="text" name="email" placeholder="请输入管理员邮箱"></td></tr><tr><td colspan="2"><input class="btn btn-default" type="submit" value="添加管理员"></td></tr></table>';
var addCateStr='<form action="./admin/doAdminAction.php?act=addCate" method="post"><table class="table table-bordered"><tr><td>分类名称</td><td><input type="text" name="cName" placeholder="请输入分类名称"></td></tr><tr><td colspan="2"><input class="btn btn-default" type="submit" value="添加分类"></td></tr></table></form>';
var addGoodsStr='<form action="./admin/doAdminAction.php?act=addPro" method="post" enctype="multipart/form-data"><table class="table table-bordered"><tr><td>商品名称</td><td><input type="text" name="pName"  placeholder="请输入商品名称"/></td></tr><tr><td>商品分类</td><td><select name="cId"><option value=""></option></select></td></tr><tr><td>商品货号</td><td><input type="text" name="pSn"  placeholder="请输入商品货号"/></td></tr><tr><td>商品数量</td><td><input type="text" name="pNum"  placeholder="请输入商品数量"/></td></tr><tr><td>商品市场价</td><td><input type="text" name="mPrice"  placeholder="请输入商品市场价"/></td></tr><tr><td>商品慕课价</td><td><input type="text" name="iPrice"  placeholder="请输入商品慕课价"/></td></tr><tr><td>商品描述</td><td><textarea name="pDesc" id="editor_id"></textarea></td></tr><tr><td>商品图像</td><td><a href="javascript:void(0)" id="selectFileBtn">添加附件</a><div id="attachList" class="clear"></div></td></tr><tr><td colspan="2"><input class="btn btn-default" type="submit" value="发布商品"/></td></tr></table></form>';


////////////////////////////////////////////////////////////////////////////////////
/**
 * [Pagination 分页按钮类]
 * @param {[type]} showPages      [description]
 * @param {[type]} showPagination [description]
 */
function Pagination(showPages,showPagination){
    this.showPages = showPages;
    this.showPagination = showPagination;
}

//最后应该把这些方法用对象封装起来放在统一的文件内，不同页面调用不同的方法
var CJ={
    admin:{
        Pagination:null
    }
};

CJ.admin.Pagination=showPagination;
/////////////////////////////////////////////////////////////////////////////////////



$(document).ready(function(){
	$("#sidebar").on('click',function(e){
		setActive(e.target.parentNode);
	});
    //常量，每页显示的条数
    PERPAGE = 4;

    //添加各个东西的按钮，弹出模态框
    $("#addAdmin").on('click',function(){
        createModal(addAdminStr,"添加管理员");
    });
    
    $("#addGoods").on('click',function(){
        createModal(addGoodsStr,"添加商品");
        $("#selectFileBtn").click(function(){
        $fileField = $('<input type="file" name="thumbs[]"/>');
        $fileField.hide();
        $("#attachList").append($fileField);
        $fileField.trigger("click");
        $fileField.change(function(){
            $path = $(this).val();
            $filename = $path.substring($path.lastIndexOf("\\")+1);
            $attachItem = $('<div class="attachItem"><div class="left">a.gif</div><div class="right"><a href="#" title="删除附件">删除</a></div></div>');
            $attachItem.find(".left").html($filename);
            $("#attachList").append($attachItem);       
            });
        });
        $("#attachList>.attachItem").find('a').live('click',function(obj,i){
            $(this).parents('.attachItem').prev('input').remove();
            $(this).parents('.attachItem').remove();
        });
    });
    
    $("#addCate").on('click',function(){
        createModal(addCateStr,"添加分类");
    });


    //添加列表封装函数的使用方法
    //管理员列表
    var cacheAdmin = new ListCache(1,PERPAGE);
    loadListAdmin(1,PERPAGE,cacheAdmin);
    $("#listAdminPag").on('click',function(e){
        paginationClick(e,cacheAdmin,loadListAdmin);
    });

    //分类列表
    var cacheCate = new ListCache(1,PERPAGE);
    loadListCate(1,PERPAGE,cacheCate);
    $("#listCatePag").on('click',function(e){
        paginationClick(e,cacheCate,loadListCate);
    });
});

/**
 * [ListAdminCache 缓存当前显示的开始处和每行条数]
 * @param {[int]} b [开始处]
 * @param {[int]} n [每页条数]
 * @param {[int]} l [总共条数]
 */
function ListCache(b,n,l){
    this.begin = b===undefined?1:b;
    this.num = n===undefined?5:n;
    this.idLen = l===undefined?-1:n;
    return {
        setBegin:function(b){
            this.adminBegin = b
        },
        getBegin:function(){
            return this.adminBegin;
        },
        setNum:function(n){
            this.adminNum = n;
        },
        getNum:function(){
            return this.adminNum;
        },
        getIdLen:function(){
            return this.idLen;
        },
        setIdLen:function(l){
            this.idLen = l;
        }
    }
}

/**
 * [loadListAdmin 展示管理员列表]
 * @param  {[int]} begin [从第几条记录开始，函数内部的begin应该减掉1，php是按index裁剪的]
 * @param  {[int]} num   [共读取几条记录]
 * @param  {[object]} cache   [缓存当前状态的对象]
 * @return {[type]}       [description]
 */
function loadListAdmin(begin,num,cache){
    begin = begin===undefined?1:begin;
    num = num===undefined?5:num;
    if(cache.getBegin() === begin){
        return false;
    };
    var perPage = num;
    cache.setBegin(begin);
    $.ajax({
        url:"../doAjax.php",
        type:'get',
        data:'method=getListAdminInfo&begin='+(begin-1)+'&num='+num,
        success:function(res){
            // 返回的是string
            var obj = JSON.parse(res);
            var pages = Math.ceil(obj.idLen/perPage);
            showListAdminTable(obj.info,"#listAdmin");
            showPagination(obj.idLen,"#listAdminPag",pages);
            showPages("#listAdminPag",pages);
            if(cache.getIdLen() !== obj.idLen){
                cache.setIdLen(obj.idLen);
            }
        },
        error:function(res){
            alert("获取管理员列表失败");
        }
    });
}

function paginationClick(e,cache,func){
    var targ = e.target;
    var cBegin = cache.getBegin();
    //如果是上一页
    if(targ.innerText == "«"){
        if(cBegin > PERPAGE){
            func.call(null,cBegin-PERPAGE,PERPAGE,cache);
        }else if(cBegin > 1){
            func.call(null,1,PERPAGE,cache);
        }else{
            //当前就是第一页或出错
            console.log("cBegin不应该小于等于1");
            return false;
        }
    }else if(targ.innerText == "»"){
        //如果是下一页
        if(cache.getBegin()+PERPAGE-1 >= cache.getIdLen()){
            console.log("不应该翻下一页了");
        }else{
            func.call(null,cBegin+PERPAGE,PERPAGE,cache);
        }
    }else if(targ.innerText > 0 && targ.innerText<=100){
        //是普通标签，1到100
        func.call(null,(parseInt(targ.innerText)-1)*PERPAGE+1,PERPAGE,cache);
    }else if(targ.innerText == "确定"){
        //如果是确定按钮
        var pageNum = document.querySelector('#listAdminPag input').value;
        func.call(null,(pageNum-1)*PERPAGE+1,PERPAGE,cache);
    }else{
        console.log("分页按钮部分有错");
    }
}

/**
 * [showPages 仅仅是显示共有多少页]
 * @param  {[type]} idLen [description]
 * @param  {[type]} dom   [description]
 * @param  {[type]} pages [description]
 * @return {[type]}       [description]
 */
function showPages(dom,pages){
    var domStr=dom+" li:last-child span"
    document.querySelector(domStr).innerHTML=pages>100?100:pages;
    return;
}

function showPagination(idLen,dom,pages){
    var domStr = '<li><a aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li><li><a aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li><li><div style="display:inline;">&nbsp&nbsp总共<span></span>页&nbsp&nbsp<input type="number" min="1" max="100" value="2">&nbsp&nbsp<button type="button" class="btn btn-primary">确定</button></div></li>';
    $(dom).html(domStr);
    var $f = $(dom+" li:first-child");
    if(pages<=10){
        for(var i = pages; i > 0; i--){
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.herf="#";
            a.innerHTML=i;
            li.appendChild(a);
            $f.after(li);
        }
    }else if(pages>10) {
        for(var i = 10; i > 0; i--){
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.herf="#";
            a.innerHTML=i;
            li.appendChild(a);
            $f.after(li);
        }
    }else{
        return false;
    };
    return true;
}
/**
 * [showListAdminTable 创建管理员表格]
 * @param  {[obj]} data [后台传来的数据]
 * @param  {[type]} dom  [插入那个标签下]
 * @return {[type]}      [description]
 */
function showListAdminTable(data,dom){
    var wrap = document.querySelector(dom);
    wrap.innerHTML = "";
    data.forEach(function(e){
        var fixBtn = document.createElement('input');
        fixBtn.type="button";
        fixBtn.value="修改";

        fixBtn.setAttribute('data-value',e.id);
        fixBtn.setAttribute('class','btn btn-default');
        addEvent(fixBtn,'click',editAdminFunc);

        var delBtn = document.createElement('input');
        delBtn.type="button";
        delBtn.value="删除";
        delBtn.setAttribute('data-value',e.id);
        delBtn.setAttribute('class','btn btn-default');
        addEvent(delBtn,'click',delAdminFunc);

        var tr = document.createElement('tr');
        var tdId = document.createElement('td');
        tdId.innerHTML=e.id;
        tr.appendChild(tdId);

        var tdName = document.createElement('td');
        tdName.innerHTML=e.username;
        tr.appendChild(tdName);

        var tdEmail = document.createElement('td');
        tdEmail.innerHTML=e.email;
        tr.appendChild(tdEmail);

        var tdCtl = document.createElement('td');
        tdCtl.align="center";
        tdCtl.appendChild(fixBtn);
        tdCtl.appendChild(delBtn);

        tr.appendChild(tdCtl);
        wrap.appendChild(tr);
    });
    return;
}


function loadListCate(begin,num,cache){
    begin = begin===undefined?1:begin;
    num = num===undefined?5:num;
    if(cache.getBegin() === begin){
        return false;
    };
    var perPage = num;
    cache.setBegin(begin);
    $.ajax({
        url:"../doAjax.php",
        type:'get',
        data:'method=getListCateInfo&begin='+(begin-1)+'&num='+num,
        success:function(res){
            var obj = JSON.parse(res);
            var pages = Math.ceil(obj.idLen/perPage);
            showListCateTable(obj.info,"#listCate");
            showPagination(obj.idLen,"#listCatePag",pages);
            showPages("#listCatePag",pages);
            if(cache.getIdLen() !== obj.idLen){
                cache.setIdLen(obj.idLen);
            }
        },
        error:function(res){
            alert("获取分类列表失败");
        }
    });
}

function showListCateTable(data,dom){
    var wrap = document.querySelector(dom);
    wrap.innerHTML = "";
    data.forEach(function(e){
        var fixBtn = document.createElement('input');
        fixBtn.type="button";
        fixBtn.value="修改";
        fixBtn.setAttribute('class','btn btn-default');
        addEvent(fixBtn,'click',editCateFunc);

        var delBtn = document.createElement('input');
        delBtn.type="button";
        delBtn.value="删除";
        delBtn.setAttribute('class','btn btn-default');
        addEvent(delBtn,'click',delCateFunc);

        var tr = document.createElement('tr');
        var tdId = document.createElement('td');
        tdId.innerHTML=e.id;
        tr.appendChild(tdId);

        var tdName = document.createElement('td');
        tdName.innerHTML=e.cName;
        tr.appendChild(tdName);

        var tdCtl = document.createElement('td');
        tdCtl.align="center";
        tdCtl.appendChild(fixBtn);
        tdCtl.appendChild(delBtn);

        tr.appendChild(tdCtl);
        wrap.appendChild(tr);
    });
    return;
}

/**
 * [setActive description]
 * @param {[type]} dom [description]
 */
function setActive(dom){
	var $active = $("#sidebar .active");
	if(dom === $active.get(0)){
		return;
	}else{
		$active.removeClass("active");
		$(dom).addClass('active');
	}
	return;
}

/**
 * [createModal 弹出模态框封装函数]
 * @param  {[string]} domStr [要innerHTML的表格字符串]
 * @param  {[type]} mes    [模态框title]
 * @return {[type]}        [description]
 */
function createModal(domStr,mes){
    $("#myModal").modal('show');
    document.querySelector('#myModal h3').innerHTML=mes;
    var dom=document.querySelector('#myModal .modal-body');
    dom.innerHTML=domStr;
    // addEvent(document.getElementById('modal-save'),'click',func);
}

/**
 * [editAdminFunc 修改管理员按钮]
 * @return {[type]} [description]
 */
function editAdminFunc(){
    var dataValue=this.getAttribute('data-value');

    var editAdminStr='<form action="doPostAjax.php?method=editAdmin&id='+dataValue+'" method="post">'+
        '<table class="table table-bordered"><tr><td>管理员名称</td><td><input name="username" type="text"></td></tr>'+
            '<tr><td>管理员密码</td><td><input name="password" type="password"></td></tr>'+
            '<tr><td>管理员邮箱</td><td><input name="email" type="text"></td></tr>'+
            '<tr><td colspan="2"><input type="submit" value="确认"></td></tr></table></form>';
    //先做一个修改的界面modal
    createModal(editAdminStr,"编辑管理员");

}
/**
 * [editAdminFunc 删除管理员按钮]
 * @return {[type]} [description]
 */
function delAdminFunc(){
    if(confirm("是否真的删除？")){
        window.location.href='doPostAjax.php?method=delAdmin&id='+this.getAttribute('data-value');
    }
}
/**
 * [editAdminFunc 编辑分类按钮]
 * @return {[type]} [description]
 */
function editCateFunc(){

}
/**
 * [editAdminFunc 删除分类按钮]
 * @return {[type]} [description]
 */
function delCateFunc(){

}



</script>
</body>
</html>