/*
* gitClone下载器
* 对于大工程项目，慎用此。因为git clone会将项目各个分支全部都下载下来，文件会非常多。
* 如果网络通畅，请使用github协议
* */
const gitClone = require('git-clone');
const getRepoInfo = require('git-repo-info');
const _ = require("lodash");
const sourceInit = {
};

module.exports = function( source,target,cb ){
    let that = this;
    source = _.merge({},sourceInit,source);
    gitClone( source.address,target,function( err ){
        //输出版本信息
        if( !err ){
            let repoInfo = getRepoInfo( target );
            if( _.has(repoInfo,"lastTag") ){
                that.logger.info( repoInfo['lastTag'] );
            }
        }
        err ? cb( false,err ) : cb( true );
    } );
};