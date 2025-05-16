import { TestResultsData } from './collectTestResults';

export interface FailureCategory {
    count: number;
    testPaths: string[];
    examples: Array<{
        testName: string;
        errorMessage: string;
        path: string;
    }>;
}

export interface FeatureArea {
    count: number;
    failures: Record<string, FailureCategory>;
    testPaths: string[];
}

export interface FailureCategories {
    byErrorType: Record<string, FailureCategory>;
    byFeatureArea: Record<string, FeatureArea>;
    total: number;
}

// Feature area patterns to categorize tests
const FEATURE_PATTERNS = [
  { name: 'UI Components', pattern: /components\/ui\//i },
  { name: 'Media', pattern: /components\/(video|image|media)/i },
  { name: 'User Profile', pattern: /(profile|user\/profile|account)/i },
  { name: 'Workout Generation', pattern: /(workout|exercise|generation)/i },
  { name: 'Analytics', pattern: /(analytics|tracking|events)/i },
  { name: 'Authentication', pattern: /(auth|login|register|signup)/i },
];

// Common error types to identify
const ERROR_PATTERNS = [
  { type: 'Element Not Found', pattern: /(TestingLibraryElementError|Unable to find|not found in the document)/i },
  { type: 'Timeout', pattern: /(timeout|timed out|async operation|waitFor)/i },
  { type: 'Context Missing', pattern: /(context|provider|consumer|useContext|is undefined|not provided)/i },
  { type: 'Event Handling', pattern: /(fireEvent|userEvent|click|change|act)/i },
  { type: 'Mock Failure', pattern: /(mock|mocked|toHaveBeenCalled|expected mock)/i },
  { type: 'Prop Type', pattern: /(Warning: Failed prop type|expected.*type|type checking)/i },
];

/**
 * Categorizes test failures by error type and feature area
 * @param results The test results data
 * @returns Categorized failure information
 */
export function categorizeFailures(results: TestResultsData): FailureCategories {
  const categories: FailureCategories = {
    byErrorType: {},
    byFeatureArea: {},
    total: 0
  };

  // Process each file with failing tests
  results.testResults.forEach(fileResult => {
    if (fileResult.numFailingTests === 0) return;

    const filePath = fileResult.testFilePath;
    const featureArea = determineFeatureArea(filePath);

    // Initialize feature area if needed
    if (featureArea && !categories.byFeatureArea[featureArea]) {
      categories.byFeatureArea[featureArea] = {
        count: 0,
        failures: {},
        testPaths: []
      };
    }

    // Process each failing test in the file
    fileResult.testResults
      .filter(test => test.status === 'failed')
      .forEach(test => {
        categories.total++;

        // Add to feature area count if applicable
        if (featureArea) {
          categories.byFeatureArea[featureArea].count++;
          if (!categories.byFeatureArea[featureArea].testPaths.includes(filePath)) {
            categories.byFeatureArea[featureArea].testPaths.push(filePath);
          }
        }

        // Determine error type
        const errorMessage = test.failureMessages.join(' ');
        const errorType = determineErrorType(errorMessage);

        // Add to error type category
        if (!categories.byErrorType[errorType]) {
          categories.byErrorType[errorType] = {
            count: 0,
            testPaths: [],
            examples: []
          };
        }

        categories.byErrorType[errorType].count++;
        if (!categories.byErrorType[errorType].testPaths.includes(filePath)) {
          categories.byErrorType[errorType].testPaths.push(filePath);
        }

        // Add example if we don't have too many yet
        if (categories.byErrorType[errorType].examples.length < 5) {
          categories.byErrorType[errorType].examples.push({
            testName: test.fullName,
            errorMessage: errorMessage.substring(0, 300) + (errorMessage.length > 300 ? '...' : ''),
            path: filePath
          });
        }

        // Also add to feature area's error tracking
        if (featureArea) {
          if (!categories.byFeatureArea[featureArea].failures[errorType]) {
            categories.byFeatureArea[featureArea].failures[errorType] = {
              count: 0,
              testPaths: [],
              examples: []
            };
          }

          categories.byFeatureArea[featureArea].failures[errorType].count++;
          if (!categories.byFeatureArea[featureArea].failures[errorType].testPaths.includes(filePath)) {
            categories.byFeatureArea[featureArea].failures[errorType].testPaths.push(filePath);
          }

          // Add example if we don't have too many yet
          if (categories.byFeatureArea[featureArea].failures[errorType].examples.length < 3) {
            categories.byFeatureArea[featureArea].failures[errorType].examples.push({
              testName: test.fullName,
              errorMessage: errorMessage.substring(0, 300) + (errorMessage.length > 300 ? '...' : ''),
              path: filePath
            });
          }
        }
      });
  });

  return categories;
}

/**
 * Determines the feature area of a test file
 */
function determineFeatureArea(testPath: string): string | null {
  for (const { name, pattern } of FEATURE_PATTERNS) {
    if (pattern.test(testPath)) {
      return name;
    }
  }
  return 'Other';
}

/**
 * Determines the error type from an error message
 */
function determineErrorType(errorMessage: string): string {
  for (const { type, pattern } of ERROR_PATTERNS) {
    if (pattern.test(errorMessage)) {
      return type;
    }
  }
  return 'Other';
}

/**
 * Formats the categories into a readable report
 */
export function generateFailureReport(categories: FailureCategories): string {
  let report = '# Test Failure Analysis Report\n\n';

  report += `## Summary\n\n`;
  report += `Total failing tests: ${categories.total}\n\n`;

  report += `## Failures by Error Type\n\n`;
  Object.entries(categories.byErrorType)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([type, data]) => {
      report += `### ${type} (${data.count})\n\n`;
      report += `Affected files: ${data.testPaths.length}\n\n`;

      if (data.examples.length > 0) {
        report += `Examples:\n`;
        data.examples.forEach(example => {
          report += `- **${example.testName}**: ${example.errorMessage}\n`;
        });
        report += '\n';
      }
    });

  report += `## Failures by Feature Area\n\n`;
  Object.entries(categories.byFeatureArea)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([area, data]) => {
      report += `### ${area} (${data.count})\n\n`;
      report += `Affected files: ${data.testPaths.length}\n\n`;

      report += `Error types:\n`;
      Object.entries(data.failures)
        .sort((a, b) => b[1].count - a[1].count)
        .forEach(([errorType, errorData]) => {
          report += `- **${errorType}**: ${errorData.count} occurrences\n`;
        });
      report += '\n';
    });

  return report;
} 