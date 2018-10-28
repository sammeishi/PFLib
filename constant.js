/*
* 常量定义
* */
let $$ = global;
let path = require('path');
/*
* 路径部分
* */
let root = __dirname + "/";
$$.ROOT_PATH = root; //根目录
$$.TMP_PATH = root+"tmp/"; //临时目录
$$.PROJECT_DIST_PATH = root+"dist/"; //工程默认输出目录