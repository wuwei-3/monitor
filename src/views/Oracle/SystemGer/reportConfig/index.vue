<template>
  <!-- 系统管理 告警项配置 -->
  <div class="r-report">
    <!-- 表头 -->
    <div class="m-btn">
      <!-- but1 -->
      <div>监控项ID</div>
      <div>
        <a-select :options="reportOption"
                  @getOPtions="getOPtions"
                  :title="'监控项ID'"
                  :reportId="''"></a-select>
      </div>
      <!-- 阈值状态 -->
      <div class="f20">
        <a-selet @aSelect="aStatus"
                 :aSelect="Status"></a-selet>
      </div>
      <!-- 调度规则状态 -->
      <div class="f20">
        <a-selet @aSelect="aRemail"
                 :aSelect="Remail"></a-selet>
      </div>
      <!-- but1 -->
      <div class="sys-add">
        <el-button class="el-icon-circle-plus-outline"
                   @click="aSOperat(1)"
                   plain>新增</el-button>
      </div>
      <div class="sys-del">
        <el-button class="el-icon-remove-outline"
                   @click="aSOperat(2)"
                   plain>删除</el-button>
      </div>
    </div>
    <!-- 表信息 -->
    <div class="s-table"
         v-loading="loading">
      <n-table :column="column"
               :tableData="tableData"
               @delectSuc="delectSuc"
               @deleteId="deleteId"
               @update="updateRow"
               :status="7"></n-table>
    </div>
    <!-- 分页 -->
    <div class="m-page">
      <m-page ref="updatePage"
              @pageSie="pageSie"
              @pageNumber="pageNumber"></m-page>
    </div>
    <!-- 去除位置占用  wathch 监听失效 使用mountd 获取-->
    <div v-if="visible">
      <m-dialog :visible="visible"
                @cancel="cancel"
                @comfirm="comfirm"
                :update="updateRows"
                :reportOption="reportOption"></m-dialog>
    </div>
    <div v-if="delVisable">
      <a-delete :visible="delVisable"
                @cancel="cancelDel"
                :deleteIds="deleteIds"
                :status="7"
                :title="'删除告警'"
                :content="delName.length  == tableData.length?'确定要删除全部告警项配置？':'确当要删除告警项配置？'"></a-delete>
    </div>
  </div>
</template>

