<template>
  <!-- 模板echarts 抽离出去 公用 参考表空间I/O-->
  <div class="top-wait">
    <div id="topWait"></div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
export default {
  components: {},
  props: {
    waitDate: ''
  },
  data () {
    return {
      charts: '',
      MyHighcharts: Highcharts,
      // 等待事件
      IOptions: {
        chart: {
          backgroundColor: "#232a30",
          zoomType: "xy"
        },
        // 去除版权信息
        credits: {
          enabled: false
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
          shared: true,
          crosshairs: true,
        },
        title: {
          text: this.waitDate.title,
          align: "left",
          style: {
            fontWeight: "normal",
            color: "#fff",
            fontSize: "14px"
          }
        },
        xAxis: [
          {
            categories: this.waitDate.categories,
            crosshair: true,
            lineColor: "#1c2226",
            lineWidth: 1
          }
        ],
        yAxis: [
          {
            gridLineColor: "#1c2226",
            labels: {
              format: this.waitDate.format
            },
            title: {
              text: ""
            }
          },
          {
            gridLineColor: "#1c2226",
            title: {
              text: ""
            },
            labels: {
              format: "'"
            },
            opposite: true,
            visible: false
          }
        ],
        legend: {
          itemStyle: { color: "#7c838b" },
          align: "right",
          verticalAlign: "top",
          x: 0,
          y: -40
        },
        plotOptions: {
          column: {
            pointWidth: 15, //柱子宽度
          }
        },
        series: this.waitDate.series
      },
    };
  },
  computed: {
    header: function () {
      return this.$store.getters.getHeader
    },
  },
  watch: {
    // 切换头echar 图需要重新加载 去除百分比
    header () {
      this.charts.reflow();
    },
    waitDate: {
      handler (val1, val2) {
        let data = val1.series[0].data
        let data1 = val1.series[1].data
        if (data.length > 0 || data1.length > 0) {
          // 直接渲染数据
          this.charts.hideLoading()
          this.charts.xAxis[0].categories = val1.categories
          this.charts.series[0].setData(data)
          this.charts.series[1].setData(data1)
        } else {
          let deId = this.charts.series
          for (let index = 0; index < deId.length; index++) {
            this.charts.series[0].remove()
            index--
          }
          this.charts.showLoading('加载中......');
        }
      },
      deep: true
    }
  },
  mounted () {
    this.tableEchars()
  },
  methods: {
    // echars 
    tableEchars () {
      this.charts = this.MyHighcharts.chart('topWait', this.IOptions);
      if (this.waitDate.series[0].data.length == 0 && this.waitDate.series[1].data.length == 0) {
        this.charts.hideLoading()
      } else {
        this.charts.series[0].setData([])
        this.charts.showLoading('加载中......');

      }
    },
  },
  destroyed () {
    this.charts.destroy();
  }
};
</script>
<style lang="scss">
.top-wait {
  height: 100%;
  width: 100%;
  #topWait {
    height: 100%;
    width: 100%;
  }
}
</style>