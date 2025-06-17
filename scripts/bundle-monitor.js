#!/usr/bin/env node

/**
 * Bundle Size Monitoring Script
 * 
 * Tracks bundle sizes, generates reports, and provides CI integration
 * for the Training Calendar Bundle Optimization Sprint
 * 
 * @package FitCopilot
 * @subpackage BundleOptimization
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ===== CONFIGURATION =====

const BUNDLE_BUDGETS = {
  // Maximum sizes in bytes
  maxAssetSize: 500 * 1024, // 500KB
  maxEntrypointSize: 800 * 1024, // 800KB
  
  // Specific component budgets
  trainingCalendar: {
    maxChunkSize: 200 * 1024, // 200KB
    maxCssSize: 100 * 1024,   // 100KB
  },
  
  fullCalendar: {
    maxSize: 700 * 1024, // 700KB
  },
  
  // Warning thresholds (percentage of budget)
  warningThreshold: 0.8, // 80%
  errorThreshold: 0.95,  // 95%
};

const DIST_DIR = path.resolve(__dirname, '../dist');
const REPORTS_DIR = path.resolve(__dirname, '../reports');
const MANIFEST_PATH = path.resolve(DIST_DIR, 'manifest.json');

// ===== UTILITIES =====

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file size
 */
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch (error) {
    return 0;
  }
}

/**
 * Get gzipped file size
 */
function getGzippedSize(filePath) {
  const gzPath = filePath + '.gz';
  return getFileSize(gzPath);
}

/**
 * Calculate compression ratio
 */
function getCompressionRatio(originalSize, compressedSize) {
  if (originalSize === 0) return 0;
  return ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
}

/**
 * Check if size exceeds budget
 */
function checkBudget(size, budget, name) {
  const warningSize = budget * BUNDLE_BUDGETS.warningThreshold;
  const errorSize = budget * BUNDLE_BUDGETS.errorThreshold;
  
  if (size > budget) {
    return { status: 'error', message: `${name} exceeds budget: ${formatBytes(size)} > ${formatBytes(budget)}` };
  } else if (size > errorSize) {
    return { status: 'error', message: `${name} near budget limit: ${formatBytes(size)} (${formatBytes(budget)} budget)` };
  } else if (size > warningSize) {
    return { status: 'warning', message: `${name} approaching budget: ${formatBytes(size)} (${formatBytes(budget)} budget)` };
  }
  
  return { status: 'ok', message: `${name} within budget: ${formatBytes(size)} (${formatBytes(budget)} budget)` };
}

// ===== ANALYSIS FUNCTIONS =====

/**
 * Analyze bundle assets
 */
function analyzeBundles() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error('Manifest file not found. Run build first.');
  }
  
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const analysis = {
    timestamp: new Date().toISOString(),
    assets: {},
    entrypoints: {},
    chunks: {},
    summary: {
      totalSize: 0,
      totalGzippedSize: 0,
      assetCount: 0,
      warnings: [],
      errors: []
    }
  };
  
  // Analyze individual assets
  Object.entries(manifest).forEach(([key, relativePath]) => {
    const fullPath = path.resolve(DIST_DIR, relativePath);
    const size = getFileSize(fullPath);
    const gzippedSize = getGzippedSize(fullPath);
    const compressionRatio = getCompressionRatio(size, gzippedSize);
    
    analysis.assets[key] = {
      path: relativePath,
      size,
      gzippedSize,
      compressionRatio: parseFloat(compressionRatio),
      formatted: {
        size: formatBytes(size),
        gzippedSize: formatBytes(gzippedSize)
      }
    };
    
    analysis.summary.totalSize += size;
    analysis.summary.totalGzippedSize += gzippedSize;
    analysis.summary.assetCount++;
    
    // Check individual asset budgets
    if (key.includes('fullcalendar')) {
      const budget = checkBudget(size, BUNDLE_BUDGETS.fullCalendar.maxSize, `FullCalendar (${key})`);
      if (budget.status === 'warning') analysis.summary.warnings.push(budget.message);
      if (budget.status === 'error') analysis.summary.errors.push(budget.message);
    }
    
    if (key.includes('training-calendar')) {
      const budget = checkBudget(size, BUNDLE_BUDGETS.trainingCalendar.maxChunkSize, `Training Calendar (${key})`);
      if (budget.status === 'warning') analysis.summary.warnings.push(budget.message);
      if (budget.status === 'error') analysis.summary.errors.push(budget.message);
    }
    
    // General asset size check
    const assetBudget = checkBudget(size, BUNDLE_BUDGETS.maxAssetSize, key);
    if (assetBudget.status === 'warning') analysis.summary.warnings.push(assetBudget.message);
    if (assetBudget.status === 'error') analysis.summary.errors.push(assetBudget.message);
  });
  
  // Analyze entrypoints
  const entrypoints = ['homepage', 'critical', 'debug'];
  entrypoints.forEach(entry => {
    const jsAsset = analysis.assets[`${entry}.js`];
    const cssAsset = analysis.assets[`${entry}.css`];
    
    if (jsAsset || cssAsset) {
      const totalSize = (jsAsset?.size || 0) + (cssAsset?.size || 0);
      const totalGzippedSize = (jsAsset?.gzippedSize || 0) + (cssAsset?.gzippedSize || 0);
      
      analysis.entrypoints[entry] = {
        js: jsAsset || null,
        css: cssAsset || null,
        totalSize,
        totalGzippedSize,
        formatted: {
          totalSize: formatBytes(totalSize),
          totalGzippedSize: formatBytes(totalGzippedSize)
        }
      };
      
      // Check entrypoint budget
      const budget = checkBudget(totalSize, BUNDLE_BUDGETS.maxEntrypointSize, `${entry} entrypoint`);
      if (budget.status === 'warning') analysis.summary.warnings.push(budget.message);
      if (budget.status === 'error') analysis.summary.errors.push(budget.message);
    }
  });
  
  // Format summary
  analysis.summary.formatted = {
    totalSize: formatBytes(analysis.summary.totalSize),
    totalGzippedSize: formatBytes(analysis.summary.totalGzippedSize),
    compressionRatio: getCompressionRatio(analysis.summary.totalSize, analysis.summary.totalGzippedSize)
  };
  
  return analysis;
}

