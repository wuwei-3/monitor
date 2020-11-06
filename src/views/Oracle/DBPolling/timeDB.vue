<template>
  <!-- 逻辑读 -->
  <div class="timedb">
    <div class="e-top">
      <div class="p-select">
        <a-selet :options="reportOption"
                 @getOPtions="getOPtions"
                 :title="'IP地址'"
                 :reportId="file.oracleConfigId"></a-selet>
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
    <div class="e-bot"
         v-loading="loading">
      <div class="t-table">
        <div class="e-lefts">
          <div> SID：</div>
          <div> MAIL TITLE：</div>
          <div> TIME：</div>
          <div> E-MAIN：</div>
        </div>
        <div class="e-right">
          <div class="h60">
            <el-checkbox v-model="checked"
                         :disabled="true">{{dbName}}</el-checkbox>
          </div>
          <div class="h60">
            <el-input v-model="file.mailTitle"
                      placeholder="请输入内容"></el-input>
          </div>
          <div class="h60">
            <el-select v-model="file.times"
                       placeholder="请选择时间"
                       @change="getTime">
              <el-option v-for="(item,index) in optionsTime"
                         :key="index"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="t-mail h60">
            <el-select v-model="emailsDB"
                       placeholder="请选择Email"
                       multiple
                       collapse-tags
                       @change="getMail">
              <el-option v-for="item in optionsEmail"
                         :key="item"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="submit h60">
            <el-button type="primary"
                       @click="addTimeDb">提交</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import aTime from "@/components/Time";
import qDialog from "@/components/sqlDialog2";
import aSelet from "@/components/mSelect3";
import nTable from "@/components/nTable";
import dMessage from "@/components/dbHostMes";
import {
  queryPdbName,
  ipList
} from "@/api/systemMes";
import { queryExecutionPlan } from "@/api/common";
import { getInspectionTime, InspectionTime } from "@/api/DBPolling";
import aSelet1 from "@/components/aSelect";
import { formatDate } from '@/utils/date'
export default {
  components: {
    aSelet,
    nTable,
    dMessage,
    aSelet1,
    qDialog,
    aTime,
  },
  props: {},
  data () {
    return {
      emailsDB: [],
      dbName: '',
      optionsEmail: [],
      optionsTime: [
        { id: 1, name: '1:00' },
        { id: 2, name: '2:00' },
        { id: 3, name: '3:00' },
        { id: 4, name: '4:00' },
        { id: 5, name: '5:00' },
        { id: 6, name: '6:00' },
        { id: 7, name: '7:00' },
        { id: 8, name: '8:00' },
        { id: 9, name: '9:00' },
        { id: 10, name: '10:00' },
        { id: 11, name: '11:00' },
        { id: 12, name: '12:00' },
        { id: 13, name: '13:00' },
        { id: 14, name: '14:00' },
        { id: 15, name: '15:00' },
        { id: 16, name: '16:00' },
        { id: 17, name: '17:00' },
        { id: 18, name: '18:00' },
        { id: 19, name: '19:00' },
        { id: 20, name: '20:00' },
        { id: 21, name: '21:00' },
        { id: 22, name: '22:00' },
        { id: 23, name: '23:00' },
      ],
      input: '',
      checked: true,
      sql: '',
      dialogVisible: false,
      reportOption: [],
      tableData: [],
      dbStatus: false,
      loading: false,
      queryFile: "",
      ips: [],
      detail: false,
      file: {
        id: "",
        mailTitle: '',
        times: '',
        emails: '',
        oracleConfigId: '',
      },
      items: {
        pageNum: 1,
        pageSize: 50
      },
    };
  },
  methods: {
    // 提交
    addTimeDb () {
      if (!this.file.oracleConfigId) {
        return this.$message.error('请选择IP')
      }
      if (!this.file.mailTitle) {
        return this.$message.error('请输入邮件标题')
      }
      if (!this.file.times) {
        return this.$message.error('请选择时间')
      }
      this.file.oracleConfigId = Number(this.file.oracleConfigId)
      this.loading = true
      InspectionTime(this.file).then((result) => {
        this.$message.success(result.msg);
        this.loading = false
      }).catch((err) => {
        this.loading = false
         this.MyMessageHtml.error({
            dangerouslyUseHTMLString: true,
            message: err.msg
          });
      });
    },
    // 
    getTime (val) {
      this.file.times = val
    },
    getMail (val) {
      this.file.emails = val.join(',')
    },
    // 下拉框
    getOPtions (val) {
      this.file.oracleConfigId = val;
      this.detail = false;
      this.search(val)
      this.reportOption.forEach(item => {
        if (item.oracleConfigId == val) {
          return (this.ips = item);
        }
      });
    },
    // 获取主机列表
    getIps () {
      this.loading = true;
      ipList(this.items)
        .then(result => {
          if (result.data.length > 0) {
            this.reportOption = result.data || []
            this.file.oracleConfigId = result.data[0].oracleConfigId;
            this.ips = result.data[0];
            this.file.id = result.data[0].id
            this.search(this.file.oracleConfigId)
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
    search (val) {
      if (!val) {
        return this.$message.error("请选择IP");
      }
      this.getMes(val);
    },
    getMes (val) {
      this.loading = true;
      let _self = this;
      this.optionsEmail = []
      getInspectionTime({ id: val })
        .then(result => {
          this.loading = false;
          let data = result.data
          let par = {
            id: data.id || null,
            oracleConfigId: data.oracleConfigId,
            mailTitle: data.mailTitle,
            emails: [],
            times: Number(data.times) || '',
          }
          let emalis = []
          data.emails.forEach(item => {
            this.optionsEmail.push(item.email)
            if (item.checked == 'true') {
              emalis.push(item.email)
            }
          });
          par.emails = emalis
          this.emailsDB = emalis
          this.file = par
          this.dbName = data.dbName || ""
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
.timedb {
  height: 100%;
  width: 100%;
  .e-top {
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 10px;
    background: #f5f6fa;
    & .r10 {
      margin-right: 10px;
    }
    & .w100 {
      width: 100px;
    }
    .el-button {
      padding: 8px 20px;
      border-radius: 0px;
    }
    .p-select {
      position: absolute;
      font-size: 12px;
      right: -10px;
      display: flex;
      margin-right: 20px;
      cursor: pointer;
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
  .e-bot {
    height: calc(100% - 50px);
    background: #f5f6fa;
    display: flex;
    justify-content: center;
    overflow: auto;
    padding: 0px 10px 10px 10px;
    .t-table {
      width: 1023px;
      height: 494px;
      margin-top: 20px;
      background-color: #ffffff;
      border: solid 1px #e6e6e6;
      display: flex;
      .e-lefts {
        width: 200px;
        text-align: right;
        padding: 50px 0 0 0;
        div {
          height: 60px;
          line-height: 60px;
        }
      }
      .e-right {
        flex: 1;
        padding: 50px 74px 0 5px;
        .el-checkbox__label {
          font-size: 17px;
        }
        .t-mail {
          display: flex;
          .el-select {
            width: 100%;
            .el-input__inner {
              height: 40px !important;
            }
          }
        }
        .h60 {
          height: 60px;
          line-height: 60px;
        }
        .submit {
          .el-button {
            padding: 10px 23px;
            border-radius: 0px;
          }
        }
      }
    }
  }
}
</style>