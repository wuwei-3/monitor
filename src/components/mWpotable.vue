<template>
  <!-- 管理页面风格 -->
  <div class="m-wpotable">
    <el-table :data="tableData1"
              style="width: 100%"
              row-key="id"
              lazy
              :load="load"
              :header-cell-style="{'background':'#ebecf0'}"
              :highlight-current-row="true">
      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :min-width="item.width"
                       v-for="(item, index) in column"
                       :key="index">
        <!-- 添加需要table信息 -->
        <template slot-scope="scope">
          <!-- 操作 -->
          <div v-if="item.prop == 'operaton'"
               class="e-oper">
            <!-- 修改 添加 删除 -->
            <div><i class="iconfont iconxie"></i></div>
            <div><i class="iconfont icontianjia"></i></div>
            <div><i class="iconfont iconshanchu"></i></div>
          </div>
          <!-- 真正展示的信息 -->
          <div :title="scope.row[item.prop]">{{scope.row[item.prop]}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    column: {
      type: Array,
      default: () => {
        return [
          { label: "数据库名", prop: "name" },
          { label: "表空间名", prop: "size" },
          { label: "总大小", prop: "size" },
          { label: "已使用大小", prop: "size" },
          { label: "操作", prop: "operaton", width: '30' },
        ];
      }
    },
  },
  data () {
    return {
      tableData1: [
        {
          id: 11,
          name: 'Oracle',
          hasChildren: true
        },
        {
          id: 21,
          name: 'Mysql',
          hasChildren: true
        },
        {
          id: 31,
          name: 'mariaDB',
          hasChildren: true
        },
      ],
      testItems: [
        {
          id: 12,
          size: '2016-05-01',
          name: '王小虎',
          childName: ''
        }, {
          id: 22,
          date: '2016-05-01',
          name: '王小虎',
        }
      ],
      testItems1: [
        {
          id: 122,
          size: '2016-05-01',
          name: '王小虎',
          childName: ''
        }, {
          id: 222,
          date: '2016-05-01',
          name: '王小虎',
        }
      ],
      testItems2: [
        {
          id: 123,
          size: '2016-05-01',
          name: '王小虎',
          childName: ''
        }, {
          id: 224,
          date: '2016-05-01',
          name: '王小虎',
        }
      ]
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 二级加载
    load (tree, treeNode, resolve) {
      switch (tree.name) {
        case 'Oracle':
          resolve(
            this.testItems
          )
          break;
        case 'Mysql':
          resolve(this.testItems1)
          break;
        case 'mariaDB':
          resolve(this.testItems2)
          break;
        default:
          break;
      }

    }
  },
  created () { },
  mounted () { }
};
</script>
<style lang="scss">
.m-wpotable {
  width: 100%;
  height: 100%;
  .el-table .cell {
    display: flex;
  }
  .e-oper {
    display: flex;
    justify-content: space-around;
    div {
      width: 27px;
      height: 26px;
      border-radius: 50%;
      border: 1px solid #bdbdbd;
      text-align: center;
      cursor: pointer;
      margin-right: 10px;
    }
    div:hover {
      border: 1px solid #d3effc;
      background: #d3effc;
      color: #0095d4;
    }
  }
}
</style>

