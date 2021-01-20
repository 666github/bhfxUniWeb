<template>
	<view class="mine">					
		<!-- 带图标 -->
		<uni-collapse>
		    <uni-collapse-item title="手机号码" thumb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABpElEQVRIS+2WPUsDQRCG590rbAwIglZ+IBFEUNg9ES0sLUxpmUKMiJX+BVtLifgDRPzo0kV/gZ27SzBR0KCdoIXipYmS7MqFKGLOy52CVa5+Z5652dl9B/RPH37iJJPJrkQiMWGt7Y5Si+M4XrVaLZZKpbcgfSDIdd1VIsoS0bW19iUKyNcAGLDWbiqlDr/HtICEEIsAto0xC1rry6gQX8c5HwJwBmBBSnnxNTYIlCOinFLqIA7kQ8s5XwEwp5TKtAMVAGSklOo3ICHEDBHtKKWmQ0Gu617UarWlQqGg/wDaVUpNdUCxOtg8o07rYnWtIe60rnNhP6cm1jAYYxhjbDz+zDUifA+rRHrr6vX6FhHd/xI0zBhbbwsSQoTbxNXeOYEcGlvmQYVwzmcBZKPYhG/DeSnlUUuim5Muqj8++65NTl8PjaZev2uEEBkA81LKdKhNNCs6ttamAq389qi/kWAk/RAAmQSQN8asaa1PQ0FN7/ftOAvgzlr7FOWsAPQS0aAxZkNrvd92OfkQxF23GGMVz/OK5XK5pZ1+zh/3uih/EUfzDk8XJCraS4q4AAAAAElFTkSuQmCC">
		        <view class="myInfocontent" >
		            {{myphone}}
		        </view>
		    </uni-collapse-item>
		    <uni-collapse-item title="应用建议" thumb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAACDklEQVRIS+XWO4sTURQH8P9/EjMRJH6ALXwQ2IXBMNxBxNUtfDQKdpZWdtppuRYr4iJYCRY2gpVfQPGxsm6lEYRzGZAUQvAj+EgVg7lHZknW2ZhMJhmx0FvOnHt/95y5jyH+UuOIUzbGXCB5RFW9vHMg+VlE7gPQSX12oCAIKtVq9TWAk3mBdJyqPrLWXp4KGWNWSa4DuN3v9xNwavM87y6ABZJfAAQAHojI1XEddzIyxrwkeUhEFqcKg4AoijYAHOj1escrlcoWgHASloaaJPsispIXMsa8GExuqV6v12q12ibJo6p6z1p7LT1OUeg5ycMispQMGgTBPt/3t8ZhRaEnAE51Op2FdrvdSWEbJJcBrInIreR5UWiN5E1VfQfgVapUe0leV9X31toThaFkS/i+/xDAJZKjexKq2vwjUNaiMca8Td7/p1AYhsue5yXL1c8qk6p+d86djuO4OYybqXRRFO0HcEVVq1kQye7gRPg2F5T3hBgXN1NGyT4zxhxzzmVmBOBrHMdxGpwJCsPwfKlUejYtM1VV59xKHMfbSzppM0H/5DeaVrWJ77NKl1x8B4dH/tzCr0vxo6p+staeGz1Ut69yVV13zm0WgTzPO0vyBoBVEbmzCxr8nDwGcLEIkur7ptvtnmm1Wr1d0DCg0WgslsvlBNszD0jSqeoHa+1TAD+GY/x2h8wzeJ4+PwHe9T0qYwwwHwAAAABJRU5ErkJggg==">
		        <view class="myInfocontent" >
		            {{appProposal}}
		        </view>
		    </uni-collapse-item>
			<uni-collapse-item title="钱包" thumb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAACJElEQVRIS93VSaiNcRjH8c/NkCzYUEiIEhmKFKGMG+NGpoUyFSlhYYhMKWWKJEQoQ5ISGRdIyRhlYaNEpoU5Cgtjj/5H1/He879ddZNnc+q87/t8n98zVqknq6onjn8ONIKfQZ3BOKzEW/TAVczFw0rZqY2ijWiDZRiKhRiOp2iAiViCXvhaEywH6oNNGIRmuI9+eFDm8Dh24lxdQYvwHRswH10wu8DZLlzAkbqCFiQlq3EQO3ClzFmk7Dw643VdQaHgGObU4KBvUjodZ/+mGfqnvN/Dh2qOOqSUfkZzTP0b0EzMwxTcKYs2WvwZJmMrTuMoVqQA/hBXU9eNxVIMK1NSctA0zc5znMAXnMILjC9KYRGoLa6hN15WyHsEchg9E6wRLmMvogt/syLQOrzDWrSsBmuIUPIeLVKDrEkDvD557YTr6IpX1UlFoJuYgUdJ2aQ0oCexGfFbshjiWWnOSv9tx23syYHepIgbIyKellZNpDMG+G5m4w/EYoypBArnoaQ1mqQPYg0NTqsoCn4rAwqV0aUdK4GiDk8SKN4LNbGZ2+NG2tyfMqBWaVN0z6UuFmY3hMN2GJ1mKdIWXZWzkanGMWu/rKgZduMSDqW3Ylsvx6gcIT2/iH04kAOFing5bs/jlMaIblsGFDdrC2IOoyG+5UCl2qxKuY6a5SwKPwH705L9WP5BpcMX13MIBqQzXgkWIxHHLzJQaLkLm1NS6+f/H+gHqr9tG6LIpv8AAAAASUVORK5CYII=">
			    <view class="myInfocontent" >
			        余额：{{mymoney}}
			    </view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	var _this;
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	export default {
		data(){
			return{
				myphone:'10086',
				appProposal:"警告:arcgis是个大程序",
				mymoney:'100'
			}
		},
	    components: {uniCollapse,uniCollapseItem}
	}
</script>

<style>
	.myInfocontent{text-align: left;padding: 10rpx 50px;font-size:14px;color: red;}
	/* @import url("../../components/bhfx-login/css/icon.css"); */
	/* @import url("./css/main.css"); */
</style>