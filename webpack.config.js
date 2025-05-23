const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    'critical': './src/styles/critical.scss',
    'homepage': ['./src/index.tsx', './src/styles/homepage.scss'],
    'debug': './src/debug.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: 'chunks/[name].[contenthash].js',
    publicPath: '/wp-content/themes/fitcopilot/dist/',
    clean: true // Ensure clean output directory
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
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: process.env.NODE_ENV === 'production',
            drop_debugger: true,
            pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log'] : []
          }
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin()
    ],
    concatenateModules: true,
    usedExports: true,
    sideEffects: true, // Enable side effects optimization
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        frameworks: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'framework',
          chunks: 'all',
          priority: 40,
          enforce: true
        },
        lucide: {
          test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
          name: 'lucide-icons',
          chunks: 'all',
          priority: 30,
          enforce: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20,
          enforce: true
        },
        features: {
          test: /[\\/]src[\\/]features[\\/]/,
          name(module) {
            // Enhanced regex matching for feature module paths
            const featureMatch = module.context.match(/[\\/]features[\\/]([\w-]+)(?:[\\/]|$)/);
            
            // Skip Homepage components, they'll be part of the main bundle
            if (module.context.includes('/features/Homepage')) {
              return false; // Return false to skip this cacheGroup
            }
            
            // Registration feature
            if (module.context.includes('/features/Registration')) {
              return 'feature-registration';
            }
            
            // Default feature naming based on directory
            return featureMatch ? `feature-${featureMatch[1].toLowerCase()}` : 'feature-common';
          },
          chunks: 'all',
          priority: 10,
          minSize: 10000,
          enforce: true
        },
        variants: {
          test: /[\\/]variants[\\/]/,
          name(module) {
            const match = module.context.match(/[\\/]variants[\\/]([\w-]+)/);
            return match ? `variant-${match[1].toLowerCase()}` : 'variants-common';
          },
          chunks: 'all',
          priority: 5,
          minSize: 5000,
          enforce: true
        },
        utils: {
          test: /[\\/]src[\\/]utils[\\/]/,
          name: 'utils',
          chunks: 'all',
          priority: 15,
          minSize: 5000,
          enforce: true
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
      filename: '[name].[contenthash].css',
      chunkFilename: 'chunks/[name].[contenthash].css'
    }),
    new WebpackManifestPlugin({
      publicPath: '',
      generate: (seed, files) => {
        const manifest = {};
        const expectedEntries = [
          'critical',
          'homepage',
          'debug',
          'framework',
          'vendors',
          'utils',
          'feature-registration',
          'lucide-icons',
          'feature-common'
        ];

        // Process all files
        files.forEach(file => {
          if (file.name.endsWith('.map')) return;
          
          // Handle both root and chunks directory files
          const isChunk = file.name.includes('/chunks/');
          const baseName = file.name.split('/').pop();
          
          // Extract the logical name without hash and extension
          const match = baseName.match(/(.*?)(\.[a-f0-9]{8,})?\.(js|css)$/);
          if (!match) return;
          
          const [, name, , ext] = match;
          const key = `${name}.${ext}`;
          
          // Store the full path
          manifest[key] = file.path;
        });

        // Verify all expected entries are present, except feature-homepage which is conditionally included
        const missingEntries = expectedEntries.filter(entry => {
          const jsEntry = `${entry}.js`;
          const cssEntry = `${entry}.css`;
          return !manifest[jsEntry] && !manifest[cssEntry];
        });

        if (missingEntries.length > 0) {
          console.warn('Missing entries in manifest:', missingEntries);
        }

        return manifest;
      }
    }),
    // Add BundleAnalyzerPlugin in development mode
    ...(process.env.NODE_ENV === 'development' ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-analysis.html'
      })
    ] : [])
  ]
}; 