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
			<button type="primary" plain="true" class="bottomSubmit" @click="submitImgs">提现</button>
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
				}).then((res)=>{debugger
					if(res.data.Status=="success"){//获取余额
						_this.moneyData=res.data.Data;
					}											
				})
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