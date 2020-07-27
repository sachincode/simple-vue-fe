'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const {toString} = require('webpack-chain');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const customConfig = require('./custom.config');
const options = require('./options');
const detect = require('detect-port');
const file = require('./file');
const stringify = require('json-stringify-safe');
const APP_PATH = process.cwd();
const address = require('address');

// 开发的时候开启包重复安装检查插件，在 build 的时候就关闭
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
// 编译完自动打开浏览器进行预览的插件
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const colors = require('chalk');

async function dev(argv) {

    const port = await detect(argv.port || '3333');
    const customConfigInstance = new customConfig('dev');
    const isAnalyzeBundle = customConfigInstance.isAnalyzeBundle;
    const bundleAnalyzer = isAnalyzeBundle ? [new BundleAnalyzerPlugin()] : [];
    const isSourceModule = customConfigInstance.isSourceModule.bind(customConfigInstance);
    const htmlWebpackPlugins = customConfigInstance.getHtmlWebpackPlugin();
    const entries = customConfigInstance.getEntry(port);
    const entriesNames = Object.keys(entries);
    const showFinalWebpackConfig = customConfigInstance.showFinalWebpackConfig;
    const webpackMergeStrategy = customConfigInstance.webpackMergeStrategy;
    const definePluginObj = Object.assign({}, {
        'process.env': {
            NODE_ENV: '"development"',
        },
    }, customConfigInstance.definePlugin);

    let config = {
        target: 'web',
        devtool: customConfigInstance.devtool,
        entry: entries,
        mode: 'development',
        externals: customConfigInstance.externals,
        output: {
            path: customConfigInstance.buildPath,
            filename: '[name].js',
            publicPath: customConfigInstance.publicPath,
        },
        resolve: {
            // 用到的包 resolve 的地址，数组形式，依次寻找
            modules: [
                path.resolve(APP_PATH, './node_modules'),
            ],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json'],
            alias: customConfigInstance.alias,
        },
        resolveLoader: {
            modules: [
                path.resolve(APP_PATH, './node_modules'),
            ]
        },
        module: {
            rules: [
                {
                    test: /\.js$|\.jsx$/,
                    include: isSourceModule,
                    use: {
                        loader: 'babel-loader',
                        options: options.babelOptions,
                    },
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    include: isSourceModule,
                    options: {
                        loaders: {
                            js: [
                                {
                                    loader: 'babel-loader',
                                    options: options.babelOptions,
                                },],
                            ts: [
                              {
                                loader: 'ts-loader',
                                options: {
                                    appendTsSuffixTo: [/\.vue$/]
                                },
                            }],
                            babel: [
                                {
                                    loader: 'babel-loader',
                                    options: options.babelOptions,
                                },],
                            css: options.cssLoader,
                            less: options.lessLoader,
                            scss: options.scssLoader,
                            sass: options.sassLoader,
                        }, postcss: {
                            plugins: [
                                require('autoprefixer')(),],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: options.cssLoader,
                },
                {
                    test: /\.less$/,
                    use: options.lessLoader,
                },
                {
                    test: /\.s(c|a)ss$/,
                    use: options.scssLoader,
                },
                {
                    test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[hash].[ext]',
                                outputPath: 'static',
                                // publicPath: './static',
                            },
                        },
                    ],
                },
                {
                    test: /\.(js|jsx|vue)$/,
                    enforce: 'pre',
                    use: [
                        {
                            loader: 'eslint-loader',
                            options: {
                                formatter: require("eslint-friendly-formatter"),
                                eslintPath: path.resolve(APP_PATH, './node_modules/eslint'),
                            }
                        },
                    ],
                    include: path.resolve(APP_PATH, './src'),
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    include: isSourceModule,
                    options: {
                      appendTsSuffixTo: [/\.vue$/],
                    },
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin(definePluginObj),
            // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
            new webpack.HotModuleReplacementPlugin(),
            // https://github.com/ampedandwired/html-webpack-plugin
            new CaseSensitivePathsPlugin(),
            new DuplicatePackageCheckerPlugin({
                verbose: true,
            }),
            ...bundleAnalyzer,
            ...htmlWebpackPlugins,
            ...customConfigInstance.getCopyWebpackPlugin(),
            // Moment.js is an extremely popular library that bundles large locale files
            // by default due to how Webpack interprets its code. This is a practical
            // solution that requires the user to opt into importing specific locales.
            // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
            // You can remove this if you don't use Moment.js:
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),], // Some libraries import Node modules but don't use them in the browser.
        // Tell Webpack to provide empty mocks for them so importing them works.
        node: {
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        },
        // Turn off performance hints during development because we don't do any
        // splitting or minification in interest of speed. These warnings become
        // cumbersome.
        performance: {
            hints: false,
        },
    };

    // webpack merge 把自定义的 webpack config merge 过来
    let customWebConfig = {};
    try {

        customWebConfig = require(path.join(APP_PATH, './compile/custom/webpack.dev.config.js'));

    } catch (err) {

        customWebConfig = {};
    }

    if (stringify(customWebConfig) !== "{}") {
        config = webpackMerge.smartStrategy(webpackMergeStrategy)(config, customWebConfig);
    }

    if (showFinalWebpackConfig) {
        let stringifyConfig = toString(config);
        stringifyConfig = 'module.exports = ' + stringifyConfig;
        const finalConfigFile = path.join(APP_PATH, `./compile/final.config.dev.js`);
        file.write(finalConfigFile, stringifyConfig, function (err) {
            if (err) {
                console.log(err);
                return console.log(colors.red.bold(`\n webpack 配置文件写入错误 \n`));
            }
        });
        console.log(colors.green.bold(`\n 请在 ./compile/final.config.dev.js 中查看最终的 webpack 配置 \n`));
    }

    const finalOption = Object.assign({}, {
      hot: true,
      inline: true,
      useLocalIp: true,
      overlay: {
        errors: true
      },
      clientLogLevel: 'warning',
      disableHostCheck: true,
      stats: 'errors-only',
      proxy: customConfigInstance.proxy,
    }, customConfigInstance.devServer, config.devServer);

    const host = argv.host || finalOption.host || address.ip();

    config.plugins = config.plugins.concat([
      new OpenBrowserPlugin({
        url: `http://${host}:${port}/${entriesNames.length === 1 ? 'index.html' : (`${entriesNames[0]}.html`)}`,
      }),
    ]);

    const compiler = webpack(config);


    const server = new WebpackDevServer(compiler, finalOption);


    compiler.plugin('done', stats => {
        if (stats.hasErrors()) {
            return console.error(stats.toString({
                colors: true,
            }));
        }

        console.log(stats.toString({
            colors: true, chunks: false, assets: true,
        }));

        console.log(
            colors.green(`\n Open http://${host}:${port}/${entriesNames.length === 1
                ? 'index.html'
                : (`${entriesNames[0]}.html`)} \n`));
    });

    compiler.plugin('failed', err => {
        throw err;
    });

    server.listen(port, host, function () {
        console.log(colors.white.bold(`\n  项目编译中, 请等待... \n`));
    });
}

module.exports = dev;
