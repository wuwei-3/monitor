import request from "@/utils/fetch";

// 授权页面接口 4

/**
 * 查询执行计划
 */
export function queryExecutionPlan(params) {
  return request({
    url: "/api/private/oracle/queryExecutionPlan",
    method: "post",
    data: params
  });
}

/**
 * 获取Oracle分区表名称
 */
export function queryPartitionTableName(params) {
  return request({
    url: "/api/private/oracle/queryPartitionTableName",
    method: "post",
    data: params
  });
}

/**
 * 数据文件编号
 */
export function queryDataFileNumberAndName(params) {
  return request({
    url: "/api/private/oracle/queryDataFileNumberAndName",
    method: "post",
    data: params
  });
}

/**
 * 段对象类型
 */
export function querySegmentObjectType(params) {
  return request({
    url: "/api/private/oracle/querySegmentObjectType",
    method: "post",
    data: params
  });
}

/**
 * 列表
 */
export function download(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/downloadPlan",
    method: "get",
    params: params
  });
}

/**
 * 下载DG巡检报告
 */
export function DGInspectionReport(params) {
  return request({
    url: "/api/private/oracle/dataGuard/downLoadDGInspectionReport",
    method: "get",
    params: params
  });
}

/**
 * 查看sql id
 */
export function querySQLText(params) {
  return request({
    url: "/api/private/oracle/querySQLText",
    method: "post",
    data: params
  });
}
