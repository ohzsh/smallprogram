import Vue from "vue";
import App from "./App";
import * as util from "./utils"; // 自定义工具函数
import request from "./api/request"; // 自定义请求封装

Vue.config.productionTip = false;
App.mpType = "app";
/* 自定义请求封装 */
Vue.prototype.$request = request;

/* 常用工具函数 */
Vue.prototype.$util = util;

const app = new Vue(App);
app.$mount();
