/*
* 获取指定的类类库,并复制主要文件到library目录内
* workItem 每一个需要处理的类库
* workItem{
*   type 下载类型
*   name 类库名称
*   files 主要文件
*   version 文件版本
*   path 存储目录
* }
* */
const fse = require('fs-extra');
const cpx = require("cpx");
const downloader = require('./downloader');
const _ = require('lodash');
const loggerFactory = require('log4js');
/*
* 获取器
* 用于获取一个类库
* */
class getter{
    constructor( lib,tmpRoot,output ){
        this.logger = loggerFactory.getLogger(`getter:${lib.name}`);
        this.logger.level = 'debug';
        this.lib = lib; //需要获取的类库配置
        this.tmpPath = tmpRoot + this.lib.name; //保存目录
        this.outputPath = output; //目标路径
        this.isGet = false; //是否获取成功
    }
    /*
    * 初始化
    * 创建临时目录
    * */
    init(){
        //创建保存目录
        return fse.ensureDir( this.tmpPath );
    }
    /*
    * 解析来源协议，并使用下载器下载
    * */
    download(){
        let source = this.lib.source;
        let tmpPath = this.tmpPath;
        let that = this;
        return new Promise(function( S,J ){
            //如果已经下载到，则直接返回
            if( that.isGet ){
                return S();
            }
            //协议不支持
            if( !source || !_.has( downloader,source.protocol ) ){
                return J( `unknow protocol: ${source.protocol}!` );
            }
            else{
                that.logger.info(`start download ${source.address}`);
                let downloadFunc = downloader[ source.protocol ].bind( that );
                downloadFunc( source,tmpPath,function( status,error ){
                    if( status ){
                        that.isGet = true;
                        return S();
                    }
                    else{
                        return J( error );
                    }
                } );
            }
        });
    }
    /*
    * 提取有效的文件到指定路径
    * */
    output( cb ){
        let files = [];
        let that = this;
        let index = 0;
        _.forEach( _.isArray( this.lib.files ) ? this.lib.files : [ this.lib.files ],( one )=>{
            files.push(  this.tmpPath + "/" + (one || "**/*") );
        });
        /*
        * 分次执行
        * 复制到目标，会将目标清空
        * */
        function round(){
            if( index >= files.length ){
                return cb( true );
            }
            let f = files[ index++ ];
            cpx.copy( f,that.outputPath,{ clean : true },function( err ){
                err ? that.logger.error("output error! ") : null;
                err ? cb( false,err ) : round();
            } );
        }
        round();
    }
    /*
    * 开始下载
    * */
    start( cb ){
        this.init()
            //下载
            .then( () => this.download() )
            //下载完成
            .then(() => {
                cb( true );
            })
            //发生错误
            .catch(( e ) => {
                this.logger.error( e );
                cb( false );
            });
    }
}
/*
* 导出获取器基类
* */
module.exports = getter;