---
sidebar_position: 2
---

# Performance Dashboard Implementation

This document provides an overview of how the live performance dashboard for FitCopilot was implemented.

## Architecture

The performance dashboard is built using the following components:

1. **Lighthouse CI**: Automated performance testing on every push and PR
2. **GitHub Actions**: Workflow automation for collecting and storing metrics
3. **Docusaurus**: Documentation site with React components for visualization
4. **Chart.js**: JavaScript library for rendering metrics charts

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  GitHub Action  │──▶  │  Lighthouse CI  │──▶  │  JSON Metrics   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Chart.js      │◀──  │ React Component │◀──  │  Static Files   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Implementation Details

### 1. Lighthouse CI Integration

We've configured Lighthouse CI to run on each push to the `main` branch and on pull requests using GitHub Actions. The workflow is defined in `.github/workflows/lighthouse.yml`.

Key features:
- Runs on multiple pages (homepage, documentation, components)
- Tests against performance budgets defined in `.lighthouserc.json`
- Generates detailed reports in JSON format

### 2. Metrics Collection Pipeline

The GitHub Action performs the following steps:
1. Checks out the repository
2. Builds the project
3. Runs Lighthouse CI
4. Extracts key metrics from Lighthouse reports
5. Saves metrics to JSON files in the `documentation-site/static/metrics/data/` directory
6. Updates the historical trends data

### 3. Visualization Components

We've implemented a React component (`MetricsChart.tsx`) that:
- Dynamically loads Chart.js at runtime
- Fetches metrics data from JSON files
- Renders interactive line or bar charts
- Formats values appropriately (seconds, milliseconds, scores)
- Supports historical trend visualization

### 4. MDX Integration

The performance dashboard page (`metrics/performance/overview.md`) uses MDX to:
- Import the React chart component
- Render multiple charts for different metrics
- Display current metrics in a card-based layout
- Provide contextual information about performance targets

## Performance Budgets

We've established the following performance budgets:

| Metric | Budget |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Largest Contentful Paint (LCP) | ≤ 2.5s |
| First Input Delay (FID) | ≤ 100ms |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |
| Total Blocking Time (TBT) | ≤ 200ms |

These budgets are enforced by Lighthouse CI and visualized in the dashboard.

## Future Improvements

Planned enhancements to the performance dashboard include:

1. **Real User Monitoring (RUM)** - Collect performance data from actual users
2. **PR-Specific Performance Impact** - Show performance impact of each PR
3. **Automated Notifications** - Alert when performance degrades
4. **Detailed Diagnostics** - Provide specific recommendations for improvements
5. **Component-Level Metrics** - Measure performance of individual components

## Usage

Developers can access the performance dashboard in several ways:

1. **Live Dashboard**: Visit the [live performance dashboard](https://fitcopilot.github.io/fitcopilot-theme/metrics/performance/overview)
2. **Local Development**: Run `npm run docs` to view the dashboard locally
3. **Pull Requests**: Check Lighthouse CI reports in PR comments
4. **Artifacts**: Download detailed reports from GitHub Actions artifacts 