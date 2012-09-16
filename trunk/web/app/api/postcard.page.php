<?php
class api_postcard{
	/**
	 * 新增明信片
	 */
	public function pageAdd($inPath){
		$result = new api_result;
		$userID = $_REQUEST['UserID'];
		$token = $_REQUEST['Token'];
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