<script>
import aSelect from "@/components/mSelect";
import nTable from "@/components/nTable";
import mPage from "@/components/mPage";
import aSelet from "@/components/aSelect";
import { warnItems, monitorPage } from "@/api/Oracle.js";
import mDialog from "./rDialog";
import aDelete from "@/components/adelete";
export default {
  components: {
    nTable,
    mPage,
    aSelet,
    mDialog,
    aDelete,
    aSelect
  },
  props: {},
  data () {
    return {
      delName: [],
      // 修改
      updateRows: {},
      deleteIds: "",
      //下拉框组件刷新
      selectStaus: true,
      delVisable: false,
      // visible
      visible: false,
      //
      Status: {
        // 下拉框宽度
        width: "width:100px",
        // 是否支持清除
        cleear: true,
        holder: "阈值",
        // 下拉框内容
        items: [
          {
            id: 1,
            name: "是"
          },
          {
            id: 2,
            name: "否"
          }
        ]
      },
      // 邮件接受状态
      Remail: {
        // 下拉框宽度
        width: "width:100px",
        // 是否支持清除
        cleear: true,
        holder: "调度规则",
        // 下拉框内容
        items: [
          {
            id: 1,
            name: "是"
          },
          {
            id: 2,
            name: "否"
          }
        ]
      },
      loading: false,
      // 统一表格样式
      column: [
        { label: "监控项编码", prop: "code" },
        { label: "监控项名称", prop: "name" },
        { label: "监控项类型", prop: "type" },
        { label: "阈值", prop: "isMetric", switch: true },
        { label: "调度规则", prop: "isTriggerRule", switch: true },
        { label: "执行命令", prop: "command" },
        { label: "操作", prop: "operaton", type: 1 } //普通 操作 修改删除
      ],
      detail: false,
      pageNum: 1,
      pageSize: 15,
      reportOption: [],
      Role: {
        monitorItemId: "",
        isMetric: "",
        isTriggerRule: "",
        command: ""
      },
      tableData: [],
      total: 0, //总页数
      current: 1 //当前页
    };
  },
  watch: {
    Role: {
      handler: function () {
        this.deleteIds = "";
        this.pageNum = 1;
        this.getRolelist();
      },
      deep: true
    }
  },
  computed: {
    mIndex: function () {
      return this.$store.getters.getMIndex
    },
  },
  methods: {
    //
    getOPtions (val) {
      this.Role.monitorItemId = val;
    },
    // 获取监控项id
    getMonitorId () {
      // 菜单树 类型
      let type = ""
      if (this.mIndex == 0) {
        type = 'Oracle'
      } else if (this.mIndex == 1) {
        type = 'MySQL'
      } else {
        type = 'MariaDB'
      }
      let par = {
        pageSize: 15,
        pageNum: 1,
        type: type
      };
      monitorPage(par)
        .then(result => {
          if (result.data) {
            this.reportOption = result.data.items;
          }
        })
        .catch(err => {
          this.$message.success(err.msg);
        });
    },
    // 修改当前条
    updateRow (val) {
      this.updateRows = val;
      this.visible = true;
    },
    deleteId (val, val2) {
      this.delName = val.split(',')
      if (val2) {
        this.delVisable = true;
      }
      this.deleteIds = val;
    },
    // 取消全部删除
    cancelDel (val) {
      this.delVisable = false;
      this.selectStaus = true;
      if (val) {
        this.getRolelist();
      }
    },
    // 告警模块
    aStatus (val) {
      if (val == 2) {
        return (this.Role.isMetric = 0);
      }
      this.Role.isMetric = val;
    },
    // 邮件转态
    aRemail (val) {
      if (val == 2) {
        return (this.Role.isTriggerRule = 0);
      }
      this.Role.isTriggerRule = val;
    },
    // 删除成功
    delectSuc () {
      this.getRolelist();
    },
    // 添加
    comfirm (val) {
      this.visible = false;
      this.getRolelist();
      this.selectStaus = true;
      this.updateRows = {};
    },
    // 分页
    pageSie (val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getRolelist();
    },
    pageNumber (val) {
      this.pageNum = val;
      this.getRolelist();
    },
    // 取消弹窗
    cancel () {
      this.visible = false;
      this.selectStaus = true;
    },
    // 弹窗
    aSOperat (val) {
      this.updateRows = {};
      this.selectStaus = false;
      if (val == 1) {
        this.visible = true;
      } else if (val == 2) {
        if (!this.deleteIds) {
          return this.$message.error("请选择要删除内容");
        }
        this.delVisable = true;
      }
    },
    // 用户list
    getRolelist () {
      this.deleteIds = "";
      let that = this;
      that.loading = true;
      let par = {
        ...that.Role,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      warnItems(par)
        .then(result => {
          let data = result.data || []
          that.tableData = data.items;
          that.$refs.updatePage.update(data.total, data.pageNum, data.pageSize);
          that.loading = false;
        })
        .catch(err => {
          that.loading = false;
          that.$message.error(err.msg);
        });
    }
  },
  created () { },
  mounted () {
    this.getRolelist();
    this.getMonitorId();
  }
};
</script>
<style lang="scss">
.r-report {
  width: 100%;
  height: 100%;
  background-color: #f5f6fa;
  border: solid 1px #d3d4d8;
  padding: 10px;
  .m-btn {
    display: flex;
    height: 40px;
    line-height: 40px;
    .sys-add {
      .el-button {
        background: #24bd6f;
        color: #fff;
      }
    }
    .sys-del {
      .el-button {
        background: #f56f61;
        color: #fff;
      }
    }
    div {
      margin-right: 5px;
      font-size: 12px;
    }
    .f-oper {
      .ant-select-selection--single {
        background: #24bd6f;
        .ant-select-selection__placeholder,
        .ant-select-selection-selected-value {
          color: #fbfbfb;
        }
        .ant-select-arrow svg {
          color: #fbfbfb;
        }
      }
    }
    .el-button {
      padding: 8px 14px;
      border-radius: 0px;
    }
    .el-input__inner {
      width: 120px;
      height: 32px;
      line-height: 32px;
    }
    .n-select {
      margin-left: auto;
      position: relative;
      .e-san {
        width: 0px;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 9px solid #d2d6d8;
        position: absolute;
        top: 41px;
        right: -11px;
        z-index: 1;
      }
      .iconzuoyouduiqi {
        position: absolute;
        font-size: 28px;
        right: -10px;
        cursor: pointer;
      }
      .t-details {
        width: 360px;
        height: 249px;
        background-color: #ffffff;
        border: solid 1px #d2d6d8;
        position: absolute;
        z-index: 10;
        right: -30px;
        padding: 10px;
        overflow: auto;
        .s-span {
          height: 22.5px;
          line-height: 23px;
        }
      }
    }
  }
  .s-table {
    height: calc(100% - 80px);
    overflow: auto;
  }
  .m-page {
    height: 50px;
    text-align: right;
    display: flex;
    align-items: center;
  }
}
</style>