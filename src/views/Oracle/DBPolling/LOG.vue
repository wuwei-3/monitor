<template>
  <!-- 逻辑读 -->
  <div class="LOG">
    <div class="e-top">
      <div>
        <t-date @getDate="getDate"></t-date>
      </div>
      <div class="p-select">
        <a-selet :options="reportOption"
                 @getOPtions="getOPtions"
                 :title="'IP地址'"
                 :reportId="file.id"></a-selet>
        <div class="n-select">
          <img src="@/assets//imgs/select.png"
               @mouseover="overImge(true)"
               @mouseout="overImge(false)">
          <div class="t-details"
               v-show="detail"
               @mouseover="overImge(true)"
               @mouseout="overImge(false)">
            <d-message :ips="ips"></d-message>
          </div>
        </div>
      </div>
    </div>
    <div class="e-bot"
         v-loading="loading">
      <div id="frenquentCharts"></div>
    </div>
  </div>
</template>

<script>
import aTime from "@/components/Time";
import aSelet4 from "@/components/mSelect4";
import qDialog from "@/components/sqlDialog2";
import aSelet from "@/components/mSelect3";
import nTable from "@/components/nTable";
import dMessage from "@/components/dbHostMes";
import tDate from "@/components/timeDate";
import {
  queryPdbName,
  ipList
} from "@/api/systemMes";
import { queryExecutionPlan } from "@/api/common";
import { queryOnlineLogSwitchFreq } from "@/api/DBPolling";
import aSelet1 from "@/components/aSelect";
import { formatDate } from '@/utils/date'
import Highcharts from "highcharts";
export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    aSelet1,
    qDialog,
    aSelet4,
    aTime,
    tDate
  },
  props: {},
  data () {
    return {
      beginTime: new Date(),
      timeLog: '',
      frenCharts: '',
      MyHighcharts: Highcharts,
      sql: '',
      dialogVisible: false,
      reportOption: [],
      tableData: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        beginTime: '',
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
      frenLogCharts: {
        chart: {
          zoomType: "xy"
        },
        title: {
          text: "日志切换频率",
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
  destroyed () {
    this.frenCharts.destroy()
  },
  computed: {
    header: function () {
      return this.$store.getters.getHeader
    },
  },
  watch: {
    // 切换头echar 图需要重新加载 去除百分比
    header () {
      this.frenCharts.reflow();
    },
  },
  methods: {
    setData (val) {
      let that = this
      // 去除数据 
      let deId = that.frenCharts.series
      for (let index = 0; index < deId.length; index++) {
        that.frenCharts.series[0].remove()
        index--
      }
      if (val.first.length == 0 || val.second.length == 0) {
        return this.frenCharts.showLoading('暂无数据......');
      }
      // 再次插入
      that.frenCharts.hideLoading()
      that.frenCharts.xAxis[0].categories = val.time
      let series =
      {
        name: val.day[0],
        color: '#27d3ae',
        data: val.first
      }
      let series1 =
      {
        name: val.day[1],
        color: '#e7f45c',
        data: val.second
      }
      that.frenCharts.addSeries(series)
      that.frenCharts.addSeries(series1)
    },
    // getDate
    getDate (val) {
      this.beginTime = val
      this.search()
    },
    getEchars (val) {
      this.frenCharts = this.MyHighcharts.chart('frenquentCharts', this.frenLogCharts);
    },
    // 下拉框
    getOPtions (val) {
      this.file.id = val;
      this.detail = false;
      this.search()
      this.reportOption.forEach(item => {
        if (item.oracleConfigId == val) {
          return (this.ips = item);
        }
      });
    },
    // 获取主机列表
    getIps () {
      this.loading = true;
      ipList(this.items)
        .then(result => {
          if (result.data.length > 0) {
            this.reportOption = result.data || []
            this.file.id = result.data[0].oracleConfigId;
            this.ips = result.data[0];
            this.search()
          }
        })
        .catch(err => {
          this.loading = false
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    overImge (val) {
      if (val) {
        if (this.file.id) {
          this.detail = true
        } else {
          return this.$message.warning("请先选择IP");
        }
      } else {
        this.detail = false
      }
    },
    search () {
      if (!this.file.id) {
        return this.$message.error("请选择IP");
      }
      if (!this.beginTime) {
        return this.$message.error("请选择时间节点");
      }
      this.file.beginTime = formatDate(this.beginTime, 'yyyy-MM-dd')
      this.getMes(this.file);
    },
    getMes (val) {
      this.loading = true;
      let _self = this;
      queryOnlineLogSwitchFreq(val)
        .then(result => {
          this.loading = false;
          this.setData(result)
        })
        .catch(err => {
          this.frenCharts.showLoading('暂无数据......');
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          this.loading = false;
          this.tableData = []
        });
    }
  },
  mounted () {
    this.getIps();
    this.getEchars()
  }
};
</script>
<style lang="scss">
.LOG {
  height: 100%;
  width: 100%;
  .e-top {
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 10px;
    background: #f5f6fa;
    & .r10 {
      margin-right: 10px;
    }
    & .w100 {
      width: 100px;
    }
    .el-button {
      padding: 8px 20px;
      border-radius: 0px;
    }
    .p-select {
      position: absolute;
      font-size: 12px;
      right: -10px;
      display: flex;
      margin-right: 20px;
      cursor: pointer;
      .n-select {
        margin-left: auto;
        position: relative;
        img {
          height: 100%;
        }
        .e-san {
          width: 0px;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 9px solid #d2d6d8;
          position: absolute;
          top: 40px;
          right: 10px;
          z-index: 1;
        }
        .t-details {
          min-width: 365px;
          min-height: 198px;
          background-color: #ffffff;
          border: solid 1px #eaeaea;
          position: absolute;
          z-index: 10;
          right: -19px;
          padding: 10px;
          overflow: auto;
          top: 50px;
          .s-span {
            height: 22.5px;
            line-height: 23px;
          }
        }
      }
    }
  }
  .e-bot {
    height: calc(100% - 50px);
    background: #f5f6fa;
    position: relative;
    overflow: auto;
    padding: 0px 10px 10px 10px;
    .t-noDate {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 15px;
    }
  }
}
</style>