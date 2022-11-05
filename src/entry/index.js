/*
 * @Author: atdow
 * @Date: 2022-10-28 22:40:04
 * @LastEditors: null
 * @LastEditTime: 2022-10-29 01:17:41
 * @Description: file description
 */
import Vue from 'vue'
import App from './App.vue'


let vm = new Vue({
    render: h => h(App)
}).$mount('#app')

export default vm