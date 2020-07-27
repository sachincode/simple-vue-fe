/**
 * 默认配置
 * 本文件是 titan 配置文件，并非 webpack 配置文件
 * 具体请查看 doc/webpack 配置
 */
module.exports = {

  /**
   * webpack 编译入口
   */
  entry: {
    index: './src/main.js',
  },

  /**
   * build 文件存放目录
   */
  buildPath: './build',

  /**
   * externals 的包
   * 通过 script 标签自行引入
   */
  externals: {
    echarts: 'echarts',
  },

  /**
   * 需要进行源码编译的包，正则表达式
   * eg: [/vue-codemirror/]
   */
  source_module: [
    /vue-codemirror/,
    /titan-image/
  ],

  
  //alias 别名
  alias: {},

  /**
   * copyWebpackPlugin 插件配置
   * https://www.npmjs.com/package/copy-webpack-plugin
   */  
  copy: {
    pattern: [],
    options: {},
  },

  /**
   * DefinePlugin 配置
   * https://webpack.docschina.org/plugins/define-plugin/#src/components/Sidebar/Sidebar.jsx
   */  
  definePlugin: {},
};


