module.exports = {
  // 访问路径
  publicPath: "./",
  // 打包文件目录
  outputDir: "dist",
  // 静态资源目录
  assetsDir: "static",
  // 哈希缓存
  filenameHashing: true,
  // eslint-loader 开启检查
  lintOnSave: false,
  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: false,
  // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
  transpileDependencies: [],
  // 生产环境 sourceMap
  productionSourceMap: false,
  css: {
    // 是否开启支持 foo.module.css 样式
    modules: false,
    // 是否使用 css 分离插件
    extract: true,
    // 是否构建样式地图，false 将提高构建速度
    sourceMap: false
  },
  devServer: {
    open: true, //配置自动启动浏览器
    host: "127.0.0.1",
    port: 8888, //启动端口
    https: false,
    hotOnly: false,
    // 解決前端跨域问题  http://192.168.31.98:9000 http://192.168.20.66:9000
    proxy: {
      "/api": {
        target: "http://192.168.20.66:9000",
        ws: true,
        changeOrigin: true,
        pathRewrite: { "^/monitor": "" }
      }
    }
  }
};
