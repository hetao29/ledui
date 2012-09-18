

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
//复杂的数据要进行JSON编码，不过有可能程序会FC
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
						//同步本地地址数据
						API.synAddress();
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
				//同步本地地址数据
				API.synAddress();
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
	//同步地址信息，当用户登录后，或者登录后，第一次启动时
	//把用户当前的地址上传，然后服务器下发在服务器merge后的地址数据
	synAddress: function(ok,error){
		var param={};
		param.Token= LocalData.getToken();
		param.UserID= LocalData.getUID();
		param.AddressData = JSON.stringify(LocalDataAddress.list());
		$.ajax({
		   type: "POST",
		   url: API.host+"/user/synAddress",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.result && msg.error_code==0){
			   console.log(msg.result);
			   	if(msg.result.length>0) LocalDataAddress.clear();
				for(var i=0;i<msg.result.length;i++){
					LocalDataAddress.add(msg.result[i]);
				}
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
	postPostCard:function(PostCard,ok,error){
		var param={};
		param.Token= LocalData.getToken();
		param.UserID= LocalData.getUID();
		param.PostCard = JSON.stringify(PostCard);
		$.ajax({
		   type: "POST",
		   url: API.host+"/postcard/post",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.result && msg.error_code==0){
			   	//console.log(msg.result);
				//OrderID
				//PayURL
				//PostCard
				//LocalID(postcard)
				if(ok)ok(msg);
			   }else{
				   if(error && msg.error_msg)error(msg.error_msg);
			   }
		   },
		   error:function(msg){
		   	if(error)error(msg);
		   }
		});
		
	},
	//删除服务器的明信片(其实只是一个标记位)
	delPostCard:function(PostCard,ok,error){
		var param={};
		param.Token= LocalData.getToken();
		param.UserID= LocalData.getUID();
		param.PostCard = JSON.stringify(PostCard);
		$.ajax({
		   type: "POST",
		   url: API.host+"/postcard/del",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.result && msg.error_code==0){
			   	//console.log(msg.result);
				//OrderID
				//PayURL
				//PostCard
				//LocalID(postcard)
				if(ok)ok(msg);
			   }else{
				   if(error && msg.error_msg)error(msg.error_msg);
			   }
		   },
		   error:function(msg){
		   	if(error)error(msg);
		   }
		});
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
	addPostCard:function(LocalDataPostCard){
		var postcards = LocalDB.get(this.postcards) || [];
		var isnew=true;
		for(var i=0;i<postcards.length;i++){
			if(postcards[i].LocalID == LocalDataPostCard.LocalID){
				postcards.splice(i,1,LocalDataPostCard);
				isnew = false;
			}
		}
		if(isnew)postcards.push(LocalDataPostCard);
		LocalDB.set(this.postcards,postcards);
	},
	getPostCard:function(LocalID){
		var postcards = LocalDB.get(this.postcards) || [];
		for(var i=0;i<postcards.length;i++){
			if(postcards[i].LocalID == LocalID){
				return postcards[i];
			}
		}
	},
	//删除本地状态，当取消，或者成功时
	delPostCard:function(LocalID){
		var postcards = LocalDB.get(this.postcards) || [];
		for(var i in postcards){
			if(postcards[i].LocalID==LocalID){
				if(postcards[i].PostCardID!=""){
					API.delPostCard(postcards[i]);
				}
				postcards.splice(i,1);
			}
		}
		LocalDB.set(this.postcards,postcards);
	},listPostCard:function(LocalDataPostCard){
		return LocalDB.get(this.postcards) ||[];
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
	//{{明信片信息，和服务器保存的结果对应
	PostCardID:"",//当调用增加明信片后，更新此参数，如果有这参数，说明服务端已经生成了
	PayURL:"",
	OrderID:"",
	ImageFileID:"",
	//状态 1：未开始，2，上传中，还没有成功，3：成功，-1：失败，-2：未支付
	Status:1,
	//}}
	LocalID:"",
	FileTmpID:"",
	Latitude:"",
	Longitude:"",
	Address:[],//发送地址
	Comments:"",
	photo:{}, //width:"", //height:"", //x:"", //y:"", //rotate:"",
	date:"",
	genID:function(){
		return (new Date()).getTime() +":"+Math.floor(Math.random()*10000);
	},
	init:function(){
		this.LocalID=LocalDataPostCard.genID();
		this.date=(new Date()).getFullYear()+"-"+(new Date()).getMonth()+"-"+(new Date()).getDate();
		this.FileTmpID="";
		this.PostCardID="";
		this.Address=[];
		this.Comments="";
		this.Status=1;
		this.photo={};
	}
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
	Key:"File",
	//状态 1：未开始，2，上传中，还没有成功，3：成功，-1：失败
	Status:1,
	genID:function(){
		return (new Date()).getTime() +":"+Math.floor(Math.random()*10000);
	},add:function(imageURI){
		this.FilePath=imageURI;
		var all = LocalDB.get(this.Key) || [];
		var isnew=true;
		for(var i=0;i<all.length;i++){
			if(all[i].FilePath == this.FilePath){
				isnew =false;
				return all[i];
				//all.splice(i,1,this);
			}
		}
		if(isnew){
			this.FileTmpID = this.genID();
			all.unshift(this);
		}
		LocalDB.set(this.Key,all);
		return this;
	},get:function(imageURI){
		var all = LocalDB.get(this.Key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].FilePath == imageURI){
				return all[i];
			}
		}
	},del:function(imageURI){
		var all = LocalDB.get(this.Key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].FilePath == imageURI){
				all.splice(i,1);
			}
		}
	}
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
	},clear:function(){
		LocalDB.del(this.Key);
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
		if(isnew)all.unshift(o);
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
		var list=$("#rcvlist .list");
		var ul = list.find("ul");
		var div = list.find("div");
		if(LocalDataAddress.list().length>0){
			div.hide();
			ul.show().html("");
			//显示各地址
			var address = LocalDataAddress.list();
			for(var i =0;i<address.length;i++){
				var check="";
				if(LocalDataPostCard.Address){
					for(var j=0;j<LocalDataPostCard.Address.length;j++){
						if(address[i].LocalID == LocalDataPostCard.Address[j].LocalID){
							check='class="checked"';
						}
					}
				}
				var html='<li active="yes" '+check+'localid="'+address[i].LocalID+'">'+
					'<div class="edit" LocalID="'+address[i].LocalID+
						'"active="yes"><div class="icon"></div></div>'+
					'<div class="info">'+
					'<div class="checkbox"><div class="icon"></div></div>'+
					'<span class="name">'+address[i].Name+'</span>'+
					'<span class="phone">'+(address[i].Mobile||"")+'</span>'+
					'<span class="address">'+(address[i].Country||"")+" "+
						(address[i].Privince||"")+" " +(address[i].City||"")+" "+address[i].Address+'</span>'+
					'</div></li>';
				ul.append(html);
			}
		}else{
			div.show();
			ul.hide();
		}
		
		//选择地址
		$('#rcvlist li .info').delegate($('#rcvlist'), 'tapone', function(){
			$(this).parent().toggleClass('checked');
		});
		//删除地址
		$("#delAddress").delegate($('#rcvlist'), "tapone", function(){
			LocalDataAddress.del($(this).attr("LocalID"));
			LocalDataAddress.show();
			Page.show(2);
		});
		//编辑地址
		$('#rcvlist .edit').delegate($('#rcvlist'), 'tapone', function(){
			var id = $(this).attr("LocalID");
			var adr = LocalDataAddress.get(id);
			if(id && adr){
				$("#head_add .adrchk").hide();
				$("#head_add .title").html("editAddress".tr());
				$("#delAddress").attr("LocalID",id).show();
				$("#addAddress").text("edit".tr());
				$("#rcvform").each(function(){
					for(var i in adr){
						$(this).find("[name='"+i+"']").val(adr[i]).trigger("change");
					}
				});
				Page.show(3);

			}
			return false;
		});
		
	}
	
}




