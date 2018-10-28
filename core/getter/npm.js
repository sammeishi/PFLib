/*
* npm下载器
* */
const pacote = require('pacote');

/*主函数*/
module.exports = function( source,target,cb ){
    let that = this;
    pacote.manifest( source.address )
        .then(pkg => that.logger.info(`version ${pkg.version}`) )
        .then( ()=> pacote.extract( source.address,target ) )
        .then( () =>  cb(true)  )
        .catch(( e ) => cb( false,e.message ) );
};