const sortImports = require.resolve('@trivago/prettier-plugin-sort-imports');

// 基础通用配置
module.exports = {
  tabWidth: 2, // 缩进2个空格
  useTabs: false, // 缩进单位是否使用tab替代空格
  semi: true, // 句尾添加分号
  singleQuote: true, // 使用单引号代替双引号
  printWidth: 100000,
  importOrderSortByLength: 'asc',
  plugins: [sortImports],
};
