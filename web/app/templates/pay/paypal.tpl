<form id="order-pay-form" method="post" action="https://www.paypal.com/cgi-bin/webscr" target="_blank" sid="{$order_id}">
	<!-- PayPal Configuration -->
	<input type="hidden" name="business" value="hetao@hetao.name">
	<input type="hidden" name="useraction" value="commit">
	<input type="hidden" name="cmd" value="_xclick">
	<input type="hidden" name="return" value="http://ledui.com">
	<input type="hidden" name="cancel_return" value="http://ledui.com">
	<input type="hidden" name="notify_url" value="http://ledui.com">
	<input type="hidden" name="rm" value="2">
	<input type="hidden" name="currency_code" value="USD">
	<input type="hidden" name="lc" value="USA">
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
