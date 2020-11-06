import request from "@/utils/fetch";

/**
 * 查询集群状态
 */
export function queryClusterState(params) {
  return request({
    url: "/api/private/mysql/home/ms/queryClusterState",
    method: "post",
    data: params
  });
}

/**
 * 查询数据库版本
 */
export function queryDBVersion(params) {
  return request({
    url: "/api/private/mysql/home/ms/queryDBVersion",
    method: "post",
    data: params
  });
}

/**
 * 查询BinLog
 */
export function queryBinLog(params) {
  return request({
    url: "/api/private/mysql/home/ms/queryBinLog",
    method: "post",
    data: params
  });
}

/**
 * 查询最大连接数
 */
export function queryMaxConnectionNumber(params) {
  return request({
    url: "/api/private/mysql/home/ms/queryMaxConnectionNumber",
    method: "post",
    data: params
  });
}

/**
 * 查询当前连接数
 */
export function queryRunningConnectionNumber(params) {
  return request({
    url: "/api/private/mysql/home/ms/queryRunningConnectionNumber",
    method: "post",
    data: params
  });
}

/**
 * 查询Relay Log
 */
export function queryRelayLog(params) {
  return request({
    url: "/api/private/mysql/home/ms/queryRelayLog",
    method: "post",
    data: params
  });
}

/**
 * 查询主库Bin Log
 */
export function queryMasterBinLog(params) {
  return request({
    url: "/api/private/mysql/home/ms/queryMasterBinLog",
    method: "post",
    data: params
  });
}

/**
 * 查询Slave IO状态
 */
export function querySlaveIOState(params) {
  return request({
    url: "/api/private/mysql/home/ms/querySlaveIOState",
    method: "post",
    data: params
  });
}

/**
 * 查询实时从库延迟
 */
export function querySlaveDelay(params) {
  return request({
    url: "/api/private/mysql/home/ms/querySlaveDelay",
    method: "post",
    data: params
  });
}

/**
 * 查询主从延迟、连接数监控数据
 */
export function queryMonitorMSSingle(params) {
  return request({
    url: "/api/private/mysql/home/ms/queryMonitorMSSingle",
    method: "post",
    data: params
  });
}

/**
 * 查询传输量
 */
export function queryTransportSpeed(params) {
  return request({
    url: "/api/private/mysql/home/ms/queryTransportSpeed",
    method: "post",
    data: params
  });
}

/**
 * 查询数据库状态
 */
export function queryDBState(params) {
  return request({
    url: "/api/private/mysql/home/db/queryDBState",
    method: "post",
    data: params
  });
}

/**
 * 慢查询次数
 */
export function slowQueryNumber(params) {
  return request({
    url: "/api/private/mysql/home/db/slowQueryNumber",
    method: "post",
    data: params
  });
}

/**
 * 查询InnoDB缓存大小
 */
export function queryInnoDBBufferSize(params) {
  return request({
    url: "/api/private/mysql/home/db/queryInnoDBBufferSize",
    method: "post",
    data: params
  });
}

/**
 * 查询InnoDB缓存/RAM
 */
export function queryInnoDBBufferRAM(params) {
  return request({
    url: "/api/private/mysql/home/db/queryInnoDBBufferRAM",
    method: "post",
    data: params
  });
}

/**
 * 查询实时连接数
 */
export function queryConnectionNumber(params) {
  return request({
    url: "/api/private/mysql/home/db/queryConnectionNumber",
    method: "post",
    data: params
  });
}

/**
 * 查询实时QPS
 */
export function queryQPS(params) {
  return request({
    url: "/api/private/mysql/home/db/queryQPS",
    method: "post",
    data: params
  });
}

/**
 * 查询实时TPS
 */
export function queryTPS(params) {
  return request({
    url: "/api/private/mysql/home/db/queryTPS",
    method: "post",
    data: params
  });
}

/**
 * 查询InnoDB缓存区命中率
 */
export function queryInnoDBBufferHitRate(params) {
  return request({
    url: "/api/private/mysql/home/db/queryInnoDBBufferHitRate",
    method: "post",
    data: params
  });
}

/**
 * 查询数据库运行时间
 */
export function queryRunningTime(params) {
  return request({
    url: "/api/private/mysql/home/db/queryRunningTime",
    method: "post",
    data: params
  });
}

/**
 * 查询TPS、QPS、慢查询数监控数据
 */
