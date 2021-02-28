const path = require("path");
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://upopt.cntracechain.com', //对应自己的接口
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },

  // 配置全局less文件
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "./src/assets/style/style.less")]
    }
  },


  // 配置路径别名
  configureWebpack: {
    resolve: {
      alias: {
        'api': '@/api',
        'assets': '@/assets',
        'components': '@/components',
        'layout': '@/layout',
        'router': '@/router',
        'store': '@/store',
        'utils': '@/utils',
        'views': '@/views',
      }
    }
  }
}