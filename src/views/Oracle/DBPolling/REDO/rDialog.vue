<template>
  <!-- 公用弹窗样式 -->
  <div class="m-role">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name">新增REDO</div>
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
            <div class="y-span"><span>LOGTYPE</span></div>
            <div class="y-put">
              <a-select :options="options"
                        :reportId="reportId"
                        @getOPtions="getOPtions"></a-select>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>GROUP</span></div>
            <div class="y-put">
              <el-form-item prop="group">
                <el-input v-model="ruleForm.group"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>MEMBER</span></div>
            <div class="y-put">
              <el-form-item prop="member">
                <el-input v-model="ruleForm.member"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>SIZE(M)</span></div>
            <div class="y-put">
              <el-form-item prop="size">
                <el-input v-model="ruleForm.size"></el-input>
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
import aSelect from "@/components/mSelect6";
import { createREDO } from "@/api/DBPolling";
export default {
  components: {
    aSelect
  },
  props: {
    redoId: '',
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
      reportId: 0,
      options: [
        {
          id: 0,
          name: 'STANDBY',
        },
        {
          id: 1,
          name: 'NORMAL',
        }
      ],
      loading: false,
      rules: {
        member: [
          { required: true, message: "请输入MEMBER", trigger: "change" }
        ],
        group: [
          { validator: checkAge, trigger: "change" }
        ],
        size: [{ validator: checkAge, trigger: "change" }]
      },
      ruleForm: {
        id: '',
        logtype: "STANDBY",
        group: "",
        member: "",
        size: "",
      }
    };
  },
  mounted () {
    let update = this.$_.cloneDeep(this.update);
    if (update.id) {
      this.ruleForm = update;
    }
  },
  computed: {},
  methods: {
    getOPtions (val) {
      if (val) {
        this.ruleForm.logtype = this.options[val].name
      } else {
        this.ruleForm.logtype = ''
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.ruleForm.logtype) {
            return this.$message.error('请选择LOGTYPE');
          }
          this.ruleForm.id = this.redoId
          // 处理数据保存d
          this.loading = true
          createREDO(this.ruleForm)
            .then(result => {
              this.$emit("comfirm", true);
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
.m-role {
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
        width: 190px;
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
        padding: 10px 35px;
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