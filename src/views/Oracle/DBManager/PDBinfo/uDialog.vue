<template>
  <!-- 公用弹窗样式 -->
  <div class="pdb-dialog">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               :close-on-press-escape="false"
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name">修改PDB</div>
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
            <div class="y-span"><span>PDB名称</span></div>
            <div class="y-put">
              <el-form-item prop="pdbName">
                <el-input v-model="ruleForm.pdbName"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>MAXSIZE(M)</span></div>
            <div class="y-put">
              <el-form-item prop="maxSize">
                <el-input v-model="ruleForm.maxSize"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>TMPSIZE(M)</span></div>
            <div class="y-put">
              <el-form-item prop="tmpSize">
                <el-input v-model="ruleForm.tmpSize"></el-input>
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
import { modifyPDBSize } from "@/api/sqlManager";
export default {
  components: {
    aSelect
  },
  props: {
    visible: false,
    update: {},
    file: '',
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
        pdbName: [
          { required: true, message: "请输入数据库PDB名", trigger: "change" }
        ],
        maxSize: [
          { required: true, message: "请输入MAXSIZE(M)", trigger: "change" }
        ],
        tmpSize: [
          { required: true, message: "请输入TMPSIZE(M)", trigger: "change" }
        ]
      },

      ruleForm: {
        id: '',
        pdbName: '',
        maxSize: '',
        tmpSize: '',
      }
    };
  },
  mounted () {
    let update = this.$_.cloneDeep(this.update);
    let par = {
      id: this.file.id,
      pdbName: update.NAME,
      maxSize: update.MAX_SIZE,
      tmpSize: update.TEMP_SIZE,
    }
    this.ruleForm = par
  },
  methods: {
    // 
    getOPtions (val) {
      this.ruleForm.type = val
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.id = this.file.id
          // 处理数据保存
          this.loading = true
          modifyPDBSize(this.ruleForm)
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
.pdb-dialog {
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