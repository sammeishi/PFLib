# 前端公共库 v2.0.0
### 提供前端常用库的下载/更新，二次修改（合并，压缩）。下载协议支持git，http，npm方式。

# 更新历史
### 2019年6月18日
 * 添加npm全局命令pflib，可在任意位置执行,提前先在pflib目录执行 npm link
 * package.json的版本号规范化
 * 命名：工程所在路径 PROJECT_PATH，即工程文件所在路径
 * 默认所有输入输出路径都在PROJECT_PATH下。除非手动指定绝对路径！
### 2019年6月18日
 * 美化代码
 * 不传入工程文件，默认查找命令行当前路径下pflib.conf.js
 * 工程的outputPath默认为CWD，如果不指定的话
 * 编译器任何输入输出的路径均在outputPath目录内
### 2019年6月18日
 * 美化代码
 * 加入默认工程文件查找
 * 更改拼写librarys -> libraries
 * 重命名顶层librarys.js为库定义 lib.define.js

# 依赖
    1. gulp 3.x
    2. nodejs

# 运行流程
1. 命令行启动，传入目标工程文件（nodejs模块）
2. 加载工程文件。如果不传入查找当前目录 .pflib 文件
3. 下载工程配置文件中的所有类库。
4. 输出类库文件到目标
5. 运行每个类库的gulp任务流（如压缩文件）。
6. 运行全局的gulp任务流(如合并)。
7. 清理临时文件。

# 使用方式
    非全局命令，在PFLib目录内
        node index.js -p 工程配置文件 -o 输出路径
    全局命令,实现npm link
        pflib -p 工程配置文件 -o 输出路径

# outputPath
    文件最终输出的路径
    不指定默认为: project文件所在路径
    可参数 -o 指定, 如果含有相对路径，是相对于CWD

# 工作路径
    编译期间任何输入输出的路径均在outputPath目录内