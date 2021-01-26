<template>
	<view style="width: 100%;height: 100%;">
		<view class="container" v-show="showPageOne">
			<view class="mymap" id="mymap">			
			</view>
			<view class="rightToll">
				<view class="tollone">
					<view class="uni-list" v-show="!layersFrame">
						<radio-group @change="radioChange">
							<label class="uni-list-cell unilistcell" v-for="(item, index) in radioitems" :key="item.value">
								<view>
									<radio :value="item.value" :checked="item.checked"/>
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
							<label class="uni-list-cell unilistcell" v-for="item in checkboxitems" :key="item.value">
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
			</view>
			<view class="leftToll">
				<view class="tollfour">
					<view class="nearControl tollIcon" @click="nearControl"></view>
				</view>
			</view>
			<view class="bottomBar">
				<view class="tastTab">
					<span :class="{'tastTitle':!doTaskShow}" @click='lqrw'>领取任务</span> <span :class="{'tastTitle':doTaskShow}" @click='zrw'>做任务</span>
				</view>
				<view v-show="!doTaskShow" class="tastContent">
					<view v-for="(item,index) in tasksClass" :key="item.index" class="taskItem" @click="doTasksee(item.GUID)">
						<view class="taskItemChild">
							<view class="itemName">大类({{item.NAME}})</view>
							<view class="naviTo">{{item.DESCRIPTION}}</view>
						</view>
						<view class="taskItemChild">
							<view class="itemMoney">{{item.DISTANCE}}m {{item.AMOUNT || 0}}元</view>
							<view>
								<button class="getTask" size="mini" @click.stop="getTaskToDo(item.GUID)">领取任务</button>
							</view>
						</view>
					</view>				
				</view>				
				<view class="doTaskDiv" v-show="doTaskShow">
					<!-- <view class="getTaskTitle">已领取</view> -->
					<view  class="taskItem haveGotTask" v-for="(item,index) in dotaskLists" :key="item.index" @click="doTasksee(item.GUID,item.TYPE)">
						<view class="taskItemChild" >
							<!-- <view class="itemName">{{item.NAME}} 时间:{{resetTime30(item.LQTIME)}}</view> -->
							<view class="itemName">{{item.NAME}} 时间:{{item.TIME}}</view>
							<view class="naviTo">{{item.NYREMARK}}</view>
						</view>
						<view class="taskItemChild">
							<view class="itemMoney">**m {{item.AMOUNT || 0}}元</view>
							<view style="display: flex;justify-content: space-between">															
								<!-- <button type="primary" size="mini" class="doTask" @click.stop="doTask(item.ID)" :disabled="item.TIME=='00:00'">做任务</button> -->
								<button type="primary" size="mini" class="doTask" @click.stop="doTaskContent('taskRoad')" :disabled="item.TIME=='00:00'">做任务</button>
							</view>
						</view>						
					</view>
				</view>
			</view>
		</view>
		<!-- neirong -->
		<!-- v-show="!showPageOne" -->
		<!-- <component :is="contentType" v-show="!showPageOne"  @submitCancel="submitCancel"></component> -->
		<view class="bhfxIndex" v-show="!showPageOne">
			<view class="phototitle">拍照</view>
			<view class="cameraDiv">
				<view class="cameraChild" @click="cameraChild(index)" v-for="(item,index) in formdata.imgfiles">
					<image :src="item.imagesrc" :key="item.id" mode="scaleToFill" ref="cameraImg" class="cameraImg"/>
				</view>
			</view>
			<view class="formDiv">
				<b>上传时间：</b>{{formdata.SUNTIME}}
			</view>
			<component :is="item.type" @rdcontent="rdcontent($event,index)"   v-for="(item,index) in taskContentObj" :key='index' :labelname='item.name' :values="item.tkContent"></component>
			<view class="formDiv">
				<view><b>变化详情：（大于15字）</b></view>
				<textarea  placeholder="请输入您的详细描述" class="formTextarea" v-model="formdataBHREMARK"/>
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
	import {appLoginWx,request,request2,VxgetLocation} from '@/pages/network/appLoginWx.js'
	import taskRoad from '@/pages/taskbtn/taskRoad.vue'
	import radioContent from '@/pages/taskbtn/taskContent/radioContent.vue'
	import inputContent from '@/pages/taskbtn/taskContent/inputContent.vue'
	import selectContent from '@/pages/taskbtn/taskContent/selectContent.vue'
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
							checked:'false'
						},
						{
							value: 'skyMap',
							name: '电子图',
							checked:'true'
						},
					],
					checkboxitems: [
						{
							value: 'poi',
							name: '上报点',
							checked:"true"
						},
						{
							value:'line',
							name: '上报线',
							checked:"true"
						},
						{
							value: 'polygon',
							name: '上报面',
							checked:"true"
						},
					],
					current: 0,
					longitudeData:0,
					latitudeData:0,
					resconfig:null,
					view:null,
					symbol:null,
					renderer:null,
					tasksIndex:[],
					tasksClass:[],//大任务
					tasksById:[],//小任务
					taskItemtype:'点',
					// plpBoolean:0,
					imgUrl:"http://bhfxxcx.natapp1.cc",
					imgfilesNew:[],
					dotaskLists:[
						{
							dotaskName:"羊坊店路",
							remainTime:"30:00",
							details:"代理可发家大理石块姐夫老家当时离京弗",
							dotaskMoney:"10"
						},
					],
					doTaskShow:false,
					// dotaskDis:false,
					showPageOne:true,
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
						SUNTIME:"",
						// BHTYPE:"拆除",
						BHREMARK:"",						
						// BHBEFORE:'绿地',
						// BHAFTER:'裸地',
						// SUBUSER:'',
						ID:'',
					},
					contentType:'',
					taskContentObj:[
						{
							type:'radioContent',
							name:'是否找到',
							tkContent:[
								{
									id:1,
									radioval:'是'
								},
								{
									id:0,
									radioval:'否'
								},
							],
						},
						{
							type:'selectContent',
							name:'前期状态',
							tkContent:[
							],
						},
						{
							type:'radioContent',
							name:'变化类型',
							tkContent:[
								{
									id:2,
									radioval:'新增'
								},
								{
									id:1,
									radioval:'拆除'
								},
								{
									id:0,
									radioval:'改造'
								},
							],
						},
						{
							type:'radioContent',
							name:'道路状态',
							tkContent:[
								{
									id:2,
									radioval:'施工'
								},
								{
									id:1,
									radioval:'竣工'
								},
								{
									id:0,
									radioval:'通车'
								},
							],
						},
						{
							type:'inputContent',
							name:'车辆数量',
							tkContent:[
								{
									id:0,
									inputval:'请输入车辆数量'
								},
							],
						},					
					],
					rdVal:[],
					formdataBHREMARK:'',
					formdataID:'',
					formdataImgfiles:[
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
					]
				}
			},
			beforeDestroy(){
				if(this.view){
					this.view.container = null;
				}
			},
			onShow(){
				_this=this;
				// 	//this.$jweixin.miniProgram.getEnv(function(res){})
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
				// },(err)=>{
				// 	console.log(JSON.stringify(err))
				// })
			},
			mounted(){
				this.tasksInit();
			},
			watch:{
				formdataBHREMARK(val){
					this.rdVal[this.taskContentObj.length+1]=val;
				}
			},
			methods: {
				creatMapview(){
					esriLoader.loadModules(['esri/Map','esri/views/MapView','esri/layers/FeatureLayer',"esri/layers/TileLayer","esri/layers/WebTileLayer",
					"esri/layers/MapImageLayer","esri/Graphic"],{
						css:true
					})
					.then(([Map,MapView,FeatureLayer,TileLayer,WebTileLayer,MapImageLayer,Graphic])=>{
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
							// },
						});
						this.view.ui._removeComponents(['zoom']);//去掉缩放图标
						this.view.ui._removeComponents(["attribution"]);//去掉ersilogo
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
						  // url:"http://192.168.1.101:6080/arcgis/rest/services/BianHuaFaXianWX/WXShangBao/FeatureServer/0",
						  // url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/WXShangBao/FeatureServer/0",
						   url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX2000/FeatureServer/0",
						   outFields: ["*"],
						  // popupTemplate: this.template,
						});
						// layerfeaturePoi.popupTemplate.overwriteActions = true;//zoom to按钮给去除
						// layerfeaturePoi.definitionExpression = `AUDITRES IS NOT null`;//显示状态不是空的
						// layerfeaturePoi.renderer = {//配色所有
						//   type: "simple",  // autocasts as new SimpleRenderer()
						//   symbol: {
						//     type: "simple-fill", // autocasts as SimpleFillSymbol
						//     color: [226, 119, 40,0.5],
						//     style: "solid",
						//     outline: {  // autocasts as new SimpleLineSymbol()
						//       width: 0.5,
						//       color: "white"
						//     }
						//   }
						// };
						const layerfeatureHouse = new FeatureLayer({
						   // url:"http://192.168.1.101:6080/arcgis/rest/services/BianHuaFaXianWX/WXShangBao/FeatureServer/1",
						   // url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/WXShangBao/FeatureServer/1"
						    url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX2000/FeatureServer/0",
							visible:false
						});
						const layerfeatureRoad = new FeatureLayer({
						   // url:"http://192.168.1.101:6080/arcgis/rest/services/BianHuaFaXianWX/WXShangBao/FeatureServer/2",
						   // url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/WXShangBao/FeatureServer/2"
						    url:"http://jzhtmap.s3.natapp.cc/arcgis/rest/services/BianHuaFaXianWX/FaXianBianHuaWX2000/FeatureServer/0",
							visible:false
						});
						map.addMany([layerfeaturePoi,layerfeatureHouse,layerfeatureRoad]);
						// this.view.on('click',function(event){
						// 	if(!_this.doTaskShow){
						// 		_this.latitudeData=event.mapPoint.latitude;
						// 		_this.longitudeData=event.mapPoint.longitude;
						// 		let updatelayer=_this.map.layers.items[4];//标记图层
						// 		_this.view.center=[_this.longitudeData,_this.latitudeData];
						// 	}
						// })
						this.view.on('click',(event)=>{
							this.view.hitTest(event).then(response=>{
								if(response.results.length>0){
									let graphic=response.results[0].graphic;
									debugger
								}									
							})
						});
					})
				},
				rdcontent(val,index){
					this.rdVal[index+1]=val;
					console.log(this.rdVal,this.rdVal.length);
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
					VxgetLocation(_this);									
				},
				// helpControl(){//弹出帮助信息
				// 	uni.showModal({	
				// 		title: '纠错信息',					
				// 	    content:`这是纠错按钮`,
				// 		showCancel: false,						
				// 		confirmText: '关闭'
				// 	})
						
				// },
				lqrw(){//tab
					this.doTaskShow=false;					
				},
				zrw(){//tab
					this.doTaskShow=true;
				},
				tasksInit(){
					//获取大任务类
					this.taskClassFirst();
					//做任务列表
					this.dotaskFirst();				
				},
				taskClassFirst(){//大任务列表
					request2({
						url:'/api/lqrw/getRwList',
						header: {'Authorization':uni.getStorageSync('token')},
					}).then((res)=>{									
						if(res.data.Status=="success"){
							_this.tasksClass=res.data.Data;
						}
					});
				},
				dotaskFirst(){//做任务列表
					request2({
						url:'/api/lqrw/getOwnLQRws',
						header: {'Authorization':uni.getStorageSync('token')},
					}).then((res)=>{									
						if(res.data.Status=="success"){
							_this.dotaskLists=res.data.Data;
							let timerun=setInterval(()=>{//倒计时
								_this.dotaskLists.forEach((item,index) =>{
									let timeRemain=new Date(item.LQTIME).getTime()+30*60*1000 -new Date().getTime();
									console.log(new Date(timeRemain).toLocaleString())
									if(timeRemain>0){
										item.TIME = new Date(timeRemain).toLocaleString().substring(13,18);
										// _this.dotaskLists[index].TIME= new Date(timeRemain).toLocaleString().substring(13,18);
									}else{
										item.TIME="00:00";
										// _this.dotaskLists[index].TIME="00:00";
										
									}
									_this.$set(_this.dotaskLists,index,_this.dotaskLists[index]);//将修改后的值赋给dotasklists
									console.log(9)
								});
								if(_this.dotaskLists.every((item)=>{
									return item.TIME=="00:00";
								})){//都是0,清除定时
									clearInterval(timerun);
								}
							},1000);
						}
					});
				},				
				collapseChange(e){
					if(e.length>this.tasksIndex.length){
						let thisIndex=[...e].filter(x=>[..._this.tasksIndex].every(y=>y!==x));//差集
						this.classId=this.tasksClass[thisIndex[0]].ID;//查看大类的id
						this.getTaskPoiLinePoly(_this.classId);
					}					
					this.tasksIndex=e;
					// this.plpBoolean=0;
					// this.taskItemtype="点"
				},
				getTaskPoiLinePoly(id){
					request2({
						url:'/api/lqrw/getItemsById',//获取任务列表
						header: {'Authorization':uni.getStorageSync('token')},
						data: {
							id:id,
							// type
						},
					}).then((res)=>{									
						if(res.data.Status=="success"){
							_this.tasksById=res.data.Data;//点数据集合
						}
					})
					// this.plpBoolean=index;
					// this.taskItemtype=type;
				},
				getTaskToDo(id){				
					request2({
						url:'/api/lqrw/lq',//领取每个小任务
						header: {'Authorization':uni.getStorageSync('token')},
						data: {
							id:id,
							// type
						},
					}).then((res)=>{									
						if(res.data.Status=="success"){
							_this.taskClassFirst();//更新领取列表
							_this.dotaskFirst();//更新做任务列表
						}
					})
				},
				doTask(id){
					this.doTaskShow=false;
					this.showPageOne=false;
					this.formdata.ID=id;
					this.getTime();
				},
				doTaskContent(type){
					this.contentType=type;
					this.doTaskShow=false;
					this.showPageOne=false;
					// this.formdataID=id;
					this.getTime();
				},
				doTasksee(id,layerindex){
					let layerIndex=(layerindex==0 || layerindex=="点")?5:((layerindex==1 || layerindex=="线")?6:7);
					esriLoader.loadModules(["esri/tasks/support/Query","esri/Graphic"])
					.then(([Query,Graphic])=>{
						const query=new Query();
						query.where= "GUID = '"+id +"'";
						_this.map.layers.items[layerIndex].queryFeatures(query).then(function(results){
							if(layerindex!==0 && layerindex!=="点"){
								_this.view.goTo(results.features[0].geometry.extent.expand(1)).then(function () {
									_this.view.graphics.removeAll();
									let addGraphic = new Graphic({
										geometry:results.features[0].geometry,
										symbol: {
										  type: "simple-fill",
										  color: [226, 119, 40,0.1],
										  style: "solid",
										  outline: {
											color: "red",
											width: 1
										  }
										},
										// attributes: _this.formdata
									});	
									_this.view.graphics.add(addGraphic);
								});
							}else{
								_this.view.goTo({target:results.features[0].geometry,zoom:5},{duration: 1000}).then(function () {//放点坐标不行放geometry
									_this.view.graphics.removeAll();console.log(layerIndex);
									let addGraphic = new Graphic({
										geometry:results.features[0].geometry,//放new点不行放geometry
										symbol: {
										  type: "simple-marker",
										  color: [226, 119, 40]
										}
									});	
									_this.view.graphics.add(addGraphic);
								});
							}
						})
					})
				},
				// resetTime30(oldtime){
				// 	let timeRemain=new Date(oldtime).getTime()+30*60*1000 -new Date().getTime();
				// 	console.log(new Date(timeRemain).toLocaleString())
				// 	if(timeRemain>0){
				// 		return new Date(timeRemain).toLocaleString().substring(13,18);
				// 	}else{
				// 		return "00:00"
				// 	}
				// },
				// getforInf(){
				// 	_this.$jweixin.getLocation({
				// 		type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				// 		  success: function (res) {
				// 		    let latitude = res.latitude; 
				// 		    let longitude = res.longitude;
				// 			_this.formdata.bhlocation="经度:"+longitude+"，纬度："+latitude;
				// 		  },
				// 		  fail:function(err){
				// 		  	console.log(JSON.stringify(err));
				// 		  }
				// 	});	
				// },
				getTime(){
					  // _this.formdata.SUNTIME =new Date().getTime();
					  let yy = new Date().getFullYear();
					  let mm = new Date().getMonth()+1;
					  let dd = new Date().getDate();
					  let hh = new Date().getHours();
					  let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
					  let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
					  this.formdata.SUNTIME = yy+'/'+mm+'/'+dd+' '+hh+':'+mf;//时间
					  this.rdVal[0]=this.formdata.SUNTIME;
					  return yy.toString()+mm+dd+hh+mf+ss;
				},
				cameraChild(index){//照片
					uni.chooseImage({
					    count: 1, //默认9
					    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					    // sourceType: ['album'], //从相册选择
					    success: function (res) {
							_this.formdata.imgfiles[index].imagesrc=res.tempFiles[0].path;
							uni.uploadFile({//图片上传返回
								url:_this.imgUrl+'/api/photo/uploadphoto',
								filePath: res.tempFilePaths[0],
								name: "file",
								headers: {'Authorization':uni.getStorageSync('token')},
								success(res) {//获取照片
									_this.imgfilesNew[index]=JSON.parse(res.data).Data;
								}
							});						
					    }
					});
				},
				// bhyesOrno(e){
				// 	this.formdata.bhyesIsno=e.detail.value;
				// },
				// bhtypeVal(e){
				// 	this.formdata.BHTYPE=e.detail.value;
				// },
				// selectOne(){
				// 	this.formdata.BHBEFORE=document.getElementById('selectOne').value;
				// },
				// selectTwo(){
				// 	this.formdata.BHAFTER=document.getElementById('selectTwo').value;
				// },
				// getTextcontent(e){
				// 	let	values = e.detail.value;
				// 	this.formdata.BHREMARK=values;
				// },
				nearControl(){
					// if(!_this.doTaskShow){
						this.latitudeData=this.view.center.latitude;
						this.longitudeData=this.view.center.longitude;
						let updatelayer=this.map.layers.items[4];//标记图层
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
							};						
						updatelayer.applyEdits(updateEdit)
						.then(function(editsResult){
							console.log(editsResult.updateFeatureResults);
							//传坐标发送请求获取附近任务
							// request2({
							// 	url:'/api/lqrw/getRwList',
							// 	header: {'Authorization':uni.getStorageSync('token')},
							// }).then((res)=>{									
							// 	if(res.data.Status=="success"){
							// 		_this.tasksClass=res.data.Data;
							// 	}
							// });
						})
					// }
				},
				submitImgs(){
					if(this.formdataBHREMARK.length<15){
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '变化详情不能少于15个字'
						});
					}else{
						request2({
						    url:'/api/lqrw/submit',
						    header: {'Authorization':uni.getStorageSync('token')},
							method:"POST",
						    data: {
						        photos:_this.imgfilesNew,
								id:this.formdataID,
								remark:_this.formdataBHREMARK,
						    }
						}).then((res)=>{									
							if(res.data.Status=="success"){
								this.doTaskShow=true;
								this.showPageOne=true;
								this.dotaskFirst();
								// 提交后清空页面
								this.formdata.BHREMARK="";
								this.formdata.imgfiles=[
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
								];
							}
						});
					}
				},
				submitCancel(){
					this.showPageOne=true;
					this.showPageThree=false;
					this.showPageBars=true;
					this.formdata.imgfiles=this.formdataImgfiles;
					this.taskContentObj=[];
					// this.formdata=JSON.parse(JSON.stringify(this.formdata2));//清除内容模板
					// this.map.layers.items[5].popupTemplate=_this.template2;
				},
				
			},
			components:{
				taskRoad,
				radioContent,
				inputContent,
				selectContent
			},
		}
</script>

<style>
	@import url("./css/taskIndex.css");	
</style>
