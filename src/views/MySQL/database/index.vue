<template>
  <div class="m-indxcpt-sql">
    <div class="x-status1">
      <!-- one 组建 -->
      <m-status></m-status>
    </div>
    <div class="x-status2">
      <div class="s-chart1">
        <m-echarsio :ioDate="ioDate"></m-echarsio>
      </div>
      <div class="s-chart2">
        <m-echarsdb :deDate="deDate"></m-echarsdb>
      </div>
    </div>
    <div class="x-status3">
      <div class="f10">
        <div id="m-database-qps"></div>
      </div>
      <div class="f10">
        <div id="m-database-tps"></div>
      </div>
      <div>
        <div id="m-database-slow"></div>
      </div>
    </div>
  </div>
</template>

<script>
// 中英文切换
import { mapState } from "vuex";
import mHeader from "@/components/header";
import Highcharts from "highcharts";
import mTable from "@/components/mTable";
import mStatus from "@/components/mStatus";
import mEcharsio from "@/components/mEcharsIO";
import mEcharsdb from "@/components/mEcharsDB";
export default {
  components: {
    mHeader,
    mTable,
    mStatus,
    mEcharsio,
    mEcharsdb
  },
  data () {
    return {
      MyHighcharts: Highcharts,
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
      options: {
        chart: {
          backgroundColor: '#232a30',
          type: 'area',
        },
        // 去除版权信息
        credits: {
          enabled: false,
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
          itemStyle: { "color": "#7c838b" },
          align: 'right',
          verticalAlign: 'top',
          x: 0,
          y: -40,
        },
        tooltip: {
          // 单位
          shared: true,
          crosshairs: true,
        },
        title: {
          text: '数据库链接',
          align: 'left',
          style: {
            fontWeight: 'normal',
            color: '#fff',
            fontSize: '14px'
          }
        },
        xAxis: {
          type: 'datetime',
          categories: [],
          marker: {
            enabled: true
          },
          lineColor: '#1c2226',
          tickInterval: 2,
        },
        yAxis: {
          gridLineColor: '#1c2226',
          title: {
            enabled: false,
          },
          labels: {
            format: '{value}次'
          },
        },
        series: []
      },
      chartsQPS: '',
      chartsSize: '',
      chartsTPS: '',
    };
  },
  props: {},
  computed: {
    header: function () {
      return this.$store.getters.getHeader;
    }
  },
  watch: {
    // 切换头echar 图需要重新加载 去除百分比
    header () {
    }
  },
  mounted () {
    // 首页去除title
    this.$store.commit("setTitle", false);
    localStorage.setItem("setTitle", false);
    this.getMethods()
  },
  methods: {
    // table切换
    getMethods () {
      let QPS = this.$_.cloneDeep(this.options)
      QPS.title.text = 'QPS'
      QPS.yAxis.labels.format = "{value}%"
      this.chartsQPS = this.MyHighcharts.chart('m-database-qps', QPS);
      this.chartsQPS.showLoading('加载中......');
      // 
      let TPS = this.$_.cloneDeep(this.options)
      TPS.title.text = 'TPS'
      TPS.yAxis.labels.format = "{value}%"
      this.chartsTPS = this.MyHighcharts.chart('m-database-tps', TPS);
      this.chartsTPS.showLoading('加载中......');
      // 
      let SIZE = this.$_.cloneDeep(this.options)
      SIZE.title.text = '慢查询数'
      SIZE.yAxis.labels.format = "{value}%"
      this.chartsSize = this.MyHighcharts.chart('m-database-slow', SIZE);
      this.chartsSize.showLoading('加载中......');
    },
  }
};
</script>
<style lang="scss">
.m-indxcpt-sql {
  height: 100%;
  width: 100%;
  background-color: #1c2226;
  overflow: auto;
  .x-status1 {
    height: calc(100% - 735px);
    overflow: hidden;
    min-height: 115px;
  }
  .x-status2 {
    height: 353px;
    display: flex;
    margin-top: 10px;
    .s-chart1 {
      padding: 0 10px 0 0;
    }
    .s-chart1,
    .s-chart2 {
      width: 50%;
      #container2 {
        height: 100%;
        width: 100%;
      }
    }
  }
  .x-status3 {
    display: flex;
    height: 360px;
    width: 100%;
    margin-top: 10px;
    #m-database-tps,
    #m-database-qps,
    #m-database-slow {
      width: 100%;
      height: 100%;
    }
    div {
      width: 33%;
      height: 100%;
      background-color: #232a30;
      border-radius: 3px;
    }
    .f10 {
      margin-right: 10px;
    }
  }
}
</style>

