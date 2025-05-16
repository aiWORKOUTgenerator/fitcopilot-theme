import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface TestResult {
    name: string;
    status: 'passed' | 'failed';
    failureMessages: string[];
    duration: number;
    ancestorTitles: string[];
    fullName: string;
    location?: string;
}

interface TestFileResult {
    testFilePath: string;
    testResults: TestResult[];
    numFailingTests: number;
    numPassingTests: number;
}

export interface TestResultsData {
    numFailedTests: number;
    numPassedTests: number;
    testResults: TestFileResult[];
}

/**
 * Runs Jest tests and collects detailed results
 * @param testPattern Optional pattern to filter tests
 * @returns Parsed test results
 */
export function collectTestResults(testPattern?: string): TestResultsData {
  const outputPath = path.resolve(process.cwd(), 'test-results.json');

  try {
    // Run tests with detailed output
    const command = `jest ${testPattern || ''} --verbose --json --outputFile=${outputPath}`;
    logger.info(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });

    // Read and parse results
    const rawData = fs.readFileSync(outputPath, 'utf8');
    const results: TestResultsData = JSON.parse(rawData);

    return results;
  } catch (error) {
    // Still try to read results even if tests failed (expected in this case)
    if (fs.existsSync(outputPath)) {
      const rawData = fs.readFileSync(outputPath, 'utf8');
      const results: TestResultsData = JSON.parse(rawData);
      return results;
    }

    throw new Error(`Failed to collect test results: ${error}`);
  }
} 