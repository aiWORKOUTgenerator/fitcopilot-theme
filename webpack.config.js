const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'critical': './src/styles/critical.scss',
    'homepage': ['./src/index.tsx', './src/styles/homepage.scss'],
    'debug': './src/debug.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[id].[contenthash].js',
    publicPath: '/wp-content/themes/fitcopilot/dist/'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [
          /node_modules/,
          /\.stories\.(ts|tsx)$/,
          /\.test\.(ts|tsx)$/,
          /stories\//
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      },
      {
        test: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
                exportLocalsConvention: 'camelCase'
              },
              importLoaders: 2
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              api: 'modern',
              implementation: require('sass'),
              sassOptions: {
                outputStyle: 'compressed',
                logger: {
                  warn: function (message) {
                    if (message.includes('darken()') ||
                      message.includes('lighten()') ||
                      message.includes('saturate()') ||
                      message.includes('desaturate()')) {
                      throw new Error(`Sass Deprecation Error: ${message}`);
                    } else {
                      console.warn('Sass Warning:', message);
                    }
                  }
                }
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              api: 'modern',
              implementation: require('sass'),
              sassOptions: {
                outputStyle: 'compressed',
                logger: {
                  warn: function (message) {
                    if (message.includes('darken()') ||
                      message.includes('lighten()') ||
                      message.includes('saturate()') ||
                      message.includes('desaturate()')) {
                      throw new Error(`Sass Deprecation Error: ${message}`);
                    } else {
                      console.warn('Sass Warning:', message);
                    }
                  }
                }
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(mp4|webm|ogg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'videos/[name].[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new WebpackManifestPlugin({
      publicPath: '',
      generate: (seed, files) => {
        const manifestFiles = files.reduce((manifest, file) => {
          const name = file.name.replace(/\.[a-f0-9]+\.(js|css)$/, '.$2');
          manifest[name] = file.path;
          return manifest;
        }, seed);
        return manifestFiles;
      }
    })
  ]
}; 