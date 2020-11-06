<template>
  <!-- 监控平台首页 -->
  <div id="app">
    <div class="p-header"
         v-if="list.appHeader"
         :style="{background:mTitle?'':'#1c2226'}">
      <m-header></m-header>
    </div>
    <div class="p-botom"
         :style="{height:list.appHeight,backgroundColor:mTitle?'#e7e8ed':'#1c2226'}">
      <div class="m-lefta"
           v-if="list.appleft">
        <m-left></m-left>
      </div>
      <div class="m-right"
           :style="[{'width':list.appWidth}]">
        <div class="t-title"
             v-if="mTitle"
             :style="{'margin-left':header? '':'25px'}">
          <div class="t-ico"
               @click="clear"
               v-show="!header"
               :title="'退出全屏'">
            <i class="iconfont iconspread-fill-01"></i>
          </div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(tle,index) in mTiles"
                                :key="index">{{tle.name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="t-router"
             :style="{height:mTitle?'calc(100% - 44px)':'100%'}">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mHeader from "@/components/header";
import mLeft from "@/components/lefter";
export default {
  components: {
    mHeader,
    mLeft
  },
  data () {
    // 默认头信息
    let item = {
      appWidth: "100%",
      appHeight: "100%",
      appHeader: false,
      appleft: false
    };
    return {
      headerShow: {
        appWidth: "calc(100% - 91px)",
        appHeight: "calc(100% - 101px)",
        appHeader: true,
        appleft: true
      },
      headerClose: item,
      list: item
    };
  },
  computed: {
    // 去菜单
    header: function () {
      return this.$store.getters.getHeader;
    },
    // 取标题
    mTitle: function () {
      return this.$store.getters.getTitle;
    },
    // 去管理头
    mTiles: function () {
      return this.$store.getters.getMTile;
    }
  },
  watch: {
    // 去除头信息
    header () {
      if (this.header) {
        this.list = this.headerShow;
      } else {
        this.list = this.headerClose;
      }
    }
  },
  mounted () {
    /**
     * 此处为了除了刷新后数据丢失-- 可以放在vuex 这里避免重新发送请求
     */
    // 去除头信息
    let head = JSON.parse(localStorage.getItem("setHeader"));
    this.$store.commit("setHeader", head);
    // 去title
    let title = JSON.parse(localStorage.getItem("setTitle"));
    this.$store.commit("setTitle", title);
    // 去除
    if (head) {
      this.list = this.headerShow;
    } else {
      this.list = this.headerClose;
    }
    // 菜单列表
    let menue = JSON.parse(localStorage.getItem("setMenue"));
    this.$store.commit("setMenue", menue);
    // 内部菜单列表
    let mTiles = JSON.parse(localStorage.getItem("mTiles"));
    this.$store.state.mTiles = mTiles;
    // 登录拦截
    let token = sessionStorage.getItem("setToken");
    if (token) {
      this.$store.commit("setToken", JSON.parse(token));
    }
    this.$store.state.mIndex = localStorage.getItem("mIndex");
    this.$store.state.mColor = localStorage.getItem('mColor')
    this.$store.state.OMM = localStorage.getItem("OMM");
    this.$store.state.mEIndex = localStorage.getItem("mEIndex");

  },
  methods: {
    clear () {
      this.$store.commit("setHeader", true);
      localStorage.setItem("setHeader", true);
    }
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  .p-header {
    height: 101px;
    width: 100%;
  }
  .p-botom {
    height: calc(100% - 101px);
    width: 100%;
    display: flex;
    .m-lefta {
      width: 91px;
      height: calc(100% + 42px);
      margin-top: -42px;
    }
    .m-right {
      width: calc(100% - 91px);
      padding: 10px;
      height: 100%;
      min-width: 985px;
      overflow-x: auto;
      .t-title {
        padding: 10px 20px 15px;
        position: relative;
        .t-ico {
          min-width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 2px;
          left: -27px;
          cursor: pointer;
          .iconspread-fill-01 {
            font-size: 17px;
          }
        }
      }
      .t-router {
        height: calc(100% - 44px);
      }
    }
  }
}
</style>
