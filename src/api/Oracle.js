import request from "@/utils/fetch";

// Oracle 管理页面 32

/**
 * 用户管理列表
 */
export function userList(params) {
  return request({
    url: "/api/private/user/page",
    method: "post",
    data: params
  });
}

/**
 * 用户新增
 */
export function save(params) {
  return request({
    url: "/api/private/user/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 * 用户新增
 */
export function deleteUser(params) {
  return request({
    url: "/api/private/user/delete",
    method: "post",
    data: params
  });
}

/**
 * 角色列表
 */
export function role(params) {
  return request({
    url: "/api/private/role/page",
    method: "post",
    data: params
  });
}
/**
 * 角色列表
 */
export function roleList(params) {
  return request({
    url: "/api/private/role/list",
    method: "post",
    data: params
  });
}

/**
 * 角色id获取list
 */
export function roleGet(params) {
  return request({
    url: "/api/private/role/fetchSelectedMenu",
    method: "post",
    data: params
  });
}

/**
 * 新增角色
 */
export function saveRole(params) {
  return request({
    url: "/api/private/role/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 * 删除角色
 */
export function deleteRole(params) {
  return request({
    url: "/api/private/role/delete",
    method: "post",
    data: params
  });
}

/**
 * 删除角色
 */
export function relationMenu(params) {
  return request({
    url: "/api/private/role/relationMenu",
    method: "post",
    data: params
  });
}

/**
 * 菜单列表 系统管理员专用
 */
export function menuList(params) {
  return request({
    url: "/api/private/menu/page",
    method: "post",
    data: params
  });
}

/**
 * 菜单新增
 */
export function menuSave(params) {
  return request({
    url: "/api/private/menu/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 * 删除菜单
 */
export function menuDel(params) {
  return request({
    url: "/api/private/menu/delete",
    method: "post",
    data: params
  });
}

/**
 * 菜单树
 */
export function menuTree(params) {
  return request({
    url: "/api/private/menu/tree",
    method: "post",
    data: params
  });
}

/**
 *  菜单最大值
 */
export function maxSort(params) {
  return request({
    url: "/api/private/menu/maxSort",
    method: "post",
    data: params
  });
}

/**
 *  调度规则配置
 */
export function triggerList(params) {
  return request({
    url: "/api/private/triggerRule/list",
    method: "post",
    data: params
  });
}

/**
 *  新增修改调度规则
 */
export function triggerSave(params) {
  return request({
    url: "/api/private/triggerRule/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *  删除调度规则
 */
export function triggerDel(params) {
  return request({
    url: "/api/private/triggerRule/delete",
    method: "post",
    data: params
  });
}

/**
 *  监控项分页列表
 */
export function monitorPage(params) {
  return request({
    url: "/api/private/monitorItem/page",
    method: "post",
    data: params
  });
}

/**
 *  监控项修改
 */
export function monitorSave(params) {
  return request({
    url: "/api/private/monitorItem/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *  监控项删除
 */
export function monitorDel(params) {
  return request({
    url: "/api/private/monitorItem/delete",
    method: "post",
    data: params
  });
}

/**
 *  告警级别
 */
export function warnList(params) {
  return request({
    url: "/api/private/warnLevel/list",
    method: "post",
    data: params
  });
}

/**
 *  告警级别
 */
export function warnList1(params) {
  return request({
    url: "/api/private/warnLevel/list",
    method: "post",
    data: params
  });
}

/**
 *  告警删除
 */
export function warnDel(params) {
  return request({
    url: "/api/private/warnLevel/delete",
    method: "post",
    data: params
  });
}

/**
 *  告警修改
 */
export function warnSave(params) {
  return request({
    url: "/api/private/warnLevel/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *  告警项列表
 */
export function warnItems(params) {
  return request({
    url: "/api/private/warnItem/page",
    method: "post",
    data: params
  });
}

/**
 *  告警项列表
 */
export function warnDels(params) {
  return request({
    url: "/api/private/warnItem/delete",
    method: "post",
    data: params
  });
}

/**
 *  告警项修改
 */
export function warnSaves(params) {
  return request({
    url: "/api/private/warnItem/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *  数据库版本 列表
 */
export function dbList(params) {
  return request({
    url: "/api/private/dbVersions/page",
    method: "post",
    data: params
  });
}

/**
 *  数据库版本 删除
 */
export function dbDel(params) {
  return request({
    url: "/api/private/dbVersions/delete",
    method: "post",
    data: params
  });
}

/**
 *  数据库版本 删除
 */
export function dbSave(params) {
  return request({
    url: "/api/private/dbVersions/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *  数据库类型列表 oralc
 */
export function oblIst(params) {
  return request({
    url: "/api/private/oracleType/list",
    method: "post",
    data: params
  });
}

/**
 *  数据库类型列表 mysql
 */
export function mylIst(params) {
  return request({
    url: "/api/private/mySQLType/list",
    method: "post",
    data: params
  });
}

/**
 *  数据库类型列表 mysql
 */
export function mariadelete(params) {
  return request({
    url: "/api/private/mariaDBType/delete",
    method: "post",
    data: params
  });
}

/**
 *  数据库类型列表 maria
 */
export function marialIst(params) {
  return request({
    url: "/api/private/mariaDBType/list",
    method: "post",
    data: params
  });
}

/**
 *  数据库类型列表 maria
 */
export function mariaSave(params) {
  return request({
    url: "/api/private/mariaDBType/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *  数据库类型 删除
 */
export function obDel(params) {
  return request({
    url: "/api/private/oracleType/delete",
    method: "post",
    data: params
  });
}

/**
 *  数据库类型 删除 MYSQL
 */
export function MYDel(params) {
  return request({
    url: "/api/private/mySQLType/delete",
    method: "post",
    data: params
  });
}

/**
 *  数据库类型 保存
 */
export function odSave(params) {
  return request({
    url: "/api/private/oracleType/saveOrUpdate",
    method: "post",
    data: params
  });
}
/**
 *  数据库类型 保存 mysql
 */
export function mySave(params) {
  return request({
    url: "/api/private/mySQLType/saveOrUpdate",
    method: "post",
    data: params
  });
}

/**
 *  完善主机信息
 */
export function loadHostInfo(params) {
  return request({
    url: "/api/private/host/loadHostInfo",
    method: "post",
    data: params
  });
}
