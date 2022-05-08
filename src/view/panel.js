/*
 * @Author: atdow
 * @Date: 2022-05-04 21:59:49
 * @LastEditors: null
 * @LastEditTime: 2022-05-08 17:42:17
 * @Description: file description
 */
const testMode = false; // 为true时可以在浏览器打开不报错
// vscode webview 网页和普通网页的唯一区别：多了一个acquireVsCodeApi方法
const vscode = testMode ? {} : acquireVsCodeApi();
const callbacks = {};

/**
 * 调用vscode原生api
 * @param data 可以是类似 {cmd: 'xxx', param1: 'xxx'}，也可以直接是 cmd 字符串
 * @param cb 可选的回调函数
 */
function callVscode(data, cb) {
    if (typeof data === 'string') {
        data = { cmd: data };
    }
    if (cb) {
        // 时间戳加上5位随机数
        const cbid = Date.now() + '' + Math.round(Math.random() * 100000);
        callbacks[cbid] = cb;
        data.cbid = cbid;
    }
    vscode.postMessage(data);
}

window.addEventListener('message', event => {
    const message = event.data;
    // console.log("message:", message)
    switch (message.cmd) {
        case 'vscodeCallback':
            (callbacks[message.cbid] || function () { })(message.data);
            delete callbacks[message.cbid];
            break;
        case 'loading':
            vue.loading = false
            break;
        default: break;
    }
});

const vue = new Vue({
    el: '#app',
    data: {
        inputText: "",
        result: "",
        source: {
            label: "chinese",
            labelChinese: "中文",
            value: "zh"
        },
        option: [
            {
                label: "chinese",
                labelChinese: "中文",
                value: "zh"
            },
            {
                label: "english",
                labelChinese: "英文",
                value: "en"
            },
            {
                label: "russian",
                labelChinese: "俄语",
                value: "ru"
            },
            {
                label: "japanese",
                labelChinese: "日语",
                value: "jp"
            },
            {
                label: "spanish",
                labelChinese: "西班牙语",
                value: "spa"
            },
            {
                label: "italian",
                labelChinese: "意大利语",
                value: "it"
            },
            {
                label: "polish",
                labelChinese: "波兰语",
                value: "pl"
            },
            {
                label: "danish",
                labelChinese: "丹麦语",
                value: "dan"
            },
            {
                label: "romanian",
                labelChinese: "罗马尼亚语",
                value: "rom"
            },
            {
                label: "hungarian",
                labelChinese: "匈牙利语",
                value: "hu"
            }
        ],
        showSourceMenu: false,
        target: {
            label: "english",
            labelChinese: "英文",
            value: "en"
        },
        showTargetMenu: false,
        loading: false,
        isChina: false,
        placeholder: {
            english: 'please input what you want to translate',
            chinese: "请输入您需要翻译的内容"
        },
        translateBtnText: {
            english: "translate",
            chinese: "翻译"
        }
    },
    created() {
        const language = navigator.language;
        if (language === 'zh-CN') {
            this.isChina = true
        }
    },
    mounted() {

    },
    watch: {},
    methods: {
        translation() {
            const that = this
            this.result = ''
            this.loading = true
            callVscode({
                cmd: 'translation',
                queryParams: {
                    inputText: that.inputText,
                    from: that.source.value,
                    to: that.target.value,
                }
            }, (data) => {
                // console.log("data:", data)
                const result = data.trans_result || []
                if (result && result.length > 0) {
                    that.result = result[0].dst
                }
            });
            // vscode.window.showErrorMessage(`无法翻译，网络请求错误，code=${response.status}`);
        },
        changeSource(value) {
            this.source = value
            this.showSourceMenu = false
        },
        changeShowSourceMenu() {
            this.showSourceMenu = !this.showSourceMenu
        },
        changeTarget(value) {
            this.target = value
            this.showTargetMenu = false
        },
        changeShowTargetMenu() {
            this.showTargetMenu = !this.showTargetMenu
        },
        inputKeyDown(e) {
            var et = e || window.event;
            var keycode = et.charCode || et.keyCode;
            if (keycode == 13) {
                if (window.event) {
                    window.event.returnValue = false;
                } else {
                    e.preventDefault(); //for firefox
                }
                this.translation()
            }
        }
    }
});