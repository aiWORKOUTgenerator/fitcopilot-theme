#!/usr/bin/env node

/**
 * Quality Metrics Generator
 * 
 * This script generates quality metrics for the FitCopilot theme,
 * including code quality metrics, performance metrics, and bundle analysis.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SOURCE_DIR = path.resolve(__dirname, '../../src');
const OUTPUT_DIR = path.resolve(__dirname, '../metrics');
const DATE = new Date().toISOString().split('T')[0];

// Create necessary directories
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDirectoryExists(path.join(OUTPUT_DIR, 'data'));

// Generate bundle size metrics
const generateBundleMetrics = () => {
    console.log('Generating bundle size metrics...');

    try {
        // Run webpack with the --json flag to get bundle stats
        const stats = execSync('npx webpack --mode production --json', { encoding: 'utf8' });
        const statsJson = JSON.parse(stats);

        // Extract the main chunk size
        const mainBundle = statsJson.assets.find(asset => asset.name.includes('main'));
        const mainBundleSize = mainBundle ? mainBundle.size : 0;

        // Calculate total bundle size
        const totalSize = statsJson.assets.reduce((total, asset) => total + asset.size, 0);

        // Create bundle metrics object
        const bundleMetrics = {
            date: DATE,
            mainBundleSize: mainBundleSize,
            totalBundleSize: totalSize,
            assets: statsJson.assets.map(asset => ({
                name: asset.name,
                size: asset.size
            }))
        };

        // Write metrics to file
        const outputFile = path.join(OUTPUT_DIR, 'data', `bundle-metrics-${DATE}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(bundleMetrics, null, 2));

        console.log(`Bundle metrics written to ${outputFile}`);
        return bundleMetrics;
    } catch (error) {
        console.error('Error generating bundle metrics:', error);
        return null;
    }
};

// Generate code quality metrics
const generateCodeQualityMetrics = () => {
    console.log('Generating code quality metrics...');

    try {
        // Count files by type
        const countFilesByExtension = (dir, extension) => {
            const files = fs.readdirSync(dir, { withFileTypes: true });
            let count = 0;

            for (const file of files) {
                if (file.isDirectory()) {
                    count += countFilesByExtension(path.join(dir, file.name), extension);
                } else if (file.name.endsWith(extension)) {
                    count++;
                }
            }

            return count;
        };

        const tsFiles = countFilesByExtension(SOURCE_DIR, '.ts');
        const tsxFiles = countFilesByExtension(SOURCE_DIR, '.tsx');
        const scssFiles = countFilesByExtension(SOURCE_DIR, '.scss');

        // Calculate lines of code (simplified approach)
        const countLinesOfCode = (dir, extensions) => {
            const files = fs.readdirSync(dir, { withFileTypes: true });
            let count = 0;

            for (const file of files) {
                if (file.isDirectory()) {
                    count += countLinesOfCode(path.join(dir, file.name), extensions);
                } else if (extensions.some(ext => file.name.endsWith(ext))) {
                    const content = fs.readFileSync(path.join(dir, file.name), 'utf8');
                    count += content.split('\n').length;
                }
            }

            return count;
        };

        const linesOfCode = countLinesOfCode(SOURCE_DIR, ['.ts', '.tsx', '.scss']);

        // Create code quality metrics object
        const codeQualityMetrics = {
            date: DATE,
            fileCount: {
                ts: tsFiles,
                tsx: tsxFiles,
                scss: scssFiles,
                total: tsFiles + tsxFiles + scssFiles
            },
            linesOfCode: linesOfCode
        };

        // Write metrics to file
        const outputFile = path.join(OUTPUT_DIR, 'data', `code-quality-metrics-${DATE}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(codeQualityMetrics, null, 2));

        console.log(`Code quality metrics written to ${outputFile}`);
        return codeQualityMetrics;
    } catch (error) {
        console.error('Error generating code quality metrics:', error);
        return null;
    }
};

// Generate metrics dashboard
const generateMetricsDashboard = (bundleMetrics, codeQualityMetrics) => {
    console.log('Generating metrics dashboard...');

    try {
        // Create a summary of metrics
        const summary = {
            date: DATE,
            bundle: bundleMetrics,
            codeQuality: codeQualityMetrics
        };

        // Write summary to file
        const summaryFile = path.join(OUTPUT_DIR, 'data', `metrics-summary-${DATE}.json`);
        fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

        // Update the latest metrics file (used by the dashboard)
        const latestFile = path.join(OUTPUT_DIR, 'data', 'latest-metrics.json');
        fs.writeFileSync(latestFile, JSON.stringify(summary, null, 2));

        console.log(`Metrics dashboard data written to ${summaryFile}`);

        // Create visualizations for the dashboard
        createMetricsVisualization(summary);
    } catch (error) {
        console.error('Error generating metrics dashboard:', error);
    }
};

// Create visualizations for the metrics dashboard
const createMetricsVisualization = (metrics) => {
    console.log('Creating metrics visualizations...');

    try {
        // Get historical metrics
        const getHistoricalMetrics = () => {
            const dataDir = path.join(OUTPUT_DIR, 'data');
            const files = fs.readdirSync(dataDir);
            const summaryFiles = files.filter(file => file.startsWith('metrics-summary-'));

            return summaryFiles
                .map(file => {
                    try {
                        const filePath = path.join(dataDir, file);
                        const content = fs.readFileSync(filePath, 'utf8');
                        return JSON.parse(content);
                    } catch (e) {
                        return null;
                    }
                })
                .filter(Boolean)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
        };

        const historicalMetrics = getHistoricalMetrics();

        // Create bundle size trend data
        const bundleSizeTrend = historicalMetrics.map(metric => ({
            date: metric.date,
            mainBundleSize: metric.bundle?.mainBundleSize || 0,
            totalBundleSize: metric.bundle?.totalBundleSize || 0
        }));

        // Create code quality trend data
        const codeQualityTrend = historicalMetrics.map(metric => ({
            date: metric.date,
            totalFiles: metric.codeQuality?.fileCount?.total || 0,
            linesOfCode: metric.codeQuality?.linesOfCode || 0
        }));

        // Write trend data to files for the dashboard
        const bundleTrendFile = path.join(OUTPUT_DIR, 'data', 'bundle-size-trend.json');
        fs.writeFileSync(bundleTrendFile, JSON.stringify(bundleSizeTrend, null, 2));

        const codeQualityTrendFile = path.join(OUTPUT_DIR, 'data', 'code-quality-trend.json');
        fs.writeFileSync(codeQualityTrendFile, JSON.stringify(codeQualityTrend, null, 2));

        console.log('Metrics visualizations created successfully');
    } catch (error) {
        console.error('Error creating metrics visualizations:', error);
    }
};

// Run the metric generators
const bundleMetrics = generateBundleMetrics();
const codeQualityMetrics = generateCodeQualityMetrics();
generateMetricsDashboard(bundleMetrics, codeQualityMetrics);

console.log('Metrics generation complete!'); 