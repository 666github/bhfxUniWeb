<template>
<view class="formDiv">
	<b>{{consinfo.title}}:</b>
	<select id="selectOne" v-model="bhstate">
	  <option value =""></option>
	  <option :value ="item" v-for="(item,index) in consinfo.labels" :key="index">{{item}}</option>
<!-- 	  <option value ="道路">道路</option>
	  <option value="绿地">绿地</option>
	  <option value="裸地">裸地</option>
	  <option value="绿网">绿网</option> -->
	</select>
</view>
</template>

<script>
	// var _this;
	export default {
		props:['comId','consinfo'],
		data() {
			return {
				bhstate:''
			}
		},
		methods: {
		},
		watch:{
			bhstate(val){
				this.$emit('rdcontent',{Id:this.comId,value:val});
			}
		}
	}
</script>
<style>
	#selectOne{border-radius: 5px;padding: 0 2px;margin-left: 5px;}
</style>
