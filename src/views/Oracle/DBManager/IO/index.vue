<template>
  <!-- 逻辑读 -->
  <div class="usetableio">
    <div class="e-top">
      <div class="w100 r10"
           v-if="dbStatus">
        <a-selet4 :options="reportOption1"
                  @getOPtions="getOPtions1"
                  :title="'数据库名'"
                  :reportId="file.dbName"></a-selet4>
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
      <div id="ioCharts"></div>
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
import {
  queryPdbName,
  ipList
} from "@/api/systemMes";
import { queryTableSpace, cancelMonitorIndex, queryTableSpaceIO } from "@/api/sqlManager";
import aSelet1 from "@/components/aSelect";
import { formatDate } from '@/utils/date'
import Highcharts from "highcharts";
import { setInterval, clearInterval } from 'timers';
export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    aSelet1,
    qDialog,
    aSelet4,
    aTime,
  },
  props: {},
  data () {
    return {
      time30: '',
      ioTime: '',
      ioCharts: '',
      MyHighcharts: Highcharts,
      updateRows: {},
      visible: '',
      sql: '',
      dialogVisible: false,
      reportOption1: [],
      reportOption: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        dbName: "",
        beginTime: ''
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
      ioOptionCharts: {
        chart: {
          zoomType: "xy"
        },
        title: {
          text: "表空间IO",
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
    this.ioCharts.destroy()
    clearInterval(this.time30)
  },
  computed: {
    header: function () {
      return this.$store.getters.getHeader
    },
  },
  watch: {
    // 切换头echar 图需要重新加载 去除百分比
    header () {
      this.ioCharts.reflow();
    },
  },
  mounted () {
    this.getIps();
    this.getEchars()
    this.time30 = setInterval(() => {
      this.search()
    }, 30000)
  },
  methods: {
    getEchars (val) {
      this.ioCharts = this.MyHighcharts.chart('ioCharts', this.ioOptionCharts);
    },
    getOPtions1 (val) {
      this.file.beginTime = ''
      this.file.dbName = val
      this.search()
    },
    setData (val, val2) {
      let that = this
      if (val.length > 0) {
        // 添加线
        if (!this.file.beginTime) {
          // 去除数据 
          let deId = that.ioCharts.series
          for (let index = 0; index < deId.length; index++) {
            that.ioCharts.series[0].remove()
            index--
          }
          // 再次插入
          that.ioCharts.hideLoading()
          that.ioCharts.xAxis[0].categories = val[0].tableSpaceTime
          val.forEach(item => {
            let series =
            {
              name: item.tabName,
              data: item.write
            }
            that.ioCharts.addSeries(series)
          });
          that.file.beginTime = val2
        } else {
          // 添加点
          that.ioCharts.hideLoading()
          let formTime = new Date()
          let time = formatDate(formTime, 'hh:mm:ss')
          let te = val[0].tableSpaceTime ? val[0].tableSpaceTime[0] : time
          that.ioCharts.xAxis[0].categories.push(te)
          val.forEach((item, index) => {
            if (item.read || item.write) {
              let it = [
                item.write[0],
              ]
              that.ioCharts.series[index].addPoint(it, true, true);
            } else {
              that.ioCharts.series[index].addPoint(0, true, true);
            }
          });
          that.file.beginTime = val2
        }
      } else {
        that.file.beginTime = ''
        let deId = that.ioCharts.series
        if (deId) {
          for (let index = 0; index < deId.length; index++) {
            that.ioCharts.series[0].remove()
            index--
          }
        }
        that.ioCharts.showLoading('暂无数据......');
      }
    },
    // 获取下拉框
    getSelect () {
      queryPdbName({ id: this.file.id })
        .then(result => {
          if (result.data.length > 0) {
            this.reportOption1 = result.data || []
            this.file.dbName = result.data[0].NAME
            this.search()
          }
        })
        .catch(err => {
          this.reportOption1 = []
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 下拉框
    getOPtions (val) {
      this.file.id = val;
      this.detail = false;
      this.loading = true;
      this.file.beginTime = ''
      this.reportOption.forEach(item => {
        if (item.oracleConfigId == val) {
          this.showDbStatus(item.version);
          return (this.ips = item);
        }
      });
    },
    showDbStatus (val) {
      let version = Number(val);
      if (version > 11) {
        this.dbStatus = true;
        this.getSelect();
      } else {
        this.file.dbName = ''
        this.loading = false
        this.dbStatus = false;
        this.search()
      }
    },
    getName (val) {
      this.file.dbName = val;
    },
    // 获取主机列表
    getIps () {
      this.loading = true;
      ipList(this.items)
        .then(result => {
          this.loading = false
          if (result.data.length > 0) {
            this.reportOption = result.data || []
            this.file.id = result.data[0].oracleConfigId;
            this.ips = result.data[0];
            this.showDbStatus(this.ips.version);
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
      if (this.dbStatus) {
        if (!this.file.dbName) {
          return this.$message.error("请选择数据库名");
        }
      }
      this.getMes(this.file);
    },
    getMes (val) {
      let _self = this;
      queryTableSpaceIO(val)
        .then(result => {
          this.setData(result.data, result.beginTime)
        })
        .catch(err => {
          let deId = _self.ioCharts.series
          for (let index = 0; index < deId.length; index++) {
            _self.ioCharts.series[0].remove()
            index--
          }
          this.ioCharts.showLoading('暂无数据......');
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          this.tableData = []
        });
    }
  },
};
</script>
<style lang="scss">
.usetableio {
  height: 100%;
  width: 100%;
  .e-top {
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 10px;
    background: #f5f6fa;
    .sys-add {
      .el-button {
        background: #24bd6f;
        color: #fff;
      }
    }
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
    #ioCharts {
      width: 100%;
      height: 50%;
    }
  }
}
</style>