import request from "@/utils/fetch";

/**
 *
 * @param {邮箱列表*} params 21
 */
export function mainList(params) {
  return request({
    url: "/api/private/configMail/list",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {邮箱删除*} params
 */
export function mainDel(params) {
  return request({
    url: "/api/private/configMail/delete",
    method: "post",
    data: params
  });
}

/**
 *  获取监控数据保留编码
 */
export function loadRetentionItem(params) {
  return request({
    url: "/api/private/monitorDataRetention/loadRetentionItem",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {邮箱保存*} params
 */
export function mainSave(params) {
  return request({
    url: "/api/private/configMail/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {主机列表*} params
 */
export function hostList(params) {
  return request({
    url: "/api/private/host/page",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {主机列表ip*} params
 */
export function hostIps(params) {
  return request({
    url: "/api/private/host/list",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {主机删除*} params
 */
export function hostDel(params) {
  return request({
    url: "/api/private/host/delete",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {获取主机信息*} params
 */
export function hostGetId(params) {
  return request({
    url: "/api/private/host/getHost",
    method: "get",
    params: params
  });
}

/**
 *
 * @param {完善主机信息*} params
 */
export function hostInfo(params) {
  return request({
    url: "/api/private/host/loadHostInfo",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {主机保存*} params
 */
export function hostSave(params) {
  return request({
    url: "/api/private/host/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据库列表*} params
 */
export function orList(params) {
  return request({
    url: "/api/private/oracleConfig/page",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据库删除*} params
 */
export function orDel(params) {
  return request({
    url: "/api/private/oracleConfig/delete",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据库删除*} params
 */
export function orDelMy(params) {
  return request({
    url: "/api/private/mySQLConfig/delete",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据库保存*} params
 */
export function orSave(params) {
  return request({
    url: "/api/private/oracleConfig/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据库保存*} params
 */
export function orSaveMy(params) {
  return request({
    url: "/api/private/mySQLConfig/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {告警列表*} params
 */
export function warnList(params) {
  return request({
    url: "/api/private/warnConfig/page",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {告警删除*} params
 */
export function warnDela(params) {
  return request({
    url: "/api/private/warnConfig/delete",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {告警保存*} params
 */
export function warnSave(params) {
  return request({
    url: "/api/private/warnConfig/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据保留列表*} params
 */
export function mtDateList(params) {
  return request({
    url: "/api/private/monitorDataRetention/page",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据保留删除*} params
 */
export function mtDateDel(params) {
  return request({
    url: "/api/private/monitorDataRetention/delete",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据保留保存*} params
 */
export function mtDateSave(params) {
  return request({
    url: "/api/private/monitorDataRetention/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据库组列表*} params
 */
export function dbGroupList(params) {
  return request({
    url: "/api/private/oracleConfig/info",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据库组列表*} params mysql 数据库配置
 */
export function dbGroupListMysql(params) {
  return request({
    url: "/api/private/mySQLConfig/info",
    method: "post",
    data: params
  });
}

/**
 *
 * @param {数据库组修改*} params
 */
export function dbGroupSave(params) {
  return request({
    url: "/api/private/dbGroup/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *
 * @param { 数据库组删除*} params
 */
export function dbGroupDel(params) {
  return request({
    url: "/api/private/dbGroup/delete",
    method: "post",
    data: params
  });
}

/**
 *
 * @param { 数据库组删除*} params mysql
 */
export function mySQLConfigList(params) {
  return request({
    url: "/api/private/mySQLConfig/page",
    method: "post",
    data: params
  });
}
