/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/quick-start',
      ]
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/feature-first-approach',
        'architecture/component-model',
        'architecture/variant-system',
        'architecture/state-management',
        'architecture/styling',
      ]
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/workflow',
        'development/code-standards',
        'development/testing',
        'development/storybook',
        'development/adding-features',
        'development/typescript',
        'development/eslint-configuration',
      ]
    },
    {
      type: 'category',
      label: 'WordPress Integration',
      items: [
        'wordpress/overview',
        'wordpress/templates',
        'wordpress/rest-api',
        'wordpress/hooks',
        'wordpress/customizer',
      ]
    },
    {
      type: 'category',
      label: 'Contributing',
      items: [
        'contributing/contributing',
        'contributing/pull-requests',
        'contributing/code-review',
        'contributing/documentation',
      ]
    }
  ],
};

module.exports = sidebars;
