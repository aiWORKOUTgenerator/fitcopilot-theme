/**
 * Storybook Test Controls
 * 
 * This script injects testing controls into the Storybook UI
 * to make component testing more efficient.
 * 
 * It adds:
 * - Quick theme switching
 * - Test status marking (pass/warn/fail)
 * - Navigation to next component
 * - Theme test runner
 * - Results viewer
 * 
 * Usage:
 * 1. Add this file to your Storybook static directory
 * 2. Include it in .storybook/preview-head.html
 */

// Self-executing function to avoid global namespace pollution
(function() {
  // Wait for Storybook UI to fully load
  window.addEventListener('load', () => {
    setTimeout(injectTestControls, 1000);
  });

  /**
   * Inject test controls into the Storybook UI
   */
  function injectTestControls() {
    logger.info('Injecting Storybook test controls...');

    // Create a container for test controls
    const testControls = document.createElement('div');
    testControls.id = 'storybook-test-controls';
    testControls.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      z-index: 9999;
      background: rgba(30, 30, 30, 0.8);
      padding: 8px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      color: white;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    `;

    // Add title
    const title = document.createElement('div');
    title.textContent = 'Theme Test Controls';
    title.style.cssText = `
      font-weight: bold;
      text-align: center;
      margin-bottom: 5px;
      color: #a3e635;
    `;
    testControls.appendChild(title);

    // Add theme switcher
    const themeSwitcher = document.createElement('div');
    themeSwitcher.style.cssText = `
      display: flex;
      gap: 5px;
      margin-bottom: 5px;
    `;
    
    ['default', 'gym', 'sports', 'wellness', 'nutrition'].forEach(theme => {
      const button = document.createElement('button');
      button.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
      button.style.cssText = `
        font-size: 11px;
        padding: 2px 5px;
        border-radius: 3px;
        border: none;
        background: #4b5563;
        color: white;
        cursor: pointer;
      `;
      button.onclick = () => {
        // Find the theme selector in Storybook UI and change it
        const themeSelector = document.querySelector('[title="Change the theme of the preview"]');
        if (themeSelector) {
          themeSelector.click();
          setTimeout(() => {
            const themeOption = document.querySelector(`[data-item-id="theme-${theme}"]`);
            if (themeOption) {
              themeOption.click();
            }
          }, 100);
        }
      };
      themeSwitcher.appendChild(button);
    });
    testControls.appendChild(themeSwitcher);

    // Buttons for test actions
    const actions = [
      { 
        label: 'Mark ✅ Pass', 
        action: () => {
          const componentName = getCurrentComponentName();
          logger.info(`✅ PASSED: ${componentName}`);
          if (localStorage) {
            const results = JSON.parse(localStorage.getItem('storybook-test-results') || '{}');
            results[componentName] = { status: 'pass', timestamp: new Date().toISOString() };
            localStorage.setItem('storybook-test-results', JSON.stringify(results));
          }
        },
        color: '#22c55e'
      },
      { 
        label: 'Mark ⚠️ Warning', 
        action: () => {
          const componentName = getCurrentComponentName();
          const issue = prompt('Enter the warning issue:');
          logger.info(`⚠️ WARNING: ${componentName} - ${issue}`);
          if (localStorage && issue) {
            const results = JSON.parse(localStorage.getItem('storybook-test-results') || '{}');
            results[componentName] = { 
              status: 'warning', 
              issue, 
              timestamp: new Date().toISOString() 
            };
            localStorage.setItem('storybook-test-results', JSON.stringify(results));
          }
        },
        color: '#f59e0b'
      },
      { 
        label: 'Mark ❌ Fail', 
        action: () => {
          const componentName = getCurrentComponentName();
          const issue = prompt('Enter the failure issue:');
          logger.info(`❌ FAILED: ${componentName} - ${issue}`);
          if (localStorage && issue) {
            const results = JSON.parse(localStorage.getItem('storybook-test-results') || '{}');
            results[componentName] = { 
              status: 'fail', 
              issue, 
              timestamp: new Date().toISOString() 
            };
            localStorage.setItem('storybook-test-results', JSON.stringify(results));
          }
        },
        color: '#ef4444'
      },
      { 
        label: 'Run Theme Tests', 
        action: () => {
          // Inject theme tester script if not already loaded
          if (!window.themeTester) {
            // Load the theme-tester.js script from src/test/storybook
            const script = document.createElement('script');
            script.src = '/theme-tester.js';
            script.onload = () => {
              if (window.themeTester) {
                window.themeTester.testCurrentComponent();
              } else {
                logger.error('Theme tester not found.');
              }
            };
            document.head.appendChild(script);
          } else {
            window.themeTester.testCurrentComponent();
          }
        },
        color: '#3b82f6'
      },
      { 
        label: 'Next Component →', 
        action: () => {
          navigateToNextComponent();
        },
        color: '#8b5cf6'
      }
    ];

    actions.forEach(({label, action, color}) => {
      const button = document.createElement('button');
      button.textContent = label;
      button.style.cssText = `
        padding: 5px;
        margin: 2px 0;
        border-radius: 3px;
        border: none;
        background: ${color};
        color: white;
        cursor: pointer;
        font-weight: bold;
      `;
      button.onclick = action;
      testControls.appendChild(button);
    });

    // Add results viewer
    const viewResults = document.createElement('button');
    viewResults.textContent = 'View Test Results';
    viewResults.style.cssText = `
      padding: 5px;
      margin: 2px 0;
      border-radius: 3px;
      border: none;
      background: #6366f1;
      color: white;
      cursor: pointer;
      margin-top: 5px;
    `;
    viewResults.onclick = showTestResults;
    testControls.appendChild(viewResults);

    // Add the controls to the document
    document.body.appendChild(testControls);

    logger.info('Storybook test controls injected.');
  }

  /**
   * Gets the current component name from Storybook URL
   */
  function getCurrentComponentName() {
    const path = window.location.pathname;
    const match = path.match(/\/story\/(.+)(?:--.+)?$/);
    return match ? match[1] : 'unknown-component';
  }

  /**
   * Navigate to the next component in Storybook
   */
  function navigateToNextComponent() {
    // Get all story links from the sidebar
    const storyLinks = Array.from(document.querySelectorAll('a[href^="/?path=/story/"]'));
    
    // Get current component path
    const currentPath = window.location.pathname;
    
    // Find the current component index
    const currentIndex = storyLinks.findIndex(link => 
      link.getAttribute('href').includes(currentPath.split('/').pop() || '')
    );
    
    // Navigate to next component if found
    if (currentIndex >= 0 && currentIndex < storyLinks.length - 1) {
      const nextLink = storyLinks[currentIndex + 1];
      if (nextLink) {
        nextLink.click();
      }
    } else {
      logger.info('No more components to test.');
    }
  }

  /**
   * Display test results collected so far
   */
  function showTestResults() {
    if (!localStorage) return;
    
    const results = JSON.parse(localStorage.getItem('storybook-test-results') || '{}');
    
    // Count results by status
    const counts = Object.values(results).reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1;
      return acc;
    }, {});
    
    // Create a report
    const report = document.createElement('div');
    report.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      background: #1f2937;
      color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      z-index: 10000;
      font-family: 'Inter', sans-serif;
    `;
    
    // Add title and summary
    report.innerHTML = `
      <h2 style="margin-top: 0; color: #a3e635;">Theme Testing Results</h2>
      <div style="margin-bottom: 15px;">
        <div>Total: ${Object.keys(results).length}</div>
        <div style="color: #22c55e;">Passed: ${counts.pass || 0}</div>
        <div style="color: #f59e0b;">Warnings: ${counts.warning || 0}</div>
        <div style="color: #ef4444;">Failed: ${counts.fail || 0}</div>
      </div>
    `;
    
    // Add results table
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    `;
    
    // Add table header
    table.innerHTML = `
      <thead>
        <tr>
          <th style="padding: 8px; border-bottom: 1px solid #4b5563;">Component</th>
          <th style="padding: 8px; border-bottom: 1px solid #4b5563;">Status</th>
          <th style="padding: 8px; border-bottom: 1px solid #4b5563;">Issue</th>
        </tr>
      </thead>
      <tbody id="results-table-body"></tbody>
    `;
    
    report.appendChild(table);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
      margin-top: 15px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #4b5563;
      color: white;
      cursor: pointer;
    `;
    closeButton.onclick = () => report.remove();
    report.appendChild(closeButton);
    
    // Add export button
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export MD';
    exportButton.style.cssText = `
      margin-top: 15px;
      margin-left: 10px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
    `;
    exportButton.onclick = () => {
      const md = generateMarkdownReport(results);
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `theme-test-results-${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
    };
    report.appendChild(exportButton);
    
    // Add to document
    document.body.appendChild(report);
    
    // Populate table
    const tbody = document.getElementById('results-table-body');
    if (tbody) {
      Object.entries(results).forEach(([component, data]) => {
        const row = document.createElement('tr');
        
        // Component name cell
        const nameCell = document.createElement('td');
        nameCell.style.cssText = `padding: 8px; border-bottom: 1px solid #4b5563;`;
        nameCell.textContent = component;
        row.appendChild(nameCell);
        
        // Status cell
        const statusCell = document.createElement('td');
        statusCell.style.cssText = `padding: 8px; border-bottom: 1px solid #4b5563;`;
        let statusIcon = '';
        let statusColor = '';
        if (data.status === 'pass') {
          statusIcon = '✅';
          statusColor = '#22c55e';
        } else if (data.status === 'warning') {
          statusIcon = '⚠️';
          statusColor = '#f59e0b';
        } else if (data.status === 'fail') {
          statusIcon = '❌';
          statusColor = '#ef4444';
        }
        statusCell.innerHTML = `<span style="color: ${statusColor}">${statusIcon} ${data.status}</span>`;
        row.appendChild(statusCell);
        
        // Issue cell
        const issueCell = document.createElement('td');
        issueCell.style.cssText = `padding: 8px; border-bottom: 1px solid #4b5563;`;
        issueCell.textContent = data.issue || '';
        row.appendChild(issueCell);
        
        tbody.appendChild(row);
      });
    }
  }

  /**
   * Generate markdown report from test results
   */
  function generateMarkdownReport(results) {
    // Count results by status
    const counts = Object.values(results).reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1;
      return acc;
    }, {});
    
    let markdown = `# Storybook Theme Testing Report\n\n`;
    markdown += `*Generated on ${new Date().toLocaleString()}*\n\n`;
    
    markdown += `## Summary\n\n`;
    markdown += `- **Total Components Tested:** ${Object.keys(results).length}\n`;
    markdown += `- **Passed:** ${counts.pass || 0}\n`;
    markdown += `- **Warnings:** ${counts.warning || 0}\n`;
    markdown += `- **Failed:** ${counts.fail || 0}\n\n`;
    
    markdown += `## Component Results\n\n`;
    markdown += `| Component | Status | Issue |\n`;
    markdown += `|-----------|--------|-------|\n`;
    
    Object.entries(results).forEach(([component, data]) => {
      let statusIcon = '';
      if (data.status === 'pass') statusIcon = '✅ Pass';
      else if (data.status === 'warning') statusIcon = '⚠️ Warning';
      else if (data.status === 'fail') statusIcon = '❌ Fail';
      
      markdown += `| ${component} | ${statusIcon} | ${data.issue || ''} |\n`;
    });
    
    markdown += `\n## Issue Categories\n\n`;
    
    // Group by issue types
    const issueTypes = {};
    Object.entries(results).forEach(([component, data]) => {
      if (data.issue) {
        if (!issueTypes[data.status]) issueTypes[data.status] = [];
        issueTypes[data.status].push({ component, issue: data.issue });
      }
    });
    
    // Warning issues
    if (issueTypes.warning && issueTypes.warning.length > 0) {
      markdown += `### Warnings\n\n`;
      issueTypes.warning.forEach(item => {
        markdown += `- **${item.component}**: ${item.issue}\n`;
      });
      markdown += '\n';
    }
    
    // Failure issues
    if (issueTypes.fail && issueTypes.fail.length > 0) {
      markdown += `### Failures\n\n`;
      issueTypes.fail.forEach(item => {
        markdown += `- **${item.component}**: ${item.issue}\n`;
      });
      markdown += '\n';
    }
    
    return markdown;
  }
})(); 