
 function onGEOSuccess(position) {
        alert('Latitude: '           + position.coords.latitude              + '\n' +
                            'Longitude: '          + position.coords.longitude             + '\n' +
                            'Altitude: '           + position.coords.altitude              + '\n' +
                            'Accuracy: '           + position.coords.accuracy              + '\n' +
                            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '\n' +
                            'Heading: '            + position.coords.heading               + '\n' +
                            'Speed: '              + position.coords.speed                 + '\n' +
                            'Timestamp: '          +                                   position.timestamp          + '\n');
    }

    // onError Callback receives a PositionError object
    //
    function onGEOError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    function onSuccess(contacts) {
		
        // display the address information for all contacts
        for (var i=0; i<contacts.length; i++) {
			
			if(!contacts[i].displayName || !contacts[i].addresses || contacts[i].addresses.length<=0)continue;

			var email="";
			var phoneNumber="";
			if(contacts[i].emails){
				for(var j=0;j<contacts[i].emails.length;j++){
					email = contacts[i].emails[j]['value'];
					if(contacts[i].emails[j].pref){
						break;
					}
				}
			}
			if(contacts[i].phoneNumbers){
				for(var j=0;j<contacts[i].phoneNumbers.length;j++){
					phoneNumber = contacts[i].phoneNumbers[j]['value'];
					if(contacts[i].phoneNumbers[j].pref){
						break;
					}
				}
			}
			
            for (var j=0; j<contacts[i].addresses.length; j++) {
				/*
                alert(
					  contacts[i].displayName +":"+email+":"+phoneNumber+":"+
                        "Street Address: "  + contacts[i].addresses[j].streetAddress + "\n" + 
                        "Locality: "  + contacts[i].addresses[j].locality + "\n" + 
                        "Region: "  + contacts[i].addresses[j].region + "\n" + 
                        "Postal Code: "  + contacts[i].addresses[j].postalCode + "\n" + 
                        "Country: "  + contacts[i].addresses[j].country);
				*/
            }
        }
    };

    // onError: Failed to get the contacts
    //
    function onError(contactError) {
        alert('onError!');
    }
