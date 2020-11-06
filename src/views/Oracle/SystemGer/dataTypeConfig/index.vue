<template>
  <!-- 系统管理 数据库类型 -->
  <div class="m-dtype">
    <!-- 表头 -->
    <div class="m-btn">
      <div>编码</div>
      <div>
        <el-input v-model="Role.code"
                  clearable></el-input>
      </div>
      <div>名称</div>
      <div>
        <el-input v-model="Role.name"
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
               :status="15"></n-table>
    </div>
    <!-- 去除位置占用  wathch 监听失效 使用mountd 获取-->
    <div v-if="visible">
      <m-dialog :visible="visible"
                @cancel="cancel"
                @comfirm="comfirm"
                :update="updateRows"
                :codeDateType="codeDateType"></m-dialog>
    </div>
    <div v-if="delVisable">
      <a-delete :visible="delVisable"
                @cancel="cancelDel"
                :deleteIds="deleteIds"
                :status="15"
                :title="'删除数据库类型'"
                :content="delName.length  == tableData.length?'确定要删除全部数据库类型配置？':'确当要删除数据库类型配置？'"
                :codeDateType="codeDateType"></a-delete>
    </div>
  </div>
</template>

<script>
import nTable from "@/components/nTable";
import mPage from "@/components/mPage";
import aSelet from "@/components/aSelect";
import { oblIst, mylIst, marialIst } from "@/api/Oracle.js";
import mDialog from "./rDialog";
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
      codeDateType: '',
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
        holder: "启用状态",
        // 下拉框内容
        items: [
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
            name: "接受"
          },
          {
            id: 0,
            name: "不接受"
          }
        ]
      },
      // 告警通知
      TeWarnNotice: {
        // 下拉框宽度
        width: "width:110px",
        // 是否支持清除
        cleear: true,
        holder: "数据库类型",
        // 下拉框内容
        items: [
          {
            id: 1,
            name: "警告"
          },
          {
            id: 0,
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
        { label: "编码", prop: "code" },
        { label: "名称", prop: "name" },
        { label: "操作", prop: "operaton", type: 1 } //普通 操作 修改删除
      ],
      detail: false,
      pageNum: 1,
      pageSize: 15,
      Role: {
        code: "",
        name: ""
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
        this.oraRoleList();
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
        this.oraRoleList();
      }
    },
    // 删除成功
    delectSuc () {
      this.oraRoleList();
    },
    // 添加
    comfirm (val) {
      this.visible = false;
      this.oraRoleList();
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
    // 用户list
    oraRoleList () {
      this.deleteIds = "";
      let that = this;
      that.loading = true;
      if (this.codeDateType == 1) {
        mylIst(this.Role)
          .then(result => {
            that.tableData = result.data || []
            that.loading = false;
          })
          .catch(err => {
            that.loading = false;
            that.$message.error(err.msg);
          });
      } else if (this.codeDateType == 2) {
        marialIst(this.Role)
          .then(result => {
            that.tableData = result.data || []
            that.loading = false;
          })
          .catch(err => {
            that.loading = false;
            that.$message.error(err.msg);
          });
      } else {
        oblIst(this.Role)
          .then(result => {
            that.tableData = result.data || []
            that.loading = false;
          })
          .catch(err => {
            that.loading = false;
            that.$message.error(err.msg);
          });
      }
    },
  },
  created () { },
  mounted () {
    this.codeDateType = this.$route.query.code
    this.oraRoleList();
  }
};
</script>
<style lang="scss">
.m-dtype {
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