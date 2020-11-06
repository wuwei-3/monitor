<template>
  <!-- 逻辑读 -->
  <div class="nouserindex">
    <div class="e-top">
      <div class="w100 r10"
           v-if="dbStatus">
        <a-selet4 :options="reportOption1"
                  @getOPtions="getOPtions1"
                  :title="'数据库名'"
                  :reportId="file.dbName"></a-selet4>
      </div>
      <div class="r10">
        <a-time @getTime="getTime"
                :time='file.beginTime'></a-time>
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
                 @cancel='monitorIndex'
                 :selection="'1'"></n-table>
      </div>
    </div>
    <div v-if="visibleDel">
      <a-delete2 :visible="visibleDel"
                 :title="'监控索引'"
                 :content="'是否监控索引'"
                 @cancel='cancelDel'
                 :fileDel="fileDel"></a-delete2>
    </div>
  </div>
</template>

<script>
import aDelete2 from "@/components/adelete2";
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
import { UnmonitoredIndex, monitorIndex } from "@/api/sqlManager";
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
    aTime,
    aDelete2
  },
  props: {},
  data () {
    return {
      fileDel: {},
      visibleDel: false,
      sql: '',
      dialogVisible: false,
      reportOption1: [],
      reportOption: [],
      // 统一表格样式
      column: [
        { label: "OWNER", prop: "OWNER" },
        { label: "INDEX_NAME", prop: "INDEX_NAME" },
        { label: "操作", prop: "operaton4", type: 1 }
      ],
      tableData: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        dbName: "orcl",
        beginTime: new Date(),
      },
      items: {
        pageNum: 1,
        pageSize: 50,
        version: 12
      },
    };
  },
  computed: {},
  methods: {
    // val
    cancelDel (val) {
      if (val) {
        this.search()
      }
      this.visibleDel = false
    },
    // 监控索引
    monitorIndex (val) {
      let par = {
        id: this.file.id,
        dbName: this.file.dbName,
        owner: val.OWNER,
        indexName: val.INDEX_NAME,
      }
      this.fileDel = par
      this.visibleDel = true
    },
    // 获取事件
    getTime (val) {
      this.file.beginTime = val
      this.search()
    },
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
            this.file.beginTime = new Date()
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
      this.loading = true;
      this.file.beginTime = new Date()
      this.reportOption.forEach(item => {
        if (item.oracleConfigId == val) {
          this.file.rowNumber = 10
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
        this.search()
        this.loading = false
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
      if (!this.file.beginTime) {
        return this.$message.error("请选择时间");
      }
      if (this.dbStatus) {
        if (!this.file.dbName) {
          return this.$message.error("请选择数据库名");
        }
      }
      let time = new Date(this.file.beginTime)
      this.file.beginTime = formatDate(time, 'yyyy-MM-dd hh:mm:ss')
      this.getMes(this.file);
    },
    getMes (val) {
      this.loading = true;
      let _self = this;
      UnmonitoredIndex(val)
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
.nouserindex {
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