<template>
  <!-- 公用弹窗样式 -->
  <div class="mc-dialog">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name"
               v-if="update.id">修改发件箱配置</div>
          <div class="e-name"
               v-else>新增发件箱配置</div>
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
            <div class="y-span"><span>服务器地址</span></div>
            <div class="y-put">
              <el-form-item prop="smtpserver">
                <el-input v-model="ruleForm.smtpserver"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>邮箱地址</span></div>
            <div class="y-put">
              <el-form-item prop="userName">
                <el-input v-model="ruleForm.userName"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>端口号</span></div>
            <div class="y-put">
              <el-form-item prop="port">
                <el-input v-model="ruleForm.port"></el-input>
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
import { mainSave } from "@/api/systemGer.js";
export default {
  components: {
    aSelect
  },
  props: {
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
    let checkAge = (rule, value, callback) => {
      let val = Number(value);
      if (!val) {
        return callback(new Error("请输入数字值"));
      } else {
        return callback();
      }
    };
    return {
      loading: false,
      // 角色列表
      options: [],
      rules: {
        smtpserver: [
          { required: true, message: "请输入服务器地址", trigger: "change" }
        ],
        userName: [
          { required: true, message: "请输入邮箱地址", trigger: "change" }
        ],
        port: [{ validator: checkAge, trigger: "change" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "change" }]
      },

      ruleForm: {
        smtpserver: "",
        userName: "",
        port: 465,
        pwd: ""
      }
    };
  },
  mounted () {
    let update = this.$_.cloneDeep(this.update);
    if (update.id) {
      this.ruleForm = update;
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 处理数据保存
          this.loading = true
          mainSave(this.ruleForm)
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
.mc-dialog {
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
        width: 160px;
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