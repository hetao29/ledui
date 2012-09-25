<?php
SLog::$LOGFILE="/tmp/order.log";
class order_api{
	public static $subject="乐兑明信片";
	public function __construct(){
	}
	/**
	  * 支付宝支付
	  */
	public static function alipay($Order){
		include_once(ROOT."/libs/pay/alipay_wap/alipay_config.php");
		include_once(ROOT."/libs/pay/alipay_wap/class/alipay_service.php");
		$out_trade_no=$Order['TradeNo'];
		$total_fee=$Order['ActualMoneyAmount']/100;
		$out_user=$Order['UserID'];
		// 构造要请求的参数数组，无需改动
		$pms1 = array (
				"req_data" => '<direct_trade_create_req><subject>' . self::$subject . '</subject><out_trade_no>' . $out_trade_no . '</out_trade_no><total_fee>' . $total_fee . "</total_fee><seller_account_name>" . $seller_email . "</seller_account_name><notify_url>" . $notify_url . "</notify_url><out_user>" . $_GET ["out_user"] . "</out_user><merchant_url>" . $merchant_url . "</merchant_url>" . "<call_back_url>" . $call_back_url . "</call_back_url></direct_trade_create_req>",
				"service" => $Service_Create,
				"sec_id" => $sec_id,
				"partner" => $partner,
				"req_id" => date ( "Ymdhms" ),
				"format" => $format,
				"v" => $v 
			      );

		// 构造请求函数
		$alipay = new alipay_service ();

		// 调用alipay_wap_trade_create_direct接口，并返回token返回参数
		$token = $alipay->alipay_wap_trade_create_direct ( $pms1, $key, $sec_id );

		// 构造要请求的参数数组，无需改动
		$pms2 = array (
				"req_data" => "<auth_and_execute_req><request_token>" . $token . "</request_token></auth_and_execute_req>",
				"service" => $Service_authAndExecute,
				"sec_id" => $sec_id,
				"partner" => $partner,
				"call_back_url" => $call_back_url,
				"format" => $format,
				"v" => $v 
			      );

		// 调用alipay_Wap_Auth_AuthAndExecute接口方法，并重定向页面
		$alipay->alipay_Wap_Auth_AuthAndExecute ( $pms2, $key );
	}
	/**
	  *
	  */
	public static function alipayReturn(){
		SLog::write("AlipayReturn:");
		SLog::write($_GET);
		$TradeNo = $_GET ['out_trade_no']; // 外部交易号
		$order_db = new order_db;
		$Order = $order_db->getOrderByTradeNo($TradeNo);
		if(empty($Order)){
			SLog::write("Fail:-1");
			return false;
		}
		include_once(ROOT."/libs/pay/alipay_wap/alipay_config.php");
		include_once(ROOT."/libs/pay/alipay_wap/class/alipay_notify.php");
		$alipay = new alipay_notify ( $partner, $key, $sec_id, $_input_charset );
		$verify_result = $alipay->return_verify ();
		if($verify_result){
			$myresult = $_GET ['result']; // 订单状态，是否成功
			$mytrade_no = $_GET ['trade_no']; // 交易号

			if ($_GET ['result'] == 'success') {
				if($Order['OrderStatus']!=order_status::OrderPaying){
					SLog::write("Success,but may be re paied?,status is:".$Order['OrderStatus']);
				}else{
					SLog::write("Success");
				}
				//更新订单
				$Order['OrderStatus']=order_status::OrderPaid;
				$order_db->updateOrder($Order);
				//to成功页面,支付成功，提示关闭
				return true;
			}else{
				SLog::write("Fail:-2");
			}

		}else{
			SLog::write("AlipayReturn:verify_result error");
			SLog::write($verify_result);
		}
		//更新订单
		$Order['OrderStatus']=order_status::OrderFailed;
		$order_db->updateOrder($Order);
		//to失败页面,支付失败，提示重新支付
		return false;
	}
	public static function alipayNotify(){
		SLog::write("AlipayNotify:");
		SLog::write($_REQUEST);
		include_once(ROOT."/libs/pay/alipay_wap/alipay_config.php");
		include_once(ROOT."/libs/pay/alipay_wap/class/alipay_notify.php");
		$alipay = new alipay_notify ( $partner, $key, $sec_id, $_input_charset );
		$verify_result = $alipay->return_verify ();
		Slog::write("Result:$verify_result");
		if($verify_result){
			$status = getDataForXML ( $_POST ['notify_data'], '/notify/trade_status' );
			if ($status == 'TRADE_FINISHED'){
				Slog::write("Success");
				return true;
			}
		}
		Slog::write("Fail");
		return false;
	}
	/**
	  * 贝宝支付
	  */
	public function paypal($Order){
		//服务端获取通知地址，用户交易完成异步返回地址
		$notify_url		= "http://www.ledui.com/order.main.paypalNotify";			
		$call_back_url	= "http://www.ledui.com/order.main.paypalReturn";			//用户交易完成同步返回地址
		$merchant_url	= "http://www.ledui.com/order.main.paypalCancel";			//用户付款中途退出返回地址
		$params=array();
		$params['business']	= "hetao@hetao.name";
		$params['useraction']	= "commit";
		$params['cmd']		= "_xclick";
		$params['return']	= $call_back_url;
		$params['cancel_return']= $merchant_url;
		$params['notify_url']	= $notify_url;
		$params['rm']		= "2";
		$params['currency_code']= $Order['ActualMoneyCurrency'];
		$params['lc']		= "HKD";
		$params['charset']	= "utf-8";
		$params['no_shipping']	= "1";
		$params['no_note']	= "1";
		$params['item_name']	= self::$subject;
		$params['item_number']	= $Order['TradeNo'];
		$params['quantity']	= 1;

		$params['amount']	= $Order['ActualMoneyAmount']/100;
		$hosts = "https://www.paypal.com/cgi-bin/webscr?" . http_build_query($params);
		header("location:$hosts");
	}
}
