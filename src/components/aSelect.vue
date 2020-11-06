<template>
  <!-- 管理页面下拉框 白色背景  不支持模糊搜索-->
  <a-select optionFilterProp="children"
            :style="aSelect.width"
            :placeholder='aSelect.holder'
            :allowClear="aSelect.cleear"
            @change="handleChange">
    <a-select-option :value="item.id || item.NAME || item.oracleConfigId"
                     v-for="(item,index) in aSelect.items"
                     :key="index">{{item.ip ||item.name || item.NAME || item.hostIP + ' '+ item.userName }}</a-select-option>
  </a-select>
</template>
<script>
export default {
  props: {
    aSelect: {
      type: Object,
      default: () => {
        return {
          // 下拉框宽度
          width: "width:100px",
          // 是否支持清除
          cleear: true,
          holder: "启用状态",
          // 下拉框内容
          items: [
            {
              id: 1,
              name: "启用"
            },
            {
              id: 0,
              name: "不启用"
            }
          ]
        };
      }
    }
  },
  data () {
    return {};
  },
  methods: {
    handleChange (value) {
      this.$emit("aSelect", value);
    }
  },
  mounted () { }
};
</script>
<style>
/* 去除radius */
.el-input__inner {
  border-radius: 0;
}
.ant-select-selection {
  border-radius: 0;
}
.ant-select-dropdown-menu-item:first-child {
  border-radius: 0px;
}
.ant-select-dropdown-menu-item {
  font-size: 12px;
}
</style>
