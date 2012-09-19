//test


//复杂的数据要进行JSON编码，不过有可能程序会FC
//{{{全局变量
var CurrentPostCard = new LeduiPostCard;
	
//}}}

//{{{
var AjaxSetup={
	stat:0, //0,1 start, 2 complete
	msg:"",
	showLoading:true
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
			if(AjaxSetup.showLoading)Loading.show(AjaxSetup.msg);
			AjaxSetup.showLoading=true;
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
		var token = DB.getToken();
		var uid = DB.getUID();
		var uuid = DB.getUUID();
		if(token && token !=""){
			var param={token:token,uid:uid,uuid:uuid};
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
		DB.setToken("","");
		$.ajax({
		   type: "POST",
		   url: API.host+"/user/login",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.result && msg.error_code==0){
			   	DB.setToken(msg.result.UserID,msg.result.UserAccessToken);
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
			   	DB.setToken(msg.result.UserID,msg.result.UserAccessToken);
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
		param.token= DB.getToken();
		param.uid= DB.getUID();
		param.uuid= DB.getUUID();
		var addr = new LeduiAddress;
		param.AddressData = JSON.stringify(addr.list());
		AjaxSetup.showLoading=false;
		$.ajax({
		   type: "POST",
		   url: API.host+"/user/synAddress",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.result && msg.error_code==0){
			   console.log(msg.result);
			   	if(msg.result.length>0) addr.clear();
				for(var i=0;i<msg.result.length;i++){
					addr.add(msg.result[i]);
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
		DB.setToken("","");
		if(ok)ok();return;
	},
	//创建明信片，返回明信片ID，更新本地明信片状态，然后开始上传具体的文件
	postPostCard:function(PostCard,ok,error){
		var param={};
		param.token= DB.getToken();
		param.uid= DB.getUID();
		param.uuid= DB.getUUID();
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
		param.token= DB.getToken();
		param.uid= DB.getUID();
		param.uuid= DB.getUUID();
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
			
			return;
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
		
	   CurrentPostCard.Device = device;
	   if(device.uuid){
		   DB.setUUID(device.uuid);
		   //_DB.uuid=Interface.Device.uuid;
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
	       CurrentPostCard.Latitude = Interface.Latitude;
	       CurrentPostCard.Longitude= Interface.Longitude;
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

	init: function(n){
		/*初始化*/
		//1.数据初始化
		//a.登录状态
		API.islogin(function(r){
		  	if(r){
		  		$("#login .errorbox").fadeOut();
		  		$("#isnotlogin").fadeOut();
		  		$("#islogin").fadeIn();
		  	}
		});
		//b.明信片状态查询
		//2.界面接口
		$("#choosePic").bind("tapone", function(e){Overlay.show("chkphoto");});
		$('#photo').delegate($('img'), 'change', function(){
			//选择照片成功后，初始化明信片
			CurrentPostCard = new LeduiPostCard;
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
		
		

		
		
		$("#appnav .CAbout").bind("tapone",function(e){Page.show(8);});
		$("#appnav .CLogin").bind("tapone",function(e){Page.show(10);});		
		$("#appnav .CRegister").bind("tapone",function(e){Page.show(11);});
		$("#appnav .CPostCard").bind("tapone",function(e){					   
					var ul = $("#maillist ul");
					ul.hide();
				Page.show(9,function(){
									 Control.showPostCard();
				}, { y:0 });

		});
		
		$("#appnav .CLogout").bind("tapone",function(e){
			API.logout({},function ok(result){
				$("#islogin").fadeOut();
				$("#isnotlogin").fadeIn();
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
		//添加新地址的时候，进行重置
		$("#rcvcreate").bind("tapone",function(e){
			Page.show(3,function(){
				$("#delAddress").attr("LocalID","").hide();
				$("#head_add .adrchk").show();
				$("#head_add .title").html("addAddress".tr());
				$("#addAddress").text("add".tr());
				$("#rcvform").each(function(){this.reset();});
				$("#rcvform #country").trigger("change");
				$("#rcvform [name=LocalID]").val("");
			});
		});
		
		$("#addAddress").bind("tapone",function(e){
			var ado = new LeduiAddress();
			console.log("XXXX");
			console.log(ado);
			var a =  $("#rcvform").serializeArray();
			for(var i in a){
				var k = a[i].name;
				var v = a[i].value;
				if(v!=""){
					ado[k]=v;
				}
			}
			if(ado.Name==""){
				alert("收件人名字不能为空");
			}else if(ado.Address==""){
				alert("收件人地址不能为空");
			}else{
				Page.show(2,function(){
					console.log(ado);
					ado.add(ado);
					Control.showAddress()
				}, { y:0 });
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

				Page.show(2,function(){
					//选择了文件
					var file = new LeduiFile;
					file.FilePath = $("#photo img").attr("src");
					
					var f = file.add(file);
					if(f && f.FileTmpID){
						CurrentPostCard.FileTmpID = f.FileTmpID;
						CurrentPostCard.ImageFileID= f.ImageFileID;
					}
	
					if(Interface.Latitude!=""){
					CurrentPostCard.Latitude = Interface.Latitude;
					CurrentPostCard.Longitude= Interface.Longitude;
					CurrentPostCard.Device = Interface.Device;
					}
	
					var info=PhotoEditor.getinfo();
					if(info){ CurrentPostCard.photo = info; }
					Control.showAddress()
				});
		});
		$("#toComments").bind("tapone",function(e){
				if($("#rcvlist li.checked").length==0){
					alert("请选择收件人");
					return;
				};
				Page.show(4,function(){
				});
		});
		//预览，生成明信片数据,LocalDataPostCard
		$("#comments").bind("change",function(e){
				console.log($(this).val());
				//评论信息
				CurrentPostCard.Comments=$(this).val();
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
									//$("#titlebar_postcard .button_s_back").attr("_back",0);
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
							//$("#titlebar_postcard .button_s_back").attr("_back",5);
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
				var uuid = DB.getUUID();
				var device=Interface.Device;
				API.login({email:sid,passwd:pwd,uuid:uuid,device:JSON.stringify(device)},function ok(result){
					//登录成功,更新登录状态,跳到登录前的一页
					$("#login .errorbox").fadeOut();
					$("#isnotlogin").fadeOut();
					$("#islogin").fadeIn();
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
					$("#isnotlogin").fadeOut();
					$("#islogin").fadeIn();
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
	},
	showAddress:function(){
		
		var list=$("#rcvlist .list");
		var ul = list.find("ul");
		var div = list.find("div");
		var adr = new LeduiAddress();
		var adds = adr.list();
		console.log(adds);
		if(adds.length>0){
			div.hide();
			ul.show().html("");
			//显示各地址
			for(var i =0;i<adds.length;i++){
				var check="";
				if(CurrentPostCard.Address){
					for(var j=0;j<CurrentPostCard.Address.length;j++){
						if(adds[i].LocalID == CurrentPostCard.Address[j].LocalID){
							check='class="checked"';
						}
					}
				}
				var html='<li active="yes" '+check+' LocalID="'+adds[i].LocalID+'">'+
					'<div class="edit" LocalID="'+adds[i].LocalID+
						'"active="yes"><div class="icon"></div></div>'+
					'<div class="info">'+
					'<div class="checkbox"><div class="icon"></div></div>'+
					'<span class="name">'+adds[i].Name+'</span>'+
					'<span class="phone">'+(adds[i].Mobile||"")+'</span>'+
					'<span class="address">'+(adds[i].Country||"")+" "+
						(adds[i].Privince||"")+" " +(adds[i].City||"")+" "+adds[i].Address+'</span>'+
					'</div></li>';
				ul.append(html);
			}
		}else{
			div.show();
			ul.hide();
		}
		
		//选择地址
		$('#rcvlist li .info').bind('tapone', function(){
			$(this).parent().toggleClass('checked');
			
			var adr = $("#rcvlist li.checked");
			CurrentPostCard.Address=[];
			var ado = new LeduiAddress();
			for(var i=0;i<adr.length;i++){
				CurrentPostCard.Address.push(ado.get($(adr[i]).attr("LocalID")));
			}
		});
		//删除地址
		$("#delAddress").bind("tapone", function(){
			Page.show(2,function(){
				var ado = new LeduiAddress;
				ado.del($(this).attr("LocalID"));
				 Control.showAddress();
			});
		});
		//编辑地址
		$('#rcvlist .edit').bind('tapone', function(){
			var id = $(this).attr("LocalID");
			var ado = new LeduiAddress();
			var adr = ado.get(id);
			if(id && adr){
				Page.show(3,function(){
					$("#head_add .adrchk").hide();
					$("#head_add .title").html("editAddress".tr());
					$("#delAddress").attr("LocalID",id).show();
					$("#addAddress").text("edit".tr());
					$("#rcvform").each(function(){
						for(var i in adr){
							$(this).find("[name='"+i+"']").val(adr[i]).trigger("change");
						}
					});
									 
				});

			}
			return false;
		});
		
	
	},showPreview:function(){
		Page.show(5,function(){
			    //显示预览页面
			    $("#postinfo [name='Name']").html(CurrentPostCard.Address[0].Name);
			    $("#postinfo [name='Address']").html(
					    CurrentPostCard.Address[0].Country+" "+
					    CurrentPostCard.Address[0].Privince +" "+
					    CurrentPostCard.Address[0].City+" "+
					    CurrentPostCard.Address[0].Address+" "
					    );
			    $("#postinfo [name='PostCode']").html(CurrentPostCard.Address[0].PostCode);
			    $("#msginfo [name='Name']").html(CurrentPostCard.Address[0].Name);
			    $("#msginfo [name='Comments']").html(CurrentPostCard.Comments);
				var postcard = new LeduiPostCard();
			    postcard.add(CurrentPostCard);
			    //获取登录者的名字
			    //$("#msginfo [name='FromName']").html();
			    if(CurrentPostCard.photo){
				    var photoinfo = CurrentPostCard.photo;
				    var style = Photoinfo.tostyle(photoinfo);
				    var img = $('<img style="'+ style +'" src="'+ photoinfo.o +'" />');
				    $('.card_front .photo').html('').append(img);
			    }
			    Preview.showside('back');
		});
	    },showPostCard:function(){
				var postcard = new LeduiPostCard;
				var postcards = postcard.list();
				//{{{ check change
				var li = $("#maillist ul li");
				var isNew = false;
				if(li.size()==0)isNew=true;
				for(var i=postcards.length-1,j=0;i>=0,j<li.size();i--,j++){
					var localid1 = postcards[i].LocalID;
					var localid2 = li.eq(j).attr("LocalID");
					if(localid1 != localid2){ isNew=true;}
				};
				//}}}
				if(isNew==false){
					console.log("OLD");
					var ul = $("#maillist ul");
					ul.show();
	    			}else{
					console.log("NEW");
					var ul = $("#maillist ul");
					ul.html("").show();;
					for(var i=postcards.length-1;i>=0;i--){
						(function(i){
							setTimeout(function(){	  
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
								var html='<li active="yes" LocalID="'+postcards[i].LocalID+'">'+
									'<div class="cardinfo"><div class="cover">'+
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
									'<div class="act" active="yes"><span class="ico ico_view" LocalID="'+postcards[i].LocalID+'"><em>查看</em></span></div>'+
									'<div class="act" active="yes"><span class="ico ico_delete" LocalID="'+postcards[i].LocalID+'"><em>删除</em></span></div>'+
								'</div></div></li>';
								var li = $(html);
								
								ul.append(li);
								
								li.find(".ico_view").bind("tapone",function(){
										//回到管理邮箱
										$("#titlebar_preview .button_s_back").attr("_back",9);
										var lid=$(this).attr("LocalID");
										var postcard = new LeduiPostCard();
										CurrentPostCard = postcard.get(lid);
										console.log(CurrentPostCard);
										//正常新加，预览的返回为评论
										Control.showPreview();
			
								});
								li.find(".ico_delete").bind("tapone",function(){
										//用全局变量，解决在confirm后，lid的值变会的问题
										window.__lid =$(this).attr("LocalID");
										window.__p = $(this).parents("li");
										console.log(window.lid);
										confirm("delConfirm".tr(),{
												cancel:function(){
												},ok:function(){
												//删除明信片
												//取消订单，从服务端删除PostCardID(不实际删除，只用标记出来)
												//如果已经支付，但是还没有上传成功图片的订单，这里需要退款到用户账户
												//如果其它状态，直接标志就可以了，然后删除本地的记录，但是服务器还保留
												
													var postcard = new LeduiPostCard();
													postcard.del(window.__lid);
													console.log(window.__lid);
													//window.__p.slideUp("fast",function(){window.__p.remove();});
													window.__p.animate({height:0}, 300, '' ,function(){window.__p.remove();});
												}
											}
										);
								});
								
							}, (postcards.length-1-i) * 20);
						})(i);
						
					}
				}
							
		}
}
//{{{
$(document).ready(function(){
	DB.clear();
	Control.init();
});
document.addEventListener("deviceready", Interface.onDeviceReady, false);
//}}}




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
