$(document).ready(function(){
	Touch.init();
	UI.redefine();
	Adapta.init();
	PageMgr.show(1);
});

//UI系统
var UI = {
	istouch: ('createTouch' in document),
	redefine: function(){
		window.Alert = window.alert;
		window.alert = function(msg){ Overlay.show('alert', msg);	}
		window.Confirm = window.confirm;
		window.confirm = function(msg, callback){ Overlay.show('confirm', msg, callback); }
	}
} 
//页面显示控制
var PageMgr = {	
	pages: [], current: -1, current_prev: -1, total: 0, lock: false, isinit: false,
	init: function(n){
		var n = arguments[0] ? arguments[0] : 0;
		this.pages = this.seri();
		this.total = this.pages.length;
		this.isinit = true;
	},
	show: function(n, params, type){
		if(!this.isinit){ this.init(); setTimeout(function(){ $('.apptitlebar').show();}, 300); }
		var n = parseInt(n, 10);
		if(this.lock || !this.total){ return; }
		if(n<0 || n>=this.total || n == this.current){ return; }
		var page_current = this.getpage(this.current), page = this.getpage(n);
		var _this = this;
		var delayunlock = function(){
			setTimeout(function(){ _this.lock = false; execcallback(); }, 350);
		}
		var execcallback = function(){
			if(params){
				if(params.callback){
					params.callback();	
				}	
			}	
		}
		if(!page){ return; }
		this.lock = true;
		if(type == 'go'){
			if(page_current){ page_current.hide('left'); }
			page.show('right');
			delayunlock();
		}else if(type == 'back'){
			if(page_current){ page_current.hide('right'); }
			page.show('left');
			delayunlock();
		}else{
			if(page_current){ page_current.hide(); }
			page.show();
			this.lock = false;
			execcallback();
		}
		
		this.current_prev = this.current;
		this.current = n;
		
		return this;
	},
	go: function(n, params){
		this.show(n, params, 'go')
		return this;
	},
	back: function(n, params){
		this.show(n, params, 'back');
		return this;
	},	
	//存储顺序与html顺序无关，并纠正错误标记，相同前者优先，未标 记为0
	seri: function(){
		var pages = [], ps = $('.page'), tmp = {}, _this = this;
		ps.each(function(){
			var p = $(this), n = p.attr('_page');
			if(!n){ n = 0; }
			n = parseInt(n, 10);
			if(tmp[n]){ tmp[n].push(p); } else{ tmp[n] = [p]; }
		});
		for(var key in tmp){
			var t = tmp[key];
			for(var i=0; i<t.length; i++){ 
				var o = t[i] 
					,index = pages.length
					,name =  o.attr('_name')
					,title = ''
					,appview = o
					,apphead = o.find('.panel_head') 
					,appbody = o.find('.panel_body')
					,appfoot = o.find('.panel_foot')
					,titlebar = o.find('.titlebar')
					,hasnav = o.attr('_hasnav') == 'true' ? true : false;
				apphead  = apphead.length ? apphead : null;
				appbody  = appbody.length ? appbody : null;
				appfoot  = appfoot.length ? appfoot : null;
				titlebar  = titlebar.length ? titlebar : null;
				if(titlebar){
				title = titlebar.find('.title').html();
				}
				var page = new Page({
					index: index,
					name: name,
					title: title,
					appview: appview,
					apphead: apphead,
					appbody: appbody,
					appfoot: appfoot,
					titlebar: titlebar,
					hasnav: hasnav
				});
				pages.push(page);
			
			}
		}
		
		return pages;
	},
	getpage: function(n){ return this.pages[n]; },
	getpages: function(){ return this.pages; },
	gettotal: function(){ return this.total; },
	getcurrent: function(){ return this.current; },
	getcurrentpage: function(){ return this.getpage(this.current); }
}

