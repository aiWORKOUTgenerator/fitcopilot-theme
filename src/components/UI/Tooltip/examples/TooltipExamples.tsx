import { Flame, Info, Shield, Star } from 'lucide-react';
import React, { useState } from 'react';
import { Tooltip } from '../';

/**
 * Tooltip Examples Component
 * 
 * Demonstrates different variants and usage patterns of the Tooltip component
 */
const TooltipExamples: React.FC = () => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-8">Tooltip Examples</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Default variant - uncontrolled */}
                <div className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-lg font-medium mb-4">Default Variant (Hover)</h2>
                    <div className="flex justify-center">
                        <Tooltip
                            content={<p>This is a default tooltip that shows on hover</p>}
                            title="Default Tooltip"
                            icon={<Info className="w-4 h-4" />}
                        >
                            <button className="px-4 py-2 bg-blue-500 text-white rounded">
                                Hover me
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Hero variant */}
                <div className="bg-gray-900 p-6 rounded-lg">
                    <h2 className="text-lg font-medium mb-4 text-white">Hero Variant</h2>
                    <div className="flex justify-center">
                        <Tooltip
                            content={<p className="text-xs text-gray-300">Special styled tooltip for the hero section</p>}
                            title="Hero Tooltip"
                            icon={<Star className="w-4 h-4" />}
                            themeContext="hero"
                        >
                            <button className="px-4 py-2 bg-lime-500 text-gray-900 rounded">
                                Hover me
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Pricing variant */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-lg font-medium mb-4 text-white">Pricing Variant</h2>
                    <div className="flex justify-center">
                        <Tooltip
                            content={<p className="text-xs text-gray-300">Special styled tooltip for pricing section</p>}
                            title="Pricing Tooltip"
                            titleColor="text-lime-300"
                            icon={<Shield className="w-4 h-4 text-lime-300" />}
                            themeContext="pricing"
                            accentColor="rgba(132, 204, 22, 0.3)"
                        >
                            <button className="px-4 py-2 bg-lime-500 text-gray-900 rounded">
                                Hover me
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Controlled tooltip example */}
                <div className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-lg font-medium mb-4">Controlled Tooltip</h2>
                    <div className="flex justify-center">
                        <Tooltip
                            content={<p>This tooltip is controlled by a state variable</p>}
                            title="Controlled Example"
                            icon={<Info className="w-4 h-4" />}
                            isVisible={isTooltipVisible}
                            showOnHover={false}
                        >
                            <button
                                className="px-4 py-2 bg-purple-500 text-white rounded"
                                onClick={() => setIsTooltipVisible(!isTooltipVisible)}
                            >
                                {isTooltipVisible ? 'Hide tooltip' : 'Show tooltip'}
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Different positions */}
                <div className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-lg font-medium mb-4">Position Variants</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Tooltip
                            content="Top tooltip"
                            position="top"
                        >
                            <button className="px-3 py-1 bg-gray-500 text-white rounded w-full">
                                Top
                            </button>
                        </Tooltip>

                        <Tooltip
                            content="Bottom tooltip"
                            position="bottom"
                        >
                            <button className="px-3 py-1 bg-gray-500 text-white rounded w-full">
                                Bottom
                            </button>
                        </Tooltip>

                        <Tooltip
                            content="Left tooltip"
                            position="left"
                        >
                            <button className="px-3 py-1 bg-gray-500 text-white rounded w-full">
                                Left
                            </button>
                        </Tooltip>

                        <Tooltip
                            content="Right tooltip"
                            position="right"
                        >
                            <button className="px-3 py-1 bg-gray-500 text-white rounded w-full">
                                Right
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Custom styling */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-lg font-medium mb-4 text-white">Custom Styling</h2>
                    <div className="flex justify-center">
                        <Tooltip
                            content={<p className="text-xs">Custom width and accent color</p>}
                            title="Custom Styling"
                            titleColor="text-purple-300"
                            icon={<Flame className="w-4 h-4 text-purple-300" />}
                            width="200px"
                            accentColor="rgba(139, 92, 246, 0.3)"
                        >
                            <button className="px-4 py-2 bg-purple-500 text-white rounded">
                                Hover me
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TooltipExamples; 