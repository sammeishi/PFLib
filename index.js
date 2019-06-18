#!/usr/bin/env node
/**
 * 执行入口
 * 通过命令行参数调用
 * @使用方式
 *  node index.js -p 工程文件路径  -o 输出路径
 *  或者( 需要npm link )
 *  pflib -p 工程文件路径  -o 输出路径
 * @工程所在路径
 *  此路径是工程文件所在目录
 *  之后编译期所有输入输出路径都会存放与此目录下
 * @默认工程文件
 *  如果不指定，在当前CWD内查找pflib.conf.js
 * @输出路径 ouputPath
 *  如果不指定，默认为工程所在路径
 *  如果指定，相对路径也是相对于与工程所在路径
 *  除非指定绝对路径，否则输出到工程所在路径内
 */
const   path = require('path'),
        builder = require("./core/builder/builder"),
        argv = require('minimist')(process.argv.slice(2),{ alias: { project: 'p',output: "o" } }),
        defProject = "pflib.conf.js";

/**
 * 查找工程文件
 * 如果不传入，则查找CWD下的pflib.conf.js
 */
let projectConf = argv.project ? ( argv.project ) : ( ( process.cwd() + "/" ) + defProject );
let PROJECT_PATH = path.dirname( projectConf ) + "/";

/**
 * 载入工程文件后开始执行编译
 */
( require('fs').existsSync( projectConf ) === false ) 
    ? console.error('missing project file!') 
    : builder( (function () {
                    let p = require( projectConf );
                    p.outputPath = argv.output ? path.resolve(PROJECT_PATH, argv.output) : PROJECT_PATH;
                    return p;
                })() 
    );
