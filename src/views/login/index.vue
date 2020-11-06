<template>
  <!--登录页面 -->
  <div class="login"
       @keyup.enter="submitForm()">
    <div class="n-main">
      <div class="n-title"><span>用户登录</span></div>
      <div class="n-submit">
        <el-form :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm"
                 class="demo-ruleForm">
          <el-form-item prop="name">
            <div class="m-icon"><i class="iconfont iconyonghuming"></i></div>
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="word">
            <div class="m-icon"><i class="iconfont iconmima"></i></div>
            <el-input v-model="ruleForm.word"
                      show-password></el-input>
          </el-form-item>
          <div class="m-check">
            <el-checkbox v-model="ruleForm.checked">记住密码</el-checkbox>
          </div>
          <el-form-item class="m-sbumit">
            <a-spin class="t-span"
                    v-show="loading" />
            <el-button type="primary"
                       @click="submitForm()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 登录logo -->
    <div class="n-head">
      <img src="@/assets/imgs/login/logo.png"
           alt="">
      <span>三实数据库监控软件</span>
    </div>
    <m-thour :visible="visible"
             @cancel="cancel"></m-thour>
  </div>
</template>

<script>
// 辅助函数
// import { mapState } from 'vuex' 后期国际化使用
import { login } from "@/api/login.js";
import { license } from "@/api/author.js";
import { list } from "@/api/menu.js";
import { setToken, getToken } from "@/utils/auth.js";
import mThour from "@/components/aThour";
export default {
  components: {
    mThour
  },
  props: {},
  data () {
    return {
      visible: false, //二次校验弹窗
      loading: false,
      response: {},
      ruleForm: {
        name: "",
        word: "",
        checked: false
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        word: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 弹窗取消
    cancel (val) {
      if (val) {
        let res = JSON.stringify(this.response);
        setToken(this.response._TOKEN);
        sessionStorage.setItem("setToken", res);
        this.$store.commit("setToken", this.response);
        // 位置不能放错
        this.getList()
        // 跳转操作放在登录成功里面
        this.$message.success(this.response.msg);
        // 请求接口
        this.$store.commit("setHeader", true);
        localStorage.setItem("setHeader", true);
        // 存储用户名
        localStorage.setItem("system", JSON.stringify(this.ruleForm));
        this.$store.getters.getToken;

        this.$store.state.mIndex = 0
        localStorage.setItem("mIndex", 0);
        this.$store.state.mColor = 0
        localStorage.setItem("mColor", 0);
        this.$store.state.OMM = 0
        localStorage.setItem("OMM", 0);
        this.$store.state.headColor = false
        localStorage.setItem("headColor", false);
        //跳转到首页
        if (this.ruleForm.checked) {
          // 保存到浏览器中 再次进入显示登录信息
          localStorage.setItem("form", JSON.stringify(this.ruleForm));
        } else {
          localStorage.removeItem("form");
        }
        this.$router.push("index");
      } else {
        this.visible = false;
        this.loading = false;
      }
    },
    // 登录
    submitForm () {
      let that = this;
      if (!that.ruleForm.name && !that.ruleForm.word) {
        return that.$message.error("请输入用户名和密码");
      }
      if (!that.ruleForm.name) {
        return that.$message.error("请输入用户名");
      }
      if (!that.ruleForm.word) {
        return that.$message.error("请输入用密码");
      }
      that.loading = true;
      let par = {
        loginName: that.ruleForm.name,
        pwd: that.ruleForm.word
      };
      login(par)
        .then(response => {
          that.response = response;
          // 判断用户
          let sos = that.ruleForm.name.toLowerCase();
          if (sos == "system") {
            that.visible = true;
          } else {
            that.cancel(true);
          }
        })
        .catch(err => {
          that.loading = false;
          that.$message.error(err.msg);
        });
    },
    // 获取菜单信息
    getList () {
      list({ dbType: 'Oracle' })
        .then(result => {
          let list = result.data || [];
          this.$store.commit("setMenue", list);
          localStorage.setItem("setMenue", JSON.stringify(list));
          return true
        })
        .catch(err => {
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          return this.$router.push("index");
        });
    },
    // 获取登录信息
    getItem () {
      let form = localStorage.getItem("form");
      if (form) {
        this.ruleForm = JSON.parse(form);
      }
    }
  },
  mounted () {
    // 登录业去除头
    this.getItem();
    this.$store.commit("setTitle", false);
    localStorage.setItem("setTitle", false);
    this.$store.commit("setHeader", false);
    localStorage.setItem("setHeader", false);
    this.$store.state.mEIndex = '/index'
    localStorage.setItem('mEIndex', '/index')
  }
};
</script>
<style lang="scss">
// 设置公用字体模块
$fontSize: 18px;
.login {
  width: 100%;
  height: 100%;
  background: url("../../assets/imgs/login/back.png") no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .n-head {
    position: absolute;
    top: 110px;
    left: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 27px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 36px;
      letter-spacing: 0px;
      color: #fffefe;
      margin-left: 10px;
    }
  }
  .n-main {
    width: 38%;
    height: 471px;
    background-color: #081b3a;
    border-radius: 10px !important;
    opacity: 0.8;
    padding: 50px 90px;
    .n-title {
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 30px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 3px;
      color: #ffffff;
    }
    .n-submit {
      margin-top: 30px;
      .m-check {
        width: 100%;
        padding-left: 30px;
        margin-top: -10px;
        .el-checkbox__label {
          font-size: $fontSize;
          font-weight: normal;
          font-stretch: normal;
          line-height: 48px;
          letter-spacing: 0px;
          color: #a7b6cf;
        }
        .el-checkbox__inner {
          width: 18px;
          height: 18px;
          background-color: #081b39;
        }
        .el-checkbox__inner::after {
          height: 9px;
          left: 6px;
          position: absolute;
          top: 2px;
        }
      }
      .el-input__inner {
        border-radius: 32px !important;
        height: 63px;
        line-height: 63px;
        font-size: $fontSize;
        padding: 0 62px;
        background-color: #081b3a !important;
        color: #fff;
      }
      .el-form-item__content {
        display: flex;
        position: relative;
        margin-left: 0 !important;
        margin-top: 10px;
        .m-icon {
          position: absolute;
          z-index: 1;
          left: 25px;
          top: 10px;
          i {
            font-size: 30px;
            color: #fff;
          }
          .iconyonghuming {
            font-size: 26px;
          }
        }
        .el-input__suffix {
          font-size: 20px;
          right: 17px;
        }
        .el-form-item__error {
          font-size: $fontSize;
          left: 20px;
        }
      }
      .m-sbumit {
        position: relative;
        .el-form-item__content {
          display: flex;
          justify-content: center;
          .el-button {
            width: 249px;
            height: 60px;
            border-radius: 30px !important;
            background-color: #081b3a;
            font-size: $fontSize;
            span {
              color: #00a2e6;
            }
          }
        }
        .el-loading-mask {
          background-color: transparent;
        }
        .ant-spin-spinning {
          position: absolute;
          top: 21px;
          margin-left: -41px;
        }
        .ant-spin {
          display: transparent;
        }
      }
    }
  }
}
</style>