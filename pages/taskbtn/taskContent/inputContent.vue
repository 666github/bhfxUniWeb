<template>
<view class="formDiv"  style="display: flex;justify-content: flex-start;" >
	<b>{{consinfo.title}}：</b>
	<input @input="radioChange" :type='inputType' :value="val"  class="uni-input uniinput"  :placeholder="consinfo.placeholder" maxlength="200" />
</view>
</template>

<script>
	// var _this;
	export default {
		props:['comId','consinfo'],
		data() {
			return {
				inputType:'text',
				val:''
			}
		},
		mounted(){
			this.setType(this.consinfo["type"]);
		},
		methods: {
			radioChange(e){
				let val=e.detail.value;
				if(this.consinfo["type"]=="int"){
					this.val=Math.ceil(val);
				}else{
					this.val=val;
				}				
				this.$emit('rdcontent',{Id:this.comId,value:this.val});
			},
			setType(type){
				if(type == "int" || type == "double"){
					this.inputType='number';
				}else{
					this.inputType='text';
				}
			}
		}
	}
</script>
<style>
	.uniinput{padding-left: 5px;}
</style>
