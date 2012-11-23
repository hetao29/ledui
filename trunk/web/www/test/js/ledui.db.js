//记录本地状态信息
//static object
var _DB={
	Version:"_V2",
	uuid:"",
	set:function(k,v){
		this.del(k);
		return window.localStorage.setItem(k+":"+this.uuid+":"+this.Version,JSON.stringify(v));
    	},
	del:function(k){
		return window.localStorage.removeItem(k+":"+this.uuid+":"+this.Version);
	},
	get:function(k){
		return JSON.parse(window.localStorage.getItem(k+":"+this.uuid+":"+this.Version));
	}
}

//static object
var DB={
	postcards:"postcards",
	token:"token",
	uid:"uid",
	email:"email",
	pwd:"pwd",
	
	setToken : function(uid,token){
		_DB.set(this.uid,uid);
		_DB.set(this.token,token);
    },
	getToken : function(){
		return _DB.get(this.token);
	},
	getUID : function(){
		return _DB.get(this.uid);
	},
	getUUID:function(){
		return _DB.uuid;
	},
	setUUID:function(uuid){
		_DB.uuid=uuid;
	},
	clear : function(){
		for(var i in window.localStorage){
			if(i.indexOf(_DB.Version)==-1)window.localStorage.removeItem(i);;
		}
	},
	clearAll : function(){
		for(var i in window.localStorage){window.localStorage.removeItem(i);}
	}
}
//明信片对像
var LeduiPostCard=function(){
	//{{明信片信息，和服务器保存的结果对应
	this.PostCardID="";//当调用增加明信片后，更新此参数，如果有这参数，说明服务端已经生成了
	this.PayURL="";
	this.UserID="";//UserID必须不能为空，这个值由服务器在创建后返回
	this.TradeNo="";
	this.ImageFileID="";
	//状态 1：未开始，2，上传中，还没有成功，3：成功，-1：失败
	this.Status=1;
	/**
	  -3	OrderFailed	支付失败
	  -2	OrderTimeout	订单超时
	  -1	OrderCancel	订单取消
	  1	OrderDefault	默认类型,新订单
	  2	OrderPaying	支付中
	  3	OrderPaid	已经支付
	  4	OrderDelivering 发货中，已经发货
	  5	OrderRecived	确认收货
	  6	OrderFinish	定单完成
	  */
	this.OrderStatus=1;//1.未支付 2.已经支付
	//}}
	this.LocalID=(new Date()).getTime() +":"+Math.floor(Math.random()*10000);
	this.FileTmpID="";
	this.Latitude="";
	this.Longitude="";
	this.Address=[];//发送地址,[LeduiAddress]
	this.AddressID=[];//发送地址,[LeduiAddress.LocalID]
	this.Comments="";
	this.Sender="";
	this.photo={}; //width:"", //height:"", //x:"", //y:"", //rotate:"",
	this.date=(new Date()).getFullYear()+"-"+(new Date()).getMonth()+"-"+(new Date()).getDate();
	this.ThumbnailData="";//截图内容，base64后的内容
	
	this._key="PostCard";	
}
LeduiPostCard.prototype = {
	add: function(LeduiPostCardObject){
		var postcards = _DB.get(this._key) || [];
		var isnew=true;
		for(var i=0;i<postcards.length;i++){
			if(postcards[i].LocalID == LeduiPostCardObject.LocalID){
				//VERY GOOD MODE(MERGE,NOT REPLACE)
				for(var j in LeduiPostCardObject){
					postcards[i][j]=LeduiPostCardObject[j];
				}
				postcards.splice(i,1,postcards[i]);
				isnew = false;
			}
		}
		if(isnew)postcards.push(LeduiPostCardObject);
		_DB.set(this._key,postcards);
	},
	get: function(LocalID){
		var postcards = _DB.get(this._key) || [];
		console.log(postcards);
		for(var i=0;i<postcards.length;i++){
			if(postcards[i].LocalID == LocalID){
				if(postcards[i].AddressID.length>0){
					postcards[i].Address=[];
					var adr = new LeduiAddress;
					for(var j=0;j<postcards[i].AddressID.length;j++){
						postcards[i].Address.push(adr.get(postcards[i].AddressID[j]));
					}
				}
				return postcards[i];
			}
		}
	},
	//删除本地状态，当取消，或者成功时
	del: function(LocalID){
		var postcards = _DB.get(this._key) || [];
		for(var i in postcards){
			if(postcards[i].LocalID==LocalID){
				postcards.splice(i,1);
			}
		}
		_DB.set(this._key,postcards);
	},
	list: function(){
		return _DB.get(this._key) ||[];
	}
}
//待上传的文件类，这样能实现同一图片，做多张明信片时的秒传
var LeduiFile=function(){
	//文件没有上传前，生成的临时ID，根据文件Path与文件Size
	this.FileTmpID = (new Date()).getTime() +":"+Math.floor(Math.random()*10000);
	this.ImageFileID = "";//服务端生成ImageFileID
	//文件路径
	this.FilePath = "";
	//文件大小
	this.FileSize = "";
	//文件已经上传大
	this.DataSended = 0;
	//文件上传总大小
	this.DataTotal = 0;
	this._key = "File";
	//状态 1：未开始，2，上传中，还没有成功，3：成功，-1：失败
	this.Status = 1;
}
LeduiFile.prototype = {
	add: function(LeduiFileObject){
		var files = _DB.get(this._key) || [];
		var isnew=true;
		var r=LeduiFileObject;
		for(var i=0;i<files.length;i++){
			if(files[i].FilePath == LeduiFileObject.FilePath){
				files.splice(i,1,LeduiFileObject);
				r = files[i]
				isnew = false;
			}
		}
		if(isnew)files.push(LeduiFileObject);
		_DB.set(this._key,files);
		return r;
	},
	get: function(imageURI){
		var files = _DB.get(this._key) || [];
		for(var i=0;i<files.length;i++){
			if(files[i].FilePath == imageURI){
				return files[i];
			}
		}
	},
	del: function(imageURI){
		var files = _DB.get(this._key) || [];
		for(var i=0;i<files.length;i++){
			if(files[i].FilePath == imageURI){
				files.splice(i,1);
			}
		}
		_DB.set(this._key,files);
	}
}
var LeduiAddress=function(){
	this.AddressID = "";//服务器地址ID，如果>0，表明是服务器的地址
	this.LocalID = (new Date()).getTime() +":"+Math.floor(Math.random()*10000);//本地生成的临时地址ID
	this.Name = "";
	this.Mobile = "";
	this.UserID= "";//UserID为空的，表示，本机账号共用,不为空的，表示登录用户才有
	this.Country = "";
	this.Privince = "";
	this.City = "";
	this.Address = "";
	this.PostCode = "";
	this.Mobile = "";
	this.Phone = "";
	this._key = "Address";
}
LeduiAddress.prototype = {
	clear: function(){
		_DB.del(this._key);
	},
	get: function(LocalID){
		var all = _DB.get(this._key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== LocalID){
				return all[i];
			}
		}
	},
	add: function(LeduiAddressObject){
		var all = _DB.get(this._key) || [];
		var isnew=true;
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== LeduiAddressObject.LocalID){
				all.splice(i,1,LeduiAddressObject);
				isnew =false;
			}
		}
		if(isnew)all.unshift(LeduiAddressObject);
		_DB.set(this._key,all);
	},
	edit: function(LeduiAddressObject){
		var all = _DB.get(this._key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== LeduiAddressObject.LocalID){
				all.splice(i,1,LeduiAddressObject);
			}
		}
		_DB.set(this._key,all);
	},
	del: function(LocalID){
		var all = _DB.get(this._key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== LocalID){
				all.splice(i,1);
			}
		}
		_DB.set(this._key,all);
	},
	list: function(uid){
		var all = _DB.get(this._key) || [];
		var r=[];
		for(var i=0;i<all.length;i++){
			if(!all[i].UserID || all[i].UserID=="" || all[i].UserID==uid){
				r.push(all[i]);
			}
		}
		return r;
	},
	upload: function(){
	}
}
