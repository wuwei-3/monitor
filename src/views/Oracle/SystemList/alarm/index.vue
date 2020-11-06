<template>
  <!-- 系统管理 告警信息配置 -->
  <div class="alarm-cf">
    <!-- 表头 -->
    <div class="m-btn">
      <!-- table1 -->
      <!-- <div>告警信息</div>
      <div>
        <el-input v-model="User.info"
                  clearable></el-input>
      </div>
      <div>告警描述</div>
      <div>
        <el-input v-model="User.describe"
                  clearable></el-input>
      </div> -->
      <div class="f20">
        <el-select v-model="User.warnItemId"
                   placeholder="告警项"
                   :popper-append-to-body="false"
                   clearable>
          <el-option v-for="opt in warnItems"
                     :key="opt.id"
                     :label="opt.name"
                     :value="opt.id">
          </el-option>
        </el-select>
      </div>
      <!--链路状态  -->
      <div class="f20">
        <a-selet @aSelect="linkaStatu"
                 :aSelect="LinkStatus"></a-selet>
      </div>
      <!--链路状态  -->
      <div class="f20">
        <a-selet @aSelect="mailaStatu"
                 :aSelect="mailStatus"></a-selet>
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
               :status="1"></n-table>
    </div>
    <!-- 分页 -->
    <!-- <div class="m-page">
      <m-page ref="updatePage"
              @pageSie="pageSie"
              @pageNumber="pageNumber"></m-page>
    </div> -->
    <!-- 去除位置占用  wathch 监听失效 使用mountd 获取-->
    <div v-if="visible">
      <m-dialog :visible="visible"
                @cancel="cancel"
                @comfirm="comfirm"
                :update="updateRows"
                :warnItems="warnItems"
                :warnLevels="warnLevels"
                :triggerRules="triggerRules"></m-dialog>
    </div>
    <div v-if="delVisable">
      <a-delete :visible="delVisable"
                @cancel="cancelDel"
                :deleteIds="deleteIds"
                :status="16"
                :title="'删除系统配置'"
                :content="delName.length  == tableData.length?'确定要删除全部系统配置？':'确当要删除系统配置？'"></a-delete>
    </div>
  </div>
</template>

<script>
import nTable from "@/components/nTable";
import mPage from "@/components/mPage";
import aSelet from "@/components/aSelect";
import { warnList } from "@/api/systemGer.js";
import mDialog from "./uDialog";
import {
  userList,
  save,
  roleList,
  warnItems,
  warnList1,
  triggerList
} from "@/api/Oracle.js";
import aDelete from "@/components/adelete";
export default {
  components: {
    nTable,
    mPage,
    aSelet,
    mDialog,
    aDelete
  },
  data () {
    return {
      // 主机类型
      LinkStatus: {
        // 下拉框宽度
        width: "width:100px",
        // 是否支持清除
        cleear: true,
        holder: "告警状态",
        // 下拉框内容
        items: [
          {
            id: 1,
            name: "启用"
          },
          {
            id: 2,
            name: "禁用"
          }
        ]
      },
      // 主机类型
      mailStatus: {
        // 下拉框宽度
        width: "width:100px",
        // 是否支持清除
        cleear: true,
        holder: "邮件状态",
        // 下拉框内容
        items: [
          {
            id: 1,
            name: "启用"
          },
          {
            id: 2,
            name: "禁用"
          }
        ]
      },
      delName: [],
      // 修改
      updateRows: {},
      deleteIds: "",
      //下拉框组件刷新
      selectStaus: true,
      delVisable: false,
      // visible
      visible: false,
      loading: false,
      // 统一表格样式
      column: [
        { label: "告警项", prop: "itemName", width: 10 },
        { label: "告警级别", prop: "levelName", width: 10 },
        { label: "调度规则", prop: "ruleName", width: 10 },
        { label: "告警状态", prop: "status", switch: true, width: 8 },
        { label: "发送邮件", prop: "isSendMail", switch: true, width: 8 },
        { label: "阈值", prop: "metric", width: 5 },
        { label: "邮件频率", prop: "sendMailFreq", width: 8 },
        { label: "告警信息", prop: "info", width: 20 },
        { label: "告警描述", prop: "describe", width: 20 },
        { label: "告警建议", prop: "suggest", width: 20 },
        { label: "操作", prop: "operaton", type: 1, width: 10 } //普通 操作 修改删除
      ],
      detail: false,
      pageNum: 1,
      pageSize: 15,
      User: {
        info: "", //统一输入框
        describe: "", //统一输入框
        suggest: "",
        status: '',
        isSendMail: '',
        warnItemId: '',
      },
      tableData: [],
      total: 0, //总页数
      current: 1, //当前页
      warnItems: [],
      warnLevels: [],
      triggerRules: [],
    };
  },
  computed: {
  },
  watch: {
    User: {
      handler: function () {
        // 模糊搜索 分页还原第一页
        this.deleteIds = "";
        this.pageNum = 1;
        this.getUserlist();
      },
      deep: true
    }
  },
  methods: {
    // 链路状态
    linkaStatu (val) {
      if (val == 2) {
        return (this.User.status = 0);
      }
      this.User.status = val
    },
    // 链路状态
    mailaStatu (val) {
      if (val == 2) {
        return (this.User.isSendMail = 0);
      }
      this.User.isSendMail = val
    },
    // 下拉框列表
    getRolelist () {
      let par = {
        pageNum: 1,
        pageSize: 15
      };
      // 告警项
      warnItems(par)
        .then(result => {
          this.warnItems = result.data.items;
        })
        .catch(err => {
          this.warnItems = []
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
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
      // 调度规则
      triggerList()
        .then(result => {
          this.triggerRules = result.data || []
        })
        .catch(err => {
          this.triggerRules = []
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 修改当前条
    updateRow (val) {
      this.updateRows = val;
      this.visible = true;
    },
    deleteId (val, val2) {
      this.delName = val.split(',')
      this.deleteIds = val;
      if (val2) {
        this.delVisable = true;
      }
    },
    // 取消全部删除
    cancelDel (val) {
      this.delVisable = false;
      this.selectStaus = true;
      if (val) {
        this.getUserlist();
      }
    },
    // 删除成功
    delectSuc () {
      this.getUserlist();
    },
    // 添加
    comfirm (val) {
      this.visible = false;
      this.getUserlist();
      this.selectStaus = true;
      this.updateRows = {};
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
    // 分页
    pageSie (val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getUserlist();
    },
    pageNumber (val) {
      this.pageNum = val;
      this.getUserlist();
    },
    // 用户list
    getUserlist () {
      this.deleteIds = "";
      let that = this;
      that.loading = true;
      let par = {
        ...that.User,
      };
      warnList(par)
        .then(result => {
          let data = result.data || []
          that.tableData = data;
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
    this.getUserlist();
  }
};
</script>
<style lang="scss">
.alarm-cf {
  width: 100%;
  height: 100%;
  background-color: #f5f6fa;
  border: solid 1px #d3d4d8;
  padding: 10px;
  .m-btn {
    display: flex;
    height: 40px;
    line-height: 30px;
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
    .f20 {
      .el-input__icon {
        line-height: 32px;
      }
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
      padding: 9px 14px;
      border-radius: 0px;
      font-size: 12px;
    }
    .el-input__inner {
      width: 100px;
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
    height: calc(100% - 40px);
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