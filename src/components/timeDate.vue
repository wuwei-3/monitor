<template>
  <div class="dataTime">
    <el-date-picker v-model="dataTime"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    @change="getDate"
                    :picker-options="pickerOptions">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        },
      },
      dataTime: new Date(),
    };
  },
  watch: {},
  computed: {},
  methods: {
    getDate (val) {
      this.$emit('getDate', this.dataTime)
    },
  },
};
</script>
<style lang="scss" >
.dataTime {
  height: 100%;
  width: 100%;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 185px;
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    .el-input__prefix,
    .el-input__suffix {
      top: -3px;
    }
  }
}
</style>