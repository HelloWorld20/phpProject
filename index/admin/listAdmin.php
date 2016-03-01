<?php 
require_once '../include.php';
$rows=getAllAdmin();
// echo json_encode($rows);
// print_r($rows);
// if(!$rows){
// 	alertMes("sorry,没有管理员，请添加！","addAdmin.php");
// 	exit;
// }

$accept=$_GET['req'];
if($accept){
	echo json_encode($rows);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
<link rel="stylesheet" href="../css/backstage.css">
</head>
<body>
	<div class="details">
        <div class="details_operation clearfix">
            <div class="bui_select">
                <input type="button" value="添&nbsp;&nbsp;加" class="add"  onclick="addAdmin()">
            </div>
                
        </div>
        <!--表格-->
        <table class="table" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th width="15%">编号</th>
                    <th width="25%">管理员名称</th>
                    <th width="30%">管理员邮箱</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
            <?php  foreach($rows as $row):?>
                <tr>
                    <!--这里的id和for里面的c1 需要循环出来-->
                    <td><input type="checkbox" id="c1" class="check"><label for="c1" class="label"><?php echo $row['id'];?></label></td>
                    <td><?php echo $row['username'];?></td>
                    <td><?php echo $row['email'];?></td>
                    <td align="center"><input type="button" value="修改" class="btn" onclick="editAdmin(<?php echo $row['id'];?>)"><input type="button" value="删除" class="btn"  onclick="delAdmin(<?php echo $row['id'];?>)"></td>
                </tr>
                <?php endforeach;?>
                <?php if($totalRows>$pageSize):?>
                <tr>
                	<td colspan="4"><?php echo showPage($page, $totalPage);?></td>
                </tr>
                <?php endif;?>
            </tbody>
        </table>
    </div>
</body>
</html>