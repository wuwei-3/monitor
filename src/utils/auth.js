// 存储令牌验证
import Cookies from "js-cookie";

const TokenKey = "X-Litemall-Admin-Token";

export function getToken() {
  return Cookies.get(TokenKey);
}
// 用户登录校验
export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
