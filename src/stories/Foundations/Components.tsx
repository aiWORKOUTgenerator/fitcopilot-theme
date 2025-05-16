import React from 'react';

/**
 * Component for displaying font samples
 */
export const FontSample = ({
  family,
  size,
  weight = 'normal',
  sample = 'The quick brown fox jumps over the lazy dog'
}: {
    family: string;
    size: string;
    weight?: string;
    sample?: string;
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        fontFamily: family,
        fontSize: size,
        fontWeight: weight,
        marginBottom: '0.5rem'
      }}>
        {sample}
      </div>
      <div style={{
        display: 'flex',
        fontSize: '0.875rem',
        color: '#666',
        gap: '1rem'
      }}>
        <span><strong>Family:</strong> {family}</span>
        <span><strong>Size:</strong> {size}</span>
        <span><strong>Weight:</strong> {weight}</span>
      </div>
    </div>
  );
};

/**
 * Component for displaying a spacing visualization
 */
export const SpacingTable = () => {
  const spacingValues = [
    { name: '--space-1', value: '0.25rem', px: '4px' },
    { name: '--space-2', value: '0.5rem', px: '8px' },
    { name: '--space-3', value: '0.75rem', px: '12px' },
    { name: '--space-4', value: '1rem', px: '16px' },
    { name: '--space-6', value: '1.5rem', px: '24px' },
    { name: '--space-8', value: '2rem', px: '32px' },
    { name: '--space-12', value: '3rem', px: '48px' },
    { name: '--space-16', value: '4rem', px: '64px' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {spacingValues.map((spacing) => (
        <div key={spacing.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: spacing.value,
              height: spacing.value,
              backgroundColor: '#0ea5e9',
              borderRadius: '4px'
            }}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{spacing.name}</div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              {spacing.value} / {spacing.px}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Grid display for theme elements
 */
export const ThemeGrid = ({
  children,
  columns = 2
}: {
    children: React.ReactNode;
    columns?: number;
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '2rem',
        marginBottom: '2rem'
      }}
    >
      {children}
    </div>
  );
}; 