<template>
  <!-- 主页风格table -->
  <div class="m-table">
    <el-table :data="tableData"
              style="width:calc(100% - 0px)"
              :header-cell-style="{'background':'#2a333d'}">
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :min-width="item.width"
                       v-for="(item, index) in column"
                       :key="index"
                       :show-overflow-tooltip="true">
        <!-- 添加需要table信息 -->
        <template slot-scope="scope">
          <div v-if="item.prop == 'USED_RATIO' || item.prop == 'USED'">
            <el-progress :text-inside="true"
                         :stroke-width="15"
                         :percentage="scope.row[item.prop]"
                         color="#edc544"
                         v-if="scope.row[item.prop] > 80 && scope.row[item.prop]< 90"></el-progress>
            <el-progress :text-inside="true"
                         :stroke-width="15"
                         :percentage="scope.row[item.prop]"
                         color="red"
                         v-else-if="scope.row[item.prop] > 90"></el-progress>
            <el-progress :text-inside="true"
                         :stroke-width="15"
                         :percentage="scope.row[item.prop]"
                         color="#2d97ff"
                         v-else></el-progress>
          </div>
          <div v-else-if="item.prop == 'OFFLINE_DISKS'"
               :style="{background:scope.row[item.prop] == 0? '':'red'}">
            {{scope.row[item.prop]}}
          </div>
          <!-- 需要展示信息 -->
          <div v-else
               :title="scope.row[item.prop]">{{scope.row[item.prop]}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    tableData: '',
    column: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  data () {
    return {
      color: '#2d97ff' //默认值
    };
  },
  watch: {
  },
  methods: {
    formartNumber (val) {
      let num = Number(val)
      if (num > 80) {
        this.color = '#edc544'
      } else if (num > 90) {
        this.color = 'red'
      } else {
        this.color = '#2d97ff'
      }
      return num || 0
    }
  },
  mounted () {
  }
};
</script>
<style lang="scss">
.m-table {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  .el-table th,
  .el-table tr {
    background-color: #232a30;
  }
  .el-table td,
  .el-table th {
    padding: 10px 0px;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #1c2226;
    border-right: 1px solid #1c2226;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #1c2226;
  }
  .el-table,
  .el-table__expanded-cell {
    background-color: #232a30;
  }
  .el-table {
    color: #babecb;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #232a30;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #2a333d;
  }
  .el-progress-bar__outer {
    background-color: #2a3239;
  }
}
</style>