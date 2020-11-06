<template>
  <!-- 公用弹窗样式 -->
  <div class="s-dialog-s">
    <el-dialog :visible.sync="visible"
               :width="mDialog.width"
               :close-on-click-modal="false"
               :show-close='false'
               v-dialogDrag
               v-loading="loading">
      <div class="g-main">
        <div class="n-title">
          <div class="e-name"
               v-if="update.id">修改菜单</div>
          <div class="e-name"
               v-else>新增菜单</div>
          <div class="e-border"></div>
          <div class="e-close">
            <i class="el-icon-circle-close"
               @click="handleCancel"></i>
          </div>
        </div>
        <el-form :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm"
                 class="demo-ruleForm">
          <!-- 不能用for循环，不然el-input 无法赋值 -->
          <div class="n-body">
            <div class="y-span"><span>菜单名称</span></div>
            <div class="y-put">
              <el-form-item prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>菜单别名</span></div>
            <div class="y-put">
              <el-form-item prop="alias">
                <el-input v-model="ruleForm.alias"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>访问地址</span></div>
            <div class="y-put">
              <el-form-item>
                <el-input v-model="ruleForm.url"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>上级菜单</span></div>
            <div class="y-put">
              <el-form-item prop="parentId">
                <el-input :value="ruleForm.parentName"
                          @focus="focusId"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>启用状态</span></div>
            <div class="y-put switch">
              <el-switch v-model="ruleForm.status"
                         active-color="#13ce66"
                         active-value="1"
                         inactive-value="0"
                         inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
          <div class="n-body">
            <div class="y-span"><span>顺序值</span></div>
            <div class="y-put">
              <el-form-item prop="sort">
                <el-input v-model="ruleForm.sort"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="n-bottom">
          <el-button type="primary"
                     @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="info"
                     @click="handleCancel">取消</el-button>
        </div>
      </div>
      <div class="s-bodyDialog">
        <el-dialog width="325px"
                   title="上级菜单"
                   :visible.sync="iVisible"
                   :modal="false"
                   top="17vh"
                   :append-to-body="false">
          <div class="g-tree">
            <el-input placeholder="输入关键字进行过滤"
                      v-model="filterText">
              <i slot="suffix"
                 class="el-input__icon el-icon-search"></i>
            </el-input>
            <div class="e-tre">
              <el-tree :data="dataTree"
                       default-expand-all
                       node-key="id"
                       class="filter-tree"
                       :highlight-current="true"
                       :filter-node-method="filterNode"
                       ref="tree2"
                       :props="defaultProps"
                       @node-click="getTreeRow">
              </el-tree>
            </div>
          </div>
          <div class="g-foot">
            <el-button type="primary"
                       @click="cancelBody(true)">确认</el-button>
            <el-button type="info"
                       @click="cancelBody(false)">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import aSelect from "@/components/aSelect";
