<?php
class user_api{
	//网页登录接口
	static public function login($User,$forever=false){
		if(!empty($User['UserID'])){
			$_SESSION['user']=$User;
			$db = new  user_db;
			$expired=0;
			if($forever){
				$expired=time()+365*3600*24;//一年过期
				$db->addUserToken(array("UserID"=>$User['UserID'],"UserToken"=>session_id(),"UserTokenType"=>user_const::$tokenType['web']));
			}
			self::setCookie("token",session_id(),$expired);
			self::setCookie("uid",$User['UserID'],$expired);
			return true;
		}
		return false;
	}
	//API(手机)登录接口
	static public function loginMobile($User){
		if(!empty($User['UserID'])){
			$db = new  user_db;
			$expired=time()+3600*24*10;//十天过期
			$db->addUserToken(array("UserID"=>$User['UserID'],"UserToken"=>session_id(),"UserTokenType"=>user_const::$tokenType['mobile'],"UserTokenExpiredTime"=>$expired));
			return session_id();
		}
		return false;
	}
	static public function isLoginMobile($UserID,$Token){
		$db = new  user_db;
		$token = $db->getUserToken($UserID,$Token);
		if(isset($token["UserID"])){
			$db->updateUserToken($UserID,$Token);
			return true;
		}else{
			return false;
		}
	}
	static public function  isLogin(){
		if(isset($_SESSION['user']))return $_SESSION['user'];else return false;
	}
	static public function logoutMobile($UserID,$Token){
		$db = new user_db;
		$db->delUserToken($UserID,$Token);
	}
	static public function logout(){
		$db = new  user_db;
		$db->delUserToken(@$_SESSION['user']['UserID'],session_id());
		unset($_SESSION['user']);
		self::setCookie("uid",0,time()-3600*24);
		self::setCookie("token",0,time()-3600*24);
	}
	static public function getUserFromSession(){
		if(isset($_SESSION['user'])){
			return $_SESSION['user'];
		}else{
			self::logout();
		}
	}
	static public function getUserByID( $userID ){
		$db = new user_db;
		return $db->getUserByID( $userID );
	}
	static public function isAddressExist($AddressID){
		$db = new user_db;
		$Address = $db->getAddress($AddressID);
		if(isset($Address['AddressID']))
			return true;
		else
			return false;
	}
	static public function setCookie($k,$v,$t){
		header( 'p3p:CP="IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT"');
		setcookie($k,$v,$t,"/");
	}
	static public function pwd($password){
		return md5(sha1(md5($password).$password));
	}
}
