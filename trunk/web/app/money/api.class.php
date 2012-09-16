<?php
class order_api{
	var $db;
	public function __construct(){
		$this->db = new api_db;
	}
	/**
	  * 新建立一下订单
	  * @param int $UserID  用户ID
	  * @param int $OrderCost 
	  */
	public function addOrder($UserID,$OrderCost,$TotalPrice,$Score,$AddressID,$OrderComment){
	}

}
