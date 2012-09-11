$(document).ready(function(){
	Adapta.init();
	Page.init(0);	
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
	//pages_order:[0],
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
		if(page_current){
			this.lock = true;
			this.screen.css('overflow', 'hidden');
			page_current.addClass('hidefrom'+ hide_direction);
			window.setTimeout(function(){					
				page_current.hide().removeClass('hidefrom' + hide_direction);
			}, 600);
			page.addClass('showfrom'+ show_direction).show();
			window.setTimeout(function(){
				_this.lock = false;
				_this.screen.css('overflow', '');
				page.removeClass('showfrom' + show_direction); 
			}, 600);
		}else{			
			page.show();	
		}		
		this.current_prev = this.current;
		this.current = n;
		/*
					if(this.current==0)this.pages_order=[0];
			else if(this.current != this.pages_order[this.pages_order.length-1])this.pages_order.push(this.current);
*/

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
	zoom_ui: 1,  
	zoom_limit: {'max': 3, 'min': 0.3 },
	w_target: 1920,
	h_target: 1200,
	ratio_target: 1.6,
	ratio_img: 1, //源图片的宽高比例
	isready: false,
	init: function(img){
		if(!img){ return; }
		this.zoom_ui = this._getzoom();
		this.isready = false;
		this.info = { o: img, w: 0, h: 0, x: 0, y: 0, r: 0};
		this.box = $('#photo');
		this.panel = $('#photopanel');
		this.loading = $('#photoloading');
		this.box.html('');
		this.loading.show();
		//img loaded bind event
		var _this = this;
		this.img = $('<img deg="0" src='+ img +' />')
		.appendTo(this.box)
		.bind('load', function(){
			var size = _this.getimgsize();
			_this.setinfo({ 'o': img, 'w': size.width, 'h': size.height });
			$(this).css({ 'width': size.width, 'height': size.height });
			_this.ratio_img = size.width/size.height;
			_this.center();
			_this.loading.hide();
			if(_this.isfirstrun){ _this.bind(); _this.isfirstrun = false; }
			_this.isready = true;
		})
		.bind('error', function(){
			this.loading.hide();				
		});		
	},
	bind: function(){
		var _this = this;
		var clickevent  = UI.istouch ? 'tapone' : 'click';
		var gestures = false; //多指协同
		var action = '';
		var scale = 0;
		var rotation = 0;
		var MIN_D = 1;
		var MIN_B = 0.01;//缩放&&旋转精度控制
		
		//顺时针
		$('#ico_rotate_cw').bind(clickevent, function(){ _this.rotate(90, true).saveinfo(); });
		//逆时针
		$('#ico_rotate_acw').bind(clickevent, function(){ _this.rotate(-90, true).saveinfo(); });
		//放大
		$('#ico_zoom_in').bind(clickevent, function(){	 _this.zoom(1.2).saveinfo(); });	
		//缩小
		$('#ico_zoom_out').bind(clickevent, function(){ _this.zoom(0.8).saveinfo(); });
		this.panel.hammer({
            prevent_default: true,
			rotation_treshold: 0,
            scale_treshold: 0,
            drag_min_distance: 0
        })
		.bind('touchstart', function(e){ e.preventDefault();  })
		.bind('touchend', function(e){ e.preventDefault(); gestures = false; action = ''; _this.saveinfo(); })			
		.bind('touchmove', function(e){ e.preventDefault(); })	
		.bind('doubletap', function(){ _this.reset(); })
		.bind('transformstart', function(e){ gestures = true; })
		.bind('transformend', function(e){ gestures = false; scale=0; rotation=0; })
		.bind('transform', function(e){
			if(!gestures){ return; } action = 'transform';						
			if(e.scale && typeof(e.scale) == 'number'){ 
				if(Math.abs(e.scale - scale)>=MIN_B){
					if(!scale){ scale =  Math.round(e.scale*100)/100; }
					else{
						var offset = Math.round((e.scale - scale)/MIN_B) * MIN_B;
						scale += offset;
						scale = Math.round(scale*100)/100;
					}
					_this.zoom(scale);
				}
			}
			if(e.rotation && typeof(e.rotation) == 'number'){ 
				if(Math.abs(e.rotation - rotation)>=MIN_B){
					if(!rotation){ rotation = Math.round(e.rotation*100)/100; }
					else{
						var offset = Math.round((e.rotation - rotation)/MIN_B) * MIN_B;
						rotation += offset; 
						rotation = Math.round(rotation*100)/100;
					}
					_this.rotate(rotation); 
				}
			}
		})
		.bind('swipemove', function(e, info){ e.preventDefault(); 
			if(gestures){ return; } action = 'move';
			var dx = Math.round(info.delta[0].lastX);
			var dy = Math.round(info.delta[0].lastY);
			_this.move({ x: dx, y: dy });
		});	
		/*
		//移动
		.bind('swipemove', function(e, info){			
			if(gestures){ return; } action = 'move';
			_this.move({ x: info.delta[0].lastX, y: info.delta[0].lastY });
		})
		//缩放
		.bind('pinch', function(e, info){
			if(!gestures){ return; } action = 'pinch';					
			if(typeof(info.scale) == 'number'){ _this.zoom(info.scale); }
		})
		//旋转
		.bind('rotate', function(e, info){
			if(!gestures){ return; } action = 'rotate';					 
			if(typeof(info.rotation) == 'number'){ _this.rotate(info.rotation); }					  
		});*/
	},
	_getzoom: function(){
		//手机屏幕的密度分为低密度(240*320)/中密度(320*480)和高密度(480*800).通过 
		//window.devicePixelRatio属性可以获得当前手机屏幕的密度类型. 
		//如果该属性值为1.5表示高密度;1为中密度;075表示低密度. 
		var ios = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		var getw = function(){
			var w = 0;
			if($(window).width() < $(window).height()){
				if(ios){
					w = window.screen.width;
				}else{
					w = window.screen.width/window.devicePixelRatio;
				}
			}else{
				if(ios){
					w = window.screen.height;
				}else{
					w = window.screen.height/window.devicePixelRatio;
				}	
			}
			return w;
		
		}
		var _this = this;
		$(window).bind('resize', function(){
			_this.zoom_ui = (1920/560)*(($('.screen').width()/getw()));
		});
		this.zoom_ui = (1920/560)*(($('.screen').width()/getw()));
		return this.zoom_ui;
	},
	_parsenumber: function(n){
		 var re = /([0-9]+\.[0-9]{2})[0-9]*/;
   		 return parseFloat(n.toString().replace(re,'$1'));
	},
	console: function(msg){
		if(!this.paneltest){
			this.paneltest = 
			$('<div style="z-index:6;position:absolute;top:0;left:0;background:#000;color:#f00;"></div>')
			.appendTo(this.box.parent())
			.bind('click', function(){
				$(this).hide();						
			})
		}
		this.paneltest.html(msg).show();
	},
	getimgsize: function(){
		var width = 0, height = 0;
		return { 'width': this.img.width(), 'height': this.img.height() }	
	},
	check: function(x, y, w, h){
		if(x>=this.w_target-400 || x+w-400<=0 ||
		   y>=this.h_target-200 || y+h-200<=0){ return false; }
		return true;
	},	
	center: function(){
		var w = this.info.w;
		var h = this.info.h;
		var x = (this.w_target - this.info.w)/2;
		var y = (this.h_target - this.info.h)/2;		
		this.img.css({ 'width': w, 'height': h, 'left': x, 'top': y }, 300);		
		this.info.x = x;
		this.info.y = y;
		return this;
	},
	reset: function(){
		this.info.w = this.w_target;
		this.info.h = this.info.w / this.ratio_img;
		this.center().setrotate(0);
		return this;
	},
	rotate: function(deg, frombuttom){
		if(arguments[1]){ //按钮点击向下去整， 附加整角度
			if(deg<0){
				deg = Math.ceil(this.info.r/90)*90 + deg;	
			}else{
				deg = Math.floor(this.info.r/90)*90 + deg;
			}
		}else{		
			deg = this.info.r + deg;
		}
		//吸附正角度
		var deg_ajust = Math.round(deg/90)*90;
		if(Math.abs(deg_ajust - deg) < 10){ deg = deg_ajust }
		if(deg >=360){ deg = deg - 360; }
		else if(deg < 0){ deg = 360 + deg; }
		this.setrotate(deg);
		return this;
	},
	setrotate: function(deg){
		var prefix = ($.browser.webkit)  ? '-webkit-' : 
				 ($.browser.mozilla) ? '-moz-' :
				 ($.browser.ms)      ? '-o-' :
				 ($.browser.opera)   ? '-ms-' : '';
		this.img.css(prefix + 'transform', 'rotate('+ deg +'deg)');
		this.img.attr('deg', deg);
		return this;
	},
	move: function(offset){
		var dx = offset.x*this.zoom_ui;
		var dy = offset.y*this.zoom_ui;
		var x = Math.round(this.info.x + dx);
		var y = Math.round(this.info.y + dy);
		var w = this.info.w; 
		var h = this.info.h;		
		if(this.check(x, y, w, h)){
			//吸附边缘
			//if(Math.abs(x)<10){ x = 0; }//else if(Math.abs(this.w_target-x) < 10){ x = this.w_target -w; }
			//if(Math.abs(y)<10){ y = 0; }//else if(Math.abs(this.h_target-h) < 10){ y = this.h_target -h; }
			this.img.css({'left': x, 'top': y });
			this.info.x = x;
			this.info.y = y;
		}
		return this;
	},
	zoom: function(scale){
		var scale = scale;
		var w = this.info.w * scale;
		if(w > this.w_target*this.zoom_limit.max ){ w = this.w_target*this.zoom_limit.max; }
		if(w < this.w_target*this.zoom_limit.min){ w = this.w_target*this.zoom_limit.min; }		
		var h = w / this.ratio_img;
		var x = this.info.x - (w - this.info.w)/2
		var y = this.info.y - (h - this.info.h)/2;
		if(this.check(x, y, w, h)){
			this.img.css({ 'width': w, 'height': h, 'left': x, 'top': y });
		}
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
			'r': parseFloat(this.img.attr('deg'))
		});		
		return this;
	},
	getinfo: function(){
		return this.info;
	}
}