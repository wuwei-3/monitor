<template>
  <!-- 逻辑读 -->
  <div class="longtimelock">
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
      <div>
        <n-table :column="column"
                 :tableData="tableData"
                 :status="'sql1'"
                 @downloadSQL="downloadSQL"
                 @lockPlan="lockPlan"
                 :selection="'1'"
                 @showSQLId="showSQLId"></n-table>
      </div>
    </div>
    <div v-if="dialogVisible">
      <q-dialog @confirm="confirm"
                :dialogVisible="dialogVisible"
                :sql="sql"
                @cancel="confirm">
      </q-dialog>
    </div>
    <div v-if="dialogSqlId">
      <q-dialog3 @confirm="confirmSQL"
                 :dialogVisible="dialogSqlId"
                 :sql="sql">
      </q-dialog3>
    </div>
  </div>
</template>

<script>
import qDialog from "@/components/sqlDialog2";
import aSelet4 from "@/components/mSelect4";
import aSelet from "@/components/mSelect3";
import nTable from "@/components/nTable";
import dMessage from "@/components/dbHostMes";
import aSelet1 from "@/components/aSelect";
import {
  queryBigFile,
  queryPdbName,
  ipList
} from "@/api/systemMes";
import { queryExecutionPlan, download, querySQLText } from "@/api/common";
import { LongTimeNoReleaseLock } from "@/api/sqlMonitor";
import qDialog3 from "@/components/sqlDialog3";

export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    aSelet1,
    aSelet4,
    qDialog,
    qDialog3
  },
  props: {},
  data () {
    return {
      dialogSqlId: false,
      sql: {},
      dialogVisible: false,
      reportOption1: [],
      reportOption: [],
      // 统一表格样式
      column: [
        { label: "SQL_ID", prop: "SQL_ID" },
        { label: "SID", prop: "SID" },
        { label: "USERNAME", prop: "USERNAME" },
        { label: "MACHINE", prop: "MACHINE" },
        { label: "PROGRAM", prop: "PROGRAM" },
        { label: "EVENT", prop: "EVENT" },
        { label: "PROGRAM", prop: "PROGRAM" },
        { label: "LAST_CALL_ET", prop: "LAST_CALL_ET" },
        { label: "SQL_TEXT", prop: "CTIME" },
        { label: "执行计划", prop: "operaton1" }
      ],
      tableData: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        dbName: ""
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
    };
  },
  watch: {
    'file.rowNumber': {
      handler (newName, oldName) {
        this.search()
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    showSQLId (val) {
      if (val.SQL_ID == 'None') {
        return this.$message.warning('当前SQL_ID 无法查询')
      }
      // 查看sql
      let par = {
        id: this.file.id,
        dbName: this.file.dbName,
        sqlId: val.SQL_ID
      }
      this.loading = true
      querySQLText(par).then((result) => {
        this.sql = result.data
        this.dialogSqlId = true
        this.loading = false
      }).catch((err) => {
        this.MyMessageHtml.error({
          dangerouslyUseHTMLString: true,
          message: err.msg
        });
        this.loading = false
        this.dialogSqlId = false
      });
    },
    // 
    confirmSQL () {
      this.dialogSqlId = false
    },
    confirm () {
      this.dialogVisible = false
    },
    // 查看固定sql计划
    lockPlan (val) {
      let par = {
        id: this.file.id,
        dbName: this.file.dbName,
        sqlId: val
      }
      this.loading = true
      queryExecutionPlan(par).then((result) => {
        this.sql = result.data
        this.dialogVisible = true
        this.loading = false
      }).catch((err) => {
        this.MyMessageHtml.error({
          dangerouslyUseHTMLString: true,
          message: err.msg
        });
        this.loading = false
        this.dialogVisible = false
      });
    },
    // 文件下载
    downloadSQL (val) {
      let par = {
        id: this.file.id,
        sqlId: val.SQL_ID,
        dbName: this.file.dbName
      };
      if (!par.dbName) {
        delete par.dbName
      }
      this.loading = true
      download(par).then((result) => {
        this.$message.success('下载成功');
        this.loading = false
      }).catch((err) => {
        this.loading = false
        this.$message.error('下载失败');
      });
    },
    // 
    getOPtions1 (val) {
      this.file.dbName = val
      this.search()
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
          this.loading = false
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
        this.dbStatus = false;
        this.search()
      }
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
            this.showDbStatus(this.ips.version);
          }
        })
        .catch(err => {
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
          return this.$message.error("请选择数据名");
        }
      }
      this.getMes(this.file);
    },
    getMes (val) {
      this.loading = true;
      let _self = this;
      LongTimeNoReleaseLock(val)
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
.longtimelock {
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
    .el-input__inner {
      height: 33px;
      line-height: 33px;
      font-size: 12px;
    }
    .p-select {
      position: absolute;
      font-size: 12px;
      right: -10px;
      display: flex;
      cursor: pointer;
      margin-right: 20px;
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