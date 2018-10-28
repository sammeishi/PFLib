/*
* 所有支持的前端资源定义
* */
/*
* 单个类库结构
* */
const library = {
    "latest":{//以版本号为子对象
        source: {//获取来源, 支持npm:name  url:http://xx  dir:c:/window/xxx
            protocol: "npm", //来源协议
            address: "jquery" //来源地址
        },
        files: "*.*", //真正有效的文件，只有此glob匹配的文件会被复制
        RequireJS:{ //RequireJS相关配置
            shim: {},
        },
    }
};
/*
* 类库定义列表
* */
module.exports = {
    "test":{
        "latest":{
            source:{
                protocol:"github",
                address:"vuejs/vue"
            }
        }
    },
    "jquery":{
        "latest":{
            source:{
                protocol: "npm", //来源协议
                address: "jquery" //来源地址
            },
            sourceConf:{},
            files: "dist/**/*",
            RequireJS:{
                shim:{
                    exports:"$"
                }
            }
        }
    },
    "Vue":{
        "latest":{
            source:{
                protocol: "npm", //来源协议
                address: "vue" //来源地址
            },
            files: "dist/**/*"
        }
    },
    "lodash":{
        "latest":{
            source:{
                protocol:"npm",
                address:"lodash"
            },
            files: ["lodash.js","lodash.min.js"]
        }
    },
    "RequireJS":{
        "latest":{
            source:{
                protocol:"npm",
                address:"requirejs"
            },
            files: "*.js",
            //压缩主文件
            gulp:LIB_GULP_TASK.minifyJs( "*.js" )
        }
    },
    "layui":{
        "latest":{
            source:{
                protocol:"gitClone",
                address:"https://gitee.com/sentsin/layui.git"
            },
            files: "dist/**/*"
        }
    },
    "js-cookie":{
        "latest":{
            source:{
                protocol:"npm",
                address:"js-cookie"
            },
            files:"src/**/*",
            //压缩主文件
            gulp:LIB_GULP_TASK.minifyJs( "*.js" )
        }
    },
    "animate":{
        "latest":{
            source:{
                protocol:"url",
                address:"https://raw.githubusercontent.com/daneden/animate.css/master/animate.css"
            },
            files: "**/*",
            //压缩主文件
            gulp:LIB_GULP_TASK.minifyCss( "*.css" )
        }
    },
};