export function queryMonitorSingle(params) {
  return request({
    url: "/api/private/mysql/home/db/queryMonitorSingle",
    method: "post",
    data: params
  });
}

/**
 * 查询实时从库延迟
 */
export function queryMonitorConnect(params) {
  return request({
    url: "/api/private/mysql/home/db/queryMonitorConnect",
    method: "post",
    data: params
  });
}

/**
 * 查询SQL执行次数监控数据
 */
export function queryMonitorDML(params) {
  return request({
    url: "/api/private/mysql/home/db/queryMonitorDML",
    method: "post",
    data: params
  });
}

/**
 * 查询复制状态
 */
export function queryReplicationState(params) {
  return request({
    url: "/api/private/mysql/masterSlave/queryReplicationState",
    method: "post",
    data: params
  });
}

/**
 * 查询从库状态信息
 */
export function querySlaveStateInfo(params) {
  return request({
    url: "/api/private/mysql/masterSlave/querySlaveStateInfo",
    method: "post",
    data: params
  });
}

/**
 * 查询资源监控
 */
export function queryResourceMonitor(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryResourceMonitor",
    method: "post",
    data: params
  });
}

/**
 * 查询状态监控
 */
export function queryStateMonitor(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryStateMonitor",
    method: "post",
    data: params
  });
}

/**
 * 查询键缓存监控
 */
export function queryKeyCacheMonitor(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryKeyCacheMonitor",
    method: "post",
    data: params
  });
}

/**
 * 查询InnoDB监控
 */
export function queryInnoDBMonitor(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryInnoDBMonitor",
    method: "post",
    data: params
  });
}

/**
 * 查询进程监控
 */
export function queryProcessMonitor(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryProcessMonitor",
    method: "post",
    data: params
  });
}

/**
 * 查询表分析
 */
export function queryTableAnalysis(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryTableAnalysis",
    method: "post",
    data: params
  });
}

/**
 * 查询碎片
 */
export function queryFragment(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryFragment",
    method: "post",
    data: params
  });
}

/**
 * 查询索引信息
 */
export function queryIndexInfo(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryIndexInfo",
    method: "post",
    data: params
  });
}

/**
 * 查询服务器字符集
 */
export function queryServerCharacter(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryServerCharacter",
    method: "post",
    data: params
  });
}

/**
 * 查询数据库字符集
 */
export function queryDBCharacter(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryDBCharacter",
    method: "post",
    data: params
  });
}

/**
 * 查询分区表信息
 */
export function queryPartitionTableInfo(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryPartitionTableInfo",
    method: "post",
    data: params
  });
}

/**
 * 查询表空间
 */
export function queryTableSpace(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryTableSpace",
    method: "post",
    data: params
  });
}

/**
 * 查询错误日志
 */
export function queryErrorLog(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryErrorLog",
    method: "post",
    data: params
  });
}

/**
 * 下载错误日志
 */
export function downloadErrorLog(params) {
  return request({
    url: "/api/private/mysql/dBInspection/downloadErrorLog",
    method: "post",
    data: params
  });
}

/**
 * 查询REDO日志
 */
export function queryRedoLog(params) {
  return request({
    url: "/api/private/mysql/dBInspection/queryRedoLog",
    method: "post",
    data: params
  });
}

/**
 * 创建、生成、下载数据库巡检报告
 */
export function createInspectionReport(params) {
  return request({
    url: "/api/private/mysql/dBInspection/createInspectionReport",
    method: "post",
    data: params
  });
}

/**
 * 查询MySQL数据库名称
 */
export function queryDBName(params) {
  return request({
    url: "/api/private/mysql/queryDBName",
    method: "post",
    data: params
  });
}

/**
 * 查询表名
 */
export function queryTableName(params) {
  return request({
    url: "/api/private/mysql/queryTableName",
    method: "post",
    data: params
  });
}

/**
 * 查询分区表名
 */
export function queryPartitionTableName(params) {
  return request({
    url: "/api/private/mysql/queryPartitionTableName",
    method: "post",
    data: params
  });
}

/**
 * 创建、生成、下载AWR报告
 */
export function createAwrReport(params) {
  return request({
    url: "/api/private/mysql/dBPerformance/createAwrReport",
    method: "post",
    data: params
  });
}

/**
 * 慢查询
 */
export function slowQuery(params) {
  return request({
    url: "/api/private/mysql/dBPerformance/slowQuery",
    method: "post",
    data: params
  });
}
