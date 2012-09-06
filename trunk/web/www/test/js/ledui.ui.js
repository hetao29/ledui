$(document).ready(function(){
	Adapta.init();
	Page.init(1);	
	Overlay.init();
	//Scroll.init();		
	Touch.init();
});

//UI系统
var UI = {
	istouch: ('createTouch' in document)	
} 
//页面显示控制
var Page = {
	pages: [], current: -1, current_prev: -1, total: 0, htmlattr: '_page', screen: $('.screen'), lock: false,
	init: function(n){
		var n = arguments[0] ? arguments[0] : 0;
		this.pages = this.seri();
		this.total = this.pages.length;
		if(!this.total){ return; }
		this.show(n);
	},
	show: function(n){
		var n = parseInt(n, 10);
		if(this.lock){ return; }
		if(n<0 || n>=this.total || n == this.current){ return; }
		var page_current = this.getpage(this.current), page = this.getpage(n);
		if(!page){ return; }
		var show_direction = n > this.current ? 'right' : 'left'
			,hide_direction = n > this.current ? 'left' :  'right'
			,_this = this;
		
		this.lock = true;
		this.screen.css('overflow', 'hidden');
		if(page_current){
			page_current.addClass('hidefrom'+ hide_direction);
			window.setTimeout(function(){					
				page_current.hide().removeClass('hidefrom' + hide_direction);
			}, 600);
		}
		page.addClass('showfrom'+ show_direction).show();
		window.setTimeout(function(){
			_this.lock = false;
			_this.screen.css('overflow', '');
			page.removeClass('showfrom' + show_direction); 
		}, 600);
		this.current_prev = this.current;
		this.current = n;
		Adapta.layout();
		return this;
	},
	next: function(){
		var next = this.current + 1;
		if(next > this.total - 1){ return; }
		this.show(next);
		return this;
	},
	prev: function(){
		var prev = this.current - 1;
		if(prev < 0){ return; }
		this.show(prev);
		return this;
	},
	back: function(){
		if(this.current_prev<=0 && this.current_prev == this.current){ return; }
		this.show(this.current_prev);
		return this;
	},
	//存储顺序与html顺序无关，并纠正错误标记，相同前者优先，未标 记为0
	seri: function(){
		var pages = [], ps = $('.page'), tmp = {}, _this = this;
		ps.each(function(){
			var p = $(this), n = p.attr(_this.htmlattr);
			if(!n){ n = 0; }
			n = parseInt(n, 10);
			if(tmp[n]){ tmp[n].push(p); } else{ tmp[n] = [p]; }
		});
		for(var key in tmp){
			var t = tmp[key];
			for(var i=0; i<t.length; i++){ pages.push(t[i]); }
		}
		return pages;
	},
	getpage: function(n){ return this.pages[n]; },
	getpages: function(){ return this.pages; },
	gettotal: function(){ return this.total; },
	getcurrent: function(){ return this.current; },
	getcurrentpage: function(){ return this.getpage(this.current); }
}

//屏幕适配器
var Adapta = {
	ratio: 1,
	init: function(){
		this.scale();
		this.bind();
	},
	bind: function(){
		var _this = this;
		$(window).resize(function(){ _this.run(); });	
	},
	run: function(){
		this.scale(); 
		this.layout();
	},
	scale: function(){
		var win_w = $(window).outerWidth(true)  
			,win_h = $(window).height()
			,scr_w = $('.screen').width()
		this.ratio = win_w/scr_w;
		var venderPrefix = ($.browser.webkit)  ? 'Webkit' : 
							($.browser.mozilla) ? 'Moz' :
							($.browser.ms)      ? 'Ms' :
							($.browser.opera)   ? 'O' : '';		
		$('.screen').css({
			'height': win_h/this.ratio,
			'zoom': this.ratio
		});
		$('.overlays').css({
			'height': win_h/this.ratio,
			'zoom': this.ratio
		});
	},
	layout: function(){		
		var  pg = Page.getcurrentpage()	
			,h_bd = 0
			,hd = pg.find('.panel_head')
			,bd = pg.find('.panel_body')
			,ft = pg.find('.panel_foot');
		//children static
		bd.children().each(function(){ h_bd += $(this).height(); })
		var H = $(window).height()/this.ratio
			,h1 = h_hd = hd.height()
			,h3 = ft.height()
			,h2_min = parseInt(bd.attr('_minheight'), 10) || h_bd
			,h2 = H - h1 - h3
			
		bd.css({'top': h1, 'height': h2});
		
		var is_enough = H >= h1 + h2_min + h3;
		
		var h_pg = is_enough ? H : (h1 + (h_bd<=h2_min ? h2_min : h_bd) + h3)
			,h_bd = is_enough ? h2 :(h_bd<=h2_min ? h2_min : h_bd);
			
		$('.screen').css('height', h_pg);
		pg.css('height', h_pg);
		bd.css('height', h_bd);
		ft.css('top', h_hd + h_bd);
	}
}

