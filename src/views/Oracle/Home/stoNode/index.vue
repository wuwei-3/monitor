<template>
  <!-- 存储节点 -->
  <div class="m-store"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- row1 -->
    <div class="e-card">
      <div class="s-ico"
           @click="show"
           v-show="!header">
        <i class="iconfont iconzuoyouduiqi"></i>
      </div>
      <div class="d-sys"
           v-for="item in items"
           :key="item.id"
           :style="{'margin-right':item.right}">
        <!-- 头定位 -->
        <div class="s-pos"><span>{{item.title}}</span></div>
        <div class="s-top"></div>
        <div class="s-bot"
             v-if="item.id == 1">
          <span :style="{color:item.color,'font-size':item.size}">
            {{time}}
          </span>
        </div>

        <div class="s-bot"
             v-else-if="item.id == 3">
          <div id="container-speed"></div>
        </div>
        <div class="s-bot"
             v-else-if="item.id == 4">
          <div id="container-speed1"></div>
        </div>
        <div class="s-bot"
             v-else>
          <span :style="{color:item.color,'font-size':item.size}">
            {{item.name}}
          </span>
        </div>
      </div>
    </div>
    <!-- row2-->
    <div class="e-table">
      <div class="t50 l10">
        <!-- ehars 图表 -->
        <m-echarsio :deDate="ioDate"></m-echarsio>
      </div>
      <div class="t50 b50">
        <!-- table 表 -->
        <div class="t-name">
          <span>磁盘空间</span>
        </div>
        <div class="t-ble">
          <m-table :column="topSqlTable"
                   :tableData="tableData"></m-table>
        </div>
      </div>
    </div>
    <!-- row3 -->
    <div class="e-echart">
      <!-- 四个echats图表 -->
      <div class="t25 f10">
        <div id="echarsCpu"></div>
      </div>
      <div class="t25 f10">
        <div id="m-store"></div>
      </div>
      <div class="t25 f10">
        <div id="container5"></div>
      </div>
      <div class="t25">
        <div id="container3"></div>
      </div>
    </div>
    <div class="t-selectIP"
         v-show="header">
      <el-select v-model="MonitorIp"
                 placeholder="IP"
                 :popper-append-to-body="false"
                 @change="cuthostIp">
        <el-option v-for="item in cptIps"
                   :key="item.id"
                   :label="item.ip"
                   :value="item.id">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import HighchartsIO from "highcharts";
