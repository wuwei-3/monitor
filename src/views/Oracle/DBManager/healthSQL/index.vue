<template>
  <!-- 逻辑读 -->
  <div class="healthsql">
    <div class="e-top">
      <div class="w100 r10"
           v-if="dbStatus">
        <a-selet4 :options="reportOption1"
                  @getOPtions="getOPtions1"
                  :title="'数据库名'"
                  :reportId="file.dbName"></a-selet4>
      </div>
      <div class="w100 r10">
        <a-selet5 :options="reportOption2"
                  @getOPtions="getOPtions2"
                  :title="'LICENCE'"
                  :reportId="file.licenseType"></a-selet5>
      </div>
      <div class="r10">SQLID</div>
      <div class="w100 r10">
        <el-input v-model="file.sqlId"
                  placeholder="请输入SQLID"
                  clearable></el-input>
      </div>
      <div class="r10">
        <el-button type="primary"
                   class="el-icon-search"
                   @click="search">查询</el-button>
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
                 :selection="'1'"
                 @downloadSQL="downloadSQL"></n-table>
      </div>
    </div>
    <div v-if="dialogVisible">
      <q-dialog @confirm="confirm"
                :dialogVisible="dialogVisible"
                :sql="sql"
                @cancel="confirm">
      </q-dialog>
    </div>
  </div>
</template>

<script>
import aSelet5 from "@/components/mSelect5";
import aSelet4 from "@/components/mSelect4";
import qDialog from "@/components/sqlDialog2";
import aSelet from "@/components/mSelect3";
import nTable from "@/components/nTable";
import dMessage from "@/components/dbHostMes";
import {
  queryBigFile,
  queryPdbName,
  ipList
} from "@/api/systemMes";
import { LogicalReads, downloadExecution } from "@/api/sqlMonitor";
import { queryExecutionPlan } from "@/api/common";
import { querySQLHealthExamination } from "@/api/sqlManager";
import aSelet1 from "@/components/aSelect";
export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    aSelet1,
    qDialog,
    aSelet4,
    aSelet5
  },
  props: {},
  data () {
    return {
      reportOption2: [
        {
          name: 'Tuning',
          type: 'T',
        },
        {
          name: 'Diagnostics',
          type: 'D',
        },
        {
          name: 'None',
          type: 'N',
        },
      ],
      sql: '',
      dialogVisible: false,
      reportOption1: [],
      reportOption: [],
      tableData: [],
      // 统一表格样式
      column: [
        { label: "SQL_ID", prop: "SQL_ID" },
        { label: "LOCAL_HOST", prop: "LOCAL_HOST" },
        { label: "FILE_PATH", prop: "FILE_PATH" },
        { label: "操作", prop: "operaton10" }
      ],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        dbName: "orcl",
        licenseType: 'T',
        sqlId: null
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
    };
  },
  computed: {},
  methods: {
    // 下载文件 
    downloadSQL (val) {
      try {
        let par = 'http://' + val.LOCAL_HOST + ':8000' + val.FILE_PATH
        window.location.href = par
        this.$message.success('下载成功')
      } catch (e) {
        this.$message.error('下载失败')
      }
    },
    getOPtions2 (val) {
      this.file.licenseType = val
    },
    getOPtions1 (val) {
      this.file.dbName = val
    },
    // 
    confirm () {
      this.dialogVisible = false
    },
    // 获取下拉框
    getSelect () {
      queryPdbName({ id: this.file.id })
        .then(result => {
          if (result.data.length > 0) {
            this.reportOption1 = result.data || []
            this.file.dbName = result.data[0].NAME
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
      this.loading = true;
      this.file.licenseType = 'T'
      this.file.sqlId = ''
      this.reportOption.forEach(item => {
        if (item.oracleConfigId == val) {
          this.file.sqlId = null
          this.showDbStatus(item.version);
          return (this.ips = item);
        }
      });
    },
    showDbStatus (val) {
      let version = Number(val);
      this.loading = false
      if (version > 11) {
        this.dbStatus = true;
        this.getSelect();
      } else {
        this.file.dbName = ''
        this.dbStatus = false;
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
      if (!this.file.sqlId) {
        return this.$message.error("请输入SQLID");
      }
      if (!this.file.licenseType) {
        return this.$message.error("请输入license类型");
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
      querySQLHealthExamination(val)
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
.healthsql {
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
      width: 120px;
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