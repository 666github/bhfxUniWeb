<template>
<view class="formDiv"  style="display: flex;justify-content: flex-start;" >
	<b>{{consinfo.title}}：</b>
	<!-- <input @input="radioChange" type='text' class="uni-input uniinput" mode = date  placeholder="输入日期如2021-01-01" /> -->
	<picker mode="date" :value="date"  @change="bindDateChange">
		<view class="uni-input" :class="{'fontcolor':fontcolor}">{{date}}</view>
	</picker>
</view>
</template>

<script>
	// var _this;
	export default {
		props:['comId','consinfo'],
		data() {
			// const currentDate = this.getDate({
			//             format: true
			//         })
			return {
				 date:'请选择日期',
				 fontcolor:true
			}
		},
		methods: {
			bindDateChange(e) {
				this.fontcolor=false;
				this.date = e.target.value;
				this.$emit('rdcontent',{Id:this.comId,value:this.date});
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>
<style scoped>
	/* .uniinput{padding-left: 5px;} */
	.fontcolor{color: gray;}
</style>
