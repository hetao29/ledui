<?php
require_once("global.php");
if(!empty($_SERVER['HTTP_ORIGIN'])){
  header('Access-Control-Allow-Origin: *');  
}

$r=SlightPHP::run();
if($r!==null && !is_string($r)){
	echo SJson::encode($r);
}else{
	echo $r;
}