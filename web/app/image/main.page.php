<?php
class image_main{
	public function pageEntry($inPath){
	}
	/**
	  * 显示图片
	  * /image/$ImageFileID
	  * 例子：
	  * http://www.ledui.com/image/010000000003505BF15F0159
	  */
	public function pageView($inPath){
		$ImageFileID=$inPath[3];
		$db = new image_db;
		$Image = $db->getImage($ImageFileID);
		if(!empty($Image)){
			header("Content-type: " . image_type_to_mime_type($Image['ImageType']));
			readfile(image_api::getFile($ImageFileID));
		}
	}
}
