import React, { useState } from 'react';
import DefaultTooltipExample from './DefaultTooltipExample';
import HeroTooltipExample from './HeroTooltipExample';
import PricingTooltipExample from './PricingTooltipExample';

/**
 * Showcase component for all tooltip variants
 * Displays examples of each theme with interactive controls
 */
const TooltipShowcase: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'default' | 'hero' | 'pricing'>('default');

    return (
        <div className="tooltip-showcase max-w-7xl mx-auto p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Tooltip Component Showcase</h1>
                <p className="text-gray-600 max-w-3xl mx-auto">
                    This showcase demonstrates the different tooltip themes and usage patterns available in the FitCopilot component library.
                </p>
            </div>

            {/* Showcase navigation */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    className={`py-3 px-6 font-medium text-sm ${activeTab === 'default'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('default')}
                >
                    Default Theme
                </button>
                <button
                    className={`py-3 px-6 font-medium text-sm ${activeTab === 'hero'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('hero')}
                >
                    Hero Theme
                </button>
                <button
                    className={`py-3 px-6 font-medium text-sm ${activeTab === 'pricing'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('pricing')}
                >
                    Pricing Theme
                </button>
            </div>

            {/* Example variants */}
            <div className="example-container">
                {activeTab === 'default' && <DefaultTooltipExample />}
                {activeTab === 'hero' && <HeroTooltipExample />}
                {activeTab === 'pricing' && <PricingTooltipExample />}
            </div>

            {/* Implementation notes */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
                <div className="space-y-4">
                    <p>
                        The tooltip component uses a variant-based architecture with a theme context system. Each tooltip can either use an explicitly provided theme or inherit from the nearest <code>TooltipThemeProvider</code>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white rounded shadow-sm border border-gray-200">
                            <h3 className="font-medium mb-2 text-gray-900">Default Theme</h3>
                            <p className="text-sm text-gray-600">
                                Clean, minimal design suitable for general UI contexts. Features customizable colors and positions.
                            </p>
                        </div>

                        <div className="p-4 bg-white rounded shadow-sm border border-gray-200">
                            <h3 className="font-medium mb-2 text-gray-900">Hero Theme</h3>
                            <p className="text-sm text-gray-600">
                                High-contrast design with backdrop blur effects for hero sections. Uses the brand's lime/emerald accent colors.
                            </p>
                        </div>

                        <div className="p-4 bg-white rounded shadow-sm border border-gray-200">
                            <h3 className="font-medium mb-2 text-gray-900">Pricing Theme</h3>
                            <p className="text-sm text-gray-600">
                                Plan-specific styling with color differentiation between Basic, Pro, and Elite options.
                            </p>
                        </div>
                    </div>

                    <p>
                        For detailed implementation guidelines, refer to the documentation:
                    </p>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                        <li><code>README.md</code> - Main component documentation</li>
                        <li><code>USAGE_PATTERNS.md</code> - Common usage examples and patterns</li>
                        <li>Example source code in <code>/examples</code> directory</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TooltipShowcase; 