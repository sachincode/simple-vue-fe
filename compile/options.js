const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const componentBuildBabelOptions = {
    presets: [
        [
            require.resolve('babel-preset-env'), {
                loose: false,
                modules: 'umd',
                spec: true,
                forceAllTransforms: true,
                targets: {
                    // React parses on ie 9, so we should too
                    // We currently minify with uglify
                    // Remove after https://github.com/mishoo/UglifyJS2/issues/448
                    browsers: [
                        'last 3 Chrome versions',
                        'last 3 Firefox versions',
                        'Safari >= 10',
                        'Explorer >= 11',
                        'Edge >= 12',
                        'iOS >= 10',
                        'Android >= 6'],
                },
                // Disable polyfill transforms
                useBuiltIns: 'usage',
                // Do not transform modules to CJS
            }], require.resolve('babel-preset-stage-3'),
    ],
    plugins: [
        require.resolve('babel-plugin-transform-runtime'),
        require.resolve('babel-plugin-transform-vue-jsx'),
        require.resolve('babel-plugin-transform-class-properties'),
    ],
};

const babelOptions = {
    babelrc: false,
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching results in ./node_modules/.cache/babel-loader/
    // directory for faster rebuilds.
    cacheDirectory: true,
    presets: [
        [
            require.resolve('babel-preset-env'), {
                loose: false,
                modules: 'commonjs',
                spec: true,
                forceAllTransforms: true,
                targets: {
                    // React parses on ie 9, so we should too
                    // We currently minify with uglify
                    // Remove after https://github.com/mishoo/UglifyJS2/issues/448
                    browsers: [
                        'last 3 Chrome versions',
                        'last 3 Firefox versions',
                        'Safari >= 10',
                        'Explorer >= 11',
                        'Edge >= 12',
                        'iOS >= 10',
                        'Android >= 6'],
                },
                // Disable polyfill transforms
                useBuiltIns: 'usage',
                // Do not transform modules to CJS
            }
        ],
        require.resolve('babel-preset-stage-3')
    ],
    plugins: [
        require.resolve('babel-plugin-transform-runtime'),
        // 按需引用iview时，打开这里的注释
        // [
        //     require.resolve('babel-plugin-import'),
        //     {
        //         'libraryName': 'iview',
        //         'libraryDirectory': 'src/components',
        //     },
        // ],
        require.resolve('babel-plugin-transform-vue-jsx'),
        // at stage 2, when 2018-11-21
        require.resolve('babel-plugin-transform-class-properties'),
    ],
};

const cssLoader = [
    {
        loader: 'style-loader',
    },
    {
        loader: 'css-loader',
    },
];

const lessLoader = [
    {
        loader: 'style-loader',
    },
    {
        loader: 'css-loader',
    },
    {
        loader: 'less-loader',
        options: {
            javascriptEnabled: true,
        },
    },
];

const scssLoader = [
    {
        loader: 'style-loader',
    },
    {
        loader: 'css-loader',
    },
    {
        loader: 'sass-loader',
    },
];

const extractCssLoader = [
    {
        loader: MiniCssExtractPlugin.loader,
    },
    {
        loader: 'css-loader',
    },
];

const extractLessLoader = [
    {
        loader: MiniCssExtractPlugin.loader,
    },
    {
        loader: 'css-loader',
    },
    {
        loader: 'less-loader',
        options: {
            javascriptEnabled: true,
        },
    },
];

const extractScssLoader = [
    {
        loader: MiniCssExtractPlugin.loader,
    },
    {
        loader: 'css-loader',
    },
    {
        loader: 'sass-loader',
    },
];

module.exports = {
    componentBuildBabelOptions,
    babelOptions,
    cssLoader,
    lessLoader,
    scssLoader,
    sassLoader: scssLoader,
    extractCssLoader,
    extractLessLoader,
    extractScssLoader,
    extractSassLoader: extractScssLoader,
};
