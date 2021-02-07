<template>
	<view style="width: 100%;height: 100%;">
		<view class="container" v-show="showPageOne">
			<view class="mymap" id="mymap">			
			</view>
			<view class="rightToll">
				<view class="tollone">
					<view class="uni-list" v-show="!layersFrame">
						<radio-group @change="radioChange">
							<label class="uni-list-cell" v-for="(item, index) in radioitems" :key="item.value">
								<view>
									<radio :value="item.value" :checked="item.checked" />
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
				<!-- <view class="tollfour" v-show="!showPageThree">
					<view class="helpControlerr tollIcon"></view>
				</view> -->
				<view class="tollsix" v-show="showPageThree">
					<view class="clearControl tollIcon" @click="drawEventClear"></view>
				</view>
				<view class="tollfive" v-show="showPageThree">
					<view class="pencilControl tollIcon" @click="drawEvent"></view>
				</view>
				
			</view>
			<view class="bottomBar" v-show='!popupShow'>
				<view class="" v-show="showPageBars">
					<view class="bottomBtns bottomBtns1" @click="newaddBtn">				
					</view>
					<span >新增</span>
				</view>
				<view class="" v-show="showPageBars">
					<view  class="bottomBtns bottomBtns2" @click="dismantleBtn">
					</view>
					<span>拆除</span>
				</view>
				<view class="" v-show="showPageBars">
					<view class="bottomBtns bottomBtns3" @click="reformBtn">					
					</view>
					<span >改造</span>
				</view>
				<view v-show="!showPageBars" class="submitBtns">
					<button type="primary" size="mini" @click="backContent" class="backContent submitBtn">保存</button>
					<button type="primary" size="mini" @click="backContent2" class="submitBtn">取消</button>
				</view>
			</view>
		</view>
		<!-- 修改本图形 -->
		<!-- <view class="modifyOwn" v-show="popupShow2&&subuserShow&&checkstateShow" @click="modifyProp">修改</view> -->
		<!-- <view class="modifyOwn" v-show="popupShow2&&!subuserShow&&checkstateShowerr" @click="helpControlerr">纠错</view> -->
		<!-- dierye -->
		<!-- <formContent v-show="!showPageOne" :formdata="formdata" :imgfilesNew="imgfilesNew" :radios="radios" :errShow="errShow" :current="current" :imgUrl="imgUrl">
			<radio-group @change="radioerrType" v-show='errShow' slot="typeRadio">
				<label v-for="(item,index) in radios" class="radioLabel">
					<radio :value="item.radioval" :key="item.id" :checked="index==current" /><text>{{item.radioval}}</text>
				</label>
			</radio-group>
			<view class="formDiv" @click="drawRange" slot="huizhi">
				<b class="drawIcon">绘制范围：</b>
			</view>
			<view class="submitBtns" slot="tijiao">
				<button class="submitBtn" type="primary" @click="submitImgs">提交</button>
				<button class="submitBtn" type="primary" @click="submitCancel">取消</button>
			</view>
		</formContent> -->
		<view class="bhfxIndex" v-show="!showPageOne">
			<view class="phototitle">拍照</view>
			<view class="cameraDiv">
				<view class="cameraChild" @click="cameraChild(index)" v-for="(item,index) in formdata.imgfiles"  :key="index" >
					<image :src="item.imagesrc" mode="scaleToFill" ref="cameraImg" class="cameraImg"/>
				</view>
			</view>
			<view class="formDiv">
				<b>上传时间：</b>{{formdata.SUNTIME | getTime2}}
			</view>
			<view class="formDiv formDiv2" style="border-bottom: none;" v-show='!errShow'>
				<view class="title"><b>变化类型：</b></view>
				<radio-group >
					<label v-for="(item,index) in radios" class="radioLabel">
						<radio :value="item.radioval" :key="item.id" :checked="index==current" :disabled="index!==current"  /><text :class="{'radioColor':index!==current}">{{item.radioval}}</text>
					</label>
				</radio-group>
			</view>
			<view class="formDiv formDiv2" style="border-bottom: none;" v-show='errShow'>
				<view class="title"><b>变化类型：</b></view>
				<radio-group @change="radioerrType" v-show='errShow'>
					<label v-for="(item,index) in radios" class="radioLabel">
						<radio :value="item.radioval" :key="item.id" :checked="index==current" /><text>{{item.radioval}}</text>
					</label>
				</radio-group>
			</view>
			<view class="formDiv" style="padding-left: 80px;">
				前期：
				<select id="selectOne" v-model="formdata.BHBEFORE">
				  <option value =""></option>
				  <option value ="建筑">建筑</option>
				  <option value ="道路">道路</option>
				  <option value="绿地">绿地</option>
				  <option value="裸地">裸地</option>
				  <option value="绿网">绿网</option>
				</select>
				后期：
				<select id="selectTwo" v-model="formdata.BHAFTER">
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
				<textarea  placeholder="请输入您的详细描述" class="formTextarea" v-model="formdata.BHREMARK" />				
			</view>
			<view class="submitBtns">
				<button class="submitBtn" type="primary" @click="submitImgs">提交</button>
				<button class="submitBtn" type="primary" @click="submitCancel">取消</button>
			</view>
		</view>		
	</view>
