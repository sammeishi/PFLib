/**
 * 工程文件demo
 * @输出路径
 *  如果不指定输出目标，则默认为 /dist/工程名
 */
module.exports = {
    libraries:{ //需要下载的库
        "Vue":{
            "gulp": LIB_GULP_TASK.minifyJs("vue.js") //gulp任务：压缩指定js文件
        },
        "jquery":{}
    },
    gulp:[ //gulp全局任务 合并类库为一个文件
        GLOBAL_GULP_TASK.mergeJs([ "@Vue/vue.js","@jquery/jquery.js" ],"all.min.js","@projectOutputPath/merge/")
    ]
};