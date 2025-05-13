# ESLint Warning Tracking Process

This document outlines the process for tracking and reviewing progress in eliminating ESLint warnings following our standardized type patterns.

## Weekly Warning Report Process

### 1. Generate Baseline Report

At the start of the remediation effort, generate a baseline report:

```bash
# Generate baseline report
npm run warning-report -- --output=reports/warning-baseline.json
```

This baseline will serve as the reference point for measuring progress.

### 2. Weekly Review Steps

Every week, follow these steps:

1. **Generate current warning report**:
   ```bash
   # Generate weekly report
   npm run warning-report -- --output=reports/warnings-$(date +%Y-%m-%d).json
   ```

2. **Compare with baseline**:
   ```bash
   # Create a comparison script to analyze warning reduction
   node scripts/compare-warning-reports.js \
     reports/warning-baseline.json \
     reports/warnings-$(date +%Y-%m-%d).json
   ```

3. **Generate trend chart**:
   ```bash
   # Generate a trend chart of warning counts over time
   npm run generate-warning-chart
   ```

4. **Review findings in team meeting**:
   - Present current warning counts
   - Highlight top remaining warning categories
   - Identify components with most warnings
   - Recognize team members who remediated the most warnings

### 3. Update Component Priority List

Based on the current warning report:

1. Update the component priority list in `docs/component-priority.md`
2. Assign components to team members for the upcoming week
3. Set specific targets for warning reduction

## Tracking Script

Create a script to track warning reduction over time:

```javascript
// scripts/compare-warning-reports.js
const fs = require('fs');
const path = require('path');

// Load reports
const baselineReport = require(path.resolve(process.argv[2]));
const currentReport = require(path.resolve(process.argv[3]));

// Calculate overall reduction
const totalReduction = baselineReport.totalWarnings - currentReport.totalWarnings;
const percentReduction = ((totalReduction / baselineReport.totalWarnings) * 100).toFixed(2);

console.log(`\nWarning Reduction Summary`);
console.log(`========================`);
console.log(`Baseline warnings: ${baselineReport.totalWarnings}`);
console.log(`Current warnings:  ${currentReport.totalWarnings}`);
console.log(`Reduction:         ${totalReduction} (${percentReduction}%)`);

// Compare rule-specific reductions
console.log(`\nTop Warning Reductions by Rule:`);
console.log(`============================`);

// Create map of baseline rules
const baselineRuleMap = baselineReport.topRules.reduce((acc, { rule, count }) => {
    acc[rule] = count;
    return acc;
}, {});

// Create map of current rules
const currentRuleMap = currentReport.topRules.reduce((acc, { rule, count }) => {
    acc[rule] = count;
    return acc;
}, {});

// Calculate reductions by rule
const reductionsByRule = [];
for (const rule in baselineRuleMap) {
    const baselineCount = baselineRuleMap[rule] || 0;
    const currentCount = currentRuleMap[rule] || 0;
    const reduction = baselineCount - currentCount;
    const rulePercentReduction = ((reduction / baselineCount) * 100).toFixed(2);
    
    reductionsByRule.push({
        rule,
        reduction,
        percentReduction: rulePercentReduction,
        baselineCount,
        currentCount
    });
}

// Sort by highest reduction
reductionsByRule
    .sort((a, b) => b.reduction - a.reduction)
    .slice(0, 10)
    .forEach(({ rule, reduction, percentReduction, baselineCount, currentCount }) => {
        console.log(`${rule}:`);
        console.log(`  Baseline: ${baselineCount}, Current: ${currentCount}`);
        console.log(`  Reduction: ${reduction} (${percentReduction}%)`);
    });

// Generate Markdown report
const generateMarkdownReport = () => {
    const date = new Date().toISOString().split('T')[0];
    let markdown = `# Warning Reduction Report - ${date}\n\n`;
    
    markdown += `## Summary\n\n`;
    markdown += `- Baseline warnings: **${baselineReport.totalWarnings}**\n`;
    markdown += `- Current warnings: **${currentReport.totalWarnings}**\n`;
    markdown += `- Reduction: **${totalReduction}** (${percentReduction}%)\n\n`;
    
    markdown += `## Top Warning Reductions by Rule\n\n`;
    markdown += `| Rule | Baseline | Current | Reduction | % |\n`;
    markdown += `|------|----------|---------|-----------|---|\n`;
    
    reductionsByRule
        .sort((a, b) => b.reduction - a.reduction)
        .slice(0, 10)
        .forEach(({ rule, reduction, percentReduction, baselineCount, currentCount }) => {
            markdown += `| \`${rule}\` | ${baselineCount} | ${currentCount} | ${reduction} | ${percentReduction}% |\n`;
        });
    
    markdown += `\n## Remaining Top Warning Rules\n\n`;
    markdown += `| Rule | Count | % of Total |\n`;
    markdown += `|------|-------|------------|\n`;
    
    currentReport.topRules
        .slice(0, 10)
        .forEach(({ rule, count }) => {
            const percent = ((count / currentReport.totalWarnings) * 100).toFixed(1);
            markdown += `| \`${rule}\` | ${count} | ${percent}% |\n`;
        });
    
    markdown += `\n## Remaining Top Warning Files\n\n`;
    markdown += `| File | Count |\n`;
    markdown += `|------|-------|\n`;
    
    currentReport.topFiles
        .slice(0, 10)
        .forEach(({ file, count }) => {
            markdown += `| \`${file}\` | ${count} |\n`;
        });
    
    return markdown;
};

