<template>
<view class="formDiv" >
	<view><b>{{consinfo.title}}：</b></view>
	<textarea :placeholder="consinfo.placeholder" class="formTextarea" v-model="bhfxReamark" maxlength="200"/>
</view>
</template>

<script>
	var _this;
	export default {
		props:['comId','consinfo'],
		data() {
			return {
				bhfxReamark:''
			}
		},
		watch:{
			bhfxReamark(val){
				this.$emit('rdcontent',{Id:this.comId,value:val});
			}
		},
	}
</script>
<style>
	.formTextarea{width: 100%;height: 150rpx;background: lightgray;}
</style>
