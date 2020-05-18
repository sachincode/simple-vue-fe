// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'eslint-config-google',
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    // 'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    // 'generator-star-spacing': 'off',
    // allow debugger during development
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    'switch-colon-spacing': 0,
    'require-jsdoc': 0, // 禁用 jsdoc 规则
    'max-len': 0, // 禁用每行字数限制规则
    'no-console': 0, // 允许打 console.log
    'no-debugger': 0, // 允许使用
    'padded-blocks': 0,
    // 'indent': ['error', 2], // 2 空格
    'vue/no-parsing-error': [
      2, {
        'x-invalid-end-tag': false, // 0
      },
    ],
    'no-trailing-spaces': 0,
  },
  globals: {
    'require': true,
  },
}
