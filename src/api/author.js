import request from "@/utils/fetch";

// 授权页面接口 4

/**
 * 获取申请码
 */
export function apply() {
  return request({
    url: "/api/private/license/getApplyCode",
    method: "get"
  });
}

/**
 * 授权
 */
export function author(params) {
  return request({
    url: "/api/private/license/authorize",
    method: "post",
    data: params
  });
}

/**
 * 管理员登录
 */
export function sysLogin(params) {
  return request({
    url: "/api/private/user/sysLogin",
    method: "post",
    data: params
  });
}

/**
 * 获取授权信息
 */
export function license() {
  return request({
    url: "/api/private/license/info",
    method: "get"
  });
}
