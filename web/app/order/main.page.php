<?php
class order_main extends STpl{
	var $result;
	var $token;
	var $uid;
	/**
	 * 支付接口
	 * http://www.ledui.com/order.main.pay/
	 * OrderID=$OrderID&
	 * Currency=$Code& 必须，默认CNY
	 * Score=$Score& 兑换积数，默认0
	 * Money=&Money 现金数，默认0
	 * token=$token& 必须
	 * uid=$uid 必须
	 */
	public function pagePay($inPath){
		$this->result = new api_result;
		if(empty($_REQUEST['OrderID']) || empty($_REQUEST['uid']) || empty($_REQUEST['token'])){
			$this->result->error_msg=SLanguage::tr("error_1","error");
			$this->result->error_code=-1;
			return $this->result;
		}
		$this->token = $_REQUEST['token'];
		$this->uid = $_REQUEST['uid'];

		if(user_api::isLoginMobile($this->uid,$this->token) != true){
			$this->result->error_msg=SLanguage::tr("error_4","error");
			$this->result->error_code=-4;
			return $this->result;
		}
		$order_db = new order_db;
		$Order = $order_db->getOrder($_REQUEST['OrderID']);
		if(empty($Order) || $Order['UserID']!=$this->uid){
			$this->result->error_msg=SLanguage::tr("error_4","error");
			$this->result->error_code=-4;
			return $this->result;
		}
		//TODO判断订单状态，不能重复支付
		$currS= money_config::currency();
		if(empty($_REQUEST['Currency']) || !in_array($_REQUEST['Currency'],array_keys($currS))){
			$Currency=money_config::$defaultCurrency;
		}else{
			$Currency=$_REQUEST['Currency'];
		}
		//修改支付方式 
		//根据货币，与汇率，算出实际支付
		$rate = $currS[$Currency]['rate'];
		$updateOrder=array();
		$updateOrder['OrderID']	= $Order['OrderID'];
		$updateOrder['ActualMoneyAmount'] = ceil($Order['OrderAmount']/$rate*100)/100;
		$updateOrder['ActualMoneyExchangeRate'] = $rate;
		$updateOrder['ActualMoneyCurrency'] = $Currency;

		//TODO version判定
		$updateOrder['_version'] = $Order['_version']+1;
		//TODO 积分
		//TODO 余额支付
		define("DEBUG",true);
		//print_r($Currency);
		//print_r($Order);
		$order_db->updateOrder($updateOrder);
		//开始支付
		if($Currency==money_config::$defaultCurrency){
			order_api::alipay($Order);
		}else{
			order_api::paypal($Order);
		}
	}
	/*
	public function PagePayWap($inPath){
		return $this->pagePay($inPath);
	}
	public function pagePayPal($inPath){
		return $this->render("pay/paypal.tpl");
	}
	*/
	/**
	 * 支付宝通知接口
	 */
	public function PageAliPayReturn($inPath){
		error_log(__FILE__.":".__LINE__."\n",3,"/tmp/pay.log");
		error_log(var_export($_REQUEST,true),3,"/tmp/pay.log");
		print_r($inPath);
		print_r($_GET);
	}
	public function PageAliPayCancel($inPath){
		error_log(__FILE__.":".__LINE__."\n",3,"/tmp/pay.log");
		error_log(var_export($_REQUEST,true),3,"/tmp/pay.log");
		print_r($inPath);
		print_r($_GET);
	}
	public function PageAliPayNotify($inPath){
		error_log(__FILE__.":".__LINE__."\n",3,"/tmp/pay.log");
		error_log(var_export($_REQUEST,true),3,"/tmp/pay.log");
		print_r($inPath);
		print_r($_GET);
	}

	public function PagePaypalReturn($inPath){
		error_log(__FILE__.":".__LINE__."\n",3,"/tmp/pay.log");
		error_log(var_export($_REQUEST,true),3,"/tmp/pay.log");
		print_r($inPath);
		print_r($_GET);
	}
	public function PagePaypalCancel($inPath){
		header("location:/");
		return;
	}
	public function PagePaypalNotify($inPath){
		error_log(__FILE__.":".__LINE__."\n",3,"/tmp/pay.log");
		error_log(var_export($_REQUEST,true),3,"/tmp/pay.log");
		print_r($inPath);
		print_r($_GET);
	}

}
