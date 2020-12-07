<!--
 * @Author: json
 * @Date: 2019-09-17 02:03:28
 * @LastEditTime: 2020-06-04 18:11:12
 * @LastEditors: json
 * @Description: 自定义导航栏
 * @FilePath: /smallprogram/src/colorui/components/cu-custom.vue
--> 
<template>
    <view class="cu-custom"
        :style="[{height:CustomBar + 'px'}]">
        <view class="cu-bar fixed"
            :style="style"
            :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
            <view class="action"
                @tap="BackPage"
                v-if="isBack">
                <text v-if="backArrow"
                    class="cuIcon-back"></text>
                <slot name="backText"></slot>
            </view>
            <view class="content"
                :style="[{top:StatusBar + 'px'}]">
                <slot name="content"></slot>
            </view>
            <slot name="right"></slot>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            StatusBar: this.StatusBar,
            CustomBar: this.CustomBar
        };
    },
    name: "cu-custom",
    computed: {
        style() {
            var StatusBar = this.StatusBar;
            var CustomBar = this.CustomBar;
            var bgImage = this.bgImage;
            var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
            if (this.bgImage) {
                style = `${style}background-image:url(${bgImage});`;
            }
            return style;
        }
    },
    props: {
        bgColor: {
            type: String,
            default: ""
        },
        isBack: {
            type: [Boolean, String],
            default: false
        },
        backArrow: {
            type: [Boolean, String],
            default: false
        },
        bgImage: {
            type: String,
            default: ""
        }
    },
    methods: {
        BackPage() {
            if (
                getCurrentPages().length < 2 &&
                "undefined" !== typeof __wxConfig
            ) {
                let url = "/" + __wxConfig.pages[0];
                return uni.redirectTo({ url });
            }
            uni.navigateBack({
                delta: 1
            });
        }
    }
};
</script>

<style>
</style>
