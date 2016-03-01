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
    <div id="register">
        <h1>这是注册页面</h1>
        <form action="POST" method="POST" class="form-signin">
            <h2 class="form-signin-heading">请登录</h2>
            <label for="inputEmail">电子邮件</label>
            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
            <label for="inputPassword">密码</label>
            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
            <div class="checkbox">
                <label for=""><input type="checkbox" value="下次自动登录">下次自动登录</label>
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="submit">注册</button>
            <a href="/login.php" class="btn btn-lg btn-primary btn-block">去登录</a>
        </form>
        <a href="#" onclick="window.history.back(-1)"><-返回</a>
        <a href="/indexxx.php" style="float:right;">首页-></a>
    </div>
</div>
	
<?php 
include 'tpl/commonScript.tpl';
 ?>
<script type="text/javascript" src="../js/canvas.js"></script>
</body>
</html>