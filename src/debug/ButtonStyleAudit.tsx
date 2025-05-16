/**
 * Button Style Audit Tool
 * 
 * This tool helps identify competing button styles across the codebase
 * by listing all stylesheets that contain button-related selectors.
 */

import React, { useEffect, useState } from 'react';
import { logger } from '../utils/logger';

interface StylesheetInfo {
    href: string;
    buttonSelectors: string[];
    specificity: Record<string, number>;
}

export const ButtonStyleAudit: React.FC = () => {
  const [styleData, setStyleData] = useState<StylesheetInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate specificity score (simplified)
  const calculateSpecificity = (selector: string): number => {
    let score = 0;
    // Count IDs (#foo)
    score += (selector.match(/#[a-zA-Z0-9_-]+/g) || []).length * 100;
    // Count classes (.foo) and attributes ([foo=bar])
    score += (selector.match(/\.[a-zA-Z0-9_-]+|\[.+?\]/g) || []).length * 10;
    // Count elements (div, span, etc)
    score += (selector.match(/[a-zA-Z]+/g) || []).length * 1;
    // Add extra for :not() and other pseudo-classes
    score += (selector.match(/:[a-zA-Z-()]+/g) || []).length * 10;
    return score;
  };

  useEffect(() => {
    const analyzeStylesheets = () => {
      const stylesheets = Array.from(document.styleSheets);
      const results: StylesheetInfo[] = [];

      stylesheets.forEach(sheet => {
        try {
          // Skip if cross-origin
          if (!sheet.href || sheet.href.startsWith('data:')) return;

          const rules = Array.from(sheet.cssRules || []);
          const buttonSelectors: string[] = [];
          const specificity: Record<string, number> = {};

          rules.forEach(rule => {
            if (rule instanceof CSSStyleRule) {
              const selector = rule.selectorText;
              // Find button-related selectors
              if (
                selector.includes('.button') ||
                                selector.includes('button.') ||
                                selector.includes('button[') ||
                                selector.includes('button:') ||
                                selector.match(/button\s+/) ||
                                selector.match(/button$/)
              ) {
                buttonSelectors.push(selector);
                specificity[selector] = calculateSpecificity(selector);
              }
            }
          });

          if (buttonSelectors.length > 0) {
            results.push({
              href: sheet.href || 'inline style',
              buttonSelectors,
              specificity
            });
          }
        } catch (e) {
          logger.warn('Could not access stylesheet:', sheet.href, e);
        }
      });

      setStyleData(results);
      setLoading(false);
    };

    // Run after styles are loaded
    if (document.readyState === 'complete') {
      analyzeStylesheets();
    } else {
      window.addEventListener('load', analyzeStylesheets);
      return () => window.removeEventListener('load', analyzeStylesheets);
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Button Style Audit</h1>
      {loading ? (
        <p>Analyzing stylesheets...</p>
      ) : (
        <div>
          <p className="mb-4">Found {styleData.length} stylesheets with button styles</p>

          {styleData.map((sheet, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <h2 className="text-lg font-semibold mb-2">{sheet.href.split('/').pop()}</h2>
              <p className="text-sm text-gray-600 mb-2">{sheet.href}</p>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Selector</th>
                    <th className="p-2 text-right">Specificity</th>
                  </tr>
                </thead>
                <tbody>
                  {sheet.buttonSelectors.map((selector, sIndex) => (
                    <tr key={sIndex} className="border-t">
                      <td className="p-2 font-mono text-sm">{selector}</td>
                      <td className="p-2 text-right">{sheet.specificity[selector]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-bold">Recommendations:</h3>
            <ul className="list-disc ml-6 mt-2">
              <li>Remove button styles from any non-Button component files</li>
              <li>Consolidate all button styling in Button.scss</li>
              <li>Use BEM methodology to ensure proper specificity</li>
              <li>Consider using CSS modules for complete isolation</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonStyleAudit; 