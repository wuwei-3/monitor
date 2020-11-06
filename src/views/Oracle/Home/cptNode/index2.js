// 首页常量类
export default {
  // 实例状态
  instanSuc: {
    id: 0,
    top: "保护模式",
    bot: "正常",
    size: "18px",
    color: "#4cb15d"
  },
  instanErr: {
    id: 0,
    top: "保护模式",
    bot: "失败",
    color: "red"
  },
  // 监听状态
  monitorSuc: {
    id: 1,
    top: "角色",
    bot: "正常",
    size: "18px",
    color: "#4cb15d"
  },
  monitorErr: {
    id: 1,
    top: "角色",
    bot: "失败",
    color: "red"
  },
  // 归档模式
  archiveSuc: {
    id: 2,
    top: "实例状态",
    bot: "正常",
    color: "#00a8ec"
  },
  archiveErr: {
    id: 2,
    top: "实例状态",
    bot: "失败",
    color: "red"
  },
  // 快速分区大小
  fastSuc: {
    id: 3,
    top: "快速恢复区使用率",
    bot: "0%",
    color: "#00a8ec"
  },
  fastErr: {
    id: 3,
    top: "快速恢复区使用率",
    bot: "失败",
    color: "red"
  },
  // 监听时间
  writTimeSuc: {
    id: 4,
    top: "运行时间",
    color: "#79b6ff",
    width: "270px"
  },
  // 监听时间
  writTimeErr: {
    id: 4,
    top: "运行时间",
    width: "270px",
    color: "red"
  },
  // io读写
  readWritSuc: {
    id: 5,
    top: "监听状态",
    bot: "正常",
    color: "#3bcac8"
  },
  // io读写
  readWritErr: {
    id: 5,
    top: "监听状态",
    bot: "失败",
    color: "red"
  },
  // redo
  redoSuc: {
    id: 6,
    top: "REDO生成量",
    bot: "0.00Kb/S",
    color: "#3bcac8"
  },
  // redo
  redoErr: {
    id: 6,
    top: "REDO生成量",
    bot: "失败",
    color: "red"
  },
  // TPS
  tpsSSuc: {
    id: 7,
    top: "MRP状态",
    bot: "正常",
    color: "#3bcac8"
  },
  // TPS
  tpsSErr: {
    id: 7,
    top: "MRP状态",
    bot: "0/S",
    color: "red"
  },
  // 连接数
  connectSSuc: {
    id: 8,
    top: "归档日志",
    bot: "",
    size: "16px",
    color: "#3bcac8"
  },
  // 连接数
  connectSErr: {
    id: 8,
    top: "归档日志",
    size: "16px",
    bot: "0G",
    color: "red"
  },
  // top sql
  toables: [
    {
      id: 0,
      name: "物理读",
      color: true,
      orderName: "LOGICALREAD"
    },
    {
      id: 1,
      name: "逻辑读",
      color: false,
      orderName: "PHYSICALREAD"
    },
    {
      id: 2,
      name: "执行时间",
      color: false,
      orderName: "EXLAPSEDTIME"
    },
    {
      id: 3,
      name: "消耗CPU时间",
      color: false,
      orderName: "CPUTIME"
    },
    {
      id: 4,
      name: "执行次数",
      color: false,
      orderName: "EXCUTIONS"
    }
  ]
};
