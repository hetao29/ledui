<?php
class manage_main extends STpl{
	function __construct(){
	}
	function pageNav($inPath){
			return $this->render("user/nav.tpl");
	}
	function pageListUsers($inPath){
		$currentPage = $REQUEST['currentPage'];
		$pageCapacity = $REQUEST['pageCapacity'];
		$db = new user_db;
		$totalCapacity = $db->getUserTotal($where);
		$page = new LPage();
		$page->genPage($totalCapacity,$currentPage,$pageCapacity);
		$pageArr = $page->getPages();
		$users = $db->listUsers($where);
		$data['users'] = $users;
		$data['page'] = $pageArr;
		echo $this->render("manage/listusers.html",$data);
	}
	function pageLogin($inPath){
		if(!empty($_POST)){
			$db = new user_db;
			$u = $db->getUserByEmail(@$_POST['email']);
			if(!empty($u) && $u['UserPassword']==@$_POST['password']){
				//echo "注册成功，自动登录中...";
				$r = user_api::login($u,!empty($_POST['forever'])?true:false);
				header("location:/user");
			}else{
				echo "登录失败";
			}

		}else{
		}
		echo $this->render("user/sign.html");
	}

}
