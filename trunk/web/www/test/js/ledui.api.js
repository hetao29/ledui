

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
		$("#choosePic").bind("click",function(e){Overlay.show("chkphoto");});
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
		//旋转与缩放
		$("#ico_rotate_acw").bind("touchend",function(e){
			PostCardInfo.deg = PostCardInfo.deg - 90;
			$("#photoContent").css("-webkit-transform","rotate("+PostCardInfo.deg+"deg)");									   
			});
		$("#ico_rotate_cw").bind("touchend",function(e){
			PostCardInfo.deg = PostCardInfo.deg + 90;
			$("#photoContent").css("-webkit-transform","rotate("+PostCardInfo.deg+"deg)");								  
		});
		$("#ico_zoom_in").bind("touchend",function(e){			
			PostCardInfo.scale = PostCardInfo.scale /1.5;
			if(PostCardInfo.scale<1)PostCardInfo.scale=1;
			$("#photoContent").css("-webkit-transform","scale("+PostCardInfo.scale+")");						  
		});
		$("#ico_zoom_out").bind("touchend",function(e){
			PostCardInfo.scale = PostCardInfo.scale *1.5;
			$("#photoContent").css("-webkit-transform","scale("+PostCardInfo.scale+")");							  
		});
		$("#toPage2").bind("touchend",function(e){
			Page.show(2);					  
		});
		
		$("#photoContent").swipe( {
		 swipeStatus:function(event, phase, direction, distance, duration, fingers,p,events) {
			
			 if(phase =="start"){
				PostCardInfo.top = parseInt($(this).css("top"));
				PostCardInfo.left = parseInt($(this).css("left"));
				 
			 }
			if( phase!="move"){
				
				return;
			}
			if(fingers==2){
				//放大，缩小
				/*
				var changeX = events.start[0].pageX - events.start[0].pageX;
				var changeY = events[1].pageX - events[0].pageX;
				 console.log(event);
				 */
				 
			}else if(fingers<=1){
				//移动
				//Here we can check the:
				//phase : 'start', 'move', 'end', 'cancel'
				//direction : 'left', 'right', 'up', 'down'
				//distance : Distance finger is from initial touch point in px
				//duration : Length of swipe in MS 
				//fingerCount : the number of fingers used
				
				var top = PostCardInfo.top + (p.endY - p.startY);
				$(this).css("top",top+"px");
				var left = PostCardInfo.left + (p.endX - p.startX);
				$(this).css("left",left+"px");
			}
			var str = "<h4>Swipe Phase : " + phase + "<br/>";
			str += "Direction from inital touch: " + direction + "<br/>";
			str += "Distance from inital touch: " + distance + "<br/>";
			str += "Duration of swipe: " + duration + "<br/>";
			str += "Fingers used: " + fingers + "<br/></h4>";
							
			if (phase!="cancel" && phase!="end")
			{
				if (duration<5000)
					str +="Under maxTimeThreshold.<h3>Swipe handler will be triggered if you release at this point.</h3>"
				else
					str +="Over maxTimeThreshold. <h3>Swipe handler will be canceled if you release at this point.</h3>"
			
				if (distance<200)
					str +="Not yet reached threshold.  <h3>Swipe will be canceled if you release at this point.</h3>"
				else
					str +="Threshold reached <h3>Swipe handler will be triggered if you release at this point.</h3>"
			}
			
			if (phase=="cancel")
				str +="<br/>Handler not triggered. <br/> One or both of the thresholds was not met "
			if (phase=="end")
				str +="<br/>Handler was triggered."
			console.log(str);
		  },
			threshold:100,
			maxTimeThreshold:5000,
			fingers:'all'
		});
		
		//手指事件
		$( "#photoCanvas" ).bind("mousedown",function(e){
         
        });
		$( "#photoCanvas" ).bind("mouseup",function(e){
           
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
		largeImage.src = imageURI;
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