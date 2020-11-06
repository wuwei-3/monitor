<template>
  <!-- 逻辑读 -->
  <div class="resourceplan">
    <div class="e-top">
      <div class="w100 r10">
        <a-selet4 :options="reportOption1"
                  @getOPtions="getOPtions1"
                  :title="'资源计划名称'"
                  :reportId="file.planName"></a-selet4>
      </div>
      <div class="r10 sys-add">
        <el-button type="primary"
                   class="el-icon-circle-plus-outline addBtn"
                   @click="addresourceplan">新增</el-button>
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
                 @update="updateTbl"
                 @deleteId="deleteIdTbl"
                 :selection="'1'"></n-table>
      </div>
    </div>
    <div v-if="visibleDel">
      <a-delete2 :visible="visibleDel"
                 :fileDel="fileDel"
                 @cancel="cancel"
                 :title="'删除资源计划'"
                 :content="'确定要删除资计划指令'"></a-delete2>
    </div>
    <div v-if="visible">
      <m-dialog :visible="visible"
                @cancel="cancelU"
                @comfirm="comfirmU"
                :update="updateRows"
                :file="file"></m-dialog>
    </div>
  </div>
</template>

<script>
import mDialog from './uDialog'
import aDelete2 from "@/components/adelete2";
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
import { queryPDBResourcePlanDirectives, enablePDBresourceplanPlan, disablePDBresourceplanPlan, queryPDBPlanName } from "@/api/sqlManager";
export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    aSelet1,
    aSelet4,
    aDelete2,
    mDialog
  },
  props: {},
  data () {
    return {
      fileDel: {},
      visibleDel: false,
      updateRows: {},
      visible: false,
      reportOption1: [],
      reportOption: [],
      // 统一表格样式
      column: [
        { label: "PLUGGABLE_DATABASE", prop: "PLUGGABLE_DATABASE" },
        { label: "SHARES", prop: "SHARES" },
        { label: "MEMORY_MIN", prop: "MEMORY_MIN" },
        { label: "MEMORY_LIMIT", prop: "MEMORY_LIMIT" },
        { label: "PARALLEL_SERVER_LIMIT", prop: "PARALLEL_SERVER_LIMIT" },
        { label: "UTILIZATION_LIMIT", prop: "UTILIZATION_LIMIT" },
        { label: "PLAN", prop: "PLAN" },
        { label: "操作", prop: "operaton7" },
      ],
      tableData: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        planName: '',
      },
      items: {
        pageNum: 1,
        pageSize: 50,
        version: 12
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 
    deleteIdTbl (val) {
      let row = {
        pluggableDB: val.PLUGGABLE_DATABASE,
        share: val.SHARES,
        utilizationLimit: val.UTILIZATION_LIMIT,
        memoryMin: val.MEMORY_MIN,
        memoryLimit: val.MEMORY_LIMIT,
        parallelServerLimit: val.PARALLEL_SERVER_LIMIT,
      }
      let par = {
        id: this.file.id,
        planName: this.file.planName,
        resourcePlanRows: JSON.stringify([row])
      }
      this.fileDel = par
      this.visibleDel = true
    },
    updateTbl (val) {
      let row = {
        pluggableDB: val.PLUGGABLE_DATABASE,
        share: val.SHARES,
        utilizationLimit: val.UTILIZATION_LIMIT,
        memoryMin: val.MEMORY_MIN,
        memoryLimit: val.MEMORY_LIMIT,
        parallelServerLimit: val.PARALLEL_SERVER_LIMIT,
      }
      let par = {
        id: this.file.id,
        planName: this.file.planName,
        resourcePlanRows: JSON.stringify([row])
      }
      this.updateRows = par
      this.visible = true
    },
    // 删除 
    delresourceplan () {

    },
    // 获取下拉框
    getSelect () {
      queryPDBPlanName({ id: this.file.id })
        .then(result => {
          if (result.data.length > 0) {
            this.reportOption1 = result.data || []
            this.file.planName = result.data[0].PLAN
            this.search()
          } else {
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
    // 获取主机列表
    getIps () {
      this.loading = true;
      ipList(this.items)
        .then(result => {
          if (result.data.length > 0) {
            this.reportOption = result.data || []
            this.file.id = result.data[0].oracleConfigId;
            this.ips = result.data[0];
            this.loading = false;
            this.getSelect();
          }
        })
        .catch(err => {
          this.loading = false;
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 
    getOPtions1 (val) {
      this.file.planName = val
      this.search()
    },
    // 
    cancelU (val) {
      if (val) {
        this.search()
      }
      this.visible = false
    },
    comfirmU (val) {
      if (val) {
        this.search()
      }
      this.visible = false
    },
    // 新增 
    addresourceplan () {
      this.visible = true
      this.updateRows = {}
    },
    cancel (val) {
      if (val) {
        this.search()
      }
      this.visibleDel = false
    },
    // 
    getOPtions (val) {
      this.file.id = val;
      this.detail = false;
      this.loading = true;
      this.file.planName = ''
      this.getSelect();
      this.reportOption.forEach(item => {
        if (item.oracleConfigId == val) {
          return (this.ips = item);
        }
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
      this.getMes(this.file);
    },
    getMes (val) {
      this.loading = true;
      let _self = this;
      queryPDBResourcePlanDirectives(val)
        .then(result => {
          this.tableData = result.data || []
          this.loading = false;
        })
        .catch(err => {
          this.tableData = []
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          this.loading = false;
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
.resourceplan {
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
    .addBtn {
      background: #24bd6f;
      border-color: #24bd6f;
    }
    .delBtn {
      background: #f56f61;
      border-color: #f56f61;
    }
    & .r10 {
      margin-right: 10px;
    }
    & .w100 {
      width: 130px;
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