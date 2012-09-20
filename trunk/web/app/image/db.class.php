<?php
class image_db{
	private $_dbConfig;
	private $_zone;
	function __construct($zone="user"){
		$this->_zone = $zone;
		$this->_dbConfig = SDb::getConfig($this->_zone);
		$this->_db = new SDb("pdo_mysql");
		$this->_db->init($this->_dbConfig);
	}
	function getImage($ImageFileID,$UserID=0){
		if($UserID){
			return $this->_db->selectOne("t_image",array("ImageFileID"=>$ImageFileID,"UserID"=>$UserID));
		}else{
			return $this->_db->selectOne("t_image",array("ImageFileID"=>$ImageFileID));
		}
	}
	/*
	function addMoney($Money){
		if(isset($Money['UserID']))
			unset($Money['UserID']);
		return $this->_db->insert("t_money",$Money);
	}
	function updateMoneyByID($UserID,$Money){
		return $this->_db->update("t_money",array("UserID"=>$userID),$Money);
	}
	function getMoneyByID($UserID){
		return $this->_db->selectOne("t_money",array("UserID"=>$UserID));
	}
	*/
}
