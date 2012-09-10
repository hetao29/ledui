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
	/**
	 * 用户登录
	 */
	public function pageLogin($inPath){
		$result = new api_result;
		$data = new stdclass;
		$db = new user_db;
		$email = $_POST['email'];
		$passwd = $_POST['passwd'];
		$user = $db->getUserByEmail($email);
		if(empty($user)){
			$result->error_code = -10001;
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
		}
		return SJson::encode($result);
	}
	/**
	 * 用户信息获取
	 */
	public function pageGetInfo($inPath){
		$result = new api_result;
		$db = new user_db;
		if(isset($_SESSION['user'])){
			$result->result =  $_SESSION['user'];
			$result->error_code = 0;
		}else{
			$result->error_code = -1;
		}
		return SJson::encode($result);
	}
}
