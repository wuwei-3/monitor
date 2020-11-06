<template>
  <!-- 公用弹窗样式 -->
  <div class="dc-dialog2">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               top="10vh"
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name"
               v-if="update.mySQLConfigId">修改数据库组员</div>
          <div class="e-name"
               v-else>新增数据库组员</div>
          <div class="e-border"></div>
          <div class="e-close">
            <i class="el-icon-circle-close"
               @click="handleCancel"></i>
          </div>
        </div>
        <div class="n-table">
          <div class="e-flex">
            <div class="y-span"><span>所属主机</span></div>
            <div class="y-put">
              <el-select v-model="ruleForm.hostId"
                         placeholder="请选择所属主机">
                <el-option v-for="item in hostIds"
                           :key="item.id"
                           :label="item.ip"
                           :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="e-flex">
            <div class="y-span"><span>数据库版本</span></div>
            <div class="y-put">
              <el-select v-model="ruleForm.dbVersionId"
                         placeholder="请选择数据库版本">
                <el-option v-for="item in dbVersionIds"
                           :key="item.id"
                           :label="item.version +' '+ item.unit"
                           :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="n-table">
          <div class="e-flex">
            <div class="y-span"><span>实例类型</span></div>
            <div class="y-put">
              <el-select v-model="ruleForm.insttype"
                         placeholder="请选择实例类型">
                <el-option v-for="item in instTypes"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="e-flex">
            <div class="y-span"><span>监听端口</span></div>
            <div class="y-put">
              <el-input v-model="ruleForm.port"></el-input>
            </div>
          </div>
        </div>
        <div class="n-table">
          <div class="e-flex">
            <div class="y-span"><span>连接数据库用户名</span></div>
            <div class="y-put">
              <el-input v-model="ruleForm.dbUser"></el-input>
            </div>
          </div>
          <div class="e-flex">
            <div class="y-span"><span>连接数据库密码</span></div>
            <div class="y-put">
              <el-input v-model="ruleForm.dbUserPwd"
                        show-password></el-input>
            </div>
          </div>
        </div>
        <div class="n-table">
          <div class="e-flex flex100">
            <div class="y-span"><span>数据库日志路径</span></div>
            <div class="y-put flex100">
              <el-input v-model="ruleForm.slowLog"></el-input>
            </div>
          </div>
        </div>
        <div class="n-bottom">
          <el-button type="primary"
                     @click="submitForm()">保存</el-button>
          <el-button type="info"
                     @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import aSelet from "@/components/aSelect";
import { hostList, hostIps, orSaveMy } from "@/api/systemGer.js";
import { dbList, oblIst } from "@/api/Oracle.js";
export default {
  components: {
    aSelet
  },
  props: {
    hostIds: "",
    oracleTypeIds: "",
    dbVersionIds: "",
    // 三个下拉框
    dbGroupId: "",
    visible: false,
    update: {},
    mDialog: {
      default: () => {
        return {
          width: "711px"
        };
      }
    }
  },
  data () {
    return {
      loading: false,
      value5: "1",
      value: "",
      isOgg: "0",
      dgType: true,
      racType: true,
      options: [],
      instTypes: [
        {
          id: 1,
          name: "主库"
        },
        {
          id: 2,
          name: "备库"
        }
      ],
      ruleForm: {
        hostId: "", //所属主机
        dbVersionId: "", //数据库版本
        insttype: 1, //实例类型
        dbUser: "root", //连接数据库用户名
        dbUserPwd: "", //连接数据库密码
        slowLog: "", //	慢查询日志路径
        port: 3306,
      },
      // 下拉框查询
      User: {
        pageNum: 1,
        pageSize: 50
      }
    };
  },
  mounted () {
    let update = this.$_.cloneDeep(this.update);
    if (update.mySQLConfigId) {
      let par = {
        groupId: this.dbGroupId,
        hostId: update.host.hostId, //所属主机
        dbVersionId: update.dbVersion.versionId, //数据库版本
        insttype: Number(update.insttype), //实例类型
        dbName: update.dbName, //数据库SID
        port: update.listenerPort, //监听端口
        dbUser: update.dbUser, //连接数据库用户名
        dbUserPwd: "", //连接数据库密码
        id: update.mySQLConfigId, // id
        slowLog: update.slowLog, //慢查询日志路径
      };
      this.ruleForm = par;
    }
  },
  methods: {
    // 保存
    submitForm () {
      this.loading = true;
      let list = this.$_.cloneDeep(this.ruleForm);
      let par = {};
      if (this.update.groupId) {
        par = {
          ...list
        };
      } else {
        par = {
          ...list,
          groupId: this.dbGroupId
        };
      }
      // 处理数据保存;
      orSaveMy(par)
        .then(result => {
          this.$emit("comfirm", 1);
          this.$message.success(result.msg);
          this.loading = false;
        })
        .catch(err => {
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          this.loading = false;
        });
    },
    // 关闭弹窗
    handleCancel () {
      this.$emit("cancel", false);
    }
  }
};
</script>
<style lang="scss">
.dc-dialog2 {
  width: 711px;
  height: 579px;
  background-color: #ffffff;
  border-radius: 5px;
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 20px;
  }
  .g-main {
    height: 100%;
    width: 100%;
    .n-table {
      display: flex;
      width: 100%;
      margin-bottom: 15px;
      .e-flex {
        width: 50%;
        display: flex;
        margin-left: 4px;
        .y-span {
          min-width: 150px;
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
          width: 180px;
        }
        .y-put {
          .el-input {
            width: 180px;
          }
        }
      }
      .flex100 {
        width: 100%;
        .flex100 {
          width: 100%;
          .el-input {
            width: 100%;
          }
        }
      }
      .e-flex5 {
        flex: 1;
      }
    }
    .n-title {
      height: 50px;
      line-height: 50px;
      color: #333333;
      font-weight: bold;
      font-size: 20px;
      position: relative;
      .e-name {
        position: absolute;
        width: 150px;
        padding: 0 5px;
        margin-left: 10px;
        z-index: 10;
        background: #fff;
      }
      .e-border {
        border-bottom: 1px solid #eaeaea;
        position: absolute;
        top: 26px;
        width: 100%;
      }
      .e-close {
        position: absolute;
        top: 0px;
        right: 0;
        font-size: 24px;
        &:hover {
          color: #00a2e7;
        }
      }
    }
    .n-bottom {
      .el-button {
        padding: 9px 35px;
        border-radius: 0px;
      }
    }
  }
}
</style>