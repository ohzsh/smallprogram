<!--
 * @Author: json
 * @Date: 2020-05-04 18:33:25
 * @LastEditTime: 2020-06-09 18:34:02
 * @LastEditors: json
 * @Description: 入口文件
 * @FilePath: /smallprogram/src/App.vue
--> 
<script>
import Vue from "vue";
export default {
    onLaunch: function() {
        uni.getSystemInfo({
            success: function(e) {
                // #ifndef MP
                Vue.prototype.StatusBar = e.statusBarHeight;
                if (e.platform == "android") {
                    Vue.prototype.CustomBar = e.statusBarHeight + 50;
                } else {
                    Vue.prototype.CustomBar = e.statusBarHeight + 45;
                }
                // #endif
                // #ifdef MP-WEIXIN
                Vue.prototype.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                Vue.prototype.Custom = custom;
                Vue.prototype.CustomBar =
                    custom.bottom + custom.top - e.statusBarHeight;
                // #endif
                // #ifdef MP-ALIPAY
                Vue.prototype.StatusBar = e.statusBarHeight;
                Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
                // #endif
            }
        });
        if (!wx.cloud) {
            console.error("请使用 2.2.3 或以上的基础库以使用云能力");
        } else {
            wx.cloud.init({
                env: "yun-development-r7n89",
                traceUser: true
            });
        }
    },
    onShow: function() {
        console.log("App Show");
    },
    onHide: function() {
        console.log("App Hide");
    }
};
</script>

<style lang="scss">
    /*每个页面公共css */
    @import "@/common/common.css";
    @import "colorui/main.css";
    @import "colorui/icon.css";
    @import "@/colorui/animation.css";
    @import "@/common/basicstyle.scss";
    @import "@/common/clackgood.scss";
    /* @import "common/basicstyle.scss"; */
    page {
        min-height: 100%;
        background-color: #efefef;
    }
    .scrollPage {
        height: 100vh;
    }

    .nav-list {
        display: flex;
        flex-wrap: wrap;
        // padding: 0px 40rpx 0px;
        justify-content: space-between;
    }

    .nav-li {
        padding: 30rpx;
        border-radius: 12rpx;
        width: 45%;
        margin: 0 2.5% 40rpx;
        // background-image: url(https://image.weilanwl.com/color2.0/cardBg.png);
        background-size: cover;
        background-position: center;
        position: relative;
        z-index: 1;
    }

    .nav-li::after {
        content: "";
        position: absolute;
        z-index: -1;
        background-color: inherit;
        width: 100%;
        height: 100%;
        left: 0;
        bottom: -10%;
        border-radius: 10rpx;
        opacity: 0.2;
        transform: scale(0.9, 0.9);
    }

    .nav-li.cur {
        color: #fff;
        background: rgb(94, 185, 94);
        box-shadow: 4rpx 4rpx 6rpx rgba(94, 185, 94, 0.4);
    }

    .nav-title {
        font-size: 32rpx;
        font-weight: 300;
    }

    .nav-title::first-letter {
        font-size: 40rpx;
        margin-right: 4rpx;
    }

    .nav-name {
        font-size: 28rpx;
        text-transform: Capitalize;
        margin-top: 20rpx;
        position: relative;
    }

    .nav-name::before {
        content: "";
        position: absolute;
        display: block;
        width: 40rpx;
        height: 6rpx;
        background: #fff;
        bottom: 0;
        right: 0;
        opacity: 0.5;
    }

    .nav-name::after {
        content: "";
        position: absolute;
        display: block;
        width: 100rpx;
        height: 1px;
        background: #fff;
        bottom: 0;
        right: 40rpx;
        opacity: 0.3;
    }

    .nav-name::first-letter {
        font-weight: bold;
        font-size: 36rpx;
        margin-right: 1px;
    }

    .nav-li text {
        position: absolute;
        right: 30rpx;
        top: 30rpx;
        font-size: 52rpx;
        width: 60rpx;
        height: 60rpx;
        text-align: center;
        line-height: 60rpx;
    }

    .text-light {
        font-weight: 300;
    }

    template {
        display: flex;
        flex: 1;
    }
</style>
