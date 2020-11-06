<template>
  <!-- element 滚动条样式 -->
  <div class="m-select">
    <el-select v-model="value"
               :placeholder="placeholder"
               @change="getOPtions">
      <el-option v-for="(item,index) in options"
                 :key="index"
                 :label="item.name"
                 :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  components: {},
  // 
  props: {
    options: "",
    reportId: "",
    placeholder: {
      type: String,
      default: () => {
        return '请输入LOGTYPE'
      }
    }
  },
  data () {
    return {
      value: ""
    };
  },

  computed: {},
  methods: {
    // 获取下拉框值
    getOPtions (val) {
      this.$emit("getOPtions", val);
    },
    clearEmail () {
      this.value = ''
    },
  },
  created () { },
  mounted () {
    this.value = this.reportId
  }
};
</script>
<style lang="scss">
.m-select {
  .el-input__suffix {
    // top: 5px;
  }
}
</style>
