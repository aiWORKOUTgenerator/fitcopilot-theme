import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createVariantComponent } from '../../../utils/variantLoader';
import './TypeDemo.scss';

// Properly typed theme options using discriminated union
type ThemeVariant = 'default' | 'gym' | 'sports' | 'wellness';

// Properly typed functional options as a discriminated union
type DisplayMode =
    | { mode: 'compact'; maxItems: number }
    | { mode: 'expanded'; showDescriptions: boolean }
    | { mode: 'grid'; columns: number };

// Properly typed item with required and optional properties
interface TypeDemoItem {
    id: string;
    label: string;
    value: string | number;
    description?: string;
    isHighlighted?: boolean;
}

// Proper event handler type
type ItemSelectHandler = (id: string, event: React.MouseEvent<HTMLLIElement>) => void;

// Component props with proper type definitions
export interface TypeDemoProps {
    /** Title of the demo section */
    title: string;
    /** Optional description */
    description?: string;
    /** Array of items to display */
    items: TypeDemoItem[];
    /** Callback for item selection */
    onItemSelect?: ItemSelectHandler;
    /** Visual variant */
    variant?: 'default' | 'compact' | 'expanded';
    /** Theme variant */
    themeVariant?: ThemeVariant;
    /** Loading state */
    isLoading?: boolean;
    /** Display mode configuration */
    displayMode?: DisplayMode;
    /** Additional class names */
    className?: string;
}

/**
 * TypeDemo component demonstrates proper type safety patterns
 * used throughout the FitCopilot theme.
 */
const TypeDemo: React.FC<TypeDemoProps> = ({
    title,
    description,
    items,
    onItemSelect,
    variant = 'default',
    themeVariant = 'default',
    isLoading = false,
    displayMode = { mode: 'expanded', showDescriptions: true },
    className = '',
}) => {
    // State with proper typing
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [visibleItems, setVisibleItems] = useState<TypeDemoItem[]>(items);

    // Refs with proper typing
    const containerRef = useRef<HTMLDivElement>(null);

    // Proper useEffect with dependency array
    useEffect(() => {
        setVisibleItems(items);
    }, [items]);

    // Proper useCallback with dependency array
    const handleItemClick = useCallback((event: React.MouseEvent<HTMLLIElement>, id: string): void => {
        event.preventDefault();
        setSelectedId(id);

        if (onItemSelect) {
            onItemSelect(id, event);
        }
    }, [onItemSelect]);

    // Proper type narrowing with discriminated union
    const getItemsToRender = (): TypeDemoItem[] => {
        if (displayMode.mode === 'compact') {
            return visibleItems.slice(0, displayMode.maxItems);
        }

        return visibleItems;
    };

    // Proper conditional CSS class based on props
    const containerClasses = [
        'type-demo',
        `type-demo--${variant}`,
        `type-demo--theme-${themeVariant}`,
        isLoading ? 'type-demo--loading' : '',
        className
    ].filter(Boolean).join(' ');

    // Proper type narrowing and conditional rendering
    const renderItems = (): React.ReactNode => {
        const itemsToRender = getItemsToRender();

        if (itemsToRender.length === 0) {
            return <p className="type-demo__empty">No items to display</p>;
        }

        return (
            <ul
                className={`type-demo__list type-demo__list--${displayMode.mode}`}
                style={displayMode.mode === 'grid' ? { gridTemplateColumns: `repeat(${displayMode.columns}, 1fr)` } : undefined}
            >
                {itemsToRender.map(item => renderItem(item))}
            </ul>
        );
    };

    // Properly typed item renderer with all type information preserved
    const renderItem = (item: TypeDemoItem): JSX.Element => {
        const isSelected = item.id === selectedId;

        return (
            <li
                key={item.id}
                onClick={(e) => handleItemClick(e, item.id)}
                className={`
          type-demo__item 
          type-demo__item--${variant} 
          ${isSelected ? 'type-demo__item--selected' : ''}
          ${item.isHighlighted ? 'type-demo__item--highlighted' : ''}
        `}
                data-testid={`type-demo-item-${item.id}`}
            >
                <span className="type-demo__label">{item.label}</span>
                <span className="type-demo__value">{item.value}</span>

                {displayMode.mode === 'expanded' && displayMode.showDescriptions && item.description && (
                    <p className="type-demo__description">{item.description}</p>
                )}
            </li>
        );
    };

    // Using proper aria attributes for accessibility
    return (
        <div
            className={containerClasses}
            ref={containerRef}
            data-testid="type-demo"
            aria-busy={isLoading}
        >
            <h3 className="type-demo__title">{title}</h3>
            {description && <p className="type-demo__description">{description}</p>}

            {isLoading ? (
                <div className="type-demo__loading" aria-live="polite">
                    <span className="sr-only">Loading items</span>
                </div>
            ) : renderItems()}
        </div>
    );
};

// Create theme variant versions using our pattern
export const TypeDemoVariant = createVariantComponent<TypeDemoProps>(TypeDemo);

export default TypeDemo; 