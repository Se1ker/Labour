import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import './assets/css/global.css'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'
import feedback from './utils/feedback'
import * as echarts from 'echarts';
// 导入共用 api 文件
import api from './apis/index'
// 地图
import VueAMap, {initAMapApiLoader} from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css'
initAMapApiLoader({
    key: '39399fca4fb9655b426673751e549146'
})
createApp(App).use(store).use(router).use(ElementPlus).provide('$api', api).provide('$fb',feedback).provide('$echarts', echarts).use(VueAMap).mount('#app')
