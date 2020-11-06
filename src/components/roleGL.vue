<template>
  <div class="r-roleGl">
    <el-dialog title="关联资源"
               :visible.sync="visible"
               top='10vh'
               width="300px"
               :before-close="cancel">
      <div>
        <div class="g-tree">
          <el-input placeholder="输入关键字进行过滤"
                    v-model="filterText">
            <i slot="suffix"
               class="el-input__icon el-icon-search"></i>
          </el-input>
          <div class="e-tre"
               v-loading="loading">
            <!-- 默认展示一级节点 -->
            <el-tree :data="dataTree"
                     node-key="id"
                     :default-checked-keys="selectIds"
                     class="filter-tree"
                     :highlight-current="true"
                     :filter-node-method="filterNode"
                     :default-expanded-keys="[1]"
                     ref="tree2"
                     :show-checkbox="true"
                     @check="checkRole"
                     :props="defaultProps"
                     @node-click="getTreeRow">
            </el-tree>
          </div>
        </div>
      </div>
      <div class="g-foot">
        <el-button type="primary"
                   @click="confirm(true)">确认</el-button>
        <el-button type="info"
                   @click="confirm(false)">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { menuTree, relationMenu, roleGet } from "@/api/Oracle.js";
export default {
  components: {},
  props: {
    visible: false,
    deleteIds: "",
    dataTree: "",
    selectIds: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data () {
    return {
      loading: false,
      form: {
        roleId: "",
        menuIds: "",
        dbType: ''
      },
      ids: [],
      filterText: "", //搜索
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val);
    }
  },
  computed: {
    mIndex: function () {
      return this.$store.getters.getMIndex
    },
  },
  methods: {
    // 回显关联角色菜单
    getRoles (val) {
      let type = ""
      if (this.mIndex == 0) {
        type = 'Oracle'
      } else if (this.mIndex == 1) {
        type = 'MySQL'
      } else {
        type = 'MariaDB'
      }
      let par = {
        roleId: val,
        dbType: type,
      };
      roleGet(par)
        .then(result => {
          this.$refs.tree2.setCheckedKeys(result.data);
        })
        .catch(err => {
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    confirm (val) {
      if (val) {
        if (this.selectIds.length > 0 && this.ids.length == 0) {
          this.form.menuIds = this.selectIds.join(",");
        } else {
          if (this.ids.length == 0) {
            return this.$message.error("请选择关联资源");
          }
          this.form.menuIds = this.ids.join(",");
        }

        let type = ""
        if (this.mIndex == 0) {
          type = 'Oracle'
        } else if (this.mIndex == 1) {
          type = 'MySQL'
        } else {
          type = 'MariaDB'
        }
        this.form.dbType = type
        this.form.roleId = Number(this.deleteIds);
        this.loading = true;
        relationMenu(this.form)
          .then(result => {
            this.$emit("cancel", true);
            this.loading = false;
            this.$message.success(result.msg);
          })
          .catch(err => {
            this.loading = false;
             this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          });
      } else {
        this.$emit("cancel", false);
      }
    },
    cancel () {
      this.$emit("cancel", false);
    },
    //   复选框
    checkRole (val1, val2) {
      this.ids = val2.checkedKeys;
    },

    // 获取树节点 后端需要把paranName 给前端
    getTreeRow (val1, val2, val3) {
      if (val1.isChidren) {
        //是子节点
        this.ruleForm.parentId = val1.id;
        this.ruleForm.parentName = val1.name;
      }
    },
    // 树组件自动加载
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  },
  mounted () {
  }
};
</script>
<style lang="scss">
.r-roleGl {
  width: 300px;
  height: 500px;
  background: #e4e5ea;
  .el-dialog__header {
    padding: 8px 20px 8px;
    background: #2d97ff;
    .el-dialog__headerbtn {
      top: 8px;
      right: 9px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
    .el-dialog__title {
      color: #fff;
      font-size: 15px;
    }
  }
  .el-dialog__body {
    padding: 10px;
    .g-tree {
      height: 512px;
      background: #fff;
      .el-input__icon {
        color: #2d97ff;
      }
      .e-tre {
        height: 480px;
        overflow: auto;
      }
    }
    .g-foot {
      height: 43px;
      line-height: 50px;
      text-align: right;
      .el-button {
        padding: 8px 20px;
        border-radius: 0px;
      }
    }
  }
}
</style>