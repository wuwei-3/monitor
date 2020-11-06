<template>
  <!-- 逻辑读 -->
  <div class="dblog">
    <div class="e-top">
      <div class="r10">显示行数</div>
      <div class="w100 r10">
        <el-input v-model="file.rowNumber"
                  placeholder="显示行数"
                  clearable></el-input>
      </div>
      <div>
        <el-button class="el-icon-download"
                   type="primary"
                   @click="downloadDb">下载</el-button>
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
      <div v-html="result">
      </div>
    </div>
  </div>
</template>

<script>
import aSelet4 from "@/components/mSelect4";
import aSelet from "@/components/mSelect3";
import aSelet1 from "@/components/aSelect";
import nTable from "@/components/nTable";
import dMessage from "@/components/dbHostMes";
import {
  queryBigFile,
  queryPdbName,
  ipList
} from "@/api/systemMes";
import { queryDBLog, downloadDBLog } from "@/api/sqlManager";
export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    aSelet1,
    aSelet4
  },
  props: {},
  data () {
    return {
      result: '',
      reportOption1: [],
      reportOption: [],
      // 统一表格样式
      column: [
        { label: "OWNER", prop: "OWNER" },
        { label: "TABLE_NAME", prop: "TABLE_NAME" },
        { label: "COLUMN_NAME", prop: "COLUMN_NAME" },
        { label: "SEGMENT_NAME", prop: "SEGMENT_NAME" },
        { label: "TABLESPACE_NAME", prop: "TABLESPACE_NAME" },
        { label: "LOB_SEGMENT_BYTES", prop: "LOB_SEGMENT_BYTES" },
        { label: "INDEX_NAME", prop: "INDEX_NAME" },
        { label: "IN_ROW", prop: "IN_ROW" },
      ],
      tableData: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        rowNumber: 100
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
    downloadDb () {
      if (!this.file.id) {
        return this.$message.error('请输入ip')
      }
      if (!this.file.rowNumber) {
        return this.$message.error('请输入行数')
      }
      this.loading = true
      downloadDBLog(this.file).then((result) => {
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
    getOPtions (val) {
      this.file.id = val;
      this.detail = false;
      this.loading = true;
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
      } else {
        this.search()
        this.loading = false
        this.dbStatus = false;
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
            this.loading = false
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
      if (!this.file.rowNumber) {
        return this.$message.error("请输入显示行数");
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
      queryDBLog(val)
        .then(result => {
          this.result = result.data || []
          this.loading = false;
        })
        .catch(err => {
          this.result = ''
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          this.loading = false;
        });
    }
  },
  mounted () {
    this.getIps();
  }
};
</script>
<style lang="scss">
.dblog {
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