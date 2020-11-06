import Vue from "vue";
import Router from "vue-router";
import login from "./views/login/index.vue"; //默认路径
Vue.use(Router);

const router = new Router({
  // history hash abstract 打包模式（hash）
  mode: "history",
  routes: [
    {
      path: "/",
      name: "login",
      component: login //登陆页
    },
    {
      path: "/index",
      name: "index",
      meta: {
        requiresAuth: true // 前端登录拦截ss
      },
      component: resolve =>
        require(["./views/Oracle/Home/cptNode/index.vue"], resolve) // 首页 计算节点
    },
    {
      path: "/author",
      name: "author",
      component: resolve => require(["./views/author/index.vue"], resolve) // 授权页面
    },
    {
      path: "/OWtable",
      name: "OWtable",
      meta: {
        requiresAuth: true
      },
      component: resolve => require(["./components/OWtable.vue"], resolve) //DB性能优化 小页面
    },
    {
      path: "/dgNode",
      name: "dgNode",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/Home/dgNode/index.vue"], resolve) //DG 首页
    },
    {
      path: "/racNode",
      name: "racNode",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/Home/racNode/index.vue"], resolve) //RAC 首页 回头写
    },
    {
      path: "/storeNode",
      name: "storeNode",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/Home/stoNode/index.vue"], resolve) //存储节点 首页
    },
    {
      path: "/mRoleTbl",
      name: "mRoleTbl",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemGer/Role/index.vue"], resolve) //系统管理 角色页面
    },
    {
      path: "/mUserTbl",
      name: "mUserTbl",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemGer/User/index.vue"], resolve) // 系统管理 用户页面
    },
    {
      path: "/mSysTbl",
      name: "mSysTbl",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemGer/System/index.vue"], resolve) // 系统管理 管理员页面
    },
    {
      path: "/scRuleC",
      name: "scRuleC",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemGer/scheduRule/index.vue"], resolve) // 系统管理 调度规则配置
    },
    {
      path: "/reportC",
      name: "reportC",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemGer/reportConfig/index.vue"], resolve) // 系统管理 告警项配置
    },
    {
      path: "/monitorC",
      name: "monitorC",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemGer/monitorConfig/index.vue"], resolve) // 系统管理 监控项配置
    },
    {
      path: "/dataTypeC",
      name: "dataTypeC",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemGer/dataTypeConfig/index.vue"], resolve) // 系统管理 数据库类型配置
    },
    {
      path: "/dataBaseC",
      name: "dataBaseC",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemGer/dataBaseConfig/index.vue"], resolve) // mysql 数据库
    },
    {
      path: "/alarmlC",
      name: "alarmlC",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemGer/alarmlConfig/index.vue"], resolve) // 系统管理 告警级别配置
    },
    {
      path: "/mailCf",
      name: "mailCf",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemList/mail/index.vue"], resolve) // 系统管理 收发邮件
    },
    {
      path: "/hostCf",
      name: "hostCf",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemList/hosts/index.vue"], resolve) // 系统管理 主机配置
    },
    {
      path: "/dataCf",
      name: "dataCf",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemList/data/index.vue"], resolve) // 系统管理 数据库信息
    },
    {
      path: "/alarmCf",
      name: "alarmCf",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemList/alarm/index.vue"], resolve) // 系统管理 告警信息
    },
    {
      path: "/monitorCf",
      name: "monitorCf",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemList/monitor/index.vue"], resolve) // 系统管理 监控数据保留
    },
    {
      path: "/findLargeFile",
      name: "findLargeFile",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemMes/findLargeFile/index.vue"], resolve) // sql 查找大文件
    },
    {
      path: "/logicRead",
      name: "logicRead",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBOptimize/SQL/logicRead/index.vue"], resolve) // sql 逻辑读
    },
    {
      path: "/physics",
      name: "physics",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBOptimize/SQL/physics/index.vue"], resolve) // sql 物理读
    },
    {
      path: "/hightSQL",
      name: "hightSQL",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBOptimize/SQL/hightSQL/index.vue"], resolve) // sql 高版本
    },
    {
      path: "/scanSQL",
      name: "scanSQL",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBOptimize/SQL/scanSQL/index.vue"], resolve) // sql 全表扫描
    },
    {
      path: "/sortSQL",
      name: "sortSQL",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBOptimize/SQL/sortSQL/index.vue"], resolve) // sql 排序
    },
    {
      path: "/frenqSQL",
      name: "frenqSQL",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBOptimize/SQL/frenqSQL/index.vue"], resolve) // sql 频率
    },
    {
      path: "/longTimeSQL",
      name: "longTimeSQL",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/SQL/longTimeSQL/index.vue"
        ], resolve) // sql 频率
    },
    {
      path: "/profile",
      name: "profile",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Monitor/profile/index.vue"
        ], resolve) // profile 查询
    },
    {
      path: "/callbackStatus",
      name: "callbackStatus",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Monitor/callbackStatus/index.vue"
        ], resolve) // 数据字典
    },
    {
      path: "/dataDiction",
      name: "dataDiction",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Monitor/dataDiction/index.vue"
        ], resolve) // 数据字典
    },
    {
      path: "/hotObject",
      name: "hotObject",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Monitor/hotObject/index.vue"
        ], resolve) // 热对象
    },
    {
      path: "/tableKey",
      name: "tableKey",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Monitor/tableKey/index.vue"
        ], resolve) // 表外键
    },
    {
      path: "/Awr",
      name: "Awr",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBOptimize/Property/Awr/index.vue"], resolve) // awr
    },
    {
      path: "/activeSession",
      name: "activeSession",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Property/activeSession/index.vue"
        ], resolve) // 活动会话
    },
    {
      path: "/bufferHitRatio",
      name: "bufferHitRatio",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Property/bufferHitRatio/index.vue"
        ], resolve) // 缓冲区命中率
    },
    {
      path: "/lineMigration",
      name: "lineMigration",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Property/lineMigration/index.vue"
        ], resolve) // 行迁移
    },
    {
      path: "/cpuSession",
      name: "cpuSession",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Property/cpuSession/index.vue"
        ], resolve) // cpu 会话
    },
    {
      path: "/sqlPlan",
      name: "sqlPlan",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Property/sqlPlan/index.vue"
        ], resolve) //sql 执行计划
    },
    {
      path: "/useTable",
      name: "useTable",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/useTable/index.vue"], resolve) //表使用情况
    },
    {
      path: "/IOTable",
      name: "IOable",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/IO/index.vue"], resolve) //表使用情况
    },
    {
      path: "/dataFile",
      name: "dataFile",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/dataFile/index.vue"], resolve) //查询段分配大小
    },
    {
      path: "/useSize",
      name: "useSize",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/useSize/index.vue"], resolve) //查询段使用大小
    },
    {
      path: "/allocationSize",
      name: "allocationSize",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/allocationSize/index.vue"], resolve) //未使用索引
    },
    {
      path: "/objectSize",
      name: "objectSize",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/objectSize/index.vue"], resolve) //查询对象大小
    },
    {
      path: "/objectDdl",
      name: "objectDdl",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/objectDdl/index.vue"], resolve) //查询LOB对象
    },
    {
      path: "/objectLob",
      name: "objectLob",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/objectLob/index.vue"], resolve) //查询LOB对象
    },
    {
      path: "/zoneMes",
      name: "zoneMes",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/zoneMes/index.vue"], resolve) //查询分区表信息
    },
    {
      path: "/objectFile",
      name: "objectFile",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/objectFile/index.vue"], resolve) //查询数据文件对象
    },
    {
      path: "/tableHSValue",
      name: "tableHSValue",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/tableHSValue/index.vue"], resolve) //查询表的哈希值
    },
    {
      path: "/noBindValue",
      name: "noBindValue",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/noBindValue/index.vue"], resolve) //查询非绑定SQL
    },
    {
      path: "/healthSQL",
      name: "healthSQL",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/healthSQL/index.vue"], resolve) //查询DBLog
    },
    {
      path: "/dblog",
      name: "dblog",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/dblog/index.vue"], resolve) //查询DBLog
    },
    {
      path: "/monitorLog",
      name: "monitorLog",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/monitorLog/index.vue"], resolve) //traceFile
    },
    {
      path: "/traceFile",
      name: "traceFile",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/traceFile/index.vue"], resolve) //traceFile
    },
    {
      path: "/automatic",
      name: "automatic",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/automatic/index.vue"], resolve) //自动维护任务
    },
    {
      path: "/OS",
      name: "OS",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/OS/index.vue"], resolve) //OS
    },
    {
      path: "/dbStatus",
      name: "dbStatus",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/dbStatus/index.vue"], resolve) //OS
    },
    {
      path: "/sqlMsg",
      name: "sqlMsg",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/sqlMsg/index.vue"], resolve) //OS
    },
    {
      path: "/objectStatus",
      name: "objectStatus",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/objectStatus/index.vue"], resolve) //查询IM对象状态
    },
    {
      path: "/spaceUseIM",
      name: "spaceUseIM",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/spaceUseIM/index.vue"], resolve) //查询IM空间使用情况
    },
    {
      path: "/allIMmes",
      name: "allIMmes",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/allIMmes/index.vue"], resolve) //查询IM空间使用情况
    },
    {
      path: "/useIM",
      name: "useIM",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/useIM/index.vue"], resolve) //表启用
    },
    {
      path: "/tableStartIM",
      name: "tableStartIM",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/tableStartIM/index.vue"], resolve) //表字段启用
    },
    {
      path: "/PDBinfo",
      name: "PDBinfo",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/PDBinfo/index.vue"], resolve) //表字段启用
    },
    {
      path: "/resource",
      name: "resource",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/resource/index.vue"], resolve) //表字段启用
    },
    {
      path: "/resourcePlan",
      name: "resourcePlan",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/resourcePlan/index.vue"], resolve) //表字段启用
    },
    {
      path: "/dbAwit",
      name: "dbAwit",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBOptimize/Others/dbAwit.vue"], resolve) //查询DB等待事件
    },
    {
      path: "/systemSource",
      name: "systemSource",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBOptimize/Others/systemSource.vue"], resolve) //查询DB等待事件
    },
    {
      path: "/callbacklSession",
      name: "callbacklSession",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Others/callbacklSession.vue"
        ], resolve) //查询DB等待事件
    },
    {
      path: "/fileSize",
      name: "fileSize",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/fileSize.vue"], resolve) //查询归档日志
    },
    {
      path: "/SGA",
      name: "SGA",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/SVG.vue"], resolve) //查询SGA使用情况
    },
    {
      path: "/noDeafult",
      name: "noDeafult",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/noDeafult.vue"], resolve) //查询非默认查收
    },
    {
      path: "/tableData",
      name: "tableData",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/tableData.vue"], resolve) //查询表数据量
    },
    {
      path: "/LOG",
      name: "LOG",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/LOG.vue"], resolve) //查询在线日志切换频率
    },
    {
      path: "/historyMon",
      name: "historyMon",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemMes/historyMon/index.vue"], resolve) //查询在线日志切换频率
    },
    ,
    {
      path: "/emergency",
      name: "emergency",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/SystemMes/emergency/index.vue"], resolve) //告警信息
    },
    {
      path: "/tableAdd",
      name: "tableAdd",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/tableAdd/index.vue"], resolve) //查询在线日志切换频率
    },
    {
      path: "/temporaryTable",
      name: "temporaryTable",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/temporaryTable.vue"], resolve) //查询在线日志切换频率
    },
    {
      path: "/SCN",
      name: "SCN",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/SCN.vue"], resolve) //查询在线日志切换频率
    },
    {
      path: "/callback",
      name: "callback",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/callback.vue"], resolve) //查询在线日志切换频率
    },
    {
      path: "/DBback",
      name: "DBback",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/DBback.vue"], resolve) //查询在线日志切换频率
    },
    {
      path: "/DBObject",
      name: "DBObject",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/DBObject.vue"], resolve) //查询在线日志切换频率
    },
    {
      path: "/DBReport",
      name: "DBReport",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/DBReport.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/PSU",
      name: "PSU",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/PSU.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/nJOB",
      name: "nJOB",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/nJOB.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/monitorStatus",
      name: "monitorStatus",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/monitor.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/database",
      name: "database",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/MySQL/database/index.vue"], resolve) // mysql 数据库
    },
    {
      path: "/prinSub",
      name: "prinSub",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/MySQL/prinSub/index.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/system",
      name: "system",
      meta: {
        requiresAuth: true
      },
      component: resolve => require(["./views/MySQL/system/index.vue"], resolve) // mysql 首页
    },
    {
      path: "/noUserObj",
      name: "noUserObj",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/noUserObj.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    // 无效对象
    {
      path: "/REDO",
      name: "REDO",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/REDO/index.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/healthIndex",
      name: "healthIndex",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/health/index.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/lockObject",
      name: "lockObject",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/lockObject.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/tnsnames",
      name: "tnsnames",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/tnsnames.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/listener",
      name: "listener",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/listener.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/sqlnet",
      name: "sqlnet",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/sqlnet.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/hitRate",
      name: "hitRate",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/hitRate.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/MRP",
      name: "MRP",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DataGrard/MRP/index.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/DGPolling",
      name: "DGPolling",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DataGrard/DGPolling/index.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/DGInspact",
      name: "DGInspact",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DataGrard/DGInspact/index.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/timeDB",
      name: "timeDB",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBPolling/timeDB.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/disk",
      name: "disk",
      meta: {
        requiresAuth: true
      },
      component: resolve => require(["./views/Oracle/RAC/disk.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/diskStatus",
      name: "diskStatus",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/diskStatus.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/attribute",
      name: "attribute",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/attribute.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/diskIO",
      name: "diskIO",
      meta: {
        requiresAuth: true
      },
      component: resolve => require(["./views/Oracle/RAC/diskIO.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/template",
      name: "template",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/template.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/rebalanceState",
      name: "rebalanceState",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/rebalanceState.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/failoverCheck",
      name: "failoverCheck",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/failoverCheck.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/GRIDLog",
      name: "GRIDLog",
      meta: {
        requiresAuth: true
      },
      component: resolve => require(["./views/Oracle/RAC/GRIDLog.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/monitorGRIDLog",
      name: "monitorGRIDLog",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/monitorGRIDLog.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/traceFileContent",
      name: "traceFileContent",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/traceFileContent.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/orcStatus",
      name: "orcStatus",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/orcStatus.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/gridStatus",
      name: "gridStatus",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/gridStatus.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/resourceState",
      name: "resourceState",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/resourceState.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/LoadBalance",
      name: "LoadBalance",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/RAC/LoadBalance.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/OCRBackupInfo",
      name: "OCRBackupInfo",
      meta: {
        requiresAuth: true
      },
      component: resolve => require(["./views/Oracle/RAC/ORC.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/ASM",
      name: "ASM",
      meta: {
        requiresAuth: true
      },
      component: resolve => require(["./views/Oracle/RAC/ASM.vue"], resolve) //创建、生成、下载数据库巡检报告
    },
    {
      path: "/resourcesMonitor",
      name: "resourcesMonitor",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/resourcesMonitor.vue"
        ], resolve)
    },
    {
      path: "/statusMonitor",
      name: "statusMonitor",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/statusMonitor.vue"
        ], resolve)
    },
    {
      path: "/keyMonitor",
      name: "keyMonitor",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/keyMonitor.vue"
        ], resolve)
    },
    {
      path: "/innoDB",
      name: "innoDB",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/innoDB.vue"
        ], resolve)
    },
    {
      path: "/courseMonitor",
      name: "courseMonitor",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/courseMonitor.vue"
        ], resolve)
    },
    {
      path: "/tableAnaly",
      name: "tableAnaly",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/tableAnaly.vue"
        ], resolve)
    },
    {
      path: "/pieceSerach",
      name: "pieceSerach",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/pieceSerach.vue"
        ], resolve)
    },
    {
      path: "/indexMesSearch",
      name: "indexMesSearch",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/indexMesSearch.vue"
        ], resolve)
    },
    {
      path: "/characterServer",
      name: "characterServer",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/characterServer.vue"
        ], resolve)
    },
    {
      path: "/dataServer",
      name: "dataServer",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/dataServer.vue"
        ], resolve)
    },
    {
      path: "/tableMesSearch",
      name: "tableMesSearch",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/tableMesSearch.vue"
        ], resolve)
    },
    {
      path: "/tableSizeSearch",
      name: "tableSizeSearch",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/tableSizeSearch.vue"
        ], resolve)
    },
    {
      path: "/errorLogSearch",
      name: "errorLogSearch",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/errorLogSearch.vue"
        ], resolve)
    },
    {
      path: "/mysqLog",
      name: "mysqLog",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/mysqLog.vue"
        ], resolve)
    },
    {
      path: "/dataReport",
      name: "dataReport",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBPolling/dataReport.vue"
        ], resolve)
    },
    {
      path: "/slowSearch",
      name: "slowSearch",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBOptimize/slowSearch.vue"
        ], resolve)
    },
    {
      path: "/awrReport",
      name: "awrReport",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/DBOptimize/awrReport.vue"
        ], resolve)
    },
    {
      path: "/copyStatus",
      name: "copyStatus",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/Replication/copyStatus.vue"
        ], resolve)
    },
    {
      path: "/slaveStatus",
      name: "slaveStatus",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          /* webpackChunkName: "about" */ "./views/MySQL/Replication/slaveStatus.vue"
        ], resolve)
    },
    {
      path: "/tableDebris",
      name: "tableDebris",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Table/tableDebris/index.vue"
        ], resolve) //表碎片
    },
    {
      path: "/indexDebris",
      name: "indexDebris",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Table/indexDebris/index.vue"
        ], resolve) //索引碎片
    },
    {
      path: "/noUseIndex",
      name: "noUseIndex",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/noUseIndex/index.vue"], resolve) //未使用索引
    },
    {
      path: "/lockIndexMes",
      name: "lockIndexMes",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/Oracle/DBManager/IndexMes/index.vue"], resolve) //索引使用情况
    },
    {
      path: "/getIndexMes",
      name: "getIndexMes",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/StatisticsInfo/getIndexMes/index.vue"
        ], resolve) //收集索引统计信息
    },
    {
      path: "/getUserMes",
      name: "getUserMes",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/StatisticsInfo/getUserMes/index.vue"
        ], resolve) //收集用户统计信息
    },
    {
      path: "/getTableMes",
      name: "getTableMes",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/StatisticsInfo/getTableMes/index.vue"
        ], resolve) //收集表统计
    },
    {
      path: "/indexMes",
      name: "indexMes",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/StatisticsInfo/indexMes/index.vue"
        ], resolve) //索引信息
    },
    {
      path: "/longTimeLock",
      name: "longTimeLock",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/Property/longTimeLock/index.vue"
        ], resolve) //长时间没释放锁
    },
    {
      path: "/tableMes",
      name: "tableMes",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require([
          "./views/Oracle/DBOptimize/StatisticsInfo/tableMes/index.vue"
        ], resolve) //表统计信息
    },
    {
      path: "/SDType",
      name: "SDType",
      meta: {
        requiresAuth: true
      },
      component: resolve =>
        require(["./views/MySQL/SystemMes/data/index.vue"], resolve) //表统计信息
    }
  ]
});
// 用户登录拦截 打包后无法访问 待解决
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 授权页面不拦截
    let User = sessionStorage.getItem("setToken");
    if (User) {
      next();
    } else {
      next({ path: "/" }); //前端路由拦截 跳转登录页
    }
  } else {
    next();
  }
});
export default router;
