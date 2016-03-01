<?php 
// 管理员相关的操作
/**
 * [checkAdmin 检查是否有管理员]
 * @param  [type] $sql [description]
 * @return [type]      [description]
 */
function checkAdmin($sql){
	$link=connect();
	return fetchOne($link,$sql);
}

/**
 * [checkLogined description]
 * @return [type] [description]
 */
function checkLogined(){
	if($_SESSION['adminId']==""&&$_COOKIE['adminId']==""){
		alertMes("请先登录","../login.php");
	}
}

function logout(){
	$_SESSION=array();
	if(isset($_COOKIE[session_name()]));{
		setcookie(session_name(),"",time()-1);
	}
	if(isset($_COOKIE['adminId'])){
		setcookie("adminId","",time()-1,"/");
	}
	if(isset($_COOKIE['adminName'])){
		setcookie("adminName","",time()-1,"/");
	}
	session_destroy();
	// header("location:login.php");
	alertMes("退出成功","../login.php");
}
/**
 * [addAdmin description]
 */
function addAdmin(){
	$arr=$_POST;
	$arr['password']=md5($_POST['password']);
	if(insert(connect(),"imooc_admin",$arr)){
		$mes="添加成功！<br/><a href='../admin.php#_9'>继续添加</a>|<a href='../admin.php#_9'>查看管理员列表</a>";
	}else{
		$mes="添加失败！<br/><a href='../admin.php#_9'>重新添加</a>";
	}
	return $mes;
}

/**
 * [getAllAdmin 获取所有管理员记录]
 * @return [array] [description]
 */
function getAllAdmin(){
	$sql="select id,username,email from imooc_admin";
	$rows=fetchAll(connect(),$sql);
	return $rows;
}

/**
 * [getPartAdmin 获取部分管理员记录，实际只是封装了getAllAdmin]
 * @param  integer $begin [description]
 * @param  integer $num   [description]
 * @return [array]         [description]
 */
function getPartAdmin($begin=1,$num=5){
	// $sql="select id,username,email from imooc_admin limit {$begin},{$num}";
	return array_slice(getAllAdmin(),$begin,$num);
}


function editAdmin($id){
	$arr=$_POST;
	$arr['password']=md5($_POST['password']);
	if(update(connect(),"imooc_admin",$arr,"id={$id}")){
		$mes="编辑成功<a href='../admin.php#_10'>查看管理员列表</a>";
	}else{
		$mes="编辑失败<a href='../admin.php#_9'>请重新修改</a>";
	}
	return $mes;
}
function delAdmin($id){
	if(delete(connect(),"imooc_admin","id={$id}")){
		$mes="删除成功<a href=../admin.php#_10'>查看管理员列表</a>";
	}else{
		$mes="删除失败<a href='../admin.php#_10'>请重新删除</a>";
	}
	return $mes;
}