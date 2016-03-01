<!-- fixed navbar -->
<nav class="navbar navbar-inverse navbar-fixed-top">
	<div class="container-fluid">
		<div class="navbar-header">
			<button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
				<span class="sr-only"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a href="/" class="navbar-brand">Project name</a>
		</div>
		<div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
            	<li><a href="/indexxx.php">首页</a></li>
            	<li><a href="/cart.php">购物车</a></li>
            	<li><a href="/search.php">搜索页面</a></li>
            	<li><a href="/admin.php">后台</a></li>
            	<li><a href="/detail.php">商品展示</a></li>
            </ul>
            
            <ul class="nav navbar-nav navbar-right">
            	<!-- <li>
            		<form id="doSearch" action="doSearch.php" method="POST" class="navbar-form navbar-right" role="Search">
		            	<div class="form-group">
		            	<input type="text" class="form-control" placeholder="search"></div>
		            	<button class="btn btn-default" type="submit"><span class="glyphicon glyphicon-search"></span></button>
		            </form>
            	</li> -->
            	<!-- <li><a href="javascript:;"><span class="glyphicon glyphicon-search"></span></a></li> -->
            	<li><a href="../admin/doAdminAction.php?act=logout" title="点击退出">欢迎：<?php
            	// print_r($_SESSION['adminName']);
            	if(isset($_SESSION['adminName'])){
            		echo $_SESSION['adminName'];
            	}elseif(isset($_COOKIE['adminName'])){
            		echo $_COOKIE['adminName'];
            	}

            	?>&nbsp&nbsp(点击退出)</a></li>
            	<!-- <li><a href="/register.php">注销</a></li> -->
            </ul>
        </div>
	</div>
	<a href="javascript:;" id="backTop" onclick="pageScroll()"><span class="glyphicon glyphicon-chevron-up"></span></a>
</nav>