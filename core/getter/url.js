/*
* URL下载器
* */
const extract = require('extract-zip');
const download = require('download-file');
const _ = require("lodash");
const sourceInit = {
    timeout: 1000 * 15, //15秒超时
    extract: false, //是否解压缩
};

module.exports = function( source,target,cb ){
    source = _.merge({ directory:target },sourceInit,source);
    download( source.address, source,function( err,file ){
        if( err ){
            return cb( false,err );
        }
        else if( source.extract === false ){
            return cb( true );
        }
        else{
            extract(file, {dir: target}, function (err) {
                err ? cb(  false,err ) : cb( true );
            })
        }
    })
};