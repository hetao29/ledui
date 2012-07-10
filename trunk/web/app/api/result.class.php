<?php
class api_result{
	var $error_msg;
	var $error_code;
	var $result ;
	
	public function __construct(){
		$this->result = new stdclass;
		$this->error_code = 0;
		$this->error_msg = "";
	}

}