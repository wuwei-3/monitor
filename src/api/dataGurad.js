import request from "@/utils/fetch";

/**
 * 查询MRP
 */
export function queryMRP(params) {
  return request({
    url: "/api/private/oracle/dataGuard/queryMRP",
    method: "post",
    data: params
  });
}

/**
 * 创建、下载DG巡检报告
 */
export function createDGInspectionReport(params) {
  return request({
    url: "/api/private/oracle/dataGuard/createDGInspectionReport",
    method: "post",
    data: params
  });
}

/**
 * 查询DG同步检查（CHECK操作）
 */
export function queryDGCheck(params) {
  return request({
    url: "/api/private/oracle/dataGuard/queryDGCheck",
    method: "post",
    data: params
  });
}

/**
 * 数据库组列表
 */
export function list(params) {
  return request({
    url: "/api/private/dbGroup/list",
    method: "post",
    data: params
  });
}
