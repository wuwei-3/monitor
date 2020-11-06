import request from "@/utils/fetch";

/**
 *
 * 查询磁盘信息
 */
export function queryDisk(params) {
  return request({
    url: "/api/private/oracle/rac/queryDisk",
    method: "post",
    data: params
  });
}

/**
 *
 * 询磁盘组状态
 */
export function queryDiskGroupState(params) {
  return request({
    url: "/api/private/oracle/rac/queryDiskGroupState",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询磁盘组属性
 */
export function queryDiskGroupAttribute(params) {
  return request({
    url: "/api/private/oracle/rac/queryDiskGroupAttribute",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询磁盘组IO
 */
export function queryDiskGroupIO(params) {
  return request({
    url: "/api/private/oracle/rac/queryDiskGroupIO",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询磁盘组IO
 */
export function queryDiskGroupTemplate(params) {
  return request({
    url: "/api/private/oracle/rac/queryDiskGroupTemplate",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询磁盘组REBALANCE状态
 */
export function queryDiskGroupRebalanceState(params) {
  return request({
    url: "/api/private/oracle/rac/queryDiskGroupRebalanceState",
    method: "post",
    data: params
  });
}

/**
 *
 * Failover检查
 */
export function failoverCheck(params) {
  return request({
    url: "/api/private/oracle/rac/failoverCheck",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询GRID日志
 */
export function queryGRIDLog(params) {
  return request({
    url: "/api/private/oracle/rac/queryGRIDLog",
    method: "post",
    data: params
  });
}

/**
 *
 * 监控GRID日志
 */
export function monitorGRIDLog(params) {
  return request({
    url: "/api/private/oracle/rac/monitorGRIDLog",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询Trace文件内容
 */
export function queryTraceFileContent(params) {
  return request({
    url: "/api/private/oracle/rac/queryTraceFileContent",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询OCR状态
 */
export function queryOCRState(params) {
  return request({
    url: "/api/private/oracle/rac/queryOCRState",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询GRID状态
 */
export function queryGRIDState(params) {
  return request({
    url: "/api/private/oracle/rac/queryGRIDState",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询资源状态
 */
export function queryResourceState(params) {
  return request({
    url: "/api/private/oracle/rac/queryResourceState",
    method: "post",
    data: params
  });
}

/**
 *
 * LoadBalance检查
 */
export function queryLoadBalance(params) {
  return request({
    url: "/api/private/oracle/rac/queryLoadBalance",
    method: "post",
    data: params
  });
}

/**
 *
 * LoadBalance检查
 */
export function queryOCRBackupInfo(params) {
  return request({
    url: "/api/private/oracle/rac/queryOCRBackupInfo",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询ASM实例参数
 */
export function queryASMInstanceParam(params) {
  return request({
    url: "/api/private/oracle/rac/queryASMInstanceParam",
    method: "post",
    data: params
  });
}

