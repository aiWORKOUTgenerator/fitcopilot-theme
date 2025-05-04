import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { EQUIPMENT_CATEGORIES } from '../../constants/equipmentOptions';
import { useCustomization } from '../../context/CustomizationContext';
import './EquipmentSelector.scss';

/**
 * Enhanced equipment selector with categorized options and animations
 * using the centralized CustomizationContext
 */
const EquipmentSelector: React.FC<{ setIsValid?: (isValid: boolean) => void }> = ({
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

    // Update validation status when selections change
    useEffect(() => {
        const valid = selectedEquipment.length > 0 || otherEquipment.trim().length > 0;

        // Update parent StandardSection via prop
        if (setIsValid) {
            setIsValid(valid);
        }

        // Update context data
        updateEquipmentData({
            selectedEquipment,
            otherEquipment,
            hasNoEquipment: selectedEquipment.includes('No Equipment')
        });

        // Save all data to storage
        saveAllData();
    }, [selectedEquipment, otherEquipment, updateEquipmentData, saveAllData, setIsValid]);

    // Toggle equipment selection
    const toggleEquipment = (equipment: string) => {
        setSelectedEquipment(prev => {
            if (prev.includes(equipment)) {
                return prev.filter(e => e !== equipment);
            }
            return [...prev, equipment];
        });
    };

    return (
        <div className="equipment-selector">
            {/* Equipment selection by category */}
            <div className="equipment-categories">
                {Object.entries(EQUIPMENT_CATEGORIES).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="equipment-category">
                        <h4 className="category-title">{category.label}</h4>

                        <div className="category-options">
                            {category.options.map((equipment, index) => (
                                <div
                                    key={index}
                                    className={`equipment-option ${selectedEquipment.includes(equipment) ? 'selected' : ''}`}
                                    onClick={() => toggleEquipment(equipment)}
                                    role="checkbox"
                                    aria-checked={selectedEquipment.includes(equipment)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            toggleEquipment(equipment);
                                        }
                                    }}
                                >
                                    <div className="option-checkbox">
                                        {selectedEquipment.includes(equipment) && <Check size={14} />}
                                    </div>
                                    <span className="option-label">{equipment}</span>
                                </div>
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
                    onChange={(e) => setOtherEquipment(e.target.value)}
                />
            </div>

            {/* Selection summary */}
            {selectedEquipment.length > 0 && (
                <div className="selection-summary">
                    <div className="summary-text">
                        {selectedEquipment.length} {selectedEquipment.length === 1 ? 'item' : 'items'} selected
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquipmentSelector; 