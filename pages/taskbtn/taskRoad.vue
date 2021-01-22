<template>
	<view class="bhfxIndex">
		<view class="phototitle">拍照</view>
		<view class="cameraDiv">
			<view class="cameraChild" @click="cameraChild(index)" v-for="(item,index) in formdata.imgfiles">
				<image :src="item.imagesrc" :key="item.id" mode="scaleToFill" ref="cameraImg" class="cameraImg"/>
			</view>
		</view>
		<view class="formDiv">
			<b>上传时间：</b>{{formdata.SUNTIME}}
		</view>
		<!-- <view class="formDiv formDiv2" >
			<view class="title"><b>变化类型：</b></view>
			<radio-group @change="bhtypeVal">
				<label v-for="(item,index) in radios" class="radioLabel">
					<radio :value="item.radioval" :key="item.id" /><text>{{item.radioval}}</text>
				</label>
			</radio-group>
		</view> -->
		<!-- <view class="formDiv" style="padding-left: 80px;">
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
		</view> -->
		<!-- <view class="formDiv">
			<view><b>变化详情：（大于15字）</b></view>
			<textarea  placeholder="请输入您的详细描述" :value="formdata.BHREMARK" class="formTextarea" @blur="getTextcontent"/>
		</view>
		<view>
			<button type="primary" @click="submitImgs">提交</button>
		</view> -->
	</view>
</template>

