'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const {toString} = require('webpack-chain');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const customConfig = require('./custom.config.js');
const options = require('./options');
const file = require('./file');
const stringify = require('json-stringify-safe');
const APP_PATH = process.cwd();

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HashOutput = require('webpack-plugin-hash-output');
const colors = require('chalk');
const rm = require('rimraf');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ora = require('ora');

function projectBuild() {
    const customConfigInstance = new customConfig('prod');
    const isAnalyzeBundle = customConfigInstance.isAnalyzeBundle;
    const bundleAnalyzer = isAnalyzeBundle ? [new BundleAnalyzerPlugin()] : [];
    const isSourceModule = customConfigInstance.isSourceModule.bind(customConfigInstance);
    const htmlWebpackPlugins = customConfigInstance.getHtmlWebpackPlugin();
    const buildPath = path.resolve(APP_PATH, customConfigInstance.buildPath);
    const fileName = `${htmlWebpackPlugins.length === 1 ? '[name].[chunkhash].' : '[name]/index.[chunkhash].'}`;
    const hashOutputArray = htmlWebpackPlugins.length === 1 ? [HashOutput] : [];

    const showFinalWebpackConfig = customConfigInstance.showFinalWebpackConfig;
    const webpackMergeStrategy = customConfigInstance.webpackMergeStrategy;
    const definePluginObj = Object.assign({}, {
        'process.env': {
            NODE_ENV: '"production"',
        },
    }, customConfigInstance.definePlugin);
    const cssMinimizer = [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
    ];
    // webpack 不会删掉 build 目录，所以手动删
    rm.sync(buildPath);

    let buildConfig = {
        target: 'web',
        mode: 'production',
        entry: customConfigInstance.getEntry(),
        externals: customConfigInstance.externals,
        output: {
            publicPath: customConfigInstance.publicPath,
            path: buildPath,
            filename: `${fileName}js`,
        },
        devtool: false,
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
                    test: /\.js|\.jsx$/,
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
                                },
                            ],
                            ts: [
                              {
                                  loader: 'ts-loader',
                                  options: {
                                    appendTsSuffixTo: [/\.vue$/]
                                  },
                              }
                            ],
                            babel: [
                                {
                                    loader: 'babel-loader',
                                    options: options.babelOptions,
                                },
                            ],
                            css: options.extractCssLoader,
                            less: options.extractLessLoader,
                            scss: options.extractScssLoader,
                            sass: options.extractSassLoader,
                        },
                        postcss: {
                            plugins: [
                                require('autoprefixer')(),
                            ],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: options.extractCssLoader,
                },
                {
                    test: /\.less$/,
                    use: options.extractLessLoader,
                },
                {
                    test: /\.s(c|a)ss$/,
                    use: options.extractScssLoader,
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
        // 此处对 htmlWebpackPlugin 的个数进行判断
        // 如果只有1个说明是单页则进行分 chunk ,否则是多页不分 chunk
        optimization: htmlWebpackPlugins.length === 1 ? {
            runtimeChunk: false, // runtime 是否单独打出来，这里写 false
            minimize: customConfigInstance.minimize, // 代码压缩合并
            splitChunks: {
                chunks: 'all',
                minSize: 0,
                maxAsyncRequests: Infinity,
                maxInitialRequests: Infinity,
                name: true,
                cacheGroups: {
                    vendors: { //将所有 css 打到一个 css file 里
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true,
                    },
                    commons: {
                        name: 'commons',
                        test: function (module) {
                            return (module.resource && (module.resource.indexOf('/node_modules/') > -1));
                        },
                    },
                },
            },
            minimizer: customConfigInstance.minimize ? cssMinimizer : [],
        } : {
                minimizer: customConfigInstance.minimize ? cssMinimizer : [],
                minimize: customConfigInstance.minimize,
            },
        plugins: [
            new webpack.DefinePlugin(definePluginObj),
            new CaseSensitivePathsPlugin(),
            ...bundleAnalyzer,
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: `${fileName}css`,
                chunkFilename: `${fileName}css`,
            }),
            ...htmlWebpackPlugins,
            ...customConfigInstance.getCopyWebpackPlugin(),
            new webpack.HashedModuleIdsPlugin(),
            ...hashOutputArray,
            // Moment.js is an extremely popular library that bundles large locale files
            // by default due to how Webpack interprets its code. This is a practical
            // solution that requires the user to opt into importing specific locales.
            // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
            // You can remove this if you don't use Moment.js:
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        ],
        // Some libraries import Node modules but don't use them in the browser.
        // Tell Webpack to provide empty mocks for them so importing them works.
        node: {
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        },
    };

    // webpack merge 把自定义的 webpack config merge 过来
    let customWebConfig = {};
    try {

        customWebConfig = require(path.join(APP_PATH, './compile/custom/webpack.build.config.js'));

    } catch (err) {

        customWebConfig = {};
    }

    if (stringify(customWebConfig) !== "{}") {
        buildConfig = webpackMerge.smartStrategy(webpackMergeStrategy)(buildConfig, customWebConfig);
    }

    if (showFinalWebpackConfig) {
        let stringifyConfig = toString(buildConfig);
        stringifyConfig = 'module.exports = ' + stringifyConfig;
        const finalConfigFile = path.join(APP_PATH, `./compile/final.config.dev.js`);
        file.write(finalConfigFile, stringifyConfig, function (err) {
            if (err) {
                console.log(err);
                return console.log(colors.red.bold(`\n webpack 配置文件写入错误 \n`));
            }
        });
        console.log(colors.green.bold(`\n 请在 ./compile/final.config.build.json 中查看最终的 webpack 配置 \n`));
    }
    const compiler = webpack(buildConfig);

    console.log(colors.white.bold(`\n   \n`));

    const spinner = ora('  项目编译中, 请等待...').start();

    compiler.run(function (err, stats) {

        spinner.stop();

        if (err) {
            if (err.details) {
                console.error(err.details);
            }
            throw err;
        }

        console.log(stats.toString({
            assets: true,
            colors: true,
            chunks: false,
            modules: false,
            progress: false,
            errorDetails: true,
        }));
    });
}

module.exports = projectBuild;
