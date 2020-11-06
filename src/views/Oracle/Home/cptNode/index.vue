<template>
  <div class="m-indxcpt"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="x-status1">
      <!-- one 组建 -->
      <m-status :monitorIp="MonitorIp"></m-status>
    </div>
    <div class="x-status2">
      <div class="s-chart1">
        <m-echarsio :ioDate="ioDate"></m-echarsio>
      </div>
      <div class="s-chart2">
        <m-echarsdb :deDate="deDate"></m-echarsdb>
      </div>
      <div class="s-chart3">
        <div class="t-per">
          <div class="r-per">实例效率百分比</div>
          <div class="t-select">
            <el-select v-model="valueId"
                       placeholder="实例效率"
                       :popper-append-to-body="false">
              <el-option v-for="(item,index) in reportOption"
                         :key="index"
                         :label="item.KEY"
                         :value="index">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="r-circle">
          <a-progress type="circle"
                      :percent="percent"
                      :format="forPercent"
                      :strokeWidth="8"
                      strokeColor="#79b6ff"
                      :width='180' />
        </div>
      </div>
    </div>
    <div class="x-status3">
      <div class="s-wait1">
        <t-echartswait :waitDate="waitDate"></t-echartswait>
      </div>
      <div class="s-wait2">
        <div class="t-name">
          <span>表空间</span>
        </div>
        <div class="t-table">
          <m-table :column="topSqlTable"
                   :tableData="tableData"></m-table>
        </div>
      </div>
    </div>
    <div class="x-status4">
      <div class="s-topsql">
        <div class="l-echars">
          <t-echartssql :sqlDate="sqlDateEchars"
                        :tbsColor="tbsColor"></t-echartssql>
        </div>
        <div class="l-table">
          <div v-for="(ts,index) in tablesPro"
               :key="index"
               class="e-table"
               :style="[{'background-color':tbsColor == index  ?'#2a333d' : '#1c2226'}]"
               @click="shwoProTable(ts,index)">
            <a class="iconfont icondian"></a>{{ts.code }}
          </div>
        </div>
      </div>
      <div class="e-topsql">
        <span>TOP SQL</span>
      </div>
      <div class="s-toTable">
        <div v-for="(tbs ,index) in toables"
             :key="index"
             :style="[{'background-color':tbs.color  ?'#2a333d' : '#1c2226'}]"
             @click="toTable(index)">
          <span>{{tbs.name}}</span>
        </div>
      </div>
      <div class="s-table">
        <m-table :column="TOPSQL"
                 :tableData="sqlDate"></m-table>
      </div>
    </div>
    <div class="t-selectIP"
         v-show="header">
      <el-select v-model="MonitorIp"
                 placeholder="IP"
                 :popper-append-to-body="false"
                 @change="cuthostIp">
        <el-option v-for="item in cptIps"
                   :key="item.oracleConfigId"
                   :label="item.hostIP + ' ' + item.dbName"
                   :value="item.oracleConfigId">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
