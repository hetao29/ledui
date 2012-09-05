//测试脚本
var Test = {
	init: function(){
		this.testpage();
	},
	testpage: function(){
		
		var testpanel = $('<div style="position:fixed;top:0;right:0;text-align:right;z-index:1000;"></div>').appendTo($(document.body));
		testpanel.css('zoom', Adapta.ratio);
		$('<button>reload</button>')
		.appendTo($(testpanel))
		.click(function(){
			window.location.reload();				
		});
		
		$('<br>').appendTo($(testpanel));
		
		var total = Page.gettotal();
		var current = Page.getcurrent();
		var ops = '';
		for(var i=0; i<total; i++){ ops += '<option value="'+ i +'"'+ ((i == current) ? ' selected' : '') + '>'+ i +'</option>'; }
		var sel = $('<select>'+ ops +'</select>')
		.appendTo(testpanel)
		.change(function(){
			Page.show($(this).val())				 
		});
		
		
		$('<button>prev</button>')
		.appendTo($(testpanel))
		.click(function(){
			Page.prev();			
			sel.val(Page.getcurrent());
		});
		
		$('<button>next</button>')
		.appendTo($(testpanel))
		.click(function(){
			Page.next();
			sel.val(Page.getcurrent());
		});
		
		$('<button>back</button>')
		.appendTo($(testpanel))
		.click(function(){
			Page.back();
			sel.val(Page.getcurrent());
		});
		
		$('<br>').appendTo($(testpanel));
		
		for(var key in Overlay.layers){
			(function(key){	
				$('<button>'+ key +'</button>')
				.appendTo(testpanel)
				.click(function(){
					Overlay.show(key);	
				});	
			})(key);
		}
				
	}
}

$(document).ready(function(){
	Test.init();	
});
