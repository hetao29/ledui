<?php
class order_api{
	public static $subject="乐兑明信片";
	public function __construct(){
	}
	/**
	  * 支付宝支付
	  */
	public function alipay($Order){
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

		/**
		 * ************************************************************************************************
		 */

		/**
		 * *******************************alipay_Wap_Auth_AuthAndExecute***********************************
		 */

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
		$params['item_number']	= $Order['OrderID'];
		$params['quantity']	= 1;

		$params['amount']	= $Order['ActualMoneyAmount']/100;
		$hosts = "https://www.paypal.com/cgi-bin/webscr?" . http_build_query($params);
		header("location:$hosts");
	}
	//for test
	private function PagePayWeb($inPath){
		$OrderID=@$inPath[3];
		if(empty($OrderID)){
			//ID为空
		}
		//判断是不是当前的用户
		//获取货币类型，不同的货币类型，走不同的支付接口
		if(true){
			include_once(ROOT."/libs/pay/alipay/alipay.config.php");
			include_once(ROOT."/libs/pay/alipay/lib/alipay_service.class.php");
		}
		//生成支付URL，重定向走

		print_r($inPath);
		//必填参数//

		//请与贵网站订单系统中的唯一订单号匹配
		$out_trade_no = $OrderID;
		$subject      = "乐兑明信片";
		//订单描述、订单详细、订单备注，显示在支付宝收银台里的“商品描述”里
		$body         = "乐兑明信片，把你的照片寄送给家人，朋友";
		//订单总金额，显示在支付宝收银台里的“应付总额”里
		//$total_fee    = 500;
		$price				= 0.01;

		$logistics_fee		= "0.00";				//物流费用，即运费。
		$logistics_type		= "EXPRESS";			//物流类型，三个值可选：EXPRESS（快递）、POST（平邮）、EMS（EMS）
		$logistics_payment	= "SELLER_PAY";			//物流支付方式，两个值可选：SELLER_PAY（卖家承担运费）、BUYER_PAY（买家承担运费）

		$quantity			= "1";					//商品数量，建议默认为1，不改变值，把一次交易看成是一次下订单而非购买一件商品。
		//网站商品的展示地址，不允许加?id=123这类自定义参数
		$show_url			= "http://www.xxx.com/myorder.php";

		/************************************************************/

		//构造要请求的参数数组
		$parameter = array(
				"service"			=> "create_partner_trade_by_buyer",
				"payment_type"		=> "1",

				"partner"			=> trim($aliapy_config['partner']),
				"_input_charset"	=> trim(strtolower($aliapy_config['input_charset'])),
				"seller_email"		=> trim($aliapy_config['seller_email']),
				"return_url"		=> trim($aliapy_config['return_url']),
				"notify_url"		=> trim($aliapy_config['notify_url']),

				"out_trade_no"		=> $out_trade_no,
				"subject"			=> $subject,
				"body"				=> $body,
				"price"				=> $price,
				"quantity"			=> $quantity,

				"logistics_fee"		=> $logistics_fee,
				"logistics_type"	=> $logistics_type,
				"logistics_payment"	=> $logistics_payment,

				"receive_name"		=> $receive_name,
				"receive_address"	=> $receive_address,
				"receive_zip"		=> $receive_zip,
				"receive_phone"		=> $receive_phone,
				"receive_mobile"	=> $receive_mobile,

				"show_url"			=> $show_url
					);

		//构造担保交易接口
		$alipayService = new AlipayService($aliapy_config);
		$html_text = $alipayService->create_partner_trade_by_buyer($parameter);
		echo $html_text;exit;



		//扩展功能参数——默认支付方式//

		//默认支付方式，取值见“纯网关接口”技术文档中的请求参数列表
		$paymethod    = '';
		//默认网银代号，代号列表见“纯网关接口”技术文档“附录”→“银行列表”
		$defaultbank  = '';

		//if ($_POST['pay_bank'] == 'directPay'){
		$paymethod = 'directPay';
		//}
		//else {
		//$paymethod = 'bankPay';
		//$defaultbank = "";//$_POST['pay_bank'];
		//}

		//扩展功能参数——防钓鱼//

		//防钓鱼时间戳
		$anti_phishing_key  = '';
		//获取客户端的IP地址，建议：编写获取客户端IP地址的程序
		$exter_invoke_ip = '';
		//注意：
		//1.请慎重选择是否开启防钓鱼功能
		//2.exter_invoke_ip、anti_phishing_key一旦被使用过，那么它们就会成为必填参数
		//3.开启防钓鱼功能后，服务器、本机电脑必须支持SSL，请配置好该环境。
		//示例：
		//$exter_invoke_ip = '202.1.1.1';
		//$ali_service_timestamp = new AlipayService($aliapy_config);
		//$anti_phishing_key = $ali_service_timestamp->query_timestamp();//获取防钓鱼时间戳函数


		//扩展功能参数——其他//

		//商品展示地址，要用 http://格式的完整路径，不允许加?id=123这类自定义参数
		$show_url			= 'http://www.ledui.com/';
		//自定义参数，可存放任何内容（除=、&等特殊字符外），不会显示在页面上
		$extra_common_param = '';

		//扩展功能参数——分润(若要使用，请按照注释要求的格式赋值)
		$royalty_type		= "";			//提成类型，该值为固定值：10，不需要修改
		$royalty_parameters	= "";
		//注意：
		//提成信息集，与需要结合商户网站自身情况动态获取每笔交易的各分润收款账号、各分润金额、各分润说明。最多只能设置10条
		//各分润金额的总和须小于等于total_fee
		//提成信息集格式为：收款方Email_1^金额1^备注1|收款方Email_2^金额2^备注2
		//示例：
		//royalty_type 		= "10"
		//royalty_parameters= "111@126.com^0.01^分润备注一|222@126.com^0.01^分润备注二"

		/************************************************************/

		//构造要请求的参数数组
		$parameter = array(
				"service"			=> "create_partner_trade_by_buyer",
				"payment_type"		=> "1",

				"partner"			=> trim($aliapy_config['partner']),
				"_input_charset"	=> trim(strtolower($aliapy_config['input_charset'])),
				"seller_email"		=> trim($aliapy_config['seller_email']),
				"return_url"		=> trim($aliapy_config['return_url']),
				"notify_url"		=> trim($aliapy_config['notify_url']),

				"out_trade_no"		=> $out_trade_no,
				"subject"			=> $subject,
				"body"				=> $body,
				"total_fee"			=> $total_fee,

				"paymethod"			=> $paymethod,
				"defaultbank"		=> $defaultbank,

				"anti_phishing_key"	=> $anti_phishing_key,
				"exter_invoke_ip"	=> $exter_invoke_ip,

				"show_url"			=> $show_url,
				"extra_common_param"=> $extra_common_param,

				"royalty_type"		=> $royalty_type,
				"royalty_parameters"=> $royalty_parameters
					);

		//构造纯网关接口
		//		$alipayService = new AlipayService($aliapy_config);
		//		$html_text = $alipayService->create_direct_pay_by_user($parameter);
		//echo $html_text;exit;
		$alipayService = new AlipaySubmit();
		$html_text = $alipayService->buildRequestPara($parameter,$aliapy_config);
		print_r($html_text);
		$service = new AlipayService($aliapy_config);
		$html_text = $service->alipay_gateway_new.$alipayService->buildRequestParaToString($parameter,$aliapy_config);
		//echo $html_text;exit;
		header("location:$html_text");
	}
}
