<template>
    <div class="title-swiper">
        <swiper class="swiper-img"
            v-if="imgUrls.length > 0"
            indidator-dots="imgUrls.length > 1">
            <block v-for="(item, index) in imgUrls"
                :key="index">
                <swiper-item>
                    <image :src="item"
                        mode="scaleToFill"></image>
                </swiper-item>
            </block>
        </swiper>
    </div>
</template>

<script>
import card from '@/components/card'

export default {
    components: {
        card,
    },

    data() {
        return {
            logs: [],
            imgUrls: [
                'http://mss.sankuai.com/v1/mss_51a7233366a4427fa6132a6ce72dbe54/newsPicture/05558951-de60-49fb-b674-dd906c8897a6',
                'http://mss.sankuai.com/v1/mss_51a7233366a4427fa6132a6ce72dbe54/coursePicture/0fbcfdf7-0040-4692-8f84-78bb21f3395d',
            ],
        }
    },

    created() {},
}
</script>

<style lang="less" scoped>
    .title-swiper {
        display: flex;
        align-items: center;
        justify-content: center;
        .swiper-img {
            width: 300px;
        }
    }
</style>
