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
	zoom_ui: (1920/560)/($(window).outerWidth(true)/($('.screen').width())),  
	zoom_limit: {'max': 3, 'min': 0.3 },
	w_target: 1920,
	h_target: 1200,
	ratio_target: 1.6,
	ratio_img: 1, //源图片的宽高比例
	init: function(img){
		if(!img){ return; }
		this.info = { o: img, w: 0, h: 0, x: 0, y: 0, r: 0};
		this.box = $('#photo');
		this.box.html('');
		this.panel = $('#photoselection');
		this.paneltest = $('<div style="z-index:4;position:absolute;top:0;left:0;width:100px;height:100px;background:#000;color:#f00;"></div>')
		.appendTo(this.box.parent());
		
		//img loaded bind event
		var _this = this;
		this.img = $('<img src='+ img +' />')
		.appendTo(this.box)
		.bind('load', function(){
			size = _this.getimgsize();
			_this.setinfo({ 'o': img, 'w': size.width, 'h': size.height });
			$(this).css({ 'width': size.width, 'height': size.height });
			_this.ratio_img = size.width/size.height;
			_this.center();
			if(_this.isfirstrun){ _this.bind(); _this.isfirstrun = false; }
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
		//放大
		$('#ico_zoom_in').bind(clickevent, function(){	 _this.zoom(1.1).saveinfo(); });	
		//缩小
		$('#ico_zoom_out').bind(clickevent, function(){ _this.zoom(0.9).saveinfo(); });
		
		var action = '';
		var gestures = false; //多指协同
		
		this.panel
		.bind('gesturestart', function(e){ gestures = true; })
		.bind('gestureend', function(e){ gestures = false; })
		.bind('touchstart', function(e){ e.preventDefault();})
		.bind('touchmove', function(e){ e.preventDefault(); })
		.bind('touchend', function(e){
			_this.saveinfo();
			action = '';
			e.preventDefault();
		})			
		.bind('swipemove', function(e, info){
			if(gestures){ return; }
			var offset = { x: info.delta[0].lastX, y: info.delta[0].lastY }
			_this.move(offset);
		})
		.bind('pinch', function(e, info){						  
			var scale = info.scale;
			if(typeof(scale) == 'number'){ _this.zoom(scale); }
		});
		
		this.panel.bind('rotatecw', function(e, info){
			
		});
		this.panel.bind('rotateccw', function(e, info){
			
		});
		this.panel.bind('shake', function(e, info){
			
		});	
	},
	console: function(msg){
		this.paneltest.html(msg);
	},
	getimgsize: function(){
		var width = 0, height = 0;
		return { 'width': this.img.width(), 'height': this.img.height() }	
	},
	checkoverflow: function(){
		
	},
	move: function(offset){
		var x = this.info.x + offset.x*this.zoom_ui;
		var y = this.info.y + offset.y*this.zoom_ui;
		this.img.css({'left': x, 'top': y });
		this.info.x = x;
		this.info.y = y;
		return this;
	},
	center: function(){
		var x = (this.w_target - this.info.w)/2;
		var y = (this.h_target - this.info.h)/2;
		this.img.css({'left':x, 'top': y });
		this.info.x = x;
		this.info.y = y;
		return this;
	},
	rotate: function(direction, deg){
		
	},
	zoom: function(scale){
		var scale = scale;
		var w = this.info.w * scale;
		if(w > this.w_target*this.zoom_limit.max ){ w = this.w_target*this.zoom_limit.max; }
		if(w < this.w_target*this.zoom_limit.min){ w = this.w_target*this.zoom_limit.min; }		
		var h = w / this.ratio_img;
		var x = this.info.x - (w - this.info.w)/2
		var y = this.info.y - (h - this.info.h)/2;
		this.img.css({ 'width': w, 'height': h, 'left': x, 'top': y });
		return this;
	},
	setinfo: function(info){
		for(var key in info){
			if(key in this.info){ 
				this.info[key] = info[key];	
			}
		}
		return this;
	},
	saveinfo: function(){
		this.setinfo({
			'w': parseFloat(this.img.css('width')),
			'h': parseFloat(this.img.css('height')),
			'x': parseFloat(this.img.css('left')),
			'y': parseFloat(this.img.css('top')),
		});
		return this;
	},
	getInfo: function(){
		return this.info;
	}
}