//遮罩层
var Overlay = {
	curname: '', layers: {}, mask: null, lock:false,
	init: function(){
		var overlays = $('.overlay')
			,overlay_mask = $('.overlay_mask')
			,_this = this;
		var clickevent  = UI.istouch ? 'tapone' : 'click';
		overlays.each(function(){
			var o = $(this)
				,name = o.attr('name')
				,handle = o.find('.close');
			if(name){ _this.layers[name] = o; }	
			o.bind(clickevent, function(){ return false; });
			handle.bind(clickevent, function(){ _this.hide(); return false;	});
		});
		overlay_mask.bind(clickevent, function(){ _this.hide(); return false; });
		if(overlay_mask.length){ this.mask = overlay_mask; }
	},
	show: function(name){
		if(name == this.curname){ return; }
		var o = this.layers[name];
		var _this = this;
		if(!o || this.lock){ return; }
		this.lock = true;
		if(this.curname){ this.hide(this.curname); }
		$('.overlays').show();
		o.addClass('showfromtop').show();
		this.curname = name; 
		this.mask.css('height', $('.screen').height()).stop().animate({opacity: 0.5}, 500).show();
		setTimeout(function(){ o.removeClass('showfromtop'); _this.lock = false; }, 500);			
	},
	hide: function(name){
		var o = this.layers[name ? name : this.curname]
			,_this = this;
		if(!o){ return; }			
		o.addClass('hidefromtop');
		this.curname = '';	
		this.mask.stop().animate({opacity: 0}, 500, '', function(){ _this.mask.hide(); });
		setTimeout(function(){ o.removeClass('hidefromtop').hide(); if(!_this.curname){ $('.overlays').hide(); } }, 500);
	}	
}

//触摸事件
var Touch = {
	init: function(){ this.bind(); },
	bind: function(){
		$('[active]')
		.bind('touchstart', function(e) { $(this).addClass('active'); e.preventDefault(); })
		.bind('touchend', function(e) { $(this).removeClass('active'); e.preventDefault(); });		
		$('[focus]')
		.bind('focus', function(e) { $(this).addClass('focus'); })
		.bind('blur', function(e) { $(this).removeClass('focus'); });
	}
}

//滚动条
var Scroll = {
	init: function(){
		var scrolls = $('[scroll]');
		scrolls.each(function(){ var s = new iScroll($(this).get(0)); });	
	}	
}

