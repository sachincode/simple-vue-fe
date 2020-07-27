/**
 * dev环境 配置，最终编译生效的配置为与 config.default.js merge 后的结果
 */
module.exports = {

  /**
   * 接口代理
   */
  proxy: {
    '/api': {                 // 匹配接口前缀
      target: 'targetHost',   // 后端服务地址
      logLevel: 'debug',
      xfwd: true,
      changeOrigin: true,
    },

    // 配置 iam 转发
    '/ssoagentlogin': {
      target: 'http://10.0.80.101:8089/',   // 填写 项目中配置了 iam 服务的后端地址
      logLevel: 'debug',
      xfwd: true,
      changeOrigin: true,
      cookieDomainRewrite: {
        '*': '',
      },
    },
  },

  /**
   * sourcemap 类型
   * https://webpack.js.org/configuration/devtool/#devtool
   */
  devtool: '#cheap-source-map',

  /**
   * 输出 dev 下最终的 webpack 配置文件
   * 最终配置文件为 ./compile/final.dev.config.json
   */
  showFinalWebpackConfig: false,

  /**
   * webpack-merge 合并策略, 默认利用 merge.smartStrategy() 进行合并
   * 查看 https://www.npmjs.com/package/webpack-merge 了解如何配置合并策略
   * 请检查最终的 webpack 配置是否符合预期
   */
  webpackMergeStrategy: {},
  
  /**
   * 是否对 Bundle 进行分析
   * 使用插件 webpack-bundle-analyzer 进行分析
   */
  isAnalyzeBundle: false,
};
