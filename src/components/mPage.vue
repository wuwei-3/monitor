<template>
  <!-- 管理页面分页 -->
  <div class="m-pages">
    <a-pagination :pageSizeOptions="pageSizeOptions"
                  :total="total"
                  showSizeChanger
                  :pageSize="pageSize"
                  @change="onChange"
                  v-model="current"
                  @showSizeChange="onShowSizeChange">
      <template slot='buildOptionText'
                slot-scope='props'>
        <span>{{props.value}}条/页</span>
      </template>
    </a-pagination>
  </div>
</template>

<script>
export default {
  components: {},
  props: {

  },
  data () {
    return {
      total: 0,
      current: 1,
      pageSize: 15,//分页数
      pageSizeOptions: ['15', '30', '60', '100'],
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 分页方法
    onShowSizeChange (current, pageSize) {
      this.$emit('pageSie', pageSize)
    },
    onChange (pageNumber) {
      this.$emit('pageNumber', pageNumber)
    },
    update (val1, val2, val3) {
      this.total = val1
      this.current = val2
      this.pageSize = val3
    }
  },
  created () { },
  mounted () { }
};
</script>
<style lang="scss">
.m-pages {
  height: 32px;
  width: 100%;
  .ant-pagination-options-size-changer.ant-select {
    margin-right: 0px;
  }
}
</style>