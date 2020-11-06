<template>
  <!-- 公用弹窗样式 -->
  <div class="ut-dialog">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               :close-on-press-escape="false"
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name"
               v-if="update.id">修改表空间</div>
          <div class="e-name"
               v-else>创建表空间</div>
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
            <div class="y-span"><span>表空间名称</span></div>
            <div class="y-put">
              <el-form-item prop="tbsName">
                <el-input v-model="ruleForm.tbsName"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>文件路径</span></div>
            <div class="y-put">
              <el-form-item prop="filePath">
                <el-input v-model="ruleForm.filePath"
                          placeholder="Window系统请注意文件路径转义，如\t要写成\\t"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>文件大小（M）</span></div>
            <div class="y-put">
              <el-form-item prop="size">
                <el-input v-model="ruleForm.size"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>文件类型</span></div>
            <div class="y-put">
              <a-select :options="reportOption"
                        @getOPtions="getOPtions"
                        :title="'文件类型'"
                        :reportId="ruleForm.type"></a-select>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>自动扩展</span></div>
            <div class="y-put switch">
              <el-switch v-model="ruleForm.autoExtend"
                         active-color="#13ce66"
                         active-value="on"
                         inactive-value="off"
                         inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>自动扩展大小(M)</span></div>
            <div class="y-put">
              <el-form-item prop="size">
                <el-input v-model="ruleForm.nextSize"
                          :disabled="ruleForm.autoExtend == 'off'"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>最大大小(M)</span></div>
            <div class="y-put">
              <el-form-item prop="size">
                <el-input v-model="ruleForm.maxSize"
                          :disabled="ruleForm.autoExtend == 'off'"></el-input>
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
import { createTableSpace } from "@/api/sqlManager";
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
      reportOption: [
        {
          id: 0,
          name: '用户表空间'
        },
        {
          id: 1,
          name: 'UNDO'
        },
        {
          id: 2,
          name: 'TEMPORARY'
        },
      ],
      loading: false,
      // 角色列表
      options: [],
      rules: {
        tbsName: [
          { required: true, message: "请输入表空间名称", trigger: "change" }
        ],
        filePath: [
          { required: true, message: "请输入文件路径", trigger: "change" }
        ],
        size: [{ validator: checkAge, trigger: "change" }],
      },

      ruleForm: {
        id: '',
        dbName: '',
        tbsName: "",
        filePath: "",
        size: '',
        type: 0,
        autoExtend: 'off',
        maxSize: null,
        nextSize: null
      }
    };
  },
  mounted () {
    let update = this.$_.cloneDeep(this.update);
    if (update) {
      // this.ruleForm = update;
    }
  },
  methods: {
    // 
    getOPtions (val) {
      this.ruleForm.type = val
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.type != 0 && this.ruleForm.type) {
            return this.$message.error('请选择文件类型')
          }
          if (this.ruleForm.autoExtend == 'off') {
            this.ruleForm.maxSize = null;
            this.ruleForm.nextSize = null;
          }
          this.ruleForm.id = this.file.id
          this.ruleForm.dbName = this.file.dbName ? this.file.dbName : ';'
          // 处理数据保存
          this.loading = true
          createTableSpace(this.ruleForm)
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
.ut-dialog {
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