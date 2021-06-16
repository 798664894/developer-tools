const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const projectName = 'developerTools'
const webpack = require('webpack')

module.exports = {
  // 基本路径
  // baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
  publicPath: `/${projectName}/`,
  // 输出文件目录
  outputDir: projectName,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    config.resolve.symlinks(true)
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('api', resolve('src/api'))
  },
  configureWebpack: {
    plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
    optimization: { minimizer: [new UglifyJsPlugin()] }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        data: '@import "@/style/index.scss";'
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: true, //配置自动启动浏览器
    host: 'localhost',
    port: 8866, // 端口号
    https: false,
    hot: true,
    hotOnly: false, // https:{type:Boolean}
    disableHostCheck: true,
    historyApiFallback: {
      rewrites: [
        {
          from: /^.*/,
          to: `/${projectName}/`
        }
      ]
    }
  },

  // 第三方插件配置
  pluginOptions: {}
}
