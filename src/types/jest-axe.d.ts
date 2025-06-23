/**
 * Type definitions for jest-axe
 */
declare module 'jest-axe' {
  import { AxeResults as AXEResults } from 'axe-core';
  
  export interface AxeResults extends AXEResults {
    violations: any[];
    passes: any[];
    incomplete: any[];
    inapplicable: any[];
  }

  export interface RunOptions {
    rules?: object;
    context?: any;
    runOnly?: {
      type: 'tag' | 'rule';
      values: string[];
    };
    resultTypes?: string[];
    reporter?: 'v1' | 'v2' | 'no-passes';
    xpath?: boolean;
    iframes?: boolean;
    elementRef?: boolean;
    selectors?: boolean;
  }

  export interface JestAxeConfigureOptions {
    globalOptions?: RunOptions;
    rules?: object[];
    checks?: object[];
    disableOtherRules?: boolean;
  }

  export function configureAxe(options?: JestAxeConfigureOptions): void;
  export function axe(element: Element | string, options?: RunOptions): Promise<AxeResults>;
}

// This module extends Jest's expect, improving TypeScript integration
declare module 'jest-axe/extend-expect' {}

// Extend Jest's matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Custom matcher for jest-axe to check for accessibility violations
       */
      toHaveNoViolations(): R;
    }
  }
} 