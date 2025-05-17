import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import ThemeInspector from './ThemeInspector';
import ThemeSwitcher from './ThemeSwitcher';

/**
 * Theme Demo Page
 * 
 * This page demonstrates the theme system components and tokens.
 * It's used for development and testing purposes.
 */
const ThemeDemoPage: React.FC = () => {
  return (
    <div className="theme-demo-page">
      <h1>Theme System Demo</h1>
      
      <section className="demo-section">
        <h2>Default Theme</h2>
        <div className="demo-grid">
          <ColorPalette />
          <ComponentShowcase />
        </div>
      </section>
      
      {/* Theme variants */}
      <section className="demo-section">
        <h2>Theme Variants</h2>
        <div className="theme-variants">
          <ThemePreview theme="gym" />
          <ThemePreview theme="sports" />
          <ThemePreview theme="wellness" />
          <ThemePreview theme="nutrition" />
        </div>
      </section>
      
      {/* Development tools */}
      <ThemeInspector />
      <ThemeSwitcher />
    </div>
  );
};

/**
 * Color Palette component to show theme colors
 */
const ColorPalette: React.FC = () => {
  const colorTokens = [
    { name: 'Primary', var: '--color-primary' },
    { name: 'Secondary', var: '--color-secondary' },
    { name: 'Accent', var: '--color-accent' },
    { name: 'Text', var: '--color-text' },
    { name: 'Background', var: '--color-background' },
    { name: 'Border', var: '--color-border' },
  ];
  
  return (
    <div className="color-palette">
      <h3>Colors</h3>
      <div className="color-grid">
        {colorTokens.map((token) => (
          <div className="color-sample" key={token.var}>
            <div 
              className="color-box" 
              style={{ backgroundColor: `var(${token.var})` }}
            />
            <div className="color-info">
              <div className="color-name">{token.name}</div>
              <div className="color-token">{token.var}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Component Showcase to demo themed components
 */
const ComponentShowcase: React.FC = () => {
  return (
    <div className="component-showcase">
      <h3>Components</h3>
      
      <h4>Buttons</h4>
      <div className="button-grid">
        <button className="button button--primary">Primary Button</button>
        <button className="button button--secondary">Secondary Button</button>
        <button className="button button--tertiary">Tertiary Button</button>
      </div>
      
      <h4>Cards</h4>
      <div className="card">
        <h5>Card Title</h5>
        <p>This is a standard card component with theme-aware styling.</p>
        <button className="button button--primary">Action</button>
      </div>
      
      <h4>Form Elements</h4>
      <div className="form-sample">
        <div className="form-group">
          <label htmlFor="sample-input">Input</label>
          <input id="sample-input" type="text" placeholder="Enter text..." />
        </div>
        <div className="form-group">
          <label htmlFor="sample-select">Select</label>
          <select id="sample-select">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
      </div>
    </div>
  );
};

/**
 * Theme Preview component
 */
const ThemePreview: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <div className="theme-preview">
      <h3>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</h3>
      
      <ThemeProvider initialTheme={theme as any}>
        <div className="theme-preview-content" data-testid={`theme-preview-${theme}`}>
          <div className="preview-colors">
            <div 
              className="color-pill" 
              style={{ backgroundColor: 'var(--color-primary)' }}
              title="Primary"
            />
            <div 
              className="color-pill" 
              style={{ backgroundColor: 'var(--color-secondary)' }}
              title="Secondary"
            />
            <div 
              className="color-pill" 
              style={{ backgroundColor: 'var(--color-accent)' }}
              title="Accent"
            />
          </div>
          
          <div className="preview-buttons">
            <button className="button button--primary">Primary</button>
            <button className="button button--secondary">Secondary</button>
          </div>
          
          <div className="preview-card">
            <h4>Card Title</h4>
            <p>Theme preview card with styled content.</p>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};

// Add some inline styles to make the demo page look good
const styles = `
  .theme-demo-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .demo-section {
    margin-bottom: 3rem;
  }
  
  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-top: 1rem;
  }
  
  .color-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .color-sample {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .color-box {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    margin-right: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .color-name {
    font-weight: 600;
  }
  
  .color-token {
    font-family: monospace;
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }
  
  .button-grid {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .button {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .button--primary {
    background-color: var(--button-primary-bg);
    color: var(--button-primary-color);
    border: none;
  }
  
  .button--secondary {
    background-color: var(--button-secondary-bg);
    color: var(--button-secondary-color);
    border: 1px solid var(--button-secondary-border-color);
  }
  
  .button--tertiary {
    background-color: transparent;
    color: var(--button-tertiary-color);
    border: none;
  }
  
  .card {
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--card-border-color, var(--color-border));
    background-color: var(--card-bg-color, var(--color-background));
    box-shadow: var(--card-shadow);
  }
  
  .form-sample {
    display: grid;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  input, select {
    padding: 0.5rem;
    border: 1px solid var(--input-border-color, var(--color-border));
    border-radius: var(--input-border-radius, 0.375rem);
    background-color: var(--input-bg, var(--color-background));
    color: var(--color-text);
  }
  
  .theme-variants {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .theme-preview {
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .theme-preview h3 {
    padding: 1rem;
    margin: 0;
    background-color: var(--color-background-alt);
    border-bottom: 1px solid var(--color-border);
  }
  
  .theme-preview-content {
    padding: 1.5rem;
  }
  
  .preview-colors {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .color-pill {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .preview-buttons {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .preview-card {
    padding: 1rem;
    border-radius: 0.375rem;
    border: 1px solid var(--card-border-color, var(--color-border));
    background-color: var(--card-bg-color, var(--color-background));
  }
  
  .preview-card h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  .preview-card p {
    margin: 0;
    font-size: 0.875rem;
  }
`;

// Inject styles
const injectStyles = () => {
  if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(styles));
    document.head.appendChild(styleEl);
  }
};

if (typeof window !== 'undefined') {
  injectStyles();
}

export default ThemeDemoPage; 