import request from "@/utils/fetch";

/**
 *
 * 查询未监控索引
 */
export function UnmonitoredIndex(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryUnmonitoredIndex",
    method: "post",
    data: params
  });
}

/**
 *
 * 监控索引
 */
export function monitorIndex(params) {
  return request({
    url: "/api/private/oracle/dBManager/monitorIndex",
    method: "post",
    data: params
  });
}

/**
 *
 *查询已监控索引
 */
export function queryMonitoredIndex(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryMonitoredIndex",
    method: "post",
    data: params
  });
}

/**
 *
 * 取消监控索引
 */
export function cancelMonitorIndex(params) {
  return request({
    url: "/api/private/oracle/dBManager/cancelMonitorIndex",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询表空间
 */
export function queryTableSpace(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryTableSpace",
    method: "post",
    data: params
  });
}

/**
 *
 * 添加表空间数据文件
 */
export function addTableSpace(params) {
  return request({
    url: "/api/private/oracle/dBManager/addTableSpaceDataFile",
    method: "post",
    data: params
  });
}

/**
 *
 * 创建表空间
 */
export function createTableSpace(params) {
  return request({
    url: "/api/private/oracle/dBManager/createTableSpace",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询数据文件
 */
export function queryDataFile(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryDataFile",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询表空间日增长情况
 */
export function DayIncrease(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryTableSpaceDayIncrease",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询表空间月增长情况
 */
export function eMonthIncreas(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryTableSpaceMonthIncrease",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询表空间IO
 */
export function queryTableSpaceIO(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryTableSpaceIO",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询表空间IO
 */
export function queryTableSpaceIncrease(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryTableSpaceIncrease",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询段使用大小
 */
export function SegmentUseSize(params) {
  return request({
    url: "/api/private/oracle/dBManager/querySegmentUseSize",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询段分配大小
 */
export function SegmentAllocationSize(params) {
  return request({
    url: "/api/private/oracle/dBManager/querySegmentAllocationSize",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询对象大小
 */
export function queryObjectSize(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryObjectSize",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询对象DDL
 */
export function queryObjectDDL(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryObjectDDL",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询LOB对象
 */
export function queryLOBObject(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryLOBObject",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询分区表信息
 */
export function queryPartitionTableInfo(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryPartitionTableInfo",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询数据文件对象
 */
export function queryDataFileObject(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryDataFileObject",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询表的哈希值
 */
export function queryTableHashValue(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryTableHashValue",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询非绑定SQL
 */
export function queryUnboundSQL(params) {
  return request({
    url: "/api/private/oracle/dBPerformance/queryUnboundSQL",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询SQL健康检查
 */
export function querySQLHealthExamination(params) {
  return request({
    url: "/api/private/oracle/dBManager/querySQLHealthExamination",
    method: "post",
    data: params
  });
}

/**
 *
 * 下载DBLog
 */
export function downloadDBLog(params) {
  return request({
    url: "/api/private/oracle/dBManager/downloadDBLog",
    method: "get",
    params: params
  });
}

/**
 *
 * 查询DBLog
 */
export function queryDBLog(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryDBLog",
    method: "post",
    data: params
  });
}

/**
 *
 * 监控DBLog
 */
export function monitorDBLog(params) {
  return request({
    url: "/api/private/oracle/dBManager/monitorDBLog",
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
    url: "/api/private/oracle/dBManager/queryTraceFileContent",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询自动维护任务
 */
export function queryAutoMaintainTask(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryAutoMaintainTask",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询OS内核参数列表
 */
export function queryOSKernelParameterList(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryOSKernelParameterList",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询DB用户状态
 */
export function queryDBUserState(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryDBUserState",
    method: "post",
    data: params
  });
}

/**
 *
 * 查看SQL信息
 */
export function querySQLInfo(params) {
  return request({
    url: "/api/private/oracle/dBManager/querySQLInfo",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询IM对象状态
 */
export function queryIMObjectState(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryIMObjectState",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询IM空间使用情况
 */
export function queryIMSpaceUse(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryIMSpaceUse",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询IM段细腻
 */
export function queryIMSegmentInfo(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryIMSegmentInfo",
    method: "post",
    data: params
  });
}

/**
 *
 * 表启用IM
 */
export function tableEnableIM(params) {
  return request({
    url: "/api/private/oracle/dBManager/tableEnableIM",
    method: "post",
    data: params
  });
}

/**
 *
 * 表字段启用IM
 */
export function tableColumnEnableIM(params) {
  return request({
    url: "/api/private/oracle/dBManager/tableColumnEnableIM",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询PDB信息
 */
export function queryPDBInfo(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryPDBInfo",
    method: "post",
    data: params
  });
}

/**
 *
 * 修改PDB大小
 */
export function modifyPDBSize(params) {
  return request({
    url: "/api/private/oracle/dBManager/modifyPDBSize",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询PDB资源计划
 */
export function queryPDBResourcePlan(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryPDBResourcePlan",
    method: "post",
    data: params
  });
}

/**
 *
 * 启用PDB资源计划
 */
export function enablePDBResourcePlan(params) {
  return request({
    url: "/api/private/oracle/dBManager/enablePDBResourcePlan",
    method: "post",
    data: params
  });
}

/**
 *
 * 禁用PDB资源计划
 */
export function disablePDBResourcePlan(params) {
  return request({
    url: "/api/private/oracle/dBManager/disablePDBResourcePlan",
    method: "post",
    data: params
  });
}

/**
 *
 * 删除PDB资源计划
 */
export function deletePDBResourcePlan(params) {
  return request({
    url: "/api/private/oracle/dBManager/deletePDBResourcePlan",
    method: "post",
    data: params
  });
}

/**
 *
 * 创建PDB资源计划
 */
export function createPDBResourcePlan(params) {
  return request({
    url: "/api/private/oracle/dBManager/createPDBResourcePlan",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询PDB资源计划指令
 */
export function queryPDBResourcePlanDirectives(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryPDBResourcePlanDirectives",
    method: "post",
    data: params
  });
}

/**
 *
 * 查询PDB资源计划名称
 */
export function queryPDBPlanName(params) {
  return request({
    url: "/api/private/oracle/dBManager/queryPDBPlanName",
    method: "post",
    data: params
  });
}

/**
 *
 * 创建PDB资源计划指令
 */
export function createPDBResourcePlanDirectives(params) {
  return request({
    url: "/api/private/oracle/dBManager/createPDBResourcePlanDirectives",
    method: "post",
    data: params
  });
}

/**
 *
 * 删除PDB资源计划指令
 */
export function deletePDBResourcePlanDirectives(params) {
  return request({
    url: "/api/private/oracle/dBManager/deletePDBResourcePlanDirectives",
    method: "post",
    data: params
  });
}

/**
 *
 * 修改PDB资源计划指令
 */
export function modifyPDBResourcePlanDirectives(params) {
  return request({
    url: "/api/private/oracle/dBManager/modifyPDBResourcePlanDirectives",
    method: "post",
    data: params
  });
}
