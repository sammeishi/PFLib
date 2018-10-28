/*
* 资源下载器
* 可以下载npm，url，dir,github 4类
* 参数统一为：
* ( address,target,cb )  address 来源地址 target下载目标路径 cb完成后的回调
* cb( s,error ); s 下载是否成功 error 如果失败则失败的原因
* */
let E = module.exports = {};
E.npm = require('./npm');
E.url = require('./url');
E.gitClone = require('./gitClone');