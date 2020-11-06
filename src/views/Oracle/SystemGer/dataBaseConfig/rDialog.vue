<template>
  <!-- 公用弹窗样式 -->
  <div class="r-dataD">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name"
               v-if="update.id">修改数据库版本</div>
          <div class="e-name"
               v-else>新增数据库版本</div>
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
            <div class="y-span"><span>数据库类型</span></div>
            <div class="y-put">
              <a-selet :options="reportOption"
                       @getOPtions="getOPtions"
                       :title="'数据库类型'"
                       :reportId="ruleForm.dbType"></a-selet>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>版本号</span></div>
            <div class="y-put">
              <el-form-item prop="version">
                <el-input v-model="ruleForm.version"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>版本单位</span></div>
            <div class="y-put">
              <el-form-item>
                <el-input v-model="ruleForm.unit"></el-input>
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
import aSelet from "@/components/mSelect";
import { userList, dbSave } from "@/api/Oracle.js";
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
      rules: {
        dbType: [
          { required: true, message: "请输入数据库类型", trigger: "change" }
        ],
        version: [{ validator: checkAge, trigger: "change" }],
        unit: [{ required: true, message: "请输入版本单位", trigger: "change" }]
      },
      ruleForm: {
        dbType: "",
        version: "",
        unit: ""
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
      this.ruleForm.dbType = this.reportOption[val - 1].name;
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 处理数据保存
          this.loading = true
          dbSave(this.ruleForm)
            .then(result => {
              this.$emit("comfirm", 1);
              this.loading = false
              this.$message.success(result.msg);
            })
            .catch(err => {
               this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
              this.loading = false
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
.r-dataD {
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