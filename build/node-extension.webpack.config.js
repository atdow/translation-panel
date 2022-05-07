/*
 * @Author: atdow
 * @Date: 2022-05-06 23:46:00
 * @LastEditors: null
 * @LastEditTime: 2022-05-07 20:31:53
 * @Description: file description
 */
//@ts-check

'use strict';

const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

    entry: './extension.js', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    output: {
        // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        // path: path.resolve(__dirname, '..', 'dist'),
        path: path.resolve(__dirname, '..'),
        filename: 'extension.min.js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: 'source-map',
    externals: {
        vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    },
    resolve: {
        // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: ['.js']
    },
    module: {
        rules: [
            // {
            //     test: /\.ts$/,
            //     exclude: /node_modules/,
            //     use: [
            //         {
            //             loader: 'ts-loader'
            //         }
            //     ]
            // }
        ]
    }
};
module.exports = config;