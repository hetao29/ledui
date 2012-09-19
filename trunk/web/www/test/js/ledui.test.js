//测试脚本
var Test = {
	init: function(){
		this.testpage();
	},
	testpage: function(){
		
		var testpanel = $('<div style="zoom:2;position:fixed;top:0;right:0;text-align:right;z-index:1000;"></div>').appendTo($(document.body));
		testpanel.css('zoom', Adapta.ratio);
		$('<button>reload</button>')
		.appendTo($(testpanel))
		.click(function(){
			window.location.reload();				
		});
		
		$('<br><br>').appendTo($(testpanel));
		
		var total = Page.gettotal();
		var current = Page.getcurrent();
		var ops = '';
		for(var i=0; i<total; i++){ ops += '<option value="'+ i +'"'+ ((i == current) ? ' selected' : '') + '>'+ i + ':' + Page.getpage(i).attr('_name') +'</option>'; }
		var sel = $('<select>'+ ops +'</select>')
		.appendTo(testpanel)
		.change(function(){
			Page.show($(this).val())				 
		});
		
		/*
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
		*/
		$('<br><br>').appendTo($(testpanel));
		/*
		for(var key in Overlay.layers){
			(function(key){	
				$('<button>'+ key +'</button>')
				.appendTo(testpanel)
				.click(function(){
					Overlay.show(key);	
				});	
			})(key);
		}
		
		$('<br>').appendTo($(testpanel));
		*/
		var ps = ['testimg/test.jpg', 'testimg/test2.jpg', 'testimg/test3.jpg'];
		var sel = $('<select><option>选择图片</option></select>')
		.appendTo($(testpanel))
		.bind('change', function(){
			if($(this).val()){					 
				PhotoEditor.init($(this).val());	 
			}
		});	
		for(var i=0; i<ps.length; i++){
			var src = ps[i];
			var op = $('<option value="'+ src +'">photo'+ i +'</option>');
			sel.append(op);
		}
		//PhotoEditor.init(ps[0]);
		var btn = $('<button>getinfo</button>').appendTo($(testpanel))
		btn.click(function(){
			var info = PhotoEditor.getinfo();
			var str = '';
			for(var key in info){
				str +=  key + ':' + info[key] + '<br>'	
			}
			PhotoEditor.console(str);				   
		})
	}
}

$(document).ready(function(){
	Test.init();	
});
