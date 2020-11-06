import request from "@/utils/fetch";

/**
 *
 * 系统信息 查找大文件
 */
export function queryBigFile(params) {
  return request({
    url: "/api/private/host/queryBigFile",
    method: "post",
    data: params
  });
}

/**
 *
 *  获取oracle 数据库信息
 */
export function queryPdbName(params) {
  return request({
    url: "/api/private/oracle/queryPdbName",
    method: "post",
    data: params
  });
}

/**
 *
 *  ip 信息获取
 */
export function ipList(params) {
  return request({
    url: "/api/private/oracleConfig/list",
    method: "post",
    data: params
  });
}

/**
 *
 * 主机ip获取
 */
export function hostIpList(params) {
  return request({
    url: "/api/private/host/list",
    method: "post",
    data: params
  });
}

/**
 *
 * 主机ip获取
 */
export function warnInfoPage(params) {
  return request({
    url: "/api/private/warnInfo/page",
    method: "post",
    data: params
  });
}
