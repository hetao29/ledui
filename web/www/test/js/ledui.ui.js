$(document).ready(function(){
	Adapta.init();
	Page.init(2);	
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
		if(page_current){
			this.lock = true;
			//this.screen.css('overflow', 'hidden');
			page_current.addClass('hidefrom'+ hide_direction);
			window.setTimeout(function(){					
				page_current.hide().removeClass('hidefrom' + hide_direction);
			}, 600);
			page.addClass('showfrom'+ show_direction).show();
			window.setTimeout(function(){
				_this.lock = false;
				//_this.screen.css('overflow', '');
				page.removeClass('showfrom' + show_direction); 
			}, 600);
		}else{			
			page.show();	
		}
		
		this.current_prev = this.current;
		this.current = n;
		
		Adapta.layout();
		
		var appnav = $('.appnav'); 
		if(page.attr('_hasnav')){ 
			appnav.show(); 
			$.each(appnav.find('li'), function(){
				var li = $(this);
				if(parseInt(li.attr('mark'), 10) ==  n){
					li.addClass('current');	
				}else{
					li.removeClass('current');
				}
			});
		}
		else{ appnav.hide(); }
		
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
	scrollers: {},
	sindex: -1,
	init: function(){
		if(UI.istouch){ this.scale(); }
		this.bind();
	},
	bind: function(){
		var _this = this;
		$(window).bind('resize', function(){ _this.layout(); });	
	},
	scale: function(){
		var win_w = $(window).width()
			,win_h = $(window).height()
			,scr_w = $('.screen').width()
		
		this.ratio = win_w/scr_w;
		$('body').css('zoom', this.ratio);
		$('.screen').css({ 'height': win_h/this.ratio, });
	},
	layout: function(){		
		var  pg = Page.getcurrentpage()	
			,hd = pg.find('.panel_head')
			,bd = pg.find('.panel_body')
			,ft = pg.find('.panel_foot')
			,H = $(window).height()/this.ratio
			,h1 = hd.outerHeight(true)
			,h3 = ft.outerHeight(true)
			,h2 = H - h1 - h3;
		$('.screen').css('height', H);
		pg.css('height', H);
		bd.css('top', h1).css('height', h2);
		
		this.chkscroll(pg);
	},
	
	chkscroll: function(){
		var pg = Page.getcurrentpage()
			,bd = pg.find('.panel_body')
			,box = bd.find('.panel_body_box')
			,h = 0
			,_this = this
			,config = {
				hScroll: false,
				vScroll: true,
				hScrollbar: false,
				vScrollbar: true,
				zoom: false,
				//解决浏览器里不能点击输入框的问题,hetal
				onBeforeScrollStart: function (e) {
					var target = e.target;
					while (target.nodeType != 1) target = target.parentNode;
					if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'){
						e.preventDefault();
					}	
				}
			};		
		box.children().each(function(){ h += $(this).height(); })
		box.css('height', h);
		
		$('[scrollinstall]').each(function(){
			var sindex = $(this).attr('scrollindex');
			$(this).removeAttr('scrollinstall').removeAttr('scrollindex');
			_this.scrollers[sindex].destroy();
			delete(_this.scrollers[sindex]);
		});
		this.sindex = -1;
		if(bd.height() < h){
			this.sindex ++;
			this.scrollers[this.sindex]= new iScroll(bd.get(0), config);
			bd.attr('scrollinstall', 'true').attr('scrollindex', this.sindex);
		}
	}
}

//遮罩层
var Overlay = {
	isinit: false, curname: '', layers: {}, mask: null, lock:false,
	init: function(){
		var overlays = $('.overlay')
			,overlay_mask = $('.overlay_mask')
			,_this = this;
		var clickevent  = UI.istouch ? 'tapone' : 'click';
		overlays.each(function(){
			var o = $(this)
				,name = o.attr('_name')
				,handle = o.find('.close');
			if(name){ _this.layers[name] = o; }	
			o.bind(clickevent, function(){ return false; });
			handle.bind(clickevent, function(){ _this.hide(); return false;	});
		});
		overlay_mask.bind(clickevent, function(){ _this.hide(); return false; });
		if(overlay_mask.length){ this.mask = overlay_mask; }
		this.isinit = true;
	},
	show: function(name){
		if(!this.isinit){ this.init(); }
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

var Loading = {
	isinit: false,
	init: function(){
		this.loading = $('.apploading');
		this.text = this.loading.find('.text');
		console.log(this.text);
		this.isinit = true;
	},
	show: function(text){
		if(!this.isinit){ this.init(); }
		this.loading.show();
		if(!text){ text = '正在加载...' }
		this.text.html(text);
		return this;	
	},
	hide: function(){
		if(!this.isinit){ this.init(); }
		this.loading.hide();
		return this;
	}
}

//触摸事件
var Touch = {
	init: function(){ this.bind(); },
	bind: function(){
		$('body')
		.bind('scroll', function(e){  e.preventDefault(); })		
		.bind('touchmove', function(e){  e.preventDefault(); });
		$('[active]')
		.live('touchstart', function(e) { $(this).addClass('active'); e.preventDefault(); })
		.live('touchend', function(e) { $(this).removeClass('active'); e.preventDefault(); });		
		$('[focus]')
		.bind('focus', function(e) { $(this).addClass('focus'); })
		.bind('blur', function(e) { $(this).removeClass('focus'); });
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
			setTimeout(function(){
			_this.loading.hide();
			}, 200);
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
