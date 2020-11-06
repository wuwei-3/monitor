<template>
  <!-- 存储节点 -->
  <div class="m-system-sql">
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
        <!-- 底部居中显示 -->
        <div class="s-bot"
             v-if="!item.status">
          <span :style="{color:item.color,'font-size':item.size}">
            {{item.name || time}}
          </span>
          <i>
            {{item.unit}}
          </i>
        </div>
        <div class="s-bot"
             v-else-if="item.id == 3">
          <div id="mysql-cpu"></div>
        </div>
        <div class="s-bot"
             v-else-if="item.id == 4">
          <div id="mysql-size"></div>
        </div>
      </div>
    </div>
    <!-- row2-->
    <div class="e-table">
      <div class="t50 l10">
        <!-- ehars 图表 -->
        <m-echarsdb :deDate="deDate"></m-echarsdb>
      </div>
      <div class="t50 b50">
        <!-- table 表 -->
        <div class="t-name">
          <span>磁盘空间</span>
        </div>
        <div class="t-ble">
          <m-table></m-table>
        </div>
      </div>
    </div>
    <!-- row3 -->
    <div class="e-echart">
      <!-- 四个echats图表 -->
      <div class="t25 f10">
        <div id="m-cpu-m"></div>
      </div>
      <div class="t25 f10">
        <div id="m-store-m"></div>
      </div>
      <div class="t25 f10">
        <div id="m-io"></div>
      </div>
      <div class="t25">
        <div id="m-net"></div>
      </div>
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
import mTable from "@/components/mTable";
import mEcharsdb from "@/components/mEcharsDB";
import {
  loadRealtimeCpu,
  queryRunningTimeOs,
  loadRealtime,
  loadRealtimeNET,
} from "@/api/oracleHome"
export default {
  components: {
    mTable,
    mEcharsdb,
  },
  props: {},
  data () {
    return {
      items: [
        {
          id: 1,
          title: "系统运行时间",
          size: '23px',
          right: '10px'
        },
        {
          id: 2,
          title: "系统负载",
          name: "2.15",
          color: '#ff6c0f',
          right: '10px'
        },
        {
          id: 3,
          title: "cup使用率",
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
          name: "400",
          size: '25px',
          right: '10px'
        },
        {
          id: 6,
          title: "I/O",
          name: "400",
          size: '25px',
        }
      ],
      timeOut: '',//定时
      indexTime: 0,// 请求返回值
      time: '', // 显示时间值
      MyHighcharts: Highcharts,
      speedCPU: '',// cpu 使用率
      speedSize: '',
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
      chartsCUP: '',
      chartsSIZE: '',
      chartsIO: '',
      chartsNET: '',
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
    };
  },
  watch: {
    header () {
      this.tableReload()
    }
  },
  computed: {
    header: function () {
      return this.$store.getters.getHeader;
    }
  },
  mounted () {
    // 下面头信息
    this.$store.commit("setTitle", false);
    localStorage.setItem("setTitle", false);
    // echars 默认优先加载
    this.speedMysql()
    this.tableEchars()
    // 方法请求
    this.getMethods()
  },
  methods: {
    getMethods () {
      // 时间定时查询
      this.timeOut = setInterval(() => {
        this.getData(this.indexTime);
      }, 1000);
    },
    tableReload () {
      this.chartsCUP.reflow()
      this.chartsSIZE.reflow()
      this.chartsIO.reflow()
      this.chartsNET.reflow()
      this.speedCPU.reflow()
      this.speedSize.reflow()
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
      this.chartsCUP = this.MyHighcharts.chart('m-cpu-m', CUP);
      this.chartsSIZE = this.MyHighcharts.chart('m-store-m', SIZE);
      this.chartsIO = this.MyHighcharts.chart('m-io', IO);
      this.chartsNET = this.MyHighcharts.chart('m-net', NET);
      this.chartsCUP.showLoading('加载中......');
      this.chartsSIZE.showLoading('加载中......');
      this.chartsIO.showLoading('加载中......');
      this.chartsNET.showLoading('加载中......');
    },
    speedMysql () {
      // 获取不同值
      this.speedCPU = this.MyHighcharts.chart('mysql-cpu', this.speedOptions);
      this.speedSize = this.MyHighcharts.chart('mysql-size', this.speedOptions);
      // 回填数据
      this.speedCPU.series[0].setData([10], true, true)
      this.speedSize.series[0].setData([20], true, true)
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
    },
    // CPU 请求
    loadRealtimeCpu () {
      loadRealtimeCpu().then((result) => {

      }).catch((err) => {

      });
    },
    // 运行时间
    queryRunningTimeOs () {
      queryRunningTimeOs().then((result) => {

      }).catch((err) => {

      });
    },
    // 负载
    loadRealtime () {
      loadRealtime().then((result) => {

      }).catch((err) => {

      });
    },
    // IO
    loadRealtimeIO () {
      loadRealtimeIO().then((result) => {

      }).catch((err) => {

      });
    },
    // 宽带
    loadRealtimeNET () {
      loadRealtimeNET().then((result) => {

      }).catch((err) => {

      });
    },
    // 磁盘空间
    queryDiskSpace () {
      queryDiskSpace().then((result) => {

      }).catch((err) => {

      });
    },
    // 内存
    loadRealtimeMemory () {
      loadRealtimeMemory().then((result) => {

      }).catch((err) => {

      });
    },
    // 展示头信息
    show () {
      this.$store.commit("setHeader", true);
      localStorage.setItem("setHeader", true);
    },
  }
};
</script>
<style lang="scss" >
.m-system-sql {
  width: 100%;
  height: 100%;
  background: #1c2226;
  overflow: auto;
  color: #ddf2ff;
  font-size: 12px;
  overflow: auto;
  .e-card {
    height: calc(100% - 670px);
    margin-bottom: 10px;
    display: flex;
    position: relative;
    min-height: 178px;
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
        #mysql-cpu,
        #mysql-size {
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
      #m-cpu-m,
      #m-store-m,
      #m-io,
      #m-net {
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