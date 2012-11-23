<?php
error_log("\n\n",3,"/tmp/postcard.log");
error_log(var_export($_REQUEST,true),3,"/tmp/postcard.log");
error_log(var_export($_FILES,true),3,"/tmp/postcard.log");
class api_postcard{
	var $result;
	var $token;
	var $uid;
	/**
	  *
	  */
	public function __construct($inPath){
		$this->result = new api_result;
		$this->token = $_REQUEST['token'];
		$this->uid = $_REQUEST['uid'];

		if(user_api::isLoginMobile($this->uid,$this->token) != true){
			$this->result->error_msg=SLanguage::tr("error_4","error");
			$this->result->error_code=-4;
			echo SJson::encode($this->result);
			exit;
		}
	}
	/**
	 * 新增/修改明信片
	 * 1.判定有没有ImageFileID，如果有值，且数据库里有值，且是本人的话，就直接可以完成，没有就生成一个
	 * 2.判定是不是已经有PostCardID，如果有值，且数据库里的值，且是本人的话，就是修改，没有就是新增
	 * 3.判定有没有订单，如果没有，生成订单(根据接收人数据，国家，判定价格)
	 *   如果有订单了的话，就修改/调整订单，然后返回
	 * 4.判定积分(TODO)
	 */
	public function pagePost($inPath){
		$result = new api_result;
		$data=new stdclass;
		//$result->result=&$data;

		$postcard_tmp = SJson::decode($_REQUEST['PostCard']);
		if(empty($postcard_tmp) || empty($postcard_tmp->Address) || empty($postcard_tmp->photo)){
			return SJson::encode($result);
		}
		$postcard = array();
		$db = new postcard_db;
		//{{{ * 1.判定有没有ImageFileID，如果有值，且数据库里有值，且是本人的话，就直接可以完成，没有就生成一个
		$fileid = new image_fileid;
		$width=0;$height=0;
		if(!empty($postcard_tmp->photo->width)){
			$width = $postcard_tmp->photo->width;
		}
		if(!empty($postcard_tmp->photo->height)){
			$width = $postcard_tmp->photo->height;
		}

		$imagefileid = $fileid->gen($width,$height);
		$imagedb = new image_db;
		if(empty($postcard_tmp->ImageFileID)){
			$postcard_tmp->ImageFileID = $imagefileid;
		}else{
			$image = $imagedb->getImage($postcard_tmp->ImageFileID,$this->uid);
			if(empty($image)){
				$postcard_tmp->ImageFileID = $imagefileid;
			}
		}
		//}}}
		//{{{ * 2.判定是不是已经有PostCardID，如果有值，且数据库里的值，且是本人的话，就是修改，没有就是新增
		//$isNewPostCard=true;
		$PostCard=array();
		if(!empty($postcard_tmp->PostCardID)){
			$PostCard = $db->getPostCard($postcard_tmp->PostCardID,$this->uid);
		}
		if(!empty($PostCard)){
			//更新新的ImageFileID
			if($PostCard['ImageFileID']!=$postcard_tmp->ImageFileID){
				$db->updatePostCardImageFileID($PostCard['PostCardID'],$postcard_tmp->ImageFileID);
			}
		}else{
			//
			$PostCard['UserID']		=$this->uid;
			if(empty($postcard_tmp->Latitude) && empty($postcard_tmp->Longitude)){
				$IP		=SUtil::getIP();
				$ct = file_get_contents("http://api.ipinfodb.com/v3/ip-city/?key=e7e03bf26bff2c0068eb27898227c0ff53423140f0a711942d2e89f3761cbb70&ip=$IP&format=json");
				$ct = SJson::decode($ct);
				if(!empty($ct->latitude)) $postcard_tmp->Latitude = $ct->latitude;
				if(!empty($ct->longitude)) $postcard_tmp->Longitude = $ct->longitude;
			}
			$PostCard['Latitude']	=$postcard_tmp->Latitude;
			$PostCard['Longitude']	=$postcard_tmp->Longitude;
			$PostCard['Sender']		=$postcard_tmp->Sender;
			$PostCard['IP']		=SUtil::getIP(true);
			$PostCard['Comment']		=$postcard_tmp->Comments;
			$PostCard['Sender']		=$postcard_tmp->Sender;
			$PostCard['ImageFileID']	=$postcard_tmp->ImageFileID;
			$PostCard['_insertTime']	=date("Y-m-d H:i:s");
			if(!empty($postcard_tmp->photo)){
				$PostCard['ImageWidth']	=$postcard_tmp->photo->w;
				$PostCard['ImageHeight']	=$postcard_tmp->photo->h;
				$PostCard['ImageX']		=$postcard_tmp->photo->x;
				$PostCard['ImageY']		=$postcard_tmp->photo->y;
				$PostCard['ImageRotate']	=$postcard_tmp->photo->r;
			}
			//{{{地址处理
			$address=array();
			$user_db = new user_db;
			$data->Address=array();
			foreach($postcard_tmp->Address as &$adr_tmp){
				$adr_tmp=(object)$adr_tmp;
				$isnew=true;
				if(empty($adr_tmp->AddressID)){
				}else{
					$adr= $user_db->getAddress($adr_tmp->AddressID,$this->uid);
					if(empty($adr)){
						unset($adr_tmp->AddressID);
						$isnew=true;
					}else{
						//老地址，更新
						foreach($adr as $k=>$v){
							if(isset($adr_tmp->$k))
							$adr[$k]=$adr_tmp->$k;
						}
						$user_db->updateAddress($adr_tmp->AddressID,$adr);
						$isnew=false;
					}
				}
				if($isnew){
					//新地址,增加
					$adr=array();
					$adr['UserID']	=$this->uid;
					$adr['Name']	=$adr_tmp->Name;
					$adr['Country']	=$adr_tmp->Country;
					$adr['Address']	=$adr_tmp->Address;
					$adr['Mobile']	=$adr_tmp->Mobile;
					$adr['Phone']	=$adr_tmp->Phone;
					$adr['Email']	=$adr_tmp->Email;
					$adr['PostCode']=$adr_tmp->PostCode;
					$adr['Province']=$adr_tmp->Province;
					$adr['City']	=$adr_tmp->City;
					$adr['AddressID']=$user_db->addAddress($adr);
				}
				$address[]=$adr['AddressID'];
				$adr['LocalID']=$adr_tmp->LocalID;
				$data->Address[]=$adr;
				//根据国家，算出不同的价格和生成不同的资费，如果用户语言为非中文简体，就美元支付
			}
			//}}}
			$PostCard['Address']		=implode(",",$address);
			$PostCard['PostCardID']	=$db->addPostCard($PostCard);
		}
		$data->PostCardID 	= $PostCard['PostCardID'];
		$data->LocalID		= $postcard_tmp->LocalID;
		$data->FileTmpID	= $postcard_tmp->FileTmpID;
		$data->ImageFileID	= $postcard_tmp->ImageFileID;
		//}}}
		//{{{
	 	//* 3.判定有没有订单，如果没有，生成订单(根据接收人数据，国家，判定价格)
	 	//*   如果有订单了的话，就修改/调整订单，然后返回
		$order_db = new order_db;
		if(!empty($postcard_tmp->TradeNo)){
			$order = $order_db->getOrderByTradeNo($postcard_tmp->TradeNo,$this->uid);
		}
		$data->PostCardCount=count($postcard_tmp->Address);
		if(empty($order)){
			$order=array();
			$order['UserID']=$this->uid;
			$order['TradeNo']=time().rand(0,10000);
			$totalprice=0;
			$shippingcost=0;
			foreach($postcard_tmp->Address as $adr_tmp){
				$adr_tmp=(object)$adr_tmp;
				if($adr_tmp->Country=="CN"){
					$totalprice += money_config::$postcardPrice ;
					$shippingcost +=money_config::$postcardShippingCost;
				}else{
					$totalprice += money_config::$postcardPriceOther;
					$shippingcost +=money_config::$postcardShippingCostOther;
				}
			}
			//生成资本支付数据
			$order['OrderTotalPrice']=$totalprice+$shippingcost;
			$order['ShippingCost']=$shippingcost;
			$order['Score']=0;
			$order['OrderAmount']=$order['OrderTotalPrice']-floor($order['Score']*money_config::$scoreRate);
			$curreny="CNY";
			$order['ActualMoneyCurrency']=$curreny;
			$order['_insertTime']=date("Y-m-d H:i:s");
			$order['_version']=1;
			$order['Address']=SJson::encode($postcard_tmp->Address);
			$moneys=money_config::currency();
			$order['ActualMoneyExchangeRate']=$moneys[$currency]['rate'];
			$order['ActualMoneyAmount']=$order['OrderAmount']*$order['ActualMoneyExchangeRate'];
			$id = $order_db->addOrder($order);
			if(!empty($id)){
				$order = $order_db->getOrder($id);
			}else{
			}
		}else{
		}
		$data->TradeNo=$order['TradeNo'];
		$data->OrderAmount=$order['OrderAmount'];
		$data->Price=money_config::$postcardPrice;
		$data->OrderTotalPrice=$order['OrderTotalPrice'];
		$data->ShippingCost=$order['ShippingCost'];
		$data->ScoreRate=money_config::$scoreRate;
		$data->ScoreCurrent=0;//TODO
		$data->MoneyCurrent=0;//TODO
		$data->_insertTime=date("Y-m-d H:i:s");
		$data->AvaliableCurrency=money_config::currency();//TODO
		$result->result=$data;

		//$data->PayURL		= "http://www.ledui.com/order.main.pay/";
		//}}}
		error_log(var_export($result,true),3,"/tmp/postcard.log");
		return $result;
	}
	/**
	 * 列出明信片
	 * 只列出状态标记为未删除的明信片
	 */
	public function pageList($inPath){
	}
	/**
	 * 删除明信片
	 * 实际上不删除，只是标记
	 */
	public function pageDel($inPath){
	}
}
