<?php
class user_main extends STpl{
	function __construct(){
	}
	function pageShow($inPath){
		echo "X";
	}
	function pageEntry($inPath){
		echo $this->render("user/sign.html");
	}
	///user.main.register
	function pageRegister($inPath){
		if(!empty($_POST)){

		}else{
		}
		echo $this->render("user/sign.html");
	}
	///user.main.logout
	function pageLogout($inPath){
		echo "User Logout";
	}

}
