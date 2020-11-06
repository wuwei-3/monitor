<template>
  <div class="sqldialog3">
    <el-dialog title="查看SQL语句"
               :visible.sync="dialogVisible"
               width="600px"
               :before-close="cancel"
               v-dialogDrag>
      <div class="g-sql">
        {{sql}}
      </div>
      <div class="g-foot">
        <el-button @click="confirm(false)">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryExecutionPlan, download, querySQLText } from "@/api/common";
export default {
  components: {
  },
  props: {
    dialogVisible: "",
    sql: "",
    sqlId: '',
  },
  data () {
    return {
    };
  },
  watch: {},
  computed: {},
  mounted () {
    this.querySQLText(this.sql, this.sqlId)
  },
  methods: {
    querySQLText (val) {

    },
    cancel () {
      this.$emit("confirm", false);
    },
    confirm (val) {
      this.$emit("confirm", val);
    },
  },
};
</script>
<style lang="scss">
.sqldialog3 {
  min-width: 300px;
  min-height: 500px;
  background: #e7e8ed;
  overflow: auto;
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
    .g-sql {
      min-height: 50px;
      overflow: auto;
    }
    .g-foot {
      height: 43px;
      line-height: 50px;
      text-align: right;
      .el-button {
        padding: 8px 20px;
        border-radius: 0px;
      }
    }
  }
}
</style>