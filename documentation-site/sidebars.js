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
        'intro',
        'installation',
        'setup',
      ]
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/feature-architecture',
        'architecture/component-model',
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
        'development/eslint-configuration',
      ]
    },
    {
      type: 'category',
      label: 'WordPress Integration',
      items: [
        'wordpress/overview',
        'wordpress/templates',
        'wordpress/hooks',
        'wordpress/api'
      ]
    }
  ],
};

module.exports = sidebars;
