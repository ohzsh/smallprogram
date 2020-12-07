<!--
 * @Author: json
 * @Date: 2020-06-07 19:07:38
 * @LastEditTime: 2020-06-22 16:48:45
 * @LastEditors: json
 * @Description: 聊天室组件
 * @FilePath: /smallprogram/src/common/chatroom/chatroom.vue
--> 
<template>
    <view class="chatroom">
        <!-- chats -->
        <scroll-view class="body"
            scroll-y
            :scroll-with-animation="true"
            :scroll-top="scrollTop"
            :scroll-into-view="scrollToMessage"
            @scrolltoupper="onScrollToUpper">
            <view v-for="(item, index) in chats"
                :key="item._id"
                :id="`item-${index}`"
                :class="openId == item._openid ? 'message__self' : ''"
                class="message">
                <image class="avatar"
                    :src="item.avatar"
                    mode="scaleToFill"></image>
                <view class="main">
                    <view class="nickname">{{item.nickName}}</view>
                    <block v-if="item.msgType === 'image'">
                        <view class="image-wrapper">
                            <view class="loading"
                                v-if="item.writeStatus">{{item.writeStatus}}%</view>
                            <image :src="item.tempFilePath || item.imgFileID"
                                :data-fileid="item.tempFilePath || item.imgFileID"
                                class="image-content"
                                :style="item.imgStyle"
                                mode="scallToFill"
                                bindtap="onMessageImageTap"></image>
                        </view>
                    </block>
                    <block v-else>
                        <view class="text-wrapper">
                            <view class="loading"
                                v-if="item.writeStatus === 'pending'">···</view>
                            <view class="text-content">{{item.textContent}}</view>
                        </view>
                    </block>
                </view>
            </view>
        </scroll-view>

        <!-- message sender -->
        <view class="cu-bar foot input"
            :class="InputBottom!=0?'cur':''"
            :style="{bottom:`${InputBottom}px`}">
            <view @click='handleCollect'
                :class="['box', dianzan]"></view>
            <input class="solid-bottom"
                @focus="InputFocus"
                @blur="InputBlur"
                v-model="textInputValue"
                :adjust-position="false"
                :focus="false"
                maxlength="300"
                cursor-spacing="10" />
            <view class="action"
                @click="onChooseImage">
                <text class="cuIcon-add lg text-gray"></text>
            </view>
            <button class="cu-btn bg-green shadow"
                @click="onConfirmSendText">发送</button>
        </view>
    </view>
</template>

