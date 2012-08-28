<?php
/**
 * 支付接口与支付返回接口
 */
class api_pay{
	/**
	 * 用户注册
	 */
	public function pageRegister($inPath){
		$result = new api_result;
		$result->error_code=3;
		return SJson::encode($result);
	}
	/**
	 * 用户登录
	 */
	public function pageLogin($inPath){
		$result = new stdclass;
		$result->x=3;
		return SJson::encode($result);
	}
	/**
	 * 用户信息获取
	 */
	public function pageInfo($inPath){
		$result = new stdclass;
		$result->x=3;
		return SJson::encode($result);
	}
}
