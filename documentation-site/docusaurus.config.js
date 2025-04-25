// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'FitCopilot Documentation',
  tagline: 'AI Workout Generator - React/TypeScript WordPress Theme',
  url: 'https://docs.fitcopilot.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'fitcopilot', // Usually your GitHub org/user name.
  projectName: 'fitcopilot-theme', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/fitcopilot/fitcopilot-theme/tree/main/documentation-site/',
        },
        blog: {
          showReadingTime: true,
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/fitcopilot/fitcopilot-theme/tree/main/documentation-site/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'FitCopilot',
        logo: {
          alt: 'FitCopilot Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'getting-started/introduction',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/api',
            label: 'API',
            position: 'left'
          },
          {
            to: '/components',
            label: 'Components',
            position: 'left',
          },
          {
            to: '/metrics',
            label: 'Quality Metrics',
            position: 'left',
          },
          {
            href: 'https://github.com/fitcopilot/fitcopilot-theme',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/getting-started/introduction',
              },
              {
                label: 'Architecture',
                to: '/docs/architecture/overview',
              },
              {
                label: 'Development',
                to: '/docs/development/workflow',
              },
            ],
          },
          {
            title: 'Development',
            items: [
              {
                label: 'Components',
                to: '/components',
              },
              {
                label: 'API Documentation',
                to: '/api',
              },
              {
                label: 'Quality Metrics',
                to: '/metrics',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/fitcopilot/fitcopilot-theme',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} FitCopilot. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['php', 'scss', 'typescript', 'jsx', 'tsx']
      },
      algolia: {
        // Replace with actual values when you set up Algolia DocSearch
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_SEARCH_API_KEY',
        indexName: 'fitcopilot',
        contextualSearch: true,
        searchParameters: {
          facetFilters: ['language:en'],
        },
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
    }),
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'components',
        path: 'components',
        routeBasePath: 'components',
        sidebarPath: require.resolve('./sidebars-components.js'),
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: require.resolve('./sidebars-api.js'),
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'metrics',
        path: 'metrics',
        routeBasePath: 'metrics',
        sidebarPath: require.resolve('./sidebars-metrics.js'),
      }
    ]
  ],
};

module.exports = config;
