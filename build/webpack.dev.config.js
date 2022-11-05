/*
 * @Author: atdow
 * @Date: 2022-10-27 23:20:09
 * @LastEditors: null
 * @LastEditTime: 2022-10-29 01:25:13
 * @Description: file description
 */
const path = require('path')

// 1. 导入 html-webpack-plugin 这个插件，得到插件的构造函数
const HtmlPlugin = require('html-webpack-plugin')

// 注意：左侧的 { } 是解构赋值
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
// console.log('VueLoaderPlugin:', VueLoaderPlugin)

// const VueLoaderPlugin = require('vue-loader/lib/plugin');

// 使用 Node.js 中的导出语法，向外导出一个 webpack 的配置对象
module.exports = {
    // 在开发调试阶段，建议大家都把 devtool 的值设置为 eval-source-map
    // devtool: 'eval-source-map',
    // 在实际发布的时候，建议大家把 devtool 的值设置为 nosources-source-map 或直接关闭 SourceMap
    devtool: 'nosources-source-map',
    // mode 代表 webpack 运行的模式，可选值有两个 development 和 production
    // 结论：开发时候一定要用 development，因为追求的是打包的速度，而不是体积；
    // 反过来，发布上线的时候一定能要用 production，因为上线追求的是体积小，而不是打包速度快！
    mode: 'development',
    // entry: '指定要处理哪个文件'
    entry: path.join(__dirname, '../src/entry/index.js'),
    // 指定生成的文件要存放到哪里
    output: {
        // 存放的目录
        path: path.join(__dirname, 'dist'),
        // 生成的文件名
        filename: 'js/bundle.js'
    },
    // 3. 插件的数组，将来 webpack 在运行时，会加载并调用这些插件
    plugins: [
        new HtmlPlugin({
            // 指定要复制哪个页面
            template: './src/index.html',
            // 指定复制出来的文件名和存放路径
            filename: './src/view/panel2.html'
        }),
        new CleanWebpackPlugin(),
        new VueLoaderPlugin()
    ],
    devServer: {
        // 首次打包成功后，自动打开浏览器
        open: true,
        // 在 http 协议中，如果端口号是 80，则可以被省略
        port: 80,
        // 指定运行的主机地址
        host: '127.0.0.1'
    },
    module: {
        rules: [
            // {
            //     test: /\.m?js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: "babel-loader",
            //         options: {
            //             presets: ['@babel/preset-env']
            //         }
            //     }
            // },
            // 定义了不同模块对应的 loader
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            // 处理 .less 文件的 loader
            { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
            // 处理图片文件的 loader
            // 如果需要调用的 loader 只有一个，则只传递一个字符串也行，如果有多个loader，则必须指定数组
            // 在配置 url-loader 的时候，多个参数之间，使用 & 符号进行分隔
            { test: /\.jpg|png|gif$/, use: 'url-loader?limit=470&outputPath=images' },
            // 使用 babel-loader 处理高级的 JS 语法
            // 在配置 babel-loader 的时候，程序员只需要把自己的代码进行转换即可；一定要排除 node_modules 目录中的 JS 文件
            // 因为第三方包中的 JS 兼容性，不需要程序员关心
            { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader'
                }
            }
        ]
    },
    resolve: {
        alias: {
            // 告诉 webpack，程序员写的代码中，@ 符号表示 src 这一层目录
            '@': path.join(__dirname, './src/')
        }
    }
}