/*
* LT3的编译工程
* */
module.exports = {
    /*
    * 需要编译出的类库
    * 如果为 * ，则编译所有
    * */
    librarys:{
        "jquery":{},
        "Vue":{},
        "lodash":{},
        "RequireJS":{},
        "animate":{},
        "layui":{},
        "js-cookie":{},
    },
    /*
    * 目标路径
    * 此路径相对于整个项目根路径
    * 如果不传入，默认为根目录的dist+项目名
    * */
    output: null,
    /*
    * 全局gulp任务
    * */
    gulp:[
        /*
        * 常用工具库 coreLib
        * 包含： jquery，lodash，RequireJS
        * */
        GLOBAL_GULP_TASK.mergeJs(
            ["@jquery/jquery.min.js","@lodash/lodash.min.js","@RequireJS/require.min.js"],
            "coreLib.full.min.js",
            "@projectOutputPath/coreLib/",
            "coreLib"
        )
    ]
};