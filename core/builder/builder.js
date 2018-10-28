/*
* 编译器
* 用于编译指定的工程
* @流程
* 1：获取所有需要的库
* 2：预处理
* 3：执行类库任务流
* 4：执行全局任务流
* */
const gulpTask = require('./gulpTask');
const gulpRunner = require('./gulpRunner');
const logger = require('log4js').getLogger("builder");
const path = require('path');
const fse = require('fs-extra');
const getter = require("./../getter/getter");
const supportLibrarys = require('./../../librarys');
const _ = require('lodash');
let project = null;
logger.level = 'debug';
/*
* 初始化
* */
function init(){
    return new Promise(function( S,J ){
        //创建工程id以及工作目录
        project.id = Date.now();
        project.workPath = TMP_PATH + project.id + "/";
        project.outputPath = path.resolve( ROOT_PATH,project.output || `./dist/${project.name}/` ) + "/";
        //初始化工程指定的类库配置
        for(let name in project.librarys){
            if( !project.librarys.hasOwnProperty(name) ){
                continue;
            }
            let lib = project.librarys[ name ];
            let ver = lib.version || "latest";
            //工程中的类库是否存在于预定义中
            if( !_.has( supportLibrarys,name ) ){
                logger.error(`can not found lib: ${ name }! `);
                return J();
            }
            //类库版本是否存在，不存在报错
            if( !_.has( supportLibrarys[ name ],ver ) ){
                logger.error(`can not found version: ${ ver }! `);
                return J();
            }
            //如果是默认版本，则回补过去
            else{
                lib.version = ver;
            }
            //工程类库配置合并预定义类库配置
            project.librarys[ name ].name = name;
            project.librarys[ name ] = _.merge( {} ,supportLibrarys[ name ][ver],lib);
        }
        //更新预定义gulp任务的project
        gulpTask.setProject( project );
        //创建工作目录，返回pro
        fse.ensureDir( project.workPath ).then(S).catch(J);
    });
}
/*
* 创建getter对象并附加到工程配置中
* @return   false   创建错误
* @return   array   成功的getter对象列表
* */
function createGetter(){
    let getterList = [];
    for( let name in project.librarys ){
        if( project.librarys.hasOwnProperty(name) ){
            let lib = project.librarys[ name ];
            let libOutputPath = project.outputPath + lib.name + "/";
            let g = new getter( lib, project.workPath, libOutputPath );
            getterList.push( g );
            project.librarys[ name ].getter = g;
            project.librarys[ name ].outputPath = libOutputPath;
            project.librarys[ name ].path = libOutputPath;
        }
    }
    return getterList.length === 0 ? false : getterList;
}
/*
* 批量获取lib
* 创建getter列表，执行列表中的start函数
* @return   Promise
* */
function batchGetLib(){
    let getterList = null;
    return new Promise(function( S,J ){
        if( ( getterList = createGetter() ) === false ){
            return J();
        }
        else{
            batchCall( getterList,"start" )
                .then(function(){
                    S( getterList );
                })
                .catch( function( e ){
                    J( e );
                } );
        }
    })
}
/*
* 批量执行getter列表的函数
* 函数的参数形式必须是 getter.func( cb  );
* 而 cb的参数是  cb(  status,error );
* */
function batchCall( getterList,funcName ){
    let index = 0;
    let SFunc,JFunc;
    //每轮执行
    function round(){
        //执行完成
        if( _.isArray(getterList) &&  index >= getterList.length ){
            return SFunc();
        }
        else{
            let getter = getterList[ index++ ];
            let func = getter[ funcName ].bind( getter );
            func( ( s,err ) => {
                s ? round() : JFunc( err );
            });
        }
    }
    //Promise
    return new Promise(function( S,J ){
        SFunc = S;
        JFunc = J;
        return round();
    })
}
/*
* 运行完，销毁自身
* 1: 删除工程目录
* */
function destroy( cb ){
    fse.remove( project.workPath ).catch(function( e ){
        logger.error(`destroy error! ${ e }`);
    }).finally( cb );
}
/*
* 执行所有lib的gulp
* 每个lib的gulp环境包含： 当前lib定义，工程所有lib定义
* */
function execLibGulp(){
    let SFunc,JFunc,index = 0;
    /*
    * 遍历所有lib。创建gulp任务
    * 每个lib一组： [ jquery:[ taskId1,taskId2 ],vue:[taskId1,taskId2] ]
    * 数组中的每个子数组代表一个lib的任务列表
    * */
    let allLibTask = [];
    _.forEach(project.librarys,function( lib ){
        if( _.has(lib,'gulp') ){
            let env = {
                currLib: lib, //当前lib
                outputPath: project.outputPath,//工程输出目录
                librarys: project.librarys //工程所有lib
            }
            ,currLibTaskIds = [];
            _.forEach(_.isArray( lib.gulp ) ? lib.gulp : [ lib.gulp ],function ( taskFunc ) {
                currLibTaskIds.push( gulpRunner.createTask( taskFunc,env ) );
            });
            allLibTask.push( currLibTaskIds );
        }
    });
    /*
    * 分次调用
    * */
    function round(){
        if( index >= allLibTask.length ){
            return SFunc();
        }
        gulpRunner.batch( allLibTask[ index++ ],function( s ,err){
            s ? round() : JFunc( err );
        } );
    }
    //返回Promise，并开始执行
    return new Promise((S,J)=>{ SFunc = S; JFunc = J; round(); });
}
/*
* 执行全局的gulp
* 全局gulp的环境变量包含：工程所有lib定义
* */
function execGlobalGulp(){
    let SFunc,JFunc,index = 0;
    let allTask = []; //所有任务。 子项是独立执行组，组内是taskId
    _.forEach(project.gulp,function( group ){
        let env = {
            librarys: project.librarys,
            outputPath: project.outputPath,//工程输出目录
        }
        ,groupTaskIds = [];
        _.forEach( _.isArray( group ) ? group : [group],function( taskFunc ){
            groupTaskIds.push( gulpRunner.createTask( taskFunc,env ) );
        });
        allTask.push( groupTaskIds );
    });
    /*
    * 分次调用
    * */
    function round(){
        if( index >= allTask.length ){
            return SFunc();
        }
        gulpRunner.batch( allTask[ index++ ],function( s ,err){
            s ? round() : JFunc( err );
        } );
    }
    //返回Promise，并开始执行
    return new Promise((S,J)=>{ SFunc = S; JFunc = J; round(); });
}
/*
* 输出到目标
* 如果目标目录不存在，则重新创建
* */
function outputTarget( getterList ){
    return new Promise(function (S,J) {
        fse.ensureDir( project.outputPath )
            .then( () => batchCall(getterList,"output") )
            .then( () => S() )
            .catch(( e )=>{
                logger.error( "output error!" );
                logger.error( e );
                J();
            });
    });
}
/*
* 开始编译
* */
function run(){
    let getterList = null;
    //初始化
    init()
        //批量获取类库
        .then( batchGetLib )
        .then( (gl) =>  getterList = gl )
        //复制文件到目标路径
        .then( () => outputTarget(getterList) )
        //执行类库任务流
        .then( execLibGulp  )
        //执行全局任务流
        .then( execGlobalGulp  )
        //输出成功
        .then(function(){
            logger.info('build done!');
        })
        //异常，报错
        .catch(function( e ){
            logger.error(`build error! exit!`);
            e ? logger.error( e ) : null;
        })
        //全部完成后，执行销毁操作
        .finally(function(){
            destroy();
        });
}
/*
* 监听退出事件，调用销毁函数
* */
process.on('SIGINT', function() {
    destroy(() => { process.exit() });
});
/*
* 编译入口
* */
module.exports = ( p )=> (project = p) && run();