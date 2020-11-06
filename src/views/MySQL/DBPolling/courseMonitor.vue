<template>
  <!-- 逻辑读 -->
  <div class="courseMonitorr"
       v-loading="loading">
    <n-table :column="column"
             :tableData="tableData"
             :status="'sql1'"
             :selection="'1'"
             :background="'#ebecf0'"></n-table>
  </div>
</template>

<script>
import nTable from "@/components/nTable";
export default {
  components: {
    nTable,
  },
  props: {},
  data () {
    return {
      // 统一表格样式
      column: [
        { label: "IP", prop: "Id" },
        { label: "USER", prop: "User" },
        { label: "HOST", prop: "Host" },
        { label: "DB", prop: "db" },
        { label: "COMMAND", prop: "Command" },
        { label: "TIME", prop: "Time" },
        { label: "STATE", prop: "State" },
        { label: "INFO", prop: "Info" },
      ],
      tableData: [],
      loading: false,
    };
  },
  mounted () {
  },
  methods: {
  },

};
</script>
<style lang="scss">
.courseMonitorr {
  height: 100%;
  width: 100%;
  background: #f5f6f7;
  padding: 10px;
}
</style>