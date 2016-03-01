<?php 
require_once './include.php';

$req=$_GET['method'];
$id=$_GET['id'];
if($req=="editAdmin"){
	echo editAdmin($id);
}elseif ($req=="delAdmin") {
	echo delAdmin($id);
}


