/**
 * API documentation sidebar configuration
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebarsApi = {
    api: [
        {
            type: 'category',
            label: 'Overview',
            items: [
                'overview',
                'usage'
            ]
        },
        {
            type: 'category',
            label: 'Components',
            items: [
                'components/feature-components',
                'components/ui-components',
                'components/layout-components',
            ]
        },
        {
            type: 'category',
            label: 'Hooks',
            items: [
                'hooks/data-hooks',
                'hooks/ui-hooks',
                'hooks/wordpress-hooks',
            ]
        },
        {
            type: 'category',
            label: 'WordPress Integration',
            items: [
                'wordpress/data-contracts',
                'wordpress/rest-endpoints',
                'wordpress/theme-customizer',
            ]
        },
        {
            type: 'category',
            label: 'Utilities',
            items: [
                'utils/formatters',
                'utils/validators',
                'utils/helpers',
            ]
        },
    ],
};

module.exports = sidebarsApi; 