<template>
  <!-- 统一左侧头组建 暂时前端写死 -->
  <div class="m-left">
    <div v-if="mIndex == 0">
      <div class="t-bolck"
           v-for="(item,index) in items"
           :key="index"
           @click="leftBlock(item,index)"
           @mousemove="showTableSys(index)"
           @mouseout="showTableSys(-1)"
           :style="{background:mColor == index || IColor == index ? '#20262b':'#232a30'}">
        <div :style="{color:mColor == index || IColor == index? '#fff':'#6f7a83'}">
          <div class="k-circle"
               :style="{border:mColor == index || IColor == index? '1px solid #fff':'1px solid #6f7a83'}">
            <i :class="['iconfont' ,item.icon]"></i></div>
          <div class="k-span"><span>{{item.name}}</span></div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="t-bolck"
           v-for="(item,index) in items1"
           :key="index"
           @click="leftBlock(item,index)"
           @mousemove="showTableSys(index)"
           @mouseout="showTableSys(-1)">
        <div :style="{color:mColor == index || IColor == index? '#fff':'#6f7a83'}">
          <div class="k-circle"
               :style="{border:mColor == index || IColor == index? '1px solid #fff':'1px solid #6f7a83'}">
            <i :class="['iconfont' ,item.icon]"></i></div>
          <div class="k-span"><span>{{item.name}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      IColor: -1,
      items: [
        {
          id: 0,
          name: '数据库',
          icon: 'iconshujuku1',
          path: '/index',
        }, {
          id: 1,
          name: '操作系统',
          icon: 'iconcaozuoxitongshitu',
          path: '/storeNode',
        }, {
          id: 2,
          name: 'DG',
          icon: 'iconshujuku',
          path: '/dgNode',
        }, {
          id: 3,
          name: 'RAC',
          icon: 'icondrdsfenbushiguanxixingshujukufuwuDRD',
          path: '/racNode',
        },
      ],
      items1: [
        {
          id: 0,
          name: '操作系統',
          icon: 'iconcaozuoxitongshitu',
          path: '/system',
        }, {
          id: 1,
          name: '数据库',
          icon: 'iconshujuku1',
          path: '/database',
        }, {
          id: 2,
          name: '主从',
          icon: 'iconjiedian1',
          path: '/prinSub',
        }
      ],
    };
  },
  watch: {
    mIndex: {
      handler (val1, val2) {
        this.$store.state.mColor = 0
        localStorage.setItem('mColor', 0)
        if (val1 == 0) {
          this.$router.push('/index')
        } else {
          this.$router.push('/system')
        }
        this.$store.commit("setTitle", false);
        localStorage.setItem("setTitle", false);
        this.$store.state.headColor = false
        localStorage.setItem("headColor", -1);
      },
      deep: true
    },
    mTitle: {
      handler (val1, val2) {
        if (val1) {
          this.$store.state.mColor = -1
          localStorage.setItem('mColor', -1)
        }
      },
      deep: true
    }
  },
  computed: {
    mTitle: function () {
      return this.$store.getters.getTitle
    },
    mIndex: function () {
      return this.$store.getters.getMIndex
    },
    mColor: function () {
      return this.$store.getters.getMColor
    },
  },
  methods: {
    // 左侧切换
    leftBlock (val, val2) {
      this.$router.push(val.path)
      this.$store.state.mColor = val2
      localStorage.setItem('mColor', val2)
      this.IColor = -1
      // 首页ip 切换
      this.$store.state.mEIndex = val.path
      localStorage.setItem('mEIndex', val.path)
    },
    showTableSys (val, val2) {
      this.IColor = val
    },
  },
  created () { },
  mounted () {
    this.IColor = -1
  }
};
</script>
<style lang="scss">
$color: #6f7a83;
.m-left {
  width: 100%;
  height: 100%;
  background-color: #232a30;
  .t-bolck {
    width: 91px;
    height: 100px;
    color: $color;
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    background: #232a30;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #1c2226;
    cursor: pointer;
    .k-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid $color;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
    }
    &:hover {
      color: #fff;
      .k-circle {
        border: 1px solid #fff;
      }
    }
  }
}
</style>