import React, { useEffect, useState } from 'react';

/**
 * Theme options available in the system
 */
type ThemeOption = 'default' | 'gym' | 'sports' | 'wellness';

interface ThemeSwitcherProps {
    /**
     * Optional initial theme
     */
    initialTheme?: ThemeOption;
}

/**
 * ThemeSwitcher component
 * 
 * Provides a UI for switching between different color themes
 */
const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  initialTheme = 'default'
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>(initialTheme);

  // Apply theme to the document
  useEffect(() => {
    // Get the document element
    const doc = document.documentElement;

    // Remove any existing theme
    doc.removeAttribute('data-theme');

    // Apply the current theme if not default
    if (currentTheme !== 'default') {
      doc.setAttribute('data-theme', currentTheme);
    }

    // Save theme preference to localStorage
    localStorage.setItem('preferred-theme', currentTheme);
  }, [currentTheme]);

  // Theme options with their display names
  const themes: { value: ThemeOption; label: string; color: string }[] = [
    { value: 'default', label: 'Default (Lime)', color: '#ddff0e' },
    { value: 'gym', label: 'Gym (Violet)', color: '#8b5cf6' },
    { value: 'sports', label: 'Sports (Blue)', color: '#38bdf8' },
    { value: 'wellness', label: 'Wellness (Teal)', color: '#2dd4bf' },
  ];

  return (
    <div className="theme-switcher p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-text-primary mb-3">Theme Switcher</h3>

      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme.value}
            onClick={() => setCurrentTheme(theme.value)}
            className={`
              flex items-center px-3 py-2 rounded-md transition-all
              ${currentTheme === theme.value ? 'ring-2 ring-offset-1 ring-offset-gray-800' : ''}
            `}
            style={{
              backgroundColor: theme.color,
              color: theme.color === '#ddff0e' ? '#111827' : '#ffffff',
              boxShadow: currentTheme === theme.value ? '0 0 0 1px rgba(255, 255, 255, 0.2)' : 'none'
            }}
          >
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: theme.color }}></span>
            {theme.label}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 rounded bg-gray-700">
        <p className="text-sm text-gray-300 mb-2">Current theme: <span className="font-medium text-text-primary">{themes.find(t => t.value === currentTheme)?.label}</span></p>
        <div className="flex gap-3">
          <div className="w-12 h-6 rounded" style={{ backgroundColor: 'var(--color-accent-400)' }}></div>
          <div className="w-12 h-6 rounded" style={{ backgroundColor: 'var(--color-accent-500)' }}></div>
          <div className="w-12 h-6 rounded" style={{ backgroundColor: 'var(--color-accent-600)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher; 