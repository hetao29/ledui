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
	function addImage($Image){
		if(empty($Image['ImageFileID']))return false;
		if(empty($Image['UserID']))return false;
		$Image['_insertTime']=date("Y-m-d H:i:s");
		return $this->_db->insert("t_image",$Image);
	}
	function addExif($Exif){
		if(empty($Exif['ImageFileID']))return false;
		$Exif['_insertTime']=date("Y-m-d H:i:s");
		return $this->_db->insert("t_exif",$Exif,true);
	}
	function delImage($ImageFileID,$UserID){
		return $this->_db->delete("t_image",array("ImageFileID"=>$ImageFileID,"UserID"=>$UserID));
	}
	/*
	function updateMoneyByID($UserID,$Money){
		return $this->_db->update("t_money",array("UserID"=>$userID),$Money);
	}
	function getMoneyByID($UserID){
		return $this->_db->selectOne("t_money",array("UserID"=>$UserID));
	}
	*/
}
