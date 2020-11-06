import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// // vuex 使用
import store from "./store/index";
// element ui库
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// ant ui库
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// echars 图表 使用
import Highcharts from "highcharts";
import VueHighcharts from "vue-highcharts";
// lodash 数组
import lodash from "lodash";
// cookie
import cookie from "js-cookie";

// 弹窗可拖动组件
import "@/utils/directives";

// // 全局消息提示挂在
import { Message } from "element-ui";

// 导入矢量库图表
import "@/assets/font/iconfont.css";

// 中英文切换 暂不使用 不要挂载
// import i18n from '@/i18n/i18n'

Vue.config.productionTip = false;
Vue.prototype.$cookie = cookie; //挂载cookie
Vue.prototype.$_ = lodash; //挂载lodash
Vue.prototype.$message = Message; //挂在全局提示
Vue.prototype.MyMessageHtml = Message;
// 加载ui
Vue.use(ElementUI);
Vue.use(Antd);
Vue.use(VueHighcharts, { Highcharts });

// 国际化
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
