<template>
  <!-- 数据库配置 -->
  <div class="data-cf-my">
    <div class="f-btn">
      <div>GROUP</div>
      <div>
        <el-input v-model="group.groupName"
                  clearable></el-input>
      </div>
      <!-- but1 -->
      <div class="sys-add">
        <el-button class="el-icon-circle-plus-outline"
                   @click="aSOperat()"
                   plain>新增</el-button>
      </div>
    </div>
    <div class="f-table">
      <div class="e-title">
        <n-table :column="titleColumn"
                 :tableData="titleDate"
                 :selection="'1'"
                 :tableSta="false"></n-table>
      </div>
      <div class="e-tbale"
           v-loading="loading">
        <div v-for="(table, index) in tables"
             :key="index"
             class="e-tbs">
          <div class="s-icon">
            <div @click="deleteEdit(table, index)"
                 title="修改组">
              <i class="el-icon-edit f12"></i>
            </div>
            <div @click="deleteIcon(table)"
                 title="删除组">
              <i class="el-icon-remove f12"></i>
            </div>
            <div @click="deleteFresh(table)"
                 title="添加组成员">
              <i class="iconfont icontianjia f12"></i>
            </div>
          </div>
          <div>
            <n-table :column="table.column"
                     :tableData="table.tableData"
                     @delectSuc="delectSuc"
                     @deleteId="deleteId"
                     :dbGroupId="table.id"
                     :selection="'1'"
                     @update="updateRow"
                     :status="14"
                     :tableSta="false"></n-table>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visible">
      <u-dialog :visible="visible"
                @cancel="cancel"
                @comfirm="comfirm"
                :update="updateRows"></u-dialog>
    </div>
    <div v-if="visible2">
      <u-dialog2 :visible="visible2"
                 @cancel="cancel2"
                 @comfirm="comfirm2"
                 :update="updateRows2"
                 :dbGroupId="dbGroupId"
                 :hostIds="hostIds"
                 :dbVersionIds="dbVersionIds"
                 :oracleTypeIds="oracleTypeIds">
      </u-dialog2>
    </div>
    <div v-if="delVisable">
      <a-delete :visible="delVisable"
                @cancel="cancelDel"
                :deleteIds="deleteIds"
                :dbGroupId="dbGroupId"
                :status="21"
                :title="'删除数据库配置'"
                :content="delName.length  == tableData.length?'确定要删除全部组成员？':'确当要删除组成员？'"></a-delete>
    </div>
  </div>
</template>

<script>
import nTable from "@/components/nTable";
import mPage from "@/components/mPage";
import uDialog from "./uDialog";
import uDialog2 from "./uDialog2";
import {
  dbGroupListMysql,
  dbGroupDel,
  hostList,
  hostIps,
  orSave
} from "@/api/systemGer";
import { dbList, oblIst } from "@/api/Oracle.js";
import aDelete from "@/components/adelete";
export default {
  components: {
    mPage,
    nTable,
    uDialog,
    aDelete,
    uDialog2
  },
  props: {},
  data () {
    return {
      titleColumn: [
        { label: "所属主机", prop: "IP", width: 10 },
        { label: "版本", prop: "版本", width: 10 },
        { label: "用户名", prop: "用户名", width: 10 },
        { label: "端口", prop: "端口", width: 10 },
        { label: "实例类型", prop: "实例类型", width: 10 },
        { label: "慢查询日志路径", prop: "慢查询日志路径", width: 10 },
        { label: "操作", prop: "operato", width: 6 } //普通 操作 修改删除
      ],
      titleDate: [],
      delName: [],
      List: [],
      updateRows2: [],
      delVisable: false,
      updateRows: [],
      visible: false,
      visible2: false,
      tableData: [],
      pageSize: 15,
      pageNumber: 1,
      data: {
        name: ""
      },
      dbGroupId: "",
      tables: [],
      loading: false,
      deleteIds: "",
      group: {
        groupName: ""
      },
      hostIds: [],
      dbVersionIds: [],
      oracleTypeIds: []
    };
  },
  watch: {
    group: {
      handler: function () {
        this.getGroup();
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    // 下拉框列表
    getHost () {
      // 用户list
      let par = {
        ...this.User
      };
      hostList(par)
        .then(result => {
          this.hostIds = result.data.items;
        })
        .catch(err => {
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
      let par1 = {
        dbType: 'MySQL',
        ...par
      }
      dbList(par1)
        .then(result => {
          this.dbVersionIds = result.data.items;
        })
        .catch(err => {
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
      oblIst(par)
        .then(result => {
          this.oracleTypeIds = result.data || []
        })
        .catch(err => {
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 新增操作
    cancel2 () {
      this.updateRows = "";
      this.visible2 = false;
    },
    comfirm2 () {
      this.updateRows2 = "";
      this.visible2 = false;
      this.getGroup();
    },
    // 取消全部删除
    cancelDel (val) {
      this.delVisable = false;
      this.selectStaus = true;
      if (val) {
        this.getGroup();
      }
    },
    // 修改操作
    deleteEdit (val, val2) {
      this.updateRows = val;
      this.visible = true;
      this.dbGroupId = val2;
    },
    // 删除组
    deleteIcon (val) {
      this.deleteIds = val.id;
      this.dbGroupId = -1
      this.delVisable = true;
    },
    // 添加组员信息 可以获取group id
    deleteFresh (val) {
      this.visible2 = true;
      this.updateRows2 = "";
      this.dbGroupId = val.id;
    },
    // 新增操作
    cancel () {
      this.visible = false;
    },
    comfirm () {
      this.visible = false;
      this.getGroup();
    },
    // 表格操作
    delectSuc () { },
    deleteId (val, val2, val3) {
      this.dbGroupId = val3;
      if (val2) {
        this.delVisable = true;
        this.delName = val.split(',')
      }
      this.deleteIds = val;
    },
    // 修改组成员
    updateRow (val, val2) {
      this.visible2 = true;
      this.updateRows2 = val;
      this.dbGroupId = val2;
    },
    // 分页
    pageSie (val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getGroup();
    },
    pageNumbers (val) {
      this.pageNum = val;
      this.getGroup();
    },
    // 新增组
    aSOperat () {
      this.visible = true;
    },
    // 组数据处理
    groupS (val) {
      this.tables = [];
      let ids = [];
      val.forEach((item, index) => {
        let par = {
          id: item.groupId,
          groupName: item.groupName,
          // 数据整理
          column: [
            { label: item.groupName, prop: "hostIP", width: 10 },
            { label: "", prop: "version", width: 10 },
            { label: "", prop: "dbUser", width: 10 },
            { label: "", prop: "listenerPort", width: 10 },
            { label: "", prop: "insttype", insttype: true, width: 10 },
            { label: "", prop: "slowLog", width: 10 },
            { label: "", prop: "operaton", type: 1, width: 6 }
          ],
          tableData: item.mySQLItems
        };
        ids.push(par);
      });
      this.tables = ids;
    },
    // 组类表
    getGroup () {
      this.deleteIds = "";
      let that = this;
      that.loading = true;
      dbGroupListMysql(this.group)
        .then(result => {
          let data = result.data || []
          if (data.length > 0) {
            that.groupS(data);
          }
          that.loading = false;
        })
        .catch(err => {
          that.loading = false;
        });
    }
  },
  created () { },
  mounted () {
    this.getGroup();
    // 获取主机接口 和 版本接口
    this.getHost();
  }
};
</script>
<style lang="scss">
.data-cf-my {
  width: 100%;
  height: 100%;
  background-color: #f5f6fa;
  border: solid 1px #d3d4d8;
  padding: 10px;
  .f-btn {
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
  .f-table {
    height: calc(100% - 40px);
    overflow: auto;
    .e-tbale {
      height: calc(100% - 67px);
      width: 100%;
      overflow: auto;
      margin-top: -50px;
      .e-tbs {
        position: relative;
        .s-icon {
          position: absolute;
          right: 30px;
          top: 13px;
          z-index: 11;
          display: flex;
          margin-right: 0px;
          div:hover {
            border: 1px solid #d3effc;
            background: #d3effc;
            color: #0095d4;
          }
          .f12 {
            font-size: 12px;
          }
          div {
            width: 27px;
            height: 26px;
            border-radius: 50%;
            border: 1px solid #bdbdbd;
            text-align: center;
            cursor: pointer;
            margin-right: 14px;
          }
        }
      }
    }
    .e-date {
      color: #909399;
      text-align: center;
      height: 50px;
      line-height: 50px;
      border: 1px solid #d3effc;
    }
  }
  .f-page {
    height: 32px;
    text-align: right;
  }
}
</style>
