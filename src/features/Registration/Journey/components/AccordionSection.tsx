import { ChevronDown } from 'lucide-react';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { adjustScrollAfterExpand, ensureDropdownContentVisible } from './scrollUtils';

export interface AccordionSectionRef {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: boolean;
}

interface AccordionSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    onOpenStateChange?: (isOpen: boolean) => void;
}

const AccordionSection = forwardRef<AccordionSectionRef, AccordionSectionProps>(({
    title,
    icon,
    children,
    defaultOpen = false,
    onOpenStateChange
}, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
        open: () => {
            setIsOpen(true);
            onOpenStateChange?.(true);
        },
        close: () => {
            setIsOpen(false);
            onOpenStateChange?.(false);
        },
        toggle: () => {
            setIsOpen(prev => {
                const newState = !prev;
                onOpenStateChange?.(newState);
                return newState;
            });
        },
        isOpen
    }));

    const handleToggle = () => {
        setIsOpen(prev => {
            const newState = !prev;
            onOpenStateChange?.(newState);
            return newState;
        });
    };

    // Monitor open state to ensure content is visible when expanded
    useEffect(() => {
        if (isOpen && sectionRef.current) {
            // Get the section ID from the DOM element
            const sectionId = sectionRef.current.id;

            // If we have an ID, ensure the expanded content is visible after a short delay
            // to allow for any animations to complete
            if (sectionId) {
                setTimeout(() => {
                    // Adjust scroll to ensure expanded content is visible
                    adjustScrollAfterExpand(sectionId, '.accordion-content');

                    // Also check if we need to scroll to see the bottom of content
                    // for very tall accordion sections
                    if (contentRef.current && contentRef.current.offsetHeight > window.innerHeight * 0.6) {
                        ensureDropdownContentVisible(sectionId, '.accordion-content');
                    }
                }, 300);
            }
        }
    }, [isOpen]);

    // Generate a unique ID for this accordion section if not already set
    useEffect(() => {
        if (sectionRef.current && !sectionRef.current.id) {
            sectionRef.current.id = `accordion-section-${Math.random().toString(36).substring(2, 9)}`;
        }
    }, []);

    return (
        <div className="mb-4 bg-gray-800/30 rounded-xl overflow-hidden" ref={sectionRef}>
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={handleToggle}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggle();
                    }
                }}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="p-2 bg-gray-700/50 rounded-lg">
                            {icon}
                        </div>
                    )}
                    <h3 className="font-medium text-white">{title}</h3>
                </div>
                <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div
                    ref={contentRef}
                    className="p-4 pt-0 border-t border-gray-700/50 accordion-content"
                >
                    {children}
                </div>
            </div>
        </div>
    );
});

AccordionSection.displayName = 'AccordionSection';

export default AccordionSection; 