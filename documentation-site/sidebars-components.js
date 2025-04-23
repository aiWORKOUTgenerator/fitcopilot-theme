/**
 * Creating a sidebar for component documentation.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    // By default, Docusaurus generates a sidebar from the docs folder structure
    componentsSidebar: [
        {
            type: 'category',
            label: 'Components',
            items: [
                'overview',
                {
                    type: 'category',
                    label: 'Layout Components',
                    items: [
                        'layout/overview',
                    ]
                },
                {
                    type: 'category',
                    label: 'Feature Components',
                    items: [
                        'features/overview',
                        'features/homepage',
                    ]
                },
                {
                    type: 'category',
                    label: 'UI Components',
                    items: [
                        'ui/overview',
                    ]
                },
            ],
        },
        {
            type: 'category',
            label: 'Storybook',
            items: [
                'storybook/integration',
                'storybook/usage',
            ]
        }
    ],
};

module.exports = sidebars; 