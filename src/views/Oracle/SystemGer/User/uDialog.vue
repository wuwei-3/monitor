<template>
  <!-- 公用弹窗样式 -->
  <div class="u-dialog">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name"
               v-if="update.id">修改用户</div>
          <div class="e-name"
               v-else>新增用户</div>
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
          <!-- 不能用for循环，不然el-input 无法赋值 -->
          <div class="n-body">
            <div class="y-span"><span>登录名称</span></div>
            <div class="y-put">
              <el-form-item prop="loginName">
                <el-input v-model="ruleForm.loginName"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>用户名称</span></div>
            <div class="y-put">
              <el-form-item prop="userName">
                <el-input v-model="ruleForm.userName"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>密码</span></div>
            <div class="y-put">
              <!-- 修改不校验密码 -->
              <el-form-item prop="pwd"
                            v-if="!update.id">
                <el-input v-model="
                            ruleForm.pwd"
                          type="password">
                </el-input>
              </el-form-item>
              <el-form-item v-else>
                <el-input v-model="
                            ruleForm.pwd"
                          type="password">
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>确认密码</span></div>
            <div class="y-put">
              <el-form-item prop="suerPas">
                <el-input v-model="ruleForm.suerPas"
                          type="password">
                </el-input>
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
            <div class="y-span"><span>是否接受邮件</span></div>
            <div class="y-put switch">
              <el-switch v-model="ruleForm.reMail"
                         active-color="#13ce66"
                         active-value="1"
                         inactive-value="0"
                         inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>是否告警通知</span></div>
            <div class="y-put switch">
              <el-switch v-model="ruleForm.reWarnNotice"
                         active-color="#13ce66"
                         active-value="1"
                         inactive-value="0"
                         inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>EMAIL</span></div>
            <div class="y-put">
              <el-form-item prop="email">
                <el-input v-model="ruleForm.email"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>手机号码</span></div>
            <div class="y-put">
              <el-form-item>
                <el-input v-model="ruleForm.telephone"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>角色</span></div>
            <div class="y-put">
              <el-select v-model="ruleForm.roleId"
                         placeholder="请选择角色">
                <el-option v-for="item in optionsRole"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
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
import aSelect from "@/components/aSelect";
import { userList, save, roleList } from "@/api/Oracle.js";
export default {
  components: {
    aSelect
  },
  props: {
    visible: false,
    optionsRole: "",
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
    let validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 角色列表
      rules: {
        loginName: [
          { required: true, message: "请输入登录名", trigger: "change" }
        ],
        userName: [
          { required: true, message: "请输入用户名称", trigger: "change" }
        ],
        pwd: [{ required: true, message: "请输入密码", trigger: "change" }],
        finput: [{ required: true, message: "请输入EMAIL", trigger: "change" }],
        suerPas: [{ validator: validatePass3, trigger: "blur" }]
      },
      loading: false,
      ruleForm: {
        suerPas: "",
        loginName: "",
        userName: "",
        pwd: "",
        finput: "",
        telephone: "",
        roleId: "",
        status: "1",
        reMail: "1",
        reWarnNotice: "1"
      }
    };
  },
  mounted () {
    let update = this.$_.cloneDeep(this.update);
    if (update.id) {
      update.status = JSON.stringify(update.status);
      update.reMail = JSON.stringify(update.reMail);
      update.reWarnNotice = JSON.stringify(update.reWarnNotice);
      delete update.isSys;
      let id = update.sysRoleId ? update.sysRoleId : "";
      delete update.role;
      let par = {
        ...update,
        roleId: id
      };
      this.ruleForm = par;
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          // 处理数据保存
          delete this.ruleForm.suerPas;
          save(this.ruleForm)
            .then(result => {
              this.$emit("comfirm", 1);
              this.loading = false
              this.$message.success(result.msg);
            })
            .catch(err => {
              this.loading = false
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
    handleCancel () {
      this.$emit("cancel", false);
    }
  }
};
</script>
<style lang="scss">
.u-dialog {
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
        width: 100px;
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