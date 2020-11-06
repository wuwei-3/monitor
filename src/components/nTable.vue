<template>
  <!-- 管理页面table 风格 -->
  <div class="n-table"
       v-loading="loadingFresh">
    <el-table :data="tableData"
              :highlight-current-row="true"
              style="width:100%"
              @selection-change="selectAll"
              :header-cell-style="{'background':background}">
      <el-table-column type="selection"
                       width="55"
                       align="center"
                       v-if="selection == 'selection'">
      </el-table-column>
      <el-table-column type="index"
                       label="序号"
                       width="50"
                       v-if="showIndex"
                       align="center">
      </el-table-column>
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :min-width="item.width"
                       v-for="(item, index) in column"
                       :key="index"
                       align="left">
        <!-- 添加需要table信息 -->
        <template slot-scope="scope">
          <!-- 进度条 -->
          <div v-if="item.prop == 'number'">
            <el-progress :text-inside="true"
                         :stroke-width="15"
                         :percentage="80"
                         :color="item.color"></el-progress>
          </div>
          <!-- 操作 -->
          <div v-else-if="item.prop == 'operaton'"
               class="e-oper">
            <div @click.stop="editRow(scope)"
                 v-show="item.type != 4"><i class="iconfont iconxie f12"></i></div>
            <div @click.stop="deleteRow((scope.row))"
                 v-show="item.type != 4"><i class="iconfont iconshanchu f12"></i></div>
            <!-- 刷新按钮 -->
            <div v-show="item.type == 2"
                 @click.stop="refreshRow(scope.row,index)">
              <i class="el-icon-refresh"></i>
            </div>
            <!-- 刷新按钮 -->
            <div v-show="item.type == 3"
                 @click.stop="deleteRow(scope.row,index)">
              <i class="iconfont iconshanchu f12"></i>
            </div>
            <!-- 删除按钮 -->
            <div v-show="item.type == 4"
                 @click.stop="deleteRow(scope.row,index)">
              <i class="iconfont iconshanchu f12"></i>
            </div>
          </div>
          <!-- 操作 -->
          <div v-else-if="item.prop == 'operaton1'"
               class="e-oper">
            <div @click.stop="lockName(scope.row)"><i class="iconfont iconeye-line f12"></i></div>
            <div @click.stop="downloadSQL(scope.row)"
                 title="下载"><i class="iconfont icondownload--fill f12"></i></div>
          </div>
          <div v-else-if="item.prop == 'operaton2'"
               class="e-oper">
            <div @click.stop="profileUpdate(scope.row,item.type)"><i class="iconfont iconxie f12"></i></div>
          </div>
          <!-- 固定sql计划 -->
          <div v-else-if="item.prop == 'operaton3'"
               class="e-oper">
            <div @click.stop="fixplan(scope.row)"
                 title="固定sql计划"><i class="iconfont iconjiedian f12"></i></div>
          </div>
          <!-- 监控索引 -->
          <div v-else-if="item.prop == 'operaton4'"
               class="e-oper">
            <div @click.stop="monitorlIndex(scope.row)"
                 title="监控索引"><i class="iconfont iconjiankong f12"></i></div>
          </div>
          <!-- 取消监控索引 -->
          <div v-else-if="item.prop == 'operaton5'"
               class="e-oper">
            <div @click.stop="cancelIndex(scope.row)"
                 title="取消监控索引"><i class="iconfont iconquxiao f12"></i></div>
          </div>
          <!-- 下载 -->
          <div v-else-if="item.prop == 'operaton10'"
               class="e-oper">
            <div @click.stop="downloadSQL(scope.row)"
                 title="下载"><i class="iconfont icondownload--fill f12"></i></div>
          </div>
          <!-- 资源计划 -->
          <div v-else-if="item.prop == 'operaton6'"
               class="e-oper">
            <div @click.stop="startPlan((scope.row))"
                 v-show="scope.row.IS_TOP_PLAN == 'FALSE'"
                 title="启用"><i class="iconfont iconshezhiqiyong f12"></i></div>
            <div @click.stop="endPlan((scope.row))"
                 v-show="scope.row.IS_TOP_PLAN == 'TRUE'"><i class="iconfont iconquxiaoshezhiqiyong f12"
                 title="禁用"></i></div>
            <div @click.stop="deletePaln((scope.row))"><i class="iconfont icondelete-bin--line f12"></i></div>
          </div>
          <!-- 操作 -->
          <div v-else-if="item.prop == 'operaton7'"
               class="e-oper">
            <div @click.stop="editRow1(scope)"><i class="iconfont iconxie f12"></i></div>
            <div @click.stop="deleteRow1((scope.row))"><i class="iconfont iconshanchu f12"></i></div>
            <!-- 刷新按钮 -->
            <div v-show="item.type == 2"
                 @click.stop="refreshRow(scope.row,index)">
              <i class="el-icon-refresh"></i>
            </div>
          </div>
          <!-- 操作 -->
          <div v-else-if="item.prop == 'operaton8'"
               class="e-oper">
            <!-- 刷新按钮 -->
            <div @click.stop="refreshRow(scope.row,index,1)"
                 title="重建索引">
              <i class="el-icon-refresh"></i>
            </div>
          </div>
          <!-- 真正展示的信息  -->
          <div v-else-if="item.switch">
            <div v-if="scope.row[item.prop] == 1 ">
              <el-switch v-model="value1"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         disabled>
              </el-switch>
            </div>
            <div v-else-if="scope.row[item.prop]  == 'TRUE'">
              <el-switch v-model="value1"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         disabled>
              </el-switch>
            </div>
            <div v-else-if="scope.row[item.prop]  == 'FALSE'">
              <el-switch v-model="value2"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         disabled>
              </el-switch>
            </div>
            <div v-else>
              <el-switch v-model="value2"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         disabled>
              </el-switch>
            </div>
          </div>
          <!-- 真正展示的信息 insttype -->
          <div v-else-if="item.insttype">
            <div v-if="scope.row[item.prop] == 1">
              主库
            </div>
            <div v-else>
              备库
            </div>
          </div>
          <div v-else-if="item.prop == 'hostIP'">
            <div>{{formart(scope.row)}}</div>
          </div>
          <div v-else-if="item.prop == 'version'">
            <div>{{formart2(scope.row)}}</div>
          </div>
          <div v-else-if="item.prop == 'relatedHost'">
            <div>{{scope.row[item.prop].ip}}</div>
          </div>
          <!-- 数据库类型 -->
          <div v-else-if="item.prop == 'relatedDBVersion'">
            <div>{{scope.row[item.prop].version }}</div>
          </div>
          <div v-else-if="item.prop == 'SQL_TEXT'"
               @click="showSQL(scope.row)"
               class="table-fonts"
               :title="scope.row[item.prop]">
            <span>{{scope.row[item.prop]}}</span>
          </div>
          <div v-else-if="item.prop == 'SQL_ID'"
               @click="showSQLId(scope.row)"
               class="table-fonts"
               :title="scope.row[item.prop]">
            <span>{{scope.row[item.prop]}}</span>
          </div>
          <div v-else
               :title="scope.row[item.prop]"
               style="overflow: hidden;height: 21px;">
            <span>{{scope.row[item.prop]}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="dialogVisible">
      <q-dialog @confirm="confirm"
                :dialogVisible="dialogVisible"
                :sql="sql"
                @cancel="cancel"
                :status="sqlStatus"
                :title="sqlTitle"
                :awrId="awrId">
      </q-dialog>
    </div>
  </div>
</template>

<script>
import {
  deleteUser,
  deleteRole,
  menuDel,
  triggerDel,
  monitorDel,
  warnDel,
  warnDels,
  dbDel,
  obDel,
  loadHostInfo
} from "@/api/Oracle.js";
import { mainDel, hostDel, mtDateDel, warnDela, orDel } from "@/api/systemGer";
import qDialog from "./sqlDialog";
import { fixedSQLExecutionPlan } from '@/api/sqlMonitor'
import { reBuildIndex } from '@/api/DBPolling'
export default {
  components: {
    qDialog,
  },
  props: {
    status: "",
    tableSta: "",
    idFile: "",
    awrId: "",
    dbGroupId: '',
    selection: {
      type: String,
      default: () => {
        return 'selection'
      }
    },
    background: {
      type: String,
      default: () => {
        return '#ebecf0'
      }
    },
    column: {
      type: Array,
      default: () => {
        return [
          { label: "数据库名", prop: "name" },
          { label: "表空间名", prop: "size" },
          { label: "总大小", prop: "size" },
          { label: "已使用大小", prop: "size" },
          {
            label: "已使用(%)",
            prop: "number",
            width: "150",
            color: "#33c92e"
          },
          { label: "操作", prop: "operaton", width: "150" }
        ];
      }
    },
    // 传值显示
    tableData: ""
  },
  data () {
    return {
      sqlId: {},
      dialogSqlId: false,
      loadingFresh: false,
      sqlTitle: "SQL",
      sqlStatus: 1,
      sql: {},
      dialogVisible: false,
      showIndex: true,
      value1: true,
      value2: false
    };
  },
  watch: {},
  computed: {},
  mounted () {
    if (this.tableSta == false) {
      this.showIndex = this.tableSta;
    }
  },
  methods: {
    // sql ID 查看
    showSQLId (val) {
      this.$emit('showSQLId', val)
    },
    // 删除计划 
    deletePaln (val) {
      this.$emit('deletePaln', val)
    },
    // 启用
    startPlan (val) {
      this.$emit('startPlan', val)
    },
    // 禁用
    endPlan (val) {
      this.$emit('endPlan', val)
    },
    // 监控索引
    monitorlIndex (val) {
      this.$emit('cancel', val)
    },
    // 取消监控索引 
    cancelIndex (val) {
      this.$emit('cancel', val)
    },
    // 固定sql计划 
    fixplan (val) {
      this.$emit('plan', val.PLAN_HASH_VALUE)
    },
    // 查看sql计划 
    lockName (val) {
      this.$emit('lockPlan', val.SQL_ID)
    },
    // formart()
    formart (val) {
      if (val.host) {
        return val.host.hostIP
      } else {
        return val.hostIP
      }
    },
    // 格式化
    formart2 (val) {
      if (val.dbVersion) {
        return val.dbVersion.version + val.dbVersion.unit
      } else {
        return val.version
      }
    },
    //
    refreshRow (val, val2, val3) {
      if (val3) {
        this.$emit("refreshRow", val);
      } else {
        this.loadingFresh = true;
        loadHostInfo({ id: val.id })
          .then(result => {
            this.$message.success(result.msg);
            this.loadingFresh = false;
            this.$emit("refreshRow", true);
          })
          .catch(err => {
            this.MyMessageHtml.error({
              dangerouslyUseHTMLString: true,
              message: err.msg
            });
            this.loadingFresh = false;
          });
      }

    },
    // 下载
    downloadSQL (val) {
      this.$emit("downloadSQL", val);
    },
    // 修改profile
    profileUpdate (val, val2) {
      if (val2 == 'pdb') {
        return this.$emit('profileUpdate', val)
      }
      this.sqlTitle = "修改Profile";
      this.sqlStatus = 2;
      this.sql = val;
      this.sql.id = this.idFile;
      this.dialogVisible = true;

    },
    cancel () {
      this.dialogVisible = false;
    },
    //取消弹窗
    confirm (val) {
      if (val) {
        this.$emit("update", true);
      }
      this.dialogVisible = false;
    },
    // sql 弹窗
    showSQL (val) {
      if (this.status == "sql") {
        (this.sqlTitle = "SQL"), (this.dialogVisible = true);
        this.sql = val;
      }
    },
    // pdb资源计划
    // 修改
    editRow1 (val) {
      this.$emit("update", val.row);
    },
    // 删除 单个
    deleteRow1 (val) {
      this.$emit("deleteId", val);
    },
    // 修改
    editRow (val) {
      if (this.dbGroupId) {
        this.$emit("update", val.row, this.dbGroupId);
      } else {
        this.$emit("update", val.row);

      }
    },
    // 删除 单个
    deleteRow (val) {
      let par = [val];
      this.selectAll(par, 1);
    },
    // 真正的删除
    delete (val) {
      switch (this.status) {
        case 1:
          deleteUser(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 2:
          deleteRole(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 3:
          menuDel(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 4:
          triggerDel(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 5:
          monitorDel(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 6:
          warnDel(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 7:
          warnDels(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 8:
          dbDel(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 9:
          mainDel(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 10:
          hostDel(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 11:
          mtDateDel(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 12:
          warnDela(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        case 15:
          obDel(val)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("delectSuc", true);
            })
            .catch(err => {
              this.$message.success(err.msg);
            });
          break;
        default:
          break;
      }
    },
    // 删除多个
    selectAll (val, val2) {
      let ids = [];
      let id = "";
      if (val.length > 0) {
        val.forEach(item => {
          ids.push(item.id || item.oracleConfigId || item.mySQLConfigId);
        });
        id = ids.join(",");
        this.$emit("deleteId", id, val2, this.dbGroupId, val);
      } else {
        this.$emit("deleteId", "", val2, this.dbGroupId, val);
      }
    }
  },
  created () { }
};
</script>
<style lang="scss">
.n-table {
  width: 100%;
  .table-fonts {
    overflow: hidden;
    height: 21px;
    color: rgb(0, 168, 236);
    font-weight: bold;
    cursor: pointer;
  }
  .e-oper {
    display: flex;
    justify-content: left;
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
      margin-right: 20px;
    }
    .el-button {
      padding: 9px 20px;
      border-radius: 0px;
    }
    div:hover {
      border: 1px solid #d3effc;
      background: #d3effc;
      color: #0095d4;
    }
  }
  .el-table th,
  .el-table tr {
    background-color: #fefefe;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #eaeaea;
  }
  .el-table,
  .el-table__expanded-cell {
    background-color: #f6f7fa;
  }
  .el-table {
    color: #444547;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #f6f7fa;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ebecf0;
  }
  .el-table__empty-block {
    background-color: #fff;
  }
}
</style>