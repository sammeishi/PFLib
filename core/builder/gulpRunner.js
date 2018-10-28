/*
* gulp执行器
* */
const gulp = require('gulp');
const _ = require('lodash');
const shortid = require('shortid');
const logger = require('log4js').getLogger("gulpRunner");
logger.level = 'debug';

/*
* 加载插件
* */
const plugins = {};
plugins.concat = require('gulp-concat');
plugins.uglify = require('gulp-uglify');
plugins.rename = require('gulp-rename');
plugins.minifyCss = require('gulp-minify-css');

/*
* 构造gulp的执行环境
* 用于绑定task函数
* */
function getEnv(){
    let env = {};
    env.gulp = gulp;
    env.logger = logger;
    env.plugins = plugins;
    return env;
}
/*
* 创建gulp任务
* 返回任务ID
* @return   string  任务ID，批量执行时必须传入此id
* */
function createTask( taskFunc,initEnv ){
    let taskName = shortid.generate();
    let env = _.merge(getEnv(),initEnv || {});
    gulp.task( taskName,taskFunc.bind( env ) );
    return taskName;
}
/*
* 批量执行任务
* */
function batch( taskNames ,cb){
    let entryTaskName = shortid();
    gulp.task(entryTaskName,taskNames);
    gulp.start( entryTaskName,function( err ){
        err ? cb( false,err ) : cb( true );
    } );
}

module.exports = { batch,createTask };