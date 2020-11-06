<template>
  <div class="timePick">
    <el-time-picker is-range
                    v-model="value1"
                    range-separator="-"
                    :clearable="false"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    @change="getTime">
    </el-time-picker>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      value1: '',
    };
  },
  watch: {},
  computed: {},
  methods: {
    getTime (val) {
      this.$emit('getTime', val)
    },
  },
};
</script>
<style lang="scss" >
.timePick {
  width: 100%;
  height: 100%;
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-date-editor .el-range__icon {
    margin-top: -6px;
  }
  .el-date-editor .el-range-separator {
    margin-top: -10px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 220px;
  }
}
</style>