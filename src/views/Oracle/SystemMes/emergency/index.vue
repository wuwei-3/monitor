<template>
  <!-- 逻辑读 -->
  <div class="filesize1">
    <div class="e-top">
      <!--告警项  -->
      <div class="w100 r10">
        <el-select v-model="file.warnItemId"
                   placeholder="告警项"
                   size="small"
                   clearable>
          <el-option v-for="item in optionsReport"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </div>
      <!--告警级别  -->
      <div class="w50 r10">
        <el-select v-model="file.warnLevelId"
                   placeholder="告警级别"
                   size="small"
                   clearable>
          <el-option v-for="item in warnLevels"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </div>
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
      <div class="sys-del r10">
        <el-button class="el-icon-remove-outline"
                   @click="deleteMon"
                   plain>批量删除</el-button>
      </div>
      <div class="sys-del r10">
        <el-button class="el-icon-remove-outline"
                   @click="deleteAll"
                   plain>全部删除</el-button>
      </div>
      <!-- but1 -->
      <div class="sys-add">
        <el-button class="el-icon-circle-plus-outline"
                   @click="searchAll"
                   plain>查询</el-button>
      </div>
      <div class="p-select">
        <a-selet :options="reportOption"
                 @getOPtions="getOPtions"
                 :title="'IP地址'"
                 :reportId="file.hostId"></a-selet>
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
      <n-table :column="column"
               :tableData="tableData"
               @deleteId="deleteId"></n-table>
    </div>
    <!-- 分页 -->
    <div class="m-page">
      <m-page ref="updatePage"
              @pageSie="pageSie"
              @pageNumber="pageNumber"></m-page>
    </div>
    <div v-if="delVisable">
      <a-delete :visible="delVisable"
                @cancel="cancelDel"
                :deleteIds="deleteIds"
                :status="20"
                :title="'删除告警信息'"
                :content="delName.length  == tableData.length?'确定要删除全部告警信息？':'确当要删除告警信息？'"></a-delete>
    </div>
  </div>
</template>

