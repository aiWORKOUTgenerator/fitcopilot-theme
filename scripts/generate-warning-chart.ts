/**
 * Warning Metrics Chart Generator
 * 
 * This script generates visualizations of ESLint warning reduction over time.
 * It creates both a component-level chart and a rule-specific chart to help 
 * track progress in improving type safety across the codebase.
 */

import * as fs from 'fs';
import * as path from 'path';

// Interface for warning data
interface WarningData {
    date: string;
    component: string;
    warningCount: number;
    errorCount: number;
    warningsByRule: Record<string, number>;
}

interface ChartData {
    components: Array<{
        name: string;
        data: Array<{
            date: string;
            warningCount: number;
            errorCount: number;
        }>;
    }>;
    rules: Array<{
        name: string;
        data: Array<{
            date: string;
            count: number;
        }>;
    }>;
    dates: string[];
}

/**
 * Load historical warning data from file or create empty array if file doesn't exist
 */
function loadWarningHistory(): WarningData[] {
    const historyFile = path.join(process.cwd(), 'reports', 'warning-history.json');

    if (fs.existsSync(historyFile)) {
        return JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    }

    return [];
}

/**
 * Save warning metrics data to history file
 */
function saveWarningHistory(history: WarningData[]): void {
    const historyFile = path.join(process.cwd(), 'reports', 'warning-history.json');
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

/**
 * Load latest verification report and extract warning data
 */
function loadLatestVerificationData(): WarningData[] {
    const reportFile = path.join(process.cwd(), 'reports', 'component-verification-report.json');

    if (!fs.existsSync(reportFile)) {
        console.error('Verification report not found. Please run verification first.');
        process.exit(1);
    }

    const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    return report.components.map((component: any) => ({
        date: today,
        component: component.component,
        warningCount: component.warningCount,
        errorCount: component.errorCount,
        warningsByRule: report.warningsByRule
    }));
}

/**
 * Generate chart data from warning history
 */
function generateChartData(history: WarningData[]): ChartData {
    // Get unique components and dates
    const components = [...new Set(history.map(entry => entry.component))];
    const dates = [...new Set(history.map(entry => entry.date))].sort();

    // Generate component-level data
    const componentData = components.map(component => {
        const data = dates.map(date => {
            const entry = history.find(h => h.component === component && h.date === date);
            return {
                date,
                warningCount: entry ? entry.warningCount : 0,
                errorCount: entry ? entry.errorCount : 0
            };
        });

        return {
            name: component,
            data
        };
    });

    // Get all unique rules
    const allRules = new Set<string>();
    history.forEach(entry => {
        if (entry.warningsByRule) {
            Object.keys(entry.warningsByRule).forEach(rule => allRules.add(rule));
        }
    });

    // Generate rule-specific data
    const ruleData = Array.from(allRules).map(rule => {
        const data = dates.map(date => {
            // For each date, sum the counts for this rule across all components
            const count = history
                .filter(h => h.date === date && h.warningsByRule && h.warningsByRule[rule])
                .reduce((sum, h) => sum + (h.warningsByRule[rule] || 0), 0);

            return { date, count };
        });

        return {
            name: rule,
            data
        };
    });

    return {
        components: componentData,
        rules: ruleData,
        dates
    };
}

/**
 * Returns a color from the theme palette based on index
 */
function getColorForChart(index: number): string {
    const colors = [
        '#0078D4', '#107C10', '#D83B01', '#FFB900', '#8661C5',
        '#2B88D8', '#50E6FF', '#C239B3', '#00B294', '#FF8C00'
    ];
    return colors[index % colors.length];
}

/**
 * Generate HTML chart using our design token system
 */
function generateHtmlChart(chartData: ChartData): string {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ESLint Warning Reduction Progress</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root {
      --color-primary: var(--fc-color-primary, #0078d4);
      --color-secondary: var(--fc-color-secondary, #2b88d8);
      --color-background: var(--fc-color-background, #f9f9f9);
      --color-text: var(--fc-color-text, #333333);
      --color-success: var(--fc-color-success, #107c10);
      --color-warning: var(--fc-color-warning, #ff8c00);
      --color-error: var(--fc-color-error, #d83b01);
      --color-border: var(--fc-color-border, #e0e0e0);
      --font-family: var(--fc-font-family-base, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif);
      --spacing-base: var(--fc-spacing-base, 8px);
    }
    
    body {
      font-family: var(--font-family);
      background-color: var(--color-background);
      color: var(--color-text);
      margin: 0;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    h1, h2, h3 {
      color: var(--color-primary);
    }
    
    .chart-container {
      margin-bottom: 40px;
    }
    
    .tabs {
      display: flex;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--color-border);
    }
    
    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border: 1px solid transparent;
      border-bottom: none;
      border-radius: 4px 4px 0 0;
      margin-right: 5px;
    }
    
    .tab.active {
      background-color: white;
      border-color: var(--color-border);
      border-bottom-color: white;
      color: var(--color-primary);
      font-weight: bold;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .summary-card {
      background-color: white;
      border: 1px solid var(--color-border);
      border-radius: 5px;
      padding: 15px;
      text-align: center;
    }
    
    .summary-card h3 {
      margin-top: 0;
      color: var(--color-text);
    }
    
    .summary-value {
      font-size: 24px;
      font-weight: bold;
      margin: 10px 0;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    .table th, .table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    
    .table th {
      background-color: var(--color-primary);
      color: white;
    }
    
    .table tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    
    .trend-up {
      color: var(--color-error);
    }
    
    .trend-down {
      color: var(--color-success);
    }
    
    .trend-stable {
      color: var(--color-text);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>ESLint Warning Reduction Progress</h1>
    <p>Last updated: ${new Date().toLocaleString()}</p>
    
    <div class="tabs">
      <div class="tab active" data-tab="component">Component-Level Warnings</div>
      <div class="tab" data-tab="rule">Rule-Specific Warnings</div>
      <div class="tab" data-tab="priority">Prioritized Issues</div>
    </div>
    
    <div class="tab-content active" id="component-tab">
      <div class="chart-container">
        <canvas id="componentChart"></canvas>
      </div>
      
      <h2>Component Warning Trends</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Current Warnings</th>
            <th>Change</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          ${chartData.components.map(component => {
        const currentWarnings = component.data[component.data.length - 1]?.warningCount || 0;
        const previousWarnings = component.data.length > 1
            ? component.data[component.data.length - 2]?.warningCount || 0
            : currentWarnings;
        const change = currentWarnings - previousWarnings;
        const trend = change === 0
            ? 'stable'
            : change < 0 ? 'down' : 'up';

        return `
              <tr>
                <td>${component.name}</td>
                <td>${currentWarnings}</td>
                <td class="trend-${trend}">
                  ${change === 0 ? '-' : (change > 0 ? '+' : '') + change}
                </td>
                <td>
                  ${trend === 'down'
                ? '⬇️ Improving'
                : trend === 'up'
                    ? '⬆️ Needs Attention'
                    : '➡️ Stable'}
                </td>
              </tr>
            `;
    }).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="tab-content" id="rule-tab">
      <div class="chart-container">
        <canvas id="ruleChart"></canvas>
      </div>
      
      <h2>Top ESLint Rule Violations</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Rule</th>
            <th>Current Violations</th>
            <th>Change</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          ${chartData.rules
            .sort((a, b) => {
                const aCount = a.data[a.data.length - 1]?.count || 0;
                const bCount = b.data[b.data.length - 1]?.count || 0;
                return bCount - aCount;
            })
            .slice(0, 10)
            .map(rule => {
                const currentCount = rule.data[rule.data.length - 1]?.count || 0;
                const previousCount = rule.data.length > 1
                    ? rule.data[rule.data.length - 2]?.count || 0
                    : currentCount;
                const change = currentCount - previousCount;
                const trend = change === 0
                    ? 'stable'
                    : change < 0 ? 'down' : 'up';

                // Assign priority based on rule type and count
                let priority = 'Medium';
                if (rule.name.includes('no-explicit-any') ||
                    rule.name.includes('no-unsafe-') ||
                    rule.name.includes('strict-')) {
                    priority = currentCount > 5 ? 'High' : 'Medium';
                } else if (rule.name.includes('prefer-') || rule.name.includes('style')) {
                    priority = 'Low';
                }

                return `
                <tr>
                  <td>${rule.name}</td>
                  <td>${currentCount}</td>
                  <td class="trend-${trend}">
                    ${change === 0 ? '-' : (change > 0 ? '+' : '') + change}
                  </td>
                  <td>${priority}</td>
                </tr>
              `;
            }).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="tab-content" id="priority-tab">
      <h2>Prioritized Issues</h2>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Type Safety Issues</h3>
          <div class="summary-value">
            ${chartData.rules
            .filter(rule =>
                rule.name.includes('no-explicit-any') ||
                rule.name.includes('no-unsafe-'))
            .reduce((sum, rule) => {
                const lastEntry = rule.data[rule.data.length - 1];
                return sum + (lastEntry?.count || 0);
            }, 0)}
          </div>
          <div>High Priority Fixes</div>
        </div>
        
        <div class="summary-card">
          <h3>React Hooks Issues</h3>
          <div class="summary-value">
            ${chartData.rules
            .filter(rule => rule.name.includes('react-hooks'))
            .reduce((sum, rule) => {
                const lastEntry = rule.data[rule.data.length - 1];
                return sum + (lastEntry?.count || 0);
            }, 0)}
          </div>
          <div>Medium Priority Fixes</div>
        </div>
        
        <div class="summary-card">
          <h3>Style Issues</h3>
          <div class="summary-value">
            ${chartData.rules
            .filter(rule =>
                rule.name.includes('style') ||
                rule.name.includes('format') ||
                rule.name.includes('indent'))
            .reduce((sum, rule) => {
                const lastEntry = rule.data[rule.data.length - 1];
                return sum + (lastEntry?.count || 0);
            }, 0)}
          </div>
          <div>Low Priority Fixes</div>
        </div>
      </div>
      
      <h3>Recommended Actions</h3>
      <ol>
        <li>
          <strong>Focus on explicit 'any' type replacements</strong> - 
          These present the highest type safety risk
        </li>
        <li>
          <strong>Address React hook dependencies</strong> - 
          These can cause hard-to-debug rendering issues
        </li>
        <li>
          <strong>Create proper interfaces for untyped data</strong> - 
          Especially for API responses and complex objects
        </li>
        <li>
          <strong>Implement proper component prop interfaces</strong> - 
          Ensure consistent typing across component hierarchies
        </li>
      </ol>
      
      <h3>Component Fix Priority</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Priority</th>
            <th>Type Issues</th>
            <th>Estimated Effort</th>
          </tr>
        </thead>
        <tbody>
          ${chartData.components
            .map(component => {
                const currentWarnings = component.data[component.data.length - 1]?.warningCount || 0;

                // Simplified estimation logic
                let priority = 'Medium';
                if (currentWarnings > 10) {
                    priority = 'High';
                } else if (currentWarnings < 3) {
                    priority = 'Low';
                }

                const typeIssues = Math.floor(currentWarnings * 0.7); // Rough estimation

                let effort = 'Medium';
                if (currentWarnings > 15) {
                    effort = 'Large';
                } else if (currentWarnings < 5) {
                    effort = 'Small';
                }

                return `
                <tr>
                  <td>${component.name}</td>
                  <td>${priority}</td>
                  <td>${typeIssues}</td>
                  <td>${effort}</td>
                </tr>
              `;
            })
            .sort((a, b) => {
                // Sort by priority (High > Medium > Low)
                const priorityOrder: Record<string, number> = { 'High': 0, 'Medium': 1, 'Low': 2 };

                // Safely extract priority from the HTML string
                const aMatch = a.match(/<td>(High|Medium|Low)<\/td>/);
                const bMatch = b.match(/<td>(High|Medium|Low)<\/td>/);

                const aPriority = aMatch && aMatch[1] ? priorityOrder[aMatch[1]] : 1; // Default to Medium
                const bPriority = bMatch && bMatch[1] ? priorityOrder[bMatch[1]] : 1; // Default to Medium

                return aPriority - bPriority;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <script>
    // Chart.js configuration
    const componentCtx = document.getElementById('componentChart').getContext('2d');
    const componentChart = new Chart(componentCtx, {
      type: 'line',
      data: {
        labels: ${JSON.stringify(chartData.dates)},
        datasets: ${JSON.stringify(chartData.components.map((component, index) => ({
                label: component.name,
                data: component.data.map(d => d.warningCount),
                fill: false,
                tension: 0.1,
                borderColor: getColorForChart(index),
                backgroundColor: getColorForChart(index)
            })))}
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'ESLint Warnings by Component Over Time'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Warning Count'
            },
            min: 0
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });
    
    const ruleCtx = document.getElementById('ruleChart').getContext('2d');
    const ruleChart = new Chart(ruleCtx, {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(chartData.dates)},
        datasets: ${JSON.stringify(chartData.rules
                .sort((a, b) => {
                    const aCount = a.data[a.data.length - 1]?.count || 0;
                    const bCount = b.data[b.data.length - 1]?.count || 0;
                    return bCount - aCount;
                })
                .slice(0, 5)
                .map((rule, index) => ({
                    label: rule.name,
                    data: rule.data.map(d => d.count),
                    backgroundColor: getColorForChart(index)
                }))
            )}
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Top 5 ESLint Rule Violations Over Time'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Violation Count'
            },
            min: 0,
            stacked: true
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            },
            stacked: true
          }
        }
      }
    });
    
    // Tab switching logic
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
      });
    });
  </script>
</body>
</html>
  `;

    return html;
}

/**
 * Main function to update history and generate chart
 */
function generateWarningChart(): void {
    // Load historical data
    const history = loadWarningHistory();

    // Load latest verification data
    const latestData = loadLatestVerificationData();

    // Add latest data to history (avoid duplicates for same date + component)
    latestData.forEach(data => {
        const existingIndex = history.findIndex(
            h => h.date === data.date && h.component === data.component
        );

        if (existingIndex >= 0) {
            history[existingIndex] = data;
        } else {
            history.push(data);
        }
    });

    // Save updated history
    saveWarningHistory(history);

    // Generate chart data
    const chartData = generateChartData(history);

    // Generate HTML chart
    const html = generateHtmlChart(chartData);

    // Write HTML to file
    const outputFile = path.join(process.cwd(), 'reports', 'warning-chart.html');
    fs.writeFileSync(outputFile, html);

    console.log(`Warning chart generated: ${outputFile}`);
}

// Run the chart generation
generateWarningChart(); 