<template>
  <!-- 逻辑读 -->
  <div class="awr">
    <div class="e-top">
      <div class="w100 r10">
        <el-input :value="file.beginSnapshot"
                  placeholder="请选择开始快照"
                  clearable
                  @focus="startAwr"></el-input>
      </div>
      <div class="w100 r10">
        <el-input :value="file.endSnapshot"
                  placeholder="请选择结束快照"
                  clearable
                  @focus="endAwr"></el-input>
      </div>
      <div class="r10">
        <el-button type="primary"
                   class="el-icon-share"
                   @click="createAwr">生成报告</el-button>
      </div>
      <div class="r10">
        <el-button type="primary"
                   @click="create">
          <i class="el-icon-loading"
             v-show="crAwr"></i>
          创建快照</el-button>
      </div>
      <div>
        <el-button type="primary"
                   @click="downloadAwr">
          下载</el-button>
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
      <div class="t-noDate"
           v-show="!result">
        暂无数据
      </div>
      <div v-html="result"></div>
    </div>
    <div v-if="Visible">
      <q-dialog @confirm="confirmAwr"
                :dialogVisible="Visible"
                @cancel="cancelAwr"
                :status="3"
                :title="sqlTitle"
                :awrId="file.id"
                @snapid="snapid">
      </q-dialog>
    </div>
  </div>

</template>

<script>
import aSelet from "@/components/mSelect3";
import nTable from "@/components/nTable";
import dMessage from "@/components/dbHostMes";
import {
  queryBigFile,
  queryPdbName,
  ipList
} from "@/api/systemMes";
import {
  LogicalReads,
  createAwr,
  clearSnapshot,
  createSnapshot,
  downloadAwrReport
} from "@/api/sqlMonitor";
import qDialog from "@/components/sqlDialog";
export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    qDialog
  },
  props: {},
  data () {
    return {
      reportOption: [],
      crAwr: false,
      result: "",
      // 统一表格样式
      column: [
        { label: "SQL_ID", prop: "SQL_ID" },
        { label: "BUFFER_GETS", prop: "BUFFER_GETS", width: "40" },
        { label: "EXECUTIONS", prop: "EXECUTIONS", width: "40" },
        { label: "SQL TEXT", prop: "SQL_TEXT", width: "300" },
        { label: "执行计划", prop: "operaton1", width: "50", type: 1 }
      ],
      sqlTitle: "选择开始快照",
      Visible: false,
      tableData: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        endSnapshot: "",
        beginSnapshot: ""
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
      // ip信息
      dbName: {
        // 下拉框宽度
        width: "width:100px",
        // 是否支持清除
        cleear: true,
        holder: "数据库名",
        // 下拉框内容
        items: []
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 下载 
    downloadAwr () {
      if (!this.file.beginSnapshot) {
        return this.$message.error("请选择开始快照");
      }
      if (!this.file.endSnapshot) {
        return this.$message.error("请选择结束快照");
      }
      this.loading = true
      downloadAwrReport(this.file)
        .then(result => {
          this.loading = false
          this.result = result.data || ''
          this.$message.success('下载成功');
        })
        .catch(err => {
          this.loading = false
          this.result = ''
          this.$message.error('下载失败');
        });
    },
    // 开始快照
    snapid (val, val2) {
      this.Visible = false;
      if (val2) {
        this.file.beginSnapshot = val.SNAPID;
      } else {
        this.file.endSnapshot = val.SNAPID;
      }
      if (this.file.endSnapshot) {
        let start = Number(this.file.beginSnapshot);
        let end = Number(this.file.endSnapshot);
        if (end < start) {
          this.file.endSnapshot = "";
          return this.$message.error("结束快照必须大于开始快照");
        }
      }
    },
    //   弹窗
    confirmAwr () {
      this.Visible = false;
    },
    cancelAwr () {
      this.Visible = false;
    },
    //   快照选择
    endAwr () {
      if (!this.file.id) {
        return this.$message.error("请选择IP");
      }
      this.sqlTitle = "选择结束快照";
      this.Visible = true;
    },
    startAwr () {
      if (!this.file.id) {
        return this.$message.error("请选择IP");
      }
      this.sqlTitle = "选择开始快照";
      this.Visible = true;
    },
    // 快照内容
    createAwr () {
      if (!this.file.beginSnapshot) {
        return this.$message.error("请选择开始快照");
      }
      if (!this.file.endSnapshot) {
        return this.$message.error("请选择结束快照");
      }
      this.loading = true
      createAwr(this.file)
        .then(result => {
          this.loading = false
          this.result = result.data || []
        })
        .catch(err => {
          this.loading = false
          this.result = ''
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 创建快照
    create () {
      if (!this.file.id) {
        return this.$message.error("请选择IP");
      }
      this.crAwr = true;
      createSnapshot({ id: this.file.id })
        .then(result => {
          this.$message.success(result.msg);
          this.crAwr = false;
        })
        .catch(err => {
          this.crAwr = false;
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 获取下拉框
    getSelect () {
      queryPdbName({ id: this.file.id })
        .then(result => {
          this.dbName.items = result.data || []

        })
        .catch(err => {
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 下拉框
    getOPtions (val) {
      this.file.endSnapshot = ""
      this.file.beginSnapshot = ""
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
        this.dbStatus = false;
      }
    },
    getName (val) {
      this.file.dbName = val;
    },
    // 获取主机列表
    getIps () {
      ipList(this.items)
        .then(result => {
          if (result.data.length > 0) {
            this.reportOption = result.data || []
            this.file.id = result.data[0].oracleConfigId;
            this.ips = result.data[0];
            this.showDbStatus(this.ips.version);
            this.file.endSnapshot = ""
            this.file.beginSnapshot = ""
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
  },
  created () { },
  mounted () {
    this.getIps();
  }
};
</script>
<style lang="scss">
.awr {
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
      width: 150px;
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