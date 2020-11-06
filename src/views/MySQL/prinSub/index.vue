<template>
  <!-- DG 节点 -->
  <div class="dg-node">
    <!--  下拉框 -->
    <div class="e-icons"
         :style="[{'height':downOrUpS? '240px': ''}]">
      <div class="s-ico"
           @click="show"
           v-show="!header">
        <i class="iconfont iconzuoyouduiqi"></i>
      </div>
      <div class="e-row"
           v-for="(i,index) in 5"
           :key="index">
        <!-- 最左側名稱 -->
        <div class="w-left">
          RACDB1
        </div>
        <!-- 框里值 -->
        <div class="w-main"
             v-for="(i,index) in 10"
             :key="index"
             :style="{'margin-right':index == 9 ? '0px':''}">
          <div class="n-top">
            <!-- 用户覆盖DB实例状态 给与z-index  -->
            <div class="p-div"></div>
            <span>DB实例状态</span>
          </div>
          <div class="n-bot">
            <span>正常</span>
          </div>
        </div>
      </div>
    </div>
    <div class="e-fontI"
         @click="downOrUp">
      <i class="iconfont iconshangxiala"
         v-if="downOrUpS"></i>
      <i class="iconfont iconshangxiala-copy"
         v-else></i>
    </div>
    <!-- DG 延迟时间 传输量  -->
    <div class="e-row2"
         :style="[{'height':header? '270px': ''}]">
      <div class="w-echars1">
        <m-echartsdb :deDate="deDate"></m-echartsdb>
      </div>
      <div class="w-echars2">
        <div class="s-top">
          <div class="p-cs">传输量</div>
          <div class="p-ip">
            <div class="p-host r10">
              <div class="icon"></div>
              <div> 192.168.27.29</div>
            </div>
            <div class="p-host">
              <div class="icon"></div>
              <div> 192.168.27.29</div>
            </div>
          </div>
        </div>
        <div class="s-bot">
          <div class="t-left">
            <div>主库</div>
            <div class="ip">182.168.23.12</div>
            <div>"Red Hat Enterprise
              Linux Server release
              7.6 (Maipo)"</div>
          </div>
          <div class="t-echars">
            <div class="t-right">
              <div id="dgNodeIP"></div>
            </div>
            <div class="s-spi">
              <span>传输速度：<i>500kb/s</i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 活动连接数 归档大小 日志切换 -->
    <div class="e-row3">
      <div class="f10"
           id="container1">
      </div>
      <div id="container3"></div>
    </div>
  </div>
</template>
 
<script>
import mEchartsdb from "@/components/mEcharsDB"
import Highcharts from "highcharts";
// 最主要是这里模块的引入 很坑
export default {
  components: {
    mEchartsdb
  },
  props: {},
  data () {
    return {
      downOrUpS: true,
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
  computed: {
    header: function () {
      return this.$store.getters.getHeader;
    }
  },
  watch: {
    header () {
      this.getEchars1()
      this.tableEchars('container1')
      this.tableEchars('container3')
    }
  },
  mounted () {
    // 下面头信息
    this.$store.commit("setTitle", false);
    localStorage.setItem("setTitle", false);
    this.getEchars1()
    this.tableEchars('container1')
    this.tableEchars('container3')
  },
  methods: {
    // 下拉 
    downOrUp () {
      this.downOrUpS = !this.downOrUpS
    },
    // 展示头信息
    show () {
      this.$store.commit("setHeader", true);
      localStorage.setItem("setHeader", true);
    },
    tableEchars (val) {
      Highcharts.chart(val, {
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
        // 去除版权信息
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [
            "10:20",
            "10:20",
            "10:20",
            "10:20",
            "10:20",
            "10:20",
            "10:20",
            "10:20",
            "10:20",
            "10:20",
            "10:20",
            "10:20"
          ],
          lineColor: "#1c2226",
          lineWidth: 1
        },
        yAxis: {
          gridLineColor: "#1c2226",
          title: {
            text: ""
          },
          labels: {
            formatter: function () {
              return this.value + "°";
            }
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
        series: [
          {
            name: "主库",
            data: [7.0, 6.9, 2.5, 4.5, 0.2, 1.5, 5.2, 23.3, 18.3, 13.9, 9.6],
            color: "#01d0fe"
          },
          {
            name: "备库",
            data: [4.2, 5.7, 8.5, 11.9, 5.2, 17.0, 6.6, 4.2, 10.3, 6.6, 4.8],
            color: "#edc544"
          }
        ]
      });
    },
    getEchars1 () {
      let chart = Highcharts.chart('dgNodeIP', {
        chart: {
          backgroundColor: "#232a30",
          zoomType: "xy"
        },
        title: {
          text: ''
        },
        yAxis: {
          // Primary yAxis
          gridLineColor: "#1c2226",
          title: {
            text: ''
          }
        },
        xAxis: [{
          categories: ["", "", "", "", "", "", "", "", "", "", "", ""],
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
          name: '192.168.23.12',
          color: '#36ce8a',
          data: [12, 21, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
          name: '192.168.23.12',
          color: '#7aaff5',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }],
      });
    },
  },
};
</script>
<style lang="scss" >
.dg-node {
  height: 100%;
  width: 100%;
  background: #1c2226;
  color: #fff;
  overflow: auto;
  position: relative;
  .e-icons {
    min-height: 240px;
    overflow: hidden;
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
    .e-row {
      min-height: 120px;
      display: flex;
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
        height: 115px;
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
    z-index: 2001;
    justify-content: center;
    &:hover {
      transform: scale(1.2);
    }
  }
  .e-row2 {
    min-height: 270px;
    margin-top: 10px;
    height: calc(100% - 578px);
    display: flex;
    .w-echars1 {
      width: 50%;
      height: 100%;
      margin-right: 10px;
    }
    .w-echars2 {
      width: 50%;
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
            height: calc(100% - 40px);
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
    height: 318px;
    display: flex;
    div {
      width: 50%;
      height: 100%;
      background: #232a30;
    }
    .f10 {
      margin-right: 10px;
    }
    #container1,
    #container3 {
      width: 100%;
      height: 100%;
    }
  }
}
</style>