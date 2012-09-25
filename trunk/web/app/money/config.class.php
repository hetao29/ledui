<?php
class money_config{
	public static $scoreRate=0.01;			//1积分兑换1分
	public static $postcardPrice=590;		//明信片单价590分
	public static $postcardPriceOther=1790;		//明信片单价(国外)590分
	public static $postcardShippingCost=0;		//明信片单价运费
	public static $postcardShippingCostOther=0;	//明信片单价运费(国外)
	public static $defaultCurrency="CNY";
	private static $Currency=array(
			"CNY"=>array("name"=>"CNY","code"=>"CNY","symbol"=>"¥","rate"=>1),		//人民币
			"USD"=>array("name"=>"USD","code"=>"USD","symbol"=>"$","rate"=>6.3),	//美元
			"EUR"=>array("name"=>"EUR","code"=>"EUR","symbol"=>"€","rate"=>8.1),	//欧元	
			"HKD"=>array("name"=>"HKD","code"=>"HKD","symbol"=>"$","rate"=>0.8),	//港元
			"CAD"=>array("name"=>"CAD","code"=>"CAD","symbol"=>"$","rate"=>6.4),	//加拿大元
			"AUD"=>array("name"=>"AUD","code"=>"AUD","symbol"=>"$","rate"=>6.5),	//澳大利亚元
			"MYR"=>array("name"=>"MYR","code"=>"MYR","symbol"=>"M","rate"=>2.0)		//马来西亚林吉特 
		);
	public static function currency(){
		foreach(self::$Currency as $k=>&$v){
			$v['name']=SLanguage::tr($v['code'],"currency");
		}
		return self::$Currency;
	}


}