var Page = function(params){
	for(var key in params){ this[key] = params[key];	}
	this.scroller = null;
	this.layoutinfo = { width:0, height:0 };
}
Page.prototype = {
	show: function(type){
		this.appview.removeClass('showfromleft showfromright hidefromleft hidefromright');		
		if(type == 'left'){ this.appview.addClass('showfromleft').show(); }
		else if(type == 'right'){ this.appview.addClass('showfromright').show(); }
		else{ this.appview.show(); }
		this.layout();
		var appnav = $('#appnav'); 
		if(this.hasnav){ 
			appnav.slideDown(); 
			//appnav.show();
			var index = this.index;
			$.each(appnav.find('li'), function(){
				var li = $(this);
				if(parseInt(li.attr('mark'), 10) == index){ li.addClass('current'); }
				else{ li.removeClass('current'); }
			});
		}
		else{ appnav.hide(); }
		
		return this;
	},
	hide: function(type){
		this.appview.removeClass('showfromleft showfromright hidefromleft hidefromright');
		if(type == 'left'){ this.appview.addClass('hidefromleft'); }
		else if(type == 'right'){ this.appview.addClass('hidefromright'); }
		else{ this.appview.hide(); }
		return this;
	},
	settitle: function(){
		
	},
	chkscroll: function(){
		var pg = this.appview
			,bd = this.appbody
			,box = bd.find('.panel_body_box')
			,h = 0
			,_this = this
			,config = {
				hScroll: false,
				vScroll: true,
				hScrollbar: false,
				vScrollbar: true,
				zoom: false,
				bounce: true,
				bounceLock: true, 
				momentum: true, 
				//解决浏览器里不能点击输入框的问题,hetal
				onBeforeScrollStart: function (e) {
					var target = e.target;
					while (target.nodeType != 1) target = target.parentNode;
					if(target.tagName!='SELECT'&&target.tagName!='INPUT'&&target.tagName!='TEXTAREA'){
						e.preventDefault();
					}
				}
			};		
		box.children().each(function(){ h += $(this).height(); })
		box.css('height', h);
		
		if(bd.height() < h){
			if(!this.scroller){
				this.scroller = new iScroll(bd.get(0), config);
			}
		}else{
			if(this.scroller){
				this.scroller.destroy();
				this.scroller = null;
			}
		}
		
		return this;
	},
	f5scroll: function(){
		if(this.scroller){ this.scroller.refresh(); }
		return this;
	},
	scrollto: function(x, y){
		if(this.scroller){ this.scroller.scrollTo(x, y, 200); }
		return this;
	},
	layout: function(){	
		var  pg = this.appview	
			,hd = this.apphead
			,bd = this.appbody
			,ft = this.appfoot
			,H = Adapta.layoutinfo.height/Adapta.ratio
			,h1 = hd ? hd.outerHeight(true) : 0
			,h3 = ft ? ft.outerHeight(true) : 0
			,h2 = H - h1 - h3;
			
		if(this.layoutinfo.width != Adapta.layoutinfo.width 
			|| this.layoutinfo.height != Adapta.layoutinfo.height){
			$('.screen').css('height', H);
			pg.css('height', H);
			bd.css('top', h1).css('height', h2);
			this.layoutinfo = {
				width: Adapta.layoutinfo.width,
				height: Adapta.layoutinfo.height
			};
		}
		
		this.chkscroll();
		
		return this;
	}
}


//屏幕适配器
var Adapta = {
	ratio: 1,
	layoutinfo: {width:$(window).width(), height: $(window).height()},
	init: function(){
		if(UI.istouch){ this.scale(); }
		this.bind();
	},
	bind: function(){
		var _this = this;
		$(window).bind('resize', function(){
			var win_w = $(this).width();
			var win_h = $(this).height();
			if(UI.istouch){ 
				if(win_w != _this.layoutinfo.width){
					_this.scale();
					if(win_h != _this.layoutinfo.height){
						_this.layout();	
					} 
				}
			}else{
				if(win_h != _this.layoutinfo.height){
					_this.layout();
				}
			}
		});
		if(UI.istouch){
			$(window).bind('orientationchange', function(){
				_this.scale();
				_this.layout();
			});	
		}	
	},
	scale: function(){
		var win_w = $(window).width()
			,win_h = $(window).height()
			,scr_w = $('.screen').width()
		
		this.ratio = win_w/scr_w;
		$('body').css('zoom', this.ratio);
		$('.screen').css({ 'height': win_h/this.ratio});
		return this;
	},
	layout: function(){		
		this.layoutinfo = { width: $(window).width(), height: $(window).height() };
		var page = PageMgr.getcurrentpage();
		if(page){ page.layout(); }
		return this;
	}
}

