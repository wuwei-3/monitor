<template>
  <!-- 逻辑读 -->
  <div class="tableAnaly"
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
        { label: "TABLE SCHEMA", prop: "table_schema" },
        { label: "TABLE NAME", prop: "table_name" },
        { label: "TABLE TYPE", prop: "table_type" },
        { label: "ENGINE", prop: "engine" },
        { label: "TABLE ROWS", prop: "table_rows" },
        { label: "AVG ROW LENGTH", prop: "avg_row_length" },
        { label: "DATA LENGTH", prop: "data_length" },
        { label: "INDEX LENGTH", prop: "index_length" },
        { label: "CREATE TIME", prop: "create_time" },
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
.tableAnaly {
  height: 100%;
  width: 100%;
  background: #f5f6f7;
  padding: 10px;
}
</style>