//{{{
var AjaxSetup={
	stat:0, //0,1 start, 2 complete
	msg:""
}
$.ajaxSetup({
  global: false,
  type: "POST",
  timeout:8000,
  beforeSend:function(e){
	//600毫米如果还没有反应，就显示进度条
	AjaxSetup.stat=1;
	setTimeout(function(){
		if(AjaxSetup.stat==1){
			Loading.show(AjaxSetup.msg);
			AjaxSetup.stat=0;
		}
	},600);
  },complete:function(e){
	AjaxSetup.stat=2;
	Loading.hide();
  }
});
//}}}

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
				}
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
		   }
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
		   }
		});
	},
	addAddress: function(param,ok,error){
		$.ajax({
		   type: "POST",
		   url: API.host+"/user/addAddress",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.result && msg.error_code==0){
			   	LocalDataAddress.add(msg.result);
				//保存到本地
				if(ok)ok(msg);
				return true;
			   }else{
				   if(error)error(msg);
			   }
		   },
		   error:function(msg){
		   		if(error)error(msg);
				return false;
		   }
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
		//考虑到当前版本没有slice的方法，对大文件的读取，会导致crash，所以，暂时不支持断点续传
		
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
            ft.upload(imageURI, "http://www.ledui.com/test.php", function ok(r){
					alert(r.response);
																			 
				}, function fail(){
				}, options);
			
			return;/*
		var reader = new FileReader();
		reader.onload = function(e) {
				
		//　　alert(this.result.length);
			var param = new Object();
			var start =0;
			var length=1024*10; //10K一片
			var slices = Math.ceil(this.result.length/length);
			var i = 0;
			for(i; i<slices ; i++){
				start=length*i;	
			}
			param.value1 = this.result.substr(start,length);
			param.PostCardID = PostCardID;
			this.uploadPart(param,function ok(){
											  },function error(){
											  });
			
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
		*/
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
		var postcards = LocalDB.get(this.postcards) || [];
		postcards.push(LocalPostCardItem);
		LocalDB.set(this.postcards,postcards);
	},
	//删除本地状态，当取消，或者成功时
	delPostCard:function(TmpID){
		var postcards = LocalDB.get(this.postcards) || [];
		for(var i in postcards){
			if(postcards[i].TmpID==TmpID){
				postcards.splice(i,1);
			}
		}
		LocalDB.set(this.postcards,postcards);
	},
	//更新本地的一个状态
	updatePostCard:function(TmpID,LocalPostCardItem){
		var postcards = LocalDB.get(this.postcards) ||[];
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
	PostCardTmpID:"",
	FileTmpID:"",
	//明信片ID
	PostCardID:"",//当调用增加明信片后，更新此参数，如果有这参数，说明服务端已经生成了
	Address:"",
	Comments:"",
	//状态 1：未开始，2，上传中，还没有成功，3：成功，-1：失败，-2：未支付
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
	ImageFileID:"",//服务端生成ImageFileID
	//文件路径
	FilePath:"",
	//文件大小
	FileSize:"",
	//文件已经上传大
	DataSended:0,
	//文件上传总大小
	DataTotal:0,
	//状态 1：未开始，2，上传中，还没有成功，3：成功，-1：失败
	Status:1
}
var LocalDataAddress={
	AddressID:"",//服务器地址ID，如果>0，表明是服务器的地址
	LocalID:"",//本地生成的临时地址ID
	Name:"",
	Mobile:"",
	Country:"",
	Privince:"",
	City:"",
	Address:"",
	PostCode:"",
	Mobile:"",
	Phone:"",
	Key:"Address",
	genID:function(){
		return (new Date()).getTime() +":"+Math.floor(Math.random()*10000);
	},
	get:function(LocalID){
		var all = LocalDB.get(this.Key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== LocalID){
				return all[i];
			}
		}
	},add:function(o){
		var all = LocalDB.get(this.Key) || [];
		var isnew=true;
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== o.LocalID){
				all.splice(i,1,o);
				isnew =false;
			}
		}
		if(isnew)all.push(o);
		LocalDB.set(this.Key,all);
	},edit:function(o){
		var all = LocalDB.get(this.Key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== o.LocalID){
				all.splice(i,1,o);
			}
		}
		LocalDB.set(this.Key,all);
     	},del:function(LocalID){
		var all = LocalDB.get(this.Key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== LocalID){
				all.splice(i,1);
			}
		}
		LocalDB.set(this.Key,all);
	},list:function(){
		var all = LocalDB.get(this.Key) || [];
		return all;
	},upload:function(){
	},show:function(){
		if(LocalDataAddress.list().length>0){
			$("#rcvlist .list div").hide();
			$("#rcvlist .list ul").show().html("");
			//显示各地址
			var address = LocalDataAddress.list();
			for(var i =0;i<address.length;i++){
				var html='<li>'+
					'<div class="edit" LocalID="'+address[i].LocalID+
						'"active="yes"><div class="icon"></div></div>'+
					'<div class="info">'+
					'<div class="checkbox"><div class="icon"></div></div>'+
					'<span class="name">'+address[i].Name+'</span>'+
					'<span class="phone">'+(address[i].Mobile||"")+'</span>'+
					'<span class="address">'+(address[i].Country||"")+" "+
						(address[i].Privince||"")+" " +(address[i].City||"")+" "+address[i].Address+'</span>'+
					'</div>'+
					'</li>';
				$("#rcvlist .list ul").append(html);
			}
		}else{
			$("#rcvlist .list div").show();
			$("#rcvlist .list ul").hide();
		}
	}
	
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
		navigator.geolocation.getCurrentPosition(onGEOSuccess, onGEOError);
		//test
		/*
 		var options = new ContactFindOptions();
        options.filter=""; 
		options.multiple=true;
        var fields  = ["displayName","addresses","phoneNumbers","emails"];
        navigator.contacts.find(fields , onSuccess, onError, options);
		*/
	},

	onPhotoURISuccess:function(imageURI){
		Page.init(1);
		setTimeout(function(){PhotoEditor.init(imageURI);},300);
		setTimeout(function(){API.upload(122,imageURI);},2000);
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
		  		$("#isnotlogin").hide();
		  		$("#islogin").show();
		  	}
		});
		//b.明信片状态查询
		//2.界面接口
		$("#choosePic").bind("tapone", function(e){Overlay.show("chkphoto");});
		//重选按钮
		$("#choosePic2").bind("tapone", function(e){Overlay.show("chkphoto");});
		//结束时，再重新创建时的按钮
		$("#choosePic3").bind("tapone", function(e){Overlay.show("chkphoto");});
		$("#quitOK").bind("tapone",function(e){navigator.app.exitApp();});
		$("#quitCancel").bind("tapone",function(e){Overlay.hide("quit");});
		
		$("#choosePicFromCamera").bind("tapone", function(e){
			navigator.camera.getPicture(Interface.onPhotoURISuccess, Interface.onFail, 
				{quality: 100, 
				 allowEdit: true,
				 destinationType: navigator.camera.DestinationType.FILE_URI 
				}
			);
			Overlay.hide("chkphoto");
		});
		$("#choosePicFromAlbum").bind("tapone", function(e){
			navigator.camera.getPicture(Interface.onPhotoURISuccess, Interface.onFail, 
				{quality: 100, 
				 sourceType:navigator.camera.PictureSourceType.PHOTOLIBRARY   ,
				 destinationType: navigator.camera.DestinationType.FILE_URI 
				});
			Overlay.hide("chkphoto");
		});
		
		//go
		$("[_to]").bind("tapone", function(e){
			Page.show($(this).attr("_to"));					  
		});
		//back
		$(".button_s_back").bind("tapone",function(e){Interface.onBackbutton();});
		
		//选择地址
		$('.rcvlist li .info').live('tapone', function(){										   
			$(this).parent().toggleClass('checked');											  
		});
		//删除地址
		$("#delAddress").live("tapone", function(){
			LocalDataAddress.del($(this).attr("LocalID"));
			LocalDataAddress.show();
			Page.show(2);
		});
		//编辑地址
		$('.edit').live('tapone', function(){
			var id = $(this).attr("LocalID");
			var adr = LocalDataAddress.get(id);
			if(id && adr){
				$("#delAddress").attr("LocalID",id).show();
				$("#addAddress").text("edit").tr();
				$("#rcvform").each(function(){
					for(var i in adr){
						$(this).find("[name='"+i+"']").val(adr[i]).trigger("change");
					}
				});

				Page.show(3);
			}
			return false;
		});
		//添加新地址的时候，进行重置
		$(".rcvcreate").bind("tapone",function(e){
			$("#delAddress").attr("LocalID","").hide();
			$("#addAddress").text("add").tr();
			$("#rcvform").each(function(){this.reset();});
			$("#rcvform [name=LocalID]").val(LocalDataAddress.genID());
		});
		
		
		
		$(".CAbout").bind("tapone",function(e){Page.show(8);});
		$(".CPostCard").bind("tapone",function(e){Page.show(9);});
		$(".CLogin").bind("tapone",function(e){Page.show(10);});		
		$(".CRegister").bind("tapone",function(e){Page.show(11);});
		
		$(".CLogout").bind("tapone",function(e){
			API.logout({},function ok(result){
				$("#islogin").hide();
				$("#isnotlogin").show();
				},function error(result){
			});
		});
		
		

		$("#rcvform #country").bind("change",function(e){
				//console.log($(this).find("option:selected").text());
				//console.log($(this).val());
				if($(this).val()=="中国"){
					$("#privince").html('<option value="">选择</option>').slideDown();
					for(var i =0;i<City.all.length;i++){
						var n = City.all[i].n;
						$("#privince").append('<option value="'+n+'">'+n+'</option>');
					}
				}else{
					$("#privince").html('').slideUp();
					$("#city").html('').hide();
				}
		}).trigger("change");
		$("#addAddress").bind("tapone",function(e){
			var r = {};
			var a =  $("#rcvform").serializeArray();
			for(var i in a){
				var k = a[i].name	;
				var v = a[i].value;
				r[k]=v;
			}
			if(r.Name==""){
				alert("收件人名字不能为空");
			}else if(r.Address==""){
				alert("收件人地址不能为空");
			}else{
				LocalDataAddress.add(r);
				LocalDataAddress.show();
				Page.show(2);
			}
		});
		$("#rcvform #privince").bind("change",function(e){
				var city = City.listCity($(this).val());
				if(city.length>0){
					$("#city").html('<option value="">选择</option>').slideDown();
					for(var i =0;i<city.length;i++){
						var n = city[i];
						$("#city").append('<option value="'+n+'">'+n+'</option>');
					}
				}else{
					$("#city").html('').slideUp();
				}
		});
		LocalDataAddress.show();
		
		

		$("#IDLogin").bind("tapone",function(e){
				var sid=$("#login .sid").val();
				var pwd=$("#login .pwd").val();
				API.login({email:sid,passwd:pwd},function ok(result){
					//登录成功,更新登录状态,跳到登录前的一页
					$("#login .errorbox").fadeOut();
					$("#isnotlogin").hide();
					$("#islogin").show();
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
		$("#IDRegister").bind("tapone",function(e){
				var sid=$("#register .sid").val();
				var pwd=$("#register .pwd").val();
				var pwd2=$("#register .pwd2").val();
				API.register({email:sid,passwd:pwd,passwd2:pwd2},function ok(result){
					//注册成功，自动登录,更新登录状态,跳到登录前的一页
					$("#register .errorbox").fadeOut();
					$("#isnotlogin").hide();
					$("#islogin").show();
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
  //
