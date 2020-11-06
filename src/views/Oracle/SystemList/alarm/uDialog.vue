<template>
  <!-- 公用弹窗样式 -->
  <div class="uc-dialog">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name"
               v-if="update.id">修改告警</div>
          <div class="e-name"
               v-else>新增告警</div>
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
            <div class="y-span"><span>告警项</span></div>
            <div class="y-put">
              <el-select v-model="ruleForm.warnItemId"
                         placeholder="请选择告警项"
                         :popper-append-to-body="false"
                         @change="changeWarn">
                <el-option v-for="opt in warnItems"
                           :key="opt.id"
                           :label="opt.name"
                           :value="opt.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>告警级别</span></div>
            <div class="y-put">
              <el-select v-model="ruleForm.warnLevelId"
                         placeholder="请选择告警级别"
                         :popper-append-to-body="false">
                <el-option v-for="opt in warnLevels"
                           :key="opt.id"
                           :label="opt.name"
                           :value="opt.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="n-body"
               v-show="isTriggerRuleStatus">
            <div class="y-span"><span>调度规则</span></div>
            <div class="y-put">
              <el-select v-model="ruleForm.triggerRuleId"
                         placeholder="请选择调度规则"
                         :popper-append-to-body="false">
                <el-option v-for="opt in triggerRules"
                           :key="opt.id"
                           :label="opt.name"
                           :value="opt.id">
                </el-option>
              </el-select>
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
              <el-switch v-model="ruleForm.isSendMail"
                         active-color="#13ce66"
                         active-value="1"
                         inactive-value="0"
                         inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>邮件频率</span></div>
            <div class="y-put">
              <el-form-item prop="sendMailFreq">
                <el-input v-model="ruleForm.sendMailFreq"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body"
               v-show="isMetricStatus">
            <div class="y-span"><span>阀值</span></div>
            <div class="y-put">
              <el-form-item>
                <el-input v-model="ruleForm.metric"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>告警信息</span></div>
            <div class="y-put">
              <el-form-item prop="info">
                <el-input v-model="ruleForm.info"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>告警描述</span></div>
            <div class="y-put">
              <el-form-item prop="describe">
                <el-input v-model="ruleForm.describe"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>意见建议</span></div>
            <div class="y-put">
              <el-form-item prop="suggest">
                <el-input v-model="ruleForm.suggest"></el-input>
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
import {
  userList,
  save,
  roleList,
  warnItems,
  warnList,
  triggerList
} from "@/api/Oracle.js";
import { warnSave } from "@/api/systemGer.js";
export default {
  components: {
    aSelect
  },
  props: {
    visible: false,
    update: {},
    warnItems: '', //告警项
    warnLevels: '', //告警级别
    triggerRules: '', // 调度规则
    mDialog: {
      default: () => {
        return {
          width: "711px"
        };
      }
    }
  },
  data () {
    let checkAge1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入阀值"));
      }
      let val = Number(value);
      if (!val) {
        return callback(new Error("请输入数字值"));
      } else {
        return callback();
      }
    };
    let checkAge2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入邮件频率"));
      }
      let val = Number(value);
      if (!val) {
        return callback(new Error("请输入数字值"));
      } else {
        return callback();
      }
    };
    return {
      loading: false,
      rules: {
        info: [
          { required: true, message: "请输入告警信息", trigger: "change" }
        ],
        metric: [
          { validator: checkAge1, trigger: "change" }
        ],
        describe: [
          { required: true, message: "请输入告警描述", trigger: "change" }
        ],
        sendMailFreq: [
          { validator: checkAge2, trigger: "change" }
        ],
        suggest: [
          { required: true, message: "请输入意见建议", trigger: "change" }
        ]
      },

      ruleForm: {
        warnItemId: "",
        warnLevelId: "",
        triggerRuleId: "",
        metric: "",
        status: "1",
        isSendMail: "1",
        sendMailFreq: "",
        info: "",
        describe: "",
        suggest: "",
        sendMailFreq: '',
      },
      isMetricStatus: true,
      isTriggerRuleStatus: true
    };
  },
  mounted () {
    let update = this.$_.cloneDeep(this.update);
    if (update.id) {
      update.status = JSON.stringify(update.status);
      update.isSendMail = JSON.stringify(update.isSendMail);
      this.changeWarn(update.warnItemId)
      this.ruleForm = update;
    }
  },
  methods: {
    //  选择id
    changeWarn (val) {
      let status = {}
      this.warnItems.forEach(item => {
        if (item.id == val) {
          return status = item
        }
      });
      if (status.isMetric == 0) {
        this.isMetricStatus = false
        this.ruleForm.metric = ''
      } else {
        this.isMetricStatus = true
      }
      if (status.isTriggerRule == 0) {
        this.isTriggerRuleStatus = false
        this.ruleForm.triggerRuleId = ''
      } else {
        this.isTriggerRuleStatus = true
      }
    },
    // 新增
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.ruleForm.warnItemId) {
            return this.$message.error('请选择告警项ID')
          }
          if (!this.ruleForm.warnLevelId) {
            return this.$message.error('请选择告警级别ID')
          }
          this.loading = true
          // 处理数据保存
          warnSave(this.ruleForm)
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
.uc-dialog {
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