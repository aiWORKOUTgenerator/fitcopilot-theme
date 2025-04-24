import { Info, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { Tooltip } from './Tooltip';

/**
 * Example component demonstrating how to use the Tooltip component in different ways.
 * This is for documentation purposes only.
 */
export const TooltipExample: React.FC = () => {
    const [showControlledTooltip, setShowControlledTooltip] = useState(false);

    return (
        <div className="p-10 space-y-8">
            <h2 className="text-2xl font-bold mb-4">Tooltip Component Examples</h2>

            <div className="space-y-6">
                {/* Basic hover tooltip */}
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold">Basic Hover Tooltip</h3>
                    <div className="flex items-center">
                        <Tooltip content="This is a simple tooltip that appears on hover.">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                Hover me
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Tooltip with different positions */}
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold">Tooltip Positions</h3>
                    <div className="flex space-x-4">
                        <Tooltip content="Tooltip on top" position="top">
                            <button className="px-4 py-2 bg-green-500 text-white rounded-md">Top</button>
                        </Tooltip>

                        <Tooltip content="Tooltip on right" position="right">
                            <button className="px-4 py-2 bg-green-500 text-white rounded-md">Right</button>
                        </Tooltip>

                        <Tooltip content="Tooltip on bottom" position="bottom">
                            <button className="px-4 py-2 bg-green-500 text-white rounded-md">Bottom</button>
                        </Tooltip>

                        <Tooltip content="Tooltip on left" position="left">
                            <button className="px-4 py-2 bg-green-500 text-white rounded-md">Left</button>
                        </Tooltip>
                    </div>
                </div>

                {/* Tooltip with icon and title */}
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold">Tooltip with Icon and Title</h3>
                    <div className="flex space-x-4">
                        <Tooltip
                            content="Get access to beta features before they're released to the public."
                            title="Beta Features"
                            icon={<Shield className="w-5 h-5 text-lime-300" />}
                            titleColor="text-lime-300"
                        >
                            <button className="px-4 py-2 bg-gray-700 text-white rounded-md flex items-center">
                                <Shield className="w-4 h-4 mr-2" />
                                Beta Access
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Controlled tooltip */}
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold">Controlled Tooltip</h3>
                    <div className="flex items-center space-x-4">
                        <button
                            className="px-4 py-2 bg-purple-500 text-white rounded-md"
                            onClick={() => setShowControlledTooltip(!showControlledTooltip)}
                        >
                            Toggle tooltip
                        </button>

                        <Tooltip
                            content="This tooltip is controlled by a state variable."
                            isVisible={showControlledTooltip}
                            position="right"
                            showOnHover={false}
                        >
                            <div className="p-4 border border-gray-300 rounded-md">
                                Controlled tooltip target
                            </div>
                        </Tooltip>
                    </div>
                    <div className="text-sm text-gray-500">
                        Current state: {showControlledTooltip ? 'Visible' : 'Hidden'}
                    </div>
                </div>

                {/* Custom styled tooltip */}
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold">Custom Styled Tooltip</h3>
                    <div className="flex items-center">
                        <Tooltip
                            content="This tooltip has custom styling applied."
                            width="300px"
                            accentColor="rgba(236, 72, 153, 0.5)"
                        >
                            <button className="px-4 py-2 bg-pink-500 text-white rounded-md flex items-center">
                                <Info className="w-4 h-4 mr-2" />
                                Custom Styling
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TooltipExample; 