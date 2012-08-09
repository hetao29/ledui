(function(){

//touch like hover
$('[hover-effect]').bind('touchstart touchend', function(e) { 
	e.preventDefault();
	var classname = $(this).attr('hover-effect');
	$(this).toggleClass(classname); 
});


})();