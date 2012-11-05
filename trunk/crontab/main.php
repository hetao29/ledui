<?php
error_reporting(E_ALL ^E_NOTICE);
include("../web/www/global.php");
chdir(dirname(__FILE__));
SLog::$LOGFILE="log/run.log";
SConfig::$CACHE=false;
$info=array();
for(;;){
	usleep(1000*100);
	$config=SConfig::parse("crontab.conf");
	foreach($config as $conf){
		if(!empty($conf->app) || !empty($conf->interval)){
			if(empty($info[$conf->app]['starttime']) || $info[$conf->app]['starttime']+$conf->interval<=time()){
				$info[$conf->app]['starttime']=time();
				$pid = pcntl_fork();
				$command = $conf->app;
				if(!empty($conf->params)){
				//	$command.=implode(" ",(array)$conf->params);
				$params = $conf->params;
				}else{
					$params=array();
				};
				if ($pid == -1) {//error
					//echo "error";
					continue;
				} else if ($pid) {//parent
					//echo "parent";
					continue;
				} else {//child
					SLog::write("Exec $command");
					include($command);
					exit;
				}
			}



		}
	}
}
