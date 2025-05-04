import { Check } from 'lucide-react';
import React, { useCallback } from 'react';
import './SelectableOption.scss';

interface SelectableOptionProps {
    label: string;
    selected: boolean;
    onSelect: () => void;
    disabled?: boolean;
    className?: string;
}

/**
 * SelectableOption component
 * 
 * A reusable checkbox-style selectable option with consistent styling
 * and accessibility features
 */
const SelectableOption: React.FC<SelectableOptionProps> = React.memo(({
    label,
    selected,
    onSelect,
    disabled = false,
    className = "",
}) => {
    // Handle keyboard interactions
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            onSelect();
        }
    }, [onSelect, disabled]);

    return (
        <div
            className={`selectable-option ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${className}`}
            onClick={disabled ? undefined : onSelect}
            role="checkbox"
            aria-checked={selected}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
        >
            <div className="option-checkbox">
                {selected && <Check size={14} />}
            </div>
            <span className="option-label">{label}</span>
        </div>
    );
});

SelectableOption.displayName = 'SelectableOption';

export default SelectableOption; 