/*
* 预定义的gulp任务
* 定义在全局空间内
* */
let $$ = global;
let _ = require('lodash');
let currProject = null; //当前工程配置
$$.LIB_GULP_TASK = {};
$$.GLOBAL_GULP_TASK = {};
/*
* 获取全局变量
* 1: 每个lib路径， 以lib名称命名
* 2：output 项目输出路径
* */
function getGlobalVars(){
    let vars = {};
    //每个lib路径
    _.forEach( currProject.librarys,function( lib ){
        vars[ lib.name ] = lib.getter.outputPath;
    } );
    //项目输出路径
    vars.projectOutputPath = currProject.outputPath;
    return vars;
}
/*
* 对一个字符串进行替换全局变量
* 全局变量开头是@标识
* @param input  str     要替换的字符串
* @param input  array   要替换的数组，数组每个项都是要替换的字符串
* */
function useGlobalVars( input ){
    const vars = getGlobalVars();
    let mark = "@";
    let strList = _.isArray( input ) ? input : [ input ];
    //循环替换数组每一个
    for(let key in strList){
        if( strList.hasOwnProperty( key ) ){
            _.forEach(vars,function( v,k ){
                strList[ key ] = strList[key].replace( new RegExp( mark + k,"g" ),v );
            })
        }
    }
    return _.isArray(input) ? strList : strList[0];
}
/*
* 类库任务
* */
/*
* 压缩js
* */
LIB_GULP_TASK.minifyJs = function( files ){
    return function(){
        this.logger.info(`minifyJs lib:${this.currLib.name}`);
        let finalFiles = [];
        let libPath = this.currLib.outputPath;
        _.forEach(_.isArray( files ) ? files : [files],function( file ){
            finalFiles.push( libPath + "/" + file )
        });
        return this.gulp.src(finalFiles)
            .pipe(this.plugins.rename({suffix: '.min'}))
            .pipe(this.plugins.uglify())
            .pipe(this.gulp.dest( this.currLib.path ));
    }
};
/*
* 压缩CSS
* */
LIB_GULP_TASK.minifyCss = function( files ){
    return function(){
        this.logger.info(`minifyCss lib:${this.currLib.name}`);
        let finalFiles = [];
        let libPath = this.currLib.outputPath;
        _.forEach(_.isArray( files ) ? files : [files],function( file ){
            finalFiles.push( libPath + "/" + file )
        });
        return this.gulp.src(finalFiles)
            .pipe(this.plugins.rename({suffix: '.min'}))
            .pipe(this.plugins.minifyCss())
            .pipe(this.gulp.dest( this.currLib.path ));
    }
};


/*
* 全局任务
* */
/*
* 合并js
* */
GLOBAL_GULP_TASK.mergeJs = function( files,saveName,savePath,msg ){
    return function(){
        this.logger.info(`global mergeJs ${msg ? ": " + useGlobalVars(msg) : ""}`);
        return this.gulp.src( useGlobalVars( files ) )
            .pipe(this.plugins.concat(saveName))
            .pipe(this.plugins.uglify())
            .pipe(this.gulp.dest( useGlobalVars(savePath) ));
    }
};
/*
* 更新project
* */
module.exports = { setProject:(p) => currProject = p };