<template>
  <!-- DG 节点 -->
  <div class="rac-node"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <!--  下拉框 -->
    <div class="e-icons"
         :style="[{'height':downOrUpS? '250px': ''}]">
      <div class="e-row"
           v-for="(group,index) in groupList"
           :key="index"
           :style="{'margin-top':index == 0 ? '0px':'10px'}">
        <!-- 最左側名稱 -->
        <div class="w-left"
             :title="group.hostIP + group.instType">
          {{ group.hostIP + group.instType}}
        </div>
        <div class="w-right">
          <m-status3 :group="group"></m-status3>
        </div>
      </div>
    </div>
    <div class="e-fontI"
         @click="shinkd"
         v-show="groupList.length > 12">
      <i class="iconfont iconshangxiala"
         v-if="downOrUpS"></i>
      <i class="iconfont iconshangxiala-copy"
         v-else></i>
    </div>
    <div class="s-ico"
         @click="show"
         v-show="!header">
      <i class="iconfont iconzuoyouduiqi"></i>
    </div>
    <!-- 活动连接数 归档大小 日志切换 -->
    <div class="e-row3">
      <div class="dg f10">
        <div class="g-top">
          <div>CRS状态</div>
          <div class="p-right">
            <div class="f10 "><i class="iconfont iconyuandian one"></i>ONLINE</div>
            <div><i class="iconfont iconyuandian two"></i>OFFLINE</div>
          </div>
        </div>
        <div class="g-bot">
          <div class="t-index"
               v-for="(item,index) in CRSState"
               :key="index"
               :style="{'margin-right':index == 3 ? '0px':''}">
            <div class="x-orc">
              <div>{{item.CRS_NAME}}</div>
            </div>
            <div class="sdiv">
              <div class="v-icon"
                   v-if="item.CRS_STATE == 'online'"><i class="iconfont icondianyayuandian"></i></div>
              <div class="v-icon"
                   v-else><i class="iconfont iconyuandian"></i></div>
            </div>
            <div class="x-span sdiv">{{item.CRS_NUM}}</div>
          </div>
        </div>
      </div>
      <div class="f10 dg2">
        <m-echarsio :ioDate="ioDate"></m-echarsio>
      </div>
      <div class="dg3">
        <div id="conResource"></div>
      </div>
    </div>
    <!-- DG 延迟时间 传输量  -->
    <div class="e-row2">
      <div class="w-echars1">
        <m-echarsdb :deDate="deDate"></m-echarsdb>
      </div>
      <div class="w-echars2">
        <div class="s-group">磁盘组</div>
        <div class="s-table">
          <m-table :column='topSqlTable'
                   :tableData="tableData"></m-table>
        </div>
      </div>
    </div>
    <div class="t-selectIP"
         v-show="header">
      <el-select v-model="MonitorIp"
                 placeholder="IP"
                 :popper-append-to-body="false"
                 @change="cuthostIp">
        <el-option v-for="item in cptIps"
                   :key="item.groupId"
                   :label="item.groupName"
                   :value="item.groupId">
        </el-option>
      </el-select>
    </div>
  </div>
</template>
 
<script>
import Highcharts from "highcharts";
import mTable from "@/components/mTable";
import mStatus3 from "@/components/mStatus3";
import { ipList } from "@/api/systemMes"
import mEcharsio from "@/components/mEcharsIO";
import mEcharsdb from "@/components/mEcharsDB";
import {
  queryDBGroup,
  queryDGLetencyTime,
  queryQuickRecoveryZoneUse,
  queryArchiveSize,
  queryLogSwitchFreq,
  queryCRSState,
  queryRACSession,
  queryDiskGroup,
  queryRACResourceState,
  queryRACGC
} from "@/api/oracleHome"
import { formatDate } from '@/utils/date'
// 最主要是这里模块的引入 很坑
export default {
  components: {
    mTable,
    mStatus3,
    mEcharsio,
    mEcharsdb
  },
  props: {},
  data () {
    return {
      racRock: 0,
      timeOut600: '',
      timeOut30: '',
      // 数据库链接
      deDate: {
        title: '节点间数据传输',
        type: 'area',
        format: '{value}Kb',
        beginTime: '',
        categories: [],
        tickInterval: 2,
        series: [
          {
            name: '每秒传输数据量',
            data: [],
            color: '#27d3ae',
          },
        ]

      },
      tableData: [],
      MyHighcharts: Highcharts,
      ioDate: {
        title: 'RAC 实例会话数',
        format: '{value}个',
        categories: [],
        tickInterval: 2,
        beginTime: '',
        series: [{
          name: 'racdb1',
          data: [],
          color: '#01d0fe',
        }, {
          name: 'racdb2',
          data: [],
          color: '#edc544',
        }]
      },
      CRSState: [],
      groupList: [],
      cptIps: [],
      MonitorIp: '',
      loading: false,
      downOrUpS: true,
      topSqlTable: [
        { label: "名称", prop: "NAME", width: 10 },
        { label: "状态", prop: "STATE", width: 10 },
        { label: "类型", prop: "TYPE", width: 8 },
        { label: "总大小 ", prop: "TOTAL_MB", width: 10 },
        { label: "剩余大小", prop: "FREE_MB", width: 10 },
        { label: "使用率(%)", prop: "USED", width: 40 },
        { label: "离线磁盘数", prop: "OFFLINE_DISKS", width: 12 },
      ],
      conResoureChart: '',
      deDateTime: 0,
    };
  },
  watch: {
    header () {
      this.conResoureChart.reflow()
    }
  },
  mounted () {
    // 下面头信息
    this.$store.commit("setTitle", false);
    localStorage.setItem("setTitle", false);
    this.tableEchars1()
    this.queryDBGroup()
  },
  computed: {
    header: function () {
      return this.$store.getters.getHeader;
    }
  },
  destroyed () {
    clearInterval(this.timeOut30)
    clearInterval(this.timeOut600)
    this.conResoureChart.destroy();
  },
  methods: {
    getMethods () {
      this.queryCRSState()
      this.queryRACSession()
      this.queryDiskGroup()
      this.queryRACResourceState()
      this.queryRACGC()
      this.timeOut30 = setInterval(() => {
        this.queryRACGC(this.deDate.beginTime)
        this.queryRACSession(this.ioDate.beginTime)
      }, 30000)
      this.timeOut600 = setInterval(() => {
        this.queryDiskGroup()
        this.queryCRSState()
        this.queryRACResourceState()
      }, 600000)
    },
    // 切换ip
    cuthostIp () {
      this.getIPList(this.MonitorIp)
      this.getMethods()
    },
    //节点间数据传输
    queryRACGC (val) {
      queryRACGC({ groupId: this.MonitorIp, beginTime: val }).then((result) => {
        if (result.time.length == 0) {
          this.deDateTime++
          if (this.deDateTime == 10) {
            this.queryRACGC()
            this.deDateTime = 0
          }
        }
        let formTime = new Date()
        let time = formatDate(formTime, 'hh:mm:ss')
        this.deDate.series[0].data = result.perSize.length == 0 ? [0] : result.perSize
        this.deDate.categories = result.time.length == 0 ? [time] : result.time
        this.deDate.beginTime = result.beginTime
      }).catch((err) => {
        this.deDate.beginTime = ''
        this.$message.error(err.msg)
      });
    },
    // 磁盘组
    queryDiskGroup () {
      queryDiskGroup({ groupId: this.MonitorIp }).then((result) => {
        result.data.forEach(item => {
          item.USED = Number(item.USED)
        });
        this.tableData = result.data || []
      }).catch((err) => {
        this.tableData = []
        this.MyMessageHtml.error({
          dangerouslyUseHTMLString: true,
          message: err.msg
        });
      });
    },
    // 资源状态
    queryRACResourceState () {
      queryRACResourceState({ groupId: this.MonitorIp }).then((result) => {
        if (result.data.off.length > 0) {
          let value1 = result.data.on.join('<br/>')
          let value2 = result.data.off.join('<br/>')
          let par = [
            {
              name: 'ONLINE',
              color: '#d35834',
              sliced: true,
              selected: true,
              value: value1,
              y: result.data.on.length,
            },
            {
              name: 'OFFLINE',
              color: '#129be0',
              value: value2,
              y: result.data.off.length,
            }
          ]
          this.tableEchars1(par, result.on, result.off)
        }
      }).catch((err) => {
        this.MyMessageHtml.error({
          dangerouslyUseHTMLString: true,
          message: err.msg
        });
      });
    },
    //  rac 回话数
    queryRACSession (val) {
      queryRACSession({ groupId: this.MonitorIp, beginTime: val }).then((result) => {
        this.ioDate.beginTime = result.beginTime
        let formTime = new Date()
        let time = formatDate(formTime, 'hh:mm:ss')
        this.racRock = 0
        this.ioDate.categories = result.data[0].racTime.length == 0 ? [time] : result.data[0].racTime
        if (result.data[0].totalSession) {
          this.ioDate.series[0].data = result.data[0].totalSession.length == 0 ? [0] : result.data[0].totalSession
        } else {
          this.ioDate.series[0].data = [0]
        }
        if (result.data[1].totalSession) {
          this.ioDate.series[1].data = result.data[1].totalSession.length == 0 ? [0] : result.data[1].totalSession
        } else {
          this.ioDate.series[1].data = [0]
        }
      }).catch((err) => {
        this.ioDate.beginTime = ''
        this.MyMessageHtml.error({
          dangerouslyUseHTMLString: true,
          message: err.msg
        });
      });
    },
    // CRS
    queryCRSState () {
      queryCRSState({ groupId: this.MonitorIp }).then((result) => {
        this.CRSState = result.data || []
      }).catch((err) => {
        this.CRSState = []
        this.MyMessageHtml.error({
          dangerouslyUseHTMLString: true,
          message: err.msg
        });
      });
    },
    // 获取主机列表
    getIPList (val) {
      let par = {
        dbType: 'RAC',
        pageSize: 50,
        pageNum: 1,
        groupId: val
      }
      ipList(par)
        .then(result => {
          this.loading = false
          if (result.data.length > 0) {
            this.groupList = result.data
          } else {
            this.groupList = []
          }
        })
        .catch(err => {
          this.loading = false
          this.groupList = []
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 头信息更改 
    queryDBGroup () {
      let par = {
        dbType: 'RAC',
        pageSize: 50,
        pageNum: 1,
      }
      this.valueIP = ''
      this.loading = true
      queryDBGroup(par).then((result) => {
        if (result.data.length > 0) {
          this.cptIps = result.data || [];
          this.MonitorIp = result.data[0].groupId
          this.getIPList(this.MonitorIp)
          this.getMethods()
        } else {
          this.loading = false
        }
      }).catch((err) => {
        this.reportOption = []
        this.loading = false
        this.MyMessageHtml.error({
          dangerouslyUseHTMLString: true,
          message: err.msg
        });
      });
    },
    shinkd () {
      this.downOrUpS = !this.downOrUpS
    },
    // 展示头信息
    show () {
      this.$store.commit("setHeader", true);
      localStorage.setItem("setHeader", true);
    },
    tableEchars1 (val1, val2, val3) {
      this.conResoureChart = this.MyHighcharts.chart('conResource', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          backgroundColor: "#232a30",
        },
        legend: {
          itemStyle: { color: "#fff" },
          align: "center",
          verticalAlign: "bottom",
        },
        tooltip: {
          headerFormat: '',
          pointFormat: '{point.value}'
        },
        title: {
          text: '资源状态',
          align: "left",
          style: {
            fontWeight: "normal",
            color: "#fff",
            fontSize: "14px"
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: '#fff'
              }
            },
            showInLegend: true
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          name: '资源状态',
          colorByPoint: true,
          data: val1
        }]
      });
    },
  },
};
</script>
<style lang="scss" >
.rac-node {
  height: 100%;
  width: 100%;
  background: #1c2226;
  color: #fff;
  overflow: auto;
  .t-selectIP {
    position: absolute;
    display: flex;
    align-items: center;
    top: 65px;
    right: 10px;
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
  .e-icons {
    min-height: 250px;
    overflow: hidden;
    .e-row {
      min-height: 120px;
      display: flex;
      margin-top: 10px;
      .w-left {
        width: 26px;
        background-color: #2a333d;
        color: #fff;
        font-size: 12px;
        line-height: 26px;
        text-align: center;
        writing-mode: vertical-lr;
        box-sizing: border-box;
        letter-spacing: 2px;
        border-radius: 3px;
        height: 120px;
      }
      .w-right {
        width: 100%;
      }
      .w-main {
        width: 10%;
        background-color: #00a8ec;
        border-radius: 3px;
        height: 115px;
        margin-right: 10px;
        position: relative;
        .n-top {
          height: 37px;
          line-height: 37px;
          display: flex;
          align-items: center;
          justify-content: center;
          .p-div {
            height: 37px;
            width: 169px;
            position: absolute;
            background-color: #000000;
            border-radius: 3px;
            opacity: 0.11;
          }
        }
        .n-bot {
          height: 78px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  .e-fontI {
    cursor: pointer;
    position: absolute;
    margin-left: -9px;
    left: 50%;
    margin-top: -16px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: #2a333d;
    border: solid 5px #1c2226;
    display: flex;
    align-items: center;
    z-index: 21;
    justify-content: center;
    &:hover {
      transform: scale(1.2);
    }
  }
  .s-ico {
    width: 42px;
    height: 42px;
    background-color: #2b323a;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    position: absolute;
    z-index: 12;
    top: 0px;
    cursor: pointer;
    .iconzuoyouduiqi {
      font-size: 23px;
      color: #fff;
    }
  }
  .e-row2 {
    height: calc(100% - 560px);
    margin-top: 10px;
    display: flex;
    min-height: 288px;
    .w-echars1 {
      width: 50%;
      height: 100%;
      margin-right: 10px;
    }
    .w-echars2 {
      width: 50%;
      height: 100%;
      background: #232a30;
      padding: 10px 0px;
      .s-group {
        height: 32px;
        padding: 0 10px;
      }
      .s-table {
        overflow: auto;
      }
    }
  }
  .e-row3 {
    margin-top: 10px;
    height: 290px;
    display: flex;
    .f10 {
      margin-right: 10px;
    }
    .dg {
      width: 40%;
      background: #232a30;
      .g-top {
        height: 50px;
        position: relative;
        line-height: 50px;
        display: flex;
        padding: 0 10px;
        .p-right {
          display: flex;
          position: absolute;
          right: 10px;
          .f10 {
            margin-right: 10px;
          }
          i {
            margin-right: 5px;
          }
          .one {
            color: #3ad1be;
          }
          .two {
            color: #d75935;
          }
        }
      }
      .g-bot {
        height: calc(100% - 60px);
        width: calc(100% -10px);
        margin: 5px;
        display: flex;
        .t-index {
          width: 25%;
          height: 100%;
          text-align: center;
          background: #2a333d;
          margin-right: 5px;
          .x-span {
            color: #606d78;
          }
          .x-orc {
            height: 133px;
            display: flex;
            align-items: center;
            padding-top: 20px;
            justify-content: center;
            div {
              width: 100px;
            }
          }
          .sdiv {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            i {
              color: #3ad1be;
            }
            .v-icon {
              width: 25px;
              height: 25px;
              border-radius: 50%;
              background: #2f6364;
            }
          }
        }
      }
    }
    .dg2 {
      width: 40%;
      height: 100%;
    }
    .dg3 {
      width: 20%;
      #conResource {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>