<template>
  <!-- 系统管理 角色table -->
  <div class="r-roleM">
    <!-- 表头 -->
    <div class="m-btn">
      <div class="f20">{{'角色名称'}}</div>
      <div>
        <el-input v-model="Role.name"
                  clearable></el-input>
      </div>
      <!-- but1 -->
      <div class="ays-gl">
        <el-button class="iconfont iconguanlian"
                   @click="aSOperat(3)"
                   plain>关联菜单</el-button>
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
               :status="2"></n-table>
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
                :update="updateRows"></m-dialog>
    </div>
    <div v-if="delVisable">
      <a-delete :visible="delVisable"
                @cancel="cancelDel"
                :deleteIds="deleteIds"
                :status="2"
                :title="'删除角色'"
                :content="delName.length  == tableData.length?'确定要删除全部角色？':'确当要删除角色？'"></a-delete>
    </div>
    <div v-if="visibleRo">
      <m-role :visible="visibleRo"
              :deleteIds="deleteIds"
              @cancel="cancelRole"
              :dataTree="dataTree"
              :selectIds="selectIds"></m-role>
    </div>
  </div>
</template>

<script>
import nTable from "@/components/nTable";
import mPage from "@/components/mPage";
import aSelet from "@/components/aSelect";
import { role, roleGet, menuTree } from "@/api/Oracle.js";
import mDialog from "./rDialog";
import aDelete from "@/components/adelete";
import mRole from "@/components/roleGL";
import { list, fetchSelectedMenu } from "@/api/menu.js";
export default {
  components: {
    nTable,
    mPage,
    aSelet,
    mDialog,
    aDelete,
    mRole
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
      selectIds: [],
      delName: [],
      dataTree: [],
      // 修改
      visibleRo: false,
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
        { label: "角色名称", prop: "name" },
        { label: "操作", prop: "operaton", type: 1 } //普通 操作 修改删除
      ],
      detail: false,
      pageNum: 1,
      pageSize: 15,
      Role: {
        name: "",
        status: ""
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
    // 获取上级菜单树
    getTree () {
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
        dbType: type
      }
      menuTree(par)
        .then(result => {
          this.dataTree.push(result.data);
        })
        .catch(err => {
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 重新加载菜单
    getList () {
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
        dbType: type
      }
      list(par)
        .then(result => {
          let list = result.data || []
          this.$store.commit("setMenue", list);
          localStorage.setItem("setMenue", JSON.stringify(list));
        })
        .catch(err => {
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 关联角色
    cancelRole (val) {
      this.selectIds = []
      // 选择权限后刷新菜单
      if (val) {
        this.getList();
        this.getRolelist();
        this.deleteIds = "";
      }
      this.visibleRo = false;
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
      } else {
        if (this.deleteIds) {
          let a = this.deleteIds.split(",");
          if (a.length == 1) {
            this.getRoleList()
            this.visibleRo = true;
          } else {
            this.$message.error("您只能选择一条记录");
          }
        } else {
          this.$message.error("请选择要关联记录");
        }
      }
    },
    getRoleList () {
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
        roleId: this.deleteIds,
        dbType: type
      }
      fetchSelectedMenu(par).then((result) => {
        this.selectIds = result.data
      }).catch((err) => {
        this.selectIds = []
        this.MyMessageHtml.error({
          dangerouslyUseHTMLString: true,
          message: err.msg
        });
      });
    },
    // 分页
    pageSie (val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getRolelist(); ss
    },
    pageNumber (val) {
      this.pageNum = val;
      this.getRolelist();
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
      role(par)
        .then(result => {
          let data = result.data || []
          that.tableData = data.items;
          that.$refs.updatePage.update(data.total, data.pageNum, data.pageSize);
          that.loading = false;
        })
        .catch(err => {
          that.loading = false;
          $message;
          that.$message.error(err.msg);
        });
    }
  },
  created () { },
  mounted () {
    this.getRolelist();
    this.getTree();
  }
};
</script>
<style lang="scss">
.r-roleM {
  width: 100%;
  height: 100%;
  background-color: #f5f6fa;
  border: solid 1px #d3d4d8;
  padding: 10px;
  .m-btn {
    display: flex;
    height: 40px;
    line-height: 30px;
    .ays-gl {
      .el-button {
        background: #409eff;
        color: #fff;
        padding: 9px 6px;
      }
    }
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