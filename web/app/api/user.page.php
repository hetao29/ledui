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
		$device = $_POST['device'];
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
				$user = $db->getUserByEmail($email);
				$device['UserID'] = $user['UserID'];
				$db->addDevice($device);
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
		$dbu = new user_db;
		$dbm = new money_db;
		$data = new stdclass;
		$token = $_POST['token'];
		$uid = $_POST['uid'];
		
		if(user_api::isLoginMobile($uid,$token) == true){
			$data->UserProfile =  user_api::getUserByID($uid);
			$data->ScoerCurrent = money_api::getScoreByID($uid);
			$money = money_api::getMoneyByID($UserID);
			$data->MoneyCurrent = $money['MoneyCurrent'];
			$data->MoneyCurrency = $money['MoneyCurrency'];
			$result->result =  $data;
			$result->error_code = 0;
		}else{
			$result->error_code = -1;
		}
		return SJson::encode($result);
	}
	/**
	  * 同步用户地址 @废弃
	  */
	/*
	public function PageSynAddress($inPath){
		$result = new api_result;
		$token = $_POST['token'];
		$uid = $_POST['uid'];
		$r = SJson::decode($_REQUEST['AddressData']);
		if(user_api::isLoginMobile($uid,$token) != true){
			$result->error_code = -1;
			return SJson::encode($result);
		}
		$db = new user_db;
		if(count($r)>0){
			//更新用户所有的Address为删除状态
			$db->updateAddressDelByUserID($uid,1);
		}else{
			$adds = $db->getAddressListByUserID($uid,0);
			if(count($adds)>0){
				$result->error_code = 0;
				$result->result = $adds;
				exit;
			}else{
				$result->error_code = -1;
				exit;
			}	
		}
		foreach($r as &$t){
			//TODO
			//更新记录，或者新增记录
			$t=(array)$t;
			$addID = $t['AddressID'];
			$addr=array();
			$addr['AddressID'] = $t['AddressID'];
			$addr['UserID'] = $t['AddressID'];

			if(isset($addID)){
				if(user_api::isAddressExist($addID))
					$db->updateAddressDelByAddID($addID,0);
				else
					$db->addAddress($t);
			}else{
				$db->addAddress($t);
			}
			//更新当前记录为正常记录
		}
		$result->result = $db->getAddressListByUserID($uid,0); 
		$result->error_code = 0;
		return SJson::encode($result);
	}
	*/
}
