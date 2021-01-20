<template>
	<view class="mineSuggest">	
		<view class="personalCenter">
			<view class="personal"></view>
			<view class="personalInfo">{{phone}}</view>
		</view>
		<view class="formDiv">
			<b>建议类型：</b>
			<select  @change="suggestType" id="suggesttype">
			  <option value ="">请选择建议类型</option>
			  <option value ="发现变化">发现变化</option>
			  <option value ="领取任务">领取任务</option>
			  <option value ="其他">其他</option>
			</select>
		</view>
		<view >
			<view><b>建议详情</b></view>
			<textarea  placeholder="请输入您的宝贵建议" class="formTextarea" @blur="getTextcontent"/>
		</view>	
		<view class="bottomBtn">
			<button type="primary" @click="submitImgs">提交</button>
		</view>
	</view>
</template>

<script>
	import {request2} from '@/pages/network/appLoginWx.js';
	export default {
		data(){
			return{
				sugType:'',
				getText:'',
				phone:'18888888888'
			}
		},
		mounted() {
			this.phone=uni.getStorageSync('phone');
		},
		methods:{
			suggestType(){
				this.sugType=document.getElementById('suggesttype').value;
			},
			getTextcontent(e){
				this.getText=e.detail.value;
			},
			submitImgs(){
				request2({
					url:'/api/bhfx/sendAdvice',
					header: {'Authorization':uni.getStorageSync('token')},
					method:'POST',
					data:{
					    "type":this.sugType,
					    "content":this.getText
					}
				}).then((res)=>{
					if(res.data.Status=="success"){
							uni.showModal({
								title: '应用建议',					
							    content:`提交成功`,
								showCancel: false,						
								// confirmText: '关闭',
								success(res) {
								  uni.redirectTo({
								  	url:"/pages/index/mine"
								  })
								}
							})
					}											
				})
				// uni.request({
				//     url: 'https://www.example.com/request'
				//     data: {
				//         sugType:this.sugType,
				// 		   getText:this.getText
				//     },
				//     success: (res) => {
				//         console.log(res.data);							
				//     }
				// });
			}
		}
	}
</script>

<style>
.mineSuggest{padding: 0 5px;}
.formDiv{margin: 5px 0;border-bottom: solid 1px lightgray;padding: 10px 0;}
#suggesttype{height: 25px;}
.formTextarea{min-height: 200px;background-color: lightgray;width: 100%;margin-top: 15px;}
.bottomBtn {	
	position: fixed;
	left: 0;
	right: 0;
	bottom: 10px;
	height: 44px;
	line-height: 44px;
	padding: 0 5px;
}
.personalCenter{display: flex;justify-content: flex-start;line-height:40px;}
.personal{
	width:40px;height: 40px;
	border-radius: 50%;
	background-size: 90% 90%;
	background-repeat: no-repeat;background-position: center center;
	background-image: url('@/static/personal.svg');
}
</style>