/*
* github下载器
* */
const gitDownload = require('download-git-repo');
const _ = require("lodash");
const sourceInit = {};

module.exports = function( source,target,cb ){
    source = _.merge({},sourceInit,source);
    gitDownload( source.address,target,function( err ){
        err ? cb( false,err.statusMessage ) : cb( true );
    });
};