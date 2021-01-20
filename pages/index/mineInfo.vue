<template>
	<view class="mineInfo">					
		<view class="personalCenter">
			<view class="bottomBtns personal"></view>
			<view class="personalInfo">18822556888</view>
		</view>	
		<uni-collapse>
		    <uni-collapse-item title="待处理" >
		        <view class="pendingInf" @click="pendingEvent">
		            {{pendingInf}}
		        </view>
		    </uni-collapse-item>
			<uni-collapse-item title="已处理" >
				<view class="processedInf" >
					{{pendingInf}}
				</view>
			</uni-collapse-item>
			<!-- <uni-collapse-item title="推送" >
				<view class="pushInf" >
					{{pendingInf}}
				</view>
			</uni-collapse-item> -->
		</uni-collapse>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				pendingInf:`到客服到时交房量算低级分离式的晶晶姐晶晶都是军军军军军军军军军军军军军军军军军军军军军军,			
				军军房山的法撒旦法撒旦法三会计分录sadf`,
			}
		},
		methods:{
			pendingEvent(){
				uni.navigateTo({
					url:'/pages/index/indexWeb',
					success: function(res){
						// uni.$emit('infLocation',{OBJECTID:385})
					}
				})
			}
		}
	}
</script>

<style>
.personalCenter{display: flex;justify-content: flex-start;line-height:40px;}
.bottomBtns{	
	border-radius: 50%;
	background-size: 90% 90%;
	background-repeat: no-repeat;background-position: center center;	
}
.personal{background-image: url('@/static/personal.svg');width:40px;height: 40px;}
</style>