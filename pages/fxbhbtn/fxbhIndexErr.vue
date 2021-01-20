<template>
	<view style="width: 100%;height: 100%;" class="containerWrap">
		<view class="container" :class="{istuban2:istuban2}">
			<view class="maptitle"  v-show="showContent">图斑</view>
			<view class="mymap" id="mymap" :class="{'istuban':istuban}">			
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
				<view class="tollsix">
					<view class="clearControl tollIcon" @click="drawEventClear"></view>
				</view>
				<view class="tollfive" >
					<view class="pencilControl tollIcon" @click="drawEvent"></view>
				</view>
			</view>
			<view class="bottomBar">
				<view v-show="!showContent" >
					<button type="primary" size="mini" @click="backContent" class="backContent">保存</button>
				</view>
			</view>
		</view>
		<!-- dierye -->
		<view class="bhfxIndex" v-show="showContent" >
			<view class="phototitle">拍照</view>
			<view class="cameraDiv">
				<view class="cameraChild" @click="cameraChild(index)" v-for="(item,index) in formdata.imgfiles">
					<image :src="item.imagesrc" :key="item.id" mode="scaleToFill" ref="cameraImg" class="cameraImg"/>
				</view>
			</view>
			<view class="formDiv">
				<b>上传时间：</b>{{formdata.SUNTIME}}
			</view>
			<!-- <view class="formDiv">
				<b>拍照地点：</b>{{formdata.bhlocation}}
			</view> -->
			<view class="formDiv formDiv2" style="border-bottom: none;">
				<view class="title"><b>变化类型：</b></view>
				<radio-group @change="bhtypeVal">
					<label v-for="(item,index) in radios" class="radioLabel">
						<radio :value="item.radioval" :key="item.id" :checked="index==current" /><text>{{item.radioval}}</text>
					</label>
				</radio-group>
			</view>
			<view class="formDiv" style="padding-left: 80px;">
				前期：
				<select  @change="selectOne" id="selectOne">
				  <option value =""></option>
				  <option value ="建筑">建筑</option>
				  <option value ="道路">道路</option>
				  <option value="绿地">绿地</option>
				  <option value="裸地">裸地</option>
				  <option value="绿网">绿网</option>
				</select>
				后期：
				<select  @change="selectTwo" id="selectTwo">
				  <option value =""></option>
				  <option value ="建筑">建筑</option>
				  <option value ="道路">道路</option>
				  <option value="绿地">绿地</option>
				  <option value="裸地">裸地</option>
				  <option value="绿网">绿网</option>
				</select>
			</view>
			<view class="formDiv" @click="drawRange">
				<b class="drawIcon">绘制范围：</b>
			</view>
			<view class="formDiv">
				<view><b>变化详情：（大于15字）</b></view>
				<textarea  placeholder="请输入您的详细描述" class="formTextarea" @blur="getTextcontent"/>
			</view>
			<view>
				<button type="primary" @click="submitImgs">提交</button>
			</view>
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
							name: 'POI',
							checked: 'true'
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
						SUNTIME:"2020",
						BHTYPE:"拆除",
						BHREMARK:"",						
						BHBEFORE:'绿地',
						BHAFTER:'裸地',
						bhlocation:'经纬度',	
						graphicId:2020,
						oldGraphicId:2019,
						newType:'纠错',
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
					showContent:true,
					draw:null,
					addGraphic:null,
					imgfilesNew:[
						{
							imagesrc:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
							id:0,
						},
						{
							imagesrc:"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACtCAYAAAC0lU3IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKWSURBVHhe7dY7S51BFEDR/P8/JYilYGNlI1j5wF5svmC4CSlyOQeyyUPWggMzU02xYebLARExkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRHTwvPz8/H6+nracY6YBvf398fFxcW3+VhznpgGNzc3P2L6WHOemAZi2hPTQEx7YhqIaU9MAzHtiWkgpj0xDcS0J6aBmPbENBDTnpgGYtoT00BMe2IaiGlPTAMx7YlpIKY9MQ3EtPdpY3p6ejpub2+/BfC783NMvzt3d3fHy8vL6Zafy6eN6SOk7xH8a3N9fX265ecipr8wYvrPeOb+PB/wwUcAP8fEeWIaiGlPTAMx7YlpIKY9MQ3EtCemgZj2xDQQ056YBmLaE9NATHtiGohpT0wDMe2JaSCmPTENxLQnpoGY9sQ0ENOemAZi2hPTQEx7YhqIaU9Mg8fHx+Py8vK4uro6Hh4eTqf8ipgW3t7ejvf399OOc8RERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTESO4yuySSL97z4uOgAAAABJRU5ErkJggg==",
							id:1,
						},
						{
							imagesrc:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
							id:2,
						},
					],
					// istuban:true,
					// istuban2:true
					istuban:false,
					istuban2:false
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
			},
			onShow(){
				_this=this;
				// let [longLati,longitudeStr,latitudeStr]=[window.location.href.split('?')[1].split('='),longLati[1],longLati[3]];
				let longLati=window.location.href.split('?')[1].split('&');
				let longitudeStr=Number(longLati[0].split('=')[1]);
				let latitudeStr=Number(longLati[0].split('=')[1]);
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
			},
			methods: {
				creatMapview(){
					esriLoader.loadModules(['esri/Map','esri/views/MapView','esri/layers/FeatureLayer',"esri/layers/TileLayer","esri/layers/WebTileLayer",
					"esri/views/draw/Draw","esri/layers/GraphicsLayer","esri/layers/MapImageLayer","esri/PopupTemplate"],{
						css:true
					})
					.then(([Map,MapView,FeatureLayer,TileLayer,WebTileLayer,Draw,GraphicsLayer,MapImageLayer,PopupTemplate])=>{
						let map = new Map({});
						this.map=map;
						this.view = new MapView({
							container:'mymap',
							map:map,
							center:[this.longitudeData,this.latitudeData],
							zoom:8,
							maxZoom:9,//最大空间等级
							minZoom:0,//最小空间等级
						});
						this.view.ui._removeComponents(['zoom']);//去掉缩放图标
						this.view.ui._removeComponents(["attribution"]);//去掉ersilogo
						//draw工具
						this.draw = new Draw({
						  view: this.view
						});
						let imageLayer2=new MapImageLayer({
							url:"bhfx.miyanoshiho.com/arcgis/rest/services/GuoTuDuCha/GTDC/MapServer",
							
						  });
						map.add(imageLayer2);//模拟天地
						//影像切片
						let imageLayer=new TileLayer({
							//影像服务"esri/layers/ImageryLayer"
							// url: "https://landsat2.arcgis.com/arcgis/rest/services/Landsat8_Views/ImageServer"							
							//MapServer"结尾:"esri/layers/MapImageLayer"动态服务，无切片信息；
							//MapServer"结尾:esri/layers/TileLayer"或者"esri/layers/WebTileLayer"切片服务有切片信息 	
							// url:"https://elevation3d.arcgis.com/arcgis/rest/services/NatGeo_World_Map/MapServer"
							url:"bhfx.miyanoshiho.com/arcgis/rest/services/2019_HP/MapServer",
							visible:false
						  });
						map.add(imageLayer);//影像切片图											
						// let webTile=new WebTileLayer({
						//    urlTemplate: 'https://stamen-tiles-{subDomain}.a.ssl.fastly.net/terrain/{level}/{col}/{row}.png',
						//    subDomains: ['a', 'b', 'c', 'd'],
						//    visible:false
						//  });
						// map.add(webTile);//天地图						
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
						let template={
							title: "变化发现",
							content: [{
									type: "fields",
									fieldInfos: [{
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
										fieldName: "BHAFTER",
										label: "变化后地点",
										format: {
											places: 0,
											digitSeparator: true
										}
									}, {
										fieldName: "BHREMARK",
										label: "变化详情",
										type: "string"
									}]
								},
								{ // Autocasts as new MediaContent()
								  type: "media",
								  mediaInfos: [ {
								    // title: "<b>现场图片</b>",
								    type: "image",
								    value: {
								      sourceURL:_this.imgfilesNew[0].imagesrc
								    }
								  },
								  {
								    // title: "<b>现场图片</b>",
								    type: "image",
								    value: {
								      sourceURL:_this.imgfilesNew[1].imagesrc
								    }
								  },{
								    // title: "<b>现场图片</b>",
								    type: "image",
								    value: {
								      sourceURL:_this.imgfilesNew[2].imagesrc
								    }
								  }]
								},]
						}
						const layerfeaturePoi = new FeatureLayer({
						  // url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0',
						  url:"http://192.168.1.101:6080/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX/FeatureServer/0",
						  // visible:false,
						  // outFields: ["*"],
						  // popupTemplate: template
						});
						// layerfeaturePoi.popupTemplate.overwriteActions = true;//去掉弹框缩放
						const layerfeatureHouse = new FeatureLayer({
						  // url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1',
						  url:"http://192.168.1.101:6080/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX/FeatureServer/0",
						  visible:false
						});
						const layerfeatureRoad = new FeatureLayer({
						  // url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2',
						  url:"http://192.168.1.101:6080/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX/FeatureServer/0",
						  visible:false
						});
						map.addMany([layerfeaturePoi,layerfeatureHouse,layerfeatureRoad]);						
						// 添加graphiclayer
						// var gralayer = new GraphicsLayer();
						// map.add(gralayer);
						_this.view.on('click',function(event){
							let screenPoint={
								x:event.x,
								y:event.y
							}
							if(_this.showContent){
								_this.view.hitTest(screenPoint).then(function(response){
									if(response.results.length>0){
										let result=response.results[0].graphic;alert(result.attributes.OBJECTID);
										_this.oldGraphicId=result.attributes.OBJECTID;//获取点击图斑的的id（原图形的id）
									}
								})
							}
						})
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
					let	values = e.detail.value;
					for (let i = 0, lenI = items.length; i < lenI; ++i) {
						const item = items[i]
						if(values.includes(item.value)){
							this.$set(item,'checked',true);
							this.map.layers.items[3+i].visible = true;
						}else{
							this.$set(item,'checked',false);
							this.map.layers.items[3+i].visible = false;
						}
					}
				},
				getTextcontent(e){
					let	values = e.detail.value;
					this.formdata.BHREMARK=values;
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
							    var speed = res.speed; // 速度，以米/每秒计
							    var accuracy = res.accuracy; // 位置精度								
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
				getforInf(){//获取拍照地点					
					_this.$jweixin.getLocation({
						type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
						  success: function (res) {
						    let latitude = res.latitude; 
						    let longitude = res.longitude;
							_this.formdata.bhlocation="经度:"+longitude+"，纬度："+latitude;
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
					  _this.formdata.SUNTIME = yy+'/'+mm+'/'+dd+' '+hh+':'+mf;//时间
				},
				cameraChild(index){
					uni.chooseImage({
					    count: 1, //默认9
					    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					    sourceType: ['album'], //从相册选择
					    success: function (res) {
							_this.formdata.imgfiles[index].imagesrc=res.tempFiles[0].path;
							_this.getforInf();//获取拍照地点
							// request({//获取图片路径
							// 	url:'/api/photos',
							// 	data: {
							// 		imgurl:res.tempFiles[0].path
							// 	},
							// })
							// .then((res)=>{
							// 	_this.formdata.imgfilesNew[index].imagesrc=res.tempFiles[0].path;
							// })	
					    }
					});
				},
				bhtypeVal(e){
					this.formdata.BHTYPE=e.detail.value;
				},
				selectOne(){
					this.formdata.BHBEFORE=document.getElementById('selectOne').value;
				},
				selectTwo(){
					this.formdata.BHAFTER=document.getElementById('selectTwo').value;
				},
				drawRange(){
					this.showContent=false;
					this.istuban=false;
					this.istuban2=false;
					this.view.on('resize', function(e){
						console.log(e,_this.view);
						// for(const item of _this.map.layers.items){
						// 	item.refresh();debugger
						// }
						// _this.view.center=[this.longitudeData,this.latitudeData];
					})
				},
				drawEventClear(){
					_this.view.graphics.removeAll();
				},
				drawEvent(){//
						var action =_this.draw.create("polygon");					
						action.on("vertex-add", function (evt) {
							_this.createPolygonGraphic(evt.vertices);
						});
						// action.on("vertex-remove", function (evt) {
						// 	createPolygonGraphic(evt.vertices);
						// });
						action.on("cursor-update", function (evt) {
							_this.createPolygonGraphic(evt.vertices);
						});
						action.on("draw-complete", function (evt) {
							_this.createPolygonGraphic(evt.vertices);
						});		
				},
				createPolygonGraphic(vertices){
					_this.view.graphics.removeAll();
					var polygon = {
					  type: "polygon", // autocasts as Polygon
					  rings: vertices,
					  spatialReference: _this.view.spatialReference
					};
					esriLoader.loadModules(["esri/Graphic"])
					  .then(([Graphic])=>{
						_this.addGraphic = new Graphic({
							geometry: polygon,
							symbol: {
							  type: "simple-fill", // autocasts as SimpleFillSymbol
							  color: [226, 119, 40,0.1],
							  style: "solid",
							  outline: {  // autocasts as SimpleLineSymbol
								color: "red",
								width: 1
							  }
							},
							// attributes: _this.formdata
						});
						_this.addGraphic.attributes['SUNTIME']=_this.formdata.SUNTIME;
						_this.addGraphic.attributes['BHTYPE']=_this.formdata.BHTYPE;
						_this.addGraphic.attributes['BHREMARK']=_this.formdata.BHREMARK;
						_this.addGraphic.attributes['BHBEFORE']=_this.formdata.BHBEFORE;
						_this.addGraphic.attributes['BHAFTER']=_this.formdata.BHAFTER;
						_this.addGraphic.attributes['bhlocation']=_this.formdata.bhlocation;
						_this.addGraphic.attributes['oldGraphicId']=_this.formdata.oldGraphicId;
						// _this.addGraphic.attributes['graphicId']=_this.formdata.OBJECTID;
						_this.view.graphics.add(_this.addGraphic);
					 })
				    
				 },
				backContent(){
					_this.showContent=true;
					_this.view.graphics.removeAll();
					// this.istuban=true;
					// this.istuban2=true;
				},
				submitImgs(){
					if(this.formdata.BHREMARK.length<15){
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '变化详情不能少于15个字'
						});
					}else{
						_this.map.layers.items[3].applyEdits({
						    addFeatures: [_this.addGraphic]
						});												
						_this.map.layers.items[3].queryFeatures().then(function (results) {
						 	_this.formdata.graphicId=results.features[results.features.length-1].attributes.OBJECTID;//获取最后添加图形的OBJECTID
						});					
						_this.map.layers.items[3].refresh();
						// uni.request({
						//     url: 'https://www.example.com/request'
						//     data: {
						//         imgs:_this.formdata.imgfiles,
						// 		   graphicId:_this.formdata.graphicId,
						//		   oldGraphicId:_this.oldGraphicId
						//     },
						//     success: (res) => {
						//         console.log(res.data);									
								   uni.redirectTo({
									   url:"/pages/fxbhbtn/fxbhIndex"
								   })
						//     }
						// });
					}
				}				
			}
		}
</script>

<style>
	@import url("./css/fxbhIndex.css");
	
		.bhfxIndex{padding: 0 5px;
			position: absolute;left: 0;top: 120px;right: 0;bottom: 0;
			background-color: #FFFFFF;
		}
		.maptitle{font-weight: bold;padding:0 0 0 5px;}
		.phototitle{font-weight: bold;padding:0 0 5px 0;}
		.cameraDiv{height: 100px;width: 100%;display: flex;justify-content:space-around;}
		.formDiv{margin: 5px 0;border-bottom: solid 1px lightgray;padding: 5px 0;}
		.formDiv2{display: flex;justify-content: flex-start;}
		.cameraChild{width: 33.33%;}
		.cameraImg{width:100%;height:100%;border: solid 1px lightgray;}
		.radioLabel{margin: 0 5px;}
		.formTextarea{width: 100%;height: 150rpx;background: lightgray;}
		.drawIcon{padding-right: 30px;background-repeat: no-repeat;background-position:right center;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAA70lEQVQ4T53UMQ4BQRTG8f/eQK8RF0CrcgRRSkQ0KgkHcAiJSjRuwA2IC3ACoVThBOSTeTLWrt2dqXZ25/3y5u28iQgbVWAJbIC5iCjAEbIHyi52KDQEOgI1L4En0CkC1YE1MAIWXkYyV3khIVugBNyBrquRtncFmnkgH7EdGTYFesApC0pCDLsAFZv8g/4hD6AFqPDvkQYVQtKgwkgSFITEoWDEh1T9gzsn8a75KWxSW1mxlc0E6McW5UIsI53WGzBwv9Sw3IhBbddDmhumd1/nJOuW0NZmwNhb2HD9dM4K9r8L0uWkoJ17LhL/WfsCWMU1JIGwhBAAAAAASUVORK5CYII=");}
		.istuban{height: calc(100% - 30px);}
		.istuban2{width: 100%;height: 120px;font-size:16px;}
</style>
