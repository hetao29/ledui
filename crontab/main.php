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
			if(	
				//û�п�ʼ�������Ѿ���ʱ
				(	empty($info[$conf->app]['starttime']) || 
					$info[$conf->app]['starttime']+$conf->interval<=time()
				)&&(
				//û�п�ʼ�������Ѿ�����
					empty($info[$conf->app]['status']) ||
					$info[$conf->app]['status']=="end"
				)
			){
				$info[$conf->app]['starttime']=time();
				$info[$conf->app]['status']="start";
				$pid = pcntl_fork();
				$command = $conf->app;
				if(!empty($conf->params)){
					$params = $conf->params;
				}else{
					$params = new stdclass;
				};
				if ($pid == -1) {//error
					continue;
				} else if ($pid) {//parent
					continue;
				} else {//child
					SLog::write("Exec $command");
					include($command);
					$info[$conf->app]['status']=="end"; //?����ı�����֪���᲻��������,�п����ӽ��̲�����¸������������
					exit;
				}
			}
		}
	}
}
