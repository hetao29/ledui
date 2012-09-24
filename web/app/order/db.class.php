<?php
class order_db{
	private $_dbConfig;
	private $_zone;
	function __construct($zone="user"){
		$this->_zone = $zone;
		$this->_dbConfig = SDb::getConfig($this->_zone);
		$this->_db = new SDb("pdo_mysql");
		$this->_db->init($this->_dbConfig);
	}
	function getOrder($OrderID,$UserID=0){
		if(empty($UserID)){
			return $this->_db->selectOne("t_order",array("OrderID"=>$OrderID));
		}else{
			return $this->_db->selectOne("t_order",array("OrderID"=>$OrderID,"UserID"=>$UserID));
		}
	}
/*
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
*/
	function addOrder($Order){
		if(isset($Order['OrderID']))unset($Order['OrderID']);
		return $this->_db->insert("t_order",$Order);
	}
	function updateOrder($Order){
		return $this->_db->update("t_order",array("OrderID"=>$Order["OrderID"]),$Order);
	}
}
