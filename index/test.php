<?php 
require_once './include.php';
// connect();
 ?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<?php 
include 'tpl/header.tpl';
 ?>
<title>主页</title>
<style>

</style>
<body>
<?php 
//通用导航条
include 'tpl/navigator.tpl';
 ?>

<div class="container">
<div><?php 

 ?></div>

 		
<!-- <canvas id="myCan" style="position:fixed;z-index:-1;">您的浏览器不支持canvas标签</canvas> -->
</div>
<?php 
include 'tpl/commonScript.tpl';
 ?>
 <script>
	$.ajax({
	  url:"../admin/listAdmin.php",
	  type:'get',
	  data:'name=wei',
	  success:function(res){
	  	document.write(res);
	  }
	});
 </script>
<!-- <script type="text/javascript" src="../js/canvas.js"></script> -->
</body>
</html>