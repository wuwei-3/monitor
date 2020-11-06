<template>
  <div class="m-wpo">
    <!-- 表头 -->
    <div class="m-btn">
      <div>
        <el-button type="primary"
                   class="iconfont icontianjia">添加组</el-button>
      </div>
    </div>
    <!-- 表信息 -->
    <div class="s-table">
      <n-table></n-table>
    </div>
    <!-- 分页 -->
    <div class="m-page">
      <m-page></m-page>
    </div>
  </div>
</template>

<script>
import nTable from "./mWpotable";
import mPage from "./mPage";
import aSelet from "./aSelect";
export default {
  components: {
    nTable,
    mPage,
    aSelet
  },
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang="scss">
.m-wpo {
  width: 100%;
  height: 100%;
  background-color: #f5f6fa;
  border: solid 1px #d3d4d8;
  padding: 10px;
  .m-btn {
    display: flex;
    height: 50px;
    line-height: 50px;
    div {
      margin-right: 10px;
    }
    .el-button {
      padding: 7px 20px;
    }
    .el-input__inner {
      width: 100px;
      height: 32px;
      line-height: 32px;
    }
    .el-button--primary {
      background: #24bd6f;
    }
    .n-select {
      margin-left: auto;
    }
  }
  .s-table {
    height: calc(100% - 80px);
    overflow: auto;
  }
  .m-page {
    height: 32px;
    text-align: right;
  }
}
</style>