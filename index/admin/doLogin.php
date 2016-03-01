<?php
require_once '../include.php';
session_start();
$username = $_POST['username'];
$password = md5($_POST['password']);
$autoFlag = $_POST['autoFlag'];
// $verify = $_POST['verify'];
// $verify1 = $_SESSION['verify'];
echo $username;
echo $password;
// if($verify==$verify1)
if(true){
	$sql="select * from imooc_admin where username='{$username}' and password='{$password}'";
	$row=checkAdmin($sql);
	if($row){
		//如果选了一周自动登录
		if($autoFlag){
			setcookie("adminId",$row['id'],time()+7*24*3600,"/");
			setcookie("adminName",$row['username'],time()+7*24*3600,"/");
		}
		$_SESSION['adminId']=$row['id'];
		$_SESSION['adminName']=$row['username'];
		// header("location:admin.php");
		alertMes("登录成功","../admin.php");
	}else{
		// alertMes("不存在用户名或密码，重新登录","../login.php");
	}
}else{
	// alertMes("登录失败，重新登录","../login.php");	
}

?>