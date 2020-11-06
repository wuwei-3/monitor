<template>
  <!-- 逻辑读 -->
  <div class="slowSearch">
    <div class="e-top">
      <div>
        开始时间：
      </div>
      <div class="r10">
        <a-time @getTime="getBTime"
                :time='file.beginTime'></a-time>
      </div>
      <div>
        结束时间：
      </div>
      <div class="r10">
        <a-time @getTime="getETime"
                :time='file.endTime'></a-time>
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
      <div>
        <n-table :column="column"
                 :tableData="tableData"
                 :status="'sql1'"
                 :selection="'1'"></n-table>
      </div>
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
import { queryExecutionPlan } from "@/api/common";
import { queryArchiveSize } from "@/api/DBPolling";
import aSelet1 from "@/components/aSelect";
import { formatDate } from '@/utils/date'
export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    aSelet1,
    qDialog,
    aSelet4,
    aTime
  },
  props: {},
  data () {
    //  moren
    const start = new Date();
    let beginTime = start.setTime(start.getTime() - 3600 * 1000 * 10);
    return {
      sql: '',
      dialogVisible: false,
      reportOption: [],
      // 统一表格样式
      column: [
        { label: "EXEC TIME", prop: "exec_time", width: 8 },
        { label: "LOGIN USER", prop: "login_user", width: 8 },
        { label: "QUERY TIME SECONDS", prop: "query_time_seconds", width: 10 },
        { label: "LOCK TIME SECONDS", prop: "lock_time_seconds", width: 10 },
        { label: "ROWS EXAMINED", prop: "rows_sent", width: 10 },
        { label: "FILE LINE NUM", prop: "rows_examined", width: 10 },
        { label: "SQL TEXT", prop: "file_line_num", width: 8 },
        { label: "SQL TEXT", prop: "sqltext", width: 8 },
        { label: "THREAD ID", prop: "Thread_id", width: 8 },
        { label: "SCHEMA", prop: "Schema", width: 8 },
        { label: "QC HIT", prop: "QC_hit", width: 8 },
      ],
      tableData: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        beginTime: beginTime,
        endTime: new Date(),
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
    };
  },
  methods: {
    // 获取事件
    getBTime (val) {
      this.file.beginTime = val
      this.search()
    },
    getETime (val) {
      this.file.endTime = val
      this.search()
    },
    // 下拉框
    getOPtions (val) {
      this.file.id = val;
      this.detail = false;
      this.loading = true;
      this.file.beginTime = new Date()
      this.file.endTime = new Date()
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
            this.loading = false
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
      if (!this.file.beginTime) {
        return this.$message.error("请选择开始时间");
      }
      let time = new Date(this.file.beginTime)
      this.file.beginTime = formatDate(time, 'yyyy-MM-dd hh:mm:ss')

      if (!this.file.endTime) {
        return this.$message.error("请选择结束时间");
      }
      let time1 = new Date(this.file.endTime)
      this.file.endTime = formatDate(time1, 'yyyy-MM-dd hh:mm:ss')

      this.getMes(this.file);
    },
    getMes (val) {
      this.loading = true;
      let _self = this;
      queryArchiveSize(val)
        .then(result => {
          this.tableData = result.data || []
          this.loading = false;
        })
        .catch(err => {
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          this.loading = false;
          this.tableData = []
        });
    }
  },
  created () { },
  mounted () {
    this.getIps();
  }
};
</script>
<style lang="scss">
.slowSearch {
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
    background: #fff;
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