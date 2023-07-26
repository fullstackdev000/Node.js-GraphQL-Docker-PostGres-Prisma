const { TsConfigPathsPlugin } = require('awesome-typescript-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const { getEnv, stringifyEnv } = require('./src/build/env')
const { PrebuildWatchPlugin } = require('./src/build/prebuild')

const env = getEnv()

const functionsConfig = {
  devtool: 'inline-source-map',
  entry: [
    // '@babel/polyfill',
    './src/functions/index.ts'
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
                      node: '10'
                    }
                  }
                ]
              ]
            }
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: env.TSCONFIG_FUNCTIONS,
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
  name: 'functions',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist/functions')
  },
  plugins: [
    new PrebuildWatchPlugin(),
    ...env.TSCHECKER_SERVER_ENABLE ? [new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      measureCompilationTime: true,
      memoryLimit: env.TSCHECKER_MEMORY_LIMIT,
      tsconfig: env.TSCONFIG_FUNCTIONS,
      tslint: true
    })] : [],
    new webpack.DefinePlugin({
      'process.env': stringifyEnv(env)
    }),
    ...env.DEV_MODE ? [new NodemonPlugin({
      args: ['--source', 'dist/functions', '--target=generateVideo'],
      script: 'node_modules/@google-cloud/functions-framework'
    })] : [],
    new CopyWebpackPlugin([
      {
        from: './src/functions/web',
        to: 'web'
      }
    ])
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.graphql'],
    plugins: [
      new TsConfigPathsPlugin({
        compiler: 'typescript',
        tsconfig: env.TSCONFIG_FUNCTIONS
      })
    ]
  },
  target: 'node'
}

module.exports = functionsConfig
