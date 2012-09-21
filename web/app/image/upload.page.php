<?php
error_log("\n\n",3,"/tmp/upload.log");
error_log(var_export($_REQUEST,true),3,"/tmp/upload.log");
error_log(var_export($_FILES,true),3,"/tmp/upload.log");
class image_upload{
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
	  * 上传图片接口
	  */
	public function pageEntry($inPath){
		$PostCardID = $_REQUEST['PostCardID'];
		$ImageFileID= $_REQUEST['ImageFileID'];
		if(empty($PostCardID) || empty($ImageFileID)){
			$this->result->error_msg=SLanguage::tr("error_30001","error");
			$this->result->error_code=-30001;
			return $this->result;
		}
		//{{{参数有效性校验
		$postcard_db = new postcard_db;
		$postcard = $postcard_db->getPostCard($PostCardID,$this->uid);
		if(empty($postcard)){
			$this->result->error_msg=SLanguage::tr("error_30002","error");
			$this->result->error_code=-30002;
			return $this->result;
		}elseif($ImageFileID!=$postcard['ImageFileID']){
			$this->result->error_msg=SLanguage::tr("error_30004","error");
			$this->result->error_code=-30004;
			return $this->result;
		}
		$image_db = new image_db;
		$image = $image_db->getImage($ImageFileID,$this->uid);
		if(!empty($image)){
			$image_db->delImage($ImageFileID,$this->uid);
		}
		//}}}
		$filePath="";
		if(!empty($_FILES)){
			foreach($_FILES as $file){
				$filePath=$file['tmp_name'];
			};
		}else{
			if(!empty($_REQUEST['FileURL'])){
				$ct = file_get_contents($_REQUEST['FileURL']);
				$filePath= tempnam("/tmp", "IMAGE_UPLOAD_");
				file_put_contents($filePath,$ct,LOCK_EX);

			}
		}
		$file_info = @getimagesize($filePath);
		if(empty($file_info)){
			$this->result->error_msg=SLanguage::tr("error_30005","error");
			$this->result->error_code=-30005;
			return $this->result;
		}
		$Image=array();
		$Image['ImageFileID'] 	= $ImageFileID;
		$Image['UserID'] 	= $this->uid;
		$Image['ImageSourceWidth'] 	= $file_info[0];
		$Image['ImageSourceHeight'] 	= $file_info[1];
		$Image['ImageType'] 	= $file_info[2];
		$image_api = new image_api;
		//exif信息
		$exif = exif_read_data($filePath,"IFD0");
		if($image_api->saveFile($filePath,$ImageFileID)===false){
			$this->result->error_msg=SLanguage::tr("error_30006","error");
			$this->result->error_code=-30006;
			return $this->result;
		}
		if($image_db->addImage($Image)===false){
			$this->result->error_msg=SLanguage::tr("error_30007","error");
			$this->result->error_code=-30007;
			return $this->result;
		};
		if(!empty($exif)){
			$Exif=array();
			$Exif['ImageFileID']=$ImageFileID;
			$Exif['ExifData']=SJson::encode($exif);
			$image_db->addExif($Exif);
		}
		//{{{更新明信片状态，为上传完成，最后可以通知打印队列
		$postcard_db->updatePostCardStatus($PostCardID,postcard_status::IMAGE_UPLOADED);
		//}}}
		$this->result->result=1;
		return $this->result;
	}
}
