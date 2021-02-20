<template>
<view class="formDiv"  style="display: flex;justify-content: flex-start;" >
	<b>{{consinfo.title}}:</b>
	<input @input="radioChange" type='text' class="uni-input uniinput"  :placeholder="consinfo.placeholder" />
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
	.uniinput{padding-left: 5px;}
</style>
