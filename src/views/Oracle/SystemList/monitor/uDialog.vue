<template>
  <!-- 公用弹窗样式 -->
  <div class="mo-dialog">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name"
               v-if="update.id">修改监控数据保留配置</div>
          <div class="e-name"
               v-else>新增监控数据保留配置</div>
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
            <div class="y-span"><span>编码</span></div>
            <div class="y-put">
              <el-select v-model="ruleForm.code"
                         placeholder="请选择编码">
                <el-option v-for="(item,index) in codeList"
                           :key="index"
                           :label="item.text"
                           :value="item.text">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>保留天数</span></div>
            <div class="y-put">
              <el-form-item prop="days">
                <el-input v-model="ruleForm.days"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>备注</span></div>
            <div class="y-put">
              <el-form-item>
                <el-input v-model="ruleForm.remark"></el-input>
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
import { mtDateSave } from "@/api/systemGer.js";
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
    },
    codeList: ''
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
        code: [{ required: true, message: "请输入编码", trigger: "change" }],
        days: [{ validator: checkAge, trigger: "change" }]
      },

      ruleForm: {
        code: "",
        days: "",
        remark: ""
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
          mtDateSave(this.ruleForm)
            .then(result => {
              this.$emit("comfirm", 1);
              this.$message.success(result.msg);
              this.loading = false
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
.mo-dialog {
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
        width: 220px;
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