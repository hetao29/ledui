<?php
chdir(dirname(__FILE__));
$ct = file_get_contents("../web/www/test/index.html");
preg_match_all("/js\/.*?\.js/ms",$ct,$_m);
$param="";
foreach($_m[0] as $f){
	$param.=" --js=../web/www/test/".$f." ";
}

//--compilation_level [WHITESPACE_ONLY | SIMPLE_OPTIMIZATIONS | ADVANCED_OPTIMIZATIONS
//exec("java -jar ../web/util/jsCompiler/compiler.jar  --warning_level VERBOSE --compilation_level ADVANCED_OPTIMIZATIONS $param --js_output_file=../web/www/test/mini.js");
echo("java -jar jsCompiler/compiler.jar  --warning_level VERBOSE --compilation_level SIMPLE_OPTIMIZATIONS $param --js_output_file=../web/www/test/mini.js");
exec("java -jar jsCompiler/compiler.jar  --compilation_level SIMPLE_OPTIMIZATIONS $param --js_output_file=../web/www/test/mini.js");
