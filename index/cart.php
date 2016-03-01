<!DOCTYPE html>
<html lang="zh-CN">
<head>
<?php 
include 'tpl/header.tpl';
 ?>
<title>购物车</title>
<style type="text/css">
#disp-wraper{
	list-style: none;
}
.disp{
	padding:20px;
	margin:20px 0;
	border: 1px solid #eee;
	border-left: 5px solid #eee;
	border-radius: 3px;
}
.disp>a,.disp>a:hover{
	text-decoration:none;
	color:#333;
}
.disp-selected{
	border-left-color: #1b809e;
}
.account{
	height: 50px;
	overflow: hidden;
	background: #e5e5e5;
	margin-bottom: 100px;
	line-height: 50px;
	padding-left:10px;
	padding-right: 10px;
}
.account-left{
	float: left;
}
.account-right{
	float: right;
}
</style>
<body>
<?php 
//通用导航条
include 'tpl/navigator.tpl';
 ?>
<div class="container">
 	<h1>这是购物车</h1>
 	<ul id="disp-wraper">
 		<li>
 			<div class="disp disp-selected media">
 				<a href="#">
	 				<div class="media-left">
	 						<img src="../img/jpg/clock.jpg" width="100" height="100" alt="media" class="media-object">
	 				</div>
	 				<div class="media-body">
	 					<h4 class="media-heading">media-heading</h4>
	 					media-body text
	 				</div>
				</a>
 			</div>
 		</li>
 		<li>
 			<div class="disp media">
 				<a href="#">
	 				<div class="media-left">
	 						<img src="../img/jpg/clock.jpg" width="100" height="100" alt="media" class="media-object">
	 				</div>
	 				<div class="media-body">
	 					<h4 class="media-heading">media-heading</h4>
	 					media-body text
	 				</div>
				</a>
 			</div>
 		</li>
 		<li>
 			<div class="disp media">
 				<a href="#">
	 				<div class="media-left">
	 						<img src="../img/jpg/clock.jpg" width="100" height="100" alt="media" class="media-object">
	 				</div>
	 				<div class="media-body">
	 					<h4 class="media-heading">media-heading</h4>
	 					media-body text
	 				</div>
				</a>
 			</div>
 		</li>
 		<li>
 			<div class="disp media">
 				<a href="#">
	 				<div class="media-left">
	 						<img src="../img/jpg/clock.jpg" width="100" height="100" alt="media" class="media-object">
	 				</div>
	 				<div class="media-body">
	 					<h4 class="media-heading">media-heading</h4>
	 					media-body text
	 				</div>
				</a>
 			</div>
 		</li>
 		<li>
 			<div class="disp media">
 				<a href="#">
	 				<div class="media-left">
	 						<img src="../img/jpg/clock.jpg" width="100" height="100" alt="media" class="media-object">
	 				</div>
	 				<div class="media-body">
	 					<h4 class="media-heading">media-heading</h4>
	 					media-body text
	 				</div>
				</a>
 			</div>
 		</li>
 	</ul>
 	<div class="account">
 		<div class="account-left">
 			<input type="checkbox">&nbsp全选
 		</div>
 		<div class="account-right">
 			<label>合计</label>
 			<span>￥100</span>
 			&nbsp&nbsp&nbsp
 			<a class="btn btn-primary account-btn" href="#">结算</a>
 		</div>
 	</div>
</div>
	
<?php 
include 'tpl/commonScript.tpl';
 ?>
</body>
</html>