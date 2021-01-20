<template>
	<view class="container">
		<view class="mymap" id="mymap">			
		</view>
		<view class="rightToll">
			<view class="tollone">
				<view class="uni-list" v-show="!layersFrame">
					<radio-group @change="radioChange">
						<label class="uni-list-cell" v-for="(item, index) in radioitems" :key="item.value">
							<view>
								<radio :value="item.value" :checked="index === current" />
							</view>
							<view>{{item.name}}</view>
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
							<view>{{item.name}}</view>
						</label>
					</checkbox-group>
				</view>
				<view class="datassControl tollIcon" @click="datasframeControl"></view>
			</view>
			<view class="tollthree">
				<view class="localControl tollIcon" @click="localtionControl"></view>
			</view>
			<view class="tollfour">
				<view class="pencilControl tollIcon" @click="drawEvent"></view>
			</view>
		</view>
		<view class="bottomBar">
			<button type="primary" size="mini" @click="backContent" class="backContent">保存</button>
		</view>
	</view>
</template>

<script>
	var _this;
	import esriLoader from 'esri-loader';
	import {appLoginWx,request} from '@/pages/network/appLoginWx.js'
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
							name: '卫星地图',
							checked: 'true'
						},
						{
							value: 'skyMap',
							name: '天地图'							
						},
					],
					checkboxitems: [
						{
							value: 'poi',
							name: 'POI'
						},
						{
							value: 'house',
							name: '房屋'							
						},
						{
							value: 'road',
							name: '道路'							
						},
					],
					current: 0,
					longitudeData:0,
					latitudeData:0,
					resconfig:null,
					view:null,
					symbol:null,
					renderer:null,
					draw:null
				}
			},
			mounted() {
			},
			beforeDestroy(){
				if(this.view){
					this.view.container = null;
				}
			},
			onLoad(options) {
				// console.log('web',options,this);
				// this.longitudeData=Number(options.longitude);
				// this.latitudeData=Number(options.latitude);
			},
			onShow(){
				_this=this;
				var url1= window.location.href.split('#')[0];//获取网页ip
				request({
					url:'/api/wxuser/getconfig',
					method:"POST",
					data: {
						url:url1
					},
				})
				.then((res)=>{
					_this.resconfig = res.data.data;
					_this.$jweixin.config({
					  // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc会打印。
					  appId: 'wx4d844e46e277faa1', // 必填，公众号的唯一标识
					  timestamp:_this.resconfig.timestamp , // 必填，生成签名的时间戳
					  nonceStr: _this.resconfig.nonceStr, // 必填，生成签名的随机串
					  signature: _this.resconfig.signature,// 必填，签名
					  jsApiList: ["getLocation"] ,// 必填，需要使用的JS接口列表
					});
					//this.$jweixin.miniProgram.getEnv(function(res){})
					_this.$jweixin.getLocation({
						type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
						  success: function (res) {
						    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						    // var speed = res.speed; // 速度，以米/每秒计
						    // var accuracy = res.accuracy; // 位置精度
							_this.longitudeData=Number(longitude);
							_this.latitudeData=Number(latitude );
							_this.creatMapview();//创建地图
						  },
						  fail:function(err){
						  	console.log(JSON.stringify(err))
						  }
					})
				},(err)=>{
					console.log(JSON.stringify(err))
				})
			},
			methods: {
				creatMapview(){
					esriLoader.loadModules(['esri/Map','esri/views/MapView','esri/layers/FeatureLayer',"esri/layers/TileLayer","esri/layers/WebTileLayer",
					"esri/views/draw/Draw","esri/layers/GraphicsLayer"],{
						css:true
					})
					.then(([Map,MapView,FeatureLayer,TileLayer,WebTileLayer,Draw,GraphicsLayer])=>{
						let map = new Map({
							// basemap:'streets',
						});
						this.map=map;
						this.view = new MapView({
							container:'mymap',
							map:map,
							center:[this.longitudeData,this.latitudeData],
							zoom:12,
							// zoom:5,
						});
						this.view.ui._removeComponents(['zoom']);//去掉缩放图标
						this.view.ui._removeComponents(["attribution"]);//去掉ersilogo
						// ---
						_this.draw = new Draw({
						  view: _this.view
						});
						// ---
						let imageLayer=new TileLayer({
							//影像服务"esri/layers/ImageryLayer"
							// url: "https://landsat2.arcgis.com/arcgis/rest/services/Landsat8_Views/ImageServer"							
							//MapServer"结尾:"esri/layers/MapImageLayer"动态服务，无切片信息；
							//MapServer"结尾:esri/layers/TileLayer"或者"esri/layers/WebTileLayer"切片服务有切片信息 	
							url:"https://elevation3d.arcgis.com/arcgis/rest/services/NatGeo_World_Map/MapServer"
							// url: "http://192.168.1.163:6080/arcgis/rest/services/CYImage/MapServer"
						  });
						map.add(imageLayer);//影像切片图
						let webTile=new WebTileLayer({
						   urlTemplate: 'https://stamen-tiles-{subDomain}.a.ssl.fastly.net/terrain/{level}/{col}/{row}.png',
						   subDomains: ['a', 'b', 'c', 'd'],
						   visible:false
						 });
						map.add(webTile);//天地图
						// 坐标标记
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
						  url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0',
						  visible:false
						});
						const layerfeatureHouse = new FeatureLayer({
						  url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1',
						  visible:false
						});
						const layerfeatureRoad = new FeatureLayer({
						  url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2',
						  visible:false
						});
						map.addMany([layerfeaturePoi,layerfeatureHouse,layerfeatureRoad]);
						// view.map.addMany([imageLayer,trailheadsLayer])
						var gralayer = new GraphicsLayer();
						map.add(gralayer);
					})
				},
				radioChange(evt) {
					if(evt.target.value=="imgMap"){
						this.map.layers.items[0].visible=this.showLayer
						this.map.layers.items[1].visible=!this.showLayer
					}else{
						this.map.layers.items[0].visible=!this.showLayer
						this.map.layers.items[1].visible=this.showLayer
					}
				},
				layerframeControl(){
					this.layersFrame=!this.layersFrame;
				},
				checkboxChange(e) {
					let items = this.checkboxitems;
					let	values = e.detail.value;debugger
					for (let i = 0, lenI = items.length; i < lenI; ++i) {
						const item = items[i]
						if(values.includes(item.value)){
							this.$set(item,'checked',true);
							this.map.layers.items[2+i].visible = true;
						}else{
							this.$set(item,'checked',false);
							this.map.layers.items[2+i].visible = false;
						}
					}
				},
				datasframeControl(){
					this.datasFrame=!this.datasFrame
				},
				localtionControl(){					
					// this.$jweixin.miniProgram.getEnv(function(res){
						_this.$jweixin.getLocation({
							type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
							  success: function (res) {
							    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
							    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
							    // var speed = res.speed; // 速度，以米/每秒计
							    // var accuracy = res.accuracy; // 位置精度								
								_this.longitudeData=-Number(longitude);
								_this.latitudeData=Number(latitude);
								let updatelayer=_this.map.layers.items[2];//标记图层
								_this.view.center=[_this.longitudeData,_this.latitudeData];
								const updateEdit={
										updateFeatures:[{
											"geometry":{
												type: 'point',
												longitude: _this.longitudeData, // 经度116.29845,39.95933
												latitude: _this.latitudeData, // 纬度
											},
											"attributes":{
											   "ObjectID": updatelayer.source.items[0].attributes.ObjectID,
											}
										}]
									}								
								updatelayer.applyEdits(updateEdit)
								.then(function(editsResult){
									console.log(editsResult)
								})								
							  },
							  fail:function(err){
							  	console.log(JSON.stringify(err))
							  }
						})
					// })										
				},
				drawEvent(){//
						var action =_this.draw.create("polygon");					
						action.on("vertex-add", function (evt) {
							createPolygonGraphic(evt.vertices,_this.view.graphics);
						});
						// action.on("vertex-remove", function (evt) {
						// 	createPolygonGraphic(evt.vertices);
						// });
						action.on("cursor-update", function (evt) {
							createPolygonGraphic(evt.vertices,_this.view.graphics);
						});
						action.on("draw-complete", function (evt) {
							createPolygonGraphic(evt.vertices,_this.map.layers.items[6]);
						});
						// action.on(["vertex-add","cursor-update","draw-complete"], function (evt) {
						// 	createPolygonGraphic(evt.vertices);
						// });
						function createPolygonGraphic(vertices,layerGraphic){
							_this.view.graphics.removeAll();
							var polygon = {
							  type: "polygon", // autocasts as Polygon
							  rings: vertices,
							  spatialReference: _this.view.spatialReference
							};
							esriLoader.loadModules(["esri/Graphic"])
							  .then(([Graphic])=>{
								var graphic = new Graphic({
									geometry: polygon,
									symbol: {
									  type: "simple-fill", // autocasts as SimpleFillSymbol
									  color: [226, 119, 40,0.1],
									  style: "solid",
									  outline: {  // autocasts as SimpleLineSymbol
										color: "red",
										width: 1
									  }
									}
								});
								layerGraphic.add(graphic);
							 })
						    
						  }
						// function createPolygonGraphic2(vertices){
						// 	_this.view.graphics.removeAll();
						// 	var polygon = {
						// 	  type: "polygon", // autocasts as Polygon
						// 	  rings: vertices,
						// 	  spatialReference: _this.view.spatialReference
						// 	};
						// 	esriLoader.loadModules(["esri/Graphic"])
						// 	  .then(([Graphic])=>{
						// 		var graphic = new Graphic({
						// 			geometry: polygon,
						// 			symbol: {
						// 			  type: "simple-fill", // autocasts as SimpleFillSymbol
						// 			  color: [226, 119, 40,0.1],
						// 			  style: "solid",
						// 			  outline: {  // autocasts as SimpleLineSymbol
						// 				color: "red",
						// 				width: 1
						// 			  }
						// 			}
						// 		});
						// 		_this.map.layers.items[6].add(graphic);
						// 	 })
						    
						//   }

						
				},
				backContent(){
					uni.navigateBack({
						delta: 1
					})
				},
			}
		}
</script>

<style>
	@import url("./css/fxbhIndex.css");
	/* .backContent{width: 100px;} */
</style>
