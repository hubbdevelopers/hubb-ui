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
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/vue'
  ],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/member-delimiter-style': 'off',
    'vue/max-attributes-per-line': 'off',
    "quotes": ["warn", "single"],
    "no-extra-semi": "warn",
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "always",
      }
    }],
    "prettier/prettier": ["error", {
      "semi": false ,
      "singleQuote": true
    }],
  }
}