// 最主要是这里模块的引入 很坑
import Highcharts from "highcharts/highstock";
// 这个一定要引入 不然报错
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
HighchartsMore(Highcharts);
SolidGauge(Highcharts);
import { ipList, hostIpList } from "@/api/systemMes"
import mTable from "@/components/mTable";
import mEcharsio from "@/components/mEcharsDB";
import {
  queryRunningTimeOs,
  loadRealtime,
  loadRealtimeCpu,
  loadRealtimeMemory,
  loadRealtimeNET,
  loadRealtimeIO,
  queryDiskSpace
} from "@/api/oracleHome"
import { formatDate } from '@/utils/date'
export default {
  components: {
    mTable,
    mEcharsio
  },
  props: {},
  data () {
    return {
      loading: false,
      ioDate: {
        title: '系统负载',
        tooltip: '次',
        format: '{value}',
        categories: [],
        tickInterval: 2,
        beginTime: '',
        series: [{
          name: '负载',
          data: [],
          color: '#01d0fe',
        }
        ]
      },
      chartsSpeed: '',
      chartsSpeed1: '',
      chartsSpeed2: '',
      chartsSpeed3: '',
      MyHighcharts: Highcharts,
      speedOptions: {
        chart: {
          type: "solidgauge",
          backgroundColor: "#232a30"
        },
        title: null,
        pane: {
          center: ["50%", "85%"],
          size: "140%",
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: '#232a30',
            innerRadius: "60%",
            outerRadius: "100%",
            shape: "arc",
            borderColor: '#1c2226',
          }
        },
        tooltip: {
          enabled: false
        },
        yAxis: {
          stops: [
            [0.1, "#33ca7d"], // green
            [0.7, "#af6529"], // yellow
            [0.9, "red"] // red
          ],
          min: 0,
          max: 100,
          lineWidth: 0,
          minorTickInterval: null,
          tickPixelInterval: 400,
          tickWidth: 0,
          title: {
            y: -70
          },
          labels: {
            y: 16
          }
        },
        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          }
        },
        credits: {
          enabled: false
        },
        series: [
          {
            data: [0],
            dataLabels: {
              format:
                '<div style="text-align:center"><span style="font-size:15px;color:#fff' +
                '">{y:.1f}</span><span style="font-size:12px;color:#fff">%</span></div>'
            }
          }
        ]
      },
      chartsCUP: '',
      chartsSIZE: '',
      chartsIO: '',
      chartsNET: '',
      echarsOpthons: {
        chart: {
          backgroundColor: "#232a30",
          type: "spline"
        },
        title: {
          text: "",
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
        // 去除版权信息
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [],
          lineColor: "#1c2226",
          lineWidth: 1,
          tickInterval: 2
        },
        yAxis: {
          gridLineColor: "#1c2226",
          title: {
            text: ""
          },
          labels: {
            format: "{value}。"
          }
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
      items: [
        {
          id: 1,
          title: "系统运行时间",
          name: "0",
          unit: "week",
          size: '23px',
          right: '10px'
        },
        {
          id: 2,
          title: "系统负载",
          name: "0",
          color: '#ff6c0f',
          right: '10px'
        },
        {
          id: 3,
          title: "CPU使用率",
          name: "400",
          status: true,
          right: '10px'
        },
        {
          id: 4,
          title: "内存使用率",
          name: "400",
          unit: "week",
          status: true,
          right: '10px'
        },
        {
          id: 5,
          title: "网络流量",
          name: "0/Mb",
          status: true,
          size: '23px',
          right: '10px'
        },
        {
          id: 6,
          title: "I/O",
          name: "0/次",
          size: '23px',
          status: true,
        }
      ],
      time: 0,
      indexTime: 0,
      timeOut: '',
      timeOut30: '',
      cptIps: [],
      MonitorIp: '',
      tableData: [],
      topSqlTable: [
        { label: "文件系统", prop: "FILESYSTEM", width: 15 },
        { label: "总大小", prop: "TOTAL_SIZE", width: 15 },
        { label: "已使用大小", prop: "USED_SIZE", width: 15 },
        { label: "剩余大小", prop: "AVAIL_SIZE", width: 15 },
        { label: "已使用百分比", prop: "USED", width: 30 },
        { label: "挂载点", prop: "MOUNTED", width: 15 },
      ],
      cupTimes: '',
      MemoryTimes: '',
      IOTimes: '',
      NETTimes: '',
    };
  },
  watch: {
    header () {
      this.tableReload()
    },
  },
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
  mounted () {
    // 下面头信息
    this.$store.commit("setTitle", false);
    localStorage.setItem("setTitle", false);
    this.tableEchars();
    this.speedOracle()
    this.getHostIps()
  },
  methods: {
    cuthostIp () {
      this.getMethods()
    },
    getMethods () {
      clearInterval(this.timeOut);
      clearInterval(this.timeOut30);
      if (this.MonitorIp) {
        this.queryRunningTimeOs()
        this.loadRealtimeSys()
        this.loadRealtimeCpu()
        this.loadRealtimeCpuEchars()
        this.loadRealtimeMemory()
        this.loadRealtimeMemoryEchars()
        this.loadRealtimeNET()
        this.loadRealtimeNETEchars()
        this.loadRealtimeIO()
        this.loadRealtimeIOEchars()
        this.loadRealtimeSysEchars()
        this.queryDiskSpace()
        this.timeOut30 = setInterval(() => {
          this.loadRealtimeSys()
          this.loadRealtimeCpu()
          this.loadRealtimeMemory()
          this.loadRealtimeMemoryEchars(this.MemoryTimes)
          this.loadRealtimeNET()
          this.loadRealtimeNETEchars(this.NETTimes)
          this.loadRealtimeIO()
          this.loadRealtimeIOEchars(this.IOTimes)
          this.loadRealtimeSysEchars(this.ioDate.beginTime)
          this.queryDiskSpace()
          this.loadRealtimeCpuEchars(this.cupTimes)
        }, 30000)
      }
      this.timeOut = setInterval(() => {
        this.getData(this.indexTime);
      }, 1000)
    },
    getHostIps () {
      this.loading = true
      let par = {
        pageSize: 50,
        pageNum: 1,
      }
      hostIpList(par)
        .then(result => {
          this.loading = false
          if (result.data.length > 0) {
            this.cptIps = result.data || [];
            this.MonitorIp = result.data[0].id
            this.getMethods()
          } else {
            this.cptIps = []
            this.MonitorIp = ''
          }
        }).catch(err => {
          this.loading = false
          clearInterval(this.timeOut);
          clearInterval(this.timeOut30);
          this.cptIps = []
          this.MonitorIp = ''
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
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
      //  展示字段
      this.time = d + "天" + h + "时" + min + "分" + m + "秒";
    },
    // 磁盘空间
    queryDiskSpace () {
      queryDiskSpace({ id: this.MonitorIp }).then((result) => {
        result.data.forEach(item => {
          item.USED = Number(item.USED)
        });
        this.tableData = result.data || []
      }).catch((err) => {
        this.tableData = []
        this.$message.error(err.msg)
      });
    },
    // io
    loadRealtimeIO () {
      loadRealtimeIO({ id: this.MonitorIp }).then((result) => {
        this.items[5].name = '读/写：' + result.data + '次' || '0次'
      }).catch((err) => {
        this.items[5].name = '读/写：' + '0次'
        this.$message.error(err.msg)
      });
    },
    // 時間
    queryRunningTimeOs () {
      queryRunningTimeOs({ id: this.MonitorIp }).then((result) => {
        let data = JSON.parse(result.data)
        this.indexTime = Number(data[0].UPTIME)
      }).catch((err) => {
        this.indexTimee = 0
        this.$message.error(err.msg)
      });
    },
    // 宽带
    loadRealtimeNET () {
      loadRealtimeNET({ id: this.MonitorIp }).then((result) => {
        this.items[4].name = "发/收：" + result.data + 'Mb' || '0/Mb'
      }).catch((err) => {
        this.items[4].name = "发/收：" + '0/Mb'
        this.$message.error(err.msg)
      });
    },
    // 内存
    loadRealtimeMemory () {
      loadRealtimeMemory({ id: this.MonitorIp }).then((result) => {
        let data = result.data || 0
        this.chartsSpeed1.series[0].setData([data])
      }).catch((err) => {
        this.chartsSpeed1.series[0].setData([0])
        this.$message.error(err.msg)
      });
    },
    // CUP
    loadRealtimeCpu () {
      loadRealtimeCpu({ id: this.MonitorIp }).then((result) => {
        let data = result.data || 0
        this.chartsSpeed.series[0].setData([data])
      }).catch((err) => {
        this.chartsSpeed.series[0].setData([0])
        this.$message.error(err.msg)
      });
    },
    // CUP
    loadRealtimeCpuEchars (val) {
      let that = this
      loadRealtimeCpu({ id: this.MonitorIp, diagram: 'diagram', beginTime: val }).then((result) => {
        that.chartsCUP.hideLoading()
        // 时间每次更新
        that.cupTimes = result.beginTime
        if (result.time.length == 1) {
          // 添加点
          that.chartsCUP.xAxis[0].categories.push(result.time[0])
          if (that.chartsCUP.xAxis[0].categories.length >= 10) {
            that.chartsCUP.series[0].addPoint(result.idle[0], false, true)
            that.chartsCUP.series[1].addPoint(result.sys[0], false, true)
            that.chartsCUP.series[2].addPoint(result.usr[0], false, true)
            that.chartsCUP.series[3].addPoint(result.wat[0], true, true)
          } else {
            that.chartsCUP.series[0].addPoint(result.idle[0])
            that.chartsCUP.series[1].addPoint(result.sys[0])
            that.chartsCUP.series[2].addPoint(result.usr[0])
            that.chartsCUP.series[3].addPoint(result.wat[0])
          }
          // x 轴重新赋值
        } else if (result.time.length == 0) {
          // 手动添加数据
          let formTime = new Date()
          let time = formatDate(formTime, 'hh:mm:ss')
          that.chartsCUP.xAxis[0].categories.push(time)
          that.chartsCUP.series[0].addPoint(0, false, true)
          that.chartsCUP.series[1].addPoint(0, false, true)
          that.chartsCUP.series[2].addPoint(0, false, true)
          that.chartsCUP.series[3].addPoint(0, true, true)
        } else {
          // 添加线 保证每次清除
          let deId = that.chartsCUP.series
          for (let index = 0; index < deId.length; index++) {
            that.chartsCUP.series[0].remove()
            index--
          }
          let series = [
            {
              name: 'idle',
              color: '#27d3ae',
              data: result.idle
            },
            {
              name: 'sys',
              color: '#01d0fe',
              data: result.sys
            },
            {
              name: 'usr',
              color: '#e7f45c',
              data: result.usr
            },
            {
              name: 'wat',
              color: '#f45cc7',
              data: result.wat
            },
          ]
          that.chartsCUP.xAxis[0].categories = result.time
          let charts = that.chartsCUP
          charts.addSeries(series[0])
          charts.addSeries(series[1])
          charts.addSeries(series[2])
          charts.addSeries(series[3])
        }
      }).catch((err) => {
        // 添加线 保证每次清除
        let deId = that.chartsCUP.series
        if (deId) {
          for (let index = 0; index < deId.length; index++) {
            that.chartsCUP.series[0].remove()
            index--
          }
        }
        that.chartsCUP.showLoading('加载中......');
        that.$message.error(err.msg)
      });
    },
    // 系统负载
    loadRealtimeSys () {
      let par = {
        id: this.MonitorIp,
      }
      loadRealtime(par).then((result) => {
        this.items[1].name = result.data || 0
      }).catch((err) => {
        this.items[1].name = 0
        this.$message.error(err.msg)
      });
    },
    // 系统负载
    loadRealtimeSysEchars (val) {
      loadRealtime({ id: this.MonitorIp, diagram: 'diagram', beginTime: val }).then((result) => {
        let formTime = new Date()
        let time = formatDate(formTime, 'hh:mm:ss')
        this.ioDate.beginTime = result.beginTime
        this.ioDate.categories = result.time.length == 0 ? [time] : result.time
        this.ioDate.series[0].data = result.data.length == 0 ? [0] : result.data
      }).catch((err) => {
        this.ioDate.beginTime = ''
        this.$message.error(err.msg)
      });
    },
    // 主机内存
    loadRealtimeMemoryEchars (val) {
      let that = this
      loadRealtimeMemory({ id: this.MonitorIp, diagram: 'diagram', beginTime: val }).then((result) => {
        that.chartsSIZE.hideLoading()
        that.MemoryTimes = result.beginTime
        if (result.time.length == 1) {
          // 添加点
          that.chartsSIZE.xAxis[0].categories.push(result.time[0])
          if (that.chartsNET.xAxis[0].categories.length >= 10) {
            that.chartsSIZE.series[0].addPoint(result.free[0], false, true)
            that.chartsSIZE.series[1].addPoint(result.swap[0], true, true)
          } else {
            that.chartsSIZE.series[0].addPoint(result.free[0])
            that.chartsSIZE.series[1].addPoint(result.swap[0])
          }

        } else if (result.time.length == 0) {
          // 手动添加数据
          let formTime = new Date()
          let time = formatDate(formTime, 'hh:mm:ss')
          that.chartsSIZE.xAxis[0].categories.push(time)
          that.chartsSIZE.series[0].addPoint(0, false, true)
          that.chartsSIZE.series[1].addPoint(0, true, true)
        } else {
          // 添加线
          let deId = that.chartsSIZE.series
          for (let index = 0; index < deId.length; index++) {
            that.chartsSIZE.series[0].remove()
            index--
          }
          let series = [
            {
              name: 'free',
              color: '#27d3ae',
              data: result.free
            },
            {
              name: 'swap',
              color: '#01d0fe',
              data: result.swap
            },
          ]
          that.chartsSIZE.xAxis[0].categories = result.time
          let charts = that.chartsSIZE
          charts.addSeries(series[0])
          charts.addSeries(series[1])
        }
      }).catch((err) => {
        let deId = that.chartsSIZE.series
        if (deId) {
          for (let index = 0; index < deId.length; index++) {
            that.chartsSIZE.series[0].remove()
            index--
          }
        }
        that.MemoryTimes = ''
        that.chartsSIZE.showLoading('加载中......');
        that.$message.error(err.msg)
      });
    },
    // 网络流量
    loadRealtimeNETEchars (val) {
      let that = this
      loadRealtimeNET({ id: this.MonitorIp, diagram: 'diagram', beginTime: val }).then((result) => {
        that.chartsNET.hideLoading()
        that.NETTimes = result.beginTime
        if (result.time.length == 1) {
          that.chartsNET.xAxis[0].categories.push(result.time[0])
          if (that.chartsNET.xAxis[0].categories.length >= 10) {
            that.chartsNET.series[0].addPoint(result.receive[0], false, true)
            that.chartsNET.series[1].addPoint(result.send[0], true, true)
          } else {
            that.chartsNET.series[0].addPoint(result.receive[0])
            that.chartsNET.series[1].addPoint(result.send[0])
          }
        } else if (result.time.length == 0) {
          // 手动添加数据
          let formTime = new Date()
          let time = formatDate(formTime, 'hh:mm:ss')
          that.chartsNET.xAxis[0].categories.push(time)
          that.chartsNET.series[0].addPoint(0, false, true)
          that.chartsNET.series[1].addPoint(0, true, true)
        } else {
          let deId = that.chartsNET.series
          for (let index = 0; index < deId.length; index++) {
            that.chartsNET.series[0].remove()
            index--
          }
          let series = [
            {
              name: '接收',
              color: '#27d3ae',
              data: result.receive
            },
            {
              name: '发送',
              color: '#01d0fe',
              data: result.send
            },
          ]
          that.chartsNET.xAxis[0].categories = result.time
          let charts = that.chartsNET
          charts.addSeries(series[0])
          charts.addSeries(series[1])
        }
      }).catch((err) => {
        that.NETTimes = ''
        let deId = that.chartsNET.series
        if (deId) {
          for (let index = 0; index < deId.length; index++) {
            that.chartsNET.series[0].remove()
            index--
          }
        }
        that.chartsNET.showLoading('加载中......');
        that.$message.error(err.msg)
      });
    },
    // 主机内存
    loadRealtimeIOEchars (val) {
      let that = this
      loadRealtimeIO({ id: this.MonitorIp, diagram: 'diagram', beginTime: val }).then((result) => {
        that.chartsIO.hideLoading()
        that.IOTimes = result.beginTime
        if (result.time.length == 1) {
          that.chartsIO.xAxis[0].categories.push(result.time[0])
          if (that.chartsIO.xAxis[0].categories.length >= 10) {
            that.chartsIO.series[0].addPoint(result.read[0], false, true)
            that.chartsIO.series[1].addPoint(result.write[0], true, true)
          } else {
            that.chartsIO.series[0].addPoint(result.read[0])
            that.chartsIO.series[1].addPoint(result.write[0])
          }

        } else if (result.time.length == 0) {
          // 手动添加数据
          let formTime = new Date()
          let time = formatDate(formTime, 'hh:mm:ss')
          that.chartsIO.xAxis[0].categories.push(time)
          that.chartsIO.series[0].addPoint(0, false, true)
          that.chartsIO.series[1].addPoint(0, true, true)
        } else {
          let deId = that.chartsIO.series
          for (let index = 0; index < deId.length; index++) {
            that.chartsIO.series[0].remove()
            index--
          }
          let series = [
            {
              name: '读',
              color: '#27d3ae',
              data: result.read
            },
            {
              name: '写',
              color: '#01d0fe',
              data: result.write
            },
          ]
          that.chartsIO.xAxis[0].categories = result.time
          let charts = that.chartsIO
          charts.addSeries(series[0])
          charts.addSeries(series[1])
        }
      }).catch((err) => {
        that.IOTimes = ''
        let deId = that.chartsIO.series
        if (deId) {
          for (let index = 0; index < deId.length; index++) {
            that.chartsIO.series[0].remove()
            index--
          }
        }
        that.chartsIO.showLoading('加载中......');
        that.$message.error(err.msg)
      });
    },
    // 展示头信息
    show () {
      this.$store.commit("setHeader", true);
      localStorage.setItem("setHeader", true);
    },
    tableReload () {
      this.chartsCUP.reflow()
      this.chartsSIZE.reflow()
      this.chartsIO.reflow()
      this.chartsNET.reflow()
      this.chartsSpeed.reflow()
      this.chartsSpeed1.reflow()
    },
    // echars 不能同时多个组件同一个页面使用
    tableEchars () {
      let CUP = this.$_.cloneDeep(this.echarsOpthons)
      CUP.title.text = '主机CPU'
      CUP.yAxis.labels.format = "{value}%"
      let SIZE = this.$_.cloneDeep(this.echarsOpthons)
      SIZE.title.text = '主机内存'
      SIZE.yAxis.labels.format = "{value}GB"
      let IO = this.$_.cloneDeep(this.echarsOpthons)
      IO.title.text = '主机IO'
      IO.yAxis.labels.format = "{value}次"
      let NET = this.$_.cloneDeep(this.echarsOpthons)
      NET.title.text = '主机网络流量'
      NET.yAxis.labels.format = "{value}MB"
      this.chartsCUP = this.MyHighcharts.chart('echarsCpu', CUP);
      this.chartsSIZE = this.MyHighcharts.chart('m-store', SIZE);
      this.chartsIO = this.MyHighcharts.chart('container5', IO);
      this.chartsNET = this.MyHighcharts.chart('container3', NET);
      this.chartsCUP.showLoading('加载中......');
      this.chartsSIZE.showLoading('加载中......');
      this.chartsIO.showLoading('加载中......');
      this.chartsNET.showLoading('加载中......');
    },
    speedOracle () {
      // 获取不同值
      this.chartsSpeed = this.MyHighcharts.chart('container-speed', this.speedOptions);
      this.chartsSpeed1 = this.MyHighcharts.chart('container-speed1', this.speedOptions);
      // 回填数据
      this.chartsSpeed.series[0].setData([0])
      this.chartsSpeed1.series[0].setData([0])
    }
  },
  destroyed () {
    clearInterval(this.timeOut);
    clearInterval(this.timeOut30);
    this.chartsSpeed1.destroy()
    this.chartsCUP.destroy();
    this.chartsSIZE.destroy();
    this.chartsIO.destroy();
    this.chartsNET.destroy();
    this.chartsSpeed.destroy()
  }
};
</script>
<style lang="scss" >
.m-store {
  width: 100%;
  height: 100%;
  background: #1c2226;
  overflow: auto;
  color: #ddf2ff;
  font-size: 12px;
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
  .e-card {
    height: calc(100% - 670px);
    margin-bottom: 10px;
    min-height: 178px;
    display: flex;
    position: relative;
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
      cursor: pointer;
      .iconzuoyouduiqi {
        font-size: 23px;
        color: #fff;
      }
    }
    .d-sys {
      width: 17%;
      height: 100%;
      background-color: #232a30;
      border-radius: 3px;
      position: relative;
      .s-pos {
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
      .s-top {
        height: 40px;
        text-align: center;
        opacity: 0.05;
        width: 100%;
        background-color: #000000;
        position: absolute;
        top: 0px;
        span {
          color: #ddf2ff;
        }
      }
      .s-bot {
        height: calc(100% - 50px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        #container-speed,
        #container-speed1,
        #container-speed2,
        #container-speed3 {
          height: 100%;
          width: 100%;
        }
        span {
          color: #fffc00;
          font-size: 36px;
        }
        i {
          padding: 17px 0 0px 10px;
        }
      }
    }
  }
  .e-table {
    height: 360px;
    margin-bottom: 10px;
    display: flex;
    .l10 {
      padding-right: 10px;
    }
    .t50 {
      width: 50%;
      height: 100%;
      .t-name {
        height: 50px;
        line-height: 50px;
        padding: 0 10px;
      }
      &.b50 {
        background-color: #232a30;
        overflow: auto;
        padding: 10px;
      }
      .t-ble {
        overflow: auto;
      }
    }
  }
  .e-echart {
    height: 290px;
    display: flex;
    .t25 {
      width: 25%;
      #echarsCpu,
      #m-store,
      #container5,
      #container3 {
        width: 100%;
        height: 100%;
      }
      &.f10 {
        padding-right: 10px;
      }
    }
  }
}
</style>