//照片编辑器
var PhotoEditor = {
	isfirstrun: true,
	target_width: 1920,
	target_height: 1200,
	ratio_target: 1.6,
	ratio_img: 1, //源图片的宽高比例
	init: function(img){
		if(!img){ return; }
		this.info = { img: img, width: 0, height: 0, zoom: 1, rotate: 0, x: 0, y: 0 };
		this.box = $('#photo');
		this.box.html('');
		this.panel = $('#photoselection');
		this.isfirstrun = false; 
		//img loaded bind event
		var _this = this;
		this.img = $('<img src='+ img +' />')
		.appendTo(this.box)
		.bind('load', function(){
			size = _this.getimgsize();
			_this.setinfo('img', img);
			_this.setinfo('width', size.width);
			_this.setinfo('height', size.height);
			_this.ratio_img = size.width/size.height;
			if(_this.isfirstrun){ _this.bind(); }
		});		
	},
	bind: function(){
		var _this = this;
		//旋转
		//顺时针
		var clickevent  = UI.istouch ? 'tapone' : 'click';
		$('#ico_rotate_cw').bind(clickevent, function(){
			_this.rotate('cw', 90);										   
		});
		//逆时针
		$('#ico_rotate_acw').bind(clickevent, function(){
			_this.rotate('acw', 90);										   
		});
		//缩放
		$('#ico_zoom_in').bind(clickevent, function(){	
			_this.zoom();
		});
		$('#ico_zoom_out').bind(clickevent, function(){	
			_this.zoom();
		});
		
		this.panel.bind('swipetwo', function(e, info){
			alert(info);								 
			return false;
		})
		
		/*
		$("#ico_rotate_acw").bind("touchend",function(e){
			PostCardInfo.deg = PostCardInfo.deg - 90;
			$("#photoContent").css("-webkit-transform","rotate("+PostCardInfo.deg+"deg)");									   
			});
		$("#ico_rotate_cw").bind("touchend",function(e){
			PostCardInfo.deg = PostCardInfo.deg + 90;
			$("#photoContent").css("-webkit-transform","rotate("+PostCardInfo.deg+"deg)");								  
		});
		$("#ico_zoom_in").bind("touchend",function(e){			
			PostCardInfo.scale = PostCardInfo.scale /1.5;
			if(PostCardInfo.scale<1)PostCardInfo.scale=1;
			$("#photoContent").css("-webkit-transform","scale("+PostCardInfo.scale+")");						  
		});
		$("#ico_zoom_out").bind("touchend",function(e){
			PostCardInfo.scale = PostCardInfo.scale *1.5;
			$("#photoContent").css("-webkit-transform","scale("+PostCardInfo.scale+")");							  
		});
		$("#photo").swipe( {
		 swipeStatus:function(event, phase, direction, distance, duration, fingers,p,events) {
			
			 if(phase =="start"){
				PostCardInfo.top = parseInt($(this).css("top"));
				PostCardInfo.left = parseInt($(this).css("left"));
				 
			 }
			if( phase!="move"){
				
				return;
			}
			if(fingers==2){
				//放大，缩小
				var changeX = events.start[0].pageX - events.start[0].pageX;
				var changeY = events[1].pageX - events[0].pageX;
				 console.log(event);
				 
			}else if(fingers<=1){
				//移动
				//Here we can check the:
				//phase : 'start', 'move', 'end', 'cancel'
				//direction : 'left', 'right', 'up', 'down'
				//distance : Distance finger is from initial touch point in px
				//duration : Length of swipe in MS 
				//fingerCount : the number of fingers used
				
				var top = PostCardInfo.top + (p.endY - p.startY);
				$(this).css("top",top+"px");
				var left = PostCardInfo.left + (p.endX - p.startX);
				$(this).css("left",left+"px");
			}
			var str = "<h4>Swipe Phase : " + phase + "<br/>";
			str += "Direction from inital touch: " + direction + "<br/>";
			str += "Distance from inital touch: " + distance + "<br/>";
			str += "Duration of swipe: " + duration + "<br/>";
			str += "Fingers used: " + fingers + "<br/></h4>";
							
			if (phase!="cancel" && phase!="end")
			{
				if (duration<5000)
					str +="Under maxTimeThreshold.<h3>Swipe handler will be triggered if you release at this point.</h3>"
				else
					str +="Over maxTimeThreshold. <h3>Swipe handler will be canceled if you release at this point.</h3>"
			
				if (distance<200)
					str +="Not yet reached threshold.  <h3>Swipe will be canceled if you release at this point.</h3>"
				else
					str +="Threshold reached <h3>Swipe handler will be triggered if you release at this point.</h3>"
			}
			
			if (phase=="cancel")
				str +="<br/>Handler not triggered. <br/> One or both of the thresholds was not met "
			if (phase=="end")
				str +="<br/>Handler was triggered."
			console.log(str);
		  },
			threshold:100,
			maxTimeThreshold:5000,
			fingers:'all'
		});
		
		//手指事件
		$( "#photoCanvas" ).bind("mousedown",function(e){
         
        });
		$( "#photoCanvas" ).bind("mouseup",function(e){
           
        });
		*/		
	},
	getimgsize: function(){
		var width = 0;
		var height = 0;
		return {
			'width': this.img.width(), 
			'height': this.img.height()	
		}	
	},
	checkoverflow: function(){
		
	},
	adapta: function(){
		
	},
	rotate: function(direction, deg){
		
	},
	zoom: function(zoom){
		
	},
	move: function(direction, px){
		
	},
	setinfo: function(key, value){
		if(key in this.info){
			this.info[key] = value;	
		}
		return this.info;
	},
	getInfo: function(){
		return this.info;
	}
}