import request from "@/utils/fetch";

/**
 * 查找实例状态
 */
export function queryInstanceState(params) {
  return request({
    url: "/api/private/oracle/home/db/queryInstanceState",
    method: "post",
    data: params
  });
}

/**
 * 查询监听状态
 */
export function queryListenState(params) {
  return request({
    url: "/api/private/oracle/home/db/queryListenState",
    method: "post",
    data: params
  });
}

/**
 * 查询归档模式
 */
export function queryArchivelog(params) {
  return request({
    url: "/api/private/oracle/home/db/queryArchivelog",
    method: "post",
    data: params
  });
}

/**
 * 查询快速恢复区大小
 */
export function queryFastRecoveryZoneSize(params) {
  return request({
    url: "/api/private/oracle/home/db/queryFastRecoveryZoneSize",
    method: "post",
    data: params
  });
}

/**
 * 查询运行时间
 */
export function queryRunningTime(params) {
  return request({
    url: "/api/private/oracle/home/db/queryRunningTime",
    method: "post",
    data: params
  });
}

/**
 * 查询IOPS
 */
export function queryIOPS(params) {
  return request({
    url: "/api/private/oracle/home/db/queryIOPS",
    method: "post",
    data: params
  });
}

/**
 * 查询REDO
 */
export function queryREDO(params) {
  return request({
    url: "/api/private/oracle/home/db/queryREDO",
    method: "post",
    data: params
  });
}

/**
 * 查询连接数
 */
export function queryConnectionNumber(params) {
  return request({
    url: "/api/private/oracle/home/db/queryConnectionNumber",
    method: "post",
    data: params
  });
}

/**
 * queryTPS
 */
export function queryTPS(params) {
  return request({
    url: "/api/private/oracle/home/db/queryTPS",
    method: "post",
    data: params
  });
}

/**
 * 查询DB IOPS
 */
export function queryMonitorIOPS(params) {
  return request({
    url: "/api/private/oracle/home/db/queryMonitorIOPS",
    method: "post",
    data: params
  });
}

/**
 * 查询数据库连接数
 */
export function queryMonitorDBLink(params) {
  return request({
    url: "/api/private/oracle/home/db/queryMonitorDBLink",
    method: "post",
    data: params
  });
}

/**
 * 查询实例效率
 */
export function queryInstanceEfficiency(params) {
  return request({
    url: "/api/private/oracle/home/db/queryInstanceEfficiency",
    method: "post",
    data: params
  });
}

/**
 * 查询TOP等待事件
 */
export function queryTopWaitEvent(params) {
  return request({
    url: "/api/private/oracle/home/db/queryTopWaitEvent",
    method: "post",
    data: params
  });
}

/**
 * 查询表空间
 */
export function queryTableSpace(params) {
  return request({
    url: "/api/private/oracle/home/db/queryTableSpace",
    method: "post",
    data: params
  });
}

/**
 * 查询Load Profile
 */
export function queryLoadProfile(params) {
  return request({
    url: "/api/private/oracle/home/db/queryLoadProfile",
    method: "post",
    data: params
  });
}

/**
 * 查询TOPSQL
 */
export function queryTopSQL(params) {
  return request({
    url: "/api/private/oracle/home/db/queryTopSQL",
    method: "post",
    data: params
  });
}

/**
 * 查询DG状态
 */
export function queryDGState(params) {
  return request({
    url: "/api/private/oracle/home/dg/queryDGState",
    method: "post",
    data: params
  });
}

/**
 * 查询DG角色
 */
export function queryDGRole(params) {
  return request({
    url: "/api/private/oracle/home/dg/queryDGRole",
    method: "post",
    data: params
  });
}

/**
 * 查询DG主库GAP状态
 */
export function queryGAPState(params) {
  return request({
    url: "/api/private/oracle/home/dg/queryGAPState",
    method: "post",
    data: params
  });
}

/**
 * 查询DG归档日志
 */
export function queryDGArchiveLog(params) {
  return request({
    url: "/api/private/oracle/home/dg/queryDGArchiveLog",
    method: "post",
    data: params
  });
}

