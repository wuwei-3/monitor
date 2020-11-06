<template>
  <div class="historyMon">
    <div class="n-chart1">
      <div class="t-time">
        <t-time @getTime="getTime"></t-time>
      </div>
      <div class="t-chart">
        <div id="loadCharts1"></div>
      </div>
    </div>
    <div class="n-chart2">
      <div class="t-time">
        <t-time @getTime="getTime"></t-time>
      </div>
      <div class="t-chart">
        <div id="loadCharts2"></div>
      </div>
    </div>
    <div class="n-chart3">
      <div class="t-time">
        <t-time @getTime="getTime"></t-time>
      </div>
      <div class="t-chart">
        <div id="loadCharts3"></div>
      </div>
    </div>
    <div class="n-chart4">
      <n-table :column="column"
               :tableData="tableData"
               :status="'sql1'"
               :selection="'1'"></n-table>
    </div>
  </div>
</template>

<script>
import tTime from '@/components/timePick'
import Highcharts from "highcharts";
import nTable from "@/components/nTable";
export default {
  components: {
    tTime,
    nTable
  },
  props: {},
  data () {
    return {
      // 统一表格样式
      column: [
        { label: "FILESYSTEM", prop: "FILESYSTEM" },
        { label: "SIZE", prop: "SIZE" },
        { label: "USED", prop: "USED" },
        { label: "	AVAIL", prop: "	AVAIL" },
        { label: "USE%", prop: "USE%" },
        { label: "MOUNTED ON", prop: "MOUNTED ON" },
      ],
      tableData: [],
      loadCharts1: '',
      loadCharts2: '',
      loadCharts3: '',
      MyHighcharts: Highcharts,
      frenLogCharts: {
        chart: {
          zoomType: "xy"
        },
        title: {
          text: "系统负载",
          align: "left",
          style: {
            fontWeight: "normal",
            color: "#fff",
            fontSize: "14px"
          }
        },
        // 去除版权信息
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: []
        },
        legend: {
          itemStyle: { color: "#7c838b" },
          align: "center",
          verticalAlign: "top",
          x: 0,
          y: -40
        },
        yAxis: {
          title: {
            text: ''
          },
          labels: {
            formatter: function () {
              return this.value + '次';
            }
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 1
            }
          }
        },
        series: []
      }
    };
  },
  watch: {},
  mounted () {
    this.getEchars()
  },
  methods: {
    getTime (val) {

    },
    getEchars (val) {
      this.loadCharts1 = this.MyHighcharts.chart('loadCharts1', this.frenLogCharts);
      this.loadCharts1.showLoading('暂无数据......');
      this.loadCharts2 = this.MyHighcharts.chart('loadCharts2', this.frenLogCharts);
      this.loadCharts2.showLoading('暂无数据......');
      this.loadCharts3 = this.MyHighcharts.chart('loadCharts3', this.frenLogCharts);
      this.loadCharts3.showLoading('暂无数据......');
    },
  },
};
</script>
<style lang="scss" >
.historyMon {
  width: 100%;
  height: 100%;
  overflow: auto;
  .n-chart1,
  .n-chart2,
  .n-chart3 {
    height: 200px;
    width: 100%;
    margin-bottom: 10px;
    background: #fbfbfb;
    .t-time {
      padding: 10px;
    }
    .t-chart {
      height: 150px;
      width: 100%;
      #loadCharts1,
      #loadCharts2,
      #loadCharts3 {
        width: 100%;
        height: 100%;
      }
    }
  }
  .n-chart4 {
    height: 300px;
    width: 100%;
    overflow: auto;
  }
}
</style>