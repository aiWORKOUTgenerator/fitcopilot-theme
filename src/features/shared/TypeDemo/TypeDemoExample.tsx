import React, { useState } from 'react';
import logger from '../../../utils/logger';
import TypeDemo, { TypeDemoProps } from './TypeDemo';

/**
 * Example usage of the TypeDemo component demonstrating type safety features
 */
const TypeDemoExample: React.FC = () => {
  // Properly typed demo items
  const [demoItems, setDemoItems] = useState([
    {
      id: '1',
      label: 'Push Ups',
      value: '3 sets x 15 reps',
      description: 'Standard push ups with proper form',
      isHighlighted: true
    },
    {
      id: '2',
      label: 'Pull Ups',
      value: '3 sets x 8 reps',
      description: 'Full extension pull ups'
    },
    {
      id: '3',
      label: 'Squats',
      value: '3 sets x 20 reps',
      description: 'Bodyweight squats, focus on form'
    },
    {
      id: '4',
      label: 'Plank',
      value: '3 sets x 60 seconds',
      description: 'Maintain proper alignment'
    },
    {
      id: '5',
      label: 'Mountain Climbers',
      value: '3 sets x 30 seconds',
      description: 'Keep a steady pace'
    }
  ]);

  // Properly typed theme state
  const [themeVariant, setThemeVariant] = useState<TypeDemoProps['themeVariant']>('default');

  // Properly typed display mode state
  const [displayMode, setDisplayMode] = useState<TypeDemoProps['displayMode']>({
    mode: 'expanded',
    showDescriptions: true
  });

  // Properly typed event handler
  const handleItemSelect = (id: string, event: React.MouseEvent<HTMLLIElement>): void => {
    logger.log(`Selected item ${id} at position (${event.clientX}, ${event.clientY})`);

    // Update items to toggle highlighting
    setDemoItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, isHighlighted: !item.isHighlighted }
          : item
      )
    );
  };

  // Theme switcher
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setThemeVariant(event.target.value as TypeDemoProps['themeVariant']);
  };

  // Display mode switcher
  const handleDisplayModeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const mode = event.target.value;

    // Demonstrate proper type narrowing with discriminated unions
    switch (mode) {
    case 'compact':
      setDisplayMode({ mode: 'compact', maxItems: 3 });
      break;
    case 'expanded':
      setDisplayMode({ mode: 'expanded', showDescriptions: true });
      break;
    case 'grid':
      setDisplayMode({ mode: 'grid', columns: 2 });
      break;
    }
  };

  return (
    <div className="type-demo-example">
      <h2>TypeDemo Component Example</h2>
      <p>This showcases proper TypeScript usage in FitCopilot components</p>

      <div className="type-demo-controls">
        <div className="control-group">
          <label htmlFor="theme-select">Theme:</label>
          <select
            id="theme-select"
            value={themeVariant}
            onChange={handleThemeChange}
          >
            <option value="default">Default</option>
            <option value="gym">Gym</option>
            <option value="sports">Sports</option>
            <option value="wellness">Wellness</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="display-mode">Display Mode:</label>
          <select
            id="display-mode"
            value={displayMode.mode}
            onChange={handleDisplayModeChange}
          >
            <option value="expanded">Expanded</option>
            <option value="compact">Compact</option>
            <option value="grid">Grid</option>
          </select>
        </div>
      </div>

      <TypeDemo
        title="Workout Exercises"
        description="Select an exercise to highlight it"
        items={demoItems}
        onItemSelect={handleItemSelect}
        themeVariant={themeVariant}
        displayMode={displayMode}
      />

      <div className="type-info">
        <h3>Type Safety Features Demonstrated:</h3>
        <ul>
          <li>Discriminated union types for display modes</li>
          <li>Proper event handler typing</li>
          <li>Type narrowing based on display mode</li>
          <li>CSS custom properties with token system</li>
          <li>Proper prop interface definition</li>
          <li>Theme variant implementation</li>
        </ul>
      </div>
    </div>
  );
};

export default TypeDemoExample; 