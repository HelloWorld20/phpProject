<?php 
require_once './include.php';
$req = $_GET['method'];
$begin = $_GET['begin'];
$num = $_GET['num'];
if($req=='getIdLength'){//其实这个可以不要
	$sql = 'select * from imooc_admin';
	$res = getResultNum(connect(),$sql);
	echo $res;
}elseif($req=='getListAdminInfo'){
	echo getListAdminInfo($begin,$num);
}elseif($req=='getListCateInfo'){
	echo getListCateInfo($begin,$num);
}


/**
 * [getListAdminInfo 返回管理员相关信息]
 * @param  [type] $begin [description]
 * @param  [type] $num   [description]
 * @return [type]        [description]
 */
function getListAdminInfo($begin,$num){
	$result = array();
	$sql="select * from imooc_admin";
	$idLen = getResultNum(connect(),$sql);
	$result['idLen']=$idLen;
	// $rows=getAllAdmin();
	$rows = getPartAdmin($begin,$num);
	$resultArr = array('info'=>$rows);
	$result = array_merge($result,$resultArr);
	return json_encode($result);
}


function getListCateInfo($begin,$num){
	$result = array();
	$sql="select * from imooc_cate";
	$idLen = getResultNum(connect(),$sql);
	$result['idLen']=$idLen;
	$rows=getPartCate($begin,$num);
	$resultArr = array('info'=>$rows);
	$result = array_merge($result,$resultArr);
	return json_encode($result);
}

?>

