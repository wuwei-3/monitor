<template>
  <!-- 系统管理 发件箱配置 -->
  <div class="mail-cf">
    <!-- 表头 -->
    <div class="m-btn">
      <!-- table1 -->
      <div>服务器地址</div>
      <div>
        <el-input v-model="User.smtpserver"
                  clearable></el-input>
      </div>
      <!-- table2 -->
      <div class="f20">邮箱地址</div>
      <div>
        <el-input v-model="User.userName"
                  clearable></el-input>
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
               :status="9"></n-table>
    </div>
    <!-- 去除位置占用  wathch 监听失效 使用mountd 获取-->
    <div v-if="visible">
      <m-dialog :visible="visible"
                @cancel="cancel"
                @comfirm="comfirm"
                :update="updateRows"></m-dialog>
    </div>
    <div v-if="delVisable">
      <a-delete :visible="delVisable"
                @cancel="cancelDel"
                :deleteIds="deleteIds"
                :status="9"
                :title="'删除邮箱'"
                :content="delName.length  == tableData.length?'确定要删除全部发件箱配置？':'确当要删除发件箱配置？'"></a-delete>
    </div>
  </div>
</template>

<script>
import nTable from "@/components/nTable";
import mPage from "@/components/mPage";
import aSelet from "@/components/aSelect";
import { mainList } from "@/api/systemGer.js";
import mDialog from "./uDialog";
import aDelete from "@/components/adelete";
export default {
  components: {
    nTable,
    mPage,
    aSelet,
    mDialog,
    aDelete
  },
  props: {},
  data () {
    return {
      delName: [],
      // 修改
      loading: false,
      updateRows: {},
      deleteIds: "",
      //下拉框组件刷新
      selectStaus: true,
      delVisable: false,
      // visible
      visible: false,
      // 统一表格样式
      column: [
        { label: "服务器地址", prop: "smtpserver" },
        { label: "邮箱地址", prop: "userName" },
        { label: "端口", prop: "port" },
        { label: "操作", prop: "operaton", type: 1 } //普通 操作 修改删除
      ],
      detail: false,
      pageNum: 1,
      pageSize: 15,
      User: {
        smtpserver: "", //统一输入框
        userName: "" //统一输入框
      },
      tableData: [],
      total: 0, //总页数
      current: 1 //当前页
    };
  },
  watch: {
    User: {
      handler: function () {
        // 模糊搜索 分页还原第一页
        this.deleteIds = "";
        this.getUserlist();
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    // 修改当前条
    updateRow (val) {
      this.updateRows = val;
      this.visible = true;
    },
    deleteId (val, val2) {
      this.deleteIds = val;
      this.delName = val.split(',')
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
    //
    details () {
      this.detail = !this.detail;
    },
    // 用户list
    getUserlist () {
      this.deleteIds = "";
      let that = this;
      that.loading = true;
      let par = {
        ...that.User
      };
      mainList(par)
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
    this.getUserlist();
  }
};
</script>
<style lang="scss">
.mail-cf {
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
      // margin-left: 20px;
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