</template>

<script>
	var _this;
	import esriLoader from 'esri-loader';
	import {appLoginWx,request,request2,VxgetLocation} from '@/pages/network/appLoginWx.js';
	import formContent from '@/pages/fxbhbtn/formContent/formContent.vue'
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
							checked: false
						},
						{
							value: 'skyMap',
							name: '电子地图',
							checked:true
						},
					],
					checkboxitems: [
						{
							value: 'bhfxpoi',
							name: '变化发现',
							checked: 'true'
						},
						// {
						// 	value: 'bhfxline',
						// 	name: '变化发现二',						
						// },
						// {
						// 	value: 'bhfxplg',
						// 	name: '变化发现三',							
						// },
					],
					current: 0,
					longitudeData:0,
					latitudeData:0,
					resconfig:null,
					view:null,
					symbol:null,
					renderer:null,
					formdata:{
						imgfiles:[],
						SUNTIME:"",						
						BHTYPE:"新增",
						BHREMARK:"",						
						BHBEFORE:'',
						BHAFTER:'',
						SUBUSER:uni.getStorageSync('phone'),
						ID:'',
						OLDID:'',//旧Id
					},
					formdata2:{
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
						SUNTIME:"",						
						BHTYPE:"",
						BHREMARK:"",						
						BHBEFORE:'',
						BHAFTER:'',
						SUBUSER:uni.getStorageSync('phone'),
						ID:'',
						OLDID:''
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
					showPageOne:true,
					showPageThree:false,
					showPageBars:true,
					popupShow:false,
					popupShow2:false,
					errShow:false,
					draw:null,
					addGraphic:null,
					subuserShow:false,
					checkstateShow:false,
					checkstateShowerr:false,
					noGraphic:null,
					imgUrl:"http://bhfxxcx.natapp1.cc",
					imgfilesNew:[],
					xgjc:'0',
					template:{
						// title:function(){return `<span class="xg">${_this.xgjc}</span>`},
						title:function(){return `<span class="xg" style='color:#fd3f31;padding-left:10px;'></span>`},
						content: [
							{
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
							{ 
							  type: "media",
							  mediaInfos: [ {
								// title: "<b>现场图片</b>",
								type: "image",
								value: {
								  sourceURL:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
								}
							  },
							  {
								// title: "<b>现场图片</b>",
								type: "image",
								value: {
								  sourceURL:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
								}
							  },{
								// title: "<b>现场图片</b>",
								type: "image",
								value: {
								  sourceURL:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
								}
							  },]
							},],
						},
					template2:{
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
										color: "white",
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
										color: "white",
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
										color: "white",
										width: 1
									  }
									}
								},								
							]
						},
						xiugai:false,
						jchz:false
				}
			},
			watch:{
				popupShow(val){
					if(val){
						let esriUI=document.querySelector('.esri-ui');
						esriUI.style.display='none';
						setTimeout(()=>{											
							let popupcontentKey=document.getElementsByClassName('esri-feature-fields__field-header');
							let popupcontentVal=document.getElementsByClassName('esri-feature-fields__field-data');
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
							// _this.popupShow2=val;
						},600);
					}else{
						// _this.popupShow2=val;console.log(this.popupShow,val,_this.popupShow2);
					}				
				}
			},				
			components:{
				formContent
			},
			mounted() {
				this.formdata.SUBUSER=uni.getStorageSync('phone');
			},
			beforeDestroy(){
				if(this.view){
					this.view.container = null;
				}
			},
			filters:{
				getTime2(timestr){
					let yy = new Date(timestr).getFullYear();
					let mm = new Date(timestr).getMonth()+1;
					let dd = new Date(timestr).getDate();
					let hh = new Date(timestr).getHours();
					let mf = new Date(timestr).getMinutes()<10 ? '0'+new Date(timestr).getMinutes() : new Date(timestr).getMinutes();
					let ss = new Date(timestr).getSeconds()<10 ? '0'+new Date(timestr).getSeconds() : new Date(timestr).getSeconds();
					return  yy+'/'+mm+'/'+dd+' '+hh+':'+mf+':'+ss;
				},
			},
			onShow(){
				_this=this;
				_this.$jweixin.getLocation({
					type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					  success: function (res) {
						var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						// var speed = res.speed; // 速度，以米/每秒计
						// var accuracy = res.accuracy; // 位置精度
						_this.longitudeData=Number(longitude);
						_this.latitudeData=Number(latitude );
						console.log(0,_this.longitudeData,_this.latitudeData)
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
					"esri/views/draw/Draw","esri/layers/GraphicsLayer","esri/layers/MapImageLayer","esri/tasks/support/Query"],{
						css:true
					})
					.then(([Map,MapView,FeatureLayer,TileLayer,WebTileLayer,Draw,GraphicsLayer,MapImageLayer,Query])=>{
						let map = new Map({});
						_this.map=map;
						_this.view = new MapView({
							container:'mymap',
							map:map,
							center:[_this.longitudeData,_this.latitudeData],
							// zoom:8,
							zoom:15,
							//固定popup，取消浮动
							popup:{
							// 	// dockEnabled:true,  //将popup固定住
							// 	dockOptions:{
							// 		buttonEnabld:false,  //将切换固定状态的那个按钮隐藏掉
							// 		// breakpoint:false,//但是如果是true或去掉不写，popup将不固定
							// 		position:"bottom-center",
							// 	},
							// 	// alignment:"bottom-center",	
								collapseEnabled : false,
							}
						});
						_this.view.ui._removeComponents(['zoom']);//去掉缩放图标
						_this.view.ui._removeComponents(["attribution"]);//去掉ersilogo
						//draw工具
						_this.draw = new Draw({
						  view: _this.view
						});				
						//实例化影像图
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
						// 坐标标记
						_this.symbol = {
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
						  // url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0',
						  // url:"http://192.168.1.101:6080/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX/FeatureServer/0",
						  // url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX/FeatureServer/0",
						  url:"http://192.168.1.107:6080/arcgis/rest/services/FaXianBianHua/FaXianBianHuaWX2000/FeatureServer/0",
						  // visible:false,
						  outFields: ["*"],
						  popupTemplate: _this.template,
						});
						layerfeaturePoi.popupTemplate.overwriteActions = true;//zoom to按钮给去除
						layerfeaturePoi.renderer=this.unirender;
						// const layerfeatureHouse = new FeatureLayer({
						//   // url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1',
						//    // url:"http://192.168.1.101:6080/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX/FeatureServer/0",
						//    // url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX/FeatureServer/0",
						//    url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX2000/FeatureServer/0",
						//    visible:false
						// });
						// const layerfeatureRoad = new FeatureLayer({
						//   // url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2',
						//    // url:"http://192.168.1.101:6080/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX/FeatureServer/0",
						//    // url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX/FeatureServer/0",
						//    url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX2000/FeatureServer/0",
						//    visible:false
						// });
					 //    map.addMany([layerfeaturePoi,layerfeatureHouse,layerfeatureRoad]);
						map.add(layerfeaturePoi);
						_this.view.on('click',function(event){
							let screenPoint={
								x:event.x,
								y:event.y
							}
							if(_this.showPageBars){
								_this.view.hitTest(screenPoint).then(function(response){
									if(response.results.length>0){								
										let id=response.results[0].graphic.attributes.ID;
										let checkState=response.results[0].graphic.attributes.AUDITRES;//审核状态
										// _this.formdata.ID=id;
										_this.noGraphic=response.results[0].graphic;//修改时不绘制图形
										uni.getStorageSync('phone')==response.results[0].graphic.attributes.SUBUSER?_this.subuserShow=true:_this.subuserShow=false;//修改自己的
										checkState==null?_this.checkstateShow=true:_this.checkstateShow=false;//等待审核可以修改
										checkState!='2'?_this.checkstateShowerr=true:_this.checkstateShowerr=false;//不是拒绝就可纠错
										_this.popupShow=false;
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
												});console.log('首次弹注释');
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
											if(_this.subuserShow&&_this.checkstateShow){
												layerfeaturePoi.popupTemplate.title=`<span class="xg" style='color:#fd3f31;padding-left:10px;'>修改</span>`
											}else if(!_this.subuserShow&&_this.checkstateShow){
												layerfeaturePoi.popupTemplate.title=`<span class="xg" style='color:#fd3f31;padding-left:10px;'>纠错</span>`
											}
										})
										_this.$nextTick(function(){
											_this.popupShow=true;											
										});										
									}else{
										_this.popupShow=false;
									}									
								})								
							}else{
								_this.map.layers.items[5].popupTemplate=null;//不弹出模板
								_this.view.hitTest(screenPoint).then(function(response){
									if(((response.results.length==1 && _this.formdata.ID!=response.results[0].graphic.attributes.ID) || response.results.length>1)&&_this.jchz){
										uni.showModal({
											title: '绘制信息',
											content:'相交，继续绘制吗',
											success: function (res) {
												if (res.cancel) {
													_this.draw.reset();
													_this.view.graphics.removeAll();												
													_this.jchz=false;
												}
											}
										})
									}
								})
							}
						})	
						_this.view.when(()=>{
							setTimeout(()=>{
								let esriUI=document.querySelector('.esri-ui').offsetHeight;
								let esriPopup=document.querySelector('.esri-popup');
								esriPopup.style.height='295px';
								esriPopup.style.marginTop=(esriUI - 295)+'px';
								esriPopup.onclick=function(event){
									let classArr=event.target.classList;
									if(classArr.length>1){
										for (let classname of classArr) {
											if(classname=="esri-icon-close"){//关闭弹框
												_this.popupShow=false;
											}										
										}
										for (let classname of classArr) {//下一页上一页
											if(classname=="esri-popup__pagination-next-icon" || classname=="esri-popup__pagination-previous-icon"){
												// _this.map.layers.items[5].popupTemplate=null;
												document.querySelector('.esri-feature__main-container').style.opacity=0;
												_this.popupPage();
											}
										}
									}else if(classArr[0]=='xg'){//修改纠错
										if(_this.subuserShow&&_this.checkstateShow){
											_this.modifyProp();
										}else if(!_this.subuserShow&&_this.checkstateShowerr){
											_this.helpControlerr();
										}
									}
								};
							},2000)
						})
					})
				},
				popupPage(){
					setTimeout(function(){						
						_this.$nextTick(function(){
							let esriPopupId=document.querySelector('.esri-feature-fields__field-data').innerText;
							let objectIdstr=esriPopupId.substr(1);let id='';
							// console.log(objectIdstr.length,objectIdstr)
							let esriPopupSubuser=document.getElementsByClassName("esri-feature-fields__field-data")[7].innerText;
							_this.formdata.SUBUSER==esriPopupSubuser?_this.subuserShow=true:_this.subuserShow=false;//修改字段显示问题
							esriLoader.loadModules(["esri/tasks/support/Query"])
							.then(([Query])=>{
								const query=new Query();
								query.where= "OBJECTID = '"+objectIdstr +"'";
								_this.map.layers.items[5].queryFeatures(query).then(function(results){
								  let checkState=results.features[0].attributes.AUDITRES;
								  checkState==null?_this.checkstateShow=true:_this.checkstateShow=false;//
								  checkState!='2'?_this.checkstateShowerr=true:_this.checkstateShowerr=false;
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
										if(_this.subuserShow&&_this.checkstateShow){//修改纠错
											_this.map.layers.items[5].popupTemplate.title=`<span class="xg" style='color:#fd3f31;padding-left:10px;'>修改</span>`
										}else if(!_this.subuserShow&&_this.checkstateShow){
											_this.map.layers.items[5].popupTemplate.title=`<span class="xg" style='color:#fd3f31;padding-left:10px;'>纠错</span>`
										}
								  	}else{
								  		_this.map.layers.items[5].popupTemplate=_this.template2;//固定模板
										uni.showModal({
											title: '图片信息',
											content:'图片加载失败',
											showCancel: false,						
											confirmText: '关闭'
										})
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
											// console.log(popupcontentVal[0]);
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
				getTextcontent(e){
					let	values = e.detail.value;
					this.formdata.BHREMARK=values;
				},
				datasframeControl(){
					this.datasFrame=!this.datasFrame
				},
				localtionControl(){					
					VxgetLocation(_this);										
				},
				radioerrType(evt){
					this.formdata.BHTYPE=evt.target.value;
					this.formdata.BHTYPE=="新增"?this.current=0:(this.formdata.BHTYPE=="拆除"?this.current=1:this.current=2);
				},
				modifyErrContent(){
					let esriPopupId=document.querySelector('.esri-feature-fields__field-data').innerText;
					let objectIdstr=Number(esriPopupId.substr(1));
					let ID=document.getElementsByClassName('esri-feature-fields__field-data')[1].innerText;
					//请求后台获取图片
					request2({
						url:'/api/bhfx/getphotos',
						header: {'Authorization':uni.getStorageSync('token')},
						data: {
							id:ID
						},
					}).then((res)=>{
						if(res.data.Status=="success"){//点击图形更改图片路径											
							let dataArr=res.data.Data;
							dataArr.forEach((item,index)=>{
								_this.formdata.imgfiles[index]={
									imagesrc:_this.imgUrl+item,
									id:index
								}
								_this.imgfilesNew[index]=item;
							});
							console.log("修改",_this.imgfilesNew);
							//渲染属性
							esriLoader.loadModules(["esri/tasks/support/Query"])
							.then(([Query])=>{
								const query=new Query();
								query.where= "OBJECTID = '"+ objectIdstr +"'";
								_this.map.layers.items[5].queryFeatures(query).then(function(results){
									_this.noGraphic=results.features[0];
									_this.formdata.BHTYPE=results.features[0].attributes.BHTYPE;
									_this.formdata.BHREMARK=results.features[0].attributes.BHREMARK;
									_this.formdata.BHBEFORE=results.features[0].attributes.BHBEFORE;
									_this.formdata.BHAFTER=results.features[0].attributes.BHAFTER;
									_this.formdata.SUBUSER=uni.getStorageSync('phone');
									_this.formdata.OLDID=results.features[0].attributes.OLDID;								
									_this.formdata.OBJECTID=objectIdstr;
									_this.formdata.ID=results.features[0].attributes.ID;
									// _this.formdata.SUNTIME=_this.getTime2(results.features[0].attributes.SUNTIME);//将时间戳转为日期时间展示
									_this.formdata.SUNTIME=results.features[0].attributes.SUNTIME;
									_this.formdata.BHTYPE=="新增"?_this.current=0:(_this.formdata.BHTYPE=="拆除"?_this.current=1:_this.current=2);
									if(!_this.subuserShow&&_this.checkstateShowerr){//如果是纠错，就给oldid赋值
										_this.formdata.OLDID=_this.formdata.ID;
										_this.formdata.ID=_this.getTime();
									}
									console.log(_this.formdata);
								})
							});
						}
					})
								
					if(document.getElementsByClassName('esri-popup__button').length>0){
						document.getElementsByClassName('esri-popup__button')[0].click();
					}
					_this.popupShow=false;
					_this.errShow=true;
					_this.showPageOne=false;
					_this.showPageBars=false;
				},
				modifyProp(){//修改
					// let esriPopupId=document.querySelector('.esri-feature-fields__field-data').innerText;
					// let objectIdstr=Number(esriPopupId.substr(1));
					this.modifyErrContent();
					this.getTime();
					// this.map.layers.items[5].applyEdits({
					//     deleteFeatures:[{objectId:objectIdstr}]
					//  });
					this.xiugai=true;
				},					
				helpControlerr(){//纠错
					this.modifyErrContent();
				    // this.current=0;
					this.xiugai=false;
					console.log(0,this.formdata);
				},
				newaddBtn(){
					this.formdata=JSON.parse(JSON.stringify(this.formdata2));
					this.current=0;
					this.getforInf();
					this.formdata.ID=_this.getTime();
					this.showPageOne=false;
					this.showPageBars=false;
					this.errShow=false;
				},
				dismantleBtn(){
					this.formdata=JSON.parse(JSON.stringify(this.formdata2));
					this.current=1;
					this.getforInf();
					this.formdata.ID=_this.getTime();;
					this.showPageOne=false;
					this.showPageBars=false;
					this.errShow=false;
				},
				reformBtn(){
					this.formdata=JSON.parse(JSON.stringify(this.formdata2));
					this.current=2;
					this.getforInf();
					this.formdata.ID=_this.getTime();
					this.showPageOne=false;
					this.showPageBars=false;
					this.errShow=false;
				},
				getforInf(){
					this.formdata.BHTYPE=this.radios[this.current].radioval;//radio值
					this.$jweixin.getLocation({
						type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
						success: function (res) {
							let latitude = res.latitude; 
							let longitude = res.longitude;
						// _this.formdata.bhlocation="经度:"+longitude+"，纬度："+latitude;
						},
						fail:function(err){
							console.log(JSON.stringify(err));
						}
					});	
				},
				getTime(){
					  _this.formdata.SUNTIME = new Date().getTime();
					  let yy = new Date().getFullYear();
					  let mm = new Date().getMonth()+1;
					  let dd = new Date().getDate();
					  let hh = new Date().getHours();
					  let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
					  let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
					  // _this.formdata.SUNTIME = yy+'/'+mm+'/'+dd+' '+hh+':'+mf+':'+ss;//时间				  
					  return yy.toString()+mm+dd+hh+mf+ss;
				},
				cameraChild(index){//照片
					uni.chooseImage({
					    count: 1, //默认9
					    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					    // sourceType: ['album'], //从相册选择
					    success: function (res) {
							_this.formdata.imgfiles[index].imagesrc=res.tempFiles[0].path;
							_this.formdata=JSON.parse(JSON.stringify(_this.formdata));//修改图片时
							uni.uploadFile({//图片上传返回
								url:_this.imgUrl+'/api/photo/uploadphoto',
								filePath: res.tempFilePaths[0],
								name: "file",
								headers: {'Authorization':uni.getStorageSync('token')},
								success(res) {//获取照片
									_this.imgfilesNew[index]=JSON.parse(res.data).Data;
									console.log("camera",_this.imgfilesNew);
								}
							});						
					    }
					});
				},
				drawRange(){//点击绘制
					this.showPageOne=true;					
					this.showPageBars=false;
					this.showPageThree=true;
				},
				drawEventClear(){//清除
					this.draw.reset();//清除重置
					// this.draw.complete();
					this.view.graphics.removeAll();
					this.jchz=false;
				},
				drawEvent(){//绘制图形事件
						var action =_this.draw.create("polygon");					
						action.on("vertex-add", function (evt) {
							_this.createPolygonGraphic(evt.vertices);
						});
						action.on("vertex-remove", function (evt) {
							_this.createPolygonGraphic(evt.vertices);
						});
						action.on("cursor-update", function (evt) {
							_this.createPolygonGraphic(evt.vertices);
						});
						action.on("draw-complete", function (evt) {
							_this.createPolygonGraphic(evt.vertices);
						});
						this.jchz=true;
				},
				createPolygonGraphic(vertices){//绘制图形事件					
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
							attributes: _this.formdata
						});	
						_this.view.graphics.add(_this.addGraphic);
						_this.getTime();
					 })
				    
				 },
				backContent(){
					this.showPageOne=false;
					this.showPageBars=false;
					this.popupShow=false;
					this.view.graphics.removeAll();
					this.jchz=false;
				},
				backContent2(){
					this.showPageOne=false;
					this.showPageBars=false;
					this.popupShow=false;
					this.view.graphics.removeAll();
					this.draw.reset();//清除重置
					this.jchz=false;
					this.map.layers.items[5].popupTemplate=this.template2;//添加弹窗
				},
				submitImgs(){
					if(this.formdata.BHREMARK.length<15){
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '变化详情不能少于15个字'
						});
					}else{
						console.log('addGraphic',_this.addGraphic,_this.formdata);					
						if(_this.xiugai){
							_this.getTime();console.log(_this.formdata.SUNTIME)
							if(_this.addGraphic!=null){//修改有图形
								_this.map.layers.items[5].applyEdits({
									updateFeatures: [_this.addGraphic]
								}).then(res=>{console.log(res.updateFeatureResults)
								// let objectIdstr=res.updateFeatureResults[0].objectId;
									_this.ismodifyGraphic();
								});
							}else{//修改无图形
								_this.noGraphic.attributes.SUNTIME=_this.formdata.SUNTIME;
								_this.noGraphic.attributes.BHTYPE=_this.formdata.BHTYPE;
								_this.noGraphic.attributes.BHREMARK=_this.formdata.BHREMARK;
								_this.noGraphic.attributes.BHBEFORE=_this.formdata.BHBEFORE;
								_this.noGraphic.attributes.BHAFTER=_this.formdata.BHAFTER;
								_this.map.layers.items[5].applyEdits({
									updateFeatures: [_this.noGraphic]
								}).then(res=>{
									_this.ismodifyGraphic();
								});
							}														
						}else{
							if(_this.addGraphic!=null){
								_this.map.layers.items[5].applyEdits({
								    addFeatures: [_this.addGraphic]
								}).then(res=>{
									let addId=res.addFeatureResults[0].objectId;
									let id=_this.addGraphic.attributes.ID;
									// 将id和图片链接集合提交
									request2({
										url:'/api/bhfx/submitphotos',
										method:"POST",
										header: {'Authorization': uni.getStorageSync('token')},
										data: {
											// "id":addId,
											"id":id,
											"photos":_this.imgfilesNew
										},
									})
									.then((res)=>{
										if(res.data.Status=="success"){
											_this.map.layers.items[5].refresh();					
										}else{//提交失败删除
											_this.map.layers.items[5].applyEdits({
											    deleteFeatures: [{objectId:addId}]
											});
											uni.showModal({
												title: '提交信息',
												content:'提交失败，重新操作',
												showCancel: false,						
												confirmText: '关闭'
											})
										}
										_this.showPageOne=true;
										_this.showPageThree=false;
										_this.showPageBars=true;
										_this.map.layers.items[5].popupTemplate=_this.template2;//固定模板
										_this.formdata=JSON.parse(JSON.stringify(_this.formdata2));//清空内容区
									})
								});
							}else{
									uni.showModal({
										title: '提示信息',
										content:'请绘制范围',
										showCancel: false,						
										confirmText: '关闭'
									})
							}
						}
					}
				},
				ismodifyGraphic(){
					this.showPageOne=true;
					this.showPageThree=false;
					this.showPageBars=true;
					this.checkstateShow=false;
					this.checkstateShowerr=false;
					this.map.layers.items[5].popupTemplate=_this.template2;//固定模板
					this.xiugai=false;
					request2({
						url:'/api/bhfx/submitphotos',
						method:"POST",
						header: {'Authorization': uni.getStorageSync('token')},
						data: {
							// "id":_this.formdata.OBJECTID,
							"id":_this.formdata.ID,
							"photos":_this.imgfilesNew
						},
					}).then((res)=>{
						if(res.data.Status=="success"){
							console.log("图片修改成功");				
						}else{
							uni.showModal({
								title: '信息',
								content:'修改失败，重新操作',
								showCancel: false,						
								confirmText: '关闭'
							})
						}
						_this.map.layers.items[5].refresh();
					})
				},
				submitCancel(){
					this.showPageOne=true;
					this.showPageThree=false;
					this.showPageBars=true;
					this.formdata=JSON.parse(JSON.stringify(this.formdata2));//清除内容模板
					this.map.layers.items[5].popupTemplate=this.template2;
				},
			}
		}
</script>

<style scoped>
	@import url("./css/fxbhIndex.css");	
</style>
