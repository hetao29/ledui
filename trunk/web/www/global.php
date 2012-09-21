<?php
date_default_timezone_set("Asia/Shanghai");
define("ROOT",				dirname(__FILE__)."/../");
define("ROOT_WWW",			ROOT."/www");
define("ROOT_APP",			ROOT."/app");
define("ROOT_CONFIG",		ROOT."/config");
define("ROOT_SLIGHTPHP",	ROOT."/slightphp/");
define("ROOT_PLIGUNS",		ROOT."/slightphp/plugins");
require_once(ROOT_SLIGHTPHP."/SlightPHP.php");
//{{{
function __autoload($class){
	if($class{0}=="S"){
		$file = ROOT_PLIGUNS."/$class.class.php";
	}else{
		$file = SlightPHP::$appDir."/".str_replace("_","/",$class).".class.php";
	}
	if(file_exists($file)) return require_once($file);
}
spl_autoload_register('__autoload');
//}}}
SlightPHP::setDebug(true);
SlightPHP::setAppDir(ROOT_APP);
SlightPHP::setDefaultZone("index");
SlightPHP::setDefaultPage("main");
SlightPHP::setDefaultEntry("entry");
SlightPHP::setSplitFlag("-_.");

//{{{db config
SDb::setConfigFile(ROOT_CONFIG. "/db.ini");
//SRoute::setConfigFile(ROOT_CONFIG."/route.ini");
//}}}
//{{{language
SLanguage::setLanguageDir(SlightPHP::$appDir."/../locale");
SLanguage::$defaultLocale="zh-CN";
if(!empty($_COOKIE['language'])){
    SLanguage::setLocale($_COOKIE['language']);
}
//}}}
//for test
//SLanguage::setLocale("en");
