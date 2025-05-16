import React, { useEffect, useState } from 'react';

interface CSSVarValue {
    name: string;
    value: string;
}

export const CSSVarInspector: React.FC = () => {
  const [rootVars, setRootVars] = useState<CSSVarValue[]>([]);
  const [buttonVars, setButtonVars] = useState<CSSVarValue[]>([]);
  const [sectionVars, setSectionVars] = useState<CSSVarValue[]>([]);

  useEffect(() => {
    // Get all CSS variables from :root
    const rootStyles = getComputedStyle(document.documentElement);
    const rootVarCollection: CSSVarValue[] = [];

    // Collect all variables
    for (let i = 0; i < rootStyles.length; i++) {
      const prop = rootStyles[i];
      if (prop.startsWith('--')) {
        rootVarCollection.push({
          name: prop,
          value: rootStyles.getPropertyValue(prop).trim()
        });
      }
    }

    setRootVars(rootVarCollection.sort((a, b) => a.name.localeCompare(b.name)));

    // Check for specific variables used in button components
    const buttonVarNames = [
      '--color-primary',
      '--color-primary-dark',
      '--color-secondary',
      '--color-text',
      '--color-text-inverse',
      '--radius-md',
      '--duration-pt-transition',
      '--ease-pt-transition',
      '--transform-pt-button-hover-y',
      '--shadow-pt-button-hover',
      '--spacing-pt-button-icon-left',
      // Add other button-related variables
    ];

    const buttonVarCollection: CSSVarValue[] = buttonVarNames.map(varName => ({
      name: varName,
      value: rootStyles.getPropertyValue(varName).trim()
    }));

    setButtonVars(buttonVarCollection);

    // Test variable resolution in .personal-training-section
    const ptSection = document.querySelector('.personal-training-section');
    if (ptSection) {
      const ptStyles = getComputedStyle(ptSection as HTMLElement);
      const sectionVarCollection: CSSVarValue[] = buttonVarNames.map(varName => ({
        name: varName,
        value: ptStyles.getPropertyValue(varName).trim()
      }));

      setSectionVars(sectionVarCollection);
    }
  }, []);

  return (
    <div className="css-var-inspector p-6 bg-gray-100 max-h-screen overflow-auto">
      <h2 className="text-2xl font-bold mb-4">CSS Variable Inspector</h2>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Button-specific Variables</h3>
        <div className="bg-white p-4 rounded shadow overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Variable</th>
                <th className="text-left p-2">Root Value</th>
                <th className="text-left p-2">Section Value</th>
              </tr>
            </thead>
            <tbody>
              {buttonVars.map((varData, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-mono text-sm">{varData.name}</td>
                  <td className="p-2 font-mono text-sm">{varData.value || '(empty)'}</td>
                  <td className="p-2 font-mono text-sm">
                    {sectionVars[index]?.value || '(inherited)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">All Root Variables</h3>
        <div className="bg-white p-4 rounded shadow overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Variable</th>
                <th className="text-left p-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {rootVars.map((varData, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-mono text-sm">{varData.name}</td>
                  <td className="p-2 font-mono text-sm">{varData.value || '(empty)'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CSSVarInspector; 