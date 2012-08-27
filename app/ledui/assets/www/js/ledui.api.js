//{{{
//$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	//document.addEventListener("pause", yourCallbackFunction, false);
	//document.addEventListener("menubutton", yourCallbackFunction, false);
//});
function yourCallbackFunction(){
	
	//自定义导航
	
	//如果，是第0页，按后退，就提示程序退出
	Overlay.show("quit");
	return;
        navigator.notification.confirm(
            '你确定要退出吗？',  // message
            onConfirm,         // callback
            '退出',            // title
            '取消,确定'                  // buttonName
        );
		
}
function onConfirm(buttonIndex) {
    if(buttonIndex == 2){
		//退出
		navigator.app.exitApp();
	}
}
$(document).ready(function(){
	Control.init();
});

function onDeviceReady() {
	document.addEventListener("backbutton", yourCallbackFunction, false);
}

//}}}
//接口
var API = {
	host: "http://api.ledui.com",
	//登录
	login: function(n){
		var n = arguments[0] ? arguments[0] : 0;
		this.pages = this.seri();
		this.total = this.pages.length;
		if(!this.total){ return; }
		this.show(n);
	},
	//登出
	logout: function(n){
		var n = arguments[0] ? arguments[0] : 0;
		this.pages = this.seri();
		this.total = this.pages.length;
		if(!this.total){ return; }
		this.show(n);
	}
}
//界面操作
var Control = {
	init: function(n){
		/*
		$("#choosePic").click(function(){
			Overlay.show("chkphoto");
		});
		*/
		$("#choosePic").bind("touchend",function(e){Overlay.show("chkphoto");});
		$("#quitOK").bind("touchend",function(e){navigator.app.exitApp();});
		$("#quitCancel").bind("touchend",function(e){Overlay.hide("quit");});
		/*$("#choosePicFromCamera").click(function(){
												
		});*/
		$("#choosePicFromCamera").bind("touchend",function(e){
														   
			navigator.camera.getPicture(onPhotoURISuccess, onFail, 
									{ 
										quality: 100, 
										allowEdit: true,
										destinationType: navigator.camera.DestinationType.FILE_URI 
									});
			
			Overlay.hide("chkphoto");
														   
		});
		$("#choosePicFromAlbum").bind("touchend",function(e){
			navigator.camera.getPicture(onPhotoURISuccess, onFail, 
									{ 
										quality: 100, 
										sourceType:navigator.camera.PictureSourceType.PHOTOLIBRARY   ,
										destinationType: navigator.camera.DestinationType.FILE_URI 
									});
			Overlay.hide("chkphoto");
														   
		});
	},
	choosePic: function(n){
	}
	
}

//
function onPhotoURISuccess(imageURI) {

	var largeImage = document.getElementById('photoContent');

	// Unhide image elements
	//
	largeImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	largeImage.src = imageURI;
	Page.init(1);
}

// 
function onFail(message) {
	//alert('Failed because: ' + message);
}