//遮罩层
var Overlay = {
	isinit: false, curname: '', layers: {}, mask: null, lock:false,
	init: function(){
		var overlays = $('.overlay')
			,overlay_mask = $('.overlay_mask')
			,_this = this;
		overlays.each(function(){
			var o = $(this)
				,name = o.attr('_name')
				,handle = o.find('.close');
			if(name){ _this.layers[name] = o; }	
			o.bind('tapone', function(e){ return false; });
			handle.bind('tapone', function(){ _this.hide(); return false;	});
		});
		overlay_mask.bind('tapone', function(){ _this.hide(); return false; });
		if(overlay_mask.length){ this.mask = overlay_mask; }
		this.isinit = true;
	},
	show: function(name, message, callback){
		if(!this.isinit){ this.init(); }
		if(name == this.curname){ return; }
		var o = this.layers[name];
		var _this = this;
		if(!o || this.lock){ return; }
		this.lock = true;
		if(this.curname){ this.hide(this.curname); }		
		if(name == 'alert'){
			var info = o.find('.info');
			var btnok = o.find('.button').eq(0);
			btnok.bind('tapone', function(){ _this.hide(); });
			info.html(message);	
		}else if(name == 'confirm'){
			var info = o.find('.info');
			var btnok = o.find('.button').eq(1);
			var btncancel = o.find('.button').eq(0);
			btnok.bind('tapone', function(){ 
				_this.hide(function(){
					if(callback){ 
						if(typeof(callback.ok) == 'function'){
							callback.ok();	
						}
					}
				});
			});
			btncancel.bind('tapone', function(){ 
				_this.hide(function(){
					if(callback){ 
						if(typeof(callback.cancel) == 'function'){
							callback.cancel();	
						}
					}
				});
			});
			info.html(message);
		}
		$('.overlays').show();
		o.addClass('showfromtop').show();
		this.curname = name; 
		this.mask.stop().animate({opacity: 0.5}, 350).show();
		setTimeout(function(){ o.removeClass('showfromtop'); _this.lock = false; }, 350);			
	},
	hide: function(callback){
		var o = this.layers[name ? name : this.curname]
			,_this = this;
		if(!o){ return; }			
		o.addClass('hidefromtop');
		this.curname = '';
		this.mask.stop().animate({opacity: 0}, 350, '', function(){ _this.mask.hide();
			if(typeof(callback) == 'function'){
				callback();	
			}
		});
		setTimeout(function(){ o.removeClass('hidefromtop').hide(); if(!_this.curname){ $('.overlays').hide(); } }, 350);
	}	
}

