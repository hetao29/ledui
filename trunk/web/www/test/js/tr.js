
var LOCALE = {
	//中文
	zh:{
	//	create:"创建一张明信片"
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
	  failure_message: "There was a problem including the file"   ,     
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


$(document).ready(function(){
	var language = window.navigator.userLanguage || window.navigator.language;
	language = language.toLowerCase().replace("-","_");
	
	if((eval("LOCALE."+language))){
	}else{
		language = language.split("-")[0];
		if(!(eval("LOCALE."+language)))return;
	}
	
	$("[tr]").each(function(i,e){
		var k = $(e).attr("tr");
		var v = (eval("LOCALE."+language+"."+k));
		if(v){
			$(e).html(v);
		}
	});
});
