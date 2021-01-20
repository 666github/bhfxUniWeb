<template>
	<view class="bhfxIndex">					
		<view class="phototitle">拍照</view>
		<view class="cameraDiv">
			<view class="cameraChild" @click="cameraChild(index)" v-for="(item,index) in formdata.imgfiles">
				<image :src="item.imagesrc" :key="item.id" mode="scaleToFill" ref="cameraImg" class="cameraImg"/>
			</view>
		</view>
		<view class="formDiv">
			<b>上传时间：</b>{{formdata.uploadTime}}
		</view>
		<view class="formDiv">
			<b>上传地点：</b>{{formdata.uploadLocation}}
		</view>
		<view class="formDiv formDiv2">
			<view class="title"><b>变化类型：</b></view>
			<radio-group >
				<label v-for="(item,index) in radios" class="radioLabel">
					<radio :value="item.radioval" :key="item.id" :checked="index==current" :disabled="index!==current" /><text>{{item.radioval}}</text>
				</label>
			</radio-group>
		</view>
		<view class="formDiv" @click="drawRange">
			<b class="drawIcon">绘制范围：</b>
		</view>
		<view class="formDiv">
			<view><b>变化详情：（大于15字）</b></view>
			<textarea  placeholder="请输入您的详细描述" class="formTextarea"/>
		</view>
		<view>
			<button type="primary">提交</button>
		</view>
	</view>
</template>

<script>
	var _this;
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	export default {
		data(){	
			return{
				noimage:"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACtCAYAAAC0lU3IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKWSURBVHhe7dY7S51BFEDR/P8/JYilYGNlI1j5wF5svmC4CSlyOQeyyUPWggMzU02xYebLARExkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRHTwvPz8/H6+nracY6YBvf398fFxcW3+VhznpgGNzc3P2L6WHOemAZi2hPTQEx7YhqIaU9MAzHtiWkgpj0xDcS0J6aBmPbENBDTnpgGYtoT00BMe2IaiGlPTAMx7YlpIKY9MQ3EtPdpY3p6ejpub2+/BfC783NMvzt3d3fHy8vL6Zafy6eN6SOk7xH8a3N9fX265ecipr8wYvrPeOb+PB/wwUcAP8fEeWIaiGlPTAMx7YlpIKY9MQ3EtCemgZj2xDQQ056YBmLaE9NATHtiGohpT0wDMe2JaSCmPTENxLQnpoGY9sQ0ENOemAZi2hPTQEx7YhqIaU9Mg8fHx+Py8vK4uro6Hh4eTqf8ipgW3t7ejvf399OOc8RERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTESO4yuySSL97z4uOgAAAABJRU5ErkJggg==",							
				formdata:{
					imgfiles:[
						{
							imagesrc:"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACtCAYAAAC0lU3IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKWSURBVHhe7dY7S51BFEDR/P8/JYilYGNlI1j5wF5svmC4CSlyOQeyyUPWggMzU02xYebLARExkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRHTwvPz8/H6+nracY6YBvf398fFxcW3+VhznpgGNzc3P2L6WHOemAZi2hPTQEx7YhqIaU9MAzHtiWkgpj0xDcS0J6aBmPbENBDTnpgGYtoT00BMe2IaiGlPTAMx7YlpIKY9MQ3EtPdpY3p6ejpub2+/BfC783NMvzt3d3fHy8vL6Zafy6eN6SOk7xH8a3N9fX265ecipr8wYvrPeOb+PB/wwUcAP8fEeWIaiGlPTAMx7YlpIKY9MQ3EtCemgZj2xDQQ056YBmLaE9NATHtiGohpT0wDMe2JaSCmPTENxLQnpoGY9sQ0ENOemAZi2hPTQEx7YhqIaU9Mg8fHx+Py8vK4uro6Hh4eTqf8ipgW3t7ejvf399OOc8RERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTESO4yuySSL97z4uOgAAAABJRU5ErkJggg==",
							id:0,
						},
						{
							imagesrc:"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACtCAYAAAC0lU3IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKWSURBVHhe7dY7S51BFEDR/P8/JYilYGNlI1j5wF5svmC4CSlyOQeyyUPWggMzU02xYebLARExkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRHTwvPz8/H6+nracY6YBvf398fFxcW3+VhznpgGNzc3P2L6WHOemAZi2hPTQEx7YhqIaU9MAzHtiWkgpj0xDcS0J6aBmPbENBDTnpgGYtoT00BMe2IaiGlPTAMx7YlpIKY9MQ3EtPdpY3p6ejpub2+/BfC783NMvzt3d3fHy8vL6Zafy6eN6SOk7xH8a3N9fX265ecipr8wYvrPeOb+PB/wwUcAP8fEeWIaiGlPTAMx7YlpIKY9MQ3EtCemgZj2xDQQ056YBmLaE9NATHtiGohpT0wDMe2JaSCmPTENxLQnpoGY9sQ0ENOemAZi2hPTQEx7YhqIaU9Mg8fHx+Py8vK4uro6Hh4eTqf8ipgW3t7ejvf399OOc8RERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTESO4yuySSL97z4uOgAAAABJRU5ErkJggg==",
							id:1,
						},
						{
							imagesrc:"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACtCAYAAAC0lU3IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKWSURBVHhe7dY7S51BFEDR/P8/JYilYGNlI1j5wF5svmC4CSlyOQeyyUPWggMzU02xYebLARExkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRHTwvPz8/H6+nracY6YBvf398fFxcW3+VhznpgGNzc3P2L6WHOemAZi2hPTQEx7YhqIaU9MAzHtiWkgpj0xDcS0J6aBmPbENBDTnpgGYtoT00BMe2IaiGlPTAMx7YlpIKY9MQ3EtPdpY3p6ejpub2+/BfC783NMvzt3d3fHy8vL6Zafy6eN6SOk7xH8a3N9fX265ecipr8wYvrPeOb+PB/wwUcAP8fEeWIaiGlPTAMx7YlpIKY9MQ3EtCemgZj2xDQQ056YBmLaE9NATHtiGohpT0wDMe2JaSCmPTENxLQnpoGY9sQ0ENOemAZi2hPTQEx7YhqIaU9Mg8fHx+Py8vK4uro6Hh4eTqf8ipgW3t7ejvf399OOc8RERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTESO4yuySSL97z4uOgAAAABJRU5ErkJggg==",
							id:2,
						}
					],
					uploadTime:"2020",
					uploadLocation:'经纬度',	
					radioVal:"拆除",
					textContent:""
				},				
				radios:[
					{
						id:0,
						radioval:"新增"
					},
					{
						id:1,
						radioval:"拆除"
					},
					{
						id:2,
						radioval:"改造"
					},
				],
				current:0,
			}
		},
		mounted(){
			_this=this;
			_this.getforInf();
			setInterval(_this.getTime(),1000);
		},
		methods:{
			getforInf(){
				let currentIndex= window.location.href.split('current=')[1];
				_this.current=Number(currentIndex);
				_this.formdata.radioVal=_this.radios[_this.current].radioval;//radio值
				_this.$jweixin.getLocation({
					type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					  success: function (res) {
					    let latitude = res.latitude; 
					    let longitude = res.longitude;
						_this.formdata.uploadLocation="经度:"+longitude+"，纬度："+latitude;
					  },
					  fail:function(err){
					  	console.log(JSON.stringify(err));
					  }
				});	
			},
			getTime(){
				  let yy = new Date().getFullYear();
				  let mm = new Date().getMonth()+1;
				  let dd = new Date().getDate();
				  let hh = new Date().getHours();
				  let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
				  let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
				  _this.formdata.uploadTime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;//时间
			},
			cameraChild(index){
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: function (res) {
						console.log(res);
						_this.formdata.imgfiles[index].imagesrc=res.tempFiles[0].path;
				    }
				});
			},
			drawRange(){
				uni.navigateTo({
					url:"/pages/fxbhbtn/drawIndex"
				})
			},
		},
	    // components: {uniCollapse,uniCollapseItem}
	}
</script>

<style>
	.bhfxIndex{padding: 0 5px;}
	.phototitle{font-weight: bold;padding:0 0 5px 0;}
	.cameraDiv{height: 200px;width: 100%;display: flex;justify-content:space-around;}
	.formDiv{margin: 5px 0;border-bottom: solid 1px lightgray;padding: 5px 0;}
	.formDiv2{display: flex;justify-content: flex-start;}
	.cameraChild{width: 33.33%;}
	.cameraImg{width:100%;height:100%;border: solid 1px lightgray;}
	.radioLabel{margin: 0 5px;}
	.formTextarea{width: 100%;height: 200rpx;background: lightgray;}
	.drawIcon{padding-right: 30px;background-repeat: no-repeat;background-position:right center;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAA70lEQVQ4T53UMQ4BQRTG8f/eQK8RF0CrcgRRSkQ0KgkHcAiJSjRuwA2IC3ACoVThBOSTeTLWrt2dqXZ25/3y5u28iQgbVWAJbIC5iCjAEbIHyi52KDQEOgI1L4En0CkC1YE1MAIWXkYyV3khIVugBNyBrquRtncFmnkgH7EdGTYFesApC0pCDLsAFZv8g/4hD6AFqPDvkQYVQtKgwkgSFITEoWDEh1T9gzsn8a75KWxSW1mxlc0E6McW5UIsI53WGzBwv9Sw3IhBbddDmhumd1/nJOuW0NZmwNhb2HD9dM4K9r8L0uWkoJ17LhL/WfsCWMU1JIGwhBAAAAAASUVORK5CYII=");}
	/* @import url("./css/main.css"); */
</style>