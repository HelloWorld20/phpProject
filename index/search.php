<!DOCTYPE html>
<html lang="zh-CN">
<head>
<?php 
include 'tpl/header.tpl';
 ?>
<title>搜索结果</title>
<style type="text/css">
.resultDisplay:hover *{
	text-decoration: none;
}
.resultDisplay h4{
	color:#333;
}
@media screen and (min-width: 1200px){
	.resultDisplay{
		width:20%;
	}
}
@media screen and (min-width: 992px) and (max-width: 1199px){
	.resultDisplay{
		width:25%;
	}
}
@media screen and (min-width: 768px) and (max-width: 991px){
	.resultDisplay{
		width:33.3%;
	}
}
@media screen and (max-width: 767px){
	.resultDisplay{
		width:50%;
	}
}
.resultDisplay{
	float: left;
	/*width:20%;*/
	margin:0;
}
.resultDisplay a{
	margin:0;
}
#wraper{
	position: relative;
}
#wraper img{
	width:100%;
}
.caption:hover{
	text-decoration: none;
}
</style>	
<body onload="scrollWaterfall()">
<?php 
//通用导航条
include 'tpl/navigator.tpl';
 ?>
<div class="container">
 	<h1>这是搜索结果页面</h1>
 		<div id="wraper">
 			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/fancy/cat_collection.png" alt="burkedecor">
		        	<h4>商品名称</h4>
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/12.jpg" alt="burkedecor">
					<h4>商品名称</h4>
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/32.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/fancy/burkedecor.png" alt="burkedecor">
					<div class="caption">
		        		<h3>商品名称</h3>
		      		</div>
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/fancy/dog_toy.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/fancy/wan_gwaan.png" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/1.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/12.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/22.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/2.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/15.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/32.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/1.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/15.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/13.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/22.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/2.jpg" alt="burkedecor">
				</a>	
			</div>
			<div class="resultDisplay">
				<a href="#" class="thumbnail">
					<img src="../img/jpg/11.jpg" alt="burkedecor">
				</a>	
			</div>
 		</div>
</div>
	
<?php 
include 'tpl/commonScript.tpl';
 ?>
<script type="text/javascript" src="/js/waterfall.js"></script>
</body>
</html>