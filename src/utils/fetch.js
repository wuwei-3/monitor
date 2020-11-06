import axios from "axios";
import { getToken, removeToken } from "./auth";
import Qs from "qs";
import router from "@/router";
import store from "@/store/index";
axios.defaults.withCredentials = true; //让ajax携带cookie
const service = axios.create({
  baseURL: "monitor" // vue 代理全局路径
});
//添加请求拦截器
service.interceptors.request.use(
  config => {
    //数据序列化
    config.data = Qs.stringify(config.data);
    // 判断是否存在token
    if (getToken()) {
      config.headers._TOKEN = getToken();
    }
    return config;
  },
  function(error) {
    //请求错误时做些事
    return Promise.reject(error);
  }
);

//添加响应拦截器 resolve rejuct
service.interceptors.response.use(
  response => {
    // 只处理200 信息
    let str = response.request.responseURL;
    if (str.search("download") != -1 || str.search("downLoad") != -1) {
      // 下载方式暂时这样 后期有解决办法再优化
      document.location.href = response.request.responseURL;
    }
    return Promise.resolve(response.data);
  },
  error => {
    // 错误信息抛出去
    return checkStatus(error.response);
  }
);
// 数据接收
function checkStatus(response) {
  if (response) {
    const status = response.status;
    // 登录超时拦截
    if (response.data.msg == "501") {
      store.commit("setToken", "");
      localStorage.setItem("setToken", "");
      store.commit("setHeader", false);
      localStorage.setItem("setHeader", false);
      store.commit("setTitle", false);
      localStorage.setItem("setTitle", false);
      // 去除cookie
      removeToken();
      router.push("/");
      return Promise.reject({
        status,
        msg: "登录超时/服务宕机，请重新登录"
      });
    } else {
      // 所有信息后端自己抛出 前端捕获
      return Promise.reject({
        status,
        msg: response.data.msg || response.data.error
      });
    }
  }
  // 网络中断
  return Promise.reject({ msg: "网络异常:服务宕机或未启动" });
}
export default service;
