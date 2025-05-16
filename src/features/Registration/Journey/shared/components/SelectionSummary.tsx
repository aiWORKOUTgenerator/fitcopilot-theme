import React from 'react';
import './SelectionSummary.scss';

export interface SelectionSummaryProps {
    selectedCount: number;
    singularLabel: string;
    pluralLabel: string;
    accentColor?: 'lime' | 'amber' | 'cyan' | 'violet';
    maxAllowed?: number;
}

/**
 * A component that displays a summary of selected items
 */
const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  selectedCount,
  singularLabel,
  pluralLabel,
  accentColor = 'lime',
  maxAllowed
}) => {
  if (selectedCount === 0) {
    return null;
  }

  const label = selectedCount === 1 ? singularLabel : pluralLabel;

  return (
    <div className="selection-summary">
      <div className={`summary-badge ${accentColor}-accent`}>
        <span className="count">{selectedCount}</span>
        <span className="label">{label}</span>
        {maxAllowed && (
          <span className="max-indicator">
            of {maxAllowed} max
          </span>
        )}
      </div>
    </div>
  );
};

export default SelectionSummary; 