<template>
  <!-- 授权信息 -->
  <div class="m-thour-meg">
    <el-dialog title="授权信息"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="400px"
               :show-close='true'
               :before-close="cancel"
               v-dialogDrag>
      <div>
        <div class="e-dels">
          <div class="l-span"><span>最大主机数：</span></div>
          <div class="l-put">
            {{thours.hostCount}}
          </div>
        </div>
        <div class="e-dels">
          <div class="l-span"><span>开始时间：</span></div>
          <div class="l-put">
            {{thours.beforeTime}}
          </div>
        </div>
        <div class="e-dels">
          <div class="l-span"><span>结束时间：</span></div>
          <div class="l-put">
            {{thours.afterTime}}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { license } from '@/api/author.js'
export default {
  components: {},
  props: {
    visible: false,
  },
  data () {
    return {
      thours: {},
    };
  },
  watch: {},
  computed: {},
  methods: {
    cancel () {
      this.$emit('cancel', false)
    },
  },
  mounted () {
    license().then((result) => {
      this.thours = result
    }).catch((err) => {
      this.$message.error(err.msg)
    });
  }
};
</script>
<style lang="scss">
.m-thour-meg {
  height: 150px;
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
  }
  .e-name {
    height: 50px;
    line-height: 50px;
    text-align: left;
    font-size: 25px;
    font-weight: bold;
  }
  .e-dels {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eaeaea;
    .l-span {
      width: 100px;
      height: 40px;
      line-height: 40px;
      border-right: none;
      text-align: right;
      font-size: 12px;
      color: #000000;
    }
    .l-put {
      flex: 1;
      .el-form-item {
        margin-bottom: 0px;
      }
      .el-input__inner {
        border-radius: 0px;
      }
    }
  }
  .e-btn {
    text-align: center;
    height: 40px;
    line-height: 40px;
    margin-top: 5px;
    .el-button {
      padding: 9px 35px;
      border-radius: 0px;
    }
  }
}
</style>