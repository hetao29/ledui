//测试脚本
var Test = {
	init: function(){
		this.testpage();
	},
	testpage: function(){
		
		var testpanel = $('<div style="position:fixed;top:0;right:0;text-align:right;zoom:2;z-index:1000"></div>').appendTo($(document.body));
		
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
