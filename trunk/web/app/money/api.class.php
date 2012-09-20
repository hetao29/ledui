<?php
class money_api{
	/**
	  */
	static public function getCurrentScoreByID($UserID){
		$db = new  money_db;
		$Score = $db->getScoreByID($UserID);
		if(isset($Score['ScoreCurrent']))
			return $Score['ScoreCurrent'];
		else
			return false;	
	}
	static public function getCurrentMoneyByID($UserID){
		$db = new  money_db;
		$Money = $db->getMoneyByID($UserID);
		if(isset($Money['MoneyCurrent'])){
			$Data['MoneyCurrent'] = $Money['MoneyCurrent'];
			$Data['MoneyCurrency'] = $Money['MoneyCurrency'];
			return $Data;
		}else{
			return false;
		}
	}

}
