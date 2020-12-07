<!--
 * @Author: json
 * @Date: 2020-05-27 23:03:31
 * @LastEditTime: 2020-06-05 18:04:06
 * @LastEditors: json
 * @Description: 我的
 * @FilePath: /smallprogram/src/pages/center/center.vue
--> 
<template>
    <view class="center df">
        <!-- <view class="cu-bar text-white bg-img"
            style="height:64px;width: 100%;padding-top:20px;background-image:url(../../../../static/bg.png)">
            <image class="center-bg gif-black"
                src="../../static/bg1.gif"></image>
        </view> -->
        <view class="logo df aic"
            @click="goLogin"
            :hover-class="!login ? 'logo-hover' : ''">
            <image class="logo-img neumorphism"
                :src="login ? uerInfo.avatarUrl :avatarUrl"></image>
            <view class="logo-title">
                <text class="uer-name">Hi，{{login ? uerInfo.name : '您未登录'}}</text>
            </view>
        </view>
        <view class="center-list neumorphism btn">
            <view class="center-list-item df jcb ">
                <text class="list-icon">&#xe667;</text>
                <text class="list-text">收藏图片</text>
                <text class="navigat-arrow">&#xe69b;</text>
            </view>
        </view>
        <view class="center-list neumorphism">
            <view class="center-list-item df jcb">
                <text class="list-icon">&#xe60c;</text>
                <text class="list-text">收藏图集</text>
                <text class="navigat-arrow">&#xe69b;</text>
            </view>
        </view>
        <view class="center-list neumorphism">
            <view class="center-list-item df jcb">
                <text class="list-icon">&#xe614;</text>
                <text class="list-text">管理图片</text>
                <text class="navigat-arrow">&#xe69b;</text>
            </view>
        </view>
        <view class="center-list neumorphism">
            <view class="center-list-item df jcb">
                <text class="list-icon">&#xe68f;</text>
                <text class="list-text">上传图片</text>
                <text class="navigat-arrow">&#xe69b;</text>
            </view>
        </view>
        <view class="center-list neumorphism">
            <view class="center-list-item df jcb"
                @click="goAbout">
                <text class="list-icon">&#xe650;</text>
                <text class="list-text">关于</text>
                <text class="navigat-arrow">&#xe69b;</text>
            </view>
        </view>
        <div style="position:fixed;bottom:0;width:100%;left:0;right:0;"
            class="cu-bar tabbar">
            <div class="action text-gray neumorphism btn">
                <div class="cuIcon-homefill"></div> 首页
            </div>
            <div class="action text-gray add-action btn">
                <button class="cu-btn cuIcon-add bg-green shadow"></button>
                发布
            </div>
            <div class="action text-gray neumorphism">
                <div class="cuIcon-my"></div>我的
            </div>
        </div>
    </view>
</template>

<script>
export default {
    data() {
        return {
            login: false,
            avatarUrl: "/static/logo.png",
            uerInfo: {}
        };
    },
    methods: {
        goLogin() {
            if (!this.login) {
                uni.navigateTo({
                    url: "/pages/login/login"
                });
            }
        },
        goAbout() {
            uni.navigateTo({
                url: "/pages/about/about"
            });
        }
    }
};
</script>


<style lang="scss" scoped>
    .title-bar {
        width: 100%;
    }
</style>