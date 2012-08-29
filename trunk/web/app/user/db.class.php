<?php
class user_db{
	private $_dbConfig;
	private $_zone;
	function __construct($zone="user"){
		$this->_zone = $zone;
		$this->_dbConfig = SDb::getConfig($this->_zone);
		$this->_db = new SDb("pdo_mysql");
		$this->_db->init($this->_dbConfig);
	}
	function getUser($UserName){
		return $this->_db->selectOne("t_user",array("UserName"=>$UserName));
	}
	function getUserByEmail($useremail,$PartnerID=1){
		return $this->_db->selectOne("t_user",array("UserSID"=>$useremail,"PartnerID"=>$PartnerID));
	}
	function getUserByID($UserId){
		return $this->_db->selectOne("t_user",array("UserID"=>$UserId));
	}
	function delUserToken($UserID,$Token){
		return $this->_db->delete("t_user_token",array("UserToken"=>$Token,"UserID"=>$UserID));
	}
	function getUserToken($UserID,$Token){
		return $this->_db->selectOne("t_user_token",array("UserToken"=>$Token,"UserID"=>$UserID));
	}
	function addUserToken($Token){
		$Token['UserTokenExpiredTime']=time()+3600*24*365;//一年过期
		return $this->_db->insert("t_user_token",$Token,true);
	}
	function addUser($User){
		if(isset($User['UserID']))unset($User['UserID']);
		return $this->_db->insert("t_user",$User);
	}
}
