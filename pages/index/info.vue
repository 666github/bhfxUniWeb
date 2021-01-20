<template>
	<view class="info">					
		<!-- 带图标 -->
		<uni-collapse>
		    <uni-collapse-item title="消息" thumb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAACDklEQVRIS+XWO4sTURQH8P9/EjMRJH6ALXwQ2IXBMNxBxNUtfDQKdpZWdtppuRYr4iJYCRY2gpVfQPGxsm6lEYRzGZAUQvAj+EgVg7lHZknW2ZhMJhmx0FvOnHt/95y5jyH+UuOIUzbGXCB5RFW9vHMg+VlE7gPQSX12oCAIKtVq9TWAk3mBdJyqPrLWXp4KGWNWSa4DuN3v9xNwavM87y6ABZJfAAQAHojI1XEddzIyxrwkeUhEFqcKg4AoijYAHOj1escrlcoWgHASloaaJPsispIXMsa8GExuqV6v12q12ibJo6p6z1p7LT1OUeg5ycMispQMGgTBPt/3t8ZhRaEnAE51Op2FdrvdSWEbJJcBrInIreR5UWiN5E1VfQfgVapUe0leV9X31toThaFkS/i+/xDAJZKjexKq2vwjUNaiMca8Td7/p1AYhsue5yXL1c8qk6p+d86djuO4OYybqXRRFO0HcEVVq1kQye7gRPg2F5T3hBgXN1NGyT4zxhxzzmVmBOBrHMdxGpwJCsPwfKlUejYtM1VV59xKHMfbSzppM0H/5DeaVrWJ77NKl1x8B4dH/tzCr0vxo6p+staeGz1Ut69yVV13zm0WgTzPO0vyBoBVEbmzCxr8nDwGcLEIkur7ptvtnmm1Wr1d0DCg0WgslsvlBNszD0jSqeoHa+1TAD+GY/x2h8wzeJ4+PwHe9T0qYwwwHwAAAABJRU5ErkJggg==">
		        <view class="myInfocontent" >
		            {{appProposal}}
		        </view>
		    </uni-collapse-item>
		    <uni-collapse-item title="消息" thumb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAACDklEQVRIS+XWO4sTURQH8P9/EjMRJH6ALXwQ2IXBMNxBxNUtfDQKdpZWdtppuRYr4iJYCRY2gpVfQPGxsm6lEYRzGZAUQvAj+EgVg7lHZknW2ZhMJhmx0FvOnHt/95y5jyH+UuOIUzbGXCB5RFW9vHMg+VlE7gPQSX12oCAIKtVq9TWAk3mBdJyqPrLWXp4KGWNWSa4DuN3v9xNwavM87y6ABZJfAAQAHojI1XEddzIyxrwkeUhEFqcKg4AoijYAHOj1escrlcoWgHASloaaJPsispIXMsa8GExuqV6v12q12ibJo6p6z1p7LT1OUeg5ycMispQMGgTBPt/3t8ZhRaEnAE51Op2FdrvdSWEbJJcBrInIreR5UWiN5E1VfQfgVapUe0leV9X31toThaFkS/i+/xDAJZKjexKq2vwjUNaiMca8Td7/p1AYhsue5yXL1c8qk6p+d86djuO4OYybqXRRFO0HcEVVq1kQye7gRPg2F5T3hBgXN1NGyT4zxhxzzmVmBOBrHMdxGpwJCsPwfKlUejYtM1VV59xKHMfbSzppM0H/5DeaVrWJ77NKl1x8B4dH/tzCr0vxo6p+staeGz1Ut69yVV13zm0WgTzPO0vyBoBVEbmzCxr8nDwGcLEIkur7ptvtnmm1Wr1d0DCg0WgslsvlBNszD0jSqeoHa+1TAD+GY/x2h8wzeJ4+PwHe9T0qYwwwHwAAAABJRU5ErkJggg==">
		        <view class="myInfocontent" >
		            {{appProposal}}
		        </view>
		    </uni-collapse-item>
			<uni-collapse-item title="消息" thumb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAACDklEQVRIS+XWO4sTURQH8P9/EjMRJH6ALXwQ2IXBMNxBxNUtfDQKdpZWdtppuRYr4iJYCRY2gpVfQPGxsm6lEYRzGZAUQvAj+EgVg7lHZknW2ZhMJhmx0FvOnHt/95y5jyH+UuOIUzbGXCB5RFW9vHMg+VlE7gPQSX12oCAIKtVq9TWAk3mBdJyqPrLWXp4KGWNWSa4DuN3v9xNwavM87y6ABZJfAAQAHojI1XEddzIyxrwkeUhEFqcKg4AoijYAHOj1escrlcoWgHASloaaJPsispIXMsa8GExuqV6v12q12ibJo6p6z1p7LT1OUeg5ycMispQMGgTBPt/3t8ZhRaEnAE51Op2FdrvdSWEbJJcBrInIreR5UWiN5E1VfQfgVapUe0leV9X31toThaFkS/i+/xDAJZKjexKq2vwjUNaiMca8Td7/p1AYhsue5yXL1c8qk6p+d86djuO4OYybqXRRFO0HcEVVq1kQye7gRPg2F5T3hBgXN1NGyT4zxhxzzmVmBOBrHMdxGpwJCsPwfKlUejYtM1VV59xKHMfbSzppM0H/5DeaVrWJ77NKl1x8B4dH/tzCr0vxo6p+staeGz1Ut69yVV13zm0WgTzPO0vyBoBVEbmzCxr8nDwGcLEIkur7ptvtnmm1Wr1d0DCg0WgslsvlBNszD0jSqeoHa+1TAD+GY/x2h8wzeJ4+PwHe9T0qYwwwHwAAAABJRU5ErkJggg==">
			    <view class="myInfocontent" >
			        {{appProposal}}
			    </view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	var _this;
	// import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	// import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	export default {
		data(){
			return{
				appProposal:"警告:arcgis是个大程序"
			}
		},
	    // components: {uniCollapse,uniCollapseItem}
	}
</script>

<style>
	.myInfocontent{text-align: left;padding: 10rpx 50px;font-size:14px;color: red;}
	/* @import url("../../components/bhfx-login/css/icon.css"); */
	/* @import url("./css/main.css"); */
</style>