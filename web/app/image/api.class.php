<?php
/**
  * 图片文件的存与取
  * 以后可以升级成分布式的方式
  */
class image_api{

	static $dir='/data/image';
	/**
	  * 保存文件
	  */
	public function saveFile($ImageFileName,$ImageFileID){
		$dir = self::$dir."/".date("Ymd")."/";
		@mkdir($dir,0777,true);
		$fname=$dir.$ImageFileID;
		return rename ($ImageFileName,$fname);
	}
	public function getFile($ImageFileID){
		$fileid = new image_fileid;
		$fileid->parse($ImageFileID);
		$dir = self::$dir."/".date("Ymd",$fileid->timestamp())."/";
		return $fname=$dir.$ImageFileID;
	}
}
