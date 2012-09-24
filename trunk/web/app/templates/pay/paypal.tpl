ok.澳元（A $）	AUD
ok.加元（C $）	CAD
ok.欧元（€）	EUR
ok.英镑（£）	GBP
日元（¥）	JPY
美元（$）	USD
新西兰元($)	NZD
瑞士法郎	CHF
港币($)	HKD
新加坡元($)	SGD
瑞典克朗	SEK
丹麦克朗	DKK
波兰兹罗提	PLN
挪威克朗	NOK
匈牙利福林	HUF
捷克克朗	CZK
以色列新谢克尔	ILS
墨西哥比索	MXN
巴西雷亚尔（仅适用于巴西用户）	BRL
马来西亚林吉特（仅适用于马来西亚用户）	MYR
菲律宾比索	PHP
新台币	TWD
泰铢	THB
<form id="order-pay-form" method="post" action="https://www.paypal.com/cgi-bin/webscr" target="_blank" sid="{$order_id}">
	<!-- PayPal Configuration -->
	<input type="hidden" name="business" value="hetao@hetao.name">
	<input type="hidden" name="useraction" value="commit">
	<input type="hidden" name="cmd" value="_xclick">
	<input type="hidden" name="return" value="http://ledui.com">
	<input type="hidden" name="cancel_return" value="http://ledui.com">
	<input type="hidden" name="notify_url" value="http://ledui.com">
	<input type="hidden" name="rm" value="2">
	<input type="hidden" name="currency_code" value="HKD">
	<input type="hidden" name="lc" value="HKD">
	<input type="hidden" name="charset" value="utf-8" />

	<!-- Payment Page Information -->
	<input type="hidden" name="no_shipping" value="1">
	<input type="hidden" name="no_note" value="1">

	<!-- Product Information -->
	<input type="hidden" name="item_name" value="item_name">
	<input type="hidden" name="amount" value="0.01">
	<input type="hidden" name="quantity" value="1">
	<input type="hidden" name="item_number" value="1">

	<!-- Customer Information -->
	<input type="hidden" name="first_name" value="first_name">
	<input type="hidden" name="last_name" value="">
	<input type="hidden" name="address1" value="address1">
	<input type="hidden" name="address2" value="">

	<input type="hidden" name="zip" value="100066">
	<input type="hidden" name="email" value="x@x.com">
	<input type="submit" class="formbutton gotopay" value="Go to PayPal" style="vertical-align:middle;"/>
</form>
