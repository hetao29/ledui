<?php
class api_user{
	/**
	 * �û�ע��
	 */
	public function pageRegister($inPath){
		$result = new stdclass;
		$result->x=3;
		return SJson::encode($result);
	}
	/**
	 * �û���¼
	 */
	public function pageLogin($inPath){
		$result = new stdclass;
		$result->x=3;
		return SJson::encode($result);
	}
	/**
	 * �û���Ϣ��ȡ
	 */
	public function pageInfo($inPath){
		$result = new stdclass;
		$result->x=3;
		return SJson::encode($result);
	}
}