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
		if(empty($email) || !SUtil::validEmail($email)){
			$result->error_msg=SLanguage::tr("error_10001","error");
			$result->error_code=-10001;
			return SJson::encode($result);
		}elseif(empty($passwd) || empty($passwd2)){
			$result->error_msg=SLanguage::tr("error_10004","error");
			$result->error_code=-10004;
			return SJson::encode($result);
		}elseif($passwd != $passwd2){
			$result->error_msg=SLanguage::tr("error_10005","error");
			$result->error_code=-10005;
			return SJson::encode($result);
		}else{
			$user = $db->getUserByEmail($email);
			if(!empty($user)){
				$result->error_msg=SLanguage::tr("error_10002","error");
				$result->error_code=-10002;
				return SJson::encode($result);
			}else{
				$user['UserSID'] = $email;
				$user['UserPassword'] = $passwd;
				$db->addUser($user);
				user_api::loginMobile($user);
				$result->error_code = 0;
				$data->UserID = $user['UserID'];
				$data->UserSID= $user['UserSID'];
				$data->UserAlias= $user['UserAlias'];
				$data->UserEmailVerified= $user['UserEmailVerified'];
				$data->UserComment= $user['UserComment'];
				$data->UserAccessToken= $r;
				$result->result = $data;
			}
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
			$result->error_msg=SLanguage::tr("error_10001","error");
			$result->error_code=-10001;
			return SJson::encode($result);
		}elseif(empty($passwd)){
			$result->error_msg=SLanguage::tr("error_10004","error");
			$result->error_code=-10004;
			return SJson::encode($result);
		}else{
			$user = $db->getUserByEmail($email);
			if(empty($user)){
				$result->error_code = -10003;
				$result->error_msg=SLanguage::tr("error_10003","error");
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
				$result->error_msg=SLanguage::tr("error_10004","error");
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
	/**
	  * 同步用户地址
	  */
	public function PagesynAddress($inPath){
		$result = new api_result;
		if(user_api::isLoginMobile($userID,$token) != true){
			$result->error_code = -1;
			return SJson::encode($result);
		}
		$db = new user_db;
		//print_r($_REQUEST['AddressData']);
		$r = SJson::decode($_REQUEST['AddressData']);
		if(count(r)>0){
			//更新用户所有的Address为删除状态
		}
		foreach($r as &$t){
			//TODO
			//更新记录，或者新增记录
			$t->AddressID=999;//for test
			//更新当前记录为正常记录
		}
		$result->result = $r; 
		$result->error_code = 0;
		return SJson::encode($result);
		exit;
		/*
		$Address=array();
		if(empty($_REQUEST['Name'])){	$result->error_code = -1;	};
		if(empty($_REQUEST['Country'])){	$result->error_code = -1;	};
		if(empty($_REQUEST['Address'])){	$result->error_code = -1;	};
		$Address['Name']=$_REQUEST['Name'];
		$Address['Address']=$_REQUEST['Address'];
		$Address['Country']=$_REQUEST['Country'];
		if(isset($_REQUEST['Mobile']))$Address['Mobile']=$_REQUEST['Mobile'];
		if(isset($_REQUEST['Phone']))$Address['Phone']=$_REQUEST['Phone'];
		if(isset($_REQUEST['Email']))$Address['Email']=$_REQUEST['Email'];
		if(isset($_REQUEST['PostCode']))$Address['PostCode']=$_REQUEST['PostCode'];
		
		if(user_api::isLoginMobile($userID,$token) == true){
			$id =  $db->addAddress($Address);
			$result->result =  $db->getAddress($id);
			$result->error_code = 0;
		}else{
			$result->error_code = -1;
		}
		return SJson::encode($result);
		*/
	}
}
