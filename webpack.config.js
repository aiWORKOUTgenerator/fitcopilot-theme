const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

// Bundle size monitoring and performance budgets
const PERFORMANCE_BUDGETS = {
  // Maximum asset sizes (in bytes)
  maxAssetSize: 500 * 1024, // 500KB
  maxEntrypointSize: 800 * 1024, // 800KB
  
  // Training Calendar specific budgets
  trainingCalendar: {
    maxChunkSize: 200 * 1024, // 200KB for calendar components
    maxCssSize: 100 * 1024,   // 100KB for calendar styles
  },
  
  // FullCalendar budget
  fullCalendar: {
    maxSize: 700 * 1024, // 700KB for FullCalendar bundle
  }
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  
  return {
    mode: isProduction ? 'production' : 'development',
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
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
            compress: {
              drop_console: isProduction,
              drop_debugger: true,
              pure_funcs: isProduction ? ['console.log'] : []
            }
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin()
      ],
      concatenateModules: true,
      usedExports: true,
      sideEffects: false, // Enable tree shaking by disabling side effects
      providedExports: true, // Determine exports for each module
      innerGraph: true, // Enable inner graph analysis for better tree shaking
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
          // React ecosystem (highest priority)
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 40,
            enforce: true
          },
          // FullCalendar (separate chunk for calendar features)
          fullcalendar: {
            test: /[\\/]node_modules[\\/]@fullcalendar[\\/]/,
            name: 'fullcalendar',
            chunks: 'all',
            priority: 35,
            enforce: true,
            maxSize: PERFORMANCE_BUDGETS.fullCalendar.maxSize,
          },
          // UI Libraries
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide-icons',
            chunks: 'all',
            priority: 30,
            enforce: true
          },
          // Date/Time utilities (often used with calendar)
          dateUtils: {
            test: /[\\/]node_modules[\\/](date-fns|moment|dayjs)[\\/]/,
            name: 'date-utils',
            chunks: 'all',
            priority: 25,
            enforce: true
          },
          // Utility libraries
          utils: {
            test: /[\\/]node_modules[\\/](lodash|ramda|classnames)[\\/]/,
            name: 'utility-libs',
            chunks: 'all',
            priority: 20,
            enforce: true
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
            enforce: true
          },
          // Homepage-specific CSS (highest priority to prevent bundling with features)
          homepageStyles: {
            test: /\.scss$/,
            name: 'homepage-styles',
            chunks: (chunk) => chunk.name === 'homepage',
            priority: 50,
            enforce: true
          },
          // Feature CSS (separate from homepage)
          featureStyles: {
            test: /\.scss$/,
            name: 'feature-styles',
            chunks: (chunk) => chunk.name !== 'homepage' && chunk.name !== 'critical',
            priority: 45,
            enforce: true,
            minSize: 20000 // Only create if substantial CSS
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
    performance: {
      hints: isProduction ? 'warning' : false,
      maxAssetSize: PERFORMANCE_BUDGETS.maxAssetSize,
      maxEntrypointSize: PERFORMANCE_BUDGETS.maxEntrypointSize,
      assetFilter: function(assetFilename) {
        // Only check JS and CSS files
        return /\.(js|css)$/.test(assetFilename);
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: (pathData) => {
          // Separate CSS files by entry point to prevent cross-contamination
          const chunkName = pathData.chunk.name;
          
          // Homepage gets its own CSS file
          if (chunkName === 'homepage') {
            return 'homepage.[contenthash].css';
          }
          
          // Critical CSS gets its own file
          if (chunkName === 'critical') {
            return 'critical.[contenthash].css';
          }
          
          // Features get separate CSS files
          if (chunkName && chunkName.startsWith('feature-')) {
            return `features/${chunkName}.[contenthash].css`;
          }
          
          // Default naming
          return '[name].[contenthash].css';
        },
        chunkFilename: 'chunks/[name].[contenthash].css',
        ignoreOrder: true // Ignore CSS order warnings that cause performance issues
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
      // Bundle analyzer for development
      ...(isDevelopment && process.env.ANALYZE ? [
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerHost: 'localhost',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      ] : []),
      
      // Bundle analyzer for production (generates static report)
      ...(isProduction && process.env.ANALYZE ? [
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-report.html',
          openAnalyzer: false,
        })
      ] : []),
      
      // Compression for production
      ...(isProduction ? [
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 8192,
          minRatio: 0.8,
          filename: '[path][base].gz',
        }),
        
        // Brotli compression
        new CompressionPlugin({
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          threshold: 8192,
          minRatio: 0.8,
          filename: '[path][base].br',
          compressionOptions: {
            level: 11,
          },
        }),
      ] : []),
    ],
    
    // Bundle size monitoring stats
    stats: {
      // Show chunk information
      chunks: true,
      chunkModules: true,
      chunkOrigins: true,
      
      // Show asset information
      assets: true,
      assetsSort: 'size',
      
      // Show performance hints
      performance: true,
      
      // Show warnings and errors
      warnings: true,
      errors: true,
      
      // Custom stats for bundle monitoring
      logging: 'warn',
      loggingTrace: true,
      
      // Exclude verbose module information in production
      modules: isDevelopment,
      moduleTrace: isDevelopment,
    },
  };
}; 