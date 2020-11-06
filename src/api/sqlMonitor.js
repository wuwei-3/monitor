import request from "@/utils/fetch";

/**
 *
 * 逻辑读
 */
export function LogicalReads(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryLogicalRead",
    method: "post",
    data: params
  });
}

/**
 *
 * 物理读
 */
export function PhysicalRead(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryPhysicalRead",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询高版本SQL
 */
export function HigeVersionSQL(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryHighVersionSQL",
    method: "post",
    data: params
  });
}

/**
 *
 *  全局扫描
 */
export function TableScanSQL(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryFullTableScanSQL",
    method: "post",
    data: params
  });
}

/**
 *
 * 频率高sql
 */
export function ExecFreqHigeSQL(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryExecFreqHighSQL",
    method: "post",
    data: params
  });
}

/**
 *
 * 运行时间sql
 */
export function LongTimeRunSQL(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryLongTimeRunSQL",
    method: "post",
    data: params
  });
}

/**
 *
 * 排序
 */
export function SortHigeSQL(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/querySortHighSQL",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询profile
 */
export function ProFile(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryProFile",
    method: "post",
    data: params
  });
}

/**
 *
 * 修改profile
 */
export function modifyProFile(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/modifyProFile",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询字典
 */
export function queryDataDictionary(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryDataDictionaryStatistics",
    method: "post",
    data: params
  });
}

/**
 *
 * 回滚状态
 */
export function queryRollback(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryRollbackSegmentState",
    method: "post",
    data: params
  });
}

/**
 *
 * 热查询
 */
export function queryHotObject(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryHotObject",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询表外键
 */
export function queryTableForeign(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryTableForeignKeyInfo",
    method: "post",
    data: params
  });
}

/**
 *
 * 下载
 */
export function downloadExecution(params) {
  return request({
    url: "/api/private/oracle/downloadExecutionPlan",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询快照
 */
export function querySnapshot(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/querySnapshot",
    method: "post",
    data: params
  });
}

/**
 *
 * 生成快照
 */
export function createAwr(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/createAwrReport",
    method: "post",
    data: params
  });
}

/**
 *
 * 创建快照
 */
export function createSnapshot(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/createSnapshot",
    method: "post",
    data: params
  });
}

/**
 *
 * 下载快照
 */
export function downloadAwrReport(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/downloadAwrReport",
    method: "get",
    params: params
  });
}

/**
 *
 *  清空快照
 */
export function clearSnapshot(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/clearSnapshot",
    method: "post",
    data: params
  });
}

/**
 *
 *  查看所有会话
 */
export function ActiveSession(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryActiveSession",
    method: "post",
    data: params
  });
}

/**
 *
 *  长时间释放锁
 */
export function LongTimeNoReleaseLock(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryLongTimeNoReleaseLock",
    method: "post",
    data: params
  });
}

/**
 *
 *  缓冲区命中率
 */
export function BufferHitRate(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryBufferHitRate",
    method: "post",
    data: params
  });
}

/**
 *
 *  获取用户名
 */
export function queryUserName(params) {
  return request({
    url: "/api/private/oracle/queryUserName",
    method: "post",
    data: params
  });
}

/**
 *
 *  获取表名
 */
export function queryObjectName(params) {
  return request({
    url: "/api/private/oracle/queryObjectName",
    method: "post",
    data: params
  });
}

/**
 *
 *  查询表统计信息
 */
export function queryTableStatisticsInfo(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryTableStatisticsInfo",
    method: "post",
    data: params
  });
}

/**
 *
 *  查询索引统计信息
 */
export function IndexStatisticsInfo(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryIndexStatisticsInfo",
    method: "post",
    data: params
  });
}

/**
 *
 *  收集表统计信息
 */
export function collectTableStatistics(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/collectTableStatisticsInfo",
    method: "post",
    data: params
  });
}

/**
 *
 * 收集索引统计信息
 */
export function collectIndexStatistics(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/collectIndexStatisticsInfo",
    method: "post",
    data: params
  });
}

/**
 *
 *  收集用户统计信息
 */
export function collectUserStatistics(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/collectUserStatisticsInfo",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询表碎片
 */
export function TableFragmentation(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryTableFragmentation",
    method: "post",
    data: params
  });
}

/**
 *
 *  查询索引碎片
 */
export function IndexFragmentation(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryIndexFragmentation",
    method: "post",
    data: params
  });
}

/**
 *
 *  查询索引碎片
 */
export function rebuildIndex(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/rebuildIndex",
    method: "post",
    data: params
  });
}

/**
 *
 * cpu回话
 */
export function CPUManySession(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryCPUManySession",
    method: "post",
    data: params
  });
}

/**
 *
 *  sql plan
 */
export function SQLExecutionPlan(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/querySQLExecutionPlan",
    method: "post",
    data: params
  });
}

/**
 *
 *  固定sql计划
 */
export function fixedSQLExecutionPlan(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/fixedSQLExecutionPlan",
    method: "post",
    data: params
  });
}

/**
 *
 *  行迁移
 */
export function queryRowMigration(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryRowMigration",
    method: "post",
    data: params
  });
}

/**
 *
 *  查询DB等待事件
 */
export function queryDBWaitEvent(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryDBWaitEvent",
    method: "post",
    data: params
  });
}

/**
 *
 *  查询系统资源使用情况
 */
export function queryUseOfSystemResources(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryUseOfSystemResources",
    method: "post",
    data: params
  });
}

/**
 *
 *  查询回滚段上会话
 */
export function queryRollbackSegmentSession(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryRollbackSegmentSession",
    method: "post",
    data: params
  });
}
