#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const HISTORY_LIMIT = 30; // Keep last 30 entries
const METRICS_DIR = path.join(process.cwd(), 'src/data');
const METRICS_FILE = path.join(METRICS_DIR, 'performance-metrics.json');
const HISTORY_FILE = path.join(METRICS_DIR, 'performance-history.json');

// Ensure data directory exists
if (!fs.existsSync(METRICS_DIR)) {
    fs.mkdirSync(METRICS_DIR, { recursive: true });
}

try {
    // Get the latest Lighthouse results
    const latestResults = JSON.parse(
        fs.readFileSync('.lighthouseci/manifest.json', 'utf8')
    );

    if (!latestResults || !latestResults.length) {
        console.error('No Lighthouse results found');
        process.exit(1);
    }

    // Get the latest run details
    const latestRun = latestResults[0];
    const reportPath = path.join('.lighthouseci', latestRun.jsonPath);
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    // Extract key metrics
    const metrics = {
        timestamp: new Date().toISOString(),
        url: reportData.requestedUrl,
        commitHash: execSync('git rev-parse --short HEAD').toString().trim(),
        performance: reportData.categories.performance.score * 100,
        accessibility: reportData.categories.accessibility.score * 100,
        bestPractices: reportData.categories['best-practices'].score * 100,
        seo: reportData.categories.seo.score * 100,
        metrics: {
            firstContentfulPaint: reportData.audits['first-contentful-paint'].numericValue,
            largestContentfulPaint: reportData.audits['largest-contentful-paint'].numericValue,
            totalBlockingTime: reportData.audits['total-blocking-time'].numericValue,
            cumulativeLayoutShift: reportData.audits['cumulative-layout-shift'].numericValue
        }
    };

    // Save current metrics
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
    console.log('Updated current metrics');

    // Update historical data
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
        history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }

    // Add new entry and limit history size
    history.unshift(metrics);
    if (history.length > HISTORY_LIMIT) {
        history = history.slice(0, HISTORY_LIMIT);
    }

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    console.log(`Updated history (keeping last ${HISTORY_LIMIT} entries)`);

} catch (error) {
    console.error('Error extracting metrics:', error);
    process.exit(1);
} 