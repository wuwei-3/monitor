<template>
  <!-- 逻辑读 -->
  <div class="resourcesMonitor"
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
        { label: "IP", prop: "IP" },
        { label: "MAX CONNECTIONS", prop: "max_connections" },
        { label: "THREADS CONNECTED", prop: "threads_connected" },
        { label: "MAX CONNECT ERRORS", prop: "max_connect_errors" },
        { label: "OPEN FILES LIMIT", prop: "open_files_limit" },
        { label: "OPEN FILES", prop: "open_files" },
        { label: "TABLE OPEN CACHE", prop: "table_open_cache" },
        { label: "OPEN TABLES", prop: "open_tables" },
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
.resourcesMonitor {
  height: 100%;
  width: 100%;
  background: #f5f6f7;
  padding: 10px;
}
</style>