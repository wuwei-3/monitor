<template>
  <div class="a-thour"
       @keyup.enter="confirm">
    <el-dialog :visible.sync="visible"
               :close-on-click-modal="false"
               width="400px"
               :show-close='false'
               v-dialogDrag>
      <div>
        <div class="e-name"><span>管理员验证</span></div>
        <div class="e-dels">
          <div class="l-span">
            <span>验证密码</span>
          </div>
          <div class="l-put">
            <el-input v-model="checkCode"
                      placeholder="请输入验证码"
                      type="password"></el-input>
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
import { sysLogin } from "@/api/author.js";
export default {
  components: {},
  props: {
    visible: false
  },
  data () {
    return {
      checkCode: "" //测试使用 3200a1f3
    };
  },
  watch: {},
  computed: {},
  methods: {
    cancel () {
      this.$emit("cancel", false);
    },
    confirm () {
      if (!this.checkCode) {
        return this.$message.error("请输入验证码");
      }
      sysLogin({
        checkCode: this.checkCode
      })
        .then(result => {
          // 

          this.$emit("cancel", true);
        })
        .catch(err => {
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    }
  },
  created () { },
  mounted () { }
};
</script>
<style lang="scss">
.a-thour {
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
    .l-span {
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