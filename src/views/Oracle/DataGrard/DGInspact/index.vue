<template>
  <!-- 数据库配置 -->
  <div class="data-cf1">
    <div class="f-btn">
      <el-select v-model="group.groupName"
                 placeholder="数据库组"
                 @change="getOPtions"
                 clearable>
        <el-option v-for="(item,index) in optionGroup"
                   :key="index"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
      <div class="w100">
        <el-button type="primary"
                   @click="checkDg">CHECK</el-button>
      </div>
    </div>

    <div class="f-table">
      <div class="e-title">
        <n-table :column="titleColumn"
                 :tableData="titleDate"
                 :tableSta="false"></n-table>
      </div>
      <div class="e-tbale"
           v-loading="loading">
        <div v-for="(table, index) in tables"
             :key="index"
             class="e-tbs">
          <div>
            <n-table :column="table.column"
                     :tableData="table.tableData"
                     @deleteId="deleteId"
                     :dbGroupId="table.id"
                     :status="14"
                     :tableSta="false"></n-table>
          </div>
        </div>
      </div>
    </div>
    <div class="f-table2">
      <!-- 左侧table -->
      <div class="e-left"
           v-show="tablesLeft.length != 0">
        <div class="t-name">主库</div>
        <div v-for="(tables, index) in tablesLeft"
             :key="index"
             class="e-tbs">
          <div class="t-span">{{tables.name}}</div>
          <n-table :column="tables.column"
                   :tableData="tables.tableData"
                   :tableSta="false"
                   :background="'#fff'"></n-table>
        </div>
      </div>
      <div class="e-right"
           v-show="tablesRight.length != 0">
        <div class="t-name">备库</div>
        <div v-for="(tables, index) in tablesRight"
             :key="index"
             class="e-tbs">
          <div class="t-span">{{tables.name}}</div>
          <n-table :column="tables.column"
                   :tableData="tables.tableData"
                   :tableSta="false"
                   :status="'sql1'"
                   :selection="'1'"
                   :background="'#fff'"></n-table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import nTable from "@/components/nTable";
import mPage from "@/components/mPage";
import {
  dbGroupList,
  dbGroupDel,
  hostList,
  hostIps,
  orSave
} from "@/api/systemGer";
import { dbList, oblIst } from "@/api/Oracle.js";
import aDelete from "@/components/adelete";
import { queryDGCheck } from "@/api/DBPolling"
export default {
  components: {
    mPage,
    nTable
  },
  props: {},
  data () {
    return {
      optionGroup: [],
      titleColumn: [
        { label: "IP", prop: "IP", width: 10 },
        { label: "版本", prop: "版本", width: 10 },
        { label: "数据库SID", prop: "数据库SID", width: 10 },
        { label: "用户名", prop: "用户名", width: 10 },
        { label: "端口", prop: "端口", width: 10 },
        { label: "ORACLE_BASE", prop: "ORACLE_BASE", width: 10 },
        { label: "ORACLE_HOME", prop: "ORACLE_HOME", width: 20 },
        { label: "CDB_TYPE", prop: "CDB_TYPE", width: 10 },
        { label: "实例类型", prop: "实例类型", width: 10 },
      ],
      tablesLeft: [],
      tablesRight: [],
      titleDate: [],
      delName: [],
      List: [],
      updateRows2: [],
      delVisable: false,
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
      deleteIds: [],
      group: {
        groupName: "",
        oracleType: 'DG'
      },
      hostIds: [],
      dbVersionIds: [],
      oracleTypeIds: []
    };
  },
  methods: {
    //  最少选中一主一备
    checkDg () {
      let size = this.deleteIds.length
      if (size <= 1) {
        return this.$message.error('请选择两条以上记录')
      }
      if (size >= 3) {
        return this.$message.error('最多选择两条记录')
      }
      let ids = []
      this.deleteIds.forEach(item => {
        ids.push(item.oracleConfigId)
      });
      let dbId = ids.join(',')
      this.loading = true
      queryDGCheck({ ids: dbId }).then((result) => {
        this.loading = false
        this.$message.success(result.msg)
        this.getDateDB(result)
      }).catch((err) => {
        this.loading = false
        this.$message.error(err.msg)
      });
    },
    // 数据处理操作
    getDateDB (val) {
      // 主库
      let master = JSON.parse(val.master[0])
      // 备库
      let slave = JSON.parse(val.slave[0])
      // 处理主库
      let tables = []
      master.forEach((item, index) => {
        let column = []
        switch (index) {
          case 0:
            column = [
              { label: "DATABASE_ROLE", prop: "DATABASE_ROLE" },
              { label: "DATABASE_ROLE", prop: "DATABASE_ROLE" },
              { label: "DATABASE_ROLE", prop: "DATABASE_ROLE" },
              { label: "DATABASE_ROLE", prop: "DATABASE_ROLE" },
            ]
            break;
          case 1:
            column = [
              { label: "GROUP#", prop: "GROUP#", width: 10 },
              { label: "MEMBER", prop: "MEMBER", width: 60 },
              { label: "STATUS", prop: "STATUS", width: 20 },
              { label: "TYPE", prop: "TYPE", width: 10 },
            ]
            break;
          case 2:
            column = [
              { label: "THREAD", prop: "GROUP#" },
              { label: "LOW_SEQUENCE", prop: "LOW_SEQUENCE" },
              { label: "HIGH_SEQUENCE", prop: "HIGH_SEQUENCE" },
            ]
            break;
          case 3:
            column = [
              { label: "APPLIED", prop: "APPLIED" },
              { label: "SEQUENCE", prop: "SEQUENCE" },
            ]
            break;
          case 4:
            column = [
              { label: "PROCESS", prop: "PROCESS" },
              { label: "STATUS", prop: "STATUS" },
            ]
            break;
          case 5:
            column = [
              { label: "DEST_NAME", prop: "DEST_NAME" },
              { label: "ERROR", prop: "ERROR" },
              { label: "PROCESS", prop: "PROCESS" },
              { label: "STATUS", prop: "STATUS" },
              { label: "TRANSMIT_MODE", prop: "TRANSMIT_MODE" },
            ]
            break;
          case 6:
            column = [
              { label: "NAME", prop: "NAME" },
              { label: "VALUE", prop: "VALUE" },
            ]
            break;
          default:
            break;
        }
        let par = {
          name: item.name,
          column: column,
          tableData: item.items,
        }
        tables.push(par)
      });
      this.tablesLeft = tables
      // 处理备库
      // 处理主库
      let tables2 = []
      slave.forEach((item, index) => {
        let column = []
        switch (index) {
          case 0:
            column = [
              { label: "DATABASE_ROLE", prop: "DATABASE_ROLE" },
              { label: "OPEN_MODE", prop: "OPEN_MODE" },
              { label: "PROTECTION_MODE", prop: "PROTECTION_MODE" },
              { label: "SWITCHOVER_STATUS", prop: "SWITCHOVER_STATUS" },
            ]
            break;
          case 1:
            column = [
              { label: "GROUP#", prop: "GROUP#", width: 10 },
              { label: "MEMBER", prop: "MEMBER", width: 60 },
              { label: "STATUS", prop: "STATUS", width: 20 },
              { label: "TYPE", prop: "TYPE", width: 10 },
            ]
            break;
          case 2:
            column = [
              { label: "THREAD", prop: "GROUP#" },
              { label: "LOW_SEQUENCE", prop: "LOW_SEQUENCE" },
              { label: "HIGH_SEQUENCE", prop: "HIGH_SEQUENCE" },
            ]
            break;
          case 3:
            column = [
              { label: "APPLIED", prop: "APPLIED" },
              { label: "SEQUENCE", prop: "SEQUENCE" },
            ]
            break;
          case 4:
            column = [
              { label: "PROCESS", prop: "PROCESS" },
              { label: "STATUS", prop: "STATUS" },
            ]
            break;
          case 5:
            column = [
              { label: "DEST_NAME", prop: "DEST_NAME" },
              { label: "ERROR", prop: "ERROR" },
              { label: "PROCESS", prop: "PROCESS" },
              { label: "STATUS", prop: "STATUS" },
              { label: "TRANSMIT_MODE", prop: "TRANSMIT_MODE" },
            ]
            break;
          case 6:
            column = [
              { label: "NAME", prop: "NAME" },
              { label: "VALUE", prop: "VALUE" },
            ]
            break;
          default:
            break;
        }
        let par = {
          name: item.name,
          column: column,
          tableData: item.items,
        }
        tables2.push(par)
      });
      this.tablesRight = tables2
    },
    // 数据库组操作 
    getOPtions (val) {
      this.tablesRight = {}
      this.tablesLeft = {}
      this.getGroup();
    },
    // 新增操作
    cancel () {
      this.visible = false;
    },
    comfirm () {
      this.visible = false;
      this.getGroup();
    },
    deleteId (val, val2, val3, val4) {
      this.deleteIds = val4
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
            { label: "", prop: "dbName", width: 10 },
            { label: "", prop: "dbUser", width: 10 },
            { label: "", prop: "listenerPort", width: 10 },
            { label: "", prop: "oracleBase", width: 10 },
            { label: "", prop: "oracleHome", width: 20 },
            { label: "", prop: "cdbType", width: 10 },
            { label: "", prop: "insttype", insttype: true, width: 10 },
          ],
          tableData: item.items
        };
        ids.push(par);
      });
      this.tables = ids;
    },
    // 组类表
    getGroup () {
      this.deleteIds = [];
      let that = this;
      that.loading = true;
      dbGroupList(this.group)
        .then(result => {
          let data = result.data || []
          if (data.length > 0) {
            that.groupS(data);
          }
          that.loading = false;
        })
        .catch(err => {
          that.loading = false;
          that.$message.error(err.msg)
        });
    },
    // 组类表
    getGroup1 () {
      dbGroupList(this.group)
        .then(result => {
          if (result.data.length > 0) {
            result.data.forEach(item => {
              this.optionGroup.push(item.groupName)
            });
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
        });
    }
  },
  created () { },
  mounted () {
    this.getGroup();
    this.getGroup1()
  }
};
</script>
<style lang="scss">
.data-cf1 {
  width: 100%;
  background-color: #f5f6fa;
  border: solid 1px #d3d4d8;
  padding: 10px;
  height: 100%;
  overflow: auto;
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
      padding: 12px 21px;
      border-radius: 0px;
      font-size: 12px;
    }
    .el-input__inner {
      height: 40px;
      line-height: 40px;
    }
  }
  .f-table {
    overflow: auto;
    margin-top: 10px;
    .e-tbale {
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
          margin-right: 9px;
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
  .f-table2 {
    margin-top: 10px;
    display: flex;
    .t-name {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      background: #fff;
      font-size: 16px;
      font-weight: bold;
    }
    .e-left {
      width: 50%;
      margin-right: 10px;
      .t-span {
        height: 49px;
        line-height: 49px;
        font-weight: bold;
        color: #909399;
        background: #fafafa;
        padding: 0 20px;
      }
    }
    .e-right {
      flex: 1;
      .t-span {
        height: 49px;
        line-height: 49px;
        font-weight: bold;
        color: #909399;
        background: #fafafa;
        padding: 0 20px;
      }
    }
  }
  .f-page {
    height: 32px;
    text-align: right;
  }
}
</style>
