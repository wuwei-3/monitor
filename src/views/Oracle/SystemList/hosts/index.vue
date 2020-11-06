<template>
  <!-- 系统管理 主机配置 -->
  <div class="host-cf">
    <!-- 表头 -->
    <div class="m-btn">
      <div>
        <el-input v-model="User.ip"
                  placeholder="IP"
                  clearable></el-input>
      </div>
      <!--启用状态  -->
      <div class="f20">
        <a-selet @aSelect="hostaStatu"
                 :aSelect="HostStatus"></a-selet>
      </div>
      <!--链路状态  -->
      <div class="f20">
        <a-selet @aSelect="linkaStatu"
                 :aSelect="LinkStatus"></a-selet>
      </div>
      <!--主机类型  -->
      <div class="f20">
        <a-selet @aSelect="aStatus"
                 :aSelect="Status"></a-selet>
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
               :status="10"
               @refreshRow="refreshRow"></n-table>
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
                :reportOption="Status.items"></m-dialog>
    </div>
    <div v-if="delVisable">
      <a-delete :visible="delVisable"
                @cancel="cancelDel"
                :deleteIds="deleteIds"
                :status="10"
                :title="'删除主机配置'"
                :content="delName.length  == tableData.length?'确定要删除全部主机配置？':'确当要删除主机配置？'"></a-delete>
    </div>
  </div>
</template>

<script>
import nTable from "@/components/nTable";
import mPage from "@/components/mPage";
import aSelet from "@/components/aSelect";
import { userList, save, deleteUser } from "@/api/Oracle.js";
import mDialog from "./uDialog";
import aDelete from "@/components/adelete";
import { hostList } from "@/api/systemGer.js";
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
      delName: [],
      // 主机类型
      Status: {
        // 下拉框宽度
        width: "width:100px",
        // 是否支持清除
        cleear: true,
        holder: "OS类型",
        // 下拉框内容
        items: [
          {
            id: 1,
            name: "Linux"
          },
          {
            id: 2,
            name: "Windows"
          }
        ]
      },

      // 主机类型
      HostStatus: {
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

      // 主机类型
      LinkStatus: {
        // 下拉框宽度
        width: "width:100px",
        // 是否支持清除
        cleear: true,
        holder: "链路状态",
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
      // 修改
      updateRows: {},
      deleteIds: "",
      //下拉框组件刷新
      selectStaus: true,
      delVisable: false,
      // 弹出框
      visible: false,
      loading: false,
      // 统一表格样式
      column: [
        { label: "系统名称", prop: "osName", width: 25 },
        { label: "IP", prop: "ip", width: 10 },
        { label: "端口", prop: "port", width: 5 },
        { label: "启用状态", prop: "status", switch: true, width: 5 },
        { label: "链路状态", prop: "linkStatus", switch: true, width: 5 },
        { label: "CPU信息", prop: "cpuInfo", width: 25 },
        { label: "OS类型", prop: "osType", width: 5 },
        { label: "操作", prop: "operaton", type: 2, width: 10 } //普通 操作 修改删除
      ],
      detail: false,
      pageNum: 1,
      pageSize: 15,
      User: {
        osType: "", //统一输入框
        ip: "",
        status: "", //启用状态
        linkStatus: "" //链路状态
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
    //
    refreshRow () {
      this.getUserlist();
    },
    // 启用状态
    hostaStatu (val) {
      if (val == 2) {
        return (this.User.status = 0);
      }
      this.User.status = val ? this.HostStatus.items[val - 1].id : "";
    },
    // 链路状态
    linkaStatu (val) {
      if (val == 2) {
        return (this.User.linkStatus = 0);
      }
      this.User.linkStatus = val ? this.LinkStatus.items[val - 1].id : "";
    },
    // 主机列表
    details () {
      this.detail = !this.detail;
    },
    // 操作系统
    aStatus (val) {
      if (val == 2) {
        return (this.User.osType = "Windows");
      }
      this.User.osType = val ? this.Status.items[val - 1].name : "";
    },
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
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      hostList(par)
        .then(result => {
          let data = result.data || []
          that.tableData = data.items;
          that.$refs.updatePage.update(data.total, data.pageNum, data.pageSize);
          that.loading = false;
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
.host-cf {
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