<template>
  <!-- 逻辑读 -->
  <div class="innodbmonitor"
       v-loading="loading">
    <!-- 该组件不好抽取 写在页面中 -->
    <el-table :data="tableData">
      <el-table-column prop="date"
                       label="IP"
                       align="center">
      </el-table-column>
      <!-- innodb_buffer_pool_ -->
      <el-table-column label="innodb_buffer_pool_"
                       align="center">
        <el-table-column prop="province"
                         label="instances"
                         align="center">
        </el-table-column>
        <el-table-column prop="city"
                         label="Size(M)"
                         align="center">
        </el-table-column>
      </el-table-column>
      <!-- innodb_buffer_pool_pages_ -->
      <el-table-column label="innodb_buffer_pool_"
                       align="center">
        <el-table-column prop="province"
                         label="total"
                         align="center">
        </el-table-column>
        <el-table-column prop="city"
                         label="data"
                         align="center">
        </el-table-column>
        <el-table-column prop="province"
                         label="dirty"
                         align="center">
        </el-table-column>
        <el-table-column prop="city"
                         label="flushed"
                         align="center">
        </el-table-column>
        <el-table-column prop="province"
                         label="free"
                         align="center">
        </el-table-column>
      </el-table-column>
      <!-- innodb_ -->
      <el-table-column label="innodb_buffer_pool_"
                       align="center">
        <el-table-column prop="province"
                         label="io_capacity"
                         align="center">
        </el-table-column>
        <el-table-column prop="city"
                         label="read_io_threads"
                         align="center">
        </el-table-column>
        <el-table-column prop="city"
                         label="write_io_threads"
                         align="center">
        </el-table-column>
      </el-table-column>
      <!-- innodb_rows_ -->
      <el-table-column label="innodb_buffer_pool_"
                       align="center">
        <el-table-column prop="province"
                         label="read"
                         align="center">
        </el-table-column>
        <el-table-column prop="city"
                         label="inserted"
                         align="center">
        </el-table-column>
        <el-table-column prop="city"
                         label="updated"
                         align="center">
        </el-table-column>
        <el-table-column prop="city"
                         label="deleted"
                         align="center">
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {},
  data () {
    return {
      // 统一表格样式
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
.innodbmonitor {
  height: 100%;
  width: 100%;
  background: #f5f6f7;
  padding: 10px;
}
</style>