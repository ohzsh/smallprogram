<!--
 * @Author: json
 * @Date: 2020-05-27 23:03:31
 * @LastEditTime: 2020-06-22 15:40:53
 * @LastEditors: json
 * @Description: 群聊
 * @FilePath: /smallprogram/src/pages/list/list.vue
--> 
<template>
    <view class="container"
        :style="containerStyle">
        <cu-custom bgColor="bg-gradual-pink"
            :isBack="!isShow">
            <view slot="backText">返回</view>
            <view slot="content">{{chatRoomGroupName || '聊天室'}}</view>
        </cu-custom>
        <view v-show="isShow"
            class="center df main">
            <view class="logo df aic"
                :hover-class="!userInfo.nickName ? 'logo-hover' : ''">
                <image class="logo-img neumorphism"
                    :src="avatarUrl"></image>
                <view class="logo-title">
                    <text class="uer-name">Hi，{{userInfo.nickName ? userInfo.nickName : '您未登录'}}</text>
                </view>
            </view>
            <view class="center-list neumorphism btn">
                <view class="center-list-item df jcb "
                    @click="handleCreatGroup">
                    <text class="list-icon">&#xe667;</text>
                    <text class="list-text">创建群</text>
                    <text class="navigat-arrow">&#xe69b;</text>
                </view>
            </view>
            <view class="center-list neumorphism">
                <button class="center-list-item df jcb clearBtn"
                    open-type="getUserInfo"
                    @getuserinfo="handleMyGroup">
                    <text class="list-icon">&#xe60c;</text>
                    <text class="list-text">我的群</text>
                    <text class="navigat-arrow">&#xe69b;</text>
                </button>
            </view>
            <view class="center-list neumorphism">
                <view class="center-list-item df jcb"
                    @click="modalName = true">
                    <text class="list-icon">&#xe614;</text>
                    <text class="list-text">加入群</text>
                    <text class="navigat-arrow">&#xe69b;</text>
                </view>
            </view>
            <view class="center-list neumorphism">
                <view class="center-list-item df jcb"
                    @click="handleShowMyLikeGroup">
                    <text class="list-icon">&#xe68f;</text>
                    <text class="list-text">收藏群</text>
                    <text class="navigat-arrow">&#xe69b;</text>
                </view>
            </view>
        </view>
        <chat-room v-if="joinGroup"
            style="width: 100%; height: 100%"
            :envId="chatRoomEnvId"
            :collection="chatRoomCollection"
            :groupId="chatRoomGroupId"
            :groupName="chatRoomGroupName"
            :userInfo="userInfo"
            :getOpenID="getOpenID" />
        <!-- 收藏组件 -->
        <like-group v-if="!joinGroup && likeGroupList.length"
            :list="likeGroupList"
            @openChatRoom="onQueryGroupInfo"></like-group>
        <!-- 密码弹窗 -->
        <view class="cu-modal"
            :class="modalName?'show':''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">提示</view>
                </view>
                <view>
                    <view v-if="userInfo"
                        class="cu-form-group">
                        <input v-model="password"
                            password
                            :focus="modalName"
                            placeholder="请输入密码" />
                    </view>
                    <view v-else
                        class="cu-form-group jcc">
                        <view>请先登录后参与聊天</view>
                    </view>
                </view>
                <view class="cu-bar bg-white justify-around">
                    <view class="action">
                        <button class="cu-btn line-green text-green"
                            @click="modalName = false">取消</button>
                        <button v-if="userInfo"
                            class="cu-btn bg-green margin-left"
                            @click="handleUserJoinGroup">确定</button>
                        <button v-else
                            open-type="getUserInfo"
                            @getuserinfo="onGetUserInfo"
                            class="cu-btn bg-green margin-left">确定</button>
                    </view>
                </view>
            </view>
        </view>
        <!-- 创建群 -->
        <view class="cu-modal"
            :class="isCreatGroup?'show':''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">提示</view>
                </view>
                <view class="cu-form-group">
                    <view class="title">群名</view>
                    <input v-model="query.groupName"
                        placeholder="请输入群名" />
                </view>
                <view class="cu-form-group">
                    <view class="title">密码</view>
                    <input v-model="query.passWord"
                        password
                        placeholder="请输入密码" />
                </view>
                <view class="cu-bar bg-white justify-around">
                    <view class="action">
                        <button class="cu-btn line-green text-green"
                            @click="isCreatGroup = false">取消</button>
                        <button class="cu-btn bg-green margin-left"
                            @click="handleSubmitGroupData">确定</button>
                    </view>
                </view>
            </view>
        </view>
    </view>

</template>

