
var LOCALE = {
	zh:{
	//	create:"创建一张明信片"
	},
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
}


$(document).ready(function(){
	var language = window.navigator.userLanguage || window.navigator.language;language = language.split("-")[0];
	$("[tr]").each(function(i,e){
		var k = $(e).attr("tr");
		var v = (eval("LOCALE."+language+"."+k));
		if(v){
			$(e).html(v);
		}
	});
});
