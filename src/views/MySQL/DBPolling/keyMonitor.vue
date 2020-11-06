<template>
  <!-- 逻辑读 -->
  <div class="keyMonitor"
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
      // 统一表格样式ssss
      column: [
        { label: "IP", prop: "IP", width: 5 },
        { label: "KEY BUFFER SIZE", prop: "key_buffer_size", width: 10 },
        { label: "SORT BUFFER SIZE", prop: "sort_buffer_size", width: 10 },
        { label: "JOIN BUFFER SIZE", prop: "join_buffer_size", width: 10 },
        { label: "KEY BLOCKS UNUSED", prop: "key_blocks_unused", width: 10 },
        { label: "KEY BLOCKS USED", prop: "key_blocks_used", width: 11 },
        { label: "KEY BLOCK NOT FLUSHED", prop: "key_blocks_not_flushed", width: 11 },
        { label: "KEY BLOCKS USED RATE", prop: "key_blocks_used_rate", width: 11 },
        { label: "KEY BUFFER READ RATE", prop: "key_buffer_read_rate", width: 11 },
        { label: "KEY BUFFER WRITE RATE", prop: "key_buffer_write_rate", width: 11 },
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
.keyMonitor {
  height: 100%;
  width: 100%;
  background: #f5f6f7;
  padding: 10px;
}
</style>