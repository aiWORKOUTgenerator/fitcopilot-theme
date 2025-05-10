const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
    chunkFilename: 'chunks/[name].[contenthash].js',
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
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@features': path.resolve(__dirname, 'src/features')
    }
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: process.env.NODE_ENV === 'production',
            drop_debugger: true
          }
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin()
    ],
    concatenateModules: true,
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        frameworks: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'framework',
          chunks: 'all',
          priority: 40
        },
        lucide: {
          test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
          name: 'lucide-icons',
          chunks: 'all',
          priority: 30
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20
        },
        features: {
          test: /[\\/]src[\\/]features[\\/]/,
          name(module) {
            // Get the feature name (e.g., Homepage, Registration)
            const match = module.context.match(/[\\/]features[\\/]([\w-]+)/);
            return match ? `feature-${match[1].toLowerCase()}` : 'feature-common';
          },
          chunks: 'all',
          priority: 10,
          minSize: 10000
        },
        variants: {
          test: /[\\/]variants[\\/]/,
          name(module) {
            // Get the variant name (e.g., default, sports, wellness)
            const match = module.context.match(/[\\/]variants[\\/]([\w-]+)/);
            return match ? `variant-${match[1].toLowerCase()}` : 'variants-common';
          },
          chunks: 'all',
          priority: 5,
          minSize: 5000
        }
      }
    }
  },
  module: {
    rules: [
      // Exclude .bak files and README.md files when webpack attempts to resolve imports
      {
        test: /\.(bak|md)$/,
        use: 'ignore-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [
          /node_modules/,
          /\.stories\.(ts|tsx)$/,
          /\.test\.(ts|tsx)$/,
          /stories\//,
          /\.bak$/
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
        exclude: [/\.bak$/, /node_modules/],
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
        exclude: [/\.module\.scss$/, /\.bak$/, /node_modules/],
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
        exclude: /\.bak$/,
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
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp|avif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb - inline if smaller
          }
        },
        generator: {
          filename: 'images/[name].[hash][ext]'
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
    }),
    process.env.ANALYZE === 'true' && new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../bundle-report.html',
      openAnalyzer: false
    })
  ].filter(Boolean)
}; 