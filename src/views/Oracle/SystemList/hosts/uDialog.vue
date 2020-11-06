<template>
  <!-- 公用弹窗样式 -->
  <div class="ho-dialog"
       v-loading="loading">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag>
      <div class="g-main">
        <div class="n-title">
          <div class="e-name"
               v-if="update.id">修改主机配置</div>
          <div class="e-name"
               v-else>新增主机配置</div>
          <div class="e-border"></div>
          <div class="e-close">
            <i class="el-icon-circle-close"
               @click="handleCancel"></i>
          </div>
        </div>
        <el-form :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm"
                 class="demo-ruleForm">
          <div class="n-body">
            <div class="y-span"><span>系统类型</span></div>
            <div class="y-put">
              <a-selet :options="reportOption"
                       @getOPtions="getOPtions"
                       :title="'系统类型'"
                       :reportId="ruleForm.osType"></a-selet>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>IP</span></div>
            <div class="y-put">
              <el-form-item prop="ip">
                <el-input v-model="ruleForm.ip"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>端口</span></div>
            <div class="y-put">
              <el-form-item prop="port">
                <el-input v-model="ruleForm.port"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>用户名</span></div>
            <div class="y-put">
              <el-form-item prop="userName">
                <el-input v-model="ruleForm.userName"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>密码</span></div>
            <div class="y-put">
              <el-form-item v-if="update.id">
                <el-input v-model="ruleForm.pwd"
                          type="password"></el-input>
              </el-form-item>
              <el-form-item prop="pwd"
                            v-else>
                <el-input v-model="ruleForm.pwd"
                          type="password"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body"
               v-if="!update.id">
            <div class="y-span"><span>确认密码</span></div>
            <div class="y-put">
              <el-form-item v-if="update.id">
                <el-input v-model="ruleForm.qrpwd"
                          type="password"></el-input>
              </el-form-item>
              <el-form-item prop="qrpwd"
                            v-else>
                <el-input v-model="ruleForm.qrpwd"
                          type="password"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>启用状态</span></div>
            <div class="y-put switch">
              <el-switch v-model="ruleForm.status"
                         active-color="#13ce66"
                         active-value="1"
                         inactive-value="0"
                         inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>链路状态</span></div>
            <div class="y-put switch">
              <el-switch v-model="ruleForm.linkStatus"
                         active-color="#13ce66"
                         active-value="1"
                         inactive-value="0"
                         inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
        </el-form>
        <div class="n-bottom">
          <el-button type="primary"
                     @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="info"
                     @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import aSelet from "@/components/mSelect";
import { hostSave } from "@/api/systemGer";
export default {
  components: {
    aSelet
  },
  props: {
    reportOption: "",
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
  data() {
    let checkAge = (rule, value, callback) => {
      let val = Number(value);
      if (!val) {
        return callback(new Error("请输入数字值"));
      } else if (val > 65535) {
        return callback(new Error("超出范围最大值"));
      } else {
        return callback();
      }
    };
    let validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.ruleForm.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      // 角色列表
      options: [],
      rules: {
        osType: [
          { required: true, message: "请输入系统类型", trigger: "change" }
        ],
        ip: [{ required: true, message: "请输入IP", trigger: "change" }],
        port: [{ validator: checkAge, trigger: "change" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "change" }],
        qrpwd: [{ validator: validatePass3, trigger: "change" }],
        userName: [
          { required: true, message: "请输入用户名", trigger: "change" }
        ]
      },

      ruleForm: {
        qrpwd: "",
        osType: "",
        ip: "",
        port: "22",
        userName: "",
        pwd: "",
        status: "1",
        linkStatus: "1"
      }
    };
  },
  mounted() {
    let update = this.$_.cloneDeep(this.update);
    if (update.id) {
      update.status = JSON.stringify(update.status);
      update.linkStatus = JSON.stringify(update.linkStatus);
      delete update.osName;
      delete update.commandParams;
      delete update.physicalMem;
      delete update.cpuCores;
      delete update.cpuInfo;
      delete update.hostName;
      delete update.isFlashCard;
      this.ruleForm = update;
    }
  },
  methods: {
    // 系统类型
    getOPtions(val) {
      this.ruleForm.osType = val ? this.reportOption[val - 1].name : "";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          let stat = this.$_.cloneDeep(this.ruleForm);
          stat.status = Number(stat.status);
          stat.linkStatus = Number(stat.linkStatus);
          delete stat.qrpwd;
          // 处理数据保存
          hostSave(stat)
            .then(result => {
              this.$emit("comfirm", 1);
              this.loading = false;
              this.$message.success(result.msg);
            })
            .catch(err => {
              this.loading = false;
               this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
            });
        } else {
          return false;
        }
      });
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("cancel", false);
    }
  }
};
</script>
<style lang="scss">
.ho-dialog {
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
    .n-body {
      display: flex;
      height: 50px;
      align-items: center;
      margin-bottom: 10px;
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