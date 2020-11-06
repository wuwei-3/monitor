<template>
  <div class="dbhostmes">
    <div>
      HOST IP：{{ips.hostIP}}
    </div>
    <div>
      HOST OS TYPE：{{ips.hostOSType}}
    </div>
    <div>
      HOST PORT：{{ips.port}}
    </div>
    <div>
      HOST USER NAME：{{ips.userName}}
    </div>
    <div>
      DB VERSION：{{ips.version}}
    </div>
    <div>
      DB NAME：{{ips.dbName}}
    </div>
    <div>
      DB USER：{{ips.dbUser}}
    </div>
    <div>
      LISTENER PROT：{{ips.listenerPort}}
    </div>
    <div>
      ORACLE BASE：{{ips.oracleBase}}
    </div>
    <div>
      ORACLE HOME：{{ips.oracleHome}}
    </div>
    <div>
      DB UNIQUE NAME：{{ips.dbUniqueName}}
    </div>
    <div>
      CDB TYPE：{{ips.cdbType}}
    </div>
    <div>
      INST TYPE：{{ips.instType}}
    </div>
    <div>
      GROU NAME：{{ips.groupName}}
    </div>
    <div>
      DB TYPE NAME：{{ips.dbTypeName}}
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
.dbhostmes {
  height: 100%;
  div {
    font-size: 12px;
    height: 22px;
    line-height: 22px;
  }
}
</style>