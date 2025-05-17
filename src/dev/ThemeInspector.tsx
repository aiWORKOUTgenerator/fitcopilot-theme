import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface ThemeTokenGroup {
  name: string;
  tokens: string[];
}

/**
 * ThemeInspector - A development tool for inspecting theme tokens
 * 
 * This component displays all active CSS variables for the current theme,
 * allowing developers to debug theme issues.
 */
export const ThemeInspector: React.FC = () => {
  const { theme } = useTheme();
  const [tokenGroups, setTokenGroups] = useState<ThemeTokenGroup[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Get all CSS variables from the document
    const styles = window.getComputedStyle(document.documentElement);
    const cssVars: {[key: string]: string} = {};

    // Extract all CSS variables
    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      if (prop.startsWith('--')) {
        cssVars[prop] = styles.getPropertyValue(prop).trim();
      }
    }

    // Group tokens by type
    const groups: ThemeTokenGroup[] = [
      { name: 'Color Tokens', tokens: [] },
      { name: 'Button Tokens', tokens: [] },
      { name: 'Typography Tokens', tokens: [] },
      { name: 'Spacing Tokens', tokens: [] },
      { name: 'Layout Tokens', tokens: [] },
      { name: 'Other Tokens', tokens: [] },
    ];

    // Categorize the tokens
    Object.keys(cssVars).forEach(token => {
      if (token.includes('color') || token.includes('background') || token.includes('border')) {
        groups[0].tokens.push(token);
      } else if (token.includes('button') || token.includes('btn')) {
        groups[1].tokens.push(token);
      } else if (
        token.includes('font') || 
        token.includes('text') || 
        token.includes('line-height') ||
        token.includes('letter-spacing')
      ) {
        groups[2].tokens.push(token);
      } else if (token.includes('spacing') || token.includes('margin') || token.includes('padding')) {
        groups[3].tokens.push(token);
      } else if (
        token.includes('width') || 
        token.includes('height') || 
        token.includes('radius') ||
        token.includes('position') ||
        token.includes('display')
      ) {
        groups[4].tokens.push(token);
      } else {
        groups[5].tokens.push(token);
      }
    });

    // Sort tokens alphabetically in each group
    groups.forEach(group => {
      group.tokens.sort();
    });

    setTokenGroups(groups);
  }, [isOpen, theme]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 15px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '14px',
        }}
      >
        Show Theme Inspector
      </button>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '0',
        right: '0',
        width: '400px',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '20px',
        overflowY: 'auto',
        zIndex: 9999,
        fontFamily: 'monospace',
        fontSize: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Theme Inspector</h2>
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Current Theme:</strong> {theme}</p>
      </div>

      {tokenGroups.map((group, index) => (
        <div key={index} style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)', 
            paddingBottom: '5px',
            marginBottom: '10px'
          }}>
            {group.name} ({group.tokens.length})
          </h3>

          <div>
            {group.tokens.map((token, tokenIndex) => {
              const value = getComputedStyle(document.documentElement).getPropertyValue(token);
              const isColor = value.includes('#') || value.includes('rgb') || value.includes('hsl');
              
              return (
                <div 
                  key={tokenIndex}
                  style={{ 
                    display: 'flex', 
                    marginBottom: '5px',
                    alignItems: 'center'
                  }}
                >
                  {isColor && (
                    <div 
                      style={{
                        width: '20px',
                        height: '20px',
                        background: value,
                        marginRight: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                    <div style={{ color: '#a3e635', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {token}
                    </div>
                    <div style={{ color: '#d1d5db', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThemeInspector; 