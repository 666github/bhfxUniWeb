<template>
	<view>
		<!-- 按钮 -->
		<button 
			:class="['buttonBorder',!_rotate?'dlbutton':'dlbutton_loading']" 
			:style="{'background':bgColor, 'color': fontColor}"
            open-type="getUserInfo"  
			@click="sendUserinf"
			@contact="$emit('contact', $event)"
			@error="$emit('error', $event)"
			@getphonenumber="$emit('getphonenumber', $event)"
			
			@launchapp="$emit('launchapp', $event)"
			@longtap="$emit('longtap', $event)"
			@opensetting="$emit('opensetting', $event)"
			@touchcancel="$emit('touchcancel', $event)"
			@touchend="$emit('touchend', $event)"
			@touchmove="$emit('touchmove', $event)"
			@touchstart="$emit('touchstart', $event)"	
		>
		<!--@click="$emit('click', $event)" @getuserinfo="$emit('getuserinfo', $event)" @getuserinfo="appLoginWx"-->
			<view :class="_rotate?'rotate_loop':''">
				<text v-if="_rotate" class="cuIcon cuIcon-loading1 "></text>
				<view v-if="!_rotate"><slot name="text">{{ text }}</slot></view>
			</view>
		</button>
	</view>
</template>

<script>
	export default{
		props:{
			text: String, //显示文本
			rotate:{
				//是否启动加载
				type: [Boolean,String],
				default: false,
			}, 
			bgColor:{
				//按钮背景颜色
				type: String,
				// default: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.6))",
				default:"linear-gradient(to right, rgba(39, 71, 228, 0.7), rgba(39, 43, 183, 0.6))"
			},
			fontColor:{
				//按钮字体颜色
				type: String,
				default: "#FFFFFF",
			},
		},
		computed:{
			_rotate() {
				//处理值
				return String(this.rotate) !== 'false'
			},
		},
		methods:{
			sendUserinf(){
				this.$emit('getuserinfo');
			},
			//  appLoginWx(){
			// 	// #ifdef MP-WEIXIN
			// 		uni.getProvider({
			// 		  service: 'oauth',
			// 		  success: function (res) {
			// 			if (~res.provider.indexOf('weixin')) {
			// 				uni.login({
			// 					provider: 'weixin',
			// 					success: (res2) => {debugger
									
			// 						uni.getUserInfo({
			// 							provider: 'weixin',
			// 							success: (info) => {//这里请求接口
			// 								console.log(res2);
			// 								console.log(info);
											
			// 							},
			// 							fail: () => {
			// 								uni.showToast({title:"微信登录授权失败",icon:"none"});
			// 							}
			// 						})
							
			// 					},
			// 					fail: () => {
			// 						uni.showToast({title:"微信登录授权失败",icon:"none"});
			// 					}
			// 				})
							
			// 			}else{
			// 				uni.showToast({
			// 					title: '请先安装微信或升级版本',
			// 					icon:"none"
			// 				});
			// 			}
			// 		  }
			// 		});
			// 		//#endif
			// }
		}
	}
</script>

<style>
	@import url("./css/icon.css");
	
	.dlbutton {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 30rpx;
		white-space:nowrap;
		overflow: hidden;
		width:601rpx;
		height:100rpx;
		background:linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.6));
		box-shadow:0rpx 0rpx 13rpx 0rpx rgba(164,217,228,0.4);
		border-radius:2.5rem;
		margin-top: 0rpx;
	}
	.dlbutton_loading {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 30rpx;
		width:100rpx;
		height:100rpx;
		background:linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.6));
		box-shadow:0rpx 0rpx 13rpx 0rpx rgba(164,217,228,0.4);
		border-radius:2.5rem;
		margin-top: 0rpx;
	}
	.buttonBorder{
	    border: none ;
	    border-radius: 2.5rem ;
	    -webkit-box-shadow: 0 0 60rpx 0 rgba(0,0,0,.2) ;
	    box-shadow: 0 0 60rpx 0 rgba(0,0,0,.2) ;
	    -webkit-transition: all 0.4s cubic-bezier(.57,.19,.51,.95);
	    -moz-transition: all 0.4s cubic-bezier(.57,.19,.51,.95);
	    -ms-transition: all 0.4s cubic-bezier(.57,.19,.51,.95);
	    -o-transition: all 0.4s cubic-bezier(.57,.19,.51,.95);
	    transition: all 0.4s cubic-bezier(.57,.19,.51,.95);
	}
	
	/* 旋转动画 */
	.rotate_loop{
		-webkit-transition-property: -webkit-transform;
	    -webkit-transition-duration: 1s;
	    -moz-transition-property: -moz-transform;
	    -moz-transition-duration: 1s;
	    -webkit-animation: rotate 1s linear infinite;
	    -moz-animation: rotate 1s linear infinite;
	    -o-animation: rotate 1s linear infinite;
	    animation: rotate 1s linear infinite;
	}
	@-webkit-keyframes rotate{from{-webkit-transform: rotate(0deg)}
	    to{-webkit-transform: rotate(360deg)}
	}
	@-moz-keyframes rotate{from{-moz-transform: rotate(0deg)}
	    to{-moz-transform: rotate(359deg)}
	}
	@-o-keyframes rotate{from{-o-transform: rotate(0deg)}
	    to{-o-transform: rotate(359deg)}
	}
	@keyframes rotate{from{transform: rotate(0deg)}
	    to{transform: rotate(359deg)}
	}
</style>
