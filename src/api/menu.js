import request from "@/utils/fetch";

/**
 * 列表
 */
export function list(params) {
  return request({
    url: "/api/private/menu/list",
    method: "post",
    data: params
  });
}

/**
 * 获取选中的菜单
 */
export function fetchSelectedMenu(params) {
  return request({
    url: "/api/private/role/fetchSelectedMenu",
    method: "post",
    data: params
  });
}
