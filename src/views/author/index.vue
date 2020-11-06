<template>
  <!-- 用户授权页面 登录前进入-->
  <div class="m-author">
    <div class="r-dialog">
      <div class="g-title">
        <div class="e-logo"><img src="@/assets/imgs/login/shouquan.png"
               alt=""></div>
        <div class="e-name"><span>三实数据库监控软件授权许可</span></div>
      </div>
      <div class="g-main">
        <div class="n-left">
          <div class="t-one"
               :style="{background:text?'#8acbeb': '#fff',color:text?'#fff':'#1c2226'}">1</div>
          <div class="t-border"></div>
          <div class="t-two"
               :style="{background:code?'#8acbeb': '#fff',color:code?'#fff':'#1c2226'}">2</div>
        </div>
        <div class="n-right">
          <div class="r-shouquan">申请码</div>
          <div class="n-name">
            <el-input type="textarea"
                      :rows="4"
                      placeholder="请输入申请码"
                      v-model="text"
                      :disabled="true">
            </el-input>
          </div>
          <div class="r-shouquan">授权码</div>
          <div>
            <el-input type="textarea"
                      :rows="7"
                      placeholder="请输入授权码"
                      v-model="code">
            </el-input>
          </div>
          <div class="r-btn">
            <el-button type="primary"
                       @click="author"><i class="el-icon-loading"
                 v-show="auto"></i>授权</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 授权提示框 -->
    <div class="r-el-dialog">
      <el-dialog :visible.sync="visible"
                 :show-close="false"
                 width="275px"
                 v-dialogDrag>
        <div class="g-suc">
          <div class="c-name"><i :class="mAuthor?'el-icon-success':'el-icon-warning'"
               :style="{color:mAuthor?'#4dc000':'#ff470f'}"></i>{{mAuthor?'授权成功':'授权失败'}}</div>
          <div class="c-btn">
            <el-button type="primary"
                       @click="login(mAuthor)">{{mAuthor?'请登录':'重新申请'}}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { apply, author, license } from "@/api/author.js";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  props: {},

  data () {
    return {
      mAuthor: true, // 成功失败状态
      visible: false, //弹窗
      auto: false, //图表展示
      oneS: "#fff", //样式
      text: "", //申请码
      code: "" //授权码
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 跳转到登录业
    login (val) {
      if (val) {
        this.$router.push("/");
      } else {
        this.visible = false;
        this.code = "";
      }
    },
    // 授权
    author () {
      let _self = this;
      if (!_self.code) {
        return this.$message.warning("请输入授权码");
      }
      _self.auto = true;
      author({ code: _self.code })
        .then(result => {
          _self.auto = false;
          // 跳转登录页面
          _self.visible = true;
          _self.mAuthor = true;
        })
        .catch(err => {
          // 失败
          _self.mAuthor = false;
          _self.auto = false;
          _self.visible = true;
        });
    },
    // 获取申请码信息
    getApply () {
      let _self = this;
      apply()
        .then(result => {
          _self.text = result.applyCode;
        })
        .catch(err => {
          _self.$message.error(err.msg);
        });
    },
    // 获取授权信息
    getInfo () {
      let _self = this;
      license()
        .then(result => {
          _self.code = result.code;
        })
        .catch(err => {
          // 查询异常不抛出去
        });
    }
  },
  created () { },
  mounted () {
    this.$store.commit("setTitle", false);
    localStorage.setItem("setTitle", false);
    this.$store.commit("setHeader", false);
    localStorage.setItem("setHeader", false);
    this.getApply();
    // 没登录 不用查询
    this.getInfo();
  }
};
</script>
<style lang="scss">
.m-author {
  width: 100%;
  height: 100%;
  background: url("../../assets/imgs/shouquan.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .r-el-dialog {
    .el-dialog__header {
      padding: 0px;
    }
    .g-suc {
      .c-name {
        font-size: 24px;
        color: #1c2226;
        text-align: center;
        i {
          color: #4dc000;
        }
      }
      .c-btn {
        text-align: center;
        margin-top: 10px;
        .el-button {
          padding: 8px 60px;
          border-radius: 0px;
        }
      }
    }
  }
  .r-dialog {
    width: 544px;
    height: 634px;
    background-color: #ffffff;
    border-radius: 15px;
    background: url("../../assets/imgs/shouquanform.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
    padding: 50px 30px 30px 30px;
    .g-title {
      display: flex;
      height: 65px;
      line-height: 65px;
      .e-name {
        font-size: 30px;
        font-weight: normal;
        font-stretch: normal;
        color: #ffffff;
      }
    }
    .g-main {
      height: 400px;
      width: 100%;
      margin-top: 90px;
      display: -webkit-box; // 左右布局
      .n-left {
        width: 50px;
        height: 100%;
        position: relative;
        .t-one,
        .t-two {
          width: 30px;
          height: 30px;
          background-color: #ffffff;
          border: solid 1px #d6d6d6;
          border-radius: 50%;
          line-height: 30px;
          text-align: center;
          position: absolute;
          z-index: 10;
        }
        .t-one {
          top: 5px;
        }
        .t-two {
          top: 140px;
        }
        .t-border {
          border-right: 1px solid #d9d9d9;
          height: 100%;
          position: absolute;
          left: 15px;
          top: 6px;
        }
      }
      .n-right {
        flex: 1;
        font-size: 14px;
        overflow: auto;
        .r-shouquan {
          height: 40px;
          line-height: 40px;
          font-weight: 550;
          color: #1c2226;
        }
        .r-btn {
          height: 50px;
          line-height: 50px;
          margin-top: 10px;
          .el-button {
            padding: 10px 30px;
            border-radius: 0px;
          }
        }
      }
    }
  }
}
</style>