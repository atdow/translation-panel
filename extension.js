/*
 * @Author: atdow
 * @Date: 2022-05-04 21:28:49
 * @LastEditors: null
 * @LastEditTime: 2022-05-09 00:05:48
 * @Description: file description
 */
const vscode = require('vscode');
const fs = require('fs');
const util = require('./src/util');
const path = require('path');

const axios = require("axios")
const uuidv4 = require("uuid")
const Md5 = require("md5")


/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 * 
 * panel.webview.html = getWebViewContent(context, 'src/view/test-webview.html')
 */
function getWebViewContent(context, templatePath) {
    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
}

/**
 * 执行回调函数
 * @param {*} panel 
 * @param {*} message 
 * @param {*} resp 
 */
function invokeCallback(panel, message, resp) {
    // console.log('回调消息：', resp);
    // // 错误码在400-600之间的，默认弹出错误提示
    // if (typeof resp == 'object' && resp.code && resp.code >= 400 && resp.code < 600) {
    //     util.showError(resp.message || '发生未知错误！');
    // }
    panel.webview.postMessage({ cmd: 'vscodeCallback', cbid: message.cbid, data: resp });
}

/**
 * 存放所有消息回调函数，根据 message.cmd 来决定调用哪个方法
 */
const messageHandler = {
    translation(global, message) {
        const {
            inputText = "",
            from = "",
            to = "",
        } = message.queryParams
        // let appId = vscode.workspace.getConfiguration().get < string > ("translation.baidu.appId");
        // let appKey = vscode.workspace.getConfiguration().get < string > ("translation.baidu.appKey");
        let appId = '20220505001204018'
        let appKey = 'iTQzl__y2EL_sq3iaDmy'

        const baseUrl = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
        const salt = uuidv4.v4();
        const sign = Md5(appId + inputText + salt + appKey).toString()
        const queryParams = {
            q: inputText,
            from: from,
            to: to,
            appid: appId,
            salt: salt,
            sign: sign
        }

        axios({
            method: 'post',
            url: baseUrl,
            params: queryParams
        }).then(res => {
            invokeCallback(global.panel, message, res.data);
        }).catch(err => {

        }).finally(() => {
            global.panel.webview.postMessage({ cmd: 'loading' });
        })
    }
};

function activate(context) {
    console.log("translation panel activated")
    context.subscriptions.push(vscode.commands.registerCommand('extension.translationPanel.open', (uri) => {
        vscode.commands.executeCommand("extension.demo.showPanel")
    }));

    context.subscriptions.push(vscode.commands.registerCommand("extension.demo.showPanel", function (uri) {
        const panel = vscode.window.createWebviewPanel(
            "translationPanel", // viewType
            "translation panel", // title
            vscode.ViewColumn.One, // position
            {
                enableScripts: true,
                retainContextWhenHidden: true // webview被隐藏时保持状态，避免被重置
            }
        )
        let global = { panel }
        panel.webview.html = getWebViewContent(context, 'src/view/panel.html')
        panel.webview.onDidReceiveMessage(message => {
            if (messageHandler[message.cmd]) {
                messageHandler[message.cmd](global, message)
            } else {
                util.showError(`未找到名为${message.cmd}回调方法！`)
            }
        }, undefined, context.subscriptions)
    }))
    // vscode.commands.executeCommand("extension.demo.showPanel")
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
