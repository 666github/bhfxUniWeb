<template>
<view class="formDiv">
	<b>{{labelname}}:</b>
	<select id="selectOne" v-model="bhstate">
	  <option value =""></option>
	  <option value ="建筑">建筑</option>
	  <option value ="道路">道路</option>
	  <option value="绿地">绿地</option>
	  <option value="裸地">裸地</option>
	  <option value="绿网">绿网</option>
	</select>
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
				bhstate:''
			}
		},
		created(){
			_this=this;
		},
		methods: {
		},
		watch:{
			bhstate(val){
				console.log(val);
				this.$emit('rdcontent',val);
			}
		},
		updated(){
			console.log('updated')
		}
	}
</script>
<style>
	#selectOne{border-radius: 5px;padding: 0 2px;margin-left: 5px;}
</style>
