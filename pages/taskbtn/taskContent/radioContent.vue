<template>
<view class="formDiv formDiv2">
	<b>{{consinfo.title}}:</b>
	<radio-group @change="radioChange">
		<label v-for="(item,index) in consinfo.labels" :key="index"  class="radioLabel">
			<radio :value="item" /><text>{{item}}</text>
		</label>
	</radio-group>
</view>
</template>

<script>
	// var _this;
	export default {
		props:['comId','consinfo'],
		data() {
			return {
				
			}
		},
		methods: {
			radioChange(e){
				this.$emit('rdcontent',{Id:this.comId,value:e.detail.value});
			}
		}
	}
</script>

<style>
	.radioLabel{margin: 0 5px;}
	.radioColor{color: gray;}
</style>
