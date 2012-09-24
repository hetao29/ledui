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
		
		var total = PageMgr.gettotal();
		var current = PageMgr.getcurrent();
		var ops="";
		for(var i=0; i<total; i++){ ops += '<option value="'+ i +'"'+ ((i == current) ? ' selected' : '') + '>'+ i + ':' + PageMgr.getpage(i).name +'</option>'; }
		var sel = $('<select>'+ ops +'</select>')
		.appendTo(testpanel)
		.change(function(){
			PageMgr.show($(this).val())				 
		});
		
		/*
		$('<button>prev</button>')
		.appendTo($(testpanel))
		.click(function(){
			PageMgr.prev();			
			sel.val(PageMgr.getcurrent());
		});
		
		$('<button>next</button>')
		.appendTo($(testpanel))
		.click(function(){
			PageMgr.next();
			sel.val(PageMgr.getcurrent());
		});
		
		$('<button>back</button>')
		.appendTo($(testpanel))
		.click(function(){
			PageMgr.back();
			sel.val(PageMgr.getcurrent());
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
		var sel = $('<select><option>选择图片</option></select>')
		.appendTo($(testpanel))
		.bind('change', function(){
			if($(this).val()){					 
				PhotoEditor.init($(this).val());	 
			}
		});	
		var op = '<option value="http://www.ledui.com/image/010000000003505BF15F0159"></option>';
			sel.append(op);
		for(var i=1; i<=20; i++){
			var op = $('<option value="http://42.121.85.21/test/testimg/test'+ i +'.jpg">photo'+ i +'</option>');
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
