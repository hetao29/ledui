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
define("DEBUG",true);
		if(!empty($_POST)){
			$db = new user_db;
			$user=array();
			$user["UserSID"]=$_POST['email'];
			$user["UserPassword"]=$_POST['password'];
			$user["_insertTime"]=date("Y-m-d H:i:s");
			$UserID = $db->addUser($user);
			if($UserID){
				echo "注册成功，自动登录中...";
				return;
			}else{
				echo "注册失败";
			}

		}else{
		}
		echo $this->render("user/sign.html");
	}
	///user.main.logout
	function pageLogout($inPath){
		echo "User Logout";
	}

}
