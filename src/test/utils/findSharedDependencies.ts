/**
 * Utility function to determine if a dependency should be ignored
 * @param dependency Dependency name to check 
 * @param _name Name of the module using the dependency (unused but kept for API consistency)
 * @returns Boolean indicating if the dependency should be ignored
 */
export const ignoreDependency = (dependency: string, _name: string): boolean => {
  // List of dependencies to always ignore
  const ignoredDependencies = [
    'react',
    'react-dom',
    '@testing-library/react',
    'typescript',
    'jest',
  ];

  return ignoredDependencies.includes(dependency);
}; 