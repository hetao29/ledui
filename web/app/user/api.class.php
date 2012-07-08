<?php
class user_api{
		static public function login($User,$forever=false){
			if(!empty($User['UserID'])){
				$_SESSION['user']=$User;
				$db = new  user_db;
				$expired=0;
				if($forever){
					$expired=time()+365*3600*24;//一年过期
					$db->addUserToken(array("UserID"=>$User['UserID'],"UserToken"=>session_id()));
				}
				self::setCookie("token",session_id(),$expired);
				self::setCookie("uid",$User['UserID'],$expired);
				return true;
			}
			return false;
		}
		static public function  islogin(){
			if(isset($_SESSION['user']))return $_SESSION['user'];else return false;
		}
		static public function logout(){
			$db = new  user_db;
			$db->delUserToken(@$_SESSION['user']['UserID'],session_id());
			unset($_SESSION['user']);
			self::setCookie("uid",0,time()-3600*24);
			self::setCookie("token",0,time()-3600*24);
		}
		static public function setCookie($k,$v,$t){
			header( 'p3p:CP="IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT"');
			setcookie($k,$v,$t,"/");
		}
		static public function pwd($password){
			return md5(sha1(md5($password).$password));
		}
}
