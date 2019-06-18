#!/usr/bin/env node
/**
 * 执行入口
 * 通过命令行参数调用
 * @调用参数
 *  node index.js -p 工程文件路径  -o 输出路径
 * @指定工程文件
 *  1.相对路径
 *      相对于index.js所在路径,非当前命令行所在路径
 *  2. 绝对路径
 *      无影响，撒手使用！
 * @不指定工程
 *  默认查找当前命令行所在路径下的 pflib.conf.js    
 */
const   path = require('path'),
        builder = require("./core/builder/builder"),
        argv = require('minimist')(process.argv.slice(2),{ alias: { project: 'p',output: "o" } }),
        defProject = "pflib.conf.js";

/**
 * 查找工程文件
 */
let projectConf = argv.project ? ( "./project/" + argv.project ) : ( ( process.cwd() + "/" ) + defProject );

/**
 * 载入工程文件后开始执行编译
 * @参数拾取输出路径
 *  参数的output/-o用于指定最终的outputPath
 */
( require('fs').existsSync( projectConf ) === false ) 
    ? console.error('missing project file!') 
    : builder( (function () {
                    let p = require( projectConf );
                    p.outputPath = argv.output || null;
                    return p;
                })() 
    );
