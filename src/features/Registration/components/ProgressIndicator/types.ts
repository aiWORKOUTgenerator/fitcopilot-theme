export interface ProgressIndicatorProps {
    completedSections: string[];
    totalSections: number;
    sectionLabels?: Record<string, string>;
    variant?: 'default' | 'compact' | 'detailed';
    showLabels?: boolean;
    accentColor?: string;
    className?: string;
    onSectionClick?: (sectionId: string) => void;
} 