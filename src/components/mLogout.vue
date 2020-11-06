<template>
  <!-- 登录退出弹窗 -->
  <div class="m-logout">
    <el-dialog :visible.sync="visible"
               :close-on-click-modal="false"
               width="400px"
               :show-close='false'
               v-dialogDrag>
      <div>
        <div class="e-name"><span>注销</span></div>
        <div class="e-dels">
          <div class="l-span">
            <span>确认退出当前账号?</span>
          </div>
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
import { out } from '@/api/login.js'

export default {
  components: {},
  props: {
    visible: false,
  },
  data () {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    cancel () {
      this.$emit('cancel', false)
    },
    confirm () {
      this.$store.state.headColor = false
      localStorage.setItem("headColor", false);
      out().then((result) => {
        this.$message.success('注销成功')
        this.$emit('cancel', true)
      }).catch((err) => {
        this.$message.error('注销失败')
      });
    },
  },
  created () { },
  mounted () { }
};
</script>
<style lang="scss">
.m-logout {
  height: 150px;
  .el-dialog__header {
    padding: 0;
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
    height: 50px;
    line-height: 50px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .l-span {
      height: 40px;
      line-height: 40px;
      border-right: none;
      text-align: center;
      font-size: 16px;
      color: #000000;
    }
    .l-put {
      flex: 1;
      .el-input__inner {
        border-radius: 0px;
      }
    }
  }
  .e-btn {
    text-align: center;
    height: 50px;
    line-height: 50px;
    margin-top: 5px;
    .el-button {
      padding: 9px 35px;
      border-radius: 0px;
    }
  }
}
</style>