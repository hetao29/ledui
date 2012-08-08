<?php
class user_validator{
	/**
	  -1 	email错误
	  1	email正确
	 **/
	function pageEntry($inPath){
		$r = new stdclass;
		$r->result=-1;
		$r->msg="";

		if(!empty($_REQUEST['type'])){
			if($_REQUEST['type']=="email"){
				if(SUtil::validEmail(@$_REQUEST['value'])) $r->result=1;
				else $r->msg="请输入正确的email";
			}elseif($_REQUEST['type']=="password"){
				if(strlen(@$_REQUEST['value'])<5){
					$r->msg="密码长度不能小于5位";
				}else{
					$r->result=1;
				}
			}
		}
		return $r;
	}

}
