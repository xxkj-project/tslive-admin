'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

// const TerserPlugin = require('terser-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title // page title

console.log('___nodeEnv', process.env.NODE_ENV)
console.log('__serverEnv', process.env.VUE_APP_SERVER_ENV)
console.log('___serveRUrl', process.env.VUE_APP_SERVER_URL)

const projectName = 'tslive'

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? `/${projectName}/` : '/', // 基本路径
  outputDir: projectName,
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    port: 8899,
    open: false, // 项目启动后自动打开浏览器
    https: false,
    progress: false,
    proxy: {
      '/livecms': {
        target: process.env.VUE_APP_SERVER_URL, // 接口的域名
        ws: true, // 是否代理websockets
        changeOrigin: true, // 设置为true，本地会虚拟一个服务器接受请求并代替转发该请求，用来解决跨域
        secure: false // 如果是https接口，需要配置该参数
        // pathRewrite: { // pathRewrite 重写地址， 将前缀 '/livecms' 转为 '/'
        //   '/livecms': ''
        // }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
    // if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_SERVER_ENV === 'prod') {
    //   // 返回一个将会被合并的对象
    //   return {
    //     optimization: {
    //       minimizer: [
    //         new TerserPlugin({
    //           sourceMap: false,
    //           terserOptions: {
    //             compress: {
    //               drop_console: true
    //             }
    //           }
    //         })
    //       ]
    //     }
    //   }
    // }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))

    // 设置performance预警
    config.when(process.env.NODE_ENV === 'production', config =>
      config.performance
        .hints('warning')
        .maxEntrypointSize(2048000)
        .maxAssetSize(1024000)
    )

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          echarts: {
            name: 'chunk-echarts',
            priority: 30,
            test: /[\\/]node_modules[\\/]_?echarts(.*)/
          },
          zrender: {
            name: 'chunk-zrender',
            priority: 29,
            test: /[\\/]node_modules[\\/]_?zrender(.*)/
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          vuedraggableAndLrz: {
            name: 'chunk-vuedraggableAndLrz',
            priority: 15,
            test: /([\\/]node_modules[\\/]_?vuedraggable(.*))|([\\/]node_modules[\\/]_?lrz(.*))/
          },
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          utils: {
            name: 'chunk-utils',
            test: resolve('src/utils'),
            minChunks: 3,
            priority: 8,
            reuseExistingChunk: true
          },
          components: {
            name: 'chunk-components',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
