const path = require('path');

/** @type {import('@storybook/react-webpack5').StorybookConfig} */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          implementation: require('sass'),
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
    if (!config.resolve) {
      config.resolve = {};
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@features': path.resolve(__dirname, '../src/features'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@types': path.resolve(__dirname, '../src/types'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@tokens': path.resolve(__dirname, '../src/styles/tokens'),
      '@test': path.resolve(__dirname, '../src/test')
    };

    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'];

    if (!config.module) {
      config.module = { rules: [] };
    }

    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

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