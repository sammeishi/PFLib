/*
* 入口
* 通过参数调用指定的工程脚本
* */
require('./constant');
const builder = require("./core/builder/builder");
const argv = require('minimist')(process.argv.slice(2),{ alias: { project: 'p',output: "o" } });
let projectConf = "./project/" + (argv.project || null) + ".js";
/*
* 载入输出工程名的配置文件
* 调用编译器开始编译
* */
( require('fs').existsSync( projectConf ) === false ) ? console.error('miss project name!') : builder( (function () {
    let p = require( projectConf );
    p.name = argv.project || null;
    p.output = argv.output || null;
    return p;
})() );
