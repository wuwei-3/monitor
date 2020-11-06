import request from "@/utils/fetch";

// 登录页面接口 3

/**
 * 登录
 */
export function login(params) {
  return request({
    url: "/api/private/user/toLogin",
    method: "post",
    data: params
  });
}

/**
 * 退出
 */
export function out(params) {
  return request({
    url: "/api/private/user/loginOut",
    method: "post",
    data: params
  });
}

/**
 * 修改密码
 */
export function edit(params) {
  return request({
    url: "/api/private/user/savePassword",
    method: "post",
    data: params
  });
}
