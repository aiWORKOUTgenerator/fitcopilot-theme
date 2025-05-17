import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { themeOptions } from '../utils/theming';

interface ThemeSwitcherProps {
  /**
   * Position of the theme switcher
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  /**
   * Label to display in the switcher
   */
  label?: string;
  
  /**
   * Show color indicators for each theme
   */
  showColors?: boolean;
}

/**
 * ThemeSwitcher - Development utility for theme testing
 * 
 * Provides a panel to quickly switch between themes during development.
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  position = 'bottom-left',
  label = 'Theme',
  showColors = true,
}) => {
  const { theme, setTheme } = useTheme();
  
  const positionStyles = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
  };

  // Theme color indicators
  const themeColors: Record<string, string> = {
    default: '#a3e635', // lime-400
    gym: '#8b5cf6',     // violet-500
    sports: '#06b6d4',  // cyan-500
    wellness: '#14b8a6', // teal-500
    nutrition: '#f59e0b', // amber-500
  };
  
  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 9998,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'sans-serif',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{label}</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {themeOptions.map((themeName) => (
          <button
            key={themeName}
            onClick={() => setTheme(themeName)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              backgroundColor: theme === themeName ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              border: theme === themeName ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: theme === themeName ? 'bold' : 'normal',
            }}
          >
            {showColors && (
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: themeColors[themeName] || '#ccc',
                  borderRadius: '4px',
                  marginRight: '8px',
                }}
              />
            )}
            <span style={{ textTransform: 'capitalize' }}>{themeName}</span>
          </button>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '10px', 
        fontSize: '11px', 
        color: 'rgba(255, 255, 255, 0.6)',
        paddingTop: '6px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        Development tool only
      </div>
    </div>
  );
};

export default ThemeSwitcher; 