//Interface方法
//Interface.onBackbutton();
var Interface = {
	Latitude:"",
	Longitude:"",
	Device:{},
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
			confirm("您确定要退出吗?",{
				ok: function(){
					navigator.app.exitApp();	
				},
				cancel: function(){
					Overlay.hide("confirm");	
				}	
			});
	},
	/**
	 * 当设备准备好时
	 */
	onDeviceReady:function () {
		document.addEventListener("backbutton", Interface.onBackbutton, false);
		navigator.geolocation.getCurrentPosition(Interface.onGEOSuccess, Interface.onGEOError);
		for(var i in device){
			Interface.Device[i]=device[i];
		}
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
		Page.show(1,function(){
			PhotoEditor.init(imageURI);
		});
		//setTimeout(function(){API.upload(122,imageURI);},2000);
	},
	onFail:function (message) {
	       LocalDataPostCard.init();
	       //alert('Failed because: ' + message);
       },onGEOSuccess:function(position) {
	       this.Longitude = position.coords.longitude;
	       this.Latitude= position.coords.latitude;
	       LocalDataPostCard.Latitude = Interface.Latitude;
	       LocalDataPostCard.Longitude= Interface.Longitude;
	       LocalDataPostCard.Device = Interface.Device;
	//       alert('Latitude: '           + position.coords.latitude              + '\n' +
	//		       'Longitude: '          + position.coords.longitude             + '\n' +
	//		       'Altitude: '           + position.coords.altitude              + '\n' +
	//		       'Accuracy: '           + position.coords.accuracy              + '\n' +
	//		       'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '\n' +
	//		       'Heading: '            + position.coords.heading               + '\n' +
	//		       'Speed: '              + position.coords.speed                 + '\n' +
	//		       'Timestamp: '          +                                   position.timestamp          + '\n');
       },onGEOError:function(error) {
       }
}
//界面操作
var Control = {
	showPreview:function(){
		Page.show(5,function(){
			    //显示预览页面
			    $("#postinfo [name='Name']").html(LocalDataPostCard.Address[0].Name);
			    $("#postinfo [name='Address']").html(
					    LocalDataPostCard.Address[0].Country+" "+
					    LocalDataPostCard.Address[0].Privince +" "+
					    LocalDataPostCard.Address[0].City+" "+
					    LocalDataPostCard.Address[0].Address+" "
					    );
			    $("#postinfo [name='PostCode']").html(LocalDataPostCard.Address[0].PostCode);
			    $("#msginfo [name='Name']").html(LocalDataPostCard.Address[0].Name);
			    $("#msginfo [name='Comments']").html(LocalDataPostCard.Comments);
			    LocalData.addPostCard(LocalDataPostCard);
			    //获取登录者的名字
			    //$("#msginfo [name='FromName']").html();
			    if(LocalDataPostCard.photo){
				    var photoinfo = LocalDataPostCard.photo;
				    var style = Photoinfo.tostyle(photoinfo);
				    var img = $('<img style="'+ style +'" src="'+ photoinfo.o +'" />');
				    $('.card_front .photo').html('').append(img);
			    }
			    Preview.showside('back');
		});
	    },
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
		$('#photo').delegate($('img'), 'change', function(){
			//选择照片成功后，初始化明信片
			LocalDataPostCard.init();
		});
		//重选按钮
		$("#choosePic2").bind("tapone", function(e){Overlay.show("chkphoto");});
		//结束时，再重新创建时的按钮
		$("#choosePic3").bind("tapone", function(e){Overlay.show("chkphoto");});
		
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
		$("div[_to]").bind("tapone", function(e){
			Page.show($(this).attr("_to"));
		});
		//back
		$("div.button_s_back").bind("tapone",function(e){Interface.onBackbutton();});
		
		
		//添加新地址的时候，进行重置
		$("#rcvcreate").bind("tapone",function(e){
			Page.show(3,function(){
				$("#delAddress").attr("LocalID","").hide();
				$("#head_add .adrchk").show();
				$("#head_add .title").html("addAddress".tr());
				$("#addAddress").text("add".tr());
				$("#rcvform").each(function(){this.reset();});
				$("#rcvform #country").trigger("change");
				$("#rcvform [name=LocalID]").val(LocalDataAddress.genID());
			});
		});
		
		
		
		$("#appnav .CAbout").bind("tapone",function(e){Page.show(8);});
		$("#appnav .CLogin").bind("tapone",function(e){Page.show(10);});		
		$("#appnav .CRegister").bind("tapone",function(e){Page.show(11);});
		$("#appnav .CPostCard").bind("tapone",function(e){					   
				Page.show(9,function(){
					var postcards = LocalData.listPostCard();
					var ul = $("#maillist ul");
					ul.html("");
					for(var i=0;i<postcards.length;i++){
						var photo=postcards[i].photo;
						var to=[];
						for(var j=0;j<postcards[i].Address.length;j++){
							to.push(postcards[i].Address[j].Name);
						}
	
						var st="";
						var st_css="pass";
						//状态 1：未开始，2，上传中，还没有成功，3：成功，-1：失败，-2：未支付
						switch(postcards[i].Status){
							case 1:st="st_unpay".tr();st_css="wait";break;
							case 2:st="st_uploading".tr();break;
							case 3:st="st_printing".tr();break;
							case 4:st="st_posting".tr();break;
							case 5:st="st_posted".tr();break;
						}
						
						var style = Photoinfo.tostyle(photo);
						var html='<li active="yes">'+
							'<div class="cover">'+
							'<div class="photo">'+
								'<img style="'+style+'" src="'+photo.o+'" />'+
							'</div>'+
							'<div class="selc"></div>'+
							'<div class="fake"></div>'+
						'</div>'+
						'<div class="title">送给 <span>'+(to.join(", "))+'</span> 的明信片</div>'+
						'<div class="status"><label>状态</label>：<span class="'+st_css+'">'+st+'</span></div>'+
						'<div class="time"><label>创建时间</label>：<span>'+postcards[i].date+'</span></div>'+
						'<div class="actions">'+
							'<div class="act" active="yes"><span class="ico ico_view" localid="'+postcards[i].LocalID+'"><em>查看</em></span></div>'+
							'<div class="act" active="yes"><span class="ico ico_delete" localid="'+postcards[i].LocalID+'"><em>删除</em></span></div>'+
						'</div></li>';
						ul.append(html);
					}
					$("#maillist .ico_view").bind("tapone",function(){
							console.log(this);
							console.log($(this));
							//回到管理邮箱
							$("#titlebar_preview .button_s_back").attr("_back",9);
							var lid=$(this).attr("LocalID");
							LocalDataPostCard = LocalData.getPostCard(lid);
							console.log(LocalDataPostCard);
							//正常新加，预览的返回为评论
							Control.showPreview();

							});
					$("#maillist .ico_delete").bind("tapone",function(){
							var _this=this;
							confirm("delConfirm".tr(),{
									cancel:function(){
									},ok:function(){
									//删除明信片
									//取消订单，从服务端删除PostCardID(不实际删除，只用标记出来)
									//如果已经支付，但是还没有上传成功图片的订单，这里需要退款到用户账户
									//如果其它状态，直接标志就可以了，然后删除本地的记录，但是服务器还保留
										LocalData.delPostCard($(_this).attr("localid"));
										$(_this).parents("li").remove();
									}
								}
							);
					});
				});

		});
		
		$("#appnav .CLogout").bind("tapone",function(e){
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
					$("#privince").html('<option value="">选择</option>').slideDown("fast");
					for(var i =0;i<City.all.length;i++){
						var n = City.all[i].n;
						$("#privince").append('<option value="'+n+'">'+n+'</option>');
					}
				}else{
					$("#privince").html('').slideUp("fast");
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
					$("#city").html('<option value="">选择</option>').slideDown("fast");
					for(var i =0;i<city.length;i++){
						var n = city[i];
						$("#city").append('<option value="'+n+'">'+n+'</option>');
					}
				}else{
					$("#city").html('').slideUp("fast");
				}
		});
		$("#toAddress").bind("tapone",function(e){
				if(!$("#photo img").attr("src") || $("#photo img").attr("src")==""){
					alert("请选择图片");
					return;
				};
				//选择了文件
				var f = LocalDataFile.add($("#photo img").attr("src"));
				if(f && f.FileTmpID){
					LocalDataPostCard.FileTmpID = f.FileTmpID;
					LocalDataPostCard.ImageFileID= f.ImageFileID;
				}

				if(Interface.Latitude!=""){
				LocalDataPostCard.Latitude = Interface.Latitude;
				LocalDataPostCard.Longitude= Interface.Longitude;
				LocalDataPostCard.Device = Interface.Device;
				}

				var info=PhotoEditor.getinfo();
				if(info){ LocalDataPostCard.photo = info; }

				Page.show(2,function(){
					LocalDataAddress.show();
				});
		});
		$("#toComments").bind("tapone",function(e){
				if($("#rcvlist li.checked").length==0){
					alert("请选择收件人");
					return;
				};
				Page.show(4,function(){
					//地址信息
					var adr = $("#rcvlist li.checked");
					LocalDataPostCard.Address=[];
					for(var i=0;i<adr.length;i++){
						LocalDataPostCard.Address.push(LocalDataAddress.get($(adr[i]).attr("LocalID")));
					}
				});
		});
		//预览，生成明信片数据,LocalDataPostCard
		$("#comments").bind("change",function(e){
				console.log($(this).val());
				//评论信息
				LocalDataPostCard.Comments=$(this).val();
		});
		$("#toPreview").bind("tapone",function(e){
				$("#titlebar_preview .button_s_back").attr("_back",4);
				//正常新加，预览的返回为评论
				Control.showPreview();
				
		});
		//预览，生成明信片数据,并保存到本地,然后判断登录情况，提示登录
		//登录成功后，保存明信片数据到服务器，并得到支付ID，然后跳转到支付页面
		$("#toSend").bind("tapone",function(e){
				API.islogin(function(isLogin){
					if(isLogin){
						//开始掉用接口
						//修改登录，注册，返回页面为 0
						API.postPostCard(LocalDataPostCard,function ok(){
								Page.show(6,function(){
								$("#titlebar_login .button_s_back").attr("_back",0);
								$("#titlebar_register .button_s_back").attr("_back",0);
								$("#titlebar_about .button_s_back").attr("_back",0);
								$("#titlebar_postcard .button_s_back").attr("_back",0);
								});
							},function error(msg){
								alert("错误，["+msg+"]请重试");
							});
					}else{
						//指定到登录,BUG
						Page.show(10,function(){
						$("#titlebar_login .button_s_back").attr("_back",5);
						$("#titlebar_register .button_s_back").attr("_back",5);
						$("#titlebar_about .button_s_back").attr("_back",5);
						$("#titlebar_postcard .button_s_back").attr("_back",5);
						$("#login .errorbox").html("need2login".tr()).show();
						});
						//修改登录，注册，返回页面为 6
					}
				});
				//
		});
		
		

		$("#IDLogin").bind("tapone",function(e){
				$("#login .errorbox").html("");
				var sid=$(".sid","#login").val();
				var pwd=$(".pwd","#login").val();
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
				API.register({email:sid,passwd:pwd,passwd2:pwd2,device:Interface.Device},function ok(result){
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
