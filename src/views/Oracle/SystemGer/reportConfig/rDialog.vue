<template>
  <!-- 公用弹窗样式 -->
  <div class="m-repD">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name"
               v-if="update.id">修改告警项配置</div>
          <div class="e-name"
               v-else>新增告警项配置</div>
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
            <div class="y-span"><span>监控项</span></div>
            <div class="y-put">
              <a-select :options="reportOption"
                        @getOPtions="getOPtions"
                        :title="'请选择监控项'"
                        :reportId="reportId"></a-select>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>是否存在阈值</span></div>
            <div class="y-put switch">
              <el-switch v-model="ruleForm.isMetric"
                         active-color="#13ce66"
                         active-value="1"
                         inactive-value="0"
                         inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>是否启用调度规则</span></div>
            <div class="y-put switch">
              <el-switch v-model="ruleForm.isTriggerRule"
                         active-color="#13ce66"
                         active-value="1"
                         inactive-value="0"
                         inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>执行命令</span></div>
            <div class="y-put">
              <el-form-item>
                <el-input v-model="ruleForm.command"></el-input>
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
import aSelect from "@/components/mSelect";
import { userList, warnSaves, monitorPage } from "@/api/Oracle.js";
export default {
  components: {
    aSelect
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
  data () {
    var checkAge = (rule, value, callback) => {
      let val = Number(value);
      if (!val) {
        return callback(new Error("请输入数字值"));
      } else {
        return callback();
      }
    };
    return {
      loading: false,
      reportId: "",
      rules: {
        monitorItemId: [{ validator: checkAge, trigger: "change" }]
      },

      ruleForm: {
        monitorItemId: "",
        isMetric: "1",
        isTriggerRule: "1",
        command: ""
      }
    };
  },
  mounted () {
    let update = this.$_.cloneDeep(this.update);
    if (update.id) {
      update.isMetric = JSON.stringify(update.isMetric);
      update.isTriggerRule = JSON.stringify(update.isTriggerRule);
      this.ruleForm = update;
      this.reportId = update.monitorItemId;
    }
  },
  computed: {},
  methods: {
    // 下拉框值
    getOPtions (val) {
      this.ruleForm.monitorItemId = val;
    },

    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 处理数据保存
          this.loading = true
          warnSaves(this.ruleForm)
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
  },
  created () { }
};
</script>
<style lang="scss">
.m-repD {
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