import request from "@/utils/fetch";

/**
 *
 * 查询归档日志
 */
export function queryArchiveSize(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryArchiveSize",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询SGA使用情况
 */
export function querySGAUse(params) {
  return request({
    url: "/api/private/oracle/dBInspection/querySGAUse",
    method: "post",
    data: params
  });
}

/**
 *
 * 获取定时巡检数据库
 */
export function getInspectionTime(params) {
  return request({
    url: "/api/private/oracle/dBInspection/getInspectionTime",
    method: "post",
    data: params
  });
}

/**
 *
 * 提交定时巡检数据库
 */
export function InspectionTime(params) {
  return request({
    url: "/api/private/oracle/dBInspection/saveOrUpdateInspectionTime",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询非默认查收
 */
export function queryNonDefaultParam(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryNonDefaultParam",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询表数据量
 */
export function queryTableDataVolume(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryTableDataVolume",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询在线日志切换频率
 */
export function queryOnlineLogSwitchFreq(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryOnlineLogSwitchFreq",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询临时表空间使用率
 */
export function TableSpaceUtilizationRate(params) {
  return request({
    url:
      "/api/private/oracle/dBInspection/queryTemporaryTableSpaceUtilizationRate",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询SCN
 */
export function querySCN(params) {
  return request({
    url: "/api/private/oracle/dBInspection/querySCN",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询回滚段上事务
 */
export function queryRollbackSegmentTransaction(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryRollbackSegmentTransaction",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询数据库后台进程状态
 */
export function queryDBBackgroundProcessState(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryDBBackgroundProcessState",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询数据库对象
 */
export function queryDBObject(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryDBObject",
    method: "post",
    data: params
  });
}

/**
 *
 * 创建、生成、下载数据库巡检报告
 */
export function createInspectionReport(params) {
  return request({
    url: "/api/private/oracle/dBInspection/createInspectionReport",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询PSU检查
 */
export function queryPSUInspect(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryPSUInspect",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询无效JOB
 */
export function queryInvalidJOB(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryInvalidJOB",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询监听状态
 */
export function queryListenState(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryListenState",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询无效对象
 */
export function queryInvalidObject(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryInvalidObject",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询REDO
 */
export function queryREDO(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryREDO",
    method: "post",
    data: params
  });
}

/**
 *
 * 创建REDO
 */
export function createREDO(params) {
  return request({
    url: "/api/private/oracle/dBInspection/createREDO",
    method: "post",
    data: params
  });
}

/**
 *
 * 切换REDO
 */
export function switchREDO(params) {
  return request({
    url: "/api/private/oracle/dBInspection/switchREDO",
    method: "post",
    data: params
  });
}

/**
 *
 * 索引健康检查
 */
export function queryIndexHealthExamination(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryIndexHealthExamination",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询对象锁
 */
export function queryObjectLock(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryObjectLock",
    method: "post",
    data: params
  });
}

/**
 *
 * 重建索引
 */
export function reBuildIndex(params) {
  return request({
    url: "/api/private/oracle/dBInspection/reBuildIndex",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询tnsnames.ora
 */
export function queryTnsnamesORA(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryTnsnamesORA",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询listener.ora
 */
export function queryListenerORA(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryListenerORA",
    method: "post",
    data: params
  });
}

/**
 *
 *查询sqlnet.ora
 */
export function querySQLNetORA(params) {
  return request({
    url: "/api/private/oracle/dBInspection/querySQLNetORA",
    method: "post",
    data: params
  });
}

/**
 *
 *查询实例命中率.ora
 */
export function queryInstanceEfficiency(params) {
  return request({
    url: "/api/private/oracle/dBInspection/queryInstanceEfficiency",
    method: "post",
    data: params
  });
}

/**
 *
 *下载数据库巡检报告
 */
export function downloadInspectionReport(params) {
  return request({
    url: "/api/private/oracle/dBInspection/downloadInspectionReport",
    method: "post",
    data: params
  });
}

/**
 *
 *查询DG同步检查（CHECK操作）
 */
export function queryDGCheck(params) {
  return request({
    url: "/api/private/oracle/dataGuard/queryDGCheck",
    method: "post",
    data: params
  });
}

// 告警信息 单个删除
export function warnInfoDel(params) {
  return request({
    url: "/api/private/warnInfo/delete",
    method: "post",
    data: params
  });
}

// 告警信息 删除全部
export function warnInfoDelAll(params) {
  return request({
    url: "/api/private/warnInfo/deleteAll",
    method: "post",
    data: params
  });
}
