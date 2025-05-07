import { AlertCircle, HelpCircle, Info } from 'lucide-react';
import React, { useState } from 'react';
import { Tooltip } from '../../Tooltip';

/**
 * Example component showcasing the default tooltip theme variants
 */
const DefaultTooltipExample: React.FC = () => {
    const [controlledVisible, setControlledVisible] = useState(false);

    return (
        <div className="p-8 space-y-8">
            <h2 className="text-2xl font-bold mb-4">Default Tooltip Examples</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic example */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Basic Tooltip</h3>
                    <div className="flex justify-center">
                        <Tooltip content="This is a simple tooltip with minimal styling">
                            <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                                Hover Me
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* With title and icon */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">With Title & Icon</h3>
                    <div className="flex justify-center">
                        <Tooltip
                            content="Additional information about this feature with more details"
                            title="Feature Information"
                            icon={<Info className="w-4 h-4 text-blue-500" />}
                        >
                            <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                                Help
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Different positions */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Positions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Tooltip
                            content="Tooltip on top"
                            position="top"
                        >
                            <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                                Top
                            </button>
                        </Tooltip>

                        <Tooltip
                            content="Tooltip on bottom"
                            position="bottom"
                        >
                            <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                                Bottom
                            </button>
                        </Tooltip>

                        <Tooltip
                            content="Tooltip on left"
                            position="left"
                        >
                            <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                                Left
                            </button>
                        </Tooltip>

                        <Tooltip
                            content="Tooltip on right"
                            position="right"
                        >
                            <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                                Right
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Controlled tooltip */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Controlled Tooltip</h3>
                    <div className="flex flex-col items-center space-y-4">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            onClick={() => setControlledVisible(!controlledVisible)}
                        >
                            {controlledVisible ? 'Hide Tooltip' : 'Show Tooltip'}
                        </button>

                        <Tooltip
                            content="This tooltip is controlled programmatically"
                            isVisible={controlledVisible}
                            showOnHover={false}
                            icon={<AlertCircle className="w-4 h-4 text-red-500" />}
                            title="Controlled Example"
                        >
                            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        </Tooltip>
                    </div>
                </div>

                {/* Rich content */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Rich Content</h3>
                    <div className="flex justify-center">
                        <Tooltip
                            content={
                                <div>
                                    <p className="font-medium mb-2">Complex Tooltip Content</p>
                                    <ul className="list-disc pl-4 text-sm">
                                        <li>Support for HTML content</li>
                                        <li>Multiple paragraphs</li>
                                        <li>Lists and formatting</li>
                                    </ul>
                                </div>
                            }
                            width="220px"
                        >
                            <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors flex items-center">
                                <HelpCircle className="w-4 h-4 mr-2" />
                                Rich Content
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Custom styling */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Custom Styling</h3>
                    <div className="flex justify-center">
                        <Tooltip
                            content="Tooltip with custom styling applied"
                            title="Custom Style"
                            titleColor="text-purple-500"
                            icon={<Info className="w-4 h-4 text-purple-500" />}
                            className="custom-tooltip-style"
                        >
                            <button className="px-4 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors">
                                Custom Style
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefaultTooltipExample; 