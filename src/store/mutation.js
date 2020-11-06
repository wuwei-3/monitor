export default {
  // 去除头信息
  setHeader(state, mHeader) {
    state.mHeader = mHeader;
  },
  // 去除头信息
  setTitle(state, mTitle) {
    state.mTitle = mTitle;
  },
  // 用户唯一标识信息
  setToken(state, mToken) {
    state.mToken = mToken;
  },
  // 获取菜单信息
  setMenue(state, mMenuList) {
    state.mMenuList = mMenuList;
  },
  // 内部菜单信息
  setMTile(state, mTiles) {
    state.mTiles = mTiles;
  },
  // 头样式
  setHeadColor(state, headColor) {
    state.headColor = headColor;
  },
  // oracle mysql maridv
  setMIndex(state, mIndex) {
    state.mIndex = mIndex;
  },
  // 侧边 样式
  setMColor(state, mColor) {
    state.mColor = mColor;
  },
  // 最大头部样式
  setOMM(state, OMM) {
    state.OMM = OMM;
  },
  // 全局IP
  setMonitorIp(state, monitorIp) {
    state.monitorIp = monitorIp;
  },
  //
  setMeIndex(state, mEIndex) {
    state.mEIndex = mEIndex;
  },
  //
  setGroupList(state, groupIdList) {
    state.groupIdList = groupIdList;
  }
};
