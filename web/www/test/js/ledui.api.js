

//接口
var API = {
	host: "http://www.ledui.com/api.php/api/",
	//登录
	/**
	 * API.login({email:'hetao@hetao.name',passwd:''},function ok(result){alert("OK");},function error(result){alert("NO");});
	 */
	islogin:function(callback){
		var token = LocalData.getToken();
		var uid = LocalData.getUID();
		if(token && token !=""){
			var param={token:token,uid:uid};
			$.ajax({
				type: "POST",
				url: API.host+"/user/islogin",
				data: param,
				dataType: "JSON",
				success: function(msg){
					if(msg){
						if(callback)callback(true);
					}else{
						if(callback)callback(false);
					}
				},
				error:function(msg){
					if(callback)callback(false);
					return false;
				},
			});
			return;
		}
		if(callback)callback(false);
	},
	login: function(param,ok,error){
		LocalData.setToken("","");
		$.ajax({
		   type: "POST",
		   url: API.host+"/user/login",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.result && msg.error_code==0){
			   	LocalData.setToken(msg.result.UserID,msg.result.UserAccessToken);
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
			   if(msg && msg.result && msg.error_code==0){
			   	LocalData.setToken(msg.result.UserID,msg.result.UserAccessToken);
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
	logout: function(param,ok,error){
		LocalData.setToken("","");
		if(ok)ok();return;
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

//记录本地状态信息
var LocalDB={
	Version:"_V1",
	set:function(k,v){
		this.del(k);
		return window.localStorage.setItem(k+this.Version,JSON.stringify(v));
    	},
	del:function(k){
		return window.localStorage.removeItem(k+this.Version);
	},
	get:function(k){
		return JSON.parse(window.localStorage.getItem(k+this.Version));
	}
}
var LocalData={
	postcards:"postcards",
	token:"token",
	uid:"uid",
	email:"email",
	pwd:"pwd",
	setToken:function(uid,token){
		LocalDB.set(this.uid,uid);
		LocalDB.set(this.token,token);
    	},
	getToken:function(){
		return LocalDB.get(this.token);
	},
	getUID:function(){
		return LocalDB.get(this.uid);
	},
	//增加本地一个状态
	addPostCard:function(LocalPostCardItem){
		LocalPostCardItem.TmpID=(new Date()).getTime() +":"+Math.floor(Math.random()*10000);
		var postcards = LocalDB.get(this.postcards);
		postcards.push(LocalPostCardItem);
		LocalDB.set(this.postcards,postcards);
	},
	//删除本地状态，当取消，或者成功时
	delPostCard:function(TmpID){
		var postcards = LocalDB.get(this.postcards);
		for(var i in postcards){
			if(postcards[i].TmpID==TmpID){
				postcards.splice(i,1);
			}
		}
		LocalDB.set(this.postcards,postcards);
	},
	//更新本地的一个状态
	updatePostCard:function(TmpID,LocalPostCardItem){
		var postcards = LocalDB.get(this.postcards);
		for(var i in postcards){
			if(postcards[i].TmpID==TmpID){
				postcards.splice(i,1,LocalPostCardItem);
			}
		}
		LocalDB.set(this.postcards,postcards);
	},
	clear:function(){
		for(var i in window.localStorage){
			if(i.indexOf(LocalDB.Version)==-1)window.localStorage.removeItem(i);;
		}
	},
	clearAll:function(){
		for(var i in window.localStorage){window.localStorage.removeItem(i);}
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
		var p = Page.getcurrentpage().find(".button_s_back").attr("_back");
		if(p){
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
		/*初始化*/
		//1.数据初始化
		      //a.登录状态
		      API.islogin(function(r){
				      if(r){
					$("#login .errorbox").fadeOut();
					$(".isnotlogin").hide();
					$(".islogin").show();
				      }
				      });
		      //b.明信片状态查询
		//2.界面接口
		$("#choosePic").bind("touchend",function(e){Overlay.show("chkphoto");});
		//for test
		$("#choosePic").bind("click",function(e){Page.show(1);});
		//重选按钮
		$("#choosePic2").bind("tapone",function(e){Overlay.show("chkphoto");});
		//结束时，再重新创建时的按钮
		$("#choosePic3").bind("tapone",function(e){Overlay.show("chkphoto");});
		$("#quitOK").bind("tapone",function(e){navigator.app.exitApp();});
		$("#quitCancel").bind("tapone",function(e){Overlay.hide("quit");});
		
		$("#choosePicFromCamera").bind("tapone",function(e){
														   
			navigator.camera.getPicture(Interface.onPhotoURISuccess, Interface.onFail, 
									{ 
										quality: 100, 
										allowEdit: true,
										destinationType: navigator.camera.DestinationType.FILE_URI 
									});
			
			Overlay.hide("chkphoto");
														   
		});
		$("#choosePicFromAlbum").bind("tapone",function(e){
			navigator.camera.getPicture(Interface.onPhotoURISuccess, Interface.onFail, 
									{ 
										quality: 100, 
										sourceType:navigator.camera.PictureSourceType.PHOTOLIBRARY   ,
										destinationType: navigator.camera.DestinationType.FILE_URI 
									});
			Overlay.hide("chkphoto");
														   
		});
		
		$(".next").bind("tapone",function(e){
			Page.show($(this).attr("_to"));					  
		});
		$(".CAbout").bind("tapone",function(e){Page.show(8);});
		
		$(".CLogin").bind("tapone",function(e){Page.show(10);});
		
		$(".CPostCard").bind("tapone",function(e){Page.show(9);});
		
		$(".CRegister").bind("tapone",function(e){Page.show(11);});
		$(".CLogout").bind("tapone",function(e){
				API.logout({},function ok(result){
					$(".isnotlogin").show();
					$(".islogin").hide();
					},function error(result){
				});
			});
		
		$(".button_s_back").bind("tapone",function(e){Interface.onBackbutton();});

		$("#login #IDLogin").bind("tapone",function(e){
				var sid=$("#login .sid").val();
				var pwd=$("#login .pwd").val();
				API.login({email:sid,passwd:pwd},function ok(result){
					//登录成功,更新登录状态,跳到登录前的一页
					$("#login .errorbox").fadeOut();
					$(".isnotlogin").hide();
					$(".islogin").show();
					Interface.onBackbutton();
					},function error(result){
						//登录失败，提示错误信息
						if(result.error_msg) $("#login .errorbox").html(result.error_msg);
						$("#login .errorbox").slideDown("fast",function(){
								setTimeout(function(){
									$("#login .errorbox").slideUp();
								},5000);
						});
				});
		});
		$("#register #IDRegister").bind("tapone",function(e){
				var sid=$("#register .sid").val();
				var pwd=$("#register .pwd").val();
				var pwd2=$("#register .pwd2").val();
				API.register({email:sid,passwd:pwd,passwd2:pwd2},function ok(result){
					//注册成功，自动登录,更新登录状态,跳到登录前的一页
					$("#register .errorbox").fadeOut();
					$(".isnotlogin").hide();
					$(".islogin").show();
					Interface.onBackbutton();
					},function error(result){
					//登录失败，提示错误信息
						if(result.error_msg) $("#register .errorbox").html(result.error_msg);
						$("#register .errorbox").slideDown("fast",function(){
								setTimeout(function(){
									$("#register .errorbox").slideUp();
								},5000);
						});
				});
		});
		
		
		
		
	},
	choosePic: function(n){
	}
	
}
//{{{
$(document).ready(function(){
	LocalData.clear();
	Control.init();
});
document.addEventListener("deviceready", Interface.onDeviceReady, false);
//}}}
