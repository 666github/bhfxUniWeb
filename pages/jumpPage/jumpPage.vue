<template>
	<view class="jumppage">	
		<!-- <web-view src="http://192.168.1.163:8082/#/pages/index/indexWeb"></web-view> -->
	</view>
</template>

<script>
	var _this;	
	export default {
		data() {
			return {
				token:'',
				phone:''
			}
		},
		components:{
			// wInput,
			// wButton,
		},
		mounted() {
		},
		onLoad() {
			_this= this;
			let urlParam= window.location.href.split('?')[1].split('&');//获取网页ip,token
			this.token=urlParam[0].split("=")[1];
			this.phone=urlParam[1].split("=")[1];
			uni.setStorageSync('token',this.token);
			uni.setStorageSync('phone',this.phone);
		},
		onShow() {
			uni.navigateTo({
				url:'/pages/index/indexWeb?token='+_this.token+"&phoneNum="+_this.phone
				// url:'/pages/index/indexWeb'
			});
		},
		methods: {
		}
	}
</script>

<style>
</style>