var Loading = {
	isinit: false,
	init: function(){
		this.loading = $('.apploading');
		this.text = this.loading.find('.text');
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

var Photoinfo = {
	tostyle: function(info){
		if(!info){ return ''; }
		var prefix = ($.browser.webkit)  ? '-webkit-' : 
				 ($.browser.mozilla) ? '-moz-' :
				 ($.browser.ms)      ? '-o-' :
				 ($.browser.opera)   ? '-ms-' : '';
		
		var style = '';
		var rotate = prefix + 'transform:rotate('+ info.r +'deg);';
		style += 'width:' + info.w + 'px;'
			  +  'height:' + info.h + 'px;'
			  +  'left:' + info.x + 'px;'
			  +  'top:' + info.y + 'px;'
			  +  rotate;
		return style;
	}
}

var Preview = {
	side: 'unknown',
	isinit: false,
	init: function(){
		this.handles = $('#chardchoice li');
		this.handle_front = this.handles.eq(0);
		this.handle_back = this.handles.eq(1);
		this.panel = $('.preview .view');
		this.panel_front = $('.preview .card_front');
		this.panel_back = $('.preview .card_back');
		this.bind();
		this.isinit = true;
	},
	bind: function(){
		var _this = this;
		this.handle_front.bind('tapone', function(){ _this.show('front'); });
		this.handle_back.bind('tapone', function(){ _this.show('back'); });
	},
	clear: function(){
		this.panel_front
		.removeClass('tofront')
		.removeClass('toback')
		.removeClass('atfront')
		.removeClass('atback');
		this.panel_back
		.removeClass('tofront')
		.removeClass('toback')
		.removeClass('atfront')
		.removeClass('atback');
	},
	show: function(side){
		if(!this.isinit){ this.init(); }
		var side = arguments[0];
		if(side == this.side){ return this; }
		
		side = side ? side : (this.side != 'unknown' ? this.side : 'back');
		if(side == this.side){ 
			this.clear();
			if(side == 'front'){
				this.panel_front.addClass('atfront').show();
				this.panel_back.addClass('atback').show();
			}else{
				this.panel_front.addClass('atback').show();
				this.panel_back.addClass('atfront').show();
			}
			return this;
		}
		this.clear();
		var _this = this;
		if(side == 'front'){
			this.handle_front.addClass('current');
			this.handle_back.removeClass('current');
			if(this.side == 'unknown'){
				this.panel_front.addClass('atfront').show();
				this.panel_back.addClass('atback').show();
			}else{
				this.panel_front.addClass('tofront');
				this.panel_back.addClass('toback');
				setTimeout(function(){
					_this.panel_front.removeClass('tofront').addClass('atfront');
					_this.panel_back.removeClass('toback').addClass('atback');
				}, 300)
			}
		}else if(side == 'back'){
			this.handle_front.removeClass('current');
			this.handle_back.addClass('current');
			if(this.side == 'unknown'){
				this.panel_front.addClass('atback').show();
				this.panel_back.addClass('atfront').show();
			}else{
				this.panel_front.addClass('toback');
				this.panel_back.addClass('tofront');
				setTimeout(function(){
					_this.panel_front.removeClass('toback').addClass('atback');
					_this.panel_back.removeClass('tofront').addClass('atfront');
				}, 300)
			}
		}
		this.side = side;
		return this;
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
		this.info = { o: img, w: 0, h: 0, x: 0, y: 0, r: 0 };
		this.box = $('#photo');
		this.panel = $('#photopanel');
		this.loading = $('#photoloading');
		this.canvas = $('#photoeditorcanvas').get(0);
		this.box.html('');
		this.loading.show();
		//img loaded bind event
		var _this = this;
		this.img = $('<img id="photoeditorimg" deg="0"/>')
		.bind('load', function(){
			var size = _this.getimgsize();
			_this.setinfo({ 'o': img, 'w': size.width, 'h': size.height });
			$(this).css({ 'width': size.width, 'height': size.height });
			_this.ratio_img = size.width/size.height;
			setTimeout(function(){
			_this.loading.hide();
			_this.center();
			_this.img.stop().animate({opacity: 1}, 300);
			}, 200);
			if(_this.isfirstrun){ _this.bind(); _this.isfirstrun = false; }
			_this.isready = true;
		})
		.bind('error', function(){
			_this.loading.hide();
		})
		.appendTo(this.box)
		.css('opacity', 0.5)
		.attr('src', img)
		.trigger("change");		
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
	},
	
	getimage: function(scale){
		if(!this.isready){ return ''; }
		var scale = arguments[0] ? arguments[0] : 1  
			,canvas = this.canvas
			,ctx = canvas.getContext("2d")
			,width = this.w_target*scale
			,height = this.h_target*scale
			,o = $(this.img).get(0)
			,w = this.info.w*scale
			,h = this.info.h*scale
			,x = this.info.x*scale
			,y = this.info.y*scale
			,r = this.info.r*Math.PI/180
			
		canvas.width = width;
		canvas.height = height;
		
		/*
		var stage = new Stage(ctx);
		stage.setFrameRate(0);
		
		var box = new Sprite();
		box.x = 0;
		box.y = 0;
		box.width = w;
		box.height = h;
		stage.addChild(box);
		
		var image = new Bitmap(o);
		image.x = x;
		image.y = y;
		image.width = w;
		image.height = h;
		image.regX = w/2;
		image.regY = h/2;
		image.rotation = this.info.r;
		stage.addChild(image);
		*/
		
		ctx.save();
		ctx.clearRect(0, 0, width, height);
		ctx.translate(width/2, height/2);
		ctx.rotate(r);
		ctx.translate(-w/2, -h/2);
		ctx.drawImage(o, 0, 0, w, h);
		ctx.restore();
		
	}
	
}
