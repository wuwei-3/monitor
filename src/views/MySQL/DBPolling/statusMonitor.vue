<template>
  <!-- 逻辑读 -->
  <div class="statusMonitor"
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
        { label: "UPTIME", prop: "Uptime" },
        { label: "VERSION", prop: "version" },
        { label: "THREADS CONNECTED", prop: "Threads_connected" },
        { label: "THREADS RUNNING", prop: "Threads_running" },
        { label: "QPS", prop: "QPS" },
        { label: "TPS", prop: "TPS" },
        { label: "SEND BYTES", prop: "Sendbytes" },
        { label: "RECEIVE BYTES", prop: "Receivebytes" },
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
.statusMonitor {
  height: 100%;
  width: 100%;
  background: #f5f6f7;
  padding: 10px;
}
</style>