<template>
<view class="formDiv"  style="display: flex;justify-content: flex-start;" >
	<b>{{labelname}}:</b>
	<input @input="radioChange" type='number' class="uni-input uniinput" focus v-for="(item,index) in values" :key="item.id"  :placeholder="item.inputval" />
</view>
</template>

<script>
	var _this;
	export default {
		props:{
			labelname:String,
			values:Array,
		},
		data() {
			return {
				
			}
		},
		methods: {
			radioChange(e){
				this.$emit('rdcontent',e.detail.value)
			}
		}
	}
</script>
<style>
	.uniinput{padding-left: 5px;}
</style>
