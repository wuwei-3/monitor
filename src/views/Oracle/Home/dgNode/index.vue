<template>
  <!-- DG 节点 -->
  <div class="dg-node-o"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <!--  下拉框 240px-->
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
          <m-status v-if="group.instType == '主库'"
                    :group="group"></m-status>
          <m-status2 v-else
                     :group="group"></m-status2>
        </div>
      </div>
    </div>
    <div class="e-fontI1"
         @click="downOrUp"
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
    <!-- DG 延迟时间 传输量  -->
    <div class="e-row2">
      <div class="w-echars1">
        <m-echartsdb :deDate="stDate"></m-echartsdb>
      </div>
      <div class="w-echars2">
        <div class="s-top">
          <div class="p-cs">传输量</div>
          <div class="p-ip">
            <div class="p-host r10"
                 v-for="(item,index) in ipsSize"
                 :key="index">
              <div class="icon"
                   :style="{background:index == 0? '#36ce8a':''}"></div>
              <div>{{item}}</div>
            </div>
          </div>
        </div>
        <div class="s-bot">
          <div class="t-left">
            <div>主库</div>
            <div class="ip">{{missionSpeed.master.hostIP}}</div>
            <div>{{missionSpeed.master.osName}}</div>
          </div>
          <div class="t-echars">
            <div class="t-right">
              <div id="dgNodeIP"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 活动连接数 归档大小 日志切换 -->
    <div class="e-row3">
      <div class="f10"
           id="conChart">
      </div>
      <div id="sizeChart"
           class="f10"></div>
      <div id="frenChart"></div>
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
import mEchartsdb from "@/components/mEcharsDB"
import Highcharts from "highcharts";
import mStatus from "@/components/mStatus1";
import mStatus2 from "@/components/mStatus2";
import {
  queryDBGroup,
  queryDGLetencyTime,
  queryQuickRecoveryZoneUse,
  queryArchiveSize,
  queryLogSwitchFreq,
  queryTransmissionSpeed
} from "@/api/oracleHome"
import { ipList } from "@/api/systemMes"
import { formatDate } from '@/utils/date'
// 最主要是这里模块的引入 很坑
export default {
  components: {
    mEchartsdb,
    mStatus,
    mStatus2,
  },
  props: {},
  data () {
    return {
      ipsSize: '',
      missionSpeedTime: '',
      zoneUseCharts: '',
      missionSpeed: {
        master: {
          master: '',
          osName: '',
        }
      },
      MyHighcharts: Highcharts,
      treeOptions: {
        chart: {
          backgroundColor: "#232a30",
          type: "area"
        },
        title: {
          text: "表空间I/O",
          align: "left",
          style: {
            fontWeight: "normal",
            color: "#fff",
            fontSize: "14px"
          }
        },
        exporting: {
          allowHTML: true
        },
        loading: {
          labelStyle: {
            color: 'white',
            fontStyle: 'italic'
          },
          style: {
            backgroundColor: ''
          }
        },
        // 去除版权信息
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [],
          lineColor: "#1c2226",
          lineWidth: 1
        },
        yAxis: {
          gridLineColor: "#1c2226",
          title: {
            text: ""
          },
          labels: { format: '{value}次' }
        },
        legend: {
          itemStyle: { color: "#7c838b" },
          align: "right",
          verticalAlign: "top",
          x: 0,
          y: -40
        },
        tooltip: {
          crosshairs: true,
          shared: true
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: "#666666",
              lineWidth: 1
            }
          }
        },
        series: []
      },
      loading: false,
      groupList: [],
      cptIps: [],
      MonitorIp: '',
      downOrUpS: true,
      stDate: {
        title: 'DG延迟时间',
        type: 'area',
        format: '{value}秒',
        categories: [],
        beginTime: '',
        tickInterval: 2,
        series: [
          {
            name: '延迟时间',
            data: [],
            color: '#01defe',
            marker: {
              radius: 1,
              lineWidth: 1,
            }
          },

        ]
      },
      connectChart: '',
      sizeChart: '',
      frenChart: '',
      dgNodeChart: '',
      // 传输量
      dgNodeIp: {
        chart: {
          backgroundColor: "#232a30",
          zoomType: "xy"
        },
        title: {
          text: ''
        },
        loading: {
          labelStyle: {
            color: 'white',
            fontStyle: 'italic'
          },
          style: {
            backgroundColor: ''
          }
        },
        tooltip: {
          formatter: function () {
            return this.x + '<br/>' + this.point.y > 1024 ? this.point.y + 'mb/秒' : this.point.y + 'kb/秒'
          }
        },
        yAxis: {
          // Primary yAxis
          gridLineColor: "#1c2226",
          title: {
            text: ''
          },
          labels: {
            enabled: true,
            format: '{value}'
          }
        },
        xAxis: [{
          categories: [],
          crosshair: true,
          lineColor: "#1c2226",
          lineWidth: 1
        }],
        legend: {
          enabled: false,
        },
        // 去除版权信息
        credits: {
          enabled: false
        },
        series: [{
          name: '',
          color: '#36ce8a',
          data: []
        }, {
          name: '',
          color: '#7aaff5',
          data: []
        }],
      },
      sizeTime: '',
      frenTime: '',
      timeOut10: '',
      timeOut30: '',
    };
  },
  watch: {
    header () {
      this.reloadChart()
    },
    // 主备库查询
    groupList (val1, val2) {
      let _self = this
      _self.$_.forEach(val1, function (value, key) {
        if (value.instType == '主库') {
          _self.getCharts(value.oracleConfigId)
          return
        }
      });
    }
  },
  computed: {
    header: function () {
      return this.$store.getters.getHeader;
    },
  },
  mounted () {
    // 下面头信息
    this.$store.commit("setTitle", false);
    localStorage.setItem("setTitle", false);
    this.queryDBGroup()
    this.tableEchars()
    this.tranfreSize()
  },
  destroyed () {
    clearInterval(this.timeOut10);
    clearInterval(this.timeOut30);
    this.zoneUseCharts.destroy();
    this.dgNodeChart.destroy();
  },
  methods: {
    getCharts (val) {
      this.queryQuickRecoveryZoneUse(val)
      this.queryArchiveSize(val)
      this.queryLogSwitchFreq(val)
      this.queryTransmissionSpeed(val, this.missionSpeedTime)
      this.queryDGLetencyTime()
      this.timeOut10 = setInterval(() => {
        this.queryTransmissionSpeed(val, this.missionSpeedTime)
      }, 10000)
      this.timeOut30 = setInterval(() => {
        this.queryDGLetencyTime(this.stDate.beginTime)
      }, 30000)
    },
    getMethods () {
      this.getZoneUse()
    },
    getZoneUse (val) {
      this.zoneUseCharts = this.MyHighcharts.chart('conChart',
        {
          chart: {
            backgroundColor: "#232a30",
            type: 'pie'
          },
          title: {
            text: '快速恢复区使用情况(首页)',
            align: "left",
            style: {
              fontWeight: "normal",
              color: "#fff",
              fontSize: "14px"
            }
          },
          // 去除版权信息
          credits: {
            enabled: false
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          legend: {
            itemStyle: { color: "#7c838b" },
          },
          loading: {
            labelStyle: {
              color: 'white',
              fontStyle: 'italic'
            },
            style: {
              backgroundColor: ''
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
          series: [{
            name: 'Brands',
            colorByPoint: true,
            data: val
          }]
        });
    },
    // 传输量
    queryTransmissionSpeed (val, val2) {
      let that = this
      queryTransmissionSpeed({ groupId: this.MonitorIp, diagram: 'diagram', beginTime: val2 }).then((result) => {
        that.dgNodeChart.hideLoading()
        that.missionSpeed = result || []
        this.ipsSize = []
        let point = []
        result.slave.forEach((ele, index) => {
          this.ipsSize.push(ele.ip)
          point.push(ele.data)
        });
        if (that.missionSpeedTime) {
          // x 轴重新复制
          that.dgNodeChart.xAxis[0].categories.push(result.time)
          if (that.dgNodeChart.xAxis[0].categories.length >= 10) {
            point.forEach((item, index) => {
              that.dgNodeChart.series[index].addPoint(item, true, true);
            });
          } else {
            point.forEach((item, index) => {
              that.dgNodeChart.series[index].addPoint(item);
            });
          }
        } else {
          that.dgNodeChart.xAxis[0].categories = [result.time]
          point.forEach((item, index) => {
            that.dgNodeChart.series[index].addPoint(item);
          });
        }
        that.missionSpeedTime = result.beginTime
      }).catch((err) => {
        that.dgNodeChart.showLoading('加载中......')
        that.missionSpeed = []
        that.$message.error(err.msg)
      });
    },
    // 快速分区使用情况
    queryQuickRecoveryZoneUse (val) {
      let that = this
      queryQuickRecoveryZoneUse({ id: val }).then((result) => {
        let data = []
        that.$_.forEach(result.file, function (value, key) {
          let par = {
            sliced: value == '未使用' ? true : false,
            selected: value == '未使用' ? true : false,
            name: value,
            y: result.percent[key]
          }
          data.push(par)
        });
        that.getZoneUse(data)
      }).catch((err) => {
        that.getZoneUse([])
        that.$message.error(err.msg)
      });
    },
    // 查看归档大小
    queryArchiveSize (val, val2) {
      let that = this
      queryArchiveSize({ id: val, diagram: 'diagram', }).then((result) => {
        that.sizeChart.hideLoading()
        if (result.time.length == 1) {
          that.sizeChart.xAxis[0].categories.push(result.time[0])
          that.sizeChart.series[0].addPoint(result.size[0], true, true)
        } else if (result.time.length == 0) {
          let formTime = new Date()
          let time = formatDate(formTime, 'hh:mm:ss')
          that.sizeChart.xAxis[0].categories.push(time)
          that.sizeChart.series[0].addPoint(0, true, true)
        } else {
          let deId = that.sizeChart.series
          for (let index = 0; index < deId.length; index++) {
            that.sizeChart.series[0].remove()
            index--
          }
          let series = [
            {
              name: '大小',
              color: '#27d3ae',
              data: result.size
            },
          ]
          let charts = that.sizeChart
          that.sizeChart.xAxis[0].categories = result.time
          charts.addSeries(series[0])
          that.sizeTime = result.beginTime
        }
      }).catch((err) => {
        let deId = that.sizeChart.series
        if (deId) {
          for (let index = 0; index < deId.length; index++) {
            that.sizeChart.series[0].remove()
            index--
          }
        }
        that.sizeChart.showLoading('加载中......');
        that.$message.error(err.msg)
      });
    },
    // 日志切换频率
    queryLogSwitchFreq (val) {
      let that = this
      queryLogSwitchFreq({ id: val, diagram: 'diagram', beginTime: val }).then((result) => {
        that.frenChart.hideLoading()
        if (result.times.length == 1) {
          that.frenChart.xAxis[0].categories.push(result.times[0])
          that.frenChart.series[0].addPoint(result.size[0], true, true)
        } else if (result.times.length == 0) {
          let formTime = new Date()
          let time = formatDate(formTime, 'hh:mm:ss')
          that.frenChart.xAxis[0].categories.push(time)
          that.frenChart.series[0].addPoint(0, true, true)
        } else {
          let deId = that.frenChart.series
          for (let index = 0; index < deId.length; index++) {
            that.frenChart.series[0].remove()
            index--
          }
          let series = [
            {
              name: '次数',
              color: '#a3f45c',
              data: result.times
            },
          ]
          let charts = that.frenChart
          that.frenChart.xAxis[0].categories = result.date
          charts.addSeries(series[0])
          that.frenTime = result.beginTime || ''
        }
      }).catch((err) => {
        let deId = that.frenChart.series
        if (deId) {
          for (let index = 0; index < deId.length; index++) {
            that.frenChart.series[0].remove()
            index--
          }
        }
        that.frenTime = ''
        that.frenChart.showLoading('加载中......');
        that.$message.error(err.msg)
      });
    },
    // 切换ip
    cuthostIp () {
      // 刷新头 尾
      this.getIPList(this.MonitorIp)
      this.getMethods()
    },
    reloadChart () {
      this.connectChart.reflow()
      this.sizeChart.reflow()
      this.frenChart.reflow()
      this.dgNodeChart.reflow()
    },
    // dg 延迟时间
    queryDGLetencyTime (val) {
      queryDGLetencyTime({ groupId: this.MonitorIp, beginTime: val }).then((result) => {
        let formTime = new Date()
        let time = formatDate(formTime, 'hh:mm:ss')
        this.stDate.series[0].data = result.data.length == 0 ? [0] : result.data
        this.stDate.categories = result.time.length == 0 ? [time] : result.time
        this.stDate.beginTime = result.beginTime
      }).catch((err) => {
        this.stDate.beginTime = ""
        this.$message.error(err.msg)
      });
    },

    // 获取主机列表
    getIPList (val) {
      let par = {
        dbType: 'DG',
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
        dbType: 'DG',
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
    // 下拉 
    downOrUp () {
      this.downOrUpS = !this.downOrUpS
    },
    // 展示头信息
    show () {
      this.$store.commit("setHeader", true);
      localStorage.setItem("setHeader", true);
    },
    // 地下table
    tableEchars (val) {
      // 
      let SIZE = this.$_.cloneDeep(this.treeOptions)
      SIZE.title.text = '归档大小'
      SIZE.yAxis.labels.format = "{value}GB"
      this.sizeChart = this.MyHighcharts.chart("sizeChart", SIZE);
      this.sizeChart.showLoading('加载中......');
      let FRE = this.$_.cloneDeep(this.treeOptions)
      FRE.title.text = '日志切换频率'
      SIZE.yAxis.labels.format = "{value}次"
      this.frenChart = this.MyHighcharts.chart("frenChart", FRE);
      this.frenChart.showLoading('加载中......');
    },
    // 传输量
    tranfreSize () {
      this.dgNodeChart = this.MyHighcharts.chart('dgNodeIP', this.dgNodeIp);
      this.dgNodeChart.showLoading('加载中......');
    },
  },
};
</script>
<style lang="scss" >
.dg-node-o {
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
        background-color: #e16a46;
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
            width: 100%;
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
  .e-fontI1 {
    cursor: pointer;
    position: absolute;
    margin-left: 25px;
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
    height: calc(100% - 578px);
    margin-top: 10px;
    display: flex;
    min-height: 270px;
    .w-echars1 {
      width: 50%;
      height: 100%;
      margin-right: 10px;
    }
    .w-echars2 {
      width: calc(50% - 10px);
      height: 100%;
      padding: 10px;
      background: #232a30;
      color: #55616c;
      #dgNodeIP {
        width: 100%;
        height: 100%;
      }
      .s-top {
        display: flex;
        height: 50px;
        line-height: 50px;
        position: relative;
        .p-cs {
          color: #fbfbfb;
          font-size: 14px;
        }
        .p-ip {
          display: flex;
          position: absolute;
          right: 0;
          .p-host {
            display: flex;
            align-items: center;
            justify-content: center;
            .icon {
              width: 20px;
              height: 5px;
              background: #77aaef;
              margin-right: 3px;
            }
            &.r10 {
              margin-right: 10px;
            }
          }
        }
      }
      .s-bot {
        height: calc(100% - 50px);
        display: flex;
        .t-left {
          width: 140px;
          padding: 10px;
          .ip {
            height: 38px;
            line-height: 38px;
            color: #1498d6;
          }
        }
        .t-echars {
          width: calc(100% - 140px);
          .t-right {
            width: 100%;
            height: 100%;
          }
          .s-spi {
            height: 40px;
            line-height: 40px;
            text-align: left;
            i {
              color: #ffffff;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
  .e-row3 {
    margin-top: 10px;
    height: 307px;
    display: flex;
    div {
      width: 33%;
      height: 100%;
      background: #232a30;
    }
    .f10 {
      margin-right: 10px;
    }
    #conChart,
    #frenChart,
    #sizeChart {
      width: 100%;
      height: 100%;
    }
  }
}
</style>