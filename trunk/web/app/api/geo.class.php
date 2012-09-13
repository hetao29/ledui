<?php
class api_geo{
	function get($latitude,$longitude,$lang="zh"){
		$r = $latitude.",".$longitude;
		$r = file_get_contents("http://maps.google.com/maps/api/geocode/json?sensor=false&latlng=$r&language=$lang");
		return SJson::decode($r);
	}
}
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>乐兑网-乐兑明信片</title>
</head>
<body>

<link href="http://code.google.com/apis/maps/documentation/javascript/examples/default.css" rel="stylesheet" type="text/css" /> 
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script> 
<script type="text/javascript"> 
  var geocoder; 
  var map; 
  function initialize() { 
    geocoder = new google.maps.Geocoder(); 
    var latlng = new google.maps.LatLng(39.9695355, 116.394568); 

    var myOptions = { 
      zoom: 12, 
      center: latlng, 
      mapTypeId: google.maps.MapTypeId.ROADMAP 
    } 
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
var mark = new google.maps.Marker({map:map,position:new google.maps.LatLng(39.9695355, 116.394568),visible:true});
alert(mark.getMap());
  } 
</script>
<body onLoad="initialize()"> 
<div id="map_canvas" style="width:300px;height:100px"></div> 
</body> 