<script>
const FATAL_REBUILD_TOLERANCE = 10;
export default {
    props: {
        envId: String,
        collection: String,
        groupId: String,
        groupName: String,
        userInfo: Object,
        onGetUserInfo: Function,
        getOpenID: Function
    },
    data() {
        return {
            chats: [],
            textInputValue: "",
            openId: "",
            scrollTop: 0,
            scrollToMessage: "",
            InputBottom: 0,
            hasKeyboard: false,
            collect: false, //是否收藏群
            db: ""
        };
    },
    mounted() {
        this.initRoom();
        this.handleQueryIscollect();
        this.fatalRebuildCount = 0;
    },
    computed: {
        dianzan() {
            return this.collect ? "boxactive" : "";
        }
    },
    methods: {
        mergeCommonCriteria(criteria) {
            return {
                groupId: this.groupId,
                ...criteria
            };
        },
        /**
         * @description: 点击收藏
         * @param {type}
         * @return:
         */
        handleCollect() {
            this.collect = !this.collect;
            this.handleIscollect(this.collect);
        },
        /**
         * @description: 查询是否收藏
         * @param {type}
         * @return: null
         */
        async handleQueryIscollect() {
            let db = this.getDB("like_group_list");
            let { data } = await db
                .where({
                    _id: this.groupId
                })
                .get();
            if (!data.length) return;
            let { flag } = data[0];
            this.collect = flag;
        },
        /**
         * @description: 是否收藏
         * @param {type}
         * @return:
         */
        handleIscollect(val) {
            if (val) {
                this.showToast("进我的收藏夹吃灰吧！❤️");
                this.handleAddCollect(val);
            } else {
                this.showToast("不收藏下次找不到哦！😯");
                this.handleAddCollect(val);
            }
        },
        /**
         * @description: 更新收藏信息
         * @param {type}
         * @return: null
         */
        async handleAddCollect(flag) {
            let db = this.getDB("like_group_list");
            let noFirst = await this.handleFirstCollect();
            console.log(noFirst);
            if (noFirst) {
                db.doc(this.groupId).update({
                    data: {
                        flag
                    }
                });
            } else {
                this.handleAddLikeGroup();
            }
        },
        /**
         * @description: 新增收藏信息
         * @param {Object} obj : 群信息
         * @return: null
         */
        handleAddLikeGroup() {
            let db = this.getDB("like_group_list");
            db.add({
                data: {
                    _id: this.groupId,
                    groupName: this.groupName,
                    flag: true
                }
            });
        },
        /**
         * @description: 是否第一次收藏
         * @param {type}
         * @return:
         */
        async handleFirstCollect() {
            let db = this.getDB("like_group_list");
            let { total } = await new Promise((resolve, reject) => {
                db.where({
                    _id: this.groupId
                })
                    .count()
                    .then(res => {
                        resolve(res);
                    });
            });
            return total;
        },
        InputFocus(e) {
            this.InputBottom = e.detail.height;
        },
        InputBlur(e) {
            this.InputBottom = 0;
        },
        async initRoom() {
            this.try(async () => {
                await this.initOpenID();

                const { envId, collection } = this;
                console.log(envId, collection, "envId");
                const db = (this.db = wx.cloud.database({
                    env: envId
                }));
                const _ = db.command;

                const { data: initList } = await db
                    .collection(collection)
                    .where(this.mergeCommonCriteria())
                    .orderBy("sendTimeTS", "desc")
                    .get();

                console.log("init query chats", initList);

                this.chats = initList.reverse();
                this.scrollToBottom();
                this.initWatch(
                    initList.length
                        ? {
                              sendTimeTS: _.gt(
                                  initList[initList.length - 1].sendTimeTS
                              )
                          }
                        : {}
                );
            }, "初始化失败");
        },

        async initOpenID() {
            return this.try(async () => {
                const openId = await this.getOpenID();

                this.openId = openId;
            }, "初始化 openId 失败");
        },

        async initWatch(criteria) {
            this.try(() => {
                const { collection } = this;
                const db = this.db;
                const _ = db.command;

                console.warn(`开始监听`, criteria);
                this.messageListener = db
                    .collection(collection)
                    .where(this.mergeCommonCriteria(criteria))
                    .watch({
                        onChange: this.onRealtimeMessageSnapshot.bind(this),
                        onError: e => {
                            if (
                                !this.inited ||
                                this.fatalRebuildCount >=
                                    FATAL_REBUILD_TOLERANCE
                            ) {
                                this.showError(
                                    this.inited
                                        ? "监听错误，已断开"
                                        : "初始化监听失败",
                                    e,
                                    "重连",
                                    () => {
                                        this.initWatch(
                                            this.chats.length
                                                ? {
                                                      sendTimeTS: _.gt(
                                                          this.chats[
                                                              this.chats
                                                                  .length - 1
                                                          ].sendTimeTS
                                                      )
                                                  }
                                                : {}
                                        );
                                    }
                                );
                            } else {
                                this.initWatch(
                                    this.chats.length
                                        ? {
                                              sendTimeTS: _.gt(
                                                  this.chats[
                                                      this.chats.length - 1
                                                  ].sendTimeTS
                                              )
                                          }
                                        : {}
                                );
                            }
                        }
                    });
            }, "初始化监听失败");
        },

        onRealtimeMessageSnapshot(snapshot) {
            console.warn(`收到消息`, snapshot);

            if (snapshot.type === "init") {
                this.chats = [
                    ...this.chats,
                    ...[...snapshot.docs].sort(
                        (x, y) => x.sendTimeTS - y.sendTimeTS
                    )
                ];
                this.scrollToBottom();
                this.inited = true;
            } else {
                let hasNewMessage = false;
                let hasOthersMessage = false;
                const chats = [...this.chats];
                for (const docChange of snapshot.docChanges) {
                    switch (docChange.queueType) {
                        case "enqueue": {
                            hasOthersMessage =
                                docChange.doc._openid !== this.openId;
                            const ind = chats.findIndex(
                                chat => chat._id === docChange.doc._id
                            );
                            if (ind > -1) {
                                if (
                                    chats[ind].msgType === "image" &&
                                    chats[ind].tempFilePath
                                ) {
                                    chats.splice(ind, 1, {
                                        ...docChange.doc,
                                        tempFilePath: chats[ind].tempFilePath
                                    });
                                } else chats.splice(ind, 1, docChange.doc);
                            } else {
                                hasNewMessage = true;
                                chats.push(docChange.doc);
                            }
                            break;
                        }
                    }
                }
                this.chats = chats.sort((x, y) => x.sendTimeTS - y.sendTimeTS);
                if (hasOthersMessage || hasNewMessage) {
                    this.scrollToBottom();
                }
            }
        },

        async onConfirmSendText() {
            this.try(async () => {
                if (!this.textInputValue) {
                    return;
                }

                const { collection } = this;
                const db = this.db;
                const _ = db.command;

                const doc = {
                    _id: `${Math.random()}_${Date.now()}`,
                    groupId: this.groupId,
                    avatar: this.userInfo.avatarUrl,
                    nickName: this.userInfo.nickName,
                    msgType: "text",
                    textContent: this.textInputValue,
                    sendTime: new Date(),
                    sendTimeTS: Date.now() // fallback
                };

                (this.textInputValue = ""),
                    (this.chats = [
                        ...this.chats,
                        {
                            ...doc,
                            _openid: this.openId,
                            writeStatus: "pending"
                        }
                    ]);
                this.scrollToBottom();
                await db.collection(collection).add({
                    data: doc
                });

                this.chats = this.chats.map(chat => {
                    if (chat._id === doc._id) {
                        return {
                            ...chat,
                            writeStatus: "written"
                        };
                    } else return chat;
                });
            }, "发送文字失败");
        },

        async onChooseImage(e) {
            wx.chooseImage({
                count: 1,
                sourceType: ["album", "camera"],
                success: async res => {
                    const { envId, collection } = this;
                    const doc = {
                        _id: `${Math.random()}_${Date.now()}`,
                        groupId: this.groupId,
                        avatar: this.userInfo.avatarUrl,
                        nickName: this.userInfo.nickName,
                        msgType: "image",
                        sendTime: new Date(),
                        sendTimeTS: Date.now() // fallback
                    };

                    this.chats = [
                        ...this.chats,
                        {
                            ...doc,
                            _openid: this.openId,
                            tempFilePath: res.tempFilePaths[0],
                            writeStatus: 0
                        }
                    ];
                    this.scrollToBottom();

                    const uploadTask = wx.cloud.uploadFile({
                        cloudPath: `${
                            this.openId
                        }/${Math.random()}_${Date.now()}.${
                            res.tempFilePaths[0].match(/\.(\w+)$/)[1]
                        }`,
                        filePath: res.tempFilePaths[0],
                        config: {
                            env: envId
                        },
                        success: res => {
                            this.try(async () => {
                                await this.db.collection(collection).add({
                                    data: {
                                        ...doc,
                                        imgFileID: res.fileID
                                    }
                                });
                            }, "发送图片失败");
                        },
                        fail: e => {
                            this.showError("发送图片失败", e);
                        }
                    });

                    uploadTask.onProgressUpdate(({ progress }) => {
                        this.chats = this.chats.map(chat => {
                            if (chat._id === doc._id) {
                                return {
                                    ...chat,
                                    writeStatus: progress
                                };
                            } else return chat;
                        });
                    });
                }
            });
        },

        onMessageImageTap(e) {
            wx.previewImage({
                urls: [e.target.dataset.fileid]
            });
        },

        scrollToBottom() {
            this.scrollToMessage = `item-${this.chats.length - 1}`;
            // if (force) {
            //     console.log("force scroll to bottom");
            //     this.scrollTop = 1000000 + Math.random();
            //     this.scrollWithAnimation = true;
            //     return;
            // }
            // this.createSelectorQuery()
            //     .select(".body")
            //     .boundingClientRect(bodyRect => {
            //         this.createSelectorQuery()
            //             .select(`.body`)
            //             .scrollOffset(scroll => {
            //                 if (
            //                     scroll.scrollTop + bodyRect.height * 3 >
            //                     scroll.scrollHeight
            //                 ) {
            //                     console.log("should scroll to bottom");
            //                     this.scrollTop = 100000 + Math.random();
            //                     this.scrollWithAnimation = true;
            //                 }
            //             })
            //             .exec();
            //     })
            //     .exec();
        },

        async onScrollToUpper() {
            if (this.db && this.chats.length) {
                const { collection } = this;
                const _ = this.db.command;
                const { data } = await this.db
                    .collection(collection)
                    .where(
                        this.mergeCommonCriteria({
                            sendTimeTS: _.lt(this.chats[0].sendTimeTS)
                        })
                    )
                    .orderBy("sendTimeTS", "desc")
                    .get();
                this.chats.unshift(...data.reverse());
                this.chats = this.chats;
            }
        },

        async try(fn, title) {
            try {
                await fn();
            } catch (e) {
                this.showError(title, e);
            }
        },

        showError(title, content, confirmText, confirmCallback) {
            console.error(title, content);
            wx.showModal({
                title,
                content: content.toString(),
                showCancel: confirmText ? true : false,
                confirmText,
                success: res => {
                    res.confirm && confirmCallback();
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
    .chatroom {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .box {
        width: 50px;
        height: 50px;
        background: url(../../static/dianzan.png) no-repeat;
        background-position: left;
        background-size: cover;
    }
    .boxactive {
        background-position: right;
        transition: background 0.6s steps(28); //根据图片有多少帧，比如我这张图片有29张小图，那就是填28
    }
    .chatroom .header {
        flex-basis: fit-content;
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #ddd;
        padding: 20rpx 0 30rpx;
        font-size: 30rpx;
        /* background: rgb(34, 187, 47);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              color: rgba(255, 255, 255, 1) */
        /* font-family: 'Microsoft YaHei' */
    }

    .chatroom .header .left {
        flex: 1;
    }

    .chatroom .header .middle {
        flex: 2;
        text-align: center;
    }

    .chatroom .header .right {
        flex: 1;
    }

    .chatroom .body {
        flex: 2;
        display: flex;
        white-space: nowrap;
        flex-direction: column;
        background: rgb(237, 237, 237);
        padding-bottom: 100rpx;
    }

    .body .message {
        display: flex;
        flex-direction: row;
        position: relative;
        margin: 12rpx 0;
    }

    .body .message.message__self {
        flex-direction: row-reverse;
    }

    .body .message .avatar {
        position: relative;
        top: 5rpx;
        width: 60rpx;
        height: 60rpx;
        border-radius: 5rpx;
        margin: 15rpx;
    }

    .body .message .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .body .message.message__self .main {
        align-items: flex-end;
    }

    .body .message .nickname {
        font-size: 24rpx;
        color: #444;
    }

    .body .message .text-content {
        border: 1px solid transparent;
        border-radius: 3px;
        background-color: #fff;
        margin: 2px 0 0 0;
        padding: 4px 10px;
        font-size: 30rpx;
        display: inline-block;
    }

    .body .message.message__self .text-content {
        background-color: paleturquoise;
    }

    .body .message .text-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        max-width: 80%;
    }

    .body .message.message__self .text-wrapper .loading {
        font-size: 16rpx;
        margin-right: 18rpx;
    }

    .body .message .image-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .body .message .image-content {
        max-width: 240rpx;
        max-height: 240rpx;
    }

    .body .message.message__self .image-wrapper .loading {
        font-size: 20rpx;
        margin-right: 18rpx;
    }

    .chatroom .footer {
        flex-basis: fit-content;
        display: flex;
        flex-direction: row;
        border-top: 1px solid #ddd;
        font-size: 10rpx;
        padding: 20rpx 30rpx;
        background: rgb(246, 246, 246);
    }

    .chatroom .footer .message-sender {
        flex: 1;
        display: flex;
        flex-direction: row;
    }

    .message-sender .text-input {
        flex: 1;
        font-size: 16px;
        border: 1px solid transparent;
        border-radius: 5px;
        padding: 3px 6px;
        margin: 0 10px 0 5px;
        background: #fff;
    }

    .message-sender .btn-send-image {
        width: 50rpx;
        height: 50rpx;
        align-self: center;
    }

    button {
        font-size: 30rpx;
    }

    button.userinfo {
        background: darkturquoise;
        color: aliceblue;
        padding: 0 100rpx;
        border: 1px solid #ddd;
        border-radius: 20px;
    }
</style>
