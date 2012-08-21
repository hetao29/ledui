$(document).ready(function(){
	Page.init(2);
	Adapta.init();
	Overlay.init();
	Scroll.init();		
	Touch.init();
})


//页面显示控制
var Page = {
	current: -1,
	current_prev: -1,
	pages: [],
	total: 0,
	htmlattr: '_page',
	effect: '',
	screen: $('.screen'),
	init: function(n){
		this.pages = this.seri();
		this.total = this.pages.length;
		if(!this.total){ return; }
		var n = arguments[0] ? arguments[0] : 0;
		this.show(n);
	},
	show: function(n){
		var n = parseInt(n, 10);
		if(n<0 || n>=this.total){ return; }
		if(n == this.current){ return; }
		var page_current = this.getpage(this.current); 
		var page = this.getpage(n);
		if(!page){ return; }
		
		this.screen.css('overflow', 'hidden');
		
		var show_direction = n > this.current ? 'right' : 'left';
		var hide_direction = n > this.current ? 'left' :  'right';
		var _this = this;
		
		if(page_current){
			page_current.addClass('hidefrom'+ hide_direction);
			window.setTimeout(function(){					
				page_current.removeClass('hidefrom' + hide_direction).hide();
			}, 600);
		}
		page.addClass('showfrom'+ show_direction).show();
		window.setTimeout(function(){
			_this.screen.css('overflow', '');
			page.removeClass('showfrom' + show_direction); 
		}, 600 );
		this.current_prev = this.current;
		this.current = n;
		Adapta.run();
	},
	next: function(){
		var next = this.current + 1;
		if(next > this.total - 1){ return; }
		this.show(next);
	},
	prev: function(){
		var prev = this.current - 1;
		if(prev < 0){ return; }
		this.show(prev);
	},
	back: function(){
		if(this.current_prev<=0 && this.current_prev == this.current){ return; }
		this.show(this.current_prev);
	},
	//存储顺序与html顺序无关，并纠正错误标记，相同前者优先，未标 记为0
	seri: function(){
		var pages = [];
		var ps = $('.page');
		var tmp = {};
		var _this = this;
		ps.each(function(){
			var p = $(this);
			var n = p.attr(_this.htmlattr);
			if(!n){ n = 0; }
			n = parseInt(n, 10);
			if(tmp[n]){ tmp[n].push(p); }
			else{ tmp[n] = [p]; }
		});
		for(var key in tmp){
			var t = tmp[key];
			for(var i=0; i<t.length; i++){
				pages.push(t[i]);	
			}
		}
		return pages;
	},
	getpage: function(n){
		return this.pages[n];	
	},
	getpages: function(){
		return this.pages;	
	},
	gettotal: function(){
		return this.total;	
	},
	getcurrent: function(){
		return this.current;	
	},
	getcurrentpage: function(){
		return this.getpage(this.current);	
	}
}


//屏幕适配器
var Adapta = {
	init: function(){
		this.bind();
	},
	bind: function(){
		var _this = this;
		$(window).resize(function(){ 
			_this.run(); 
		})	
	},	
	run: function(){		
		var  pg = Page.getcurrentpage()	
		,hd = pg.find('.panel_head')
		,bd = pg.find('.panel_body')
		,ft = pg.find('.panel_foot');
		
		//children static
		var h_bd = 0;
		bd.children().each(function(){ h_bd += $(this).height(); })
		
		var H = $(window).height()
			,h1 = hd.height()
			,h3 = ft.height()
			,h2_min = parseInt(bd.attr('_minheight'), 10) || h_bd
			,h2 = H - h1 - h3
			
		bd.css({'top': h1, 'height': h2});
		
		if(H < h1 + h2_min + h3 ){
			pg.css('height', h1 + (h_bd<=h2_min ? h2_min : h_bd) + h3);
			//hd.css('position', 'absolute');
			bd.css('height', (h_bd<=h2_min ? h2_min : h_bd));
			//ft.css('position', 'absolute');
		}else{
			pg.css('height', H);
			//hd.css('position', 'fixed');
			bd.css('height', h2).css('marginBottom', h3);
			//ft.css('position', 'fixed');
		}
			
	}
}


//触摸事件
var Touch = {
	init: function(){
		this.bind();
	},
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
		scrolls.each(function(){
			var s = new iScroll($(this).get(0));		
		});	
	}	
}

//遮罩层
var Overlay = {
	curname: '',
	layers: {},
	mask: null,
	init: function(){
		var overlays = $('.overlay');
		var overlay_mask = $('.overlay_mask');
		var _this = this;
		overlays.each(function(){
			var o = $(this);
			var name = o.attr('name');
			if(name){ _this.layers[name] = o; }
			var handle = o.find('.close');
			o.click(function(){ return false; });
			handle.click(function(){ _this.hide();	 });
		});
		overlay_mask.click(function(){ _this.hide(); });
		this.mask = overlay_mask;
	},
	show: function(name){
		var o = this.layers[name];
		if(o){
			if(this.curname != name && this.curname){ this.hide(this.curname); }
			o.show();
			this.mask.show();	
			this.curname = name; 
		}
	},
	hide: function(name){
		var o = this.layers[name ? name : this.curname];
		if(o){
			o.hide();
			this.mask.hide();	
			this.curname = '';	
		} 	
	}	
}
