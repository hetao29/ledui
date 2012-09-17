<?php
class api_postcard{
	/**
	 * 新增明信片
	 */
	public function pageAdd($inPath){
		$result = new api_result;
		$userID = $_REQUEST['UserID'];
		$token = $_REQUEST['Token'];
		$PostCard = SJson::decode($_REQUEST['PostCard']);
		error_log(var_export($_REQUEST,true),3,"/tmp/log.postcard.log");
		error_log(var_export($PostCard,true),3,"/tmp/log.postcard.log");
		$data=new stdclass;
		$data->PostCardID="TO GEN";
		$data->LocalID=$_REQUEST['PostCard']['LocalID'];
		$data->ImageFileID="TO GEN";
		$data->OrderID="TO GEN";
		$data->PayURL="TO GEN";
		
		if(user_api::isLoginMobile($userID,$token) == true){
		}
		//$result->error_msg=SLanguage::tr("error_10001","error");
		$result->error_code=0;
		$result->result=$data;
		return SJson::encode($result);
	}
}
