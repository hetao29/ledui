//记录本地状态信息
var _DB={
	Version:"_V1",
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
	this.OrderID="";
	this.ImageFileID="";
	//状态 1：未开始，2，上传中，还没有成功，3：成功，-1：失败，-2：未支付
	this.Status=1;
	//}}
	this.LocalID=(new Date()).getTime() +":"+Math.floor(Math.random()*10000);
	this.FileTmpID="";
	this.Latitude="";
	this.Longitude="";
	this.Address=[];//发送地址
	this.Comments="";
	this.photo={}; //width:"", //height:"", //x:"", //y:"", //rotate:"",
	this.date=(new Date()).getFullYear()+"-"+(new Date()).getMonth()+"-"+(new Date()).getDate();
	
	this._key="PostCard";
	
	this.add = function(LeduiPostCardObject){
		var postcards = _DB.get(this._key) || [];
		var isnew=true;
		for(var i=0;i<postcards.length;i++){
			if(postcards[i].LocalID == LeduiPostCardObject.LocalID){
				postcards.splice(i,1,LeduiPostCardObject);
				isnew = false;
			}
		}
		if(isnew)postcards.push(LeduiPostCardObject);
		_DB.set(this._key,postcards);
	};
	this.get = function(LocalID){
		var postcards = _DB.get(this._key) || [];
		for(var i=0;i<postcards.length;i++){
			if(postcards[i].LocalID == LocalID){
				return postcards[i];
			}
		}
	};
	//删除本地状态，当取消，或者成功时
	this.del = function(LocalID){
		var postcards = _DB.get(this._key) || [];
		for(var i in postcards){
			if(postcards[i].LocalID==LocalID){
				postcards.splice(i,1);
			}
		}
		_DB.set(this._key,postcards);
	};
	this.list = function(){
		return _DB.get(this._key) ||[];
	};
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
	
	this.add=function(LeduiFileObject){
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
	};
	this.get=function(imageURI){
		var files = _DB.get(this._key) || [];
		for(var i=0;i<files.length;i++){
			if(files[i].FilePath == imageURI){
				return files[i];
			}
		}
	};
	this.del=function(imageURI){
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
	this.Country = "";
	this.Privince = "";
	this.City = "";
	this.Address = "";
	this.PostCode = "";
	this.Mobile = "";
	this.Phone = "";
	this._key = "Address";
	
	this.clear=function(){
		_DB.del(this._key);
	};
	this.get=function(LocalID){
		var all = _DB.get(this._key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== LocalID){
				return all[i];
			}
		}
	}
	this.add=function(LeduiAddressObject){
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
	}
	this.edit=function(LeduiAddressObject){
		var all = _DB.get(this._key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== LeduiAddressObject.LocalID){
				all.splice(i,1,LeduiAddressObject);
			}
		}
		_DB.set(this._key,all);
	}
	this.del=function(LocalID){
		var all = _DB.get(this._key) || [];
		for(var i=0;i<all.length;i++){
			if(all[i].LocalID== LocalID){
				all.splice(i,1);
			}
		}
		_DB.set(this._key,all);
	}
	this.list=function(){
		var all = _DB.get(this._key) || [];
		return all;
	}
	this.upload=function(){
	}
}
