/**
 * 处理自定义配置
 */
const path = require('path');
const APP_PATH = process.cwd();
const file = require('./file');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

class config {

    constructor(env) {
        console.log(APP_PATH);
        const defaultConfig = require(path.join(APP_PATH, `./compile/custom/config.default.js`));
        const envConfig = require(path.join(APP_PATH, `./compile/custom/config.${env}.js`));
        this.config = Object.assign({}, defaultConfig, envConfig);
        this.env = env;
    }

    /**
     * 将传入的 entry 的相对路径改为绝对路径
     * @returns {{}}
     */
    getEntry(port) {
        this.port = port;

        const customEntry = this.config.entry || {
            index: './src/main.js',
        };

        const customKeys = Object.keys(customEntry);
        const entry = {};

        for (let key of customKeys) {

            /**
             * dev 的时候需要以数组的形式把 dev server 加进去
             * watch 的时候 env
             */
            if (this.env === 'dev' && port) {

                entry[key] = [
                    path.resolve(APP_PATH, customEntry[key]),
                    'webpack/hot/dev-server',
                    `webpack-dev-server/client`,
                ];

            } else {

                entry[key] = path.resolve(APP_PATH, customEntry[key]);

            }

        }

        return entry;
    }

    get buildPath() {
        return path.resolve(APP_PATH, this.config.buildPath);
    }

    get externals() {
        return this.config.externals || {};
    }

    get definePlugin() {
        return this.config.definePlugin || {};
    }
    get alias() {
        const customAlias = this.config.alias || {};
        return Object.assign({}, customAlias, {
            vue: 'vue/dist/vue.esm.js',
            'babel-runtime': path.dirname(require.resolve('babel-runtime/package.json')),
        });
    }

    getCopyWebpackPlugin() {
        // 判断是否使用 copyWebpackPlugin
        // copy.patterns 是数组，并且数组长度大于 1 的时候是有效参数
        let copyWebpackPluginArray = [];
        if (this.config.copy
            && this.config.copy.pattern
            && Array.isArray(this.config.copy.pattern)
            && this.config.copy.pattern.length > 0
        ) {
            copyWebpackPluginArray = [
                new CopyWebpackPlugin(this.config.copy.pattern, this.config.copy.options || {}),
            ];
        }

        return copyWebpackPluginArray;
    }

    get devtool() {
        return this.config.devtool || '#eval-source-map';
    }

    get publicPath() {
        return this.config.publicPath || '';
    }

    get isAnalyzeBundle() {
        return this.config.isAnalyzeBundle || false;
    }

    get showFinalWebpackConfig() {
        return this.config.showFinalWebpackConfig || false;
    }
    get webpackMergeStrategy() {
        return this.config.webpackMergeStrategy || {};
    }
    isSourceModule(absPath) {
        const reletiveToProject = path.relative(APP_PATH, absPath);
        const defaultIncludeRules = [
            /^src\//,                                   // 工程源码目录
            /^node_modules\/[\s\S]*?miox[^\/]*\//,      // miox 开头的包默认源码打包 miox*
            /^node_modules\/iview\/src\//,              // /iview/src/ 中的源码都需要进行打包
        ];

        const includeRules = defaultIncludeRules.concat(this.config.source_module || []);

        let result = false;
        includeRules.forEach((includeRegexp) => {
            if (includeRegexp.test(reletiveToProject)) {
                result = true;
            }
        });

        return result;
    }

    get proxy() {
        return this.config.proxy;
    }

    get minimize() {
        return this.config.minimize;
    }

    get devServer() {
        return this.config.devServer || {};
    }
    /**
     * 获取 html-webpack-plugin
     * 多页的情况下，遍历 entry 可得
     * @returns {Array}
     */
    getHtmlWebpackPlugin() {
        const isWatch = this.env === 'dev' && !this.port;
        const entries = this.config.entry;
        const entriesKeys = Object.keys(entries); // 拿到 entry 的 key 值
        let HtmlWebpackPluginArray = [];

        //根据 entry 的 js 文件路径，得到 html 文件路径
        function getHtmlFilePath(fullPath) {
            const cwdPath = path.resolve(APP_PATH, fullPath);
            const fullPathSplitArray = cwdPath.split('/');

            fullPathSplitArray.pop();
            fullPathSplitArray.push('index.html');

            return fullPathSplitArray.join('/');
        }

        // 如果只有一个页面，则直接返回数组长度为 1 的 htmlWebpackPlugin
        // 并且可以确定页面名字为 entriesKeys[0]
        if (entriesKeys.length === 1) {

            return [
                new HtmlWebpackPlugin({
                    filename: `${entriesKeys[0]}.html`,
                    template: getHtmlFilePath(entries[entriesKeys[0]]),
                    inject: true,
                    hash: isWatch,
                })];
        }

        for (let entry in entries) {

            HtmlWebpackPluginArray.push(
                new HtmlWebpackPlugin({
                    hash: isWatch,
                    chunks: [entry],
                    filename: `${entry}.html`,
                    template: getHtmlFilePath(entries[entry]),
                }),
            );

        }

        return HtmlWebpackPluginArray;
    }

    getWatchBuildPath() {
        const buildPath = this.config.buildPath;

        if (buildPath === './build' || buildPath.indexOf('/resources/static') < 0) {
            return path.resolve(APP_PATH, buildPath);
        }

        return path.resolve(buildPath, '../../../../target/classes/static');
    }

    /**
     * 方法功能：tt watch 编译完拷贝一分到用户指定的 build 目录
     * 适用情况：java 与 前端项目同仓库部署时
     * 出现原因：tt watch 是把默认编译的代码编译一份到 ./server/target/classes/static/ 目录下面，因为 java 项目访问文件目录为这个
     *          但是在 java 项目执行 build 的时候会删除 ./server/target/classes/static/ 这个目录下面的所有内容，所以为了防止开发
     *          同学忘记在 java 项目 build 之前执行 tt build 所以每次都拷贝一份代码到 ./server/src/main/resources/static 目录下
     */
    copyFileFromWatchToBuild() {
        const watchPath = this.getWatchBuildPath();
        const buildPath = this.buildPath;

        if (watchPath === buildPath) {
            return;
        }

        file.copy(watchPath, buildPath);
    }

}

module.exports = config;
