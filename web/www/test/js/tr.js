var LOCALE = {
	//中文
	zh:{
		add:"添加",
		addAddress:"输入新地址",
		editAddress:"修改地址",
    		edit:"编辑",
		need2login:"需要登录后才能继续...",
		delConfirm:"确认删除"
	},
	zh_tw:{
		create:"创建一张明信片(zh_tw)"
	},
	//英文
	en:{
		 create:"Create postcard"
		,about:"About"
		,postcard:"Postcard"
		,login:"Login"
		,signup:"Sign up"
		,back:"Back"
		,next:'Next Step'
		,title: "Ledui Postcard"
		,id: "example"
		,success_message: "The external file has been included in the page"
		,failure_message: "There was a problem including the file"
		,email: 'Email'
		,password: 'Password'
		
		,title_editphoto: 'Edit photo'//编辑图片
		,title_addresseeinfo: 'Addressee info'//收件人信息
		,title_newaddress: 'New address'//添加新地址
		,title_inputmessage: 'Input message'//输入留言信息
		,title_preview: 'Preview'//预览
		
	},
	//日语
	ja:{
	},
	jp:{
	},
	//韩语
	ko:{
	},
	kr:{
	},
	//法语
	fr:{
		
	},
	//西班牙
	es:{
	},
	//泰国
	th:{
	},
	//意大利
	it:{
	}
}

var Lang = Lang_app =  (function(){
	var lang = window.navigator.userLanguage || window.navigator.language;
	lang = lang.toLowerCase().replace("-","_");	
	return lang;
})();

function tr(k){
	if(LOCALE[Lang_app]){
		return LOCALE[Lang_app][k];
	}else{
		if(Lang.indexOf('_') > 0){
			Lang_app = Lang.split('_')[0]
			return LOCALE[Lang_app][k];
		}
	}
	return undefined;
}
String.prototype.tr=function(){
	return tr(this);
};
(function($) {       
	$.fn.tr= function() {     
		var t = tr($(this).text());
		$(this).text(t);
	};     
})(jQuery);


$(document).ready(function(){
	if(Lang == 'zh_cn'){ return; }					   
	$("[tr]").each(function(){
		var e = $(this)					
			,k = e.attr("tr")
			,v = tr(k);
		if(v){ e.html(v); }
	});
	$("[tr_placeholder]").each(function(){		
		var e = $(this)
			,k = $(e).attr("tr_placeholder")
			,v = tr(k)
			console.log($(this));
			console.log($(this));
		if(v){ e.attr("placeholder", v); }
	});
	
});
