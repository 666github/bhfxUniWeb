<template>
<view class="formDiv formDiv2">
	<b>{{labelname}}:</b>
	<radio-group @change="radioChange">
		<label v-for="(item,index) in values" :key="item.id"  class="radioLabel">
			<radio :value="item.radioval" /><text>{{item.radioval}}</text>
		</label>
	</radio-group>
</view>
</template>

<script>
	var _this;
	export default {
		props:{
			labelname:String,
			// formdata:Object,
			// imgfilesNew:Array,
			// errShow:Boolean,
			values:Array,
			// current:Number,
			// imgUrl:String
		},
		data() {
			return {
				
			}
		},
		created(){
			_this=this;
		},
		methods: {
			radioChange(e){
				this.$emit('rdcontent',e.detail.value)
				console.log();
			}
		},
		updated(){
			console.log('updated')
		}
	}
</script>

<style>
	.radioLabel{margin: 0 5px;}
	.radioColor{color: gray;}
</style>
