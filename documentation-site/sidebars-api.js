/**
 * Creating a sidebar for API documentation.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    // By default, Docusaurus generates a sidebar from the docs folder structure
    apiSidebar: [
        {
            type: 'category',
            label: 'API Reference',
            items: [
                'overview',
                {
                    type: 'category',
                    label: 'WordPress Endpoints',
                    items: [
                        'wordpress/overview',
                        'wordpress/workouts'
                    ]
                },
                {
                    type: 'category',
                    label: 'React Interfaces',
                    items: [
                        'interfaces/overview',
                        'interfaces/workout'
                    ]
                },
                {
                    type: 'category',
                    label: 'Hooks',
                    items: [
                        'hooks/overview',
                        'hooks/use-workout-data'
                    ]
                }
            ],
        },
    ],
};

module.exports = sidebars; 