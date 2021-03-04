export function appLoginWx(resolve,reject){//微信授权验证			
	// #ifdef MP-WEIXIN
	uni.getProvider({
	  service: 'oauth',
	  success: function (res) {
		if (~res.provider.indexOf('weixin')) {//0 ~0==-1真
		console.log(~res.provider.indexOf('weixin'),res.provider.indexOf('weixin'))
			uni.login({
				provider: 'weixin',
				success: (res2) => {			
					uni.getUserInfo({
						provider: 'weixin',
						success: (info) => {//这里请求接口
							// _this.resCode=res2;
							// _this.resinfo=info;	
							resolve([res2,info]);
						},
						fail: () => {
							uni.showToast({title:"微信登录授权失败",icon:"none"});
						}
					})							
				},
				fail: () => {
					uni.showToast({title:"微信登录授权失败",icon:"none"});
				}
			})
			
		}else{
			uni.showToast({
				title: '请先安装微信或升级版本',
				icon:"none"
			});
		}
	  }
	});
//#endif
}
// 发送请求
const baseUrl="http://bhfx.miyanoshiho.com";
export function request(options){
	let {url,data,method,header}=options;
	data=data || {};
	uni.showToast({
		title:'加载中',
		duration:200,
		icon:'loading'
	});
	return new Promise((resolve,reject)=>{
			uni.request({
				url:baseUrl + url,
				data,
				method:method || 'GET',
				header,
				success:(res) => {
					resolve(res)
				}
			})
		}
	)	
}

const baseUrl2="http://bhfxxcx.natapp1.cc";
export function request2(options){
	let {url,data,method,header}=options;
	data=data || {};
	uni.showToast({
		title:'加载中',
		duration:200,
		icon:'loading'
	});
	return new Promise((resolve,reject)=>{
			uni.request({
				url:baseUrl2 + url,
				data,
				method:method || 'GET',
				header,
				success:(res) => {
					resolve(res)
				}
			})
		}
	)
	
}
export function VxgetLocation(_this){
	_this.$jweixin.getLocation({
		type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
		success: function (res) {
		    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
		    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
		    var speed = res.speed; // 速度，以米/每秒计
		    var accuracy = res.accuracy; // 位置精度								
			_this.longitudeData=Number(longitude);
			_this.latitudeData=Number(latitude);
			let updatelayer=_this.map.layers.items[4];//标记图层
			_this.view.center=[_this.longitudeData,_this.latitudeData];
			const updateEdit={
					updateFeatures:[{
						"geometry":{
							type: 'point',
							longitude: _this.longitudeData, // 经度116.29845,39.95933
							latitude: _this.latitudeData, // 纬度
						},
						"attributes":{
						   "ObjectID": updatelayer.source.items[0].attributes.ObjectID,
						}
					}]
				};						
			updatelayer.applyEdits(updateEdit)
			.then(function(editsResult){
				// console.log(editsResult,_this.latitudeData,_this.longitudeData);
			});								
		 },
		fail:function(err){
		  	console.log(JSON.stringify(err))
		}
	})
}