// 中英文切换
import { mapState } from "vuex";
import mHeader from "@/components/header";
import mIdex from "./index.js";
import Highcharts from "highcharts";
import mTable from "@/components/mTable";
import mStatus from "@/components/mStatus";
import mEcharsio from "@/components/mEcharsIO";
import mEcharsdb from "@/components/mEcharsDB";
import tEchartswait from "@/components/echars/topWait";
import tEchartssql from "@/components/echars/topSql";
import { formatDate } from '@/utils/date'
import { ipList } from "@/api/systemMes"
import {
  queryMonitorDBLink,
  queryInstanceEfficiency,
  queryTableSpace,
  queryTopWaitEvent,
  queryTopSQL,
  queryLoadProfile,
  queryIOPS
} from "@/api/oracleHome"
export default {
  components: {
    mHeader,
    mTable,
    mStatus,
    mEcharsio,
    mEcharsdb,
    tEchartswait,
    tEchartssql
  },
  data () {
    return {
      dbLinkTime: 0,
      iopsTime: 0,
      loading: false,
      MonitorIp: '',
      cptIps: [],
      tbsColor: -1,
      tablesPro: [],
      MyHighcharts: Highcharts,
      chartsIO: '',
      chartsTOP: "",
      // 数据库链接
      deDate: {
        title: '数据库连接',
        type: 'area',
        tooltip: '个',
        format: '{value}个',
        beginTime: '',
        categories: [],
        tickInterval: 2,
        series: [
          {
            name: '连接数',
            data: [],
            color: '#27d3ae',
          },
        ]

      },
      ioDate: {
        title: 'DB IOPS',
        tooltip: '次',
        format: '{value}次',
        categories: [],
        tickInterval: 2,
        beginTime: '',
        series: [{
          name: '每秒写次数',
          data: [],
          color: '#01d0fe',
        }, {
          name: '每秒读次数',
          data: [],
          color: '#edc544',
        }]
      },
      waitDate: {
        title: 'TOP10 等待事件',
        format: '{value}s',
        tooltip: 's',
        categories: [],
        series: [
          {
            name: "AVG WAIT",
            type: "column",
            yAxis: 1,
            data: [],
            tooltip: {
              valueSuffix: "s"
            },
            color: "#80e2fc"
          },
          {
            name: "DB TIME(%)",
            type: "area",
            data: [],
            tooltip: {
              valueSuffix: "%"
            },
            color: "#edc544"
          }
        ]
      },
      sqlDateEchars: {
        title: 'Load Profile',
        tooltip: '次',
        format: '{value}次',
        categories: [],
        beginTime: '',
        tbsColor: '',
        series: [
          {
            name: "SQL",
            data: []
          }
        ]
      },
      reportOption: [],
      // 数据全局从index.js 获取
      toables: mIdex.toables,
      value: "",
      valueId: "",
      options: [],
      percent: 0,
      interval10: '', // 十秒
      interval60: "", // 一分钟
      interval3600: '', // 十分钟
      interval30: "",// 三十秒
      tableData: [],
      topSqlTable: [],
      topSqlTable1: [
        { label: "数据库名", prop: "DB_NAME", width: 15 },
        { label: "表空间名", prop: "TABLESPACE_NAME", width: 15 },
        { label: "总大小", prop: "SPACE", width: 15 },
        { label: "已使用大小", prop: "USED_SPACE", width: 15 },
        { label: "已使用百分比", prop: "USED_RATIO", width: 30 },
        { label: "剩余大小", prop: "FREE_SPACE", width: 15 },
      ],
      topSqlTable2: [
        { label: "表空间名", prop: "TABLESPACE_NAME", width: 15 },
        { label: "总大小", prop: "SPACE", width: 15 },
        { label: "已使用大小", prop: "USED_SPACE", width: 15 },
        { label: "已使用百分比", prop: "USED_RATIO", width: 30 },
        { label: "剩余大小", prop: "FREE_SPACE", width: 15 },
      ],
      // 
      TOPSQL: [
        { label: "执行时间", prop: "ELAPSED_TIME", width: 10 },
        { label: "平均执行时间", prop: "ELAPSED_PER_EXEC", width: 10 },
        { label: "CPU时间", prop: "CPU_TIME", width: 10 },
        { label: "逻辑读", prop: "BUFFER_GETS", width: 10 },
        { label: "物理读", prop: "DISK_READS", width: 10 },
        { label: "平均逻辑卷	", prop: "GETS_PER_EXEC", width: 10 },
        { label: "执行次数	", prop: "EXECUTIONS", width: 10 },
        { label: "处理数据", prop: "ROWS_PROCESSED", width: 10 },
        { label: "SQL语句", prop: "SQL_TEXT", width: 20 },
      ],
      sqlDate: [],
      sqlName: 'LOGICALREAD',
    };
  },
  props: {},
  computed: {
    header: function () {
      return this.$store.getters.getHeader;
    },
    meIndex: function () {
      return this.$store.getters.getMeIndex
    },
    mTitle: function () {
      return this.$store.getters.getTitle;
    },
  },
  watch: {
    valueId (val1, val2) {
      if (this.reportOption.length != 0) {
        this.percent = Number(this.reportOption[val1].VALUE)
      }
    },
  },
  mounted () {
    this.getIps()
    // 首页去除title
    this.$store.commit("setTitle", false);
    localStorage.setItem("setTitle", false);
    this.$store.state.headColor = false
    localStorage.setItem("headColor", false);

  },
  methods: {
    cuthostIp () {
      this.getMethods()
    },
    getMethods () {
      // 刷新页面
      clearInterval(this.interval10)
      clearInterval(this.interval60)
      clearInterval(this.interval3600)
      clearInterval(this.interval30)
      if (this.MonitorIp) {
        this.queryMonitorDb()
        this.queryMonitorIOPS()
        this.queryInstanceEfficiency()
        this.queryTableSpace()
        this.queryTopWaitEvent()
        this.queryLoadProfile()
        this.queryTopSQL(this.sqlName)
        this.interval10 = setInterval(() => {
          this.queryInstanceEfficiency()
        }, 10000)
        this.interval30 = setInterval(() => {
          this.queryMonitorIOPS(this.ioDate.beginTime)
          this.queryMonitorDb(this.deDate.beginTime)
        }, 30000)
        this.interval60 = setInterval(() => {
          this.queryTableSpace()
          this.queryTopWaitEvent()
          this.queryTopSQL(this.sqlName)
        }, 60000)
        this.interval3600 = setInterval(() => {
          this.queryLoadProfile(this.sqlDateEchars.beginTime)
        }, 3600000)
      }
    },
    getIps () {
      this.loading = true
      this.cptIps = []
      this.MonitorIp = ''
      ipList(this.items)
        .then(result => {
          this.loading = false
          if (result.data.length > 0) {
            this.cptIps = result.data || [];
            this.MonitorIp = result.data[0].oracleConfigId
            this.getMethods()
          } else {
            this.cptIps = []
            this.MonitorIp = ''
          }
        })
        .catch(err => {
          this.loading = false
          this.cptIps = []
          this.MonitorIp = ''
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 
    queryMonitorIOPS (val) {
      let par = {
        id: this.MonitorIp,
        diagram: 'diagram',
        beginTime: val
      }
      queryIOPS(par).then((result) => {
        // 处理时间
        let formTime = new Date()
        let time = formatDate(formTime, 'hh:mm:ss')
        this.ioDate.beginTime = result.beginTime || ''
        this.ioDate.categories = result.time.length == 0 ? [time] : result.time
        this.ioDate.series[0].data = result.write.length == 0 ? [0] : result.write
        this.ioDate.series[1].data = result.read.length == 0 ? [0] : result.read
        if (result.time.length == 0) {
          this.iopsTime++
          if (this.iopsTime >= 20) {
            this.queryMonitorIOPS()
          }
        } else {
          this.iopsTime = 0
        }
      }).catch((err) => {
        this.ioDate.beginTime = ''
        this.$message.error(err.msg)
      });
    },
    // 
    shwoProTable (val, val2) {
      this.tbsColor = val2
      this.sqlDateEchars.tbsColor = val2
      this.sqlDateEchars.categories = val.time
      this.sqlDateEchars.series[0].data = val.data
      this.sqlDateEchars.series[0].name = val.code
      this.sqlDateEchars.format = '{value}' + val.unit

    },
    // LoadProfile
    queryLoadProfile (val) {
      queryLoadProfile({ id: this.MonitorIp }).then((result) => {
        if (result.data.length > 0) {
          this.tbsColor = 0
          this.tablesPro = result.data
          if (result.data[0].time) {
            this.sqlDateEchars.categories = result.data[0].time
            this.sqlDateEchars.series[0].data = result.data[0].data
            this.sqlDateEchars.series[0].name = result.data[0].code
            this.sqlDateEchars.beginTime = result.beginTime
            this.sqlDateEchars.format = '{value}' + result.data[0].unit
          } else {
            this.sqlDateEchars = ''
          }
        } else {
          this.tablesPro = []
          this.sqlDateEchars = ''
        }
      }).catch((err) => {
        this.sqlDateEchars.beginTime = ''
        this.tablesPro = []
        this.$message.error(err.msg)
      });
    },
    // topsql table
    queryTopSQL (val, val2) {
      let par = {
        id: this.MonitorIp,
        orderName: val,
        beginTime: val2 || ''
      }
      queryTopSQL(par).then((result) => {
        this.sqlDate = result.data || []
      }).catch((err) => {
        this.sqlDate = []
        this.$message.error(err.msg)
      });
    },
    // top 等待事件
    queryTopWaitEvent () {
      queryTopWaitEvent({ id: this.MonitorIp }).then((result) => {
        if (result.datatime.length > 0) {
          this.waitDate.series[1].data = result.datatime || []
          this.waitDate.series[0].data = result.avg || []
          this.waitDate.categories = result.name || []
        } else {
          let formTime = new Date()
          let time = formatDate(formTime, 'hh:mm:ss')
          this.waitDate.series[1].data = [time]
          this.waitDate.series[0].data = [0]
        }
      }).catch((err) => {
        this.waitDate.categories = []
        this.$message.error(err.msg)
      });
    },
    // 表空间
    queryTableSpace () {
      queryTableSpace({ id: this.MonitorIp }).then((result) => {
        result.data.forEach(item => {
          item.USED_RATIO = Number(item.USED_RATIO)
        });
        this.tableData = result.data || []
        if (result.data[0].DB_NAME) {
          this.topSqlTable = this.topSqlTable1
        } else {
          this.topSqlTable = this.topSqlTable2
        }
      }).catch((err) => {
        this.tableData = []
        this.$$message.error(err.msg)
      });
    },
    // 格式化进度条
    forPercent (val) {
      if (val == 100) {
        return '100%';
      } else {
        return val + '%';
      }
    },
    // 查看实际效率 
    queryInstanceEfficiency () {
      queryInstanceEfficiency({ id: this.MonitorIp }).then((result) => {
        this.reportOption = result.data || []
        this.valueId = 0
      }).catch((err) => {
        this.reportOption = []
        this.valueId = ""
        this.$message.error(err.msg)
      });
    },
    // 数据库链接
    queryMonitorDb (val) {
      let par = {
        id: this.MonitorIp,
        beginTime: val || '',
      }
      queryMonitorDBLink(par).then((result) => {
        let formTime = new Date()
        let time = formatDate(formTime, 'hh:mm:ss')
        this.deDate.series[0].data = result.data.length == 0 ? [0] : result.data
        this.deDate.categories = result.time.length == 0 ? [time] : result.time
        this.deDate.beginTime = result.beginTime
        if (result.time.length == 0) {
          this.dbLinkTime++
          if (this.dbLinkTime >= 20) {
            this.queryMonitorDb()
          }
        } else {
          this.dbLinkTime = 0
        }
      }).catch((err) => {
        this.deDate.beginTime = ''
        this.$message.error(err.msg)
      });
    },
    // TOP sql 切换
    toTable (val) {
      // 保存 刷新界面重置
      mIdex.toables.forEach(item => {
        item.color = false;
      });
      this.sqlName = mIdex.toables[val].orderName
      mIdex.toables[val].color = true;
      this.queryTopSQL(this.sqlName)
    },
  },
  destroyed () {
    clearInterval(this.interval10)
    clearInterval(this.interval60)
    clearInterval(this.interval3600)
    clearInterval(this.interval30)
  }
};
</script>
<style lang="scss">
.m-indxcpt {
  height: 100%;
  width: 100%;
  background-color: #1c2226;
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
  .x-status1 {
    height: 113px;
    overflow: hidden;
  }
  .x-status2 {
    height: 270px;
    display: flex;
    margin-top: 10px;
    .s-chart1,
    .s-chart2 {
      width: 40%;
      padding: 0 10px 0 0;
      #container2 {
        height: 100%;
        width: 100%;
      }
    }
    .s-chart3 {
      flex: 1;
      align-items: center;
      min-width: 300px;
      background-color: #232a30;
      .t-per {
        display: flex;
        height: 50px;
        .r-per {
          width: 50%;
          color: #fbfbfb;
          font-size: 14px;
          align-items: center;
          display: flex;
          padding: 10px 20px;
        }
        .t-select {
          margin-left: auto;
          display: flex;
          align-items: center;
          margin-right: 10px;
          &.el-select-dropdown .el-popper {
            width: 180px;
            left: 0px;
          }
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
      }
      .r-circle {
        height: 220px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .ant-progress-circle .ant-progress-text {
          color: #fff;
        }
        .ant-progress-circle-trail {
          stroke: #1f262b;
        }
        .e-vns {
          position: absolute;
          font-size: 42px;
          color: #fff;
          margin-left: 10px;
          span {
            margin-left: -10px;
          }
        }
      }
    }
  }
  .x-status3 {
    margin-top: 10px;
    height: 287px;
    display: flex;
    .s-wait1 {
      padding: 0 10px 0 0;
      width: 50%;
    }
    .s-wait2 {
      width: 50%;
      background-color: #232a30;
      .t-name {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #fff;
        padding: 0 10px;
      }
      .t-table {
        height: 235px;
        overflow: auto;
      }
    }
  }
  .x-status4 {
    margin-top: 10px;
    height: 575px;
    background-color: #2a333d;
    .s-topsql {
      display: flex;
      width: 100%;
      height: 264px;
      .l-table {
        width: 325px;
        height: 100%;
        padding: 10px;
        overflow: auto;
        background: #1c2226;
        .e-table {
          height: 40px;
          line-height: 40px;
          color: #6f7a83;
          text-align: left;
          border-bottom: 1px solid #2a333d;
          .e-span {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            color: #fff;
          }
        }
        .e-table:hover {
          color: #fff;
          background-color: #2a333d;
        }
      }
      .l-echars {
        width: calc(100% - 325px);
        #container4 {
          width: 100%;
          height: 100%;
        }
      }
    }
    .s-table {
      height: 225px;
      overflow: auto;
    }
    .e-topsql {
      height: 50px;
      line-height: 40px;
      color: #fff;
      border-top: 10px solid #1c2226;
      padding: 0 8px;
      background-color: #2a333d;
    }
    .s-toTable {
      width: 100%;
      height: 40px;
      display: flex;
      padding: 0 10px;
      div {
        height: 39px;
        width: 20%;
        background-color: #2a333d;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #98a5af;
        cursor: pointer;
      }
    }
  }
}
</style>

