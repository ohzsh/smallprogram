<template>
    <view>
        <cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg"
            :isBack="true">
            <view slot="backText">返回</view>
            <view slot="content">微动画</view>
        </cu-custom>
        <view class="margin radius bg-gradual-green shadow-blur">
            <image src="https://raw.githubusercontent.com/weilanwl/ColorUI/master/demo/images/wave.gif"
                mode="scaleToFill"
                class="gif-black response"
                style="height:100rpx"></image>
        </view>
        <view class="bg-black flex-sub shadow-lg">
            <image src="https://image.weilanwl.com/gif/loading-black.gif"
                mode="aspectFit"
                class="gif-black response"
                style="height:240rpx"></image>
        </view>
        <button class='cu-btn bg-green shadow magical'
            @click='handleLoadModal'>
            点我
        </button>
        <!-- <view class='cu-load load-modal'
            v-if="loadModal">
            <image src='https://image.weilanwl.com/gif/loading-black.gif'
                class='png gif-black'
                mode='aspectFit'></image>
        </view> -->
        <view class="w-100p lh-100 bb-1px">
            uniapp
        </view>
        <view @click='handleLoadModal'
            :class="['box', dianzan]"></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            modalName: "",
            loadModal: false
        };
    },
    computed: {
        dianzan() {
            return this.loadModal ? "boxactive" : "boxactive1";
        }
    },
    methods: {
        showModal() {
            console.log(1111);
            this.modalName = "viewModal";
        },
        hideModal(e) {
            this.modalName = null;
        },
        handleLoadModal() {
            this.loadModal = !this.loadModal;
        }
    }
};
</script>

<style lang="scss" scoped>
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
    .boxactive1 {
        background-position: left;
        transition: background 0.6s steps(28); //根据图片有多少帧，比如我这张图片有29张小图，那就是填28
    }
    image[class*="gif-"] {
        border-radius: 6rpx;
        display: block;
    }
</style>
