import React, { useEffect, useState } from 'react';
import { VariantKey } from '../features/Homepage/Hero/types';
import '../styles/demonav.scss';

interface SectionConfig {
    id: string;
    label: string;
    variantKey?: string;
    variants?: VariantKey[];
}

interface DemoNavProps {
    sections: SectionConfig[];
    currentVariants: Record<string, VariantKey>;
    onVariantChange: (sectionKey: string, variant: VariantKey) => void;
}

/**
 * Demo navigation component shown only in demo mode
 * Provides navigation between sections and variant switching
 */
const DemoNav: React.FC<DemoNavProps> = ({
    sections,
    currentVariants,
    onVariantChange
}) => {
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Track scroll position to highlight active section
    useEffect(() => {
        const handleScroll = () => {
            // Find section that is currently most visible in viewport
            const viewportHeight = window.innerHeight;
            let maxVisibleSection = '';
            let maxVisibleArea = 0;

            sections.forEach(section => {
                const element = document.getElementById(section.id);
                if (!element) return;

                const rect = element.getBoundingClientRect();
                const visibleTop = Math.max(0, rect.top);
                const visibleBottom = Math.min(viewportHeight, rect.bottom);
                const visibleArea = Math.max(0, visibleBottom - visibleTop);

                if (visibleArea > maxVisibleArea) {
                    maxVisibleArea = visibleArea;
                    maxVisibleSection = section.id;
                }
            });

            if (maxVisibleSection && maxVisibleSection !== activeSection) {
                setActiveSection(maxVisibleSection);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [sections, activeSection]);

    // Add an effect to automatically flash a highlight on load
    useEffect(() => {
        const timer = setTimeout(() => {
            const demoNav = document.getElementById('demo-nav');
            if (demoNav) {
                demoNav.classList.add('highlight-pulse');
                setTimeout(() => {
                    demoNav.classList.remove('highlight-pulse');
                }, 1000);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            id="demo-nav"
            className={`fixed ${isCollapsed ? 'top-4 right-4 w-auto' : 'top-0 right-0 w-64'} 
                bg-black/90 backdrop-blur-md rounded-lg shadow-lg z-50 text-white border-2 border-lime-500
                transition-all duration-300 ease-in-out`}
            style={{
                boxShadow: '0 0 20px rgba(132, 204, 22, 0.4)'
            }}
        >
            {/* Header */}
            <div
                className="flex justify-between items-center p-3 bg-lime-900/50 rounded-t-lg cursor-pointer"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="text-sm font-bold text-lime-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Demo Mode
                </div>
                <button className="focus:outline-none">
                    {isCollapsed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lime-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lime-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Content - only show when not collapsed */}
            {!isCollapsed && (
                <div className="p-3">
                    <div className="mb-4">
                        {sections.map(section => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className={`block px-2 py-1.5 rounded text-sm mb-1 ${activeSection === section.id
                                    ? 'bg-lime-500/30 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                    } transition-colors`}
                            >
                                {section.label}
                            </a>
                        ))}
                    </div>

                    {/* Variant switchers */}
                    <div className="border-t border-gray-700 pt-2">
                        <div className="text-xs text-lime-400 font-bold mb-2">Variants</div>
                        {sections
                            .filter(section => section.variants && section.variants.length > 1)
                            .map(section => (
                                <div key={`${section.id}-variants`} className="mb-3">
                                    <div className="text-xs text-gray-300 mb-1 font-medium">{section.label}</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {section.variants?.map(variant => (
                                            <button
                                                key={`${section.id}-${variant}`}
                                                className={`px-2 py-1 text-xs rounded ${currentVariants[section.variantKey || section.id] === variant
                                                    ? 'bg-lime-500 text-black font-medium'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    } transition-all`}
                                                onClick={() => section.variantKey && onVariantChange(section.variantKey, variant)}
                                            >
                                                {variant}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="text-xs text-gray-400 mt-4 text-center border-t border-gray-700 pt-2">
                        Disable in Fitcopilot Dashboard
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemoNav; 