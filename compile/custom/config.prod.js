/**
 * prod 环境 配置，最终编译生效的配置为与 config.default.js merge 的内容
 */
module.exports = {

  /**
   * public url
   * eg: 'http://www.abc.com'
   */
  publicPath: '',

  /**
   * build 之后的代码是否压缩，默认为 true
   * 在需要调试 build 之后代码的时候开启
   */
  minimize: true,

 /**
   * 输出 prod 下最终的 webpack 配置文件
   * 最终配置文件为 ./compile/final.config.build.json
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
