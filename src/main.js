/*
 * @Author: json
 * @Date: 2020-05-04 18:33:25
 * @LastEditTime: 2020-06-08 15:43:36
 * @LastEditors: json
 * @Description:入口文件
 * @FilePath: /smallprogram/src/main.js
 */

import Vue from "vue";
import App from "./App";
import mixin from "./mixin";
import cuCustom from "./colorui/components/cu-custom.vue";
Vue.component("cu-custom", cuCustom);
Vue.config.productionTip = false;
Vue.prototype.$serverUrl = "https://unidemo.dcloud.net.cn";
App.mpType = "app";
Vue.mixin(mixin);
const app = new Vue({
  ...App
});
app.$mount();