/**
 * Generate HTML report
 */
function generateHtmlReport(analysis) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundle Size Report - ${new Date(analysis.timestamp).toLocaleDateString()}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #8b5cf6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #8b5cf6; }
        .metric-label { font-size: 14px; color: #666; margin-top: 5px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: 600; }
        .status-ok { color: #28a745; }
        .status-warning { color: #ffc107; }
        .status-error { color: #dc3545; }
        .alert { padding: 15px; border-radius: 6px; margin: 10px 0; }
        .alert-warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
        .alert-error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        .progress-bar { width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #28a745, #ffc107, #dc3545); transition: width 0.3s; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bundle Size Report</h1>
            <p>Generated on ${new Date(analysis.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="content">
            <div class="summary">
                <div class="metric">
                    <div class="metric-value">${analysis.summary.formatted.totalSize}</div>
                    <div class="metric-label">Total Size</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${analysis.summary.formatted.totalGzippedSize}</div>
                    <div class="metric-label">Gzipped Size</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${analysis.summary.formatted.compressionRatio}%</div>
                    <div class="metric-label">Compression Ratio</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${analysis.summary.assetCount}</div>
                    <div class="metric-label">Total Assets</div>
                </div>
            </div>
            
            ${analysis.summary.errors.length > 0 ? `
            <div class="section">
                <h2>❌ Errors</h2>
                ${analysis.summary.errors.map(error => `<div class="alert alert-error">${error}</div>`).join('')}
            </div>
            ` : ''}
            
            ${analysis.summary.warnings.length > 0 ? `
            <div class="section">
                <h2>⚠️ Warnings</h2>
                ${analysis.summary.warnings.map(warning => `<div class="alert alert-warning">${warning}</div>`).join('')}
            </div>
            ` : ''}
            
            <div class="section">
                <h2>📊 Entrypoints</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Entrypoint</th>
                            <th>JS Size</th>
                            <th>CSS Size</th>
                            <th>Total Size</th>
                            <th>Gzipped</th>
                            <th>Budget Usage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(analysis.entrypoints).map(([name, entry]) => {
                          const budgetUsage = (entry.totalSize / BUNDLE_BUDGETS.maxEntrypointSize * 100).toFixed(1);
                          const statusClass = budgetUsage > 95 ? 'status-error' : budgetUsage > 80 ? 'status-warning' : 'status-ok';
                          return `
                            <tr>
                                <td><strong>${name}</strong></td>
                                <td>${entry.js ? entry.js.formatted.size : '-'}</td>
                                <td>${entry.css ? entry.css.formatted.size : '-'}</td>
                                <td>${entry.formatted.totalSize}</td>
                                <td>${entry.formatted.totalGzippedSize}</td>
                                <td class="${statusClass}">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${Math.min(budgetUsage, 100)}%"></div>
                                    </div>
                                    ${budgetUsage}%
                                </td>
                            </tr>
                          `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="section">
                <h2>📦 All Assets</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Size</th>
                            <th>Gzipped</th>
                            <th>Compression</th>
                            <th>Path</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(analysis.assets)
                          .sort(([,a], [,b]) => b.size - a.size)
                          .map(([name, asset]) => `
                            <tr>
                                <td><strong>${name}</strong></td>
                                <td>${asset.formatted.size}</td>
                                <td>${asset.formatted.gzippedSize}</td>
                                <td>${asset.compressionRatio}%</td>
                                <td><code>${asset.path}</code></td>
                            </tr>
                          `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
  `;
  
  return html;
}

/**
 * Save analysis to JSON
 */
function saveAnalysis(analysis) {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.resolve(REPORTS_DIR, `bundle-analysis-${timestamp}.json`);
  const htmlPath = path.resolve(REPORTS_DIR, `bundle-report-${timestamp}.html`);
  const latestJsonPath = path.resolve(REPORTS_DIR, 'bundle-analysis-latest.json');
  const latestHtmlPath = path.resolve(REPORTS_DIR, 'bundle-report-latest.html');
  
  // Save timestamped files
  fs.writeFileSync(jsonPath, JSON.stringify(analysis, null, 2));
  fs.writeFileSync(htmlPath, generateHtmlReport(analysis));
  
  // Save latest files
  fs.writeFileSync(latestJsonPath, JSON.stringify(analysis, null, 2));
  fs.writeFileSync(latestHtmlPath, generateHtmlReport(analysis));
  
  return { jsonPath, htmlPath, latestJsonPath, latestHtmlPath };
}

/**
 * Compare with previous analysis
 */
function compareWithPrevious(currentAnalysis) {
  const previousPath = path.resolve(REPORTS_DIR, 'bundle-analysis-latest.json');
  
  if (!fs.existsSync(previousPath)) {
    return null;
  }
  
  try {
    const previousAnalysis = JSON.parse(fs.readFileSync(previousPath, 'utf8'));
    const comparison = {
      totalSizeDiff: currentAnalysis.summary.totalSize - previousAnalysis.summary.totalSize,
      gzippedSizeDiff: currentAnalysis.summary.totalGzippedSize - previousAnalysis.summary.totalGzippedSize,
      assetChanges: {}
    };
    
    // Compare individual assets
    Object.keys(currentAnalysis.assets).forEach(key => {
      const current = currentAnalysis.assets[key];
      const previous = previousAnalysis.assets[key];
      
      if (previous) {
        comparison.assetChanges[key] = {
          sizeDiff: current.size - previous.size,
          gzippedSizeDiff: current.gzippedSize - previous.gzippedSize
        };
      } else {
        comparison.assetChanges[key] = { new: true, size: current.size };
      }
    });
    
    return comparison;
  } catch (error) {
    console.warn('Could not compare with previous analysis:', error.message);
    return null;
  }
}

// ===== MAIN EXECUTION =====

function main() {
  try {
    console.log('🔍 Analyzing bundle sizes...');
    
    const analysis = analyzeBundles();
    const comparison = compareWithPrevious(analysis);
    const paths = saveAnalysis(analysis);
    
    console.log('\n📊 Bundle Analysis Summary:');
    console.log(`Total Size: ${analysis.summary.formatted.totalSize}`);
    console.log(`Gzipped Size: ${analysis.summary.formatted.totalGzippedSize}`);
    console.log(`Compression Ratio: ${analysis.summary.formatted.compressionRatio}%`);
    console.log(`Asset Count: ${analysis.summary.assetCount}`);
    
    if (comparison) {
      console.log('\n📈 Changes from previous build:');
      const sizeDiff = comparison.totalSizeDiff;
      const gzippedDiff = comparison.gzippedSizeDiff;
      
      console.log(`Total Size: ${sizeDiff >= 0 ? '+' : ''}${formatBytes(sizeDiff)}`);
      console.log(`Gzipped Size: ${gzippedDiff >= 0 ? '+' : ''}${formatBytes(gzippedDiff)}`);
    }
    
    if (analysis.summary.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      analysis.summary.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    if (analysis.summary.errors.length > 0) {
      console.log('\n❌ Errors:');
      analysis.summary.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('\n📄 Reports generated:');
    console.log(`  JSON: ${paths.latestJsonPath}`);
    console.log(`  HTML: ${paths.latestHtmlPath}`);
    
    // Exit with error code if there are budget violations
    if (analysis.summary.errors.length > 0) {
      console.log('\n💥 Build failed due to bundle size violations!');
      process.exit(1);
    }
    
    console.log('\n✅ Bundle analysis completed successfully!');
    
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundles,
  saveAnalysis,
  compareWithPrevious,
  BUNDLE_BUDGETS
}; 