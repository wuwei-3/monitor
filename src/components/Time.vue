<template>
  <div class="sql-time">
    <el-date-picker v-model="time1"
                    type="datetime"
                    placeholder="请选择时间"
                    default-time="12:00:00"
                    clearable
                    @change='getTime'
                    size="small">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    time: ''
  },
  data () {
    return {
      time1: '',
    };
  },
  watch: {
    time () {
      this.time1 = this.time
    },
  },
  computed: {},
  methods: {
    // 获取时间
    getTime (val) {
      this.$emit('getTime', val)
    },
  },
  mounted () { this.time1 = this.time }
};
</script>
<style lang="scss" >
.sql-time {
  width: 100%;
  height: 100%;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 180px;
  }
}
</style>