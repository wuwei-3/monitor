<template>
  <!-- 公用弹窗样式 -->
  <div class="resourcedialog">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               :close-on-press-escape="false"
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name">创建资源计划</div>
          <div class="e-border"></div>
          <div class="e-close">
            <i class="el-icon-circle-close"
               @click="handleCancel"></i>
          </div>
        </div>
        <div class="n-body">
          <div class="y-span"><span>计划名称</span></div>
          <div class="y-put">
            <el-input v-model="ruleForm.planName"></el-input>
          </div>
        </div>
        <div class="n-body titles">
          <div class="s-sp"><span>PLUGGABLE_DATABASE</span></div>
          <div class="s-sp w100"><span>SHARES</span></div>
          <div class="s-sp"><span>UTILIZATION_LIMIT</span></div>
          <div class="s-sp"><span>MEMORY_MIN</span></div>
          <div class="s-sp"><span>MEMORY_LIMIT</span></div>
          <div class="s-sp"><span>PARALLEL_SERVER_LIMIT</span></div>
        </div>
        <div class="n-auto">
          <div class="n-body p50"
               v-for="(item,index) in items"
               :key="index">
            <div class="s-sn">
              <el-input v-model="item.pluggableDB"></el-input>
            </div>
            <div class="s-sn w90">
              <el-input v-model="item.share"></el-input>
            </div>
            <div class="s-sn">
              <el-input v-model="item.utilizationLimit"></el-input>
            </div>
            <div class="s-sn">
              <el-input v-model="item.memoryMin"></el-input>
            </div>
            <div class="s-sn">
              <el-input v-model="item.memoryLimit"></el-input>
            </div>
            <div class="s-sn">
              <el-input v-model="item.parallelServerLimit"></el-input>
            </div>
            <div class="e-oper">
              <div v-if="index == 0"
                   class="r-other"
                   @click="deleteIndex">
                <i class="el-icon-delete"></i>
              </div>
              <div v-else
                   class="r-index"
                   @click="deleteRows(item,index)">
                <i class="el-icon-delete"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="n-bottom">
          <el-button type="success"
                     @click="addLine"
                     style="padding: 9px 23px;">
            添加一行</el-button>
          <el-button type="primary"
                     @click="submitForm('ruleForm')">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import aSelect from "@/components/mSelect";
import { createPDBResourcePlan } from "@/api/sqlManager";
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
          width: "922px"
        };
      }
    }
  },
  data () {
    return {
      items: [
        {
          pluggableDB: '',
          share: '',
          utilizationLimit: '',
          memoryMin: '',
          memoryLimit: '',
          parallelServerLimit: '',
        }
      ],
      rows: {
        pluggableDB: '',
        share: '',
        utilizationLimit: '',
        memoryMin: '',
        memoryLimit: '',
        parallelServerLimit: '',
      },
      loading: false,
      // 角色列表
      options: [],
      ruleForm: {
        id: '',
        planName: '',
        rows: [],
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
    deleteIndex () {
      return this.$message.warning('不允许删除跟节点')
    },
    // 删除行 
    deleteRows (val1, val2) {
      let items = this.$_.cloneDeep(this.items)
      items.splice(val2, 1);
      this.items = items
    },
    // 添加一行
    addLine () {
      this.items.push(this.rows)
    },
    submitForm (formName) {
      let sta = false
      if (!this.ruleForm.planName) {
        return this.$message.error('请输入计划名称')
      }
      this.items.forEach(item => {
        if (item.pluggableDB && item.share && item.utilizationLimit && item.memoryMin && item.memoryLimit && item.parallelServerLimit) {
          sta = false
        } else {
          sta = true
        }
      });
      if (sta) {
        return this.$message.error('请填写完整')
      }
      this.loading = true
      let par = {
        id: this.file.id,
        planName: this.ruleForm.planName,
        resourcePlanRows: JSON.stringify(this.items),
      }
      createPDBResourcePlan(par).then((result) => {
        this.$emit("cancel", true);
        this.$message.success(result.msg)
        this.loading = false
      }).catch((err) => {
        this.loading = false
        this.$message.error(err.msg)
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
.resourcedialog {
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
    .n-auto {
      max-height: 540px;
      overflow: auto;
    }
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
      text-align: right;
      .el-button {
        padding: 9px 35px;
        border-radius: 0px;
      }
      & .add-res {
        .el-button {
          padding: 8px 23px;
        }
      }
    }

    .n-body {
      display: flex;
      height: 50px;
      align-items: center;
      margin-bottom: 10px;
      &.titles {
        background-color: #58c6f7;
        border-radius: 2px;
      }
      &.p50 {
        background-color: #f4f4f4;
        border-radius: 2px;
      }
      .s-sn {
        padding: 0 10px;
        &.w90 {
          width: 90px;
        }
      }
      .s-sp {
        width: 145px;
        color: #fff;
        text-align: center;
        padding: 0 5px;
        &.w100 {
          width: 100px;
        }
      }
      .e-oper {
        display: flex;
        justify-content: center;
        .f12 {
          font-size: 12px;
        }

        .r-index,
        .r-other {
          width: 27px;
          height: 26px;
          border-radius: 50%;
          border: 1px solid #bdbdbd;
          text-align: center;
          cursor: pointer;
          margin-right: 17px;
        }
        .el-button {
          padding: 9px 20px;
          border-radius: 0px;
        }
        .r-index:hover {
          border: 1px solid #d3effc;
          background: #d3effc;
          color: #0095d4;
        }
      }
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