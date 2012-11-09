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
	function getUserByID($UserID){
		return $this->_db->selectOne("t_user",array("UserID"=>$UserID));
	}
	function delUserToken($UserID,$Token){
		return $this->_db->delete("t_user_token",array("UserToken"=>$Token,"UserID"=>$UserID));
	}
	function getUserToken($UserID,$Token){
		return $this->_db->selectOne("t_user_token",array("UserToken"=>$Token,"UserID"=>$UserID));
	}
	function updateUserToken($UserID,$Token){
		return $this->_db->update("t_user_token",array("UserToken"=>$Token,"UserID"=>$UserID),array("UserTokenExpiredTime"=>time()+3600*24*10));
	}
	function addUserToken($Token){
		return $this->_db->insert("t_user_token",$Token,true);
	}
	function addUser($User){
		if(isset($User['UserID']))
			unset($User['UserID']);
		return $this->_db->insert("t_user",$User);
	}
	function addDevice($device){
		return $this->_db->insert("t_user_device",$device);
	}
	function addUserProfile($UserP){
		return $this->_db->insert("t_user_profile",$UserP);
	}
	function updateUserProfile($UserID,$UserP){
		return $this->_db->update("t_user_profile",array("UserID"=>$UserID),$userP);
	}
	function getUserProfileByID($UserID){
		return $this->_db->selectOne("t_user_profile",array("UserID"=>$UserID));
	}
	function delUserProfileByID($UserID){
		return $this->_db->delete("t_user_profile",array("UserID"=>$UserID));
	}
	function addAddress($Add){
		if(isset($Add['AddressID']))
			unset($Add['AddressID']);
		return $this->_db->insert("t_user_address",$Add);
	}
	function getAddress($AddressID,$UserID=0){
		if($UserID){
			return $this->_db->selectOne("t_user_address",array("AddressID"=>$AddressID,"UserID"=>$UserID));
		}else{
			return $this->_db->selectOne("t_user_address",array("AddressID"=>$AddressID));
		}
	}
	function listAddress($UserID){
		return $this->_db->select("t_user_address",array("UserID"=>$UserID),"","",$orderby=array("_order"=>"ASC"));
	}
	function updateAddress($AddID,$Add){
		return $this->_db->update("t_user_address",array("AddressID"=>$AddID),$Add);
	}
	function delAddress($AddID){
		return $this->_db->delete("t_user_address",array("AddressID"=>$AddID));
	}
	function updateAddressDef($AddID,$IsDef){
		return $this->_db->update("t_user_address",array("AddressID"=>$AddID),array("_isDef"=>$IsDef));
	}
	function updateAddressDelByAddID($AddID,$IsDel){
		return $this->_db->update("t_user_address",array("AddressID"=>$AddID),array("_isDel"=>$IsDel));
	}
	function updateAddressDelByUserID($UserID,$IsDel){
		return $this->_db->update("t_user_address",array("UserID"=>$UserID),array("_isDel"=>$IsDel));
	}
	function getAddressListByUserID($UserID,$IsDel){
		return $this->_db->select("t_user_address",array("UserID"=>$UserID,"_isDel"=>$IsDel),"",array("_isDef"=>"desc","AddressID"=>"asc"));
	}
	function getUserTotal($Where){
		return $this->_db->execute("select count(*) from t_user where $Where"); 
	}
	function listUsers($Where,$Page,$Limit){
		$this->_db->setLimit($Limit);
		$this->_db->setPage($Page);
		return $this->_db->select("t_user",$Where);
	}

}
