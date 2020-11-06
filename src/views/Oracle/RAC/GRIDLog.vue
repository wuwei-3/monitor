<template>
  <!-- 逻辑读 -->
  <div class="GRIDLog">
    <div class="e-top">
      <div class="r10">显示行数</div>
      <div class="r10 w100">
        <el-input v-model="file.rowNumber"
                  placeholder="请输入行数"></el-input>
      </div>
      <div class="w100">
        <el-button type="primary"
                   @click="downloadDg">下载</el-button>
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
      <div v-html="tableData">
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
import { queryGRIDLog } from "@/api/rac";
import aSelet1 from "@/components/aSelect";
import { formatDate } from '@/utils/date'
import { queryExecutionPlan, DGInspectionReport } from "@/api/common";
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
    return {
      sql: '',
      dialogVisible: false,
      reportOption1: [],
      reportOption: [],
      tableData: '',
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        rowNumber: 10,
      },
      instType: '',
      items: {
        pageNum: 1,
        pageSize: 50,
        dbType: 'RAC'
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
  methods: {
    // 新增
    downloadDg () {
      let par = {
        id: this.file.id,
        instType: this.instType
      }
      this.loading = true
      DGInspectionReport(par).then((result) => {
        this.loading = false
        this.$message.success('下载成功')
      }).catch((err) => {
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
      this.file.rowNumber = 10
      this.search()
      this.reportOption.forEach(item => {
        if (item.oracleConfigId == val) {
          this.instType = item.instType == '主库' ? 1 : 2
          return (this.ips = item);
        }
      });
    },
    // 获取主机列表
    getIps () {
      this.loading = true;
      let that = this
      ipList(this.items)
        .then(result => {
          if (result.data.length > 0) {
            let file = result.data[0]
            that.reportOption = result.data || []
            that.file.id = file.oracleConfigId;
            that.ips = file;
            that.instType = file.instType == '主库' ? 1 : 2
            that.search()
          } else {
            that.loading = false
          }
        })
        .catch(err => {
          that.instType = ''
          that.loading = false
          that.MyMessageHtml.error({
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
      let num = Number(this.file.rowNumber)
      if (this.$_.isNaN(num)) {
        return this.$message.warning('请输入数字')
      }
      this.getMes(this.file);
    },
    getMes (val) {
      this.loading = true;
      let _self = this;
      queryGRIDLog(val)
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
          this.tableData = ''
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
.GRIDLog {
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
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
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