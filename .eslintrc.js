module.exports = {
  "parser": "babel-eslint",
  "plugins": ["react"],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "browser": true,
    "amd": true,
    "es6": true,
    "node": true,
    "mocha": true
  },
  "rules": {
    "comma-dangle": 1,
    "quotes": [
      0, "single"
    ],
    "no-undef": 1,
    "global-strict": 0,
    "no-extra-semi": 1,
    "no-underscore-dangle": 0,
    "no-console": 1,
    "no-unused-vars": 1,
    "no-trailing-spaces": [
      1, {
        "skipBlankLines": true
      }
    ],
    "no-unreachable": 1,
    "no-alert": 0,
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1,
    "no-extra-semi": 1, //禁止多余的冒号
    "no-implicit-coercion": 1, //禁止隐式转换
    "no-multi-spaces": 1, //不能用多余的空格
    "no-trailing-spaces": 1, //一行结束后面不要有空格
    "no-undef": 1, //不能有未定义的变量
    "no-unused-vars": [
      1, {
        "vars": "all",
        "args": "after-used"
      }
    ], //不能有声明后未被使用的变量或参数
    "brace-style": [
      1, "1tbs"
    ], //大括号风格
    "callback-return": 1, //避免多次调用回调什么的
    "comma-dangle": [
      2, "never"
    ], //对象字面量项尾不能有逗号
    "indent": [
      1, 2
    ], //缩进风格
    "new-parens": 2, //new时必须加小括号
    "max-params": [
      1, 3
    ], //函数最多只能有3个参数
    "new-cap": 0, //函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
    "quote-props": [
      0, "always"
    ], //对象字面量中的属性名是否强制双引号
    "vars-on-top": 2, //var必须放在作用域顶部
    //空行最多不能超过100行
    "no-multiple-empty-lines": [
      2, {
        "max": 1
      }
    ],
    "semi": [1, "always"] //语句强制分号结尾
  }
}