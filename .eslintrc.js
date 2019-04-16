module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/indent': ['error', 2],
    'vue/max-attributes-per-line': 'off',
    "quotes": ["warn", "single"],
    "no-extra-semi": "warn"
  }
}
