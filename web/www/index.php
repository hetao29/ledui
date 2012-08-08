<?php
require_once("global.php");
if(($r=SlightPHP::run())===false){
	echo("404 error");
}elseif(is_string($r)){
	echo($r);
}elseif(!empty($r)){
	echo SJson::encode($r);
}else{
	echo $r;
}
