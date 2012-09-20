<?php
class api_postcard{
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
	 * 新增/修改明信片
	 * 1.判定是不是已经有PostCardID，如果有值，且数据库里的值，且是本人的话，就是修改，没有就是新增
	 * 2.判定有没有ImageFileID，如果有值，且数据库里有值，且是本人的话，就直接可以完成，没有就生成一个
	 * 3.判定有没有订单，如果没有，生成订单(根据接收人数据，国家，判定价格)
	 *   如果有订单了的话，就修改/调整订单，然后返回
	 * 4.判定积分(TODO)
	 */
	public function pagePost($inPath){
		$result = new api_result;
		$PostCard = SJson::decode($_REQUEST['PostCard']);

		$data=new stdclass;
		$data->PostCardID="TO GEN";
		$data->LocalID=$_REQUEST['PostCard']['LocalID'];
		$data->ImageFileID="TO GEN";
		$data->OrderID="TO GEN";
		$data->PayURL="TO GEN";
		
		//$result->error_msg=SLanguage::tr("error_10001","error");
		$result->error_code=0;
		$result->result=$data;
		return SJson::encode($result);
	}
	/**
	 * 列出明信片
	 * 只列出状态标记为未删除的明信片
	 */
	public function pageDel($inPath){
	}
	/**
	 * 删除明信片
	 * 实际上不删除，只是标记
	 */
	public function pageDel($inPath){
	}
}
