<?php 
require_once '../lib/string.func.php';
require_once '../lib/upload.func.php';
header("content-type:text/html;charset=utf-8");
print_r($_FILES);
// $fileInfo=$_FILES['myFile'];

$info=buildInfo();
$info=uploadFile();
print_r($info);