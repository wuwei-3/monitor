<template>
  <div class="a-delete">
    <el-dialog :visible.sync="visible"
               :close-on-click-modal="false"
               width="400px"
               :show-close='true'
               :title="title"
               v-dialogDrag
               v-loading="loading">
      <div>
        <div class="e-del">
          {{content}}
        </div>
        <div class="e-btn">
          <el-button type="info"
                     @click="cancel">取消</el-button>
          <el-button type="primary"
                     @click="confirm">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  deleteUser,
  deleteRole,
  menuDel,
  triggerDel,
  monitorDel,
  warnDel,
  warnDels,
  dbDel,
  obDel,
  MYDel,
  mariadelete
} from "@/api/Oracle.js";
import {
  mainDel,
  hostDel,
  mtDateDel,
  warnDela,
  dbGroupDel,
  orDel,
  orDelMy,
} from "@/api/systemGer";
import { warnInfoDel, warnInfoDelAll } from "@/api/DBPolling";
export default {
  components: {},
  props: {
    visible: false,
    codeDateType: '',
    deleteIds: "",
    status: "",
    dbGroupId: '',
    title: {
      type: String,
      default: () => {
        return '删除'
      }
    },
    content: {
      type: String,
      default: () => {
        return '确定要删除资源计划'
      }
    }
  },
  data () {
    return {
      loading: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    cancel () {
      this.$emit("cancel", false);
    },
    confirm () {
      if (!this.deleteIds) {
        return this.$message.warning("你还未勾选");
      }
      this.loading = true;
      switch (this.status) {
        case 1:
          // 真正的删除
          deleteUser({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 2:
          // 真正的删除
          deleteRole({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 3:
          // 真正的删除
          menuDel({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 4:
          // 真正的删除
          triggerDel({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 5:
          // 真正的删除
          monitorDel({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 6:
          // 真正的删除
          warnDel({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 7:
          // 真正的删除
          warnDels({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 8:
          // 真正的删除
          dbDel({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 9:
          // 真正的删除
          mainDel({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 10:
          // 真正的删除
          hostDel({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 11:
          // 真正的删除
          mtDateDel({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 12:
          // 真正的删除
          warnDela({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 13:
          // 真正的删除
          dbGroupDel({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 14:
          if (this.dbGroupId == -1) {
            dbGroupDel({ ids: this.deleteIds })
              .then(result => {
                this.$message.success(result.msg);
                this.loading = false;
                this.$emit("cancel", true);
              })
              .catch(err => {
                this.loading = false;
                this.MyMessageHtml.error({
                  dangerouslyUseHTMLString: true,
                  message: err.msg
                });
              });
          } else {
            orDel(
              {
                ids: this.deleteIds,
                groupId: this.dbGroupId
              }
            )
              .then(result => {
                this.$message.success(result.msg);
                this.loading = false;
                this.$emit("cancel", true);
              })
              .catch(err => {
                this.loading = false;
                this.MyMessageHtml.error({
                  dangerouslyUseHTMLString: true,
                  message: err.msg
                });
              });
          }
          // 真正的删除

          break;
        case 15:
          if (this.codeDateType == 1) {
            // 真正的删除
            MYDel({ ids: this.deleteIds })
              .then(result => {
                this.$message.success(result.msg);
                this.loading = false;
                this.$emit("cancel", true);
              })
              .catch(err => {
                this.loading = false;
                this.MyMessageHtml.error({
                  dangerouslyUseHTMLString: true,
                  message: err.msg
                });
              });
          } else if (this.codeDateType == 2) {
            // 真正的删除
            mariadelete({ ids: this.deleteIds })
              .then(result => {
                this.$message.success(result.msg);
                this.loading = false;
                this.$emit("cancel", true);
              })
              .catch(err => {
                this.loading = false;
                this.MyMessageHtml.error({
                  dangerouslyUseHTMLString: true,
                  message: err.msg
                });
              });
          } else {
            // 真正的删除
            obDel({ ids: this.deleteIds })
              .then(result => {
                this.$message.success(result.msg);
                this.loading = false;
                this.$emit("cancel", true);
              })
              .catch(err => {
                this.loading = false;
                this.MyMessageHtml.error({
                  dangerouslyUseHTMLString: true,
                  message: err.msg
                });
              });
          }
          break;
        case 16:
          // 真正的删除
          warnDela({ ids: this.deleteIds })
            .then(result => {
              this.$message.success(result.msg);
              this.loading = false;
              this.$emit("cancel", true);
            })
            .catch(err => {
              this.loading = false;
              this.MyMessageHtml.error({
                dangerouslyUseHTMLString: true,
                message: err.msg
              });
            });
          break;
        case 20:
          if (this.deleteIds) {
            // 真正的删除
            warnInfoDel({ ids: this.deleteIds })
              .then(result => {
                this.$message.success(result.msg);
                this.loading = false;
                this.$emit("cancel", true);
              })
              .catch(err => {
                this.loading = false;
                this.MyMessageHtml.error({
                  dangerouslyUseHTMLString: true,
                  message: err.msg
                });
              });
          } else {
            // 真正的删除
            warnInfoDelAll()
              .then(result => {
                this.$message.success(result.msg);
                this.loading = false;
                this.$emit("cancel", true);
              })
              .catch(err => {
                this.loading = false;
                this.MyMessageHtml.error({
                  dangerouslyUseHTMLString: true,
                  message: err.msg
                });
              });
          }

          break;
        case 21:
          if (this.dbGroupId == -1) {
            // mysql 组删除
            dbGroupDel({ ids: this.deleteIds })
              .then(result => {
                this.$message.success(result.msg);
                this.loading = false;
                this.$emit("cancel", true);
              })
              .catch(err => {
                this.loading = false;
                this.MyMessageHtml.error({
                  dangerouslyUseHTMLString: true,
                  message: err.msg
                });
              });
          } else {
            // mysql 组成员删除
            orDelMy(
              {
                ids: this.deleteIds,
                groupId: this.dbGroupId
              }
            )
              .then(result => {
                this.$message.success(result.msg);
                this.loading = false;
                this.$emit("cancel", true);
              })
              .catch(err => {
                this.loading = false;
                this.MyMessageHtml.error({
                  dangerouslyUseHTMLString: true,
                  message: err.msg
                });
              });
          }
          // 真正的删除

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
.a-delete {
  height: 150px;
  .el-dialog__header {
    padding: 8px;
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
  }
  .e-name {
    height: 50px;
    line-height: 50px;
    text-align: left;
    font-size: 29px;
    font-weight: bold;
  }
  .e-del {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 15px;
    color: red;
  }
  .e-btn {
    text-align: center;
    height: 50px;
    line-height: 50px;
    margin-top: 20px;
    .el-button {
      padding: 9px 35px;
      border-radius: 0px;
    }
  }
}
</style>