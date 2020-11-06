// 原生axios 下载
import axios from "axios";

// 真正下载
export function download(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params })
      .then(res => {
        window.location.href = res.request.responseURL;
        resolve({ msg: "文件下载成功" });
      })
      .catch(error => {
        reject({ msg: "文件下载失败" });
      });
  });
}
//  生成16位校验码
export function getUUID() {
  return "xxxx-xxxx-xxxx-xxxx-xxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
