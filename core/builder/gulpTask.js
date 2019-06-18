/*
 * 预定义的gulp任务
 * 定义在全局空间内
 * */
let $$ = global,
    _ = require("lodash"),
    currProject = null; //当前工程配置

/**
 * 导出到全局空间的gulp任务创建函数，用于工程js文件直接调用
 */
$$.LIB_GULP_TASK = {}; //类库自身gulp任务,仅能在此类库所有文件内操作
$$.GLOBAL_GULP_TASK = {}; //工程全局gulp任务
/**
 * 创建全局变量，用于字符串中替换使用
 * 每个变量使用需要前缀标识@
 * @全局变量列表
 *  1：@类库名
 *      每个类库名都代表其下载后并输出所在路径。如 @jquery
 *  2：@projectOutputPath
 *      项目输出根路径
 */
function getGlobalVars() {
    let vars = {};
    //每个lib路径
    _.forEach(currProject.libraries, function (lib) {
        vars[lib.name] = lib.getter.outputPath;
    });
    //项目输出路径
    vars.projectOutputPath = currProject.outputPath;
    return vars;
}
/**
 * 对一个字符串进行变量替换，即使用带入的变量。
 * 带入变量需要用@标识
 * @param input  str     要替换的字符串
 * @param input  array   要替换的数组，数组每个项都是要替换的字符串
 */
function useGlobalVars(input) {
    const vars = getGlobalVars();
    let mark = "@";
    let strList = _.isArray(input) ? input : [input];
    //循环替换数组每一个
    for (let key in strList) {
        if (strList.hasOwnProperty(key)) {
            _.forEach(vars, function (v, k) {
                strList[key] = strList[key].replace(new RegExp(mark + k, "g"), v);
            });
        }
    }
    return _.isArray(input) ? strList : strList[0];
}
/*
 * 类库任务
 * */
/**
 * 压缩指定js文件,输出同目录，后缀min
 * @必须指定文件名
 *  不能模糊匹配文件！！
 */
LIB_GULP_TASK.minifyJs = function (files) {
    return function () {
        this.logger.info(`minifyJs lib:${this.currLib.name}`);
        let finalFiles = [];
        let libPath = this.currLib.outputPath;
        _.forEach(_.isArray(files) ? files : [files], function (file) {
            finalFiles.push(libPath + "/" + file);
        });
        return this.gulp
            .src(finalFiles)
            .pipe(this.plugins.rename({ suffix: ".min" }))
            .pipe(this.plugins.uglify())
            .pipe(this.gulp.dest(this.currLib.path));
    };
};
/**
 * 压缩指定css文件
 * 输出同目录，后缀min
 * @必须指定文件名
 *  不能模糊匹配文件！
 */
LIB_GULP_TASK.minifyCss = function (files) {
    return function () {
        this.logger.info(`minifyCss lib:${this.currLib.name}`);
        let finalFiles = [];
        let libPath = this.currLib.outputPath;
        _.forEach(_.isArray(files) ? files : [files], function (file) {
            finalFiles.push(libPath + "/" + file);
        });
        return this.gulp
            .src(finalFiles)
            .pipe(this.plugins.rename({ suffix: ".min" }))
            .pipe(this.plugins.minifyCss())
            .pipe(this.gulp.dest(this.currLib.path));
    };
};
/**
 * ====================================
 * 全局gulp任务
 * ====================================
 */
/**
 * 合并并压缩指定的js文件
 * @可使用变量
 *  文件列表，保存路径，msg均可带入全局变量
 * @param   array,strintg   files       要压缩的文件，必须精确指定文件不能匹配！ 可批量传入
 * @param   strintg         saveName    保存的文件名
 * @param   strintg         savePath    保存的路径
 * @param   strintg         msg         执行时输出路径
 */
GLOBAL_GULP_TASK.mergeJs = function (files, saveName, savePath, msg) {
    return function () {
        this.logger.info(`global mergeJs ${msg ? ": " + useGlobalVars(msg) : ""}`);
        return this.gulp
            .src(useGlobalVars(files))
            .pipe(this.plugins.concat(saveName))
            .pipe(this.plugins.uglify())
            .pipe(this.gulp.dest(useGlobalVars(savePath)));
    };
};
/**
 * 导出模块接口：
 *   更新当前工程配置，用于查找这些工程内类库生成全局变量
 */
module.exports = { 
    setProject: p => (currProject = p) 
};