import { userList, menuSave, maxSort, menuTree } from "@/api/Oracle.js";
export default {
  components: {
    aSelect
  },
  props: {
    visible: false,
    update: "",
    mDialog: {
      default: () => {
        return {
          width: "711px"
        };
      }
    }
  },
  data () {
    let checkAge = (rule, value, callback) => {
      let val = Number(value);
      if (!val) {
        return callback(new Error("请输入数字值"));
      } else {
        return callback();
      }
    };
    return {
      dataTree: [],
      loading: false,
      filterText: "", //搜索
      defaultProps: {
        children: "children",
        label: "name"
      },
      iVisible: false,
      options: [
        {
          value: 1,
          label: "DBA"
        },
        {
          value: 2,
          label: "普通用户"
        }
      ],
      value: "",
      // 启用状态
      Role: {
        // 下拉框宽度
        width: "width:200px",
        // 是否支持清除
        cleear: true,
        holder: "选择角色",
        // 下拉框内容
        items: [
          {
            id: 0,
            name: "DBA"
          },
          {
            id: 3,
            name: "普通用户"
          }
        ]
      },
      value2: true,
      rules: {
        name: [
          { required: true, message: "请输入资源名称", trigger: "change" }
        ],
        parentId: [
          { required: true, message: "请输入选择上级资源", trigger: "change" }
        ],
        sort: [{ validator: checkAge, trigger: "change" }]
      },
      ruleForm: {
        name: "", //菜单名称
        alias: "", //统一输入框
        url: "",
        parentId: "",
        status: "1",
        sort: 1,
        clazz: "",
        parentName: "",
        //保存时给与
        lang: "zh_CN",
        dbType: ""
      }
    };
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted () {
    let update = this.$_.cloneDeep(this.update);
    if (update.id) {
      update.status = JSON.stringify(update.status);
      // 去除不用属性
      delete update.isChildren;
      delete update.children;
      delete update.dbType;
      delete update.lang;
      this.ruleForm = update;
    }
    this.getTree()
  },
  computed: {
    mIndex: function () {
      return this.$store.getters.getMIndex
    },
  },
  methods: {
    // 获取上级菜单树
    getTree () {
      // 菜单树 类型
      let type = ""
      if (this.mIndex == 0) {
        type = 'Oracle'
      } else if (this.mIndex == 1) {
        type = 'MySQL'
      } else {
        type = 'MariaDB'
      }
      let par = {
        dbType: type
      }
      menuTree(par)
        .then(result => {
          this.dataTree.push(result.data);
        })
        .catch(err => {
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 菜单最大培训值
    getSort (val) {
      maxSort(val)
        .then(result => {
          this.ruleForm.sort = Number(result.data);
        })
        .catch(err => {
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
    // 获取树节点 后端需要把paranName 给前端
    getTreeRow (val1, val2, val3) {
      this.getSort({ parentId: val1.id });
      //是子节点
      this.ruleForm.parentId = val1.id;
      this.ruleForm.parentName = val1.name;
    },
    // 取消树显示
    cancelBody (val) {
      if (val) {
        if (!this.ruleForm.parentId) {
          return this.$message.error("您还未选择节点");
        }
        return (this.iVisible = false);
      }
      this.iVisible = false;
      // 还原原始值
      this.ruleForm.sort = 1;
      this.ruleForm.parentId = this.update.parentId;
      this.ruleForm.parentName = this.update.parentName;
    },
    // 树组件自动加载
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    // 上级菜单获取
    focusId () {
      // 弹窗
      this.iVisible = true;
    },
    // 提交
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 菜单树 类型
          let type = ""
          if (this.mIndex == 0) {
            type = 'Oracle'
          } else if (this.mIndex == 1) {
            type = 'MySQL'
          } else {
            type = 'MariaDB'
          }
          this.loading = true
          delete this.ruleForm.parentName;
          this.ruleForm.dbType = type
          // 处理数据保存
          menuSave(this.ruleForm)
            .then(result => {
              this.$emit("comfirm", 1);
              this.loading = false
              this.$message.success(result.msg);
            })
            .catch(err => {
              this.loading = false
               this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
            });
        } else {
          return false;
        }
      });
    },
    // 关闭弹窗
    handleCancel () {
      this.$emit("cancel", false);
    }
  }
};
</script>
<style lang="scss">
.s-dialog-s {
  width: 711px;
  height: 579px;
  background-color: #ffffff;
  border-radius: 5px;
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 20px;
  }
  .s-bodyDialog {
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
        height: 390px;
        background: #fff;
        .el-input__icon {
          color: #2d97ff;
        }
        .e-tre {
          height: 355px;
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
  .g-main {
    height: 100%;
    width: 100%;
    .n-title {
      height: 50px;
      line-height: 50px;
      color: #333333;
      font-weight: bold;
      font-size: 20px;
      position: relative;
      .e-name {
        position: absolute;
        width: 100px;
        padding: 0 5px;
        margin-left: 10px;
        z-index: 10;
        background: #fff;
      }
      .e-border {
        border-bottom: 1px solid #eaeaea;
        position: absolute;
        top: 26px;
        width: 100%;
      }
      .e-close {
        position: absolute;
        top: 0px;
        right: 0;
        font-size: 24px;
        &:hover {
          color: #00a2e7;
        }
      }
    }
    .n-bottom {
      .el-button {
        padding: 9px 35px;
        border-radius: 0px;
      }
    }
    .n-body {
      display: flex;
      height: 50px;
      align-items: center;
      margin-bottom: 10px;
      .y-span {
        width: 100px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #eaeaea;
        border-right: none;
        text-align: center;
        background: #fbfbfb;
        font-size: 12px;
        color: #000000;
      }
      .switch {
        height: 40px;
        line-height: 40px;
        border: 1px solid #eaeaea;
        background: #fbfbfb;
        padding-left: 20px;
      }
      .y-put {
        flex: 1;
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>