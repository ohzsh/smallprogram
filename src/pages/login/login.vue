<!--
 * @Author: json
 * @Date: 2020-05-27 23:03:31
 * @LastEditTime: 2020-06-01 14:53:30
 * @LastEditors: json
 * @Description: 登陆页面
 * @FilePath: /smallprogram/src/pages/login/login.vue
--> 
<template>
    <form class='loginView'
        @submit="login">
        <view class="input-view">
            <view class="label-view">
                <text class="label">账号 </text>
            </view>
            <input class="input"
                type="text"
                placeholder="请输入用户名"
                name="nameValue" />
        </view>
        <view class="input-view">
            <view class="label-view">
                <text class="label">密码</text>
            </view>
            <input class="input"
                type="password"
                placeholder="请输入密码"
                name="passwordValue" />
        </view>
        <view class="button-view">
            <button type="default"
                class="login"
                hover-class="hover"
                formType="submit">登录</button>
            <button type="default"
                class="register"
                hover-class="hover"
                @click="register">免费注册</button>
        </view>
    </form>
</template>

<script>
// 获取数据库引用
const db = wx.cloud.database()
const userListDB = db.collection('look_img_login')
export default {
    data() {
        return {}
    },
    methods: {
        login(e) {
            console.log(
                '得到账号:' +
                    e.detail.value.nameValue +
                    ';得到密码:' +
                    e.detail.value.passwordValue,
            )
            userListDB.doc('_openid').set({
                data: {
                    name: e.detail.value.nameValue,
                    password: e.detail.value.passwordValue,
                },
            })
        },
        register() {
            console.log('前往注册页面')
        },
    },
}
</script>

<style>
</style>
