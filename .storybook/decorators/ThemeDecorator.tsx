import * as React from 'react';

// Theme configuration interface
interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  effects: {
    glowIntensity: number;
    blurAmount: string;
    shadowOpacity: number;
  };
}

// Available themes
const themes: Record<string, ThemeConfig> = {
  default: {
    name: 'default',
    displayName: 'FitCopilot Default',
    description: 'The standard FitCopilot theme with lime and emerald accents',
    colors: {
      primary: 'rgb(132, 204, 22)',      // lime-500
      secondary: 'rgb(16, 185, 129)',    // emerald-500
      accent: 'rgb(34, 211, 238)',       // cyan-400
      background: 'rgb(17, 24, 39)',     // gray-900
      surface: 'rgb(31, 41, 55)',        // gray-800
      text: 'rgb(255, 255, 255)',        // white
      textSecondary: 'rgb(156, 163, 175)', // gray-400
    },
    effects: {
      glowIntensity: 0.15,
      blurAmount: '16px',
      shadowOpacity: 0.1,
    },
  },
  ocean: {
    name: 'ocean',
    displayName: 'Ocean Depths',
    description: 'Deep blue theme with cyan and teal accents',
    colors: {
      primary: 'rgb(6, 182, 212)',       // cyan-500
      secondary: 'rgb(20, 184, 166)',    // teal-500
      accent: 'rgb(59, 130, 246)',       // blue-500
      background: 'rgb(3, 7, 18)',       // slate-950
      surface: 'rgb(15, 23, 42)',        // slate-800
      text: 'rgb(248, 250, 252)',        // slate-50
      textSecondary: 'rgb(148, 163, 184)', // slate-400
    },
    effects: {
      glowIntensity: 0.2,
      blurAmount: '20px',
      shadowOpacity: 0.15,
    },
  },
  sunset: {
    name: 'sunset',
    displayName: 'Sunset Glow',
    description: 'Warm theme with orange and pink accents',
    colors: {
      primary: 'rgb(251, 146, 60)',      // orange-400
      secondary: 'rgb(244, 63, 94)',     // rose-500
      accent: 'rgb(251, 191, 36)',       // amber-400
      background: 'rgb(23, 23, 23)',     // neutral-900
      surface: 'rgb(38, 38, 38)',        // neutral-800
      text: 'rgb(250, 250, 250)',        // neutral-50
      textSecondary: 'rgb(163, 163, 163)', // neutral-400
    },
    effects: {
      glowIntensity: 0.18,
      blurAmount: '18px',
      shadowOpacity: 0.12,
    },
  },
  forest: {
    name: 'forest',
    displayName: 'Forest Canopy',
    description: 'Nature-inspired theme with green and earth tones',
    colors: {
      primary: 'rgb(34, 197, 94)',       // green-500
      secondary: 'rgb(132, 204, 22)',    // lime-500
      accent: 'rgb(16, 185, 129)',       // emerald-500
      background: 'rgb(12, 10, 9)',      // stone-950
      surface: 'rgb(28, 25, 23)',        // stone-800
      text: 'rgb(250, 250, 249)',        // stone-50
      textSecondary: 'rgb(168, 162, 158)', // stone-400
    },
    effects: {
      glowIntensity: 0.16,
      blurAmount: '14px',
      shadowOpacity: 0.08,
    },
  },
  cosmic: {
    name: 'cosmic',
    displayName: 'Cosmic Purple',
    description: 'Space-inspired theme with purple and violet accents',
    colors: {
      primary: 'rgb(139, 92, 246)',      // violet-500
      secondary: 'rgb(168, 85, 247)',    // purple-500
      accent: 'rgb(236, 72, 153)',       // pink-500
      background: 'rgb(8, 8, 23)',       // indigo-950
      surface: 'rgb(30, 27, 75)',        // indigo-900
      text: 'rgb(253, 253, 253)',        // zinc-50
      textSecondary: 'rgb(161, 161, 170)', // zinc-400
    },
    effects: {
      glowIntensity: 0.22,
      blurAmount: '22px',
      shadowOpacity: 0.18,
    },
  },
};

// Theme context
interface ThemeContextValue {
  currentTheme: ThemeConfig;
  setTheme: (themeName: string) => void;
  availableThemes: Record<string, ThemeConfig>;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: string;
}> = ({ children, initialTheme = 'default' }) => {
  const [currentThemeName, setCurrentThemeName] = React.useState(initialTheme);
  const currentTheme = themes[currentThemeName] || themes.default;

  const setTheme = React.useCallback((themeName: string) => {
    if (themes[themeName]) {
      setCurrentThemeName(themeName);
    }
  }, []);

  const value = React.useMemo(() => ({
    currentTheme,
    setTheme,
    availableThemes: themes,
  }), [currentTheme, setTheme]);

  // Apply theme CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    const theme = currentTheme;

    // Set CSS custom properties
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
    
    root.style.setProperty('--theme-glow-intensity', theme.effects.glowIntensity.toString());
    root.style.setProperty('--theme-blur-amount', theme.effects.blurAmount);
    root.style.setProperty('--theme-shadow-opacity', theme.effects.shadowOpacity.toString());

    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', theme.name);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme decorator for Storybook
export const ThemeDecorator = (Story: any, context: any) => {
  const [selectedTheme, setSelectedTheme] = React.useState('default');

  // Get theme from Storybook globals if available
  React.useEffect(() => {
    if (context.globals?.theme) {
      setSelectedTheme(context.globals.theme);
    }
  }, [context.globals?.theme]);

  return (
    <ThemeProvider initialTheme={selectedTheme}>
      <ThemeWrapper>
        <Story />
      </ThemeWrapper>
    </ThemeProvider>
  );
};

// Theme wrapper component with visual enhancements
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTheme } = useTheme();

  return (
    <div 
      className="theme-wrapper min-h-screen transition-all duration-500"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.colors.background} 0%, ${currentTheme.colors.surface} 100%)`,
        color: currentTheme.colors.text,
      }}
    >
      {/* Theme-specific background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated background particles */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-10 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${currentTheme.colors.primary} 0%, transparent 70%)`,
            top: '10%',
            left: '10%',
            animationDuration: '4s',
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full opacity-10 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${currentTheme.colors.secondary} 0%, transparent 70%)`,
            top: '60%',
            right: '15%',
            animationDuration: '6s',
            animationDelay: '2s',
          }}
        />
        <div 
          className="absolute w-48 h-48 rounded-full opacity-10 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${currentTheme.colors.accent} 0%, transparent 70%)`,
            bottom: '20%',
            left: '50%',
            animationDuration: '5s',
            animationDelay: '1s',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Theme indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div 
          className="px-3 py-2 rounded-lg text-xs font-medium backdrop-blur-sm border"
          style={{
            backgroundColor: `${currentTheme.colors.surface}80`,
            borderColor: `${currentTheme.colors.primary}40`,
            color: currentTheme.colors.text,
          }}
        >
          {currentTheme.displayName}
        </div>
      </div>
    </div>
  );
};

// Theme selector component for Storybook toolbar
export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-300">Theme:</label>
      <select
        value={currentTheme.name}
        onChange={(e) => setTheme(e.target.value)}
        className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-blue-400 focus:outline-none"
      >
        {Object.values(availableThemes).map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.displayName}
          </option>
        ))}
      </select>
    </div>
  );
};

// Export theme configurations for use in stories
export { themes };
export type { ThemeConfig };
