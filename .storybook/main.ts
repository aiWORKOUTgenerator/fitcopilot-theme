import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-links",
    "@storybook/addon-viewport",
    "@storybook/addon-designs",
    "@storybook/addon-measure",
    "@storybook/addon-coverage",
    "@storybook/addon-themes"
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  "staticDirs": ['../assets'],
  "typescript": {
    "reactDocgen": 'react-docgen-typescript',
    "reactDocgenTypescriptOptions": {
      "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        "esModuleInterop": true,
      },
      "propFilter": {
        "skipPropsWithoutDoc": false,
      },
    },
  },
  "core": {
    "disableTelemetry": true,
    "builder": {
      "name": "@storybook/builder-webpack5",
      "options": {
        "fsCache": true,
        "lazyCompilation": true
      }
    }
  },
  "features": {
    "storyStoreV7": true,
    "buildStoriesJson": true,
    "interactionsDebugger": true
  },
  "webpackFinal": async (config) => {
    // Add any custom webpack configurations here
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@features': path.resolve(__dirname, '../src/features'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@hooks': path.resolve(__dirname, '../src/hooks'),
        '@utils': path.resolve(__dirname, '../src/utils'),
        '@types': path.resolve(__dirname, '../src/types'),
        '@styles': path.resolve(__dirname, '../src/styles'),
      };
    }

    // Add SCSS handling
    if (config.module && config.module.rules) {
      config.module.rules.push({
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
        include: path.resolve(__dirname, '../'),
      });
    }

    // Enable filesystem caching for faster rebuilds
    if (config.cache) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename]
        }
      };
    }

    return config;
  },
};

export default config;