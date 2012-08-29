<?php
/**
 * image fileid类，可以生成与解析
 */
class image_fileid{
	private $_fileid;
	private $_version=1;
	private $_height;
	private $_width;
	/**
	 * 图片类型
	 */
	private $_type;
	const TYPE_PRODUCT=1;
	const TYPE_ICON=2;
	const TYPE_POSTCARD=3;
	private $_timestamp;
	private $_rand;
	private function init(){
		$this->_timestamp = time();
		$this->_rand = rand(1,1000);
	}

	public function gen($width,$height,$type=image_fileid::TYPE_POSTCARD){
		$this->init();
		$this->_width = $width;
		$this->_height = $height;
		$this->_type = $type;
		$version = str_pad( dechex( $this->_version ), $len = 2, '0', STR_PAD_LEFT);
		$width = str_pad( dechex( $this->_width), $len = 4, '0', STR_PAD_LEFT);
		$height  = str_pad( dechex( $this->_height), $len = 4, '0', STR_PAD_LEFT);
		$type  = str_pad( dechex( $this->_type), $len = 2, '0', STR_PAD_LEFT);
		$timestamp = str_pad( dechex( $this->_timestamp), $len = 8, '0', STR_PAD_LEFT);
		$rand = str_pad( dechex( $this->_rand), $len = 4, '0', STR_PAD_LEFT);
		return $this->_fileid = strtoupper($version.$width.$height.$type.$timestamp.$rand);
	}
	public function parse($fileid){
		$this->_fileid = $fileid;
		$this->_version = hexdec( substr( $fileid, 0, 2) );
		$this->_width = hexdec( substr( $fileid, 2, 4) );
		$this->_height = hexdec( substr( $fileid, 6, 4) );
		$this->_type  = hexdec( substr( $fileid, 10, 2) );
		$this->_timestamp = hexdec( substr( $fileid, 12, 8) );
		$this->_rand = hexdec( substr( $fileid, 20, 4) );
		return $this;
	}
	public function width(){ return $this->_width; }
	public function height(){ return $this->_height; }
	public function type(){ return $this->_type; }
	public function version(){ return $this->_version; }

}
