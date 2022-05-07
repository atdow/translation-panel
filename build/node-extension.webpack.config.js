/*
 * @Author: atdow
 * @Date: 2022-05-06 23:46:00
 * @LastEditors: null
 * @LastEditTime: 2022-05-08 00:14:24
 * @Description: file description
 */
'use strict';

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


/**@type {import('webpack').Configuration}*/
const config = {
    target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

    entry: './extension.js',
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'extension.min.js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: 'source-map',
    externals: {
        vscode: 'commonjs vscode'
    },
    resolve: {
        // extensions: ['.js']
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    module: {
        rules: []
    }
};
module.exports = config;