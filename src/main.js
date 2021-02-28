import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'   //引入路由
import ViewUI  from 'view-design'   //引入ui
import './api/axiosTools'
import myStorage from 'utils/localstore'   //引入二次封装的localStorage
import 'view-design/dist/styles/iview.css';
import './permission'
import tips from '../src/utils/tips'
import './api/axiosTools'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.use(ViewUI)


// 按需引入element 组件
import { Upload,Progress,Button,Cascader,Input } from 'element-ui'
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Button)
Vue.use(Cascader)
Vue.use(Input)

// axios.defaults.timeout = 5000
// Vue.prototype.$axios = axios
Vue.prototype.$tips = tips
// Vue.prototype.$api = api
Vue.prototype.$myStorage = myStorage
// 创建事件总线
Vue.prototype.$bus = new Vue();

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})