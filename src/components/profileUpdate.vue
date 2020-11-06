<template>
  <div class="profileupdate">
    <el-dialog title="SQL"
               :visible.sync="dialogVisible"
               width="600px"
               :before-close="cancel"
               v-dialogDrag>
      <div>
        jj
      </div>
      <div class="g-foot">
        <el-button @click="confirm(false)">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    dialogVisible: ""
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },
    confirm(val) {
      this.$emit("confirm", val);
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
.profileupdate {
  min-width: 300px;
  min-height: 500px;
  background: #e4e5ea;
  overflow: auto;
  .el-dialog__header {
    padding: 8px 20px 8px;
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