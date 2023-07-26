const { TsConfigPathsPlugin } = require('awesome-typescript-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const { getEnv, stringifyEnv } = require('./src/build/env')
const { PrebuildWatchPlugin } = require('./src/build/prebuild')
const kill = require('tree-kill')

const reactSvgLoader = require.resolve('react-svg-loader')

const env = getEnv()

// XXX: Force kill webpack due SIGINT not always being handled by webpack-dev-server
// https://github.com/webpack/webpack-dev-server/issues/1479
process.on('SIGINT', () => kill(process.pid, 'SIGKILL'))

let webConfig = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': `http://${env.DEV_MODE_HOST}:${env.SERVER_HTTP_PORT}`
    },
    host: env.DEV_MODE_HOST,
    hot: true,
    inline: true,
    port: env.DEV_MODE_PORT,
    public: env.DEV_MODE_PUBLIC_ADDRESS
  },
  devtool: 'inline-source-map',
  entry: [
    '@babel/polyfill',
    './src/web/index.tsx'
  ],
  externals: ['browser'],
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
              plugins: env.DEV_MODE ? ['react-hot-loader/babel'] : [],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    debug: false,
                    targets: {
                      browsers: 'defaults'
                    }
                  }
                ]
              ]
            }
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: env.TSCONFIG_WEB,
              experimentalWatchApi: true,
              happyPackMode: false, // needed for thread-loader
              transpileOnly: true
            }
          }
        ]
      },
      {
        enforce: 'pre',
        exclude: /node_modules/,
        test: /\.js$/,
        use: {
          loader: 'source-map-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        exclude: /node_modules/,
        test: /\.svg$/,
        use: [
          ...env.WEBPACK_CACHE_LOADER ? [{ loader: 'cache-loader' }] : [],
          'babel-loader',
          {
            loader: reactSvgLoader, // 'react-svg'
            query: {
              svgo: {
                plugins: [{ removeStyleElement: true }],
                pretty: true
              }
            }
          }
        ]
      },
      {
        test: /\.(png|woff2?|eot|ttf)(\?[a-z0-9=.]+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            // TODO: bring back limit and set up file-loader fallback
            // limit: 100000
          }
        }
      }
    ]
  },
  name: 'web',
  optimization: {
    minimizer: env.WEBPACK_MINIFY ? [new TerserPlugin({
      parallel: true
    })] : []
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist/web'),
    publicPath: `http://${env.DEV_MODE_HOST}:${env.DEV_MODE_PORT}/public/`
  },
  plugins: [
    new PrebuildWatchPlugin(),
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      measureCompilationTime: true,
      memoryLimit: env.TSCHECKER_MEMORY_LIMIT,
      tsconfig: env.TSCONFIG_WEB,
      tslint: true
    }),
    new webpack.DefinePlugin({
      // whitelist env variables so api keys or secrets don't leak to frontend
      'process.env': stringifyEnv(getEnv([
        'DEV_MODE_HOST',
        'GOOGLE_MAPS_API_KEY',
        'GRAPHQL_ENDPOINT',
        'GRAPHQL_PATH',
        'LOG_LEVEL_FRONTEND',
        'NAMECHEAP_API_KEY',
        'NAMECHEAP_API_USER',
        'NAMECHEAP_CLIENT_IP',
        'NAMECHEAP_URL',
        'NAMECHEAP_USERNAME',
        'NODE_ENV',
        'POSTGRES_SCHEMA',
        'SERVER_HTTP_PORT',
        'STRIPE_PUBLIC',
        'STRIPE_ENDPOINT_SECRET'
      ]))
    }),
    new CopyWebpackPlugin([
      {
        from: './src/web/static',
        to: 'static'
      }
    ]),
    ...env.DEV_MODE ? [new webpack.HotModuleReplacementPlugin()] : []
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [
      new TsConfigPathsPlugin({
        compiler: 'typescript',
        tsconfig: env.TSCONFIG_WEB
      })
    ]
  },
  target: 'web'
}

if (env.BENCHMARK_SMP) {
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
  const smp = new SpeedMeasurePlugin()
  webConfig = smp.wrap(webConfig, {
    granularLoaderData: true
  })
}

module.exports = webConfig
