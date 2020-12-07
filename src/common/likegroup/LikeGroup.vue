<!--
 * @Author: json
 * @Date: 2020-06-09 17:13:28
 * @LastEditTime: 2020-06-22 15:33:12
 * @LastEditors: json
 * @Description: 收藏列表
 * @FilePath: /smallprogram/src/common/likegroup/LikeGroup.vue
--> 
<template>
    <view class="container">
        <scroll-view scroll-y
            class="scrollPage">
            <view class='nav-list mt-40'>
                <view @click="handleOpenChatRoom(item)"
                    class="nav-li bg-gradual-red"
                    v-for="item in list"
                    :key="item._id">
                    <view class="nav-title">{{item.groupName}}</view>
                    <view class="nav-name">{{item._id | formatDate}}</view>
                    <text class="cuIcon-tagfill"></text>
                </view>
            </view>
            <view class='cu-tabbar-height'></view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    props: {
        list: Array
    },
    filters: {
        /**
         * 日期格式化
         * @param {Date} date 日期
         * @returns {string}格式化后的日期
         */
        formatDate(date) {
            return new Date(+date.split("_")[1]).toLocaleString();
        }
    },
    data() {
        return {};
    },
    methods: {
        handleOpenChatRoom(item) {
            this.$emit("openChatRoom", {
                groupId: item._id
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>