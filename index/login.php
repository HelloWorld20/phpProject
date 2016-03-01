<!DOCTYPE html>
<html lang="zh-CN">
<head>
<?php 
include 'tpl/header.tpl';
 ?>
<title>登录</title>
<link rel="stylesheet" type="text/css" href="/css/signin.css">
<body>
<canvas id="myCan">您的浏览器不支持canvas标签</canvas>
<div class="container">
    <div id="login">
        <h1>这是登录页面</h1>
        <form action="../admin/doLogin.php?act=login" method="post" class="form-signin">
            <h2 class="form-signin-heading">请登录</h2>
            <label for="inputEmail">电子邮件</label>
            <input type="email" name="username" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
            <label for="inputPassword">密码</label>
            <input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required>
            <div class="checkbox">
                <label><input type="checkbox" name="autoFlag" value="1">下次自动登录</label>
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="submit">登录</button>
            <a href="/register.php" class="btn btn-lg btn-primary btn-block">去注册</a>
        </form>
        <a href="#" onclick="window.history.back(-1)"><-返回</a>
        <a href="/indexxx.php" style="float:right;">首页-></a>
    </div>
    <div class="signin">
      
    </div>
</div>
	
<?php 
include 'tpl/commonScript.tpl';
 ?>
 <script type="text/javascript" src="../js/canvas.js"></script>
</body>
</html>