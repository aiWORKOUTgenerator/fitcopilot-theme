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