<script>
import aTime from "@/components/Time";
import aSelet4 from "@/components/mSelect4";
import qDialog from "@/components/sqlDialog2";
import aSelet from "@/components/mSelect8";
import nTable from "@/components/nTable";
import dMessage from "@/components/dbHostMes";
import mPage from "@/components/mPage";
import aDelete from "@/components/adelete";
import {
  queryPdbName,
  ipList,
  warnInfoPage
} from "@/api/systemMes";
import { queryExecutionPlan } from "@/api/common";
import { queryArchiveSize, warnInfoDel, warnInfoDelAll } from "@/api/DBPolling";
import aSelet1 from "@/components/aSelect";
import { formatDate } from '@/utils/date'
import { warnItems, monitorPage, warnList1 } from "@/api/Oracle.js";
export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    aSelet1,
    qDialog,
    aSelet4,
    aTime,
    mPage,
    aDelete
  },
  props: {},
  data () {
    //  moren
    const start = new Date();
    let beginTime = start.setTime(start.getTime() - 3600 * 1000 * 10);
    return {
      delName: [],
      deleteIds: '',
      delVisable: false,
      warnLevels: [],
      optionsReport: [],
      options: [],
      value: '',
      sql: '',
      dialogVisible: false,
      reportOption: [],
      // 统一表格样式
      column: [
        { label: "告警主机IP", prop: "ip", width: 10 },
        { label: "告警时间", prop: "time", width: 10 },
        { label: "告警项", prop: "itemName", width: 10 },
        { label: "告警级别", prop: "levelName", width: 10 },
        { label: "告警信息", prop: "info", width: 10 },
        { label: "告警描述", prop: "descr", width: 20 },
        { label: "意见建议", prop: "suggest", width: 20 },
        { label: "操作", prop: "operaton", type: 4, width: 10 } //只要删除

      ],
      tableData: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        hostId: "",
        pageNum: 1,
        pageSize: 15,
        beginTime: '',
        endTime: '',
        warnItemId: '',
        warnLevelId: '',
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
    };
  },
  watch: {
    'file.warnItemId': {
      handler (val, val2) {
        this.search()
      },
      deep: true
    },
    'file.warnLevelId': {
      handler (val, val2) {
        this.search()
      },
      deep: true
    }
  },
  methods: {
    // 批量删除
    deleteMon () {
      if (this.deleteIds) {
        this.delVisable = true
      } else {
        return this.$message.error('请选择要删除记录')
      }
    },
    // cancelDel
    cancelDel (val) {
      this.delVisable = false
      if (val) {
        this.search()
      }
    },
    // 删除
    deleteId (val, val2, val3) {
      this.delName = val.split(',')
      this.deleteIds = val
      if (val2) {
        this.delVisable = true
      }
    },
    searchAll () {
      this.search()
    },
    // 删除全部
    deleteAll () {
      let num = this.tableData.length
      if (num == 0) {
        return this.$message.error("当前列表为空");
      }
      this.delName = num
      this.deleteIds = ''
      this.delVisable = true
    },
    // 分页
    pageSie (val) {
      this.file.pageNum = 1;
      this.file.pageSize = val;
      this.search();
    },
    pageNumber (val) {
      this.file.pageNum = val;
      this.search();
    },
    // 用户list
    getRolelist () {
      let par = {
        pageNum: 1,
        pageSize: 50
      };
      warnItems(par)
        .then(result => {
          this.optionsReport = result.data.items || []
        })
        .catch(err => {
          this.optionsReport = []
          that.$message.error(err.msg);
        });
      // 告警级别
      warnList1(par)
        .then(result => {
          this.warnLevels = result.data || []
        })
        .catch(err => {
          this.warnLevels = []
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 获取事件
    getBTime (val) {
      this.file.beginTime = val || ''
    },
    getETime (val) {
      this.file.endTime = val || ''
    },
    // 下拉框
    getOPtions (val) {
      // 清空条件
      this.deleteIds = ''
      this.file.hostId = val
      this.file.warnItemId = ''
      this.file.warnLevelId = ''
      this.detail = false;
      this.tableData = []
      this.file.pageNum = 1
      this.file.pageSize = 15
      this.file.beginTime = ''
      this.file.endTime = ''
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
            this.file.hostId = result.data[0].hostId;
            this.ips = result.data[0];
            this.loading = false
            this.search();
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
        if (this.file.hostId) {
          this.detail = true
        } else {
          return this.$message.warning("请先选择IP");
        }
      } else {
        this.detail = false
      }
    },
    search () {
      if (!this.file.hostId) {
        return this.$message.error("请选择IP");
      }
      if (this.file.endTime || this.file.beginTime) {
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
      }
      this.getMes(this.file);
    },
    getMes (val) {
      this.deleteIds = ''
      this.loading = true;
      let _self = this;
      warnInfoPage(val)
        .then(result => {
          this.tableData = result.data.items || []
          this.$refs.updatePage.update(result.data.total, result.data.pageNum, result.data.pageSize);
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
    this.getRolelist()
    this.getIps();
  }
};
</script>
<style lang="scss">
.filesize1 {
  height: 100%;
  width: 100%;
  .e-top {
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 10px;
    background: #f5f6fa;
    .sys-del {
      .el-button {
        background: #f56f61;
        color: #fff;
        padding: 8px 10px;
      }
    }
    .sys-add {
      .el-button {
        background: #24bd6f;
        color: #fff;
        padding: 8px 10px;
      }
    }
    & .r10 {
      margin-right: 10px;
    }
    & .w100 {
      width: 150px;
    }
    & .w50 {
      width: 100px;
    }
    .el-button {
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
    height: calc(100% - 85px);
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
  .m-page {
    height: 50px;
    text-align: right;
    display: flex;
    align-items: center;
  }
}
</style>