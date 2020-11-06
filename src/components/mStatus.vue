<template>
  <!-- 首页状态信息矩形框 -->
  <div class="m-status">
    <div class="s-main"
         v-for="(item,index) in copyItems"
         :key="index"
         :style="[{'background':item.color,'width':item.width},{'margin-right':index == 8 ? '0px':''}]">
      <div class="s-span">
        <span :style="[{'left':item.leftName}]">{{item.top}}</span></div>
      <div class="s-div">
        <span class="s-span3"
              :style="[{'left':item.left}]">{{item.bot || time}}</span>
      </div>
      <div class="s-mark"></div>
    </div>
    <div class="s-ico"
         @click="show"
         v-show="!header">
      <i class="iconfont iconzuoyouduiqi"></i>
    </div>
  </div>
</template>

<script>
import mIdex from "@/views/Oracle/Home/cptNode/index.js";
import {
  queryInstanceState,
  queryListenState,
  queryArchivelog,
  queryFastRecoveryZoneSize,
  queryRunningTime,
  queryIOPS,
  queryREDO,
  queryConnectionNumber,
  queryTPS,
} from "@/api/oracleHome"
export default {
  components: {},
  props: {
    monitorIp: '',
  },
  data () {
    return {
      interval30: '',
      interval10: '',
      // 定时器
      time: "0",
      timeOut: "",
      copyItems: [],
      indexTime: 0,
      // 矩形信息
      items: [
        mIdex.instanSuc, //实例状态 10s
        mIdex.monitorSuc, //监听状态 10s
        mIdex.archiveSuc, // 归档模式 不刷新
        mIdex.fastSuc, // 快速分区大小 30s
        mIdex.writTimeSuc,
        mIdex.readWritSuc, // io 读写 30s
        mIdex.redoSuc, //redo 30s
        mIdex.tpsSSuc, //tps 10s
        mIdex.connectSSuc //连接数 10s
      ],
      oracleConfigId: null,
    };
  },
  watch: {
    monitorIp: {
      handler (val1, val2) {
        if (val1) {
          this.getMethods(val1)
        }
      },
      deep: true
    }
  },
  computed: {
    header: function () {
      return this.$store.getters.getHeader;
    },
  },
  mounted () {
    this.copyItems = this.$_.cloneDeep(this.items)
    // 时间定时查询
    this.timeOut = setInterval(() => {
      this.getData(this.indexTime);
    }, 1000);
  },
  methods: {
    getMethods () {
      // 清除定时器
      this.time = null;
      clearInterval(this.interval30);
      clearInterval(this.interval10);
      // 手册刷新
      this.InstanceState10()
      this.InstanceState30()
      this.archivelog()
      // 30s
      this.interval30 = setInterval(() => {
        this.InstanceState30()
      }, 30000)
      // 10s
      this.interval10 = setInterval(() => {
        this.InstanceState10()
      }, 10000)
    },
    // 不自动刷新
    archivelog () {
      let par = {
        id: this.monitorIp
      }
      this.copyItems[2] = mIdex.archiveSuc
      queryArchivelog(par).then((result) => {
        this.copyItems[2].bot = result.data || '正常'
      }).catch((err) => {
        this.copyItems[2] = mIdex.archiveErr
        this.$message.error(err.msg)
      });
      // 运行时间
      this.copyItems[4] = mIdex.writTimeSuc
      this.time = 0
      queryRunningTime(par).then((result) => {
        this.indexTime = Number(result.data) || 0
      }).catch((err) => {
        this.copyItems[4] = mIdex.writTimeErr
        this.$message.error(err.msg)
      });
    },
    // 自动刷新 10s
    InstanceState10 () {
      let par = {
        id: this.monitorIp
      }
      // 查询连接数
      this.copyItems[8] = mIdex.connectSSuc
      queryConnectionNumber(par).then((result) => {
        let data = JSON.parse(result.data)
        this.copyItems[8].bot = data[0].TOTAL_SESSIONS + '个'
      }).catch((err) => {
        this.copyItems[8] = mIdex.connectSErr
        this.$message.error(err.msg)
      });
      //TPS
      this.copyItems[7] = mIdex.tpsSSuc
      queryTPS(par).then((result) => {
        this.copyItems[7].bot = result.data + '/s'
      }).catch((err) => {
        this.copyItems[7] = mIdex.tpsSErr
        this.$message.error(err.msg)
      });
    },
    // 自动刷新 30s
    InstanceState30 () {
      let par = {
        id: this.monitorIp
      }
      // 获取实例状态
      this.copyItems[0] = mIdex.instanSuc
      queryInstanceState(par).then((result) => {
        if (result.data == 'TRUE') {
          this.copyItems[0] = mIdex.instanSuc
        } else {
          this.copyItems[0] = mIdex.instanErr
        }
      }).catch((err) => {
        this.copyItems[0] = mIdex.instanErr
        this.$message.error(err.msg)
      });
      // 获取监控状态
      this.copyItems[1] = mIdex.monitorSuc
      queryListenState(par).then((result) => {
        if (result.data == 'TRUE') {
          this.copyItems[1] = mIdex.monitorSuc
        } else {
          this.copyItems[1] = mIdex.monitorErr
        }
      }).catch((err) => {
        this.copyItems[1] = mIdex.monitorErr
        this.$message.error(err.msg)
      });
      // 查询快速恢复区大小
      this.copyItems[3] = mIdex.fastSuc
      queryFastRecoveryZoneSize(par).then((result) => {
        this.copyItems[3].bot = result.data || '0%'
      }).catch((err) => {
        this.copyItems[3] = mIdex.fastErr
        this.$message.error(err.msg)
      });
      // 读写
      this.copyItems[5] = mIdex.readWritSuc
      queryIOPS(par).then((result) => {
        let data = JSON.parse(result.data)
        this.copyItems[5].bot = data.READ + '/' + data.WRITE
      }).catch((err) => {
        this.copyItems[5] = mIdex.readWritErr
        this.$message.error(err.msg)
      });
      // 查询REDO
      this.copyItems[6] = mIdex.redoSuc
      queryREDO(par).then((result) => {
        this.copyItems[6].bot = result.data + '/S' || '0.00Kb/S'
      }).catch((err) => {
        this.copyItems[6] = mIdex.redoErr
        this.$message.error(err.msg)
      });
    },
    // 展示头信息
    show () {
      this.$store.commit("setHeader", true);
      localStorage.setItem("setHeader", true);
    },
    // 获取时间
    getData (val) {
      let run = val;
      // 总秒
      let sumSeconds = parseInt(run);
      // 天数
      let d = parseInt(sumSeconds / 86400);
      // 小时
      let h = parseInt((sumSeconds % 86400) / 3600);
      // 分钟
      let min = parseInt((sumSeconds / 60) % 60);
      // 秒
      let m = parseInt(sumSeconds % 60);

      // 插入
      this.indexTime = val + 1
      this.time = d + "天" + h + "时" + min + "分" + m + "秒";
    }
  },

  destroyed () {
    // 清除定时器
    this.time = null;
    clearInterval(this.timeOut);
    clearInterval(this.interval30);
    clearInterval(this.interval10);
  }
};
</script>
<style lang="scss">
.m-status {
  height: 100%;
  position: relative;
  display: flex;
  overflow: auto;
  justify-content: space-around;
  .s-ico {
    width: 42px;
    height: 42px;
    background-color: #2b323a;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    position: absolute;
    left: 1px;
    cursor: pointer;
    .iconzuoyouduiqi {
      font-size: 23px;
      color: #fff;
    }
  }
  .s-main {
    height: 100%;
    width: 10%;
    border-radius: 3px;
    background: #4cb15d;
    color: #fff;
    margin-right: 10px;
    position: relative;
    .s-span {
      height: 38px;
      line-height: 38px;
      text-align: center;
    }
    .s-mark {
      position: absolute;
      top: 0;
      background-color: #000000;
      border-radius: 3px;
      opacity: 0.11;
      height: 38px;
      width: 100%;
    }
    .s-div {
      height: calc(100% - 40px);
      widows: 100%;
      border-radius: 3px;
      white-space: nowrap;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>