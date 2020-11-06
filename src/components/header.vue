<template>
  <!-- 大标题+底部信息组建 -->
  <div class="header">
    <div class="r-main">
      <div class="r-logo">
        <img src="@/assets/imgs/login/logo.png"
             alt=""
             class="o-img">
        <span>数据库监控软件v2.0</span>
      </div>
      <div class="r-table"
           v-for="(item,index) in menueList"
           :key="index">
        <div @click="dataBase(item,index)"
             ref="databased"
             :style="[{'background':OMM == index ? '#232a30': '#1c2226','border-bottom': OMM == index ? '3px solid #00a8ec':'','color':OMM == index ? '#00a8ec':''}]">
          <span>{{item.dbType}}</span>
        </div>
      </div>
      <div class="r-logout"
           @mousemove="show(true)"
           @mouseout="show(false)">
        <div class="t-flex">
          <i class="iconfont iconyonghuming"></i>
          <!-- 登录用户名 -->
          <span>{{mToken.userName}}</span>
          <i class="iconfont iconarrow-down-s-line"></i>
          <div class="t-out"
               v-show="shwoSpan"
               @mousemove="show(true)"
               @mouseout="show(false)">
            <div class="t-span"
                 @click="editPas">
              <span class="iconfont iconlock--line">修改密码</span>
            </div>
            <div class="t-span"
                 @click="author">
              <span class="iconfont iconshouquan1">授权信息</span>
            </div>
            <div class="t-span"
                 @click="loginOut">
              <span class="iconfont icontuichu">退出</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-bot2">
      <div class="t-ico"
           @click="clear">
        <i class="iconfont iconzuoyouduiqi"></i>
      </div>
      <!-- system用户登录显示 -->
      <div class="t-table"
           @mousemove="showTableSys(true)"
           @mouseout="showTableSys(false)"
           v-if="syStatusName">
        <div class="t-base"
             :style="{color:rowColor || headColor?'#fff':''}">
          系统配置
        </div>
        <span>|</span>
        <!-- 三级节点信息 -->
        <div class="e-hover"
             v-show="syStatus">
          <div class="e-san1"></div>
          <div class="r-row"
               v-for="(item ,index) in Systems"
               :key="index"
               @click="unfilySys(item,index)"
               :style="{border:index == Systems.length -1?'none':'',color:rowColor?'#fff':''}">
            <div class="w-main">
              <div class="n-left">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 其他用户都能看到-->
      <div class="t-table"
           v-for="(list,index) in menueList[mIndex1].menus"
           :key="index"
           @mousemove="showTable(index)"
           @mouseout="showTable(-1)">
        <div class="t-base"
             :style="{color:rowColor1 == index ?'#fff':''}">
          {{list.name}}
        </div>
        <span>|</span>
        <!-- 三级节点信息 -->
        <div class="e-hover"
             v-show="index == indexSys && list.children">
          <div class="e-san1"></div>
          <div class="r-row"
               v-for="(item ,index2) in list.children"
               :key="index2"
               :style="{border:index2 == list.children.length -1?'none':'',color:rowColor2?'#fff':''}">
            <div class="w-main">
              <div class="n-left"
                   @click="unfilyPage(item,index,list)">{{item.name}}</div><span v-if="item.children">|</span>
              <div class="n-right"
                   v-for="(itd,index1) in item.children"
                   :key="index1">
                <div class="t-tables"
                     @click="unfilyPage(itd,index,item,list)">{{itd.name}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <m-logout :visible="visible"
              @cancel="cancel"></m-logout>
    <m-editpas :visible="visiblEdit"
               @cancel="cancelEdit"
               v-if="visiblEdit"></m-editpas>
    <a-thourmes :visible="visiblThour"
                @cancel="cancelThour"></a-thourmes>
  </div>
</template>

<script>
import { removeToken } from "@/utils/auth";
import { ipList } from "@/api/systemMes"
import header from "@/utils/header";
import mLogout from "./mLogout";
import mEditpas from "./mEditpas";
import aThourmes from "./aThourMes";
import { queryDBGroup } from "@/api/oracleHome"
import { hostIpList } from "@/api/systemMes";
export default {
  components: {
    mLogout,
    mEditpas,
    aThourmes
  },
  props: {},
  data () {
    return {
      rowColor2: false,
      rowColor1: -1,
      rowColor: false,
      syStatusName: false,
      // 系统用户才可看到
      syStatus: false,
      Systems: header.systemItems,
      visiblThour: false,
      visiblEdit: false,
      visible: false,
      mIndex: 0, //用户切换最大table信息
      indexSys: -1, //显示隐藏弹窗
      reportOption: [],
      valueIP: "",
      status: false,
      shwoSpan: false,
      groupIdList: [],
      items: {
        pageSize: 50,
        pageNum: 1,
        dbType: '',
        // groupId: '',
      }
    };
  },
  watch: {
    mColor: {
      handler (val1, val2) {
        if (val1 != -1) {
          this.rowColor1 = -1
          this.$store.state.headColor = false
          localStorage.setItem("headColor", false);
        }
      },
      deep: true
    },
    valueIP: {
      handler (val1, val2) {
        this.$store.state.monitorIp = val1
        localStorage.setItem("monitorIp", val1);
      },
      deep: true
    },
  },
  computed: {
    mTitle: function () {
      return this.$store.getters.getTitle;
    },
    mToken: function () {
      return this.$store.getters.getToken;
    },
    menueList: function () {
      return this.$store.getters.getMenue;
    },
    headColor: function () {
      return this.$store.getters.getHeadColor
    },
    mColor: function () {
      return this.$store.getters.getMColor
    },
    OMM: function () {
      return this.$store.getters.getOMM
    },
    mIndex1: function () {
      return this.$store.getters.getMIndex
    },
    meIndex: function () {
      return this.$store.getters.getMeIndex
    },
  },
  mounted () {
    let that = this;
    let form = JSON.parse(localStorage.getItem("system"));
    let sos = form.name.toLowerCase();
    if (sos == "system") {
      that.syStatusName = true;
    } else {
      that.syStatusName = false;
    }
    let headColor = JSON.parse(localStorage.getItem("headColor"));
    if (this.$_.isNumber(headColor)) {
      this.rowColor1 = headColor
    } else {
      this.$store.state.headColor = headColor
    }
  },
  methods: {
    cancelThour () {
      this.visiblThour = false;
    },
    // 授权信息展示
    author () {
      this.visiblThour = true;
    },
    // 修改密码
    cancelEdit () {
      this.visiblEdit = false;
    },
    // 修改密码
    editPas () {
      this.visiblEdit = true;
    },
    // 单独为系统管理员
    unfilySys (val1, val2) {
      this.rowColor1 = -1
      this.$store.state.headColor = true
      localStorage.setItem("headColor", true);
      // 单独跳转
      if (val1.path == '/dataTypeC') {
        this.$router.push({
          path: val1.path,
          query: {
            code: this.mIndex,
          }
        })
      } else {
        this.$router.push(val1.path);
      }
      this.syStatus = false;
      // 管理员使用
      let til = [{ id: 1, name: "系统配置" }, { id: 2, name: val1.name }];
      this.$store.state.mTiles = til;
      this.$store.commit("setTitle", true);
      localStorage.setItem("mTiles", JSON.stringify(til));
      localStorage.setItem("setTitle", true);
    },
    // 统一页面
    unfilyPage (val1, val2, val3, val4) {
      if (!val1.url) {
        return ''
      }
      let til = [];
      if (val4) {
        til = [
          { id: 1, name: val4.name },
          { id: 2, name: val3.name },
          { id: 3, name: val1.name }
        ];
      } else {
        til = [{ id: 1, name: val3.name }, { id: 2, name: val1.name }];
      }
      // 去除头信息
      this.$store.state.mTiles = til;
      localStorage.setItem("mTiles", JSON.stringify(til));
      // 只要路径存在就让点击
      if (val1.url) {
        this.rowColor1 = val2
        this.$store.state.headColor = false
        localStorage.setItem("headColor", val2);
        this.$store.commit("setTitle", true);
        localStorage.setItem("setTitle", true);
        this.indexSys = -1;
        this.$router.push(val1.url);
      }
    },
    // 系统管理页面
    showSystem (val) {
      // 页面跳转判断
      this.$store.commit("setTitle", true);
      localStorage.setItem("setTitle", true);
      this.indexSys = -1;
      this.$router.push(val.url);
    },
    // 显示隐藏弹窗
    showTableSys (val) {
      this.syStatus = val;
      this.rowColor = val
      if (!val) {
        let headColor = JSON.parse(localStorage.getItem("headColor"));
        if (this.$_.isNumber(headColor)) {
          this.rowColor1 = headColor
        } else {
          this.$store.state.headColor = headColor
        }
      }
    },
    // 显示隐藏弹窗
    showTable (val) {
      this.$store.state.headColor = false
      if (val == -1) {
        if (this.indexSys != -1) {
          this.rowColor1 = -1
        }
        this.rowColor2 = false
        let headColor = JSON.parse(localStorage.getItem("headColor"));
        if (this.$_.isNumber(headColor)) {
          this.rowColor1 = headColor
        } else {
          this.$store.state.headColor = headColor
        }
      } else {
        this.rowColor1 = val
        this.rowColor2 = true
      }
      this.indexSys = val;
    },
    // 清除头和左不信息
    clear () {
      this.$store.commit("setHeader", false);
      localStorage.setItem("setHeader", false);
    },
    // 隐藏悬浮
    show (val) {
      this.shwoSpan = val;
    },
    // 切换table 获取当前模块信息
    dataBase (val, val2, val3) {
      this.mIndex = val2;
      this.$store.state.mIndex = val2
      localStorage.setItem("mIndex", val2);
      this.$store.state.OMM = val2
      localStorage.setItem("OMM", val2);
    },
    // // 确认退出
    cancel (val) {
      if (val) {
        // 权限登录校验
        this.$store.commit("setToken", "");
        sessionStorage.setItem("setToken", "");
        this.$store.commit("setHeader", false);
        localStorage.setItem("setHeader", false);
        this.$store.commit("setTitle", false);
        localStorage.setItem("setTitle", false);
        // 去除cookie
        removeToken();
        this.$router.push("/");
      }
      this.visible = false;
    },
    // 退出登录
    loginOut () {
      this.visible = true;
    }
  },
};
</script>
<style lang="scss">
.h-bot2 {
  padding: 0 0px 0 90px;
  height: 42px;
  background-color: #232a30;
  display: flex;
  .t-ico {
    min-width: 42px;
    height: 42px;
    background-color: #2b323a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .iconzuoyouduiqi {
      font-size: 23px;
      color: #fff;
    }
  }
  .t-select {
    margin-left: auto;
    display: flex;
    align-items: center;
    margin-right: 10px;
    .el-input__suffix {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-input__inner {
      background-color: #2a333d;
      border: solid 1px #343f4b;
      height: 32px;
      line-height: 32px;
      color: #828e98;
    }
    .el-select-dropdown {
      background-color: #343f4b;
      border: 1px solid #343f4b;
    }
    .el-select-dropdown__item {
      color: #828e98;
    }

    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
      background-color: #2a333d;
      border: solid 1px #343f4b;
    }

    .el-popper[x-placement^="bottom"] .popper__arrow::after {
      border-bottom-color: #343f4b;
    }
    .el-popper[x-placement^="bottom"] .popper__arrow {
      border-bottom-color: #343f4b;
    }
  }
  .t-table {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7886;
    cursor: pointer;
    position: relative;
    .e-hover {
      font-size: 12px;
      background-color: #2b323a;
      position: absolute;
      z-index: 2004;
      left: -2px;
      top: 42px;
      padding: 10px 20px;
      span {
        margin-right: 20px;
      }
      .e-san1 {
        width: 0px;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 9px solid #2b323a;
        position: relative;
        top: -19px;
        left: 28px;
      }
      .r-row {
        height: 37px;
        line-height: 37px;
        border-bottom: 1px solid #3b444d;
        .w-main {
          display: flex;
          .n-left {
            width: 105px;
            text-align: left;
            margin-left: 0px;
          }
          .n-right {
            .t-tables {
              white-space: nowrap;
              padding: 0 15px;
              color: #7d8a99;
              &:hover {
                color: #fff;
              }
            }
          }
        }
        &:hover {
          background: #1c2226;
        }
      }
    }
    .t-base {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 14px;
      width: 100px;
      &:hover {
        color: #fff;
      }
    }
  }
}
.r-main {
  height: 59px;
  width: 100%;
  background: #1c2226;
  display: flex;
  align-items: center;
  color: #fffefe;
  font-size: 18px;
  padding: 0 10px;
  .r-logo {
    width: 220px;
    display: flex;
    align-items: center;
    .o-img {
      animation: App-logo-spin infinite 10s linear;
      width: 25px;
      height: 25px;
    }
    @keyframes App-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    span {
      margin-left: 5px;
      font-size: 18px;
    }
  }
  .r-table div {
    display: inline-block;
    width: 118px;
    height: 59px;
    background-color: #232a30;
    line-height: 59px;
    text-align: center;
    cursor: pointer;
  }
  .r-table div:hover {
    color: #00a8ec;
  }
  .r-logout {
    font-size: 13px;
    margin-left: auto;
    position: relative;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
    .t-flex {
      display: flex;
      .iconfont {
        font-size: 12px;
      }
      span,
      i {
        margin-left: 5px;
      }
      .t-out {
        width: 80px;
        min-height: 70px;
        position: absolute;
        text-align: left;
        right: 0;
        top: 58px;
        border: 1px solid #232a30;
        z-index: 100;
        background: #232a30;
        .t-span {
          height: 32px;
          line-height: 32px;
        }
        .t-span:hover {
          background: #232a30;
          color: #becad5;
        }
      }
    }
  }
}
</style>

