<template>
	<view class="mineMoney">					
		<view class="personalCenter">
			<view class="bottomBtns personal"></view>
			<view class="personalInfo">{{phone}}</view>
		</view>	
		<view class="personalNav">
			<view class="bottomBtns myMoney">
				<view class="moneyBg">
				</view>
				<view>
					<view class="moneyBgunder"><b>我的奖金</b></view>
					<view class="moneyBgunder"><span>￥</span><span>{{moneyData}}</span></view>
				</view>			
			</view>
		</view>
		<view>
			<button type="primary" plain="true" class="bottomSubmit" @click="getMoney">提现</button>
		</view>
	</view>
</template>

<script>
	let _this;
	import {request2} from '@/pages/network/appLoginWx.js';
	export default {
		data(){
			return{
				moneyData:100,
				phone:'18888888888'
			}
		},
		mounted() {
			_this=this;
			this.getwallet();
			_this.phone=uni.getStorageSync('phone');
		},
		methods:{
			getwallet(){//获取余额
				request2({
					url:'/api/wxuser/getwallet',
					header: {'Authorization':uni.getStorageSync('token')},
				}).then((res)=>{
					if(res.data.Status=="success"){//获取余额
						_this.moneyData=res.data.Data;
					}											
				})
			},
			getMoney(){debugger
			// https://blog.csdn.net/weixin_41262185/article/details/109384456
				// this.$jweixin.chooseWXPay({
				// 	timestamp: payJson.timeStamp,
				// 	nonceStr: payJson.nonceStr,
				// 	package: payJson.package,
				// 	signType: payJson.signType,
				// 	paySign: payJson.paySign,
				// 	success: function (r) {
				// 		alert('微信api：success')
				// 		alert(r)
				// 		this.$router.push({ name: 'Home'});
				// 		// 支付成功后的回调函数
				// 		if (r.errMsg == "chooseWXPay:ok") {
				// 			alert('支付成功')
				// 			this.$router.push({ name: 'Home'});
				// 			//支付成功
				// 			// _this.checkDetail(res.ordersNo);
							 
				// 		} else {
				// 			alert('success支付失败')
				// 			this.$router.push({ name: 'Home'});
				// 			// _this.checkDetail(res.ordersNo);
				// 			alert(r.errMsg,null);
				// 		}
				// 	},
				// 	cancel: function(r) {
				// 		alert('取消支付')
				// 		this.$router.push({ name: 'Home'});
				// 		//支付取消
				// 		this.$route.push
				// 		_this.checkDetail(res.ordersNo);
				// 	},
				// 	fail:function(r){
				// 		alert('fail支付失败了')
				// 		this.$router.push({ name: 'All_order_list'});
				// 		//支付失败
				// 	}
				// });
			}
		}
	}
</script>

<style>
.formDiv{margin: 5px 0;border-bottom: solid 1px lightgray;padding: 5px 0;}
.formTextarea{min-height: 200px;}
.personalCenter{display: flex;justify-content: flex-start;line-height:40px;}
.bottomBtns{	
	border-radius: 50%;
	background-size: 90% 90%;
	background-repeat: no-repeat;background-position: center center;	
}
.personal{background-image: url('@/static/personal.svg');width:40px;height: 40px;}
.personalNav{margin: 100rpx 0;}
.myMoney{text-align: center;}
.moneyBg{background-image: url('@/static/lingqian.svg');width: 140rpx;height: 140rpx;margin: 0 auto;}
.moneyBgunder{padding: 20rpx 0;}
.bottomSubmit{width: 140px;background-color: green;margin: 0 auto;}
</style>