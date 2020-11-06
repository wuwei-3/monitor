<template>
  <!-- 查找大文件 -->
  <div class="find-large">
    <div class="e-top">
      <div class="r20">
        <el-input v-model="file.fileSize"
                  placeholder="请输入文件大小(M)"
                  clearable></el-input>
      </div>
      <div class="r20">
        <el-input v-model="file.filePath"
                  placeholder="请输入文件路径"
                  clearable></el-input>
      </div>
      <!-- but1 -->
      <div class="sys-add r20">
        <el-button class="el-icon-circle-plus-outline"
                   @click="search"
                   plain>查询</el-button>
      </div>
      <div class="p-select">
        <a-selet :options="reportOption"
                 @getOPtions="getOPtions"
                 :title="'IP地址'"
                 :reportId="file.id"></a-selet>
        <div class="n-select">
          <img src="@/assets//imgs/select.png"
               @mouseover="overImge(true)"
               @mouseout="overImge(false)">
          <div class="e-san"
               v-show="detail"></div>
          <div class="t-details"
               v-show="detail"
               @mouseover="overImge(true)"
               @mouseout="overImge(false)">
            <d-message :ips="ips"></d-message>
          </div>
        </div>
      </div>
    </div>
    <div class="e-bot"
         v-loading="loading">
      <div class="t-noDate"
           v-show="!queryFile">暂无数据</div>
      <p><span v-html="queryFile"></span></p>
    </div>
  </div>
</template>

<script>
import aSelet from "@/components/mSelect2";
import dMessage from "@/components/dbHostMes2";
import { queryBigFile, hostIpList } from "@/api/systemMes";
export default {
  components: {
    aSelet,
    dMessage
  },
  props: {},
  data () {
    return {
      reportOption: [],
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        fileSize: "",
        filePath: ""
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
    };
  },
  watch: {
    'file.fileSize': {
      handler (val1, val2) {
        if (val1.id && val1.fileSize && val1.filePath) {
          return this.search()
        } else {
          this.queryFile = ''
        }
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    // 下拉框
    getOPtions (val) {
      this.file.id = val;
      this.detail = false;
      this.file.fileSize = ''
      this.file.filePath = ''
      this.reportOption.forEach(item => {
        if (item.id == val) {
          return (this.ips = item);
        }
      });
    },
    // 获取主机列表
    getIps () {
      let _self = this;
      hostIpList(this.items)
        .then(result => {
          if (result.data.length > 0) {
            this.reportOption = result.data || []
            this.file.id = result.data[0].id;
            this.ips = result.data[0];
          }
        })
        .catch(err => {
          _self.$message.error(err.msg);
        });
    },
    overImge (val) {
      if (val) {
        if (this.file.id) {
          this.detail = true
        } else {
          return this.$message.warning("请先选择IP");
        }
      } else {
        this.detail = false
      }
    },
    search () {
      if (!this.file.id) {
        return this.$message.error("请选择IP");
      }
      if (!this.file.fileSize) {
        return this.$message.error("请输入文件大小");
      }
      let num = Number(this.file.fileSize)
      if (this.$_.isNaN(num)) {
        return this.$message.error("文件大小单位为整数（M）");
      }
      if (!this.file.filePath) {
        return this.$message.error("请选择文件路径");
      }
      this.getMes(this.file);
    },
    getMes (val) {
      this.loading = true;
      let _self = this;
      queryBigFile(val)
        .then(result => {
          let d = result.data.length;
          // 注意换行符替换
          _self.queryFile = result.data.replace(/<br\\>/g, "<br>");
          this.loading = false;
        })
        .catch(err => {
          this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
          this.loading = false;
        });
    }
  },
  created () { },
  mounted () {
    this.getIps();
  }
};
</script>
<style lang="scss">
.find-large {
  height: 100%;
  width: 100%;
  .e-top {
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    background: #f5f6fa;
    padding: 10px;
    .e-btn {
      .el-button {
        padding: 9px 20px;
      }
    }
    .el-input__inner {
      height: 35px;
      line-height: 35px;
      font-size: 12px;
    }
    .p-select {
      position: absolute;
      font-size: 12px;
      right: 0px;
      display: flex;
      cursor: pointer;
      margin-right: 10px;
      .n-select {
        margin-left: auto;
        position: relative;
        img {
          height: 100%;
        }
        .e-san {
          width: 0px;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 9px solid #d2d6d8;
          position: absolute;
          top: 40px;
          right: 10px;
          z-index: 1;
        }
        .t-details {
          min-width: 365px;
          min-height: 198px;
          background-color: #ffffff;
          border: solid 1px #eaeaea;
          position: absolute;
          z-index: 10;
          right: -19px;
          padding: 10px;
          overflow: auto;
          top: 50px;
          .s-span {
            height: 22.5px;
            line-height: 23px;
          }
        }
      }
    }
  }
  & .r20 {
    margin-right: 10px;
  }
  & .sys-add {
    .el-button {
      background: #24bd6f;
      color: #fff;
      padding: 8px 10px;
    }
  }
  .e-bot {
    height: calc(100% - 50px);
    background: #ffffff;
    position: relative;
    overflow: auto;
    padding: 0px 10px 10px 10px;
    .t-noDate {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 15px;
    }
  }
}
</style>