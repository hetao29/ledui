

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
	},
	//创建明信片，返回明信片ID，更新本地明信片状态，然后开始上传具体的文件
	createPostCard:function(){
		
	},
	upload:function(PostCardID,imageURI){
		
		var reader = new FileReader();
		reader.onload = function(e) {
				
		　　alert(this.result.length);
			//TODO，实现分片算法，同时更新本地状态，增加重试代码
			var param = new Object();
			param.value1 = this.result;
			param.PostCardID = PostCardID;
			
			$.ajax({
			   type: "POST",
			   url: "http://www.ledui.com/test.php",
			   data: param,
			   dataType: "JSON",
			   success: function(msg){
				   alert("OK"+msg);
				   if(msg && msg.error_code==0){
						if(ok)ok(msg);
						return true;
				   }else{
					   if(error)error(msg);
				   }
			   },
			   error:function(msg){
				   alert("ERROR"+msg);
					if(error)error(msg);
					return false;
			   },
			});
		}
		reader.readAsDataURL(imageURI);
	}
}
//分片端点续传已经实现
/*
function uploadPhoto(imageURI) {
	
		var reader = new FileReader();
		reader.onload = function(e) {
			
	　　alert(this.result.length);
	
		var param = new Object();
		param.value1 = this.result;
		param.value2 = "param";
		
		$.ajax({
		   type: "POST",
		   url: "http://www.ledui.com/test.php",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   alert("OK"+msg);
			   if(msg && msg.error_code==0){
			   		if(ok)ok(msg);
					return true;
			   }else{
				   if(error)error(msg);
			   }
		   },
		   error:function(msg){
			   alert("ERROR"+msg);
		   		if(error)error(msg);
				return false;
		   }
		});
		}
	reader.readAsDataURL(imageURI);
}

function win(r) {
	alert("OK");
	alert(r);
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
}

function fail(error) {
	alert("An error has occurred: Code = " + error.code);
	console.log("upload error source " + error.source);
	console.log("upload error target " + error.target);
}
*/

//记录本地状态信息
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
//本地的明信片状态
var LocalDataPostCard={
	FileTmpID:"",
	//明信片ID
	PostCard:"",
	Address:"",
	Comments:"",
	//状态 1：未开始，2，上传中，还没有成功，3：成功，-1：失败
	Status:1,
	width:"",
	height:"",
	left:"",
	top:"",
	rotate:""
}
//待上传的文件类，这样能实现同一图片，做多张明信片时的秒传
var LocalDataFile={
	//文件没有上传前，生成的临时ID，根据文件Path与文件Size
	FileTmpID:"",
	//文件路径
	FilePath:"",
	//文件大小
	FileSize:"",
	//文件已经上传大小
	DataSended:0,
	//文件上传总大小
	DataTotal:0,
	//状态 1：未开始，2，上传中，还没有成功，3：成功，-1：失败
	Status:1,
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
		if(Page.pages_order.length>=1){
		Page.pages_order.pop();
			var p = Page.pages_order[Page.pages_order.length-1];
			
				Page.show(p);
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
		API.upload(122,imageURI);
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
		$(".CAbout").bind("touchend",function(e){Page.show(8);});
		$(".CAbout").bind("click",function(e){Page.show(8);});
		
		$(".CLogin").bind("touchend",function(e){Page.show(10);});
		$(".CLogin").bind("click",function(e){Page.show(10);});
		
		$(".CPostCard").bind("touchend",function(e){Page.show(9);});
		$(".CPostCard").bind("click",function(e){Page.show(9);});
		
		$(".CRegister").bind("touchend",function(e){Page.show(11);});
		$(".CRegister").bind("click",function(e){Page.show(11);});
		
		$(".button_s_back").bind("click",function(e){Interface.onBackbutton();});
		$(".button_s_back").bind("touchend",function(e){Interface.onBackbutton();});
		
		
		
		
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
