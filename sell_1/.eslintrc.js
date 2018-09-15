module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi':['error','always'],
    'indent':0,
    'space-before-function-paren':0,
    'space-before-blocks':0,
    'no-trailing-spaces':0,
    //关键词之后可以没有空格
    'keyword-spacing':0,
    // //这个符号之后可以没有空格
    'spaced-comment':0,
    // , 都好之后可以没有空格
    'comma-spacing':0,
    //关键词后面的空格不检查
    'key-spacing':0,
    'no-unused-vars':0,
    'space-infix-ops':0,
    //分号的空白
    'semi-spacing':0,
    'no-multiple-empty-lines':0
  }
};
