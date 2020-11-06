<template>
  <!-- 主机大文件使用 -->
  <div class="dbhostmes2">
    <div>
      HOST IP：{{ips.ip}}
    </div>
    <div>
      HOST PORT：{{ips.port}}
    </div>
    <div>
      HOST OS TYPE：{{ips.osType}}
    </div>
    <div>
      OS：{{ips.osName}}
    </div>
    <div>
      CPU：{{ips.cpuInfo}}
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    ips: ""
  },
  data () {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created () { },
  mounted () { }
};
</script>
<style lang="scss">
.dbhostmes2 {
  height: 100%;
  div {
    font-size: 12px;
    height: 22px;
    line-height: 22px;
  }
}
</style>