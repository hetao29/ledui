<?php
error_reporting(E_ALL ^E_NOTICE);
include("../web/www/global.php");
chdir(dirname(__FILE__));
SLog::$LOGFILE="log/run.log";
SConfig::$CACHE=false;
$info=array();
for(;;){
	usleep(1000*500);
	$config=SConfig::parse("crontab.conf");
	foreach($config as $conf){
		if(!empty($conf->app) || !empty($conf->interval)){
			if(	//没有开始，或者已经超时
				empty($info[$conf->app]['starttime']) || 
				$info[$conf->app]['starttime']+$conf->interval<=time()
			  ){
				$info[$conf->app]['starttime']=time();
				if(!empty($info[$conf->app]['pid']) && file_exists("/tmp/".$info[$conf->app]['pid'])){
					//上次运行的进程还没有结束
					continue;
				}
				$ret= pcntl_fork();
				$command = $conf->app;
				if(!empty($conf->params)){
					$params = $conf->params;
				}else{
					$params = new stdclass;
				};
				if ($ret== -1) {//error
				} else if ($ret) {//parent
					$info[$conf->app]['pid']=$ret;
				} else {//child
					$cpid = posix_getpid();
					file_put_contents("/tmp/$cpid","$cpid");
					SLog::write("Exec $command");
					include($command);
					unlink("/tmp/$cpid");
					exit;
				}
			}
		}
		pcntl_wait($c_status,WNOHANG);
	}
}
