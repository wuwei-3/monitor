<template>
  <div class="a-delete2">
    <el-dialog :visible.sync="visible"
               :close-on-click-modal="false"
               width="400px"
               :show-close='true'
               :title="title"
               v-dialogDrag
               :before-close="cancel"
               v-loading="loading">
      <div>
        <div class="e-del"
             :style="{color:fileDel.owner ||  fileDel.hashValue || fileDel.REOD? '':'red'}">
          {{content}}
        </div>
        <div class="e-btn">
          <el-button type="info"
                     @click="cancel">取消</el-button>
          <el-button type="primary"
                     @click="confirm">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 
import { switchREDO } from '@/api/DBPolling'
import { fixedSQLExecutionPlan } from '@/api/sqlMonitor'
import {
  deletePDBResourcePlan,
  deletePDBResourcePlanDirectives,
  monitorIndex,
  cancelMonitorIndex,
  enablePDBResourcePlan,
  disablePDBResourcePlan
} from '@/api/sqlManager'
export default {
  components: {},
  props: {
    visible: false,
    fileDel: '',
    title: {
      type: String,
      default: () => {
        return '删除'
      }
    },
    content: {
      type: String,
      default: () => {
        return '确定要删除资源计划'
      }
    }
  },
  data () {
    return {
      loading: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    cancel () {
      this.$emit("cancel", false);
    },
    confirm () {
      // 删除
      this.loading = true
      if (this.fileDel.resourcePlanRows) {
        deletePDBResourcePlanDirectives(this.fileDel).then((result) => {
          this.$message.success(result.msg);
          this.loading = false;
          this.$emit("cancel", true);
        })
          .catch(err => {
            this.loading = false;
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
      } else if (this.fileDel.owner) {
        if (this.title == '取消索引') {
          cancelMonitorIndex(this.fileDel).then((result) => {
            this.$message.success(result.msg);
            this.loading = false
            this.$emit("cancel", true);
          }).catch((err) => {
            this.loading = false
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
        } else if (this.fileDel.owner == 1) {
          let par = {
            ...this.fileDel
          }
          delete par.owner
          this.loading = true
          disablePDBResourcePlan(par).then((result) => {
            this.$message.success(result.msg);
            this.loading = false
            this.$emit("cancel", true);
          }).catch((err) => {
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
            this.loading = false
          });
        } else if (this.fileDel.owner == 2) {
          let par = {
            ...this.fileDel
          }
          delete par.owner
          this.loading = true
          enablePDBResourcePlan(par).then((result) => {
            this.$message.success(result.msg);
            this.loading = false
            this.$emit("cancel", true);
          }).catch((err) => {
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
            this.loading = false
          });
        } else {
          monitorIndex(this.fileDel).then((result) => {
            this.$message.success(result.msg);
            this.loading = false
            this.$emit("cancel", true);
          }).catch((err) => {
            this.loading = false
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
        }
      } else if (this.fileDel.hashValue) {
        fixedSQLExecutionPlan(this.fileDel).then((result) => {
          this.$message.success(result.msg);
          this.loading = false
          this.$emit("cancel", true);
        }).catch((err) => {
          this.loading = false
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
      } else if (this.fileDel.REOD) {
        switchREDO({ id: this.fileDel.id }).then((result) => {
          this.$message.success(result.msg);
          this.loading = false;
          this.$emit("cancel", true);
        })
          .catch(err => {
            this.loading = false;
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
      } else {
        deletePDBResourcePlan(this.fileDel).then((result) => {
          this.$message.success(result.msg);
          this.loading = false;
          this.$emit("cancel", true);
        })
          .catch(err => {
            this.loading = false;
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
      }
    }
  },
  created () { },
  mounted () { }
};
</script>
<style lang="scss">
.a-delete2 {
  height: 150px;
  .el-dialog__header {
    padding: 8px;
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
    .el-table td,
    .el-table th {
      padding: 6px 0;
    }
    .e-del {
      height: 90px;
      line-height: 90px;
      text-align: center;
      font-size: 15px;
    }

    .e-btn {
      text-align: center;
      .el-button {
        padding: 9px 35px;
        border-radius: 0px;
      }
    }
  }
}
</style>