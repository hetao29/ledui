<?php
class user_main extends STpl{
	function __construct(){
	}
	function pageNav($inPath){
			return $this->render("user/nav.tpl");
	}
	function pageEntry($inPath){
		if(($u=user_api::islogin())!==false){
			echo $this->render("user/myaccount_1.html");
		}else{
			echo $this->render("user/sign.html");
		}
	}
	///user.main.register
	function pageRegister($inPath){
		if(!empty($_POST)){
			$db = new user_db;
			$user=array();
			$user["UserSID"]=$_POST['email'];
			$user["UserPassword"]=$_POST['password'];
			$user["_insertTime"]=date("Y-m-d H:i:s");
			$UserID = $db->addUser($user);
			if($UserID){
				//echo "注册成功，自动登录中...";
				user_api::login($user);
				header("location:/");
			}else{
				echo "注册失败";
			}

		}else{
		}
		echo $this->render("user/sign.html");
	}
	function pageLogin($inPath){
		if(!empty($_POST)){
			$db = new user_db;
			$u = $db->getUserByEmail(@$_POST['email']);
			if(!empty($u) && $u['UserPassword']==@$_POST['password']){
				//echo "注册成功，自动登录中...";
				$r = user_api::login($u,!empty($_POST['forever'])?true:false);
				header("location:/user");
			}else{
				echo "登录失败";
			}

		}else{
		}
		echo $this->render("user/sign.html");
	}
	///user.main.logout
	function pageLogout($inPath){
		user_api::logout();
		header("location:/");
	}

}
