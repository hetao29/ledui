<?php
class postcard_db{
	private $_dbConfig;
	private $_zone;
	function __construct($zone="user"){
		$this->_zone = $zone;
		$this->_dbConfig = SDb::getConfig($this->_zone);
		$this->_db = new SDb("pdo_mysql");
		$this->_db->init($this->_dbConfig);
	}
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
	function getPostCard($PostCardID,$UserID=0){
		if($UserID){
			return $this->_db->selectOne("t_postcard",array("PostCardID"=>$PostCardID,"UserID"=>$UserID));
		}else{
			return $this->_db->selectOne("t_postcard",array("PostCardID"=>$PostCardID));
		}
	}
	function addPostCard($PostCard){
		if(isset($PostCard['PostCardID']))
			unset($PostCard['PostCardID']);
		return $this->_db->insert("t_postcard",$PostCard);
	}
	function updatePostCardStatus($PostCardID,$PostCardStatus){
		return $this->_db->update("t_postcard",array("PostCardID"=>$PostCardID),array("PostCardStatus"=>$PostCardStatus));
	}
}