/**
 * 查询DG延迟时间
 */
export function queryDGLetencyTime(params) {
  return request({
    url: "/api/private/oracle/home/dg/queryDGLetencyTime",
    method: "post",
    data: params
  });
}

/**
 * 查询备库传输速度
 */
export function queryTransmissionSpeed(params) {
  return request({
    url: "/api/private/oracle/home/dg/queryTransmissionSpeed",
    method: "post",
    data: params
  });
}

/**
 * 查询快速恢复区使用情况
 */
export function queryQuickRecoveryZoneUse(params) {
  return request({
    url: "/api/private/oracle/home/dg/queryQuickRecoveryZoneUse",
    method: "post",
    data: params
  });
}

/**
 * 查询保护模式
 */
export function queryProtectionMode(params) {
  return request({
    url: "/api/private/oracle/home/dg/queryProtectionMode",
    method: "post",
    data: params
  });
}

/**
 * 查询MRP状态L
 */
export function queryMRPState(params) {
  return request({
    url: "/api/private/oracle/home/dg/queryMRPState",
    method: "post",
    data: params
  });
}

/**
 * 查询ASM实例状态
 */
export function queryASMInstanceState(params) {
  return request({
    url: "/api/private/oracle/home/rac/queryASMInstanceState",
    method: "post",
    data: params
  });
}

/**
 * 查询CRS状态
 */
export function queryCRSState(params) {
  return request({
    url: "/api/private/oracle/home/rac/queryCRSState",
    method: "post",
    data: params
  });
}

/**
 * 查询RAC会话数
 */
export function queryRACSession(params) {
  return request({
    url: "/api/private/oracle/home/rac/queryRACSession",
    method: "post",
    data: params
  });
}

/**
 * 查询RAC资源状态
 */
export function queryRACResourceState(params) {
  return request({
    url: "/api/private/oracle/home/rac/queryRACResourceState",
    method: "post",
    data: params
  });
}

/**
 * 查询磁盘组信息
 */
export function queryDiskGroup(params) {
  return request({
    url: "/api/private/oracle/home/rac/queryDiskGroup",
    method: "post",
    data: params
  });
}

/**
 * 查询RAC节点间数据传输
 */
export function queryRACGC(params) {
  return request({
    url: "/api/private/oracle/home/rac/queryRACGC",
    method: "post",
    data: params
  });
}

/**
 * 查询DG RAC 组信息
 */
export function queryDBGroup(params) {
  return request({
    url: "/api/private/oracleConfig/queryDBGroup",
    method: "post",
    data: params
  });
}

/**
 * 存储节点运行时间
 */
export function queryRunningTimeOs(params) {
  return request({
    url: "/api/private/os/home/queryRunningTime",
    method: "post",
    data: params
  });
}

/**
 * 加载主机负载监控指标数据
 */
export function loadRealtime(params) {
  return request({
    url: "/api/private/host/monitorSystemLoad/loadRealtime",
    method: "post",
    data: params
  });
}

/**
 * CPU 使用率
 */
export function loadRealtimeCpu(params) {
  return request({
    url: "/api/private/host/monitorCPU/loadRealtime",
    method: "post",
    data: params
  });
}

/**
 * 内存负载
 */
export function loadRealtimeMemory(params) {
  return request({
    url: "/api/private/host/monitorMemory/loadRealtime",
    method: "post",
    data: params
  });
}

/**
 * 宽带
 */
export function loadRealtimeNET(params) {
  return request({
    url: "/api/private/host/monitorNET/loadRealtime",
    method: "post",
    data: params
  });
}

/**
 * io
 */
export function loadRealtimeIO(params) {
  return request({
    url: "/api/private/host/monitorIO/loadRealtime",
    method: "post",
    data: params
  });
}

/**
 * 磁盘空间
 */
export function queryDiskSpace(params) {
  return request({
    url: "/api/private/host/queryDiskSpace",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询归档大小
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
 * 日志切换频率
 */
export function queryLogSwitchFreq(params) {
  return request({
    url: "/api/private/oracle/home/dg/queryLogSwitchFreq",
    method: "post",
    data: params
  });
}
