
var LOCALE = {
	//中文
	zh:{
		add:"添加",
    		edit:"编辑",
		need2login:"需要登录后才能继续...",
	},
	zh_tw:{
		create:"创建一张明信片(zh_tw)"
	},
	//英文
	en:{
		create:"create postcard",
		about:"About",
		postcard:"postcard",
		login:"login",
		signup:"sign up",
		back:"back",
	  title: "ledui postcard",
	  id: "example",
	  success_message: "The external file has been included in the page",
	  failure_message: "There was a problem including the file"   
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
function tr(k){
	var language = window.navigator.userLanguage || window.navigator.language;
	language = language.toLowerCase().replace("-","_");
	
	if(LOCALE[language]){
	}else{
		language = language.split("_")[0];
		if(!LOCALE[language])return k;
	}
	
	return LOCALE[language][k];
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
	$("[tr]").each(function(i,e){
		var k = $(e).attr("tr");
		var v = tr(k);
		if(v){
			$(e).html(v);
		}
	});
});
