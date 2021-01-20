import Vue from 'vue'
import App from './App'
import jweixin from 'jweixin-module';

Vue.config.productionTip = false
Vue.prototype.$jweixin = jweixin;//映射到全局
// Vue.prototype.$urlApi= "bhfx.miyanoshiho.com/api/";//配置baseurl
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
