<!DOCTYPE html>
<html lang="zh-CN">
<head>
<?php 
include 'tpl/header.tpl';
 ?>
<title>主页</title>
<style>
.imgWrap img{
	width:100%;
	margin:5px 0;
}
@media screen and (max-width: 992px){
	#imgWrapSmall img{
		width:19%;
	}
}
#detail{

}
.price{
	padding:15px;
	background-color: #dff0d8;
	margin-bottom: 20px;
	border:1px solid #d6e9c6;
	border-radius: 4px;
	color: #333;
}
.price *{
	margin: 3px;
}
.selector select{
	color:#333;
	background: #eee;
   	width: 49.5%;
   	padding: 5px;
   	font-size: 16px;
   	border: 1px solid #ccc;
   	height: 34px;
   -webkit-appearance: none; /*for chrome*/
}
.styled-select select {
   
}
#goodsInfo{
	margin:10px 0;
}
</style>
<body>
<?php 
//通用导航条
include 'tpl/navigator.tpl';
 ?>

<div class="container">
	<h1>这是商品展示页面</h1>
	<div class="row">
		<div class="col-md-5">
			<div class="imgWrap">	
				<img id="imgDemo" class="img-thumbnail" src="../img/jpg/disney's_minnie_mouse_face&feet_tote_bag.jpg" alt="image">
			</div>
		</div>
		<div class="col-md-1">
			<div id="imgWrapSmall" class="imgWrap">
				<img src="../img/jpg/disney's_minnie_mouse_face&feet_tote_bag.jpg" alt="">
				<img src="../img/jpg/foods_before_dudes_notebook.jpg" alt="">
				<img src="../img/jpg/star_wars_limited_edition_figures.jpg" alt="">
				<img src="../img/jpg/U_model_wall_shelves.jpg" alt="">
				<img src="../img/jpg/solid_gold_evil_eye_ring.jpg" alt="">
			</div>
		</div>
		<div class="col-md-6">
			<div id="detail">
				<h3 id="goodsTitle">戒之馆 婴儿湿疹特效无激素!宝宝奶癣护肤乐皮炎净瘙痒面霜婴亲霜</h3>
				<p id="goodsDecoration">千万妈妈热荐口碑产品婴亲霜！针对宝宝湿疹瘙痒红疹等问题，亲们不用担心效果等问题，产品销售了近5年，从不刷销量，从不刷评价，靠信任与口碑一步一步走到现在，解决宝宝大部分的肌肤问题，实际含量超过22克！同比同类产品加量50%以上，一瓶顶其他产品多瓶，更耐用！！</p>
				<div class="price">
					<label>价格：</label>￥<span id="goodPrice">100</span>
					<div class="selector">
						<label>尺寸：</label>
						<select name="size" id="size">
							<option value="small">小号</option>
							<option value="middle">中号</option>
							<option value="large">大号</option>
						</select>
					</div>
					<div class="selector">
						<label>数量：</label>
						<select name="number" id="number">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
						</select>
					</div>
					<button type="button" id="buy" class="btn btn-primary">直接购买</button>
					<button type="button" id="addCart" class="btn btn-primary">加入购物车</button>
				</div>
				
			</div>
		</div>
	</div>

	<div id="goodsInfo">
  <!-- Nav tabs -->
	  	<ul class="nav nav-tabs" role="tablist">
	    	<li role="presentation" class="active"><a href="#infomation" aria-controls="infomation" role="tab" data-toggle="tab">商品详情</a></li>
	    	<li role="presentation"><a href="#comment" aria-controls="comment" role="tab" data-toggle="tab">商品评论</a></li>
	    	<li role="presentation"><a href="#record" aria-controls="record" role="tab" data-toggle="tab">购买记录</a></li>
	    	<li role="presentation"><a href="#recomment" aria-controls="recomment" role="tab" data-toggle="tab">相似商品</a></li>
	  	</ul>

	  <!-- Tab panes -->
	  	<div class="tab-content">
	    	<div role="tabpanel" class="tab-pane active" id="infomation">...</div>
	    	<div role="tabpanel" class="tab-pane" id="comment">...</div>
	    	<div role="tabpanel" class="tab-pane" id="record">...</div>
	    	<div role="tabpanel" class="tab-pane" id="recomment">...</div>
	  	</div>

	</div>
 		
<!-- <canvas id="myCan" style="position:fixed;z-index:-1;">您的浏览器不支持canvas标签</canvas> -->
</div>
<?php 
include 'tpl/commonScript.tpl';
 ?>
<!-- <script type="text/javascript" src="../js/canvas.js"></script> -->
<script type="text/javascript">
$(document).ready(function(){
	var imgDemo = document.getElementById('imgDemo');
	var $img = $("#imgWrapSmall");
	// var srcArr = [];
	// $img.each(function(i,e){
	// 	srcArr.push(e.getAttribute('src'));
	// });
	$img.click(function(e){
		e.stopPropagation();
		imgDemo.src = e.target.src;
	})
});
</script>
</body>
</html>