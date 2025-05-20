const path = require('path');

/** @type {import('@storybook/react-webpack5').StorybookConfig} */
const config = {
  // Updated stories pattern to match FitCopilot's feature-first architecture
  stories: [
    '../src/**/*.mdx',
    '../src/**/stories/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-interactions',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          implementation: require('sass'),
          sassOptions: {
            includePaths: [path.resolve(__dirname, '../src/styles')],
          }
        },
      },
    }
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
        lazyCompilation: true,
        fsCache: true
      }
    }
  },
  docs: {
    autodocs: true,
    defaultName: 'Documentation'
  },
  staticDirs: [
    '../public',
    { from: '../src/test/storybook', to: '/test' },
    { from: '../src/test/storybook/theme-tester.js', to: '/theme-tester.js' },
  ],
  typescript: {
    check: true,
    checkOptions: {
      typescript: {
        configFile: path.resolve(__dirname, '../tsconfig.json'),
        memoryLimit: 4096,
        mode: 'write-references',
        build: true
      }
    },
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        esModuleInterop: true
      },
      propFilter: (prop) => !prop.parent?.fileName.includes('node_modules'),
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true
    }
  },
  webpackFinal: async (config) => {
    // Ensure resolve configuration exists
    if (!config.resolve) {
      config.resolve = {};
    }

    // Define aliases based on FitCopilot's architecture
    config.resolve.alias = {
      ...config.resolve.alias,
      '@features': path.resolve(__dirname, '../src/features'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@types': path.resolve(__dirname, '../src/types'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@tokens': path.resolve(__dirname, '../src/styles/tokens'),
      '@test': path.resolve(__dirname, '../src/test'),
      '@context': path.resolve(__dirname, '../src/context')
    };

    // Set up proper file extensions resolution
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css'];

    // Ensure module configuration exists
    if (!config.module) {
      config.module = { rules: [] };
    }

    // Configure SVG support
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test && rule.test.test('.svg')
    );
    
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    // Configure SCSS processing
    const scssRuleIndex = config.module.rules.findIndex(
      (rule) => rule.test && rule.test.test('.scss')
    );

    if (scssRuleIndex >= 0) {
      // Update existing rule if it exists
      config.module.rules[scssRuleIndex] = {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, '../src/styles')]
              }
            }
          }
        ],
        include: path.resolve(__dirname, '../')
      };
    } else {
      // Add new rule if it doesn't exist
      config.module.rules.push({
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, '../src/styles')]
              }
            }
          }
        ],
        include: path.resolve(__dirname, '../')
      });
    }

    // Performance optimizations
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: -20
          }
        }
      },
      runtimeChunk: 'single',
      moduleIds: 'deterministic'
    };

    // Add cache configuration
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename]
      }
    };

    return config;
  }
};

module.exports = config; 