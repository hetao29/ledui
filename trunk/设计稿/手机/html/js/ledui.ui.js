
$(document).ready(function(){
	Page.init(1);
	Adapta.init();		
	Touch.init();
	Test.init();
})


var Test = {
	init: function(){
		this.testpage();
	},
	testpage: function(){
		
		var testpanel = $('<div style="position:fixed;top:0;right:0;text-align:right;width:300px;zoom:2;z-index:1000"></div>').appendTo($(document.body));
		
		var total = Page.gettotal();
		var current = Page.getcurrent();
		var ops = '';
		for(var i=0; i<total; i++){ ops += '<option value="'+ i +'"'+ ((i == current) ? ' selected' : '') + '>'+ i +'</option>'; }
		$('<select>'+ ops +'</select>')
		.appendTo(testpanel)
		.change(function(){
			Page.show($(this).val())				 
		});
		
		$('<button>prev</button>')
		.appendTo($(testpanel))
		.click(function(){
			Page.prev();
			
		});
		
		$('<button>next</button>')
		.appendTo($(testpanel))
		.click(function(){
			Page.next();				
		});
		
	}
}

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
