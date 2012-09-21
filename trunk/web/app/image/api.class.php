<?php
/**
  * 图片文件的存与取
  * 以后可以升级成分布式的方式
  */
class image_api{

	var $dir='/data/image';
	/**
	  * 保存文件
	  */
	public function saveFile($ImageFileName,$ImageFileID){
		$dir = $this->dir."/".date("Ymd")."/";
		@mkdir($dir,0777,true);
		$fname=$dir.$ImageFileID;
		return rename ($ImageFileName,$fname);
	}
	public function getFile($ImageFileID){
	}
}
