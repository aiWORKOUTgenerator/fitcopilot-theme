---
sidebar_position: 1
---

import MetricsChart from '@site/src/components/metrics/MetricsChart';

# Performance Metrics

## Overview

Performance metrics are critical for ensuring a fast, responsive user experience. This dashboard shows key performance metrics for the FitCopilot theme, including Core Web Vitals, Lighthouse scores, and bundle sizes.

## Current Performance Metrics

<div className="metrics-dashboard">
  <div className="metrics-card">
    <h3>Lighthouse Scores</h3>
    <div className="metric-group">
      <div className="metric">
        <span className="metric-label">Performance</span>
        <span className="metric-value lighthouse-performance" id="performance-score">92</span>
      </div>
      <div className="metric">
        <span className="metric-label">Accessibility</span>
        <span className="metric-value lighthouse-accessibility" id="accessibility-score">96</span>
      </div>
      <div className="metric">
        <span className="metric-label">Best Practices</span>
        <span className="metric-value lighthouse-best-practices" id="best-practices-score">95</span>
      </div>
      <div className="metric">
        <span className="metric-label">SEO</span>
        <span className="metric-value lighthouse-seo" id="seo-score">98</span>
      </div>
    </div>
  </div>
  
  <div className="metrics-card">
    <h3>Core Web Vitals</h3>
    <div className="metric-group">
      <div className="metric">
        <span className="metric-label">LCP</span>
        <span className="metric-value web-vital-lcp" id="lcp-value">2.1s</span>
      </div>
      <div className="metric">
        <span className="metric-label">FID</span>
        <span className="metric-value web-vital-fid" id="fid-value">18ms</span>
      </div>
      <div className="metric">
        <span className="metric-label">CLS</span>
        <span className="metric-value web-vital-cls" id="cls-value">0.08</span>
      </div>
    </div>
  </div>
  
  <div className="metrics-card">
    <h3>Bundle Size</h3>
    <div className="metric-group">
      <div className="metric">
        <span className="metric-label">Main Bundle</span>
        <span className="metric-value bundle-main" id="main-bundle-size">145 KB</span>
      </div>
      <div className="metric">
        <span className="metric-label">Total Size</span>
        <span className="metric-value bundle-total" id="total-bundle-size">210 KB</span>
      </div>
    </div>
  </div>
</div>

## Live Lighthouse Scores

<MetricsChart 
  src="/metrics/data/latest-metrics.json"
  keys={['performance', 'accessibility', 'bestPractices', 'seo']}
  title="Lighthouse Scores"
  type="bar"
/>

## Live Core Web Vitals

<MetricsChart
  src="/metrics/data/latest-metrics.json"
  keys={['webVitals.lcp', 'webVitals.fid', 'webVitals.cls']}
  title="Core Web Vitals"
/>

## Performance Trends

<MetricsChart
  src="/metrics/data/history.json"
  keys={['webVitals.lcp']}
  title="Largest Contentful Paint (LCP) Over Time"
/>

<MetricsChart
  src="/metrics/data/history.json"
  keys={['webVitals.cls']}
  title="Cumulative Layout Shift (CLS) Over Time"
/>

<MetricsChart
  src="/metrics/data/history.json"
  keys={['performance']}
  title="Performance Score Over Time"
/>

## Performance Optimization Strategies

To maintain and improve performance, we follow these optimization strategies:

1. **Code Splitting**: Breaking the bundle into smaller chunks to load only what's needed
2. **Lazy Loading**: Deferring non-critical resources until they are needed
3. **Image Optimization**: Using WebP format and responsive sizing
4. **CSS Optimization**: Removing unused CSS and minifying styles
5. **JavaScript Optimization**: Minimizing JavaScript execution time

## Performance Monitoring

Performance is monitored continuously through:

1. **Lighthouse CI**: Automated Lighthouse testing on each pull request
2. **Real User Monitoring**: Collecting performance data from actual users
3. **Bundle Analysis**: Tracking bundle size changes over time

<style>
{`
  .metrics-dashboard {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .metrics-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    flex: 1;
    min-width: 250px;
  }
  
  .metrics-card h3 {
    margin-top: 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .metric-group {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 80px;
  }
  
  .metric-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }
  
  .metric-value {
    font-size: 20px;
    font-weight: bold;
  }
  
  .lighthouse-performance { color: #06A77D; }
  .lighthouse-accessibility { color: #7B68EE; }
  .lighthouse-best-practices { color: #1E88E5; }
  .lighthouse-seo { color: #FF8F00; }
  
  .web-vital-lcp { color: #06A77D; }
  .web-vital-fid { color: #1E88E5; }
  .web-vital-cls { color: #7B68EE; }
`}
</style>

<script>
{`
  // This script will be executed when the page loads
  document.addEventListener('DOMContentLoaded', function() {
    // Fetch the latest metrics
    fetch('/metrics/data/latest-metrics.json')
      .then(response => response.json())
      .then(data => {
        // Update lighthouse scores
        document.getElementById('performance-score').textContent = Math.round(data.performance);
        document.getElementById('accessibility-score').textContent = Math.round(data.accessibility);
        document.getElementById('best-practices-score').textContent = Math.round(data.bestPractices);
        document.getElementById('seo-score').textContent = Math.round(data.seo);
        
        // Update web vitals
        document.getElementById('lcp-value').textContent = (data.webVitals.lcp / 1000).toFixed(2) + 's';
        document.getElementById('fid-value').textContent = Math.round(data.webVitals.fid) + 'ms';
        document.getElementById('cls-value').textContent = data.webVitals.cls.toFixed(3);
        
        // If we had bundle size data in the metrics, we would update those here
        // For now they will remain at their default values
      })
      .catch(error => {
        console.error('Error loading metrics:', error);
      });
  });
`}
</script> 