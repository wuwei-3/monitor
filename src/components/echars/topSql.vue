<template>
  <!-- 模板echarts 抽离出去 公用 参考表空间I/O-->
  <div class="top-sql">
    <div id="sqlTainer"></div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
export default {
  components: {},
  props: {
    sqlDate: ''
  },
  data () {
    return {
      chartsSql: '',
      MyHighcharts: Highcharts,
      // TOP SQL
      TopOPtios: {
        chart: {
          backgroundColor: "#232a30",
          type: "areaspline"
        },
        // 去除版权信息
        credits: {
          enabled: false
        },

        legend: {
          itemStyle: { color: "#7c838b" },
          align: "right",
          verticalAlign: "top",
          x: 0,
          y: -40
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
        title: {
          text: this.sqlDate.title,
          align: "left",
          style: {
            fontWeight: "normal",
            color: "#fff",
            fontSize: "14px"
          }
        },
        xAxis: {
          categories: this.sqlDate.categories,
          lineColor: "#1c2226",
          lineWidth: 1
        },
        yAxis: {
          gridLineColor: "#1c2226",
          title: {
            text: ""
          },
          labels: {
            format: this.sqlDate.format
          }
        },
        tooltip: {
          shared: true,
          crosshairs: true,
        },
        plotOptions: {
          areaspline: {
            fillOpacity: 0.5
          }
        },
        series: this.sqlDate.series
      },
      formartSQL: '',
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
      this.chartsSql.reflow();
    },
    sqlDate: {
      handler (val1, val2) {
        if (val1.beginTime) {
          this.TopOPtios.xAxis.categories = this.sqlDate.categories
          this.TopOPtios.yAxis.labels.format = this.sqlDate.format
          // 再次更新必须重新赋值
          this.chartsSql = this.MyHighcharts.chart('sqlTainer', this.TopOPtios);
        } else {
          let deId = this.chartsSql.series
          this.chartsSql.showLoading('加载中......');
          if (deId) {
            for (let index = 0; index < deId.length; index++) {
              this.chartsSql.series[0].remove()
              index--
            }
          }
        }
      },
      deep: true
    },
  },
  mounted () {
    this.tableEchars()
  },
  methods: {
    tableEchars () {
      this.chartsSql = this.MyHighcharts.chart('sqlTainer', this.TopOPtios);
      if (this.sqlDate.series[0].data.length == 0) {
        this.chartsSql.hideLoading();
      } else {
        let deId = this.chartsSql.series
        for (let index = 0; index < deId.length; index++) {
          this.chartsSql.series[0].remove()
          index--
        }
        this.charts.showLoading('加载中......');
      }
    },
  },
  destroyed () {
    this.chartsSql = null
    this.MyHighcharts = null
  }
};
</script>
<style lang="scss">
.top-sql {
  height: 100%;
  width: 100%;
  #sqlTainer {
    height: 100%;
    width: 100%;
  }
}
</style>