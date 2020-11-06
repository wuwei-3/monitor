<template>
  <!-- 逻辑读 -->
  <div class="copyStatus"
       v-loading="loading">
    <div v-html="tableData"></div>
    <div class="p-select">
      <a-selet :options="reportOption"
               @getOPtions="getOPtions"
               :title="'IP地址'"
               :reportId="file.id"></a-selet>
      <div class="n-select">
        <img src="@/assets//imgs/select.png"
             @mouseover="overImge(true)"
             @mouseout="overImge(false)">
        <div class="t-details"
             v-show="detail"
             @mouseover="overImge(true)"
             @mouseout="overImge(false)">
          <d-message :ips="ips"></d-message>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nTable from "@/components/nTable";
import aSelet from "@/components/mSelect3";
import dMessage from "@/components/dbHostMes";
import { ipList } from "@/api/systemMes";
export default {
  components: {
    nTable,
    aSelet,
    dMessage
  },
  props: {},
  data () {
    return {
      detail: false,
      ips: {},
      reportOption: [],
      tableData: '',
      loading: false,
      file: {
        id: ''
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
    };
  },
  mounted () {
    this.getIps()
  },
  methods: {
    getOPtions (val) {
      this.file.id = val;
      this.detail = false;
      this.loading = true;
      this.reportOption.forEach(item => {
        if (item.oracleConfigId == val) {
          return (this.ips = item);
        }
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
    // 获取主机列表
    getIps () {
      this.loading = true;
      ipList(this.items)
        .then(result => {
          if (result.data.length > 0) {
            this.reportOption = result.data || []
            this.file.id = result.data[0].oracleConfigId;
            this.ips = result.data[0];
            this.loading = false
          }
        })
        .catch(err => {
          this.loading = false
           this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
        });
    },
  },

};
</script>
<style lang="scss">
.copyStatus {
  height: 100%;
  width: 100%;
  background: #f5f6f7;
  padding: 10px;
  position: relative;
  .p-select {
    position: absolute;
    font-size: 12px;
    right: -10px;
    display: flex;
    cursor: pointer;
    margin-right: 20px;
    top: -37px;
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
</style>