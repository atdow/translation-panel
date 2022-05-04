/*
 * @Author: atdow
 * @Date: 2022-05-04 21:59:49
 * @LastEditors: null
 * @LastEditTime: 2022-05-05 01:26:13
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
    switch (message.cmd) {
        case 'vscodeCallback':
            console.log(message.data);
            (callbacks[message.cbid] || function () { })(message.data);
            delete callbacks[message.cbid];
            break;
        default: break;
    }
});

new Vue({
    el: '#app',
    data: {
        inputText: "",
        result: "",
        source:{
            label:"chinese",
            value:"zh" 
        },
        option:[
            {
                label:"chinese",
                value:"zh"
            },
            {
                label:"english",
                value:"en"
            }
        ],
        showSourceMenu:false,
        target:{
            label:"english",
            value:"en" 
        },
        showTargetMenu: false,
    },
    mounted() {
       // callVscode('getProjectName', projectName => this.projectName = projectName);
    },
    watch: {
    },
    methods: {
        translation() {
            const that = this
            // let appId = vscode.workspace.getConfiguration().get < string > ("translation.baidu.appId");
            // let appKey = vscode.workspace.getConfiguration().get < string > ("translation.baidu.appKey");
            const query = this.inputText
            let appId = ''
            let appKey = 'appKey'
            if (!appId || !appKey) {
                appId = '20201210000643306';
                appKey = 'n3_scpwt0YR_tCY2wAfe';
            }
            const baseUrl = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
            // const salt = uuidv4();
            const salt = Math.random();
            const sign = Md5.hashStr(appId + query + salt + appKey).toString();

            const queryParams = {
                q: query,
                from: that.source.value,
                to: that.target.value,
                appid: appId,
                salt: salt,
                sign: sign
            };
            $.ajax({
                url: baseUrl,
                dataType:"jsonp",
                data:queryParams,
                success:function(msg){
                    console.log("msg:",msg)
                    const result = msg.trans_result || []
                    if(result && result.length>0){
                        that.result = result[0].dst
                    }
                    // vscode.window.showErrorMessage(`无法翻译，网络请求错误，code=${response.status}`);
                }
            })

        },
        changeSource(value){
            this.source = value
            this.showSourceMenu = false
        },
        changeShowSourceMenu(){
            this.showSourceMenu = !this.showSourceMenu
        },
        changeTarget(value){
            this.target = value
            this.showTargetMenu = false
        },
        changeShowTargetMenu(){
            this.showTargetMenu = !this.showTargetMenu
        },
        // 模拟alert
        alert(info) {
            callVscode({ cmd: 'alert', info: info }, null);
        },
        // 弹出错误提示
        error(info) {
            callVscode({ cmd: 'error', info: info }, null);
        },
        openFileInFinder() {
            callVscode({ cmd: 'openFileInFinder', path: `package.json` }, () => {
                this.alert('打开成功！');
            });
        },
        openFileInVscode() {
            callVscode({ cmd: 'openFileInVscode', path: `package.json` }, () => {
                this.alert('打开package.json成功！');
            });
        },
        openUrlInBrowser() {
            callVscode({ cmd: 'openUrlInBrowser', url: `https://artist.alibaba.com/` }, () => {
                this.alert('打开前端艺术家主页成功！');
            });
        }
    }
});