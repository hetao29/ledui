

//接口
var API = {
	host: "http://www.ledui.com/api.php/api/",
	//登录
	login: function(param,ok,error){
		$.ajax({
		   type: "POST",
		   url: API.host+"/user/login",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.error_code==0){
			   		if(ok)ok(msg);
					return true;
			   }else{
				   if(error)error(msg);
			   }
		   },
		   error:function(msg){
		   		if(error)error(msg);
				return false;
		   },
		});
	},
	register: function(param,ok,error){
		$.ajax({
		   type: "POST",
		   url: API.host+"/user/register",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.error_code==0){
			   		if(ok)ok(msg);
					return true;
			   }else{
				   if(error)error(msg);
			   }
		   },
		   error:function(msg){
		   		if(error)error(msg);
				return false;
		   },
		});
	},
	//登出
	logout: function(n){
	}
}

//界面操作
var Control = {
	init: function(n){
		$("#choosePic").bind("touchend",function(e){Overlay.show("chkphoto");});
		$("#quitOK").bind("touchend",function(e){navigator.app.exitApp();});
		$("#quitCancel").bind("touchend",function(e){Overlay.hide("quit");});
		
		$("#choosePicFromCamera").bind("touchend",function(e){
														   
			navigator.camera.getPicture(Interface.onPhotoURISuccess, Interface.onFail, 
									{ 
										quality: 100, 
										allowEdit: true,
										destinationType: navigator.camera.DestinationType.FILE_URI 
									});
			
			Overlay.hide("chkphoto");
														   
		});
		$("#choosePicFromAlbum").bind("touchend",function(e){
			navigator.camera.getPicture(Interface.onPhotoURISuccess, Interface.onFail, 
									{ 
										quality: 100, 
										sourceType:navigator.camera.PictureSourceType.PHOTOLIBRARY   ,
										destinationType: navigator.camera.DestinationType.FILE_URI 
									});
			Overlay.hide("chkphoto");
														   
		});
		
		$("#toPage2").bind("touchend",function(e){
			Page.show(2);					  
		});
	},
	choosePic: function(n){
	}
	
}
//Interface方法
var PostCardInfo = {
	//图片的旋转角度
	deg:0,
	//图片的缩放比例
	scale:1,
	//图片的裁剪区域
	top:0,
	left:0,
	width:0,
	height:0
}

//Interface方法
//Interface.onBackbutton();
var Interface = {
	/**
	 * 返回按钮事件
	 */
	onBackbutton:function (){
		if(Overlay.curname!=""){
			Overlay.hide(Overlay.curname);
			return;
		}
		if(Page.current>0){
			Page.show(Page.current-1);
			return;
		}
		//如果，是第0页，按后退，就提示程序退出
		Overlay.show("quit");
		/*
			navigator.notification.confirm(
				'你确定要退出吗？',  // message
				Interface.onQuitConfirm,         // callback
				'退出',            // title
				'取消,确定'                  // buttonName
			);
			*/
	},
	/**
	 * 当设备准备好时
	 */
	onDeviceReady:function () {
		document.addEventListener("backbutton", Interface.onBackbutton, false);
	},
	/*
	onQuitConfirm:function (buttonIndex) {
		if(buttonIndex == 2){
			//退出
			navigator.app.exitApp();
		}
	},
	*/

	onPhotoURISuccess:function(imageURI){
		
		var largeImage = document.getElementById('photoContent');
	
		// Unhide image elements
		//
		largeImage.style.display = 'block';
	
		// Show the captured photo
		// The inline CSS rules are used to resize the image
		//
		//largeImage.src = imageURI;
		PhotoEditor.init(imageURI);
		Page.init(1);
	},
	
	onFail:function (message) {
		//alert('Failed because: ' + message);
	}
	
}
/*
document.onmousemove = mouseMove;
document.onmouseup   = mouseUp;
var dragObject  = null;
var mouseOffset = null;
function getMouseOffset(target, ev){
	ev = ev || window.event;
	var docPos    = getPosition(target);
	var mousePos  = mouseCoords(ev);
	return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
}
function getPosition(e){
	var left = 0;
	var top  = 0;
	while (e.offsetParent){
		left += e.offsetLeft;
		top  += e.offsetTop;
		e     = e.offsetParent;
	}
	left += e.offsetLeft;
	top  += e.offsetTop;
	return {x:left, y:top};
}
function mouseMove(ev){
	ev           = ev || window.event;
	var mousePos = mouseCoords(ev);
	if(dragObject){
		dragObject.style.position = 'absolute';
		dragObject.style.top      = mousePos.y - mouseOffset.y;
		dragObject.style.left     = mousePos.x - mouseOffset.x;
		return false;
	}
}
function mouseCoords(ev){
 if(ev.pageX || ev.pageY){
  return {x:ev.pageX, y:ev.pageY};
 }
 return {
  x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
  y:ev.clientY + document.body.scrollTop  - document.body.clientTop
 };
}
function mouseUp(){
	dragObject = null;
}
function makeDraggable(item){
	if(!item) return;
	item.onmousedown = function(ev){
		dragObject  = this;
		mouseOffset = getMouseOffset(this, ev);
		return false;
	}
}
makeDraggable($("photoContent"));
*/
//{{{
$(document).ready(function(){
	Control.init();
});
document.addEventListener("deviceready", Interface.onDeviceReady, false);
//}}}