<script>
import chatRoom from "../../common/chatroom/chatroom";
import likeGroup from "@/common/likegroup/LikeGroup";
export default {
    components: {
        chatRoom,
        likeGroup
    },
    data() {
        return {
            joinGroup: false,
            avatarUrl: "/static/logo.png",
            userInfo: null,
            logged: false,
            chatRoomEnvId: "", //当前环境
            chatRoomCollection: "", //集合名
            chatRoomGroupId: "", //房间id
            chatRoomGroupName: "", //房间名
            password: "", //群密码
            modalName: false,
            query: {},
            isCreatGroup: false,
            likeGroupList: []
            // functions for used in chatroom components
            // getOpenID: null
        };
    },
    async onLoad() {
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting["scope.userInfo"]) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            (this.avatarUrl = res.userInfo.avatarUrl),
                                (this.userInfo = res.userInfo);
                        }
                    });
                }
            }
        });

        wx.getSystemInfo({
            success: res => {
                console.log("system info", res);
                if (res.safeArea) {
                    const { top, bottom } = res.safeArea;
                    this.containerStyle = `padding-top: ${(/ios/i.test(
                        res.system
                    )
                        ? 10
                        : 20) + top}px; padding-bottom: ${20 +
                        res.windowHeight -
                        bottom}px`;
                }
            }
        });
    },
    watch: {
        modalName(val) {
            if (val) return;
            this.password = "";
        }
    },
    computed: {
        isShow() {
            return !this.joinGroup && !this.likeGroupList.length;
        }
    },
    methods: {
        async getOpenID() {
            if (this.openid) {
                return this.openid;
            }

            const { result } = await wx.cloud.callFunction({
                name: "login"
            });
            return result.openid;
        },
        /**
         * @description: 查询当前用户是否创建群组 & 加群
         * @param {Object} parmse 加入别人群需要输入密码
         * @return: null
         */
        async onQueryGroupInfo(parmse) {
            const db = wx.cloud.database();
            let [err, openid] = await this.try(this.getOpenID);
            if (err) return;
            // 查询当前用户所有的 group_info
            console.log(parmse, "parmse");
            db.collection("group_info")
                .where(
                    parmse || {
                        _openid: openid
                    }
                )
                .get({
                    success: res => {
                        let data = res.data;
                        if (!data.length)
                            return this.showToast("你还没有群，快去创建吧！");
                        let {
                            groupName,
                            groupId,
                            chatRoomCollection
                        } = data[0];
                        this.chatRoomCollection = chatRoomCollection;
                        this.chatRoomGroupName = groupName;
                        this.chatRoomGroupId = groupId;
                        this.joinGroup = true;
                    },
                    fail: err => {
                        this.showToast("查询记录失败");
                        console.error("[数据库] [查询记录] 失败：", err);
                    }
                });
        },
        /**
         * @description: 创建群组
         * @param {type}
         * @return: null
         */
        onAdd({ groupName, passWord }) {
            if (!(groupName && passWord))
                return this.showToast("群名或密码不能为空！");
            const db = wx.cloud.database();
            const groupId = `${Math.random()}_${Date.now()}`;
            db.collection("group_info").add({
                data: {
                    chatRoomCollection: "chatroom",
                    envId: "yun-development-r7n89",
                    groupName: groupName,
                    passWord: passWord,
                    groupId
                },
                success: res => {
                    // 在返回结果中会包含新创建的记录的 _id
                    this.showToast("创建成功, 快快加入吧！");
                },
                fail: err => {
                    wx.showToast({
                        icon: "none",
                        title: ""
                    });
                    this.showToast("创建失败！");
                    console.error("[数据库] [新增记录] 失败：", err);
                }
            });
            this.query = {};
        },
        /**
         * @description: 加群
         * @param {type}
         * @return: null
         */
        handleUserJoinGroup() {
            if (!this.password) return this.showToast("密码不能为空");
            this.modalName = false;
            this.onQueryGroupInfo({ passWord: this.password });
        },
        /**
         * @description: 我的群
         * @param {type}
         * @return: null
         */
        handleMyGroup(e) {
            console.log(e, "eee");
            if (!e.detail.userInfo) return;
            this.userInfo && this.onGetUserInfo(e);
            this.onQueryGroupInfo();
        },
        /**
         * @description: 创建群
         * @param {type}
         * @return: null
         */
        async handleCreatGroup() {
            const db = wx.cloud.database();
            let [err, openid] = await this.try(this.getOpenID);
            if (err) return;
            let { data } = await db
                .collection("group_info")
                .where({
                    _openid: openid
                })
                .get();
            if (data.length) return this.showToast("抱歉，你已经有群了哦！");
            this.isCreatGroup = true;
        },
        /**
         * @description: 提交群信息
         * @param {type}
         * @return: null
         */
        handleSubmitGroupData() {
            this.onAdd(this.query);
            this.isCreatGroup = false;
        },
        /**
         * @description: 是否有收藏的群
         * @param {type}
         * @return:null
         */
        async handleShowMyLikeGroup() {
            const db = this.getDB("like_group_list");
            let { data } = await db.where({ flag: true }).get();
            if (!data.length) return this.showToast("你还没有收藏过群组哦！😯");
            this.likeGroupList = data;
            this.chatRoomGroupName = "我的收藏";
        },
        /**
         * @description: 用户授权
         * @param {type}
         * @return: null
         */
        onGetUserInfo(e) {
            console.log(e, "用户授权");
            if (!this.logged && e.detail.userInfo) {
                this.logged = true;
                this.avatarUrl = e.detail.userInfo.avatarUrl;
                this.userInfo = e.detail.userInfo;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    .container {
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .main {
        }
    }
</style>