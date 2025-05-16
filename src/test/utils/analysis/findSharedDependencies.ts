import fs from 'fs';
import logger from '../../../utils/logger';
import { FailureCategories } from './categorizeFailures';

export interface DependencyNode {
    name: string;
    type: 'component' | 'hook' | 'context' | 'utility' | 'service' | 'other';
    usageCount: number;
    failingTests: string[];
}

export interface DependencyMap {
    highImpact: DependencyNode[];
    byFeatureArea: Record<string, DependencyNode[]>;
}

// Patterns to identify dependency types
const DEPENDENCY_PATTERNS = [
  { type: 'component', pattern: /import\s+(\{[^}]*\}|\w+)\s+from\s+['"](.+\/components\/[^'"]+)['"]/g },
  { type: 'hook', pattern: /import\s+(\{[^}]*\}|\w+)\s+from\s+['"](.+\/hooks\/[^'"]+)['"]/g },
  { type: 'context', pattern: /import\s+(\{[^}]*\}|\w+)\s+from\s+['"](.+\/contexts?\/[^'"]+)['"]/g },
  { type: 'utility', pattern: /import\s+(\{[^}]*\}|\w+)\s+from\s+['"](.+\/utils?\/[^'"]+)['"]/g },
  { type: 'service', pattern: /import\s+(\{[^}]*\}|\w+)\s+from\s+['"](.+\/services?\/[^'"]+)['"]/g },
  { type: 'other', pattern: /import\s+(\{[^}]*\}|\w+)\s+from\s+['"]((?!node_modules)[^'"]+)['"]/g },
];

// Default React Testing Library imports to exclude
const EXCLUDED_IMPORTS = [
  '@testing-library/react',
  '@testing-library/jest-dom',
  '@testing-library/user-event',
  'jest',
  'react',
  'react-dom',
];

/**
 * Finds shared dependencies across failing tests
 * @param categories Categorized test failures
 * @returns Map of dependencies and their impact
 */
export function findSharedDependencies(categories: FailureCategories): DependencyMap {
  const allFailingPaths = getAllFailingPaths(categories);
  const dependencies: Record<string, DependencyNode> = {};

  // Process each failing test file
  allFailingPaths.forEach(testPath => {
    try {
      const content = fs.readFileSync(testPath, 'utf8');
      const imports = extractImports(content);

      // Add each import to the dependency map
      imports.forEach(({ _name, path: importPath, type }) => {
        // Skip excluded imports
        if (EXCLUDED_IMPORTS.some(excluded => importPath.includes(excluded))) {
          return;
        }

        const key = `${type}:${importPath}`;
        if (!dependencies[key]) {
          dependencies[key] = {
            name: importPath,
            type,
            usageCount: 0,
            failingTests: []
          };
        }

        dependencies[key].usageCount++;
        if (!dependencies[key].failingTests.includes(testPath)) {
          dependencies[key].failingTests.push(testPath);
        }
      });
    } catch (error) {
      logger.error(`Error processing ${testPath}:`, error);
    }
  });

  // Sort dependencies by impact
  const sortedDependencies = Object.values(dependencies)
    .sort((a, b) => b.usageCount - a.usageCount);

  // Group by feature area
  const byFeatureArea: Record<string, DependencyNode[]> = {};

  Object.entries(categories.byFeatureArea).forEach(([area, data]) => {
    // Find dependencies used in this feature area's failing tests
    const areaDependencies = sortedDependencies.filter(dep =>
      dep.failingTests.some(testPath => data.testPaths.includes(testPath))
    );

    byFeatureArea[area] = areaDependencies;
  });

  // Return high impact dependencies (used in multiple tests)
  return {
    highImpact: sortedDependencies.filter(dep => dep.usageCount > 1),
    byFeatureArea
  };
}

/**
 * Get all failing test paths from the categories
 */
function getAllFailingPaths(categories: FailureCategories): string[] {
  const paths = new Set<string>();

  Object.values(categories.byErrorType).forEach(category => {
    category.testPaths.forEach(path => paths.add(path));
  });

  return Array.from(paths);
}

/**
 * Extract imports from file content
 */
function extractImports(content: string): Array<{ name: string, path: string, type: DependencyNode['type'] }> {
  const imports: Array<{ name: string, path: string, type: DependencyNode['type'] }> = [];

  DEPENDENCY_PATTERNS.forEach(({ type, pattern }) => {
    let match;
    // Reset the regex before use
    pattern.lastIndex = 0;

    while ((match = pattern.exec(content)) !== null) {
      const importNames = match[1];
      const importPath = match[2];

      imports.push({
        name: importNames,
        path: importPath,
        type
      });
    }
  });

  return imports;
}

/**
 * Generate a dependency report
 */
export function generateDependencyReport(dependencyMap: DependencyMap): string {
  let report = '# Shared Dependencies Analysis\n\n';

  report += '## High Impact Dependencies\n\n';
  report += 'These dependencies are used across multiple failing tests and may be contributing to failures:\n\n';

  if (dependencyMap.highImpact.length === 0) {
    report += '*No high impact dependencies found*\n\n';
  } else {
    dependencyMap.highImpact
      .slice(0, 10) // Top 10 for readability
      .forEach(dep => {
        report += `### ${dep.name} (${dep.type})\n\n`;
        report += `- **Used in**: ${dep.usageCount} failing tests\n`;
        report += `- **Test paths**: ${dep.failingTests.length > 3
          ? `${dep.failingTests.slice(0, 3).join(', ')} and ${dep.failingTests.length - 3} more`
          : dep.failingTests.join(', ')}\n\n`;
      });
  }

  report += '## Dependencies by Feature Area\n\n';

  Object.entries(dependencyMap.byFeatureArea).forEach(([area, deps]) => {
    report += `### ${area}\n\n`;

    if (deps.length === 0) {
      report += '*No significant dependencies found*\n\n';
    } else {
      deps
        .filter(dep => dep.usageCount > 1) // Only show shared dependencies
        .slice(0, 5) // Top 5 for readability
        .forEach(dep => {
          report += `- **${dep.name}** (${dep.type}): Used in ${dep.usageCount} tests\n`;
        });
      report += '\n';
    }
  });

  return report;
} 