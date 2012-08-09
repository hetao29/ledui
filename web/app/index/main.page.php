<?php
class index_main extends STpl{
	function __construct(){
	}
	function __destruct(){
	}
	function pageEntry($inPath){
		echo $this->render("head.tpl");
		echo $this->render("index/index.html");
		echo $this->render("footer.tpl");
	}
	function pageNav($inPath){
		$user = user_api::islogin();
		return $this->render("nav.tpl",array("user"=>$user));
	}
	function pageDb($inPath){
		$api = new index_api;
		$api->addScore("name",3);
	}
}
