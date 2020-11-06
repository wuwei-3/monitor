<template>
  <!-- 行迁移 -->
  <div class="gettablemes">
    <div class="e-top">
      <div class="w100 r10"
           v-if="dbStatus">
        <a-selet4 :options="reportOption1"
                  @getOPtions="getOPtions1"
                  :title="'数据库名'"
                  :reportId="file.dbName"></a-selet4>
      </div>
      <div class="w100 r10">
        <a-selet4 :options="Status"
                  @getOPtions="getOPtions2"
                  :title="'METHOD OPT'"
                  :reportId="file.methodOpt"></a-selet4>
      </div>
      <div class="w100 r10">
        <el-input :value="file.userName"
                  placeholder="请选择用户名"
                  clearable
                  @focus="userNameAwr"></el-input>
      </div>
      <div class="w100 r10">
        <el-input :value="file.tableName"
                  placeholder="请选择表名"
                  clearable
                  @focus="tableNameAwr"></el-input>
      </div>
      <div class="w100 r10">
        <el-input v-model="file.degree"
                  placeholder="DEGREE"
                  clearable></el-input>
      </div>
      <div class="w100 r10">
        <el-input v-model="file.estimatePercent"
                  placeholder="ESTIMATE PERCENT"
                  clearable></el-input>
      </div>
      <div>
        <el-button type="primary"
                   class="el-icon-search"
                   @click="search">收集</el-button>
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
        {{result}}
      </div>
    </div>
    <div v-if="Visible">
      <q-dialog @confirm="confirmAwr"
                :dialogVisible="Visible"
                @cancel="confirmAwr"
                :status="4"
                :title="sqlTitle"
                :awrId="file.id"
                :dbName="file.dbName"
                @getValue="getValue"
                :userName="file.userName">
      </q-dialog>
    </div>
  </div>
</template>

<script>
import aSelet4 from "@/components/mSelect4";
import aSelet from "@/components/mSelect3";
import nTable from "@/components/nTable";
import dMessage from "@/components/dbHostMes";
import {
  queryBigFile,
  queryPdbName,
  ipList
} from "@/api/systemMes";
import { collectTableStatistics } from "@/api/sqlMonitor";
import qDialog from "@/components/sqlDialog";
import { truncate } from 'fs';
export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    qDialog,
    aSelet4
  },
  props: {},
  data () {
    return {
      result: '',
      Status: [
        { NAME: '1' },
        { NAME: 'auto' },
        { NAME: 'repeat' },
        { NAME: 'Skwonly' }
      ],
      reportOption1: [],
      reportOption: [],
      Visible: false,
      sqlTitle: "用户名",
      // 统一表格样式
      column: [
        { label: "OWNER", prop: "OWNER" },
        { label: "PARTNAME", prop: "PARTNAME" },
        { label: "NUM_ROWS", prop: "NUM_ROWS" },
        { label: "BLOCKS", prop: "BLOCKS" },
        { label: "AVG_SPACE", prop: "AVG_SPACE" },
        { label: "CHAIN_CNT", prop: "CHAIN_CNT" },
        { label: "AVG_ROW_LEN", prop: "AVG_ROW_LEN" },
        { label: "SAMPLE_SIZE", prop: "SAMPLE_SIZE" },
        { label: "LAST_ANALYZED", prop: "LAST_ANALYZED" }
      ],
      tableData: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        dbName: "",
        tableName: "",
        userName: "",
        degree: '',
        estimatePercent: '',
        methodOpt: '',
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 
    getOPtions2 (val) {
      this.file.methodOpt = val
    },
    // 
    getOPtions1 (val) {
      this.file.dbName = val
      this.file.degree = ''
      this.file.estimatePercent = ''
      this.file.methodOpt = ''
      this.file.userName = ''
      this.file.tableName = ''
    },
    // 获取用户名 表名
    getValue (val, val2) {
      if (val2 == 1) {
        this.Visible = false;
        this.file.userName = val.USERNAME
      } else {
        this.Visible = false;
        this.file.tableName = val.OBJECT_NAME
      }
    },
    confirmAwr () {
      this.Visible = false;
    },
    //
    tableNameAwr () {
      if (!this.file.id) {
        return this.$message.warning("请先选择IP");
      }
      if (this.dbStatus) {
        if (!this.file.dbName) {
          return this.$message.error("请选择数据类型");
        }
      }
      if (!this.file.userName) {
        return this.$message.error("请选择用户名");
      }
      this.Visible = true;
      this.sqlTitle = "表名";
    },
    userNameAwr () {
      if (!this.file.id) {
        return this.$message.warning("请先选择IP");
      }
      if (this.dbStatus) {
        if (!this.file.dbName) {
          return this.$message.error("请选择数据类型");
        }
      }
      this.sqlTitle = "用户名";
      this.Visible = true;
    },
    // 获取下拉框
    getSelect () {
      queryPdbName({ id: this.file.id })
        .then(result => {
          if (result.data.length > 0) {
            this.reportOption1 = result.data || []
            this.file.dbName = result.data[0].NAME
            this.loading = false
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
      this.file.degree = ''
      this.file.estimatePercent = ''
      this.file.methodOpt = ''
      this.file.userName = ''
      this.file.tableName = ''
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
        this.loading = false
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
      if (!this.file.tableName) {
        return this.$message.error("请选择表名");
      }
      if (!this.file.userName) {
        return this.$message.error("请选择用户名");
      }
      if (!this.file.degree) {
        return this.$message.error("请选择	DEGREE");
      }
      // -----------------------------------------
      let num = Number(this.file.degree)
      if (this.$_.isNaN(num)) {
        return this.$message.warning('请输入数字')
      }
      this.file.degree = num
      if (!this.file.methodOpt) {
        return this.$message.error("请选择METHOD OPT");
      }
      if (!this.file.estimatePercent) {
        return this.$message.error("请选择ESTIMATE PERCENT");
      }
      // -----------------------------------------
      let num2 = Number(this.file.estimatePercent)
      if (this.$_.isNaN(num2)) {
        return this.$message.warning('请输入数字')
      }
      this.file.estimatePercent = num2
      this.getMes(this.file);

    },
    getMes (val) {
      this.loading = true;
      let _self = this;
      collectTableStatistics(val)
        .then(result => {
          this.result = result.data || []
          this.loading = false;
        })
        .catch(err => {
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          this.loading = false;
          this.result = ''
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
.gettablemes {
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
      width: 180px;
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