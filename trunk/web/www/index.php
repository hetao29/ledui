<?php
require_once("global.php");
if(($r=SlightPHP::run())===false){
	echo("404 error");
}else{
	echo($r);
}
