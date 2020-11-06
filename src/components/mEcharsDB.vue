<template>
  <div class="m-echars-db">
    <div id="echarsDB"></div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
export default {
  components: {},
  props: {
    deDate: ''
  },
  data () {
    return {
      charts: '',
      MyHighcharts: Highcharts,
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
          // pointFormat: '<span style="color:{series.color}">{series.name}</span>({point.y:,.0f}' + this.deDate.tooltip + ')<br/>',
          shared: true,
          crosshairs: true,
        },
        title: {
          text: this.deDate.title,
          align: 'left',
          style: {
            fontWeight: 'normal',
            color: '#fff',
            fontSize: '14px'
          }
        },
        xAxis: {
          type: 'datetime',
          categories: this.deDate.categories,
          marker: {
            enabled: true
          },
          lineColor: '#1c2226',
          tickInterval: this.deDate.tickInterval,
        },
        yAxis: {
          gridLineColor: '#1c2226',
          title: {
            enabled: false,
          },
          labels: {
            format: this.deDate.format
          },
        },
        series: this.deDate.series
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
    deDate: {
      // 刷新数据 不能使用update 比较消耗性能
      handler (val1, val2) {
        let series = this.charts.series
        if (val1.beginTime) {
          // 数据存在
          this.charts.hideLoading()
          let time = val1.categories
          let first = val1.series[0]
          if (time.length == 1) {
            let newPoint = [
              time[0],
              first.data[0],
            ]
            // x 轴重新复制
            this.charts.xAxis[0].categories.push(time[0])
            if (this.charts.xAxis[0].categories.length >= 20) {
              series[0].addPoint(newPoint, true, true);
            } else {
              series[0].addPoint(newPoint);
            }
          } else {
            for (let index = 0; index < series.length; index++) {
              series[0].remove()
              index--
            }
            // 一条数据
            let data1 = {
              name: first.name,
              color: first.color,
              data: first.data
            }
            this.charts.xAxis[0].categories = time
            this.charts.addSeries(data1)
          }
        } else {
          if (series.length) {
            for (let index = 0; index < series.length; index++) {
              series[0].remove()
              index--
            }
          }
          this.charts.showLoading('加载中.....');
        }
      },
      deep: true
    }
  },
  mounted () {
    this.tableEchars2()
  },
  methods: {
    tableEchars2 () {
      this.charts = this.MyHighcharts.chart('echarsDB', this.options);
      if (this.deDate.series[0].data.length > 0) {
        this.charts.hideLoading()
      } else {
        let deId = this.charts.series
        if (deId) {
          for (let index = 0; index < deId.length; index++) {
            this.charts.series[0].remove()
            index--
          }
        }
        this.charts.showLoading('加载中.....');
      }
    },
  },
  destroyed () {
    this.charts.destroy();
  }
};
</script>
<style lang="scss">
.m-echars-db,
#echarsDB {
  height: 100%;
  width: 100%;
}
</style>