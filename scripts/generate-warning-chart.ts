#!/usr/bin/env ts-node

/**
 * Warning Trend Chart Generator
 * 
 * This script generates a visual chart of ESLint warning counts over time.
 * It reads all reports in the reports directory and creates an SVG chart.
 * 
 * Usage:
 * npm run generate-warning-chart
 */

import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

interface WarningReport {
  generatedAt: string;
  totalWarnings: number;
  topRules: { rule: string; count: number }[];
}

interface ComparisonReport {
  date: string;
  reduction: {
    absolute: number;
    percentage: number;
  };
  current: {
    totalWarnings: number;
  };
}

interface DataPoint {
  date: Date;
  warnings: number;
  rules?: Record<string, number>;
}

// Find all report files
const findReportFiles = (): string[] => {
  const reportsDir = path.resolve('reports');

  if (!fs.existsSync(reportsDir)) {
    console.log('Creating reports directory...');
    fs.mkdirSync(reportsDir, { recursive: true });
    return [];
  }

  const warningReportPattern = path.join(reportsDir, 'warnings-*.json');
  const comparisonReportPattern = path.join(reportsDir, 'warning-reduction-*.json');

  const warningReports = glob.sync(warningReportPattern);
  const comparisonReports = glob.sync(comparisonReportPattern);

  return [...warningReports, ...comparisonReports];
};

// Parse reports into data points
const parseReports = (filePaths: string[]): DataPoint[] => {
  const dataPoints: DataPoint[] = [];

  filePaths.forEach(filePath => {
    try {
      const fileName = path.basename(filePath);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const report = JSON.parse(fileContent);

      let dataPoint: DataPoint | null = null;

      // Parse warning report
      if (fileName.startsWith('warnings-')) {
        const warningReport = report as WarningReport;
        const date = new Date(warningReport.generatedAt);

        dataPoint = {
          date,
          warnings: warningReport.totalWarnings,
          rules: warningReport.topRules.reduce((acc, { rule, count }) => {
            acc[rule] = count;
            return acc;
          }, {} as Record<string, number>)
        };
      }

      // Parse comparison report
      else if (fileName.startsWith('warning-reduction-')) {
        const comparisonReport = report as ComparisonReport;
        const date = new Date(comparisonReport.date);

        dataPoint = {
          date,
          warnings: comparisonReport.current.totalWarnings
        };
      }

      if (dataPoint) {
        dataPoints.push(dataPoint);
      }
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
    }
  });

  // Sort by date
  return dataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Generate SVG chart
const generateSVGChart = (dataPoints: DataPoint[]): string => {
  if (dataPoints.length === 0) {
    return `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
      <text x="400" y="200" text-anchor="middle" font-family="Arial" font-size="20">No data available</text>
    </svg>`;
  }

  const width = 800;
  const height = 400;
  const padding = 50;

  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  // Find max warning count
  const maxWarnings = Math.max(...dataPoints.map(d => d.warnings));
  // Round max warnings up to nearest 100
  const yMax = Math.ceil(maxWarnings / 100) * 100;

  // Generate X axis points
  const xStep = chartWidth / (dataPoints.length - 1 || 1);

  // Generate SVG path for the warning line
  const getLine = (): string => {
    let path = `M ${padding},${height - padding - (dataPoints[0].warnings / yMax * chartHeight)}`;

    for (let i = 1; i < dataPoints.length; i++) {
      const x = padding + (i * xStep);
      const y = height - padding - (dataPoints[i].warnings / yMax * chartHeight);
      path += ` L ${x},${y}`;
    }

    return path;
  };

  // Create date labels
  const dateLabels = dataPoints.map((point, i) => {
    const x = padding + (i * xStep);
    const y = height - (padding / 2);
    const date = point.date.toISOString().slice(0, 10);
    return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial" font-size="10" transform="rotate(-45 ${x},${y})">${date}</text>`;
  }).join('\n    ');

  // Create Y axis labels
  const yLabels = [];
  for (let i = 0; i <= 5; i++) {
    const value = Math.round(yMax * (i / 5));
    const y = height - padding - (chartHeight * (i / 5));
    yLabels.push(`<text x="${padding - 10}" y="${y}" text-anchor="end" font-family="Arial" font-size="12">${value}</text>`);
  }

  // Create data points with tooltips
  const dataPointCircles = dataPoints.map((point, i) => {
    const x = padding + (i * xStep);
    const y = height - padding - (point.warnings / yMax * chartHeight);
    const date = point.date.toISOString().slice(0, 10);
    return `<circle cx="${x}" cy="${y}" r="4" fill="#2c3e50">
      <title>Date: ${date}
Warnings: ${point.warnings}</title>
    </circle>`;
  }).join('\n    ');

  // Build SVG
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: Arial, sans-serif; }
    .title { font-size: 20px; font-weight: bold; }
    .gridline { stroke: #e0e0e0; stroke-width: 1; }
    .axis { stroke: #333; stroke-width: 2; }
    .line { stroke: #2980b9; stroke-width: 3; fill: none; }
    .area { fill: #3498db; opacity: 0.2; }
  </style>
  
  <!-- Title -->
  <text x="${width / 2}" y="${padding / 2}" class="title" text-anchor="middle">ESLint Warning Count Over Time</text>
  
  <!-- Grid Lines -->
  ${Array.from({ length: 6 }, (_, i) => {
    const y = height - padding - (chartHeight * (i / 5));
    return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" class="gridline" />`;
  }).join('\n  ')}
  
  <!-- Axes -->
  <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" class="axis" />
  <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" class="axis" />
  
  <!-- Warning Area -->
  <path d="${getLine()} L ${padding + ((dataPoints.length - 1) * xStep)},${height - padding} L ${padding},${height - padding} Z" class="area" />
  
  <!-- Warning Line -->
  <path d="${getLine()}" class="line" />
  
  <!-- Data Points -->
  ${dataPointCircles}
  
  <!-- X Axis Labels -->
  ${dateLabels}
  
  <!-- Y Axis Labels -->
  ${yLabels.join('\n  ')}
  
  <!-- Axis Titles -->
  <text x="${width / 2}" y="${height - 10}" text-anchor="middle" font-size="14">Date</text>
  <text x="${padding / 4}" y="${height / 2}" text-anchor="middle" font-size="14" transform="rotate(-90 ${padding / 4},${height / 2})">Warning Count</text>
</svg>`;
};

const generateMarkdownReport = (dataPoints: DataPoint[]): string => {
  if (dataPoints.length === 0) {
    return '# ESLint Warning Trend\n\nNo data available yet. Run `npm run warning-report` to generate warning reports.';
  }

  // Sort data points by date (newest first)
  const sortedPoints = [...dataPoints].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Calculate changes
  let markdown = '# ESLint Warning Trend\n\n';
  markdown += '## Summary\n\n';

  if (sortedPoints.length >= 1) {
    markdown += `**Current warning count**: ${sortedPoints[0].warnings}\n\n`;
  }

  if (sortedPoints.length >= 2) {
    const current = sortedPoints[0];
    const previous = sortedPoints[1];
    const change = current.warnings - previous.warnings;
    const percentChange = ((change / previous.warnings) * 100).toFixed(1);

    markdown += `**Change from last report**: ${change > 0 ? '+' : ''}${change} (${percentChange}%)\n\n`;
  }

  if (sortedPoints.length >= 3) {
    // Get first report
    const first = sortedPoints[sortedPoints.length - 1];
    const current = sortedPoints[0];
    const totalChange = current.warnings - first.warnings;
    const percentChange = ((totalChange / first.warnings) * 100).toFixed(1);

    markdown += `**Total progress since first report**: ${totalChange > 0 ? '+' : ''}${totalChange} (${percentChange}%)\n\n`;
  }

  // Add trend data
  markdown += '## Trend Data\n\n';
  markdown += '| Date | Warnings | Change |\n';
  markdown += '|------|----------|--------|\n';

  sortedPoints.forEach((point, i) => {
    const date = point.date.toISOString().slice(0, 10);
    let change = '';

    if (i < sortedPoints.length - 1) {
      const diff = point.warnings - sortedPoints[i + 1].warnings;
      const diffPercent = ((diff / sortedPoints[i + 1].warnings) * 100).toFixed(1);
      change = `${diff > 0 ? '+' : ''}${diff} (${diffPercent}%)`;
    }

    markdown += `| ${date} | ${point.warnings} | ${change} |\n`;
  });

  // Include chart image reference
  markdown += '\n## Trend Chart\n\n';
  markdown += '![ESLint Warning Trend](./eslint-warning-trend.svg)\n';

  return markdown;
};

// Main execution
const main = async () => {
  try {
    // Create reports directory if it doesn't exist
    const reportsDir = path.resolve('reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Find and parse reports
    const reportFiles = findReportFiles();

    if (reportFiles.length === 0) {
      console.log('No warning reports found. Generate reports with npm run warning-report first.');
      // Create empty baseline file if none exists
      const baselinePath = path.join(reportsDir, 'warning-baseline.json');
      if (!fs.existsSync(baselinePath)) {
        const emptyBaseline = {
          generatedAt: new Date().toISOString(),
          totalWarnings: 0,
          topRules: [],
          topFiles: [],
          topDirectories: []
        };
        fs.writeFileSync(baselinePath, JSON.stringify(emptyBaseline, null, 2));
        console.log(`Created empty baseline file at ${baselinePath}`);
      }
      return;
    }

    console.log(`Found ${reportFiles.length} report files.`);
    const dataPoints = parseReports(reportFiles);
    console.log(`Parsed ${dataPoints.length} data points.`);

    // Generate SVG chart
    const svgChart = generateSVGChart(dataPoints);
    const svgPath = path.join(reportsDir, 'eslint-warning-trend.svg');
    fs.writeFileSync(svgPath, svgChart);
    console.log(`SVG chart saved to ${svgPath}`);

    // Generate markdown report
    const markdown = generateMarkdownReport(dataPoints);
    const markdownPath = path.join(reportsDir, 'eslint-warning-trend.md');
    fs.writeFileSync(markdownPath, markdown);
    console.log(`Markdown report saved to ${markdownPath}`);

  } catch (error) {
    console.error('Error generating warning trend chart:', error);
    process.exit(1);
  }
};

main(); 