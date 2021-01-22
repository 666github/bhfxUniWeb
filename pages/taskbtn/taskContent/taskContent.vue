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
			<slot name='typeRadio'></slot>
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
		<slot name="huizhi"></slot>
		<view class="formDiv">
			<view><b>变化详情：（大于15字）</b></view>
			<textarea  placeholder="请输入您的详细描述" class="formTextarea" v-model="formdata.BHREMARK" />				
		</view>
		<slot name='tijiao'></slot>
	</view>
</template>

<script>
	var _this;
	export default {
		props:{
			formdata:Object,
			imgfilesNew:Array,
			errShow:Boolean,
			radios:Array,
			current:Number,
			imgUrl:String
		},
		data() {
			return {
				
			}
		},
		created(){
			_this=this;
		},
		methods: {
			cameraChild(index){//照片
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
				    // sourceType: ['album'], //从相册选择
				    success: function (res) {
						_this.formdata.imgfiles[index].imagesrc=res.tempFiles[0].path;debugger
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
		},
		updated(){
			console.log('updated')
		}
	}
</script>

<style>
@import url("../css/taskIndex.css");
</style>
