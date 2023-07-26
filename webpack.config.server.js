const { TsConfigPathsPlugin } = require('awesome-typescript-loader')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const { getEnv, stringifyEnv } = require('./src/build/env')
const { PrebuildWatchPlugin } = require('./src/build/prebuild')

const env = getEnv()

const serverConfig = {
  devtool: 'inline-source-map',
  entry: [
    // '@babel/polyfill',
    './src/server/index.ts'
  ],
  // removes some warnings but watch out - may prevent from generating chunks
  // https://stackoverflow.com/questions/41692643
  externals: [nodeExternals()],
  mode: env.WEBPACK_MODE,
  module: {
    rules: [
      ...env.WEBPACK_CACHE_LOADER ? [{ loader: 'cache-loader' }] : [],
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: env.BABEL_CACHE_DIRECTORY,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    debug: false,
                    targets: {
                      node: true
                    }
                  }
                ]
              ]
            }
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: env.TSCONFIG_SERVER,
              experimentalWatchApi: true,
              happyPackMode: false, // needed for thread-loader
              transpileOnly: true
            }
          }
        ]
      },
      {
        exclude: /node_modules/,
        test: /\.graphql$/,
        use: [
          {
            loader: 'graphql-tag/loader'
          }
        ]
      }
    ]
  },
  name: 'server',
  output: {
    filename: 'server.js',
    path: path.join(__dirname, 'dist')
  },
  plugins: [
    new PrebuildWatchPlugin(),
    ...env.TSCHECKER_SERVER_ENABLE ? [new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      measureCompilationTime: true,
      memoryLimit: env.TSCHECKER_MEMORY_LIMIT,
      tsconfig: env.TSCONFIG_SERVER,
      tslint: true
    })] : [],
    new webpack.DefinePlugin({
      'process.env': stringifyEnv(env)
    }),
    ...env.DEV_MODE ? [new NodemonPlugin({
      nodeArgs: [ '--inspect' ]
    })] : []
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.graphql'],
    plugins: [
      new TsConfigPathsPlugin({
        compiler: 'typescript',
        tsconfig: env.TSCONFIG_SERVER
      })
    ]
  },
  target: 'node'
}

module.exports = serverConfig