// Save markdown report
const markdownReport = generateMarkdownReport();
const reportPath = `reports/warning-reduction-${new Date().toISOString().split('T')[0]}.md`;
fs.writeFileSync(reportPath, markdownReport);
console.log(`\nDetailed report saved to ${reportPath}`);
```

## CI/CD Integration

### 1. Pull Request Warning Check

Add a GitHub Action workflow to check warnings on PRs:

```yaml
# .github/workflows/eslint-warnings.yml
name: ESLint Warnings Check

on:
  pull_request:
    branches: [ main ]
    paths:
      - 'src/**/*.{ts,tsx}'

jobs:
  check-warnings:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate warning report
        run: npm run warning-report -- --output=pr-warnings.json
        
      - name: Check warning count
        run: |
          CURRENT_WARNINGS=$(node -e "console.log(require('./pr-warnings.json').totalWarnings)")
          echo "Current warning count: $CURRENT_WARNINGS"
          
          # Compare with baseline
          curl -s ${{ github.event.repository.html_url }}/raw/main/reports/warning-baseline.json > baseline.json
          BASELINE_WARNINGS=$(node -e "console.log(require('./baseline.json').totalWarnings)")
          echo "Baseline warning count: $BASELINE_WARNINGS"
          
          if [ $CURRENT_WARNINGS -gt $BASELINE_WARNINGS ]; then
            echo "::error::Warning count increased! ($CURRENT_WARNINGS > $BASELINE_WARNINGS)"
            exit 1
          fi
```

### 2. Weekly Warning Trend Report

Add a GitHub Action to generate weekly reports:

```yaml
# .github/workflows/weekly-warning-report.yml
name: Weekly Warning Report

on:
  schedule:
    - cron: '0 10 * * 1' # Every Monday at 10:00 UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  generate-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate warning report
        run: npm run warning-report -- --output=reports/warnings-$(date +%Y-%m-%d).json
        
      - name: Generate comparison report
        run: node scripts/compare-warning-reports.js reports/warning-baseline.json reports/warnings-$(date +%Y-%m-%d).json
        
      - name: Generate warning trend chart
        run: npm run generate-warning-chart
        
      - name: Commit and push report
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add reports/
          git commit -m "Add weekly warning report $(date +%Y-%m-%d)"
          git push
```

## Weekly Review Template

Use this template for weekly warning review meetings:

```markdown
# ESLint Warning Review - [Date]

## Warning Metrics
- Total warnings: [Count]
- Change from last week: [Count] ([Percentage]%)
- Progress toward zero warnings: [Percentage]%

## Top 5 Rules This Week
1. [Rule Name] - [Count] warnings
2. [Rule Name] - [Count] warnings
3. [Rule Name] - [Count] warnings
4. [Rule Name] - [Count] warnings
5. [Rule Name] - [Count] warnings

## Top 5 Components to Address
1. [Component Name] - [Count] warnings
2. [Component Name] - [Count] warnings
3. [Component Name] - [Count] warnings
4. [Component Name] - [Count] warnings
5. [Component Name] - [Count] warnings

## Action Items
- [Team Member]: Address warnings in [Component]
- [Team Member]: Address warnings in [Component]
- [Team Member]: Create type definitions for [Feature]
- [Team Member]: Refactor [Component] with type guards

## Next Week's Goals
- Reduce total warnings by [Number/Percentage]
- Complete remediation for [Component/Feature]
- Address all [Rule] warnings
```

By following this process, we'll systematically track our progress in reducing ESLint warnings, maintain accountability, and ensure consistent application of our standardized type patterns. 