<?php
class api_address{
	var $result;
	var $token;
	var $uid;
	/**
	  *
	  */
	public function __construct($inPath){
		$this->result = new api_result;
		$this->token = $_REQUEST['token'];
		$this->uid = $_REQUEST['uid'];

		if(user_api::isLoginMobile($this->uid,$this->token) != true){
			$this->result->error_msg=SLanguage::tr("error_4","error");
			$this->result->error_code=-4;
			echo SJson::encode($this->result);
			exit;
		}
	}
	/**
	 * 列出地址
	 */
	public function pageList($inPath){
		$db = new user_db;
		$address = $db->listAddress($this->uid);
		if($address){
			$this->result->result=$address;
		}
		return SJson::encode($this->result);
	}
	/**
	  * 删除地址
	  */
	public function pageDel($inPath){
		$db = new user_db;
		$id= $_REQUEST['id'];
		$address = $db->getAddress($id,$this->uid);
		if($address){
			$r=$db->delAddress($id);
			if($r){
				$this->result->result=$id;
			}else{
				$this->result->error_msg=SLanguage::tr("error_10012","error");
				$this->result->error_code=-10012;
			}
		}else{
			$this->result->error_msg=SLanguage::tr("error_10011","error");
			$this->result->error_code=-10011;
		}
		return SJson::encode($this->result);
	}
}
