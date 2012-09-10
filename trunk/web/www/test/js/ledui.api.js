

//接口
var API = {
	host: "http://www.ledui.com/api.php/api/",
	//登录
	/**
	 * API.login({email:'hetao@hetao.name',passwd:''},function ok(result){alert("OK");},function error(result){alert("NO");});
	 */
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
function uploadPhoto(imageURI) {
	/*
		var reader = new FileReader();
		reader.onload = function(e) {
	　　alert(this.result.length);
	　}
	　reader.readAsDataURL(/file:\/\/.*?(\/.*)/.exec(imageURI)[1]);
*/
	
	
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";
options.chunkedMode=true;

	var params = new Object();
	params.value1 = "test";
	params.value2 = "param";

	options.params = params;

	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI("http://www.ledui.com/test.php"), win, fail, options);
}

function win(r) {
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
}

function fail(error) {
	alert("An error has occurred: Code = " + error.code);
	console.log("upload error source " + error.source);
	console.log("upload error target " + error.target);
}

//记录本地文件信息
/**
 * @table postcard
 * @field TmpID //临时ID，随机生成
 * @field FileName //filename，文件名
 * @field FileSize //
 * @field Address
 * @field TmpID
 **/
 
var LocalData={
	Total:0,
	Key:"LocalData_V1",
	Items:[],
	getAll:function(){
		var value = JSON.parse(window.localStorage.getItem(this.Key));
		if(value && value.Items){
			this.Total = value.Items.length;
			return this.Items = value.Items;
		}
	},
	updateAll:function(){
		this.Total = this.Items.length;
		return window.localStorage.setItem(this.Key,JSON.stringify(this));
	},
	//增加本地一个状态
	add:function(LocalPostCardItem){
		LocalPostCardItem.TmpID=(new Date()).getTime() +":"+Math.floor(Math.random()*10000);
		this.getAll();
		this.Total = this.Items.push(LocalPostCardItem);
		this.updateAll();
	},
	//删除本地状态，当取消，或者成功时
	del:function(TmpID){
		this.getAll();
		for(var i in this.Items){
			if(this.Items[i].TmpID==TmpID){
				this.Items.splice(i,1);
			}
		}
		this.updateAll();
	},
	//更新本地的一个状态
	update:function(TmpID,LocalPostCardItem){
		this.getAll();
		for(var i in this.Items){
			if(this.Items[i].TmpID==TmpID){
				this.Items.splice(i,1,LocalPostCardItem);
			}
		}
		this.updateAll();
	},
	clear:function(){
		this.Items=[];
		this.updateAll();
	}
}
/*
LocalData.add({fjeow:'xx'});
alert(LocalData.getAll().length);
*/

var LocalPostCardItem={
	TmpID:"",
	PostCardID:0,
	FileName:"",
	FileSize:"",
	Comments:"",
	Address:"",
	Sended:0,
	Total:0,
	Status:0,
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
	},
	/**
	 * 当设备准备好时
	 */
	onDeviceReady:function () {
		document.addEventListener("backbutton", Interface.onBackbutton, false);
	},

	onPhotoURISuccess:function(imageURI){
		PhotoEditor.init(imageURI);
		Page.init(1);
		uploadPhoto(imageURI);
	},
	
	onFail:function (message) {
		//alert('Failed because: ' + message);
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
//{{{
$(document).ready(function(){
	Control.init();
});
document.addEventListener("deviceready", Interface.onDeviceReady, false);
//}}}
