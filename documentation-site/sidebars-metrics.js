/**
 * Creating a sidebar for quality metrics documentation.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    // By default, Docusaurus generates a sidebar from the docs folder structure
    metricsSidebar: [
        {
            type: 'category',
            label: 'Quality Metrics',
            items: [
                'overview',
                {
                    type: 'category',
                    label: 'Performance',
                    items: [
                        'performance/overview',
                        'performance/core-web-vitals',
                        'performance/lighthouse'
                    ]
                },
                {
                    type: 'category',
                    label: 'Code Quality',
                    items: [
                        'code-quality/overview',
                        'code-quality/test-coverage',
                        'code-quality/type-safety'
                    ]
                },
                {
                    type: 'category',
                    label: 'Visual Regression',
                    items: [
                        'visual/overview',
                        'visual/chromatic'
                    ]
                }
            ],
        },
    ],
};

module.exports = sidebars; 