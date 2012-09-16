<?php
class money_db{
	private $_dbConfig;
	private $_zone;
	function __construct($zone="user"){
		$this->_zone = $zone;
		$this->_dbConfig = SDb::getConfig($this->_zone);
		$this->_db = new SDb("pdo_mysql");
		$this->_db->init($this->_dbConfig);
	}
	function addScore($Score){
		if(isset($Score['UserID']))
			unset($Score['UserID']);
		return $this->_db->insert("t_score",$Score);
	}
	function updateScoreByID($UserID,$Score){
		return $this->_db->update("t_score",array("UserID"=>$userID),$Score);
	}
	function getScoreByID($UserID){
		return $this->_db->selectOne("t_score",array("UserID"=>$UserID));
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
}
