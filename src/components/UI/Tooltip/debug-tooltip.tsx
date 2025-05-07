/**
 * Debug file to test Tooltip functionality
 */
import React, { useState } from 'react';
import { Tooltip, TooltipThemeProvider } from '.';

const DebugTooltip: React.FC = () => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    return (
        <div style={{ padding: '100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1>Tooltip Debug</h1>

            <h2>Default Tooltip</h2>
            <Tooltip content="This is a default tooltip">
                <button>Hover me (Default)</button>
            </Tooltip>

            <h2>Hero Tooltip with Provider</h2>
            <TooltipThemeProvider theme="hero">
                <Tooltip content="This is a hero tooltip">
                    <button>Hover me (Hero)</button>
                </Tooltip>
            </TooltipThemeProvider>

            <h2>Hero Tooltip direct props</h2>
            <Tooltip content="This is a hero tooltip with direct props" themeContext="hero">
                <button>Hover me (Hero direct)</button>
            </Tooltip>

            <h2>Controlled Tooltip</h2>
            <div>
                <button onClick={() => setTooltipVisible(!isTooltipVisible)}>
                    {isTooltipVisible ? 'Hide tooltip' : 'Show tooltip'}
                </button>

                <div style={{ marginTop: '20px' }}>
                    <Tooltip
                        content="This is a controlled tooltip"
                        isVisible={isTooltipVisible}
                        showOnHover={false}
                    >
                        <button>Controlled tooltip target</button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default DebugTooltip; 