<template>
  <!-- element 滚动条样式 -->
  <div class="m-select">
    <el-select v-model="value"
               :placeholder="title"
               @change="getOPtions"
               size="small">
      <el-option v-for="item in options"
                 :key="item.NAME || item.PLAN"
                 :label="item.NAME || item.PLAN"
                 :value="item.NAME || item.PLAN">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    options: "",
    title: "",
    reportId: ""
  },
  data () {
    return {
      value: ""
    };
  },
  watch: {
    reportId: {
      handler (newVal, oldVal) {
        this.value = newVal;
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    // 获取下拉框值
    getOPtions (val) {
      this.$emit("getOPtions", val);
    }
  },
  created () { },
  mounted () {
    this.value = this.reportId
  }
};
</script>
<style lang="scss" >
.m-select {
  .el-input__suffix {
    // top: 5px;
  }
}
</style>
