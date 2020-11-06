<template>
  <div class="sqldialog">
    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               width="380px"
               :before-close="cancel"
               v-dialogDrag>
      <div v-if="status == 1"
           class="g-table">
        {{sql.SQL_TEXT || sql.SQL_FULLTEXT || sql.SQL_ID}}
      </div>
      <div v-else-if="status == 2"
           class="g-table">
        <div class="n-body">
          <div class="y-span"><span>Resource Name</span></div>
          <div class="y-put">
            <el-input v-model="sql.RESOURCE_NAME"
                      disabled></el-input>
          </div>
        </div>
        <div class="n-body">
          <div class="y-span"><span>Limit</span></div>
          <div class="y-put">
            <el-input v-model="value"></el-input>
          </div>
        </div>
      </div>
      <div v-else-if="status == 3"
           class="g-table">
        <div class="n-table">
          <el-select v-model="value"
                     placeholder="请选择时间"
                     :popper-append-to-body="false"
                     @change="Snapshot">
            <el-option v-for="item in options"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="n-tables"
             v-loading="loading">
          <el-table :data="tableData"
                    highlight-current-row
                    :show-overflow-tooltip="true"
                    @current-change="handleCurrentChange">
            <el-table-column type="index"
                             label="序号"
                             width="50"
                             align="center">
            </el-table-column>
            <el-table-column prop="SNAPID"
                             label="快照ID"
                             align="center">
            </el-table-column>
            <el-table-column prop="SNAP_DATE"
                             label="快照时间"
                             align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else-if="status == 4 && title == '用户名'"
           class="g-table">
        <div class="
           n-tables"
             v-loading="loading">
          <el-table :data="tableData1"
                    highlight-current-row
                    @current-change="handleCurrentChange1"
                    show-overflow-tooltip="true">
            <el-table-column type="index"
                             label="序号"
                             width="150"
                             align="center">
            </el-table-column>
            <el-table-column prop="USERNAME"
                             label="用户名"
                             align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else-if="status == 4 && title == '表名'"
           class="g-table">
        <div class="
           n-tables"
             v-loading="loading">
          <el-table :data="tableData2"
                    highlight-current-row
                    @current-change="handleCurrentChange2"
                    show-overflow-tooltip="true">
            <el-table-column type="index"
                             label="序号"
                             width="150"
                             align="center">
            </el-table-column>
            <el-table-column prop="OBJECT_NAME"
                             label="用户名"
                             align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else-if="status == 4 && title == '索引名'"
           class="g-table">
        <div class="
           n-tables"
             v-loading="loading">
          <el-table :data="tableData2"
                    highlight-current-row
                    @current-change="handleCurrentChange2"
                    show-overflow-tooltip="true">
            <el-table-column type="index"
                             label="序号"
                             width="150"
                             align="center">
            </el-table-column>
            <el-table-column prop="OBJECT_NAME"
                             :label="title"
                             align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else-if="status == 4 && title == '分区信息'"
           class="g-table">
        <div class="
           n-tables"
             v-loading="loading">
          <el-table :data="tableData3"
                    highlight-current-row
                    @current-change="handleCurrentChange2"
                    show-overflow-tooltip="true">
            <el-table-column type="index"
                             label="序号"
                             width="150"
                             align="center">
            </el-table-column>
            <el-table-column prop="TABLE_NAME"
                             :label="title"
                             align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else-if="status == 4 && title == '数据文件编号'"
           class="g-table">
        <div class="
           n-tables"
             v-loading="loading">
          <el-table :data="tableData4"
                    highlight-current-row
                    @current-change="handleCurrentChange1"
                    show-overflow-tooltip="true">
            <el-table-column type="index"
                             label="序号"
                             width="150"
                             align="center">
            </el-table-column>
            <el-table-column prop="FILE_NAME"
                             :label="title"
                             align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else-if="status == 4 && title == '段对象类型'"
           class="g-table">
        <div class="
           n-tables"
             v-loading="loading">
          <el-table :data="tableData5"
                    highlight-current-row
                    @current-change="handleCurrentChange2"
                    show-overflow-tooltip="true">
            <el-table-column type="index"
                             label="序号"
                             width="150"
                             align="center">
            </el-table-column>
            <el-table-column prop="SEGMENT_TYPE"
                             :label="title"
                             align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="g-foot">
        <el-button @click="confirm(false)">关闭</el-button>
        <el-button @click="confirm(true)"
                   type="primary"
                   plain
                   v-show="status == 2 || status == 3">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  modifyProFile,
  querySnapshot,
  queryUserName,
  queryObjectName
} from "@/api/sqlMonitor";
import nTables from "./nTable.vue";
import { queryPartitionTableName, queryDataFileNumberAndName, querySegmentObjectType } from "@/api/common"
import nSelect from "./aSelect";
export default {
  components: {
    nTables,
    nSelect
  },
  props: {
    dialogVisible: "",
    sql: "",
    status: "",
    title: "",
    awrId: "",
    dbName: "",
    userName: '',
    TABLE: {
      type: String,
      default: () => {
        return 'TABLE'
      }
    }
  },
  data () {
    return {
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      tableData5: [],
      loading: false,
      // 操作下拉框
      SOperat: {
        // 下拉框宽度
        width: "width:200px",
        // 是否支持清除
        cleear: true,
        holder: "天数"
        // 下拉框内容
      },
      options: [
        {
          id: 1,
          name: "1天"
        },
        {
          id: 2,
          name: "2天"
        },
        {
          id: 3,
          name: "3天"
        },
        {
          id: 4,
          name: "4天"
        },
        {
          id: 5,
          name: "5天"
        },
        {
          id: 6,
          name: "6天"
        },
        {
          id: 7,
          name: "7天"
        }
      ],
      tableData: [],
      value: 1,
      loading: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    //
    handleCurrentChange2 (val) {
      this.$emit('getValue', val, 2)
    },
    handleCurrentChange1 (val) {
      this.$emit('getValue', val, 1)
    },
    // 开始快照
    handleCurrentChange (val) {
      if (this.title == "选择结束快照") {
        this.$emit("snapid", val, false);
      } else {
        this.$emit("snapid", val, true);
      }
    },
    // 查询快照
    Snapshot (val) {
      let par = {
        id: this.awrId,
        day: val
      };
      this.loading = true;
      querySnapshot(par)
        .then(result => {
          this.loading = false;
          this.tableData = result.data || [];
        })
        .catch(err => {
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          this.loading = false;
        });
    },
    cancel () {
      this.$emit("cancel", false);
    },
    confirm (val) {
      if (val) {
        this.loading = true;
        let par = {
          id: this.sql.id,
          resname: this.sql.RESOURCE_NAME,
          limit: this.value
        };
        modifyProFile(par)
          .then(result => {
            this.$emit("confirm", val);
            this.loading = false;
          })
          .catch(err => {
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
            this.loading = false;
          });
      } else {
        this.$emit("confirm", val);
      }
    },
    getUser (val) {
      this.loading = true;

      if (val == 1) {
        let par = {
          id: this.awrId,
          dbName: this.dbName
        };
        queryUserName(par)
          .then(result => {
            this.loading = false;
            this.tableData1 = result.data || [];
          })
          .catch(err => {
            this.loading = false;
            this.tableData1 = []
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
      } else if (val == 3) {
        let par = {
          id: this.awrId,
          dbName: this.dbName,
          userName: this.userName,
        };
        queryPartitionTableName(par)
          .then(result => {
            this.loading = false;
            this.tableData3 = result.data || [];
          })
          .catch(err => {
            this.loading = false;
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
      } else if (val == 4) {
        let par = {
          id: this.awrId,
          dbName: this.dbName,
        };
        queryDataFileNumberAndName(par)
          .then(result => {
            this.loading = false;
            this.tableData4 = result.data || [];
          })
          .catch(err => {
            this.loading = false;
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
      } else if (val == 5) {
        let par = {
          id: this.awrId,
          dbName: this.dbName,
          userName: this.userName,
        };
        querySegmentObjectType(par)
          .then(result => {
            this.loading = false;
            this.tableData5 = result.data || [];
          })
          .catch(err => {
            this.loading = false;
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
      } else {
        let par = {
          id: this.awrId,
          dbName: this.dbName,
          userName: this.userName,
          type: this.TABLE
        };
        queryObjectName(par)
          .then(result => {
            this.loading = false;
            this.tableData2 = result.data || [];
          })
          .catch(err => {
            this.loading = false;
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
      }
    },
    getTable () {
      this.loading = true;
      let par = {
        id: this.awrId,
        dbName: this.dbName
      };
      queryUserName(par)
        .then(result => {
          this.loading = false;
          this.tableData1 = result.data || [];
        })
        .catch(err => {
          this.loading = false;
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    }
  },
  mounted () {
    if (this.sql) {
      this.value = this.sql.LIMIT;
    }
    if (this.status == 3) {
      this.Snapshot(1);
    }
    if (this.title == "用户名") {
      this.getUser(1);
    }
    if (this.title == "表名" || this.title == "索引名") {
      this.getUser(2);
    }
    if (this.title == "分区信息") {
      this.getUser(3);
    }
    // 
    if (this.title == "数据文件编号") {
      this.getUser(4);
    }
    if (this.title == "段对象类型") {
      this.getUser(5);
    }
  }
};
</script>
<style lang="scss">
.sqldialog {
  min-width: 300px;
  min-height: 500px;
  background: #e7e8ed;
  overflow: auto;
  .el-dialog__header {
    padding: 8px;
    background: #2d97ff;
    .el-dialog__headerbtn {
      top: 8px;
      right: 9px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
    .el-dialog__title {
      color: #fff;
      font-size: 15px;
    }
  }
  .el-dialog__body {
    padding: 10px;
    .el-table td,
    .el-table th {
      padding: 6px 0;
    }
    .g-table {
      max-height: 500px;
      overflow: auto;
    }
    .g-foot {
      height: 43px;
      line-height: 50px;
      text-align: right;
      .el-button {
        padding: 8px 20px;
        border-radius: 0px;
      }
    }
    .n-table {
      height: 50px;
      line-height: 50px;
    }
    .n-tables {
      height: 500px;
      overflow: auto;
    }
    .n-body {
      display: flex;
      height: 50px;
      align-items: center;
      .y-span {
        width: 100px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #eaeaea;
        border-right: none;
        text-align: center;
        background: #fbfbfb;
        font-size: 12px;
        color: #000000;
      }
      .switch {
        height: 40px;
        line-height: 40px;
        border: 1px solid #eaeaea;
        background: #fbfbfb;
        padding-left: 20px;
      }
      .y-put {
        flex: 1;
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>