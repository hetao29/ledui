var LOCALE = {
	//中文
	zh:{
		aboutme_content:"乐兑明信片是一款可以在任何时候任何地点制作并投递明信片的手机应用。我们不是给亲人朋友发去E-Card，而是真正的投递纸质明信片，不论您在什么地方，再也不必为买明信片找邮箱这种事情发愁了，您只需要打开您的相册，或者拍下当时的美景，然后选上您中意的邮戳邮票，填写上您想寄去的地址，后面的事情请交给我们。如果您的照片带有GPS信息，我们还会在明信片上印上您在世界地图的哪个位置，让收件人更切身的体验到您来自远方的祝福！把亲人的牵挂寄回家，把自己的游历寄朋友，邀请您的朋友一起来玩转乐兑明信片吧！",
		add:"添加",
		addAddress:"输入新地址",
		editAddress:"修改地址",
    	edit:"编辑",
		ok:"确定",
		
		cancel:"取消",
		need2login:"需要登录后才能继续...",
		delConfirm:"确认删除",
		//明信片状态
		st_unpay:"未支付",
		st_uploading:"上传中",
		st_uploaderror:"上传失败",
		st_printing:"等到打印",
		st_posting:"等到邮寄",
		st_posted:"已经寄出",
		CN:"中国(含港澳台)",
		OTHER:"国外"
		,time:"时间"
		,to:"给"
		,choose:"选择"
		,payedConfirm:"您已经支付完成了？"
		,error_network:"网络错误，请重试"
	},
	zh_tw:{
		aboutme_content:"樂兌明信片是一款可以在任何時候任何地點製作並投遞明信片的手機應用。我們不是給親人朋友發去E-Card，而是真正的投遞紙質明信片，不論您在什麼地方，再也不必為買明信片找郵箱這種事情發愁了，您只需要打開您的相冊，或者拍下當時的美景，然後選上您中意的郵戳郵票，填寫上您想寄去的地址，後面的事情請交給我們。如果您的照片帶有GPS信息，我們還會在明信片上印上您在世界地圖的哪個位置，讓收件人更切身的體驗到您來自遠方的祝福！把親人的牽掛寄回家，把自己的遊歷寄朋友，邀請您的朋友一起來玩轉樂兌明信片吧！",
		add:"添加",
		addAddress:"輸入新地址",
		editAddress:"修改地址",
		edit:"編輯",
		ok:"確定",
		cancel:"取消",
		need2login:"需要登錄後才能繼續...",
		delConfirm:"確認刪除",
		//明信片狀態
		st_unpay:"未支付",
		st_uploading:"上傳中",
		st_uploaderror:"上傳失敗",
		st_printing:"等到打印",
		st_posting:"等到郵寄",
		st_posted:"已經寄出",
		CN:"中國(含港澳台)",
		OTHER:"國外"
		,choose:"選擇"
		,payedConfirm:"您已經支付完成了？"
	},
	//英文
	en:{
		aboutme_content:"With Ledui, our phone application, you can make and deliver postcards at any location and any time. Ledui is not sending the E-cards, but delivering the real paper cards to your families and friends. Wherever you are, you no longer have to worry about buying the cards and finding the post office. You only need to open your album or shoot the beautiful scenery, choose your favorite stamp, and fill in the address you want to deliver, all the rest will be taken care by us. If your photo contains GPS information, we will also map your location on the cards, which will enrich the recipient the visual feeling of your greetings from distance. Send your care and yearning to your families and share your travel experience with your friends. What are you waiting for? Just Invites your friends to enjoy Ledui together!",
		 create:"Create postcard"
		,about:"About"
		,index:"Home"
		,logout:"Logout"
		,postcard:"Postcard"
		,login:"Login"
		,rechoose:"Re-election"
		,signup:"Sign up"
		,back:"Back"
		,addAddress:"Add Address"
		,noAddress:"No Address,PLS Add..."
		,del:"Delete"
		,choosefromCat:"Choose from contacts"
		,next:'Next Step'
		,title: "Ledui Postcard"
		,id: "example"
		,success_message: "The external file has been included in the page"
		,failure_message: "There was a problem including the file"
		,email: 'Email'
		,password: 'Password'
		,password2: 'Repeat Password'
		
		,title_editphoto: 'Edit photo'//编辑图片
		,title_addresseeinfo: 'Addressee info'//收件人信息
		,title_newaddress: 'New address'//添加新地址
		,title_inputmessage: 'Input message'//输入留言信息
		,title_preview: 'Preview'//预览
		,CN:"China"
		,OTHER:"Other Country"
		,recvName:"Recipient's name"
		,recvMobile:"The recipient's mobile phone number"
		,recvAddr:"Address"
		,recvZipCode:"Zip code"
		,add:"Add"
		,comments:"Please enter a message, limited to 200 words."
		,front:"front"
		,back:"back"
		,send:"Send"
		,payTitle:"To pay the postage"
		,pay:"Pay"
		,alipay:"AliPay"
		,payFinish:"Payment completion"
		,about:"About Me"
		,choosePic:"Choose a photo"
		,album:"Album"
		,camera:"Camera"
		,attention:"attention"
		,cancel:"cancel"
		,ok:"ok"
		,error:"error"
		,register:"register"
		,choose:"choose"
		,accept:"accept"
		,provision:"provision"
		,error_network:"network error!"

		
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

function tr(k,returnk){
	k = k.toString();
	var r="";
	if(LOCALE[Lang_app]){
		if(LOCALE[Lang_app][k]) r = LOCALE[Lang_app][k];
	}else{
		if(Lang.indexOf('_') > 0){
			Lang_app = Lang.split('_')[0]
			if(LOCALE[Lang_app][k]) r = LOCALE[Lang_app][k];
		}
	}
	if(r)return r;else if(returnk)return k;
}
String.prototype.tr=function(){
	return tr(this,true);
};
(function($) {       
	$.fn.tr= function() {     
		var t = tr($(this).text());
		if(t) $(this).text(t);
	};     
})(jQuery);


$(document).ready(function(){
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
		if(v){ e.attr("placeholder", v); }
	});
	
});
