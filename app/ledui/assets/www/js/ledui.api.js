//{{{
//$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady2, false);
	document.addEventListener("backbutton", yourCallbackFunction, false);
//});
function yourCallbackFunction(){
	alert("back");	
	
        navigator.notification.confirm(
            'You are the winner!',  // message
            onConfirm,         // callback
            'Game Over',            // title
            'Done'                  // buttonName
        );
		
}
function onConfirm(buttonIndex) {
    alert('You selected button ' + buttonIndex);
}
$(document).ready(function(){
alert(1);
Control.init();
alert(2);
});

function onDeviceReady2() {
alert(2);
Control.init();
alert(3);

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
		/*$("#choosePicFromCamera").click(function(){
												
		});*/
		$("#choosePicFromCamera").bind("touchend",function(e){
			navigator.camera.getPicture(onPhotoURISuccess, onFail, 
									{ 
										quality: 100, 
										allowEdit: true,
										destinationType: navigator.camera.DestinationType.FILE_URI 
									});
														   
		});
		$("#choosePicFromAlbum").bind("touchend",function(e){
			navigator.camera.getPicture(onPhotoURISuccess, onFail, 
									{ 
										quality: 100, 
										sourceType:navigator.camera.PictureSourceType.PHOTOLIBRARY   ,
										destinationType: navigator.camera.DestinationType.FILE_URI 
									});
														   
		});
	},
	choosePic: function(n){
	}
	
}

//
function onPhotoURISuccess(imageURI) {
	//
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
	alert('Failed because: ' + message);
}