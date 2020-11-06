<template>
  <!-- 模板echarts 抽离出去 公用 参考表空间I/O-->
  <div class="m-ehcars">
    <div id="echarsio"></div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
export default {
  components: {},
  props: {
    ioDate: ''
  },
  data () {
    return {
      charts: '',
      MyHighcharts: Highcharts,
      IOoptions: {
        chart: {
          backgroundColor: '#232a30',
          type: 'area',
        },
        tooltip: {
          shared: true,
          crosshairs: true,
        },
        title: {
          text: this.ioDate.title,
          align: 'left',
          style: {
            fontWeight: 'normal',
            color: '#fff',
            fontSize: '14px'
          }
        },
        // 去除版权信息
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: this.ioDate.categories,
          lineColor: '#1c2226',
          lineWidth: 1,
          tickInterval: this.ioDate.tickInterval,
          type: 'datetime',
          marker: {
            enabled: true
          },
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
        yAxis: {
          gridLineColor: '#1c2226',
          title: {
            enabled: false
          },
          labels: {
            format: this.ioDate.format,
          }
        },
        legend: {
          itemStyle: { "color": "#7c838b" },
          align: 'right',
          verticalAlign: 'top',
          x: 0,
          y: -40,
        },
        series: this.ioDate.series
      }
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
    ioDate: {
      handler (val1, val2) {
        if (val1.beginTime) {
          this.charts.hideLoading()
          // 存在
          let first = val1.series[0]
          let second = val1.series[1]
          let time = val1.categories
          if (time.length == 1) {
            // 更新
            let series = this.charts.series[0]
            let series1 = this.charts.series[1]
            let y = first.data[0]
            let y1 = second.data[0]
            // x 轴重新赋值
            this.charts.xAxis[0].categories.push(time[0])
            if (this.charts.xAxis[0].categories.length >= 20) {
              series.addPoint(y, false, true);
              series1.addPoint(y1, true, true);
            } else {
              series.addPoint(y);
              series1.addPoint(y1);
            }
          } else {
            // 保证每次都插入新的值
            let deId = this.charts.series
            for (let index = 0; index < deId.length; index++) {
              this.charts.series[0].remove()
              index--
            }
            // 插入
            let series = [
              {
                name: first.name,
                color: first.color,
                data: first.data
              }, {
                name: second.name,
                color: second.color,
                data: second.data
              }
            ]
            this.charts.xAxis[0].categories = time
            this.charts.addSeries(series[0])
            this.charts.addSeries(series[1])
          }
        } else {
          // 不存在
          let deId = this.charts.series
          this.charts.showLoading('加载中......');
          if (deId) {
            for (let index = 0; index < deId.length; index++) {
              this.charts.series[0].remove()
              index--
            }
          }
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
      this.charts = this.MyHighcharts.chart('echarsio', this.IOoptions);
      if (this.ioDate.series[0].data.length != 0 || this.ioDate.series[1].data.length != 0) {
        this.charts.hideLoading()
      } else {
        let deId = this.charts.series
        if (deId) {
          for (let index = 0; index < deId.length; index++) {
            this.charts.series[0].remove()
            index--
          }
        }
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
.m-ehcars {
  height: 100%;
  width: 100%;
  #echarsio {
    height: 100%;
    width: 100%;
  }
}
</style>