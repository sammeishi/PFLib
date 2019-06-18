/*
* gulp执行器
* */
const   gulp = require('gulp'),
        _ = require('lodash'),
        shortid = require('shortid'),
        logger = require('log4js').getLogger("gulpRunner");

//logger等级
logger.level = 'debug';
/**
 * 加载hulp的各种插件
 * 收集在一起，挂载在env上供工程配置内使用
 */
const plugins = {
    concat: require('gulp-concat'),
    uglify: require('gulp-uglify'),
    rename: require('gulp-rename'),
    minifyCss: require('gulp-minify-css')
};
/**
 * 构造环境对象
 * 此变量容纳了所有可供使用的变量
 */
function createEnvObj( initEnv ){
    return _.merge({
        gulp,
        logger,
        plugins
    },initEnv || {})
}
/**
 * 创建一个fulp任务
 * @param   {function}    taskFunc    gulp任务函数
 * @param   {object}      initEnv     初始化环境变量
 * @return  {string}
 */
function createTask( taskFunc,initEnv ){
    let taskName = shortid.generate();
    gulp.task( taskName,taskFunc.bind( createEnvObj( initEnv ) ) );
    return taskName;
}
/**
 * 批量执行gulp任务
 * @param   array,string    taskName    任务名称列表
 * @param   function        cb          执行后回调
 */
function batch( taskNames ,cb){
    let entryTaskName = shortid();
    gulp.task(entryTaskName,taskNames);
    gulp.start( entryTaskName,function( err ){
        err ? cb( false,err ) : cb( true );
    } );
}

/**
 * 导出 批量执行任务，创建任务函数
 */
module.exports = { batch,createTask };