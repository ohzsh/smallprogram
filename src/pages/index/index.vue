<template>
    <div class="home"
        @click="clickHandle">
        <div>1234</div>
        <web-view src="http://music.luckcat.xyz/"></web-view>
    </div>
</template>

<script>
import card from '@/components/card'
import talk from '@/components/talk'
export default {
    data() {
        return {}
    },

    components: {
        card,
        talk,
    },

    methods: {
        fileUpdate(e) {
            let _this = this
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths
                    console.log(tempFilePaths)
                    let data = {
                        api_key: 'Xy6pXLnsNyHtKjEliY6jgIvxD-lOO-lJ',
                        api_secret: 'uaJy-artAfNUBPr5Yafgpe5uDD0XSVy9',
                        image_url: tempFilePaths[0],
                    }
                    console.log(
                        _this.$request('/facepp/v1/skinanalyze', 'POST', data),
                    )
                },
            })
        },
    },

    created() {},
}
</script>

<style scoped>
    .userinfo {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .home {
        position: relative;
    }
    .bg-img {
        position: absolute;
        z-index: -1;
        width: 100vw;
        height: 100vh;
    }
    .userinfo-avatar {
        width: 128rpx;
        height: 128rpx;
        margin: 20rpx;
        border-radius: 50%;
    }

    .userinfo-nickname {
        color: #aaa;
    }

    .usermotto {
        margin-top: 150px;
    }

    .form-control {
        display: block;
        padding: 0 12px;
        margin-bottom: 5px;
        border: 1px solid #ccc;
    }
    .all {
        width: 7.5rem;
        height: 1rem;
        background-color: blue;
    }
    .all:after {
        display: block;
        content: '';
        clear: both;
    }
    .left {
        float: left;
        width: 3rem;
        height: 1rem;
        background-color: red;
    }

    .right {
        float: left;
        width: 4.5rem;
        height: 1rem;
        background-color: green;
    }
</style>
