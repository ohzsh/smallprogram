<template>
  <div class="talk">
	<div v-show="loadingShow" class="loader loader7"></div>
	<audio src="https://dds.dui.ai/runtime/v1/synthesize?voiceId=qianranfa&speed=0.8&volume=100&audioType=wav&text=我是谁" autoplay></audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
	.loader{
	width:100rpx;
	height:100rpx;
	display:flex;
	justify-content:center;
	align-items:center;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
	margin:10rpx 20rpx;
	}
	@keyframes load7{
	100%{
		transform:rotatez(360deg);
	}
	}
	.loader7::before{
	content:"";
	color:white;
	height:50rpx;
	width:50rpx;
	background:transparent;
	border-radius:50%;
	border:10rpx solid blue;
	border-color:#0277BD #0277BD #0277BD #81D4FA;
	animation:load7 .6s infinite ease-in-out;
	box-shadow:0rpx 0rpx 40rpx -2rpx skyblue;
	}
</style>
