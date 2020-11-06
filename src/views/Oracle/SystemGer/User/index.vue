<template>
  <!-- 系统管理 用户table -->
  <div class="s-system">
    <!-- 表头 -->
    <div class="m-btn">
      <!-- table1 -->
      <div>{{myTable.header.sName.name}}</div>
      <div v-show="myTable.header.sName.type == 1">
        <el-input v-model="User.loginName"
                  clearable></el-input>
      </div>
      <!-- table2 -->
      <div class="f20">{{myTable.header.uName.name}}</div>
      <div v-show="myTable.header.uName.type == 1">
        <el-input v-model="User.userName"
                  clearable></el-input>
      </div>
      <div v-show="myTable.header.uName.type == 2">
        <a-selet></a-selet>
      </div>
      <!-- 启用状态 -->
      <div class="f20">
        <a-selet @aSelect="aStatus"
                 :aSelect="Status"></a-selet>
      </div>
      <!-- 接受邮件 -->
      <div>
        <a-selet @aSelect="aRemail"
                 :aSelect="Remail"></a-selet>
      </div>
      <!-- 告警通知 -->
      <div>
        <a-selet @aSelect="aTeWarnNotice"
                 :aSelect="TeWarnNotice"></a-selet>
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
                :optionsRole="optionsRole"></m-dialog>
    </div>
    <div v-if="delVisable">
      <a-delete :visible="delVisable"
                @cancel="cancelDel"
                :deleteIds="deleteIds"
                :status="1"
                :title="'删除用户'"
                :content="delName.length  == tableData.length?'确定要删除全部用户？':'确当要删除用户？'"></a-delete>
    </div>
  </div>
</template>

<script>
import nTable from "@/components/nTable";
import mPage from "@/components/mPage";
import aSelet from "@/components/aSelect";
import {
  userList,
  save,
  deleteUser,
  roleList
} from "@/api/Oracle.js";
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
  props: {
    // 统一组件定义
    myTable: {
      type: Object,
      default: () => {
        return {
          // 头部信息
          header: {
            sName: {
              name: "登录名称",
              type: 1 //1代表input框 2代表下拉框
            },
            uName: {
              name: "用户名称",
              type: 1
            },
            sbtn: "查询",
            // 操作状态
            operation: [
              {
                id: 1,
                name: "启用"
              },
              {
                id: 0,
                name: "禁用"
              }
            ]
          },
          // 列表信息
          bodyer: {},
          // 分页信息
          pager: {}
        };
      }
    }
  },
  data () {
    return {
      delName: [],
      optionsRole: [],
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
        holder: "启用状态",
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
      // 邮件接受状态
      Remail: {
        // 下拉框宽度
        width: "width:100px",
        // 是否支持清除
        cleear: true,
        holder: "邮件状态",
        // 下拉框内容
        items: [
          {
            id: 1,
            name: "接收"
          },
          {
            id: 2,
            name: "拒收"
          }
        ]
      },
      // 告警通知
      TeWarnNotice: {
        // 下拉框宽度
        width: "width:100px",
        // 是否支持清除
        cleear: true,
        holder: "告警通知",
        // 下拉框内容
        items: [
          {
            id: 1,
            name: "警告"
          },
          {
            id: 2,
            name: "不警告"
          }
        ]
      },
      loading: false,
      // 操作下拉框
      SOperat: {
        // 下拉框宽度
        width: "width:80px",
        // 是否支持清除
        cleear: true,
        holder: "操作",
        // 下拉框内容
        items: [
          {
            id: 0,
            name: "新增"
          },
          {
            id: 2,
            name: "删除"
          }
        ]
      },
      // 统一表格样式
      column: [
        { label: "登录名称", prop: "loginName" },
        { label: "用户名称", prop: "userName" },
        { label: "启用状态", prop: "status", switch: true },
        { label: "接受邮件", prop: "reMail", switch: true },
        {
          label: "告警通知",
          prop: "reWarnNotice",
          switch: true
        },
        { label: "EMAL", prop: "email" },
        { label: "TELPHONE", prop: "telephone" },
        { label: "角色", prop: "sysRoleName" },
        { label: "操作", prop: "operaton", type: 1 } //普通 操作 修改删除
      ],
      detail: false,
      pageNum: 1,
      pageSize: 15,
      User: {
        loginName: "", //统一输入框
        userName: "", //统一输入框
        status: "",
        reMail: "",
        reWarnNotice: "",
        email: "",
        telephone: ""
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
        this.pageNum = 1;
        this.getUserlist();
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    // 角色列表
    getRole () {
      roleList()
        .then(result => {
          this.optionsRole = result.data || []
        })
        .catch(err => {
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
    // 告警模块
    aTeWarnNotice (val) {
      if (val == 2) {
        return (this.User.reWarnNotice = 0);
      }
      this.User.reWarnNotice = val;
    },
    // 邮件转态
    aRemail (val) {
      if (val == 2) {
        return (this.User.reMail = 0);
      }
      this.User.reMail = val;
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
    // 启用状态
    aStatus (val) {
      if (val == 2) {
        return (this.User.status = 0);
      }
      this.User.status = val;
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
        ...that.User,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      userList(par)
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
    this.getUserlist();
    this.getRole();
  }
};
</script>
<style lang="scss">
.s-system {
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
        border-color: none;
      }
    }
    .sys-del {
      .el-button {
        background: #f56f61;
        color: #fff;
        border-color: none;
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