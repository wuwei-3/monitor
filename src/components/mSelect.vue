<template>
  <!-- element 滚动条样式 -->
  <div class="m-select">
    <el-select v-model="value"
               :placeholder="title"
               @change="getOPtions"
               clearable>
      <el-option v-for="item in options"
                 :key="item.id"
                 :label="item.name"
                 :value="item.id">
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
  watch: {},
  computed: {},
  methods: {
    // 获取下拉框值
    getOPtions (val) {
      this.$emit("getOPtions", val);
    }
  },
  created () { },
  mounted () {
    this.value = this.reportId;
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
