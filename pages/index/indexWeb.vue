<template>
	<view class="container">
		<view class="myinfs" v-show="myinf">
			<view class="personalCenter2">
				<view class="bottomBtns2 personal2"></view>
				<view class="personalInfo2">
					<view>{{phone}}</view>
				</view>
			</view>	
			<view class="tastTab">
				<span :class="{'tastTitle':!doTaskShow}" @click='bhfxInfs'>变化发现</span> <span :class="{'tastTitle':doTaskShow}" @click='lqrwInfs'>领取任务</span>
			</view>
			<uni-collapse v-show="!doTaskShow">
			    <uni-collapse-item :title="'待处理('+pendingInf.length+')'" >
			        <view class="pendingInf">
						<ul class='lists'>
							<li v-for="item in pendingInf" :key="item.OBJECTID" @click="pendingEvent(item.OBJECTID)">
								变化类型：{{item.BHTYPE}}; 变换前：{{item.BHBEFORE}}; 变化后：{{item.BHAFTER}}; 单价：{{item.AMOUNT}}; 变化详情：{{item.BHREMARK}}; 上传时间：{{item.SUNTIME}};
							</li>
						</ul>
			        </view>
			    </uni-collapse-item>
				<uni-collapse-item :title="'已处理('+processedInf.length+')'" >
					<view class="processedInf">
						<ul class='lists'>
							<li v-for="item in processedInf" :key="item.OBJECTID" @click="processedEvent(item.OBJECTID)">
								变化类型：{{item.BHTYPE}}; 变换前：{{item.BHBEFORE}}; 变化后：{{item.BHAFTER}}; 单价：{{item.AMOUNT}};拒绝原因：{{item.REJECTRMK}}; 变化详情：{{item.BHREMARK}}; 上传时间：{{item.SUNTIME}};
							</li>
						</ul>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<uni-collapse v-show="doTaskShow">
			    <uni-collapse-item :title="'任务待处理('+pendingInf2.length+')'" >
			        <view class="pendingInf">
						<ul class='lists'>
							<li v-for="item in pendingInf2" :key="item.OBJECTID" @click="pendingEvent(item.OBJECTID)">
								变化类型：{{item.BHTYPE}}; 变换前：{{item.BHBEFORE}}; 变化后：{{item.BHAFTER}}; 单价：{{item.AMOUNT}}; 变化详情：{{item.BHREMARK}}; 上传时间：{{item.SUNTIME}};
							</li>
						</ul>
			        </view>
			    </uni-collapse-item>
				<uni-collapse-item :title="'已处理('+processedInf2.length+')'" >
					<view class="processedInf">
						<ul class='lists'>
							<li v-for="item in processedInf2" :key="item.OBJECTID" @click="processedEvent(item.OBJECTID)">
								变化类型：{{item.BHTYPE}}; 变换前：{{item.BHBEFORE}}; 变化后：{{item.BHAFTER}}; 单价：{{item.AMOUNT}};拒绝原因：{{item.REJECTRMK}}; 变化详情：{{item.BHREMARK}}; 上传时间：{{item.SUNTIME}};
							</li>
						</ul>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
		<view class="mymap" id="mymap">			
		</view>
		<!-- 顶部导航 -->
		<view class="navBar">
			<view class="navtop" @click="fxbhbtn">变化发现</view>
			<view class="navtop" @click="taskbtn">领取任务</view>	
		</view>
		<view class="rightToll">
			<view class="tollone">
				<view class="uni-list" v-show="!layersFrame">
					<radio-group @change="radioChange">
						<label class="uni-list-cell" v-for="(item, index) in radioitems" :key="item.value">
							<view>
								<radio :value="item.value" :checked="index === current" />
							</view>
							<view class="unilistcellName">{{item.name}}</view>
						</label>
					</radio-group>
				</view>
				<view class="layersControl tollIcon" @click="layerframeControl"></view>
			</view>
			<view class="tolltwo">
				<view class="uni-list" v-show="!datasFrame">
					<checkbox-group @change="checkboxChange">
						<label class="uni-list-cell" v-for="item in checkboxitems" :key="item.value">
							<view>
								<checkbox :value="item.value" :checked="item.checked" />
							</view>
							<view class="unilistcellName">{{item.name}}</view>
						</label>
					</checkbox-group>
				</view>
				<view class="datassControl tollIcon" @click="datasframeControl"></view>
			</view>
			<view class="tollthree">
				<view class="localControl tollIcon" @click="localtionControl"></view>
			</view>
			<view class="tollfour">
				<view class="helpControl tollIcon" @click="helpControl"></view>
			</view>
		</view>
		<view class="bottomBar">
			<span @click="toinfo">消息</span><span @click="tomine">我的</span>
		</view>
	</view>
</template>

<script>
	var _this;
	import esriLoader from 'esri-loader';
	import {appLoginWx,request,request2,VxgetLocation} from '@/pages/network/appLoginWx.js'
	// import UniPagination from '@/components/uni-pagination/uni-pagination.vue' //分页
		export default {
			data() {
				return {
					map:null,
					showLayer:true,
					layersFrame:true,
					datasFrame:true,
					radioitems: [
						{
							value: 'imgMap',
							name: '影像图',
							checked: 'true'
						},
						{
							value: 'skyMap',
							name: '电子地图'							
						},
					],
					checkboxitems: [
						{
							value: 'poi',
							name: '发现变化',
							checked: 'true'
						},
						// {
						// 	value: 'house',
						// 	name: '发现变化2'							
						// },
						// {
						// 	value: 'road',
						// 	name: '发现变化3'							
						// },
					],
					current: 0,
					longitudeData:0,
					latitudeData:0,
					resconfig:null,
					view:null,
					symbol:null,
					renderer:null,
					token:'',
					phone:'',
					myinf:false,
					doTaskShow:false,
					pendingInf:[],
					processedInf:[],
					pendingInf2:[],
					processedInf2:[],
					imgUrl:"http://bhfxxcx.natapp1.cc",
					imgfilesNew:[],
					template:{
						content: [{
								type: "fields",
								fieldInfos: [
									{
									fieldName: "OBJECTID",
									label: "OBJECTID",
									type: "number"
								},{
									fieldName: "ID",
									label: "唯一码",
									type: "string",
								},{
									fieldName: "BHTYPE",
									label: "变化类型",
									format: {
										places: 0,
										digitSeparator: true
									}
								},{
									fieldName: "SUNTIME",
									label: "提交时间",
									type: "string"
								}, {
									fieldName: "BHBEFORE",
									label: "变化前"										
								},{
									fieldName: "BHAFTER",
									label: "变化后"								
								}, {
									fieldName: "BHREMARK",
									label: "变化详情",
									type: "string"
								},{
									fieldName: "SUBUSER",
									label: "提交人员",
									type: "string"
								}]
							},
							{ // Autocasts as new MediaContent()
							  type: "media",
							  mediaInfos: [ {
								// title: "<b>现场图片</b>",
								type: "image",
								value: {
								  sourceURL:"",
								}
							  },
							  {
								// title: "<b>现场图片</b>",
								type: "image",
								value: {
								  sourceURL:"",
								}
							  },{
								// title: "<b>现场图片</b>",
								type: "image",
								value: {
								  sourceURL:"",
								}
							  },]
							},]
						},
					template2:{
						content: [{
								type: "fields",
								fieldInfos: [
									{
									fieldName: "OBJECTID",
									label: "OBJECTID",
									type: "number",								
								},{
									fieldName: "ID",
									label: "唯一码",
									type: "string",
								},{
									fieldName: "BHTYPE",
									label: "变化类型",
									format: {
										places: 0,
										digitSeparator: true
									}
								},{
									fieldName: "SUNTIME",
									label: "提交时间",
									type: "string"
								}, {
									fieldName: "BHBEFORE",
									label: "变化前"										
								},{
									fieldName: "BHAFTER",
									label: "变化后"								
								}, {
									fieldName: "BHREMARK",
									label: "变化详情",
									type: "string"
								},{
									fieldName: "SUBUSER",
									label: "提交人员",
									type: "string"
								}]
							},
							{ // Autocasts as new MediaContent()
							  type: "media",
							  mediaInfos: [ {
								// title: "<b>现场图片</b>",
								type: "image",
								value: {
								  sourceURL:"",
								}
							  },
							  {
								// title: "<b>现场图片</b>",
								type: "image",
								value: {
								  sourceURL:"",
								}
							  },{
								// title: "<b>现场图片</b>",
								type: "image",
								value: {
								  sourceURL:"",
								}
							  },]
							},]
						},
					unirender:{
						type:"unique-value",
						field:"AUDITRES",
						uniqueValueInfos:[
							{
								value:'1',
								symbol:{
								  type: "simple-fill", // autocasts as SimpleFillSymbol
								  color: [126, 119, 140,0.8],
								  style: "solid",
								  outline: {  // autocasts as SimpleLineSymbol
									color: "red",
									width: 1
								  }
								}
							},
							{
								value:'2',
								symbol:{
								  type: "simple-fill", // autocasts as SimpleFillSymbol
								  color: [226, 119, 40,0.8],
								  style: "solid",
								  outline: {  // autocasts as SimpleLineSymbol
									color: "red",
									width: 1
								  }
								}
							},
							{
								value:'',
								symbol:{
								  type: "simple-fill", // autocasts as SimpleFillSymbol
								  color: [124,206,124,0.8],
								  style: "solid",
								  outline: {  // autocasts as SimpleLineSymbol
									color: "blue",
									width: 1
								  }
								}
							},								
						]
					},
				}
			},
			// components:{
			// 	UniPagination
			// },
			mounted() {
			},
			beforeDestroy(){
				if(this.view){
					this.view.container = null;
				}
			},
			onShow(){				 
				_this=this;
				console.log('show',window.location.href)
				var url1= window.location.href.split('#')[0];//获取网页ip
				// var url1= window.location.href
				
				this.token=uni.getStorageSync('token');
				this.phone=uni.getStorageSync('phone');
				request({
					url:'/api/wxuser/getconfig',
					method:"POST",
					header: {'Authorization': _this.token},
					data: {
						url:url1
					},
				})
				.then((res)=>{
					_this.resconfig = res.data.data;
					console.log('weixinconfig',window.location.href)
					_this.$jweixin.config({
					  //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc会打印。
					  appId: 'wx4d844e46e277faa1', // 必填，公众号的唯一标识
					  timestamp:_this.resconfig.timestamp , // 必填，生成签名的时间戳
					  nonceStr: _this.resconfig.nonceStr, // 必填，生成签名的随机串
					  signature: _this.resconfig.signature,// 必填，签名
					  jsApiList: ["getLocation"] ,// 必填，需要使用的JS接口列表
					});
					//this.$jweixin.miniProgram.getEnv(function(res){})
				},(err)=>{
					console.log(JSON.stringify(err))
				})				
				_this.$jweixin.ready(()=>{
					_this.$jweixin.getLocation({
						type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
						  success: function (res) {
						    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						    // var speed = res.speed; // 速度，以米/每秒计
						    // var accuracy = res.accuracy; // 位置精度
							_this.longitudeData=Number(longitude);
							_this.latitudeData=Number(latitude );
							console.log(_this.longitudeData,_this.latitudeData);
							_this.creatMapview();//创建地图
						  },
						  fail:function(err){alert('err');
						  	console.log(JSON.stringify(err))
						  }
					});
				})				
				_this.$jweixin.error((res)=>{
					console.log(res)
				})
			},
			methods: {
				creatMapview(){
					esriLoader.loadModules(['esri/Map','esri/views/MapView','esri/layers/FeatureLayer',"esri/layers/TileLayer","esri/layers/WebTileLayer",
					"esri/widgets/Locate","esri/layers/MapImageLayer"],{
						css:true
					})
					.then(([Map,MapView,FeatureLayer,TileLayer,WebTileLayer,Locate,MapImageLayer])=>{
						let map = new Map({
							// basemap:'streets',
						});
						this.map=map;
						this.view = new MapView({
							container:'mymap',
							map:map,
							center:[this.longitudeData,this.latitudeData],
							zoom:15,
							// extent:{
							//   xmin: 420101.6635999996,
							//   ymin: 252937.16899999976,
							//   xmax: 597872.1663000002,
							//   ymax: 432527.02909999964,
							//   spatialReference: {
							// 	wkid: 2436
							//   }
							// }
						});
						this.view.ui._removeComponents(['zoom']);//去掉缩放图标
						this.view.ui._removeComponents(["attribution"]);//去掉ersilogo
						let key="f29efb9949daf6dea11ec683f5ddc278";
						let imgTiteLayer = new WebTileLayer({
						  urlTemplate:
						    "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
						    key,
						  // subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//{{subDomains}}
						  copyright: "天地图影像",
						  visible:false
						});
						let ciaBaseLayer = new WebTileLayer({
						  urlTemplate:
						    "http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
						    key,
						  copyright: "天地图影像注记",
						  visible:false
						});
						let vecTiteLayer = new WebTileLayer({
						  urlTemplate:
						    "http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
						    key,
						  copyright: "天地图矢量",
						});
						let cvaBaseLayer = new WebTileLayer({
						  urlTemplate:
						    "http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
						    key,
						  copyright: "天地图影像注记"
						});
						map.addMany([imgTiteLayer,ciaBaseLayer,vecTiteLayer,cvaBaseLayer]);	
						// // 坐标标记
						this.symbol = {
						   type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
						   url: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA0NjUxOTg3MDk4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1ODQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTEyNC40ODg3NzggODcwLjc4NDExMmEzODMuMDM5NzE5IDE1My4yMTU4ODggMCAxIDAgNzY2LjA3OTQzOSAwIDM4My4wMzk3MTkgMTUzLjIxNTg4OCAwIDEgMC03NjYuMDc5NDM5IDBaIiBmaWxsPSIjQUZGQ0ZFIiBwLWlkPSIzNTg1Ij48L3BhdGg+PHBhdGggZD0iTTUxNi40NjYwOTEgMC4wMDcxNWMyMTAuNjcxODQ2LTEuMjc2Nzk5IDM4MS43NjI5MiAxNjcuMjYwNjc3IDM4My4wMzk3MTkgMzc3LjkzMjUyMyAwIDIwOC4xMTgyNDgtMzgzLjAzOTcxOSA1MTUuODI2ODIyLTM4My4wMzk3MTkgNTE1LjgyNjgyMlMxMzMuNDI2MzcyIDU4Ni4wNTc5MjEgMTMzLjQyNjM3MiAzNzcuOTM5NjczQzEzNC43MDMxNzEgMTY3LjI2NzgyOCAzMDUuNzk0MjQ1LTEuMjY5NjQ5IDUxNi40NjYwOTEgMC4wMDcxNXoiIGZpbGw9IiMyRjc3RjEiIHAtaWQ9IjM1ODYiPjwvcGF0aD48L3N2Zz4=",
						   width: "20px",
						   height: "20px"
						 };
						const graphics = [{
							geometry: {
								type: 'point',
								longitude: _this.longitudeData, // 经度116.29845,39.95933
								latitude: _this.latitudeData, // 纬度
							}
						}];
						  // 设置渲染
						_this.renderer = {
							type: 'simple',
							symbol:_this.symbol,
						 };
						  // 创建要素图层
						const marklayer = new FeatureLayer({
							source: graphics,
							objectIdField: 'ObjectID',
							renderer:this.renderer,
						});
						map.add(marklayer);//添加标注
						// featruesLayer
						const layerfeaturePoi = new FeatureLayer({
						  url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX2000/FeatureServer/0",
						  // visible:false,
						  outFields: ["*"],
						  popupTemplate: _this.template,
						});
						// layerfeaturePoi.popupTemplate.overwriteActions = true;//zoom to按钮给去除
						layerfeaturePoi.renderer=this.unirender;
						map.add(layerfeaturePoi);
						// const layerfeatureHouse = new FeatureLayer({
						//    url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX2000/FeatureServer/0",
						//    visible:false
						// });
						// const layerfeatureRoad = new FeatureLayer({
						//    url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX2000/FeatureServer/0",
						//    visible:false
						// });
						// map.addMany([layerfeaturePoi,layerfeatureHouse,layerfeatureRoad]);						
						this.view.when(()=>{
							setTimeout(()=>{
								// document.querySelector('.esri-ui').style.width="70%";
								let esriUI=document.querySelector('.esri-ui').offsetHeight;
								let esriPopup=document.querySelector('.esri-popup');
								esriPopup.style.height='245px';console.log('esriui',document.querySelector('.esri-popup').childNodes);
								esriPopup.style.marginTop=(esriUI - 245)+'px';
								esriPopup.onclick=function(event){
									let classArr=event.target.classList;
									if(classArr.length>1){
										for (let classname of classArr) {//下一页上一页
											if(classname=="esri-popup__pagination-next-icon" || classname=="esri-popup__pagination-previous-icon"){	
												document.querySelector('.esri-feature__main-container').style.opacity=0;
												_this.popupPage();
											}
										}
									}
								};
							},2000);
						});
						_this.view.on('click',function(event){
							_this.view.hitTest(event).then(function(response){
								if(response.results.length>0){									
									let id=response.results.length==1?response.results[0].graphic.attributes.ID:response.results[1].graphic.attributes.ID;									
									//请求后台获取图片
									request2({
										url:'/api/bhfx/getphotos',
										header: {'Authorization':uni.getStorageSync('token')},
										data: {
											id:id
										},
									}).then((res)=>{
										if(res.data.Status=="success"){//点击图形更改图片路径
											let dataArr=res.data.Data;
											dataArr.forEach((item,index)=>{
												_this.template.content[1].mediaInfos[index].value.sourceURL=_this.imgUrl+item;
												_this.map.layers.items[5].popupTemplate.content[1].mediaInfos[index].value.sourceURL=_this.imgUrl+item;
											});
											_this.map.layers.items[5].popupTemplate=_this.template;//首次单击图片错误
										}else{//图片请求失败
											uni.showModal({
												title: '错误信息',
												content:'图片加载失败',
												showCancel: false,						
												confirmText: '关闭'
											})
											_this.map.layers.items[5].popupTemplate=_this.template2;//固定模板
										}											
									})
									let esriUI=document.querySelector('.esri-ui');
									esriUI.style.display='none';
									let getfeafields=setInterval(()=>{
										let popupcontentKey=document.getElementsByClassName('esri-feature-fields__field-header');
										let popupcontentVal=document.getElementsByClassName('esri-feature-fields__field-data');
										if(popupcontentKey.length>0){										
											console.log('getfields',popupcontentKey.length);											
											popupcontentKey.forEach((item,index)=>{
												if(index==0||index==1){
													item.style.display='none';
												}
											});
											popupcontentVal.forEach((item,index)=>{
												if(index==0||index==1){
													item.style.display='none';
												}
											});
											esriUI.style.display='block';
											clearInterval(getfeafields);
											// console.log("popupcontentKey",popupcontentKey)
										}
									},500);
								}
							})
						})
					})
				},
				popupPage(){
					setTimeout(function(){						
						_this.$nextTick(function(){
							let esriPopupId=document.querySelector('.esri-feature-fields__field-data').innerText;
							let objectIdstr=esriPopupId.substr(1);
							let id='';
							esriLoader.loadModules(["esri/tasks/support/Query"])
							.then(([Query])=>{
								const query=new Query();
								query.where= "OBJECTID = '"+objectIdstr +"'";
								_this.map.layers.items[5].queryFeatures(query).then(function(results){
								  let checkState=results.features[0].attributes.AUDITRES;
								  checkState==null?_this.checkstateShow=true:_this.checkstateShow=false;//
								  id=results.features[0].attributes.ID;
								  request2({
								  	url:'/api/bhfx/getphotos',
								  	header: {'Authorization':uni.getStorageSync('token')},
								  	data: {
								  		// objectId:esriPopupId
								  		id:id
								  	},
								  }).then((res)=>{									
								  	if(res.data.Status=="success"){
								  		// _this.map.layers.items[5].popupTemplate=_this.template;//更换图片模板
								  		let dataArr=res.data.Data;						
								  		dataArr.forEach((item,index)=>{
								  			_this.template.content[1].mediaInfos[index].value.sourceURL=_this.imgUrl+item;
								  			_this.map.layers.items[5].popupTemplate.content[1].mediaInfos[index].value.sourceURL=_this.imgUrl+item;
								  		});
								  		_this.map.layers.items[5].popupTemplate=_this.template;//更换图片模板
								  	}else{
								  		_this.map.layers.items[5].popupTemplate=_this.template2;//固定模板
								  	}
									let getfeafields=setInterval(()=>{
										let popupcontentKey=document.getElementsByClassName('esri-feature-fields__field-header');
										let popupcontentVal=document.getElementsByClassName('esri-feature-fields__field-data');
										if(popupcontentKey.length>0){											
											popupcontentKey.forEach((item,index)=>{
												if(index==0||index==1){
													item.style.display='none';
												}
											});
											popupcontentVal.forEach((item,index)=>{
												if(index==0||index==1){
													item.style.display='none';
												}
											});
											// clearInterval(getfeafields);
											console.log(popupcontentVal[0]);
										}
									},10);
									setTimeout(()=>{
										clearInterval(getfeafields);
										document.querySelector('.esri-feature__main-container').style.opacity=1;
									},100)
								  })
								});
							})							
										
						});
					},500)
				},
				radioChange(evt) {
					if(evt.target.value=="imgMap"){
						this.map.layers.items[0].visible=this.showLayer;
						this.map.layers.items[1].visible=this.showLayer;
						this.map.layers.items[2].visible=!this.showLayer;
						this.map.layers.items[3].visible=!this.showLayer;
					}else{
						this.map.layers.items[0].visible=!this.showLayer;
						this.map.layers.items[1].visible=!this.showLayer;
						this.map.layers.items[2].visible=this.showLayer;
						this.map.layers.items[3].visible=this.showLayer;
					}
				},
				layerframeControl(){
					this.layersFrame=!this.layersFrame;
				},
				checkboxChange(e) {
					let items = this.checkboxitems;
					let	values = e.detail.value;
					for (let i = 0, lenI = items.length; i < lenI; ++i) {
						const item = items[i]
						if(values.includes(item.value)){
							this.$set(item,'checked',true);
							this.map.layers.items[5+i].visible = true;
						}else{
							this.$set(item,'checked',false);
							this.map.layers.items[5+i].visible = false;
						}
					}
				},
				datasframeControl(){
					this.datasFrame=!this.datasFrame
				},
				localtionControl(){					
					// this.$jweixin.miniProgram.getEnv(function(res){
						VxgetLocation(_this);					
					// })										
				},
				helpControl(){//弹出帮助信息
					uni.showModal({	
						title: '帮助信息',					
					    content:`1.使用流程：授权登录注册授权。\n2.注意事项：外网连接外网连接外。\n3.奖金支付：累计积分兑换奖金累计积分兑换奖金。\n4.奖金提现：提现到微信零钱提现到微信零钱提现到微信零钱。
								`,
						showCancel: false,						
						confirmText: '关闭'
					})
						
				},
				fxbhbtn(){//跳到发现变化
					uni.redirectTo({//关闭当前，跳转
						url:"/pages/fxbhbtn/fxbhIndex"
					})
				},
				taskbtn(){//跳到任务
					uni.redirectTo({
						url:"/pages/taskbtn/taskIndex"
					})
				},
				tomine(){//跳到到我的
					uni.navigateTo({//保留当前，跳转
						url:"/pages/index/mine"
					})
				},
				toinfo(){//跳到消息
					// uni.navigateTo({
					// 	url:"/pages/index/mineInfo"
					// })
					this.myinf=true;
					//变化发现消息
					request2({
						url:'/api/bhfx/getbhfx',
						header: {'Authorization':uni.getStorageSync('token')},
						data: {
							type:"dcl",							
							currentPage:1
						},
					}).then((res)=>{
						if(res.data.Status=="success"){
							_this.pendingInf=res.data.Data;
						}
					});
					request2({
						url:'/api/bhfx/getbhfx',
						header: {'Authorization':uni.getStorageSync('token')},
						data: {
							type:"ycl",							
							currentPage:1
						},
					}).then((res)=>{
						if(res.data.Status=="success"){
							_this.processedInf=res.data.Data;
						}
					});
					// 任务消息
					request2({
						url:'/api/bhfx/getbhfx',
						header: {'Authorization':uni.getStorageSync('token')},
						data: {
							type:"dcl",							
							currentPage:1
						},
					}).then((res)=>{
						if(res.data.Status=="success"){
							_this.pendingInf2=res.data.Data;
						}
					});
					request2({
						url:'/api/bhfx/getbhfx',
						header: {'Authorization':uni.getStorageSync('token')},
						data: {
							type:"ycl",							
							currentPage:1
						},
					}).then((res)=>{
						if(res.data.Status=="success"){
							_this.processedInf2=res.data.Data;
						}
					});
				},
				bhfxInfs(){//tab
					this.doTaskShow=false;					
				},
				lqrwInfs(){//tab
					this.doTaskShow=true;
				},
				pendingEvent(val){
					this.graphicLocate(val);
				},
				processedEvent(val){
					this.graphicLocate(val);
				},
				graphicLocate(val){
					// let selectSymbol={
					// 	type:'simple-fill',
					// 	color:[30,159,255,0],
					// 	style:'solid',
					// 	outline:{color:[232,23,25,1],width:10}
					// }
					esriLoader.loadModules(["esri/tasks/support/Query","esri/Graphic"])
					.then(([Query,Graphic])=>{
						const query=new Query();
						query.where= "OBJECTID = '"+val +"'";
						_this.map.layers.items[5].queryFeatures(query).then(function(results){
							// results.features[0].geometry.extent.expand(1)
							_this.view.goTo({center:[results.features[0].geometry.extent.center.x,results.features[0].geometry.extent.center.y],zoom:17}).then(function () {					
								// _this.view.popup.open({
								// 	features: [results.features[0]],
								// 	location: results.features[0].geometry.centroid
								// })
								_this.view.graphics.removeAll();
								let addGraphic = new Graphic({
									geometry: results.features[0].geometry,
									symbol: {
									  type: "simple-fill", // autocasts as SimpleFillSymbol
									  color: [226, 119, 40,0.1],
									  style: "solid",
									  outline: {  // autocasts as SimpleLineSymbol
										color: "red",
										width: 1
									  }
									},
									attributes: _this.formdata
								});	
								_this.view.graphics.add(addGraphic);
								_this.myinf=false;
							});
						})
					})
				},
			}
		}
</script>

<style>
	@import url("./css/indexWeb.css");	
</style>
