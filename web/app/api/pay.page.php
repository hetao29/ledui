<?php
/**
 * ֧���ӿ���֧�����ؽӿ�
 */
class api_pay{
	/**
	 * �û�ע��
	 */
	public function pageRegister($inPath){
		$result = new api_result;
		$result->error_code=3;
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