<script>

	export default {
		props:{
			formdata:Object,
			imgfilesNew:Array,
			// errShow:Boolean,
			radios:Array,
			current:Number,
			imgUrl:String
		},
		data(){
			return{
				// imgUrl:"http://bhfxxcx.natapp1.cc",
				// imgfilesNew:[
				// 	"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
				// 	"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
				// 	"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg"
				// ],
				// template:{
				// 	content: [{
				// 			type: "fields",
				// 			fieldInfos: [
				// 				{
				// 				fieldName: "OBJECTID",
				// 				label: "OBJECTID",
				// 				type: "number",
				// 			},{
				// 				fieldName: "ID",
				// 				label: "唯一码",
				// 				type: "string",
				// 			},{
				// 				fieldName: "BHTYPE",
				// 				label: "变化类型",
				// 				format: {
				// 					places: 0,
				// 					digitSeparator: true
				// 				}
				// 			},{
				// 				fieldName: "SUNTIME",
				// 				label: "提交时间",
				// 				type: "string"
				// 			}, {
				// 				fieldName: "BHBEFORE",
				// 				label: "变化前"										
				// 			},{
				// 				fieldName: "BHAFTER",
				// 				label: "变化后"								
				// 			}, {
				// 				fieldName: "BHREMARK",
				// 				label: "变化详情",
				// 				type: "string"
				// 			},{
				// 				fieldName: "SUBUSER",
				// 				label: "提交人员",
				// 				type: "string"
				// 			}]
				// 		},
				// 		{
				// 		  type: "media",
				// 		  mediaInfos: [ {
				// 			// title: "<b>现场图片</b>",
				// 			type: "image",
				// 			value: {
				// 			  sourceURL:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
				// 			}
				// 		  },
				// 		  {
				// 			// title: "<b>现场图片</b>",
				// 			type: "image",
				// 			value: {
				// 			  sourceURL:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
				// 			}
				// 		  },{
				// 			// title: "<b>现场图片</b>",
				// 			type: "image",
				// 			value: {
				// 			  sourceURL:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
				// 			}
				// 		  },]
				// 		},]
				// 	},
				// template2:{
				// 	content: [{
				// 			type: "fields",
				// 			fieldInfos: [
				// 				{
				// 				fieldName: "OBJECTID",
				// 				label: "OBJECTID",
				// 				type: "number"								
				// 			},{
				// 				fieldName: "ID",
				// 				label: "唯一码",
				// 				type: "string",
				// 			},{
				// 				fieldName: "BHTYPE",
				// 				label: "变化类型",
				// 				format: {
				// 					places: 0,
				// 					digitSeparator: true
				// 				}
				// 			},{
				// 				fieldName: "SUNTIME",
				// 				label: "提交时间",
				// 				type: "string"
				// 			}, {
				// 				fieldName: "BHBEFORE",
				// 				label: "变化前"										
				// 			},{
				// 				fieldName: "BHAFTER",
				// 				label: "变化后"								
				// 			}, {
				// 				fieldName: "BHREMARK",
				// 				label: "变化详情",
				// 				type: "string"
				// 			},{
				// 				fieldName: "SUBUSER",
				// 				label: "提交人员",
				// 				type: "string"
				// 			}]
				// 		},
				// 		{
				// 		  type: "media",
				// 		  mediaInfos: [ {
				// 			type: "image",
				// 			value: {
				// 			  sourceURL:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
				// 			}
				// 		  },
				// 		  {
				// 			type: "image",
				// 			value: {
				// 			  sourceURL:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
				// 			}
				// 		  },{
				// 			type: "image",
				// 			value: {
				// 			  sourceURL:"https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
				// 			}
				// 		  },]
				// 		},]
				// 	},
				// dotaskLists:[
				// 	{
				// 		dotaskName:"羊坊店路",
				// 		remainTime:"30:00",
				// 		details:"代理可发家大理石块姐夫老家当时离京弗",
				// 		dotaskMoney:"10"
				// 	},
				// ],
				// doTaskShow:false,
				// dotaskMoney:'10',
				// dotaskName:'羊坊店',
				// remainTime:'30:00',
				// // dotaskDis:false,
				// showPageOne:true,
				// formdata:{
				// 	imgfiles:[
				// 		{
				// 			imagesrc:"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACtCAYAAAC0lU3IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKWSURBVHhe7dY7S51BFEDR/P8/JYilYGNlI1j5wF5svmC4CSlyOQeyyUPWggMzU02xYebLARExkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRHTwvPz8/H6+nracY6YBvf398fFxcW3+VhznpgGNzc3P2L6WHOemAZi2hPTQEx7YhqIaU9MAzHtiWkgpj0xDcS0J6aBmPbENBDTnpgGYtoT00BMe2IaiGlPTAMx7YlpIKY9MQ3EtPdpY3p6ejpub2+/BfC783NMvzt3d3fHy8vL6Zafy6eN6SOk7xH8a3N9fX265ecipr8wYvrPeOb+PB/wwUcAP8fEeWIaiGlPTAMx7YlpIKY9MQ3EtCemgZj2xDQQ056YBmLaE9NATHtiGohpT0wDMe2JaSCmPTENxLQnpoGY9sQ0ENOemAZi2hPTQEx7YhqIaU9Mg8fHx+Py8vK4uro6Hh4eTqf8ipgW3t7ejvf399OOc8RERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTESO4yuySSL97z4uOgAAAABJRU5ErkJggg==",
				// 			id:0,
				// 		},
				// 		{
				// 			imagesrc:"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACtCAYAAAC0lU3IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKWSURBVHhe7dY7S51BFEDR/P8/JYilYGNlI1j5wF5svmC4CSlyOQeyyUPWggMzU02xYebLARExkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRHTwvPz8/H6+nracY6YBvf398fFxcW3+VhznpgGNzc3P2L6WHOemAZi2hPTQEx7YhqIaU9MAzHtiWkgpj0xDcS0J6aBmPbENBDTnpgGYtoT00BMe2IaiGlPTAMx7YlpIKY9MQ3EtPdpY3p6ejpub2+/BfC783NMvzt3d3fHy8vL6Zafy6eN6SOk7xH8a3N9fX265ecipr8wYvrPeOb+PB/wwUcAP8fEeWIaiGlPTAMx7YlpIKY9MQ3EtCemgZj2xDQQ056YBmLaE9NATHtiGohpT0wDMe2JaSCmPTENxLQnpoGY9sQ0ENOemAZi2hPTQEx7YhqIaU9Mg8fHx+Py8vK4uro6Hh4eTqf8ipgW3t7ejvf399OOc8RERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTESO4yuySSL97z4uOgAAAABJRU5ErkJggg==",
				// 			id:1,
				// 		},
				// 		{
				// 			imagesrc:"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACtCAYAAAC0lU3IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKWSURBVHhe7dY7S51BFEDR/P8/JYilYGNlI1j5wF5svmC4CSlyOQeyyUPWggMzU02xYebLARExkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRETGTGRERMZMZERExkxkRHTwvPz8/H6+nracY6YBvf398fFxcW3+VhznpgGNzc3P2L6WHOemAZi2hPTQEx7YhqIaU9MAzHtiWkgpj0xDcS0J6aBmPbENBDTnpgGYtoT00BMe2IaiGlPTAMx7YlpIKY9MQ3EtPdpY3p6ejpub2+/BfC783NMvzt3d3fHy8vL6Zafy6eN6SOk7xH8a3N9fX265ecipr8wYvrPeOb+PB/wwUcAP8fEeWIaiGlPTAMx7YlpIKY9MQ3EtCemgZj2xDQQ056YBmLaE9NATHtiGohpT0wDMe2JaSCmPTENxLQnpoGY9sQ0ENOemAZi2hPTQEx7YhqIaU9Mg8fHx+Py8vK4uro6Hh4eTqf8ipgW3t7ejvf399OOc8RERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTGTEREZMZMRERkxkxERGTESO4yuySSL97z4uOgAAAABJRU5ErkJggg==",
				// 			id:2,
				// 		}
				// 	],
				// 	SUNTIME:"2020",
				// 	// BHTYPE:"拆除",
				// 	BHREMARK:"",						
				// 	// BHBEFORE:'绿地',
				// 	// BHAFTER:'裸地',
				// 	// SUBUSER:'',
				// 	ID:'',
				// },
				// radios:[
				// 	{
				// 		id:0,
				// 		radioval:"新增"
				// 	},
				// 	{
				// 		id:1,
				// 		radioval:"拆除"
				// 	},
				// 	{
				// 		id:2,
				// 		radioval:"改造"
				// 	},
				// ],
				// radios2:[						
				// 	{
				// 		id:1,
				// 		radioval:"是"
				// 	},
				// 	{
				// 		id:0,
				// 		radioval:"否"
				// 	}
				// ],
				// refObjectid:666
			}
		},
		methods:{
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
			bhtypeVal(e){
				this.formdata.BHTYPE=e.detail.value;
			},
			submitImgs(){
				if(this.formdata.BHREMARK.length<15){
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
							id:this.formdata.ID,
							remark:_this.formdata.BHREMARK,
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
		}
	    // components: {uniCollapse,uniCollapseItem}
	}
</script>

<style>
	@import url("./css/taskIndex.css")
</style>