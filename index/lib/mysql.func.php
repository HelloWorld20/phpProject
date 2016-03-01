<?php

function connect(){
	$link = mysqli_connect(DB_HOST,DB_USER,DB_PWD) or die("数据库连接失败ERROR：".mysql_errno().":".mysql_error());
	mysqli_set_charset($link,DB_CHARSET);
	mysqli_select_db($link,DB_DBNAME) or die("指定数据库打开失败");
	return $link;
}
/**
 * [insert_t 向数据库插入数据]
 * @param  [type] $link  [connect()返回的值]
 * @param  [string] $table [要插入的表名]
 * @param  [array] $array [要插入的键值，键为列名，值为值]
 * @return [int]        [插入成功的自增长的id值]
 */
// insert_t($link,"imooc_admin",array('usernane' => 'bobo','password'=>'123'));
function insert($link,$table,$array){
	$keys = join(",",array_keys($array));
	$vals = "'".join("','",array_values($array))."'";
	$sql = "insert into {$table}($keys) values({$vals});";
	mysqli_query($link,$sql);
	return mysqli_insert_id($link);
}

/**
 * [update_t 更新数据库]
 * @param  [type] $link  [connect()返回的值]
 * @param  [string] $table [要更新的表名]
 * @param  [array] $array [要更新的键值，键为列名，值为值]
 * @param  [string] $where [where判断语句]
 * @return [int]        [一个 > 0 的整数表示所影响的记录行数。0 表示没有受影响的记录。-1 表示查询返回错误。]
 */
// update_t($link,"imooc_admin",$arr,"username='bobo'")
function update($link,$table,$array,$where=null){
	$str=null;
	foreach($array as $key => $val){
		if($str==null){
			$sep="";
		}else{
			$sep=",";
		}
		$str.=$sep.$key."='".$val."'";
	}
	$sql="update {$table} set {$str} ".($where==null?null:" where ".$where);
	mysqli_query($link,$sql);
	return mysqli_affected_rows($link);
}
/**
 * [delete_t 删除]
 * @param  [type] $link  [connect()返回的值]
 * @param  [string] $table [表名]
 * @param  [type] $where [where语句]
 * @return [int]        [一个 > 0 的整数表示所影响的记录行数。0 表示没有受影响的记录。-1 表示查询返回错误]
 */
function delete($link,$table,$where=null){
	$where=$where==null?null:" where ".$where;
	$sql="delete from {$table} {$where}";
	mysqli_query($link,$sql);
	return mysqli_affected_rows($link);
}

/**
 * [fetchOne_t 得到指定一条记录]
 * @param  [type] $link        [connect()返回的值]
 * @param  [type] $sql         [description]
 * @param  [type] $result_type [description]
 * @return [array]              [[username] => wei]
 */
// fetchOne_t($link,"select username from imooc_admin where id=7")
function fetchOne($link,$sql,$result_type=MYSQL_ASSOC){
	$result=mysqli_query($link,$sql);
	$row=mysqli_fetch_array($result,$result_type);
	return $row;
}

//得到所有记录
// function fetchAll($sql,$result_type=MYSQL_ASSOC){
// 	$result=mysql_query($sql);
// 	while(@$row=mysql_fetch_array($result,$result_type)){
// 		$rows[]=$row;
// 	}
// 	return $rows;
// }

/**
 * [fetchAll_t description]
 * @param  [type] $link        [description]
 * @param  [type] $sql         [description]
 * @param  [type] $result_type [description]
 * @return [type]              [description]
 */
function fetchAll($link,$sql,$result_type=MYSQL_ASSOC){
	$result=mysqli_query($link,$sql);
	while(@$row=mysqli_fetch_array($result,$result_type)){
		$rows[]=$row;
	}
	return $rows;
}


//得到结果集中的记录条数
function getResultNum($link,$sql){
	$result = mysqli_query($link,$sql);
	return mysqli_num_rows($result);
}

?>