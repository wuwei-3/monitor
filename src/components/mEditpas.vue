<template>
  <!-- 修改密码 -->
  <div class="m-editpas">
    <el-dialog title="修改密码"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="400px"
               :show-close='true'
               :before-close="cancel"
               v-dialogDrag>
      <div>
        <el-form :model="ruleForm"
                 status-icon
                 :rules="rules"
                 ref="ruleForm"
                 class="demo-ruleForm">
          <div class="e-dels">
            <div class="l-span"><span>原始密码</span></div>
            <div class="l-put">
              <el-form-item prop="oldPassword">
                <el-input type="password"
                          v-model="ruleForm.oldPassword"
                          autocomplete="off"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="e-dels">
            <div class="l-span"><span>新密码</span></div>
            <div class="l-put">
              <el-form-item prop="newPassword">
                <el-input type="password"
                          v-model="ruleForm.newPassword"
                          autocomplete="off"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="e-dels">
            <div class="l-span"><span>确认密码</span></div>
            <div class="l-put">
              <el-form-item prop="newPassword1">
                <el-input type="password"
                          v-model="ruleForm.newPassword1"
                          autocomplete="off"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="e-btn">
            <el-form-item>
              <el-button type="info"
                         @click="cancel">取消</el-button>
              <el-button type="primary"
                         @click="submitForm('ruleForm')">确认</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { edit } from "@/api/login.js";
export default {
  components: {},
  props: {
    visible: false
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原始密码"));
      } else {
        if (this.ruleForm.oldPassword !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else {
        if (this.ruleForm.newPassword !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPassword: "",
        newPassword: "",
        newPassword1: ""
      },
      rules: {
        oldPassword: [{ validator: validatePass, trigger: "blur" }],
        newPassword: [{ validator: validatePass2, trigger: "blur" }],
        newPassword1: [{ validator: validatePass3, trigger: "blur" }]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },
    // 用户提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 去除不需要的属性
          let par = {
            oldPassword: this.ruleForm.oldPassword,
            newPassword: this.ruleForm.newPassword
          };
          edit(par)
            .then(result => {
              this.$message.success(result.msg);
              this.$emit("cancel", true);
            })
            .catch(err => {
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss">
.m-editpas {
  height: 150px;
  .el-dialog__header {
    padding: 8px 20px 8px;
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
  }
  .e-name {
    height: 50px;
    line-height: 50px;
    text-align: left;
    font-size: 25px;
    font-weight: bold;
  }
  .e-dels {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    .l-span {
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
    .l-put {
      flex: 1;
      .el-form-item {
        margin-bottom: 0px;
      }
      .el-input__inner {
        border-radius: 0px;
      }
    }
  }
  .e-btn {
    text-align: center;
    height: 40px;
    line-height: 40px;
    margin-top: 5px;
    .el-button {
      padding: 9px 35px;
      border-radius: 0px;
    }
  }
}
</style>