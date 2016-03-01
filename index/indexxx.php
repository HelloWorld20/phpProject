<!DOCTYPE html>
<html lang="zh-CN">
<head>
<?php 
include 'tpl/header.tpl';
 ?>
<title>主页</title>
<style>
.type div{
	display: inline;
}
.type div a{
	width:46%;
	float: left;
	margin:2%;
}
.gather a{
	float:right;
}
</style>
<body>
<?php 
//通用导航条
include 'tpl/navigator.tpl';
 ?>

<div class="container">
 	<h1>这是首页</h1>
	<div class="row">
		<div class="col-md-8">	
			<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
		        <ol class="carousel-indicators">
		        	<li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
		        	<li data-target="#carousel-example-generic" data-slide-to="1"></li>
		        	<li data-target="#carousel-example-generic" data-slide-to="2"></li>
		        	<li data-target="#carousel-example-generic" data-slide-to="3"></li>
		        </ol>
		        <div class="carousel-inner" role="listbox">
		        	<div class="item active">
		        		<a href="https://www.baidu.com">
		          			<img src="../img/fancy/breakfirst_maker.png" alt="First slide">
		        		</a>
		        	</div>
		        	<div class="item">
		        		<a href="#">		        			
		          			<img src="../img/fancy/pen.png" alt="Second slide">
		        		</a>
		        	</div>
		        	<div class="item">
		        		<a href="#">
		          			<img src="../img/fancy/USA_cap_map.png" alt="Third slide">		        			
		        		</a>
		        	</div>
		        	<div class="item">
		        		<a href="#">
		          			<img src="../img/fancy/lajiaojiang.png" alt="Four slide">		
		        		</a>
		        	</div>
		      	</div>
		      	<!-- <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
		        	<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
		        	<span class="sr-only">Previous</span>
		      	</a>
		      	<a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
		        	<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
		        	<span class="sr-only">Next</span>
		      	</a> -->
		    </div>

		</div>
		<div class="col-md-4">
			<div class="type">
				<div class="man">
					<a href="#" class="thumbnail">
						<img src="../img/fancy/burkedecor.png" alt="burkedecor">
					</a>	
				</div>
				<div class="women">
					<a href="#" class="thumbnail">
						<img src="../img/fancy/burkedecor.png" alt="burkedecor">
					</a>
				</div>
				<div class="kids">
					<a href="#" class="thumbnail">
						<img src="../img/fancy/burkedecor.png" alt="burkedecor">
					</a>
				</div>
				<div class="home">
					<a href="#" class="thumbnail">
						<img src="../img/fancy/burkedecor.png" alt="burkedecor">
					</a>
				</div>
				<div class="gadgets">
					<a href="#" class="thumbnail">
						<img src="../img/fancy/burkedecor.png" alt="burkedecor">
					</a>
				</div>
				<div class="art">
					<a href="#" class="thumbnail">
						<img src="../img/fancy/burkedecor.png" alt="burkedecor">
					</a>
				</div>
			</div>
			
		</div>
	</div>

	

<!-- 第二层row -->
 	<div class="row" id="second">
 		<div class="col-md-12">
 			<div class="gather alert alert-success"><b>man</b>
				<a href="/search.php?type=man">more...</a>
 			</div>
 		</div>
 		<div class="col-md-3">
	 		<div class="thumbnail">
	      		<img src="../img/fancy/baymax_light.jpg" alt="baymax_light">
	      		<div class="caption">
	        		<h3>商品名称</h3>
	        		<p>商品描述商品描述商品描述商品描述商品描述商品描述</p>
	        		<p><a href="#" class="btn btn-primary btn-block" role="button">购买</a></p>
	      		</div>
	    	</div>
    	</div>
 		<div class="col-md-3">
	 		<div class="thumbnail">
	      		<img src="../img/fancy/baymax_light.jpg" alt="baymax_light">
	      		<div class="caption">
	        		<h3>商品名称</h3>
	        		<p>商品描述商品描述商品描述商品描述商品描述商品描述</p>
	        		<p><a href="#" class="btn btn-primary btn-block" role="button">购买</a></p>
	      		</div>
	    	</div>
 		</div>
 		<div class="col-md-3">
			<div class="thumbnail">
	      		<img src="../img/fancy/baymax_light.jpg" alt="baymax_light">
	      		<div class="caption">
	        		<h3>商品名称</h3>
	        		<p>商品描述商品描述商品描述商品描述商品描述商品描述</p>
	        		<p><a href="#" class="btn btn-primary btn-block" role="button">购买</a></p>
	      		</div>
	    	</div>
 		</div>
 		<div class="col-md-3">
			<div class="thumbnail">
	      		<img src="../img/fancy/baymax_light.jpg" alt="baymax_light">
	      		<div class="caption">
	        		<h3>商品名称</h3>
	        		<p>商品描述商品描述商品描述商品描述商品描述商品描述</p>
	        		<p><a href="#" class="btn btn-primary btn-block" role="button">购买</a></p>
	      		</div>
	    	</div>
 		</div>
 	</div>
 		
<!-- <canvas id="myCan" style="position:fixed;z-index:-1;">您的浏览器不支持canvas标签</canvas> -->
</div>
<?php 
include 'tpl/commonScript.tpl';
 ?>
<!-- <script type="text/javascript" src="../js/canvas.js"></script> -->
</body>
</html>