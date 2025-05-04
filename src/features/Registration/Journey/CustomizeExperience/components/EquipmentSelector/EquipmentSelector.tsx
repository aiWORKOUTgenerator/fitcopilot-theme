import React, { useCallback, useEffect, useState } from 'react';
import { EQUIPMENT_CATEGORIES } from '../../constants/equipmentOptions';
import { useCustomization } from '../../context/CustomizationContext';
import { getValidationMessage, validators } from '../../utils/validators';
import SelectableOption from '../SelectableOption';
import ValidationSummary from '../ValidationSummary';
import './EquipmentSelector.scss';

/**
 * Enhanced equipment selector with categorized options and accessibility improvements
 * using the centralized CustomizationContext
 */
const EquipmentSelector: React.FC<{ setIsValid?: (isValid: boolean) => void }> = React.memo(({
    setIsValid
}) => {
    const {
        equipmentData,
        updateEquipmentData,
        saveAllData
    } = useCustomization();

    // Initialize state from context data
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
        equipmentData?.selectedEquipment || []
    );

    const [otherEquipment, setOtherEquipment] = useState<string>(
        equipmentData?.otherEquipment || ''
    );

    // State for validation
    const [showValidation, setShowValidation] = useState<boolean>(false);
    const [isTouched, setIsTouched] = useState<boolean>(false);

    // Check if the form is valid based on validators
    const isValid = validators.equipment({
        selectedEquipment,
        otherEquipment,
        hasNoEquipment: selectedEquipment.includes('No Equipment')
    });

    // Update validation status when selections change
    useEffect(() => {
        // Only validate if the form has been touched
        if (isTouched) {
            // Show validation message if form is invalid
            setShowValidation(!isValid);
        }

        // Update parent StandardSection via prop
        if (setIsValid) {
            setIsValid(isValid);
        }

        // Update context data
        updateEquipmentData({
            selectedEquipment,
            otherEquipment,
            hasNoEquipment: selectedEquipment.includes('No Equipment')
        });

        // Save all data to storage
        saveAllData();
    }, [selectedEquipment, otherEquipment, updateEquipmentData, saveAllData, setIsValid, isValid, isTouched]);

    // Toggle equipment selection with memoized callback
    const toggleEquipment = useCallback((equipment: string) => {
        // Mark form as touched when user interacts
        if (!isTouched) {
            setIsTouched(true);
        }

        setSelectedEquipment(prev => {
            if (prev.includes(equipment)) {
                return prev.filter(e => e !== equipment);
            }
            return [...prev, equipment];
        });
    }, [isTouched]);

    // Handle text input change with memoized callback
    const handleOtherEquipmentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Mark form as touched when user interacts
        if (!isTouched) {
            setIsTouched(true);
        }

        setOtherEquipment(e.target.value);
    }, [isTouched]);

    return (
        <div className="equipment-selector">
            {/* Validation summary */}
            <ValidationSummary
                isValid={!showValidation}
                message={getValidationMessage('equipment')}
            />

            {/* Equipment selection by category */}
            <div className="equipment-categories">
                {Object.entries(EQUIPMENT_CATEGORIES).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="equipment-category">
                        <h4 className="category-title">{category.label}</h4>

                        <div className="category-options">
                            {category.options.map((equipment) => (
                                <SelectableOption
                                    key={equipment}
                                    label={equipment}
                                    selected={selectedEquipment.includes(equipment)}
                                    onSelect={() => toggleEquipment(equipment)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Other equipment input */}
            <div className="other-equipment">
                <label htmlFor="other-equipment" className="other-label">
                    Other equipment not listed
                </label>
                <textarea
                    id="other-equipment"
                    className="other-input"
                    placeholder="Please list any other equipment you have"
                    rows={2}
                    value={otherEquipment}
                    onChange={handleOtherEquipmentChange}
                    aria-describedby={!isValid ? "equipment-validation" : undefined}
                />
            </div>

            {/* Selection summary */}
            {selectedEquipment.length > 0 && (
                <div className="selection-summary" aria-live="polite">
                    <div className="summary-text">
                        {selectedEquipment.length} {selectedEquipment.length === 1 ? 'item' : 'items'} selected
                    </div>
                </div>
            )}
        </div>
    );
});

EquipmentSelector.displayName = 'EquipmentSelector';

export default EquipmentSelector; 