<template>
  <!-- 首页状态信息矩形框 -->
  <div class="m-status1">
    <div class="s-main1"
         v-for="(item,index) in copyItems1"
         :key="index"
         :style="[{'background':item.color,'width':item.width},{'margin-right':index == 8 ? '0px':''}]">
      <div class="s-span">
        <span :style="[{'left':item.leftName}]">{{item.top}}</span></div>
      <div class="s-div">
        <span class="s-span3"
              :style="[{'left':item.left},{'font-size':item.size}]">{{item.bot || time}}</span>
      </div>
      <div class="s-mark"></div>
    </div>
  </div>
</template>

<script>
import mIdex from "@/views/Oracle/Home/cptNode/index1.js";
import {
  queryDGState,
  queryDGRole,
  queryInstanceState,
  queryListenState,
  queryGAPState,
  queryFastRecoveryZoneSize,
  queryDGArchiveLog,
  queryREDO,
  queryRunningTime
} from "@/api/oracleHome"
export default {
  components: {},
  props: {
    group: ''
  },
  data () {
    return {
      // 定时器
      time: "0",
      timeOut: "",
      timeOut10: "",
      timeOut30: "",
      copyItems1: [],
      indexTime: 0,
      // 矩形信息
      items: [
        mIdex.instanSuc, //DG状态 10s
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
    group: {
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
    this.copyItems1 = this.$_.cloneDeep(this.items)
    this.getMethods(this.group)
  },
  methods: {
    getMethods (val) {
      // 清除定时器
      this.time = null;
      clearInterval(this.timeOut);
      clearInterval(this.timeOut10);
      clearInterval(this.timeOut30);
      let gid = this.group.groupId
      let cid = this.group.oracleConfigId
      this.queryDGState(gid)
      this.queryDGRole(cid)
      this.queryInstanceState(cid)
      this.queryFastRecoveryZoneSize(cid)
      this.queryRunningTime(cid)
      this.queryListenState(cid)
      this.queryREDO(cid)
      this.queryGAPState(cid)
      this.queryDGArchiveLog(cid)
      // 时间定时查询
      this.timeOut = setInterval(() => {
        this.getData(this.indexTime);
      }, 1000);
      this.timeOut10 = setInterval(() => {
        let gid = this.group.groupId
        let cid = this.group.oracleConfigId
        this.queryDGState(gid)
        this.queryInstanceState(cid)
        this.queryListenState(cid)
        this.queryGAPState(cid)
      }, 10000);
      this.timeOut30 = setInterval(() => {
        let gid = this.group.groupId
        let cid = this.group.oracleConfigId
        this.queryFastRecoveryZoneSize(cid)
        this.queryDGArchiveLog(cid)
        this.queryREDO(cid)
      }, 30000);
    },
    //DG状态
    queryDGState (val) {
      let that = this
      that.copyItems1[0] = mIdex.instanSuc
      queryDGState({ groupId: val }).then((result) => {
        if (result.data != 'TRUE') {
          that.copyItems1[0].color = 'red'
          that.copyItems1[0].bot = '失败'
        }
      }).catch((err) => {
        that.copyItems1[0].color = 'red'
        that.copyItems1[0].bot = '失败'
        that.$message.error(err.msg)
      });
    },
    // 获取角色
    queryDGRole (val) {
      let that = this
      that.copyItems1[1] = mIdex.monitorSuc
      queryDGRole({ id: val }).then((result) => {
        if (!result.data) {
          that.copyItems1[1].color = 'red'
          that.copyItems1[1].bot = '失败'
        } else {
          that.copyItems1[1].bot = result.data
        }
      }).catch((err) => {
        that.copyItems1[1].color = 'red'
        that.copyItems1[1].bot = '失败'
        that.$message.error(err.msg)
      });
    },
    // 实例状态
    queryInstanceState (val) {
      let that = this
      that.copyItems1[2] = mIdex.archiveSuc
      queryInstanceState({ id: val }).then((result) => {
        if (result.data != 'TRUE') {
          that.copyItems1[2].color = 'red'
          that.copyItems1[2].bot = '失败'
        }
      }).catch((err) => {
        that.copyItems1[2].color = 'red'
        that.copyItems1[2].bot = '失败'
        that.$message.error(err.msg)
      });
    },
    // 快速分区大小
    queryFastRecoveryZoneSize (val) {
      let that = this
      that.copyItems1[3] = mIdex.fastSuc
      queryFastRecoveryZoneSize({ id: val }).then((result) => {
        that.copyItems1[3].bot = result.data || '0%'
      }).catch((err) => {
        that.copyItems1[3].color = 'red'
        that.copyItems1[3].bot = '失败'
        that.$message.error(err.msg)
      });
    },
    // 运行时间
    queryRunningTime (val) {
      let that = this
      that.copyItems1[4] = mIdex.writTimeSuc
      queryRunningTime({ id: val }).then((result) => {
        this.indexTime = Number(result.data) || 0
      }).catch((err) => {
        that.copyItems1[4].color = 'red'
        that.copyItems1[4].bot = 0
        that.$message.error(err.msg)
      });
    },
    // 监听状态
    queryListenState (val) {
      let that = this
      that.copyItems1[5] = mIdex.readWritSuc
      queryListenState({ id: val }).then((result) => {
        if (result.data != 'TRUE') {
          that.copyItems1[5].color = 'red'
          that.copyItems1[5].bot = '失败'
        }
      }).catch((err) => {
        that.copyItems1[5].color = 'red'
        that.copyItems1[5].bot = '失败'
        that.$message.error(err.msg)
      });
    },
    //  ERDO
    queryREDO (val) {
      let that = this
      that.copyItems1[6] = mIdex.redoSuc
      queryREDO({ id: val }).then((result) => {
        that.copyItems1[6].bot = result.data + '/s'
      }).catch((err) => {
        that.copyItems1[6].color = 'red'
        that.copyItems1[6].bot = '失败'
        that.$message.error(err.msg)
      });
    },
    //  GAP
    queryGAPState (val) {
      let that = this
      that.copyItems1[7] = mIdex.tpsSSuc
      queryGAPState({ id: val }).then((result) => {
        if (result.data != 'TRUE') {
          that.copyItems1[7].color = 'red'
          that.copyItems1[7].bot = result.data
        }
      }).catch((err) => {
        that.copyItems1[7].color = 'red'
        that.copyItems1[7].bot = '失败'
        that.$message.error(err.msg)
      });
    },
    //  归档日志
    queryDGArchiveLog (val) {
      let that = this
      that.copyItems1[8] = mIdex.connectSSuc
      queryDGArchiveLog({ id: val }).then((result) => {
        that.copyItems1[8].bot = '文件数/大小：' + result.data.FILES + '/' + result.data.SIZE
      }).catch((err) => {
        that.copyItems1[8].color = 'red'
        that.copyItems1[8].bot = '失败'
        that.$message.error(err.msg)
      });
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
    clearInterval(this.timeOut10);
    clearInterval(this.timeOut30);
  }
};
</script>
<style lang="scss">
.m-status1 {
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
  .s-main1 {
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