//test
//复杂的数据要进行JSON编码，不过有可能程序会FC
//{{{全局变量
var CurrentPostCard = new LeduiPostCard;
var AvaliableCurrency={};
//}}}

//{{{
var AjaxSetup={
	stat: 0, //0,1 start, 2 complete
	msg: '',
	showLoading: true
}
$.ajaxSetup({
	global: false,
	type: 'POST',
	timeout: 8000,
	beforeSend: function(e){
	//600毫米如果还没有反应，就显示进度条
	AjaxSetup.stat=1;
		setTimeout(function(){
			if(AjaxSetup.stat==1){
				if(AjaxSetup.showLoading){ Loading.show(AjaxSetup.msg); }
				AjaxSetup.showLoading = true;
				AjaxSetup.stat = 0;
			}
		},600);
	}
	,complete:function(e){
		AjaxSetup.stat = 2;
		Loading.hide();
	}
});
//}}}

//接口
var API = {
	host_main: "http://www.ledui.com",
	host_api: "http://www.ledui.com/api.php/api",
	uploadHost:"http://www.ledui.com/image/upload",
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
				url: API.host_api+"/user/islogin",
				data: param,
				dataType: "JSON",
				success: function(msg){
					if(msg){
						if(callback){ callback(true); }
					}else{
						if(callback){ callback(false); }
					}
				},
				error:function(msg){
					if(callback){ callback(false); }
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
			url: API.host_api+"/user/login",
			data: param,
			dataType: "JSON",
			success: function(msg){
				if(msg && msg.result && msg.error_code==0){
					DB.setToken(msg.result.UserID,msg.result.UserAccessToken);
					if(ok){ ok(msg); }
					return true;
				}else{
					if(error){ error(msg); }
				}
			},
			error:function(msg){
				if(error){ error(msg); }
				return false;
			}
		});
	},
	register: function(param,ok,error){
		$.ajax({
			type: "POST",
			url: API.host_api+"/user/register",
			data: param,
			dataType: "JSON",
			success: function(msg){
				if(msg && msg.result && msg.error_code==0){
					DB.setToken(msg.result.UserID,msg.result.UserAccessToken);
					if(ok){ ok(msg); }
					return true;
				}else{
					if(error){ error(msg); }
				}
			},
			error:function(msg){
				if(error){ error(msg); }
				return false;
			}
		});
	},
	//登出
	logout: function(param,ok,error){
		DB.setToken("","");
		if(ok){ ok(); }
		return;
	},
	//创建明信片，返回明信片ID，更新本地明信片状态，然后开始上传具体的文件
	postPostCard:function(PostCard,ok,error){
		var param={};
		param.token= DB.getToken();
		param.uid= DB.getUID();
		param.PostCard = JSON.stringify(PostCard);
		$.ajax({
			type: "POST",
			url: API.host_api+"/postcard/post",
			data: param,
			dataType: "JSON",
			success: function(msg){
				if(msg && msg.result && msg.error_code==0){
					//update address
					if(msg.result.PostCardID && msg.result.LocalID){
						var pst = new LeduiPostCard;
						var postcard = pst.get(msg.result.LocalID);
						postcard.PostCardID = msg.result.PostCardID;
						postcard.ImageFileID = msg.result.ImageFileID;
						postcard.TradeNo= msg.result.TradeNo;
						pst.add(postcard);
					}
					if(msg.result.AvaliableCurrency){
						AvaliableCurrency = msg.result.AvaliableCurrency;
					}
					if(msg.result.Address){
						var adr = new LeduiAddress;
						//var localAddr=adr.list(DB.getUID());
						//console.log(localAddr)
						for(var i=0;i<msg.result.Address.length;i++){
							adr.add(msg.result.Address[i]);
						}

					}
					$("#payForm [name='TradeNo']").val(msg.result.TradeNo);
					$("#payForm [name='token']").val(DB.getToken());
					$("#payForm [name='uid']").val(DB.getUID());
					//console.log(msg.result);
					//PayURL
					//if(msg.result.PayURL){
					//	$("#payaction .button_pay").attr("src",msg.result.PayURL);
					//}
					//PostCard
					//UserID
					if(ok){ ok(msg.result); }
				}else{
					if(error && msg.error_msg){ error(msg.error_msg); }
				}
			},
			error:function(msg){
				if(error){ error(msg); }
			}
		});
		
	},
	//get Order
	getOrder:function(TradeNo,ok,error){
		var param={};
		param.token= DB.getToken();
		param.uid= DB.getUID();
		param.TradeNo= TradeNo;
		$.ajax({
			type: "POST",
			url: API.host_main+"/order.main.get",
			data: param,
			dataType: "JSON",
			success: function(msg){
				if(msg && msg.result && msg.error_code==0){
					//已经支付，更新本地状态
					var postcard = (new LeduiPostCard).list();
					for(var i=0;i<postcard.length;i++){
						if(postcard[i].TradeNo==TradeNo){
							postcard[i].OrderStatus=msg.result.OrderStatus;
							(new LeduiPostCard).add(postcard[i]);
							break;
						}
					}

					if(ok){ ok(msg.result); }
				}else{
					if(error && msg.error_msg){ error(msg.error_msg); }
				}
			},
			error:function(msg){
				if(error){ error(msg); }
			}
		});
	},
	//删除服务器的明信片(其实只是一个标记位)
	delPostCard:function(PostCard,ok,error){
		var param={};
		param.token= DB.getToken();
		param.uid= DB.getUID();
		param.PostCard = JSON.stringify(PostCard);
		$.ajax({
			type: "POST",
			url: API.host_api+"/postcard/del",
			data: param,
			dataType: "JSON",
			success: function(msg){
				if(msg && msg.result && msg.error_code==0){
					//console.log(msg.result);
					//PayURL
					//PostCard
					//LocalID(postcard)
					if(ok){ ok(msg); }
				}else{
					if(error && msg.error_msg){ error(msg.error_msg); }
				}
			},
			error:function(msg){
				if(error){ error(msg); }
			}
		});
	},
	//删除地址
	delAddress:function(id,ok,error){
		var param={};
		param.token= DB.getToken();
		param.uid= DB.getUID();
		param.id= id;
		$.ajax({
		   type: "POST",
		   url: API.host_api+"/address/del",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.result && msg.error_code==0){
			   	var AddressID=msg.result;
				var adr = new LeduiAddress;
				var localAddr=adr.list(DB.getUID());
				for(var i=0;i<localAddr.length;i++){
					if(localAddr[i].AddressID==AddressID){
						adr.del(localAddr[i].LocalID);
					}
				}
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
	//列表地址
	listAddress:function(ok,error){
		var param={};
		param.token= DB.getToken();
		param.uid= DB.getUID();
		$.ajax({
		   type: "POST",
		   url: API.host_api+"/address/list",
		   data: param,
		   dataType: "JSON",
		   success: function(msg){
			   if(msg && msg.result && msg.error_code==0){
			   	if(msg.result.items && msg.result.items.length>0){
					var adr = new LeduiAddress;
					var localAddr=adr.list(DB.getUID());
					for(var i=0;i<msg.result.items.length;i++){
						var item=msg.result.items[i];
						var adr2 = new LeduiAddress;
						for(var x in item){
							adr2[x]=item[x];
						}
						for(var j=0;j<localAddr.length;j++){
							if(localAddr[j].AddressID==item.AddressID){
								adr2.LocalID = localAddr[j].LocalID;
							};
						}
						adr.add(adr2);
					}
				}
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
    	//,移到worker里去，实现多进程隐藏上传
	upload:function(LeduiPostCardObject){
		//更新当前明信片状态为上传(TODO)
		
		var postcard = new LeduiPostCard;
		var realObject = postcard.get(LeduiPostCardObject.LocalID);
		realObject.Status = 2;
		postcard.add(realObject);
		
		

		var imageURI	= realObject.photo.o;
		//考虑到当前版本没有slice的方法，对大文件的读取，会导致crash，所以，暂时不支持断点续传
		var options = new FileUploadOptions();
		options.fileKey="fileKey";
		options.fileName="fileName";
		options.mimeType="image/jpeg";
		options.chunkedMode=true;
		var param={};
		param.token= DB.getToken();
		param.uid= DB.getUID();
		param.PostCardID = realObject.PostCardID;
		param.ImageFileID = realObject.ImageFileID;
		param.FileURL = realObject.photo.o;
		param.data_src = JSON.stringify(LeduiPostCardObject);
		param.data = JSON.stringify(realObject);
		options.params = param;
		
		var ft = new FileTransfer();
		ft.upload(
			realObject.photo.o,
			API.uploadHost,
			function ok(r){
				//更新当前明信片状态为上传成功(TODO)
				realObject.Status = 3;
				var postcard = new LeduiPostCard;
				postcard.add(realObject);
				alert(r.response);									 
			},
			function fail(){
				//更新当前明信片状态为上传失败(TODO)
				realObject.Status = -1;
				var postcard = new LeduiPostCard;
				postcard.add(realObject);
			
			}, 
			options
		);
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
		var p = PageMgr.getcurrentpage().appview.find(".button_s_back").attr("_back");
		if(p){
			PageMgr.back(p);
			return;
		}
		//如果，是第0页，按后退，就提示程序退出
		confirm("您确定要退出吗?", {
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
		PageMgr.go(1, {
			callback:function(){
				CurrentPostCard = new LeduiPostCard;
				PhotoEditor.init(imageURI);
			
			}
		});
	},
	onFail:function (message) {
	       CurrentPostCard = new LeduiPostCard;
	},
	onGEOSuccess:function(position) {
		this.Longitude = position.coords.longitude;
		this.Latitude= position.coords.latitude;
		CurrentPostCard.Latitude = Interface.Latitude;
		CurrentPostCard.Longitude= Interface.Longitude;
		//		alert('Latitude: '    + position.coords.latitude              + '\n' +
		//		Longitude: '          + position.coords.longitude             + '\n' +
		//		Altitude: '           + position.coords.altitude              + '\n' +
		//		Accuracy: '           + position.coords.accuracy              + '\n' +
		//		Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '\n' +
		//		Heading: '            + position.coords.heading               + '\n' +
		//		Speed: '              + position.coords.speed                 + '\n' +
		//		Timestamp: '          + position.timestamp          + '\n');
	},
	onGEOError:function(error) {
	
	}
}
//界面操作
var Control = {
	init: function(){
		this.bind();		
		PageMgr.show(9);
		Control.autoLogin();
	},
	bind: function(){

/****************************/
/* -1: 通用					*/
/****************************/
		//页面按钮
		$("[_to]").bind("tapone", function(e){ PageMgr.go($(this).attr("_to")); });
		$(".button_s_back").bind("tapone", function(e){ Interface.onBackbutton(); });
		
		//导航
		var appnav = $("#appnav"); 
		appnav.find(".CAbout").bind("tapone", function(e){ PageMgr.show(8); });
		appnav.find(".CLogin").bind("tapone", function(e){ PageMgr.show(10); });		
		appnav.find(".CRegister").bind("tapone", function(e){ PageMgr.show(11); });
		appnav.find(".CPostCard").bind("tapone", function(e){ PageMgr.show(9); });
		appnav.find(".CLogout").bind("tapone", function(e){ Control.logout(); });
		
		//照片选择器
		//camera
		$("#choosePicFromCamera").bind("tapone", function(e){
			navigator.camera.getPicture(Interface.onPhotoURISuccess, Interface.onFail, 
				{
					quality: 100, 
					allowEdit: true,
					destinationType: navigator.camera.DestinationType.FILE_URI 
				}
			);
			Overlay.hide("chkphoto");
		});
		//album
		$("#choosePicFromAlbum").bind("tapone", function(e){
			navigator.camera.getPicture(Interface.onPhotoURISuccess, Interface.onFail, 
				{
					quality: 100, 
					sourceType:navigator.camera.PictureSourceType.PHOTOLIBRARY,
					destinationType: navigator.camera.DestinationType.FILE_URI 
				}
			);
			Overlay.hide("chkphoto");
		});
	
		var page0 = PageMgr.getpage(0)
			,page1 = PageMgr.getpage(1)
			,page2 = PageMgr.getpage(2)
			,page3 = PageMgr.getpage(3)
			,page4 = PageMgr.getpage(4)
			,page5 = PageMgr.getpage(5)
			,page6 = PageMgr.getpage(6)
			,page7 = PageMgr.getpage(7)
			,page8 = PageMgr.getpage(8)
			,page9 = PageMgr.getpage(9)
			,page10 = PageMgr.getpage(10)
			,page11 = PageMgr.getpage(11)
			,page12 = PageMgr.getpage(12);
				
/****************************/
/* 0: 首页					*/
/****************************/
		
		page0.bind('use', function(){
			//选择图片
			$("#choosePic").bind("tapone", function(e){ Overlay.show("chkphoto"); });
		});
		
/****************************/
/* 1: 编辑图片				*/	
/****************************/

		page1.bind('use', function(){
			//明信片状态查询
			$('#photo').delegate($('img'), 'change', function(){
				//选择照片成功后，初始化明信片
				CurrentPostCard = new LeduiPostCard;
			});
			//重选
			$("#choosePic2").bind("tapone", function(e){ Overlay.show("chkphoto"); });
			//跳转收件人选择
			$("#toAddress").bind("tapone", function(e){
				var src = $("#photo img").attr("src");
				if(!src){ alert("请选择图片"); return; };
				if(PhotoEditor.isready==false){ alert("图片加载中，请稍后"); return;}
				
				//选择了文件
				var file = new LeduiFile;
				file.FilePath = src;
				
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
				CurrentPostCard.ThumbnailData = PhotoEditor.getimage(0.125);
				PageMgr.go(2);
			});	
		});
		
/****************************/
/* 2: 收件人信息			*/
/****************************/

		page2.bind('use', function(){
			//添加新地址的时候，进行重置
			$("#rcvcreate").bind("tapone",function(e){			
				$("#delAddress").attr("LocalID","").hide();
				$("#adrchk").show();
				$("#adrtitle").html("addAddress".tr());
				$("#addAddress").text("add".tr());
				$("#rcvform").each(function(){ this.reset();} );
				$("#country").trigger("change");
				$("#rcvform").find("[name=LocalID]").val("");
				PageMgr.go(3);
			});
			//跳转留言
			$("#toComments").bind("tapone", function(e){
				if($("#rcvlist li.checked").length==0){
					alert("请选择收件人");
					return;
				};
				PageMgr.go(4);
			});	
		}).bind('show', function(){
			Control.showAddress();
		});
		
/****************************/
/* 3: 添加收件人信息		*/	
/****************************/
		page3.bind('use', function(){
			//联系人地址添加编辑
			var rcvform = $("#rcvform")
				,btnrcvadd = $("#addAddress")
				,btnrcvdel = $("#delAddress")
				,country = rcvform.find("#country") 
				,privince = rcvform.find("#privince")
				,city = rcvform.find("#city")
			
			//删除地址
			btnrcvdel.bind("tapone", function(){
				var ado = new LeduiAddress;
				var adr = ado.get($(this).attr("LocalID"));
				if(adr['AddressID']!=""){
					API.delAddress(adr['AddressID']);
				}
				ado.del($(this).attr("LocalID"));
				
				PageMgr.back(2, { 
					'callback': function(){
						page2.f5scroll();
					}
				});
			});
			btnrcvadd.bind("tapone",function(e){
				var ado = new LeduiAddress();
				var a =  rcvform.serializeArray();
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
					ado.add(ado);
					PageMgr.back(2, { 
						'callback': function(){
							page2.f5scroll().scrollto(0, 0);
						}
					});
				}
			});
			country.bind("change",function(e){			
				if($(this).val() == "CN"){
					privince.html('<option value="">选择</option>').slideDown("fast");
					for(var i =0, len=City.all.length;i<len;i++){
						var n = City.all[i].n;
						privince.append('<option value="'+n+'">'+n+'</option>');
					}
				}else{
					privince.html('').slideUp("fast");
					city.html('').hide();
				}
			}).trigger("change");
			privince.bind("change",function(e){
				var citys = City.listCity($(this).val());
				if(citys.length>0){
					city.html('<option value="">选择</option>').slideDown("fast");
					for(var i =0, len=citys.length;i<len;i++){
						var n = citys[i];
						city.append('<option value="'+n+'">'+n+'</option>');
					}
				}else{
					city.html('').slideUp("fast");
				}
			});
		});

/****************************/
/* 4: 输入留言信息			*/	
/****************************/

		page4.bind('use', function(){
			//预览，生成明信片数据
			$("#comments").bind("change", function(e){
				//评论信息
				CurrentPostCard.Comments = $(this).val();
			});
			$("#toPreview").bind("tapone", function(e){
				$("#titlebar_preview .button_s_back").attr("_back",4);
				PageMgr.go(5);
			});
		});

/****************************/
/* 5: 预览					*/	
/****************************/
		page5.bind('use', function(){
			//预览，生成明信片数据,并保存到本地,然后判断登录情况，提示登录
			//登录成功后，保存明信片数据到服务器，并得到支付ID，然后跳转到支付页面
			$("#toSend").bind("tapone", function(e){
				API.islogin(function(isLogin){
					if(isLogin){
						//开始掉用接口
						//修改登录，注册，返回页面为 0
						var postobj  = new LeduiPostCard;
						var postcard = postobj.get(CurrentPostCard.LocalID);
						API.postPostCard(
							postcard,function ok(r){
								$("#titlebar_login .button_s_back").attr("_back",0);
								$("#titlebar_register .button_s_back").attr("_back",0);
								$("#titlebar_about .button_s_back").attr("_back",0);
								Control.showPay(r);
							},
							function error(msg){
								alert("错误，["+msg+"]请重试");
							}
						);
					}else{
						//指定到登录,BUG
						$("#titlebar_login .button_s_back").attr("_back",5);
						$("#titlebar_register .button_s_back").attr("_back",5);
						$("#titlebar_about .button_s_back").attr("_back",5);
						//$("#titlebar_postcard .button_s_back").attr("_back",5);
						$("#login .errorbox").html("need2login".tr()).slideDown("fast",function(){
								setTimeout(function(){
									$("#login .errorbox").slideUp();
								},5000);});
						PageMgr.go(10);
					}
				});
			});
		}).bind('show', function(){
			Control.showPreview();
		});

/****************************/
/* 6: 支付邮费				*/	
/****************************/
		
		page6.bind('use', function(){
			$("#currency").bind("change",function(e){
				if($(this).val()!="RMB"){
					$("#OrderAmount").html("$5");
					//重新计算货币值与显示值
					$("#payaction_alipal").hide();
					$("#payaction_paypal").show();
				}else{
					$("#OrderAmount").html("&yen;14.5");
					$("#payaction_alipal").show();
					$("#payaction_paypal").hide();
				}
			});			
			$("#payaction .button_pay").bind("tapone",function(e){
				var url=API.host_main+"/order.main.pay?"+$("#payForm").serialize();
				confirm("payedConfirm".tr(),{
					cancel:function(){
					},ok:function(){
						//检测是不是真的已经支付
						API.getOrder($("#payForm [name='TradeNo']").val(),function(Order){
							if(Order.OrderStatus==3){
							//已经支付
							PageMgr.go(7, {
								callback:function(){
									API.upload(CurrentPostCard);
								}
							});
							}else{
							alert("支付失败，请重新支付");
							}
						});
						//定位到，我的信箱，显示上传状态
					}
				});
				try{
					navigator.app.loadUrl(url,{openExternal:true});
				}catch(e){
					window.open(url);
				}
			});
		});	

/****************************/
/* 7: 支付完成				*/	
/****************************/

		page7.bind('use', function(){
			//继续创建一张
			$("#choosePic3").bind("tapone", function(e){ Overlay.show("chkphoto"); });
		});

/****************************/
/* 8: 关于					*/	
/****************************/
		

/****************************/
/* 9: 我的信箱				*/	
/****************************/

		page9.bind('show', function(){
			Control.showPostCard();
		});

/****************************/
/* 10: 登录					*/	
/****************************/
		
		page10.bind('use', function(){
			$("#IDLogin").bind("tapone", function(e){
				$("#login .errorbox").html("");
				var sid=$(".sid","#login").val();
				var pwd=$(".pwd","#login").val();
				var uuid = DB.getUUID();
				var device=Interface.Device;
				API.login({email:sid,passwd:pwd,uuid:uuid,device:JSON.stringify(device)},
					function ok(result){
						//登录成功,更新登录状态,跳到登录前的一页
						$("#login .errorbox").fadeOut();
						$("#isnotlogin").fadeOut();
						$("#islogin").fadeIn();
						Interface.onBackbutton();
					},
					function error(result){
						//登录失败，提示错误信息
						if(result.error_msg) $("#login .errorbox").html(result.error_msg);
						$("#login .errorbox").slideDown("fast",function(){
								setTimeout(function(){
									$("#login .errorbox").slideUp();
								},5000);
					});
				});
			});
		});

/****************************/
/* 11: 注册					*/	
/****************************/
		
		page11.bind('use', function(){
			$("#IDRegister").bind("tapone", function(e){
				var sid=$("#register .sid").val();
				var pwd=$("#register .pwd").val();
				var pwd2=$("#register .pwd2").val();
				API.register({email:sid,passwd:pwd,passwd2:pwd2,device:Interface.Device},
					function ok(result){
						//注册成功，自动登录,更新登录状态,跳到登录前的一页
						$("#register .errorbox").fadeOut();
						$("#isnotlogin").fadeOut();
						$("#islogin").fadeIn();
						Interface.onBackbutton();
					},
					function error(result){
						//登录失败，提示错误信息
						if(result.error_msg) $("#register .errorbox").html(result.error_msg);
						$("#register .errorbox").slideDown("fast",function(){
							setTimeout(function(){
								$("#register .errorbox").slideUp();
							},5000);
						});
				});
			});
		});
		
/****************************/
/* 12: 账户					*/	
/****************************/		


				
	},
	
	autoLogin: function(){
		API.islogin(function(r){
		  	if(r){
		  		$("#login").find(".errorbox").fadeOut();
		  		$("#isnotlogin").hide();
		  		$("#islogin").show();
		  	}
		});
	},
	
	logout: function(){
		API.logout(
			{},
			function ok(result){
				$("#islogin").fadeOut();
				$("#isnotlogin").fadeIn();
			},
			function error(result){
			}
		);
	},
	
	showAddress:function(){
		
		var list = $("#rcvlist").find(".list");
		var ul = list.find("ul");
		var div = list.find("div");
		var adr = new LeduiAddress();
		var adds = adr.list(DB.getUID());
		if(adds.length>0){
			div.hide();
			ul.show().html("");
			//显示各地址
			for(var i =0;i<adds.length;i++){
				var check="";
				if(CurrentPostCard.AddressID){
					for(var j=0;j<CurrentPostCard.AddressID.length;j++){
						if(adds[i].LocalID == CurrentPostCard.AddressID[j]){
							check='class="checked"';
						}
					}
				}
				var html='<li active="yes" '+check+' LocalID="'+adds[i].LocalID+'">'+
					'<div class="edit" LocalID="'+adds[i].LocalID+'"active="yes"><div class="icon"></div></div>'+
					'<div class="info">'+
					'<div class="checkbox"><div class="icon"></div></div>'+
					'<span class="name">'+adds[i].Name+'</span>'+
					'<span class="phone">'+(adds[i].Mobile||"")+'</span>'+
					'<span class="address">'+(adds[i].Country.tr()||"")+" "+(adds[i].Privince||"")+" " +(adds[i].City||"")+" "+adds[i].Address+'</span>'+
					'</div></li>';
				var li=$(html);
				//选择地址
				li.find('.info').bind('tapone', function(){
					$(this).parent().toggleClass('checked');

					var adr = $("#rcvlist li.checked");
					CurrentPostCard.Address=[];
					CurrentPostCard.AddressID=[];
					var ado = new LeduiAddress();
					for(var i=0;i<adr.length;i++){
						CurrentPostCard.AddressID.push($(adr[i]).attr("LocalID"));
					}
				});		
				//编辑地址
				li.find('.edit').bind('tapone', function(){
					var id = $(this).attr("LocalID");
					var ado = new LeduiAddress();
					var adr = ado.get(id);
					if(id && adr){
						$("#adrchk").hide();
						$("#adrtitle").html("editAddress".tr());
						$("#delAddress").attr("LocalID",id).show();
						$("#addAddress").text("edit".tr());
						$("#rcvform").each(function(){
							for(var i in adr){
							$(this).find("[name='"+i+"']").val(adr[i]).trigger("change");
							}
							});
						PageMgr.go(3);
					}
					return false;
				});		
				ul.append(li);
			}
		}else{
			div.show();
			ul.hide();
		}	
	},
	showPay:function(msg){
		$("#Price").html(msg.Price/100);
		$("#MoneyCurrent").html(msg.MoneyCurrent/100);
		$("#OrderAmount").html("&yen;"+msg.OrderAmount/100);
		$("#ScoreCurrent").html(msg.ScoreCurrent);
		$("#PostCardCount").html(msg.PostCardCount);
		$("#OrderTotalPrice").html("&yen;"+msg.OrderTotalPrice);
		$("#PostCardCount").html(msg.PostCardCount);
		PageMgr.go(6);
	},
	showPreview:function(){	
		var adr = new LeduiAddress;
		var add = adr.get(CurrentPostCard.AddressID[0]);
		if(!add){ return; }
		$("#postinfo [name='Name']").html(add.Name);
		$("#postinfo [name='Address']").html(
				add.Country+" "+
				add.Privince +" "+
				add.City+" "+
				add.Address+" "
				);
		$("#postinfo [name='PostCode']").html(add.PostCode);
		$("#msginfo [name='Name']").html(add.Name);
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
		Preview.show();
	},
	showPostCard:function(){
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
			var ul = $("#maillist ul");
			//更新支付状态
			for(var i=postcards.length-1;i>=0;i--){
				var LocalID=postcards[i].LocalID;
				var st="";
				var st_css="pass";
				//上传状态	1,未开始 2,上传中，还没有成功，3,成功，-1,失败，
				switch(postcards[i].Status){
					case 1:st="st_unpay".tr();st_css="wait";break;
					case 2:st="st_uploading".tr();break;
					case 3:
					       switch(postcards[i].OrderStatus){
						       /*
							 -3	OrderFailed	支付失败
							 -2	OrderTimeout	订单超时
							 -1	OrderCancel	订单取消
							 1	OrderDefault	默认类型,新订单
							 2	OrderPaying	支付中
							 3	OrderPaid	已经支付
							 4	OrderDelivering	发货中，已经发货
							 5	OrderRecived	确认收货
							 6	OrderFinish	定单完成
							 */
						       case 3:st="st_printing".tr();break;
						       case 4:st="st_posting".tr();break;
						       default:st="st_posted".tr();break;

					       };
					       break;

					default:st="st_unpay".tr();st_css="wait";break;
				}
				ul.find("li[LocalID='"+LocalID+"']").find(".status").children().removeClass().addClass(st_css).html(st);
			}
			ul.show();
		}else{
			var ul = $("#maillist ul");
			ul.html("").show();;
			for(var i=postcards.length-1;i>=0;i--){
				var photo=postcards[i].photo;
				var to=[];
				var adr = new LeduiAddress;
				for(var j=0;j<postcards[i].AddressID.length;j++){
					var add = adr.get(postcards[i].AddressID[j]);
					to.push(add.Name);
				}

				var st="";
				var st_css="pass";
				//上传状态	1,未开始 2,上传中，还没有成功，3,成功，-1,失败，
				//支付状态	1,没有支付，2,已经支付
				switch(parseInt(postcards[i].Status)){
					case 1:st="st_unpay".tr();st_css="wait";break;
					case 2:st="st_uploading".tr();break;
					case 3:
					       switch(parseInt(postcards[i].OrderStatus)){
						       /*
							 -3	OrderFailed	支付失败
							 -2	OrderTimeout	订单超时
							 -1	OrderCancel	订单取消
							 1	OrderDefault	默认类型,新订单
							 2	OrderPaying	支付中
							 3	OrderPaid	已经支付
							 4	OrderDelivering	发货中，已经发货
							 5	OrderRecived	确认收货
							 6	OrderFinish	定单完成
							 */
						       case 3:st="st_printing".tr();break;
						       case 4:st="st_posting".tr();break;
						       default:st="st_posted".tr();break;

					       };
					       break;

					default:st="st_unpay".tr();st_css="wait";break;
				}
					       console.log(postcards[i].OrderStatus);
					       console.log(st);
				
				var style = Photoinfo.tostyle(photo);
				var html='<li active="yes" LocalID="'+postcards[i].LocalID+'">'+
					'<div class="cardinfo"><div class="cover">'+
					'<div class="photo">'+
						'<img src="'+postcards[i].ThumbnailData+'" />'+
						//'<img src="'+photo.o+'" />'+
					'</div>'+
					'<div class="selc"></div>'+
					'<div class="fake"></div>'+
					'<div class="status"><span class="'+st_css+'">'+st+'</span></div>'+
				'</div>'+
				'<div class="title">给 <span>'+(to.join(", "))+'</span></div>'+
				'<div class="time"><label>时间</label>: <span>'+postcards[i].date+'</span></div>'+
				'<div class="actions">'+
					'<div class="act" active="yes"><span class="ico ico_view" LocalID="'+postcards[i].LocalID+'"><em>查看</em></span></div>'+
					'<div class="act" active="yes"><span class="ico ico_delete" LocalID="'+postcards[i].LocalID+'"><em>删除</em></span></div>'+
				'</div></div></li>';
				var li = $(html);
				li.find(".ico_view").bind("tapone",function(e){
					//回到管理邮箱
					$("#titlebar_preview .button_s_back").attr("_back",9);
					var lid=$(this).attr("LocalID");
					var postcard = new LeduiPostCard();
					CurrentPostCard = postcard.get(lid);
					//正常新加，预览的返回为评论
					PageMgr.go(5);
				});
				li.find(".ico_delete").bind("tapone",function(e){
					//用全局变量，解决在confirm后，lid的值变会的问题
					window.__lid =$(this).attr("LocalID");
					window.__p = $(this).parents("li");
					confirm("delConfirm".tr(),{
						cancel:function(){
						},ok:function(){
						//删除明信片
						//取消订单，从服务端删除PostCardID(不实际删除，只用标记出来)
						//如果已经支付，但是还没有上传成功图片的订单，这里需要退款到用户账户
						//如果其它状态，直接标志就可以了，然后删除本地的记录，但是服务器还保留
						
							var postcard = new LeduiPostCard();
							postcard.del(window.__lid);
							//window.__p.slideUp("fast",function(){window.__p.remove();});
							window.__p.animate({height:0}, 300, '' ,function(){window.__p.remove(); 
								
								PageMgr.getpage(9).f5scroll(); 
							
							});
						}
						}
					);
				});			
				ul.append(li);
			}
			
		}
							
	}
}
//{{{
$(document).ready(function(){
	//DB.clear();
	Control.init();
	//判断现有明信片，状态，如果支付成功，但是上传没有成功的，重新上传
	var postcard = (new LeduiPostCard).list();
	//{{{ check change
	for(var i=0;i<postcard.length;i++){
		if(postcard[i].OrderStatus==3 && postcard[i].Status!=3){
			console.log("AUTO UPLOAD");
			console.log(postcard[i]);
			API.upload(postcard[i]);
		}
		//上传成功，更新最新的状态
		if(postcard[i].Status==3){
			API.getOrder(postcard[i].TradeNo);
		}
	};
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
