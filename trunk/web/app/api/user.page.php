<?php
class api_user{
	/**
	 * 用户注册
	 */
	public function pageRegister($inPath){
		$db = new user_db;
		$result = new api_result;
		$email = $_POST['email'];
		$passwd = $_POST['passwd'];
		$passwd2 = $_POST['passwd2'];
		$user = $db->getUserByEmail($email);
		if($passwd != $passwd2){
			$result->error_code = -10004;
		}else if(!ereg("^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9\-\.])+", $email)){
			$result->error_code = -10001;
		}else if(isset($user['UserID'])){
			$result->error_code = -10002;
		}else{
			$user['UserSID'] = $email;
			$user['UserPassword'] = $passwd;
			$db->addUser($user);
			user_api::loginMobile($user);
			$result->error_code = 0;
		}
		return SJson::encode($result);
	}
	public function pageIsLogin($inPath){
		$token = $_POST['token'];
		$uid = $_POST['uid'];
		return user_api::isLoginMobile($uid,$token);
	}
	/**
	 * 用户登录
	 */
	public function pageLogin($inPath){
		$result = new api_result;
		$data = new stdclass;
		$db = new user_db;
		$email = $_POST['email'];
		$passwd = $_POST['passwd'];
		if(empty($email) || !SUtil::validEmail($email)){
			$result->error_msg="邮箱地址错误";//应该支持多语言
			$result->error_code=-10001;
			return SJson::encode($result);
		}elseif(empty($passwd)){
			$result->error_msg="密码不能为空";//应该支持多语言
			$result->error_code=-10003;
			return SJson::encode($result);
		}else{
			$user = $db->getUserByEmail($email);
			if(empty($user)){
				$result->error_code = -10002;
				$result->error_msg="邮箱没有注册";//应该支持多语言
				return SJson::encode($result);
			}else if($passwd == $user["UserPassword"]){
				$r = user_api::loginMobile($user);
				$result->error_code = 0;
				$data->UserID = $user['UserID'];
				$data->UserSID= $user['UserSID'];
				$data->UserAlias= $user['UserAlias'];
				$data->UserEmailVerified= $user['UserEmailVerified'];
				$data->UserComment= $user['UserComment'];
				$data->UserAccessToken= $r;
				$result->result = $data;
			}else{
				$result->error_code = -10004;
				$result->error_msg="密码错误";//应该支持多语言
			}
		}
		return SJson::encode($result);
	}
	/**
	 * 用户信息获取
	 */
	public function pageGetInfo($inPath){
		$result = new api_result;
		$db = new user_db;
		$userID = $_GET['UserID'];
		$token = $_GET['Token'];
		
		if(user_api::isLoginMobile($userID,$token) == true){
			$result->result =  user_api::getUserByID($userID);
			$result->error_code = 0;
		}else{
			$result->error_code = -1;
		}
		return SJson::encode($result);
	}
}
