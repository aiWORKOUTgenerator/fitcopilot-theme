const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all component files
function findComponentFiles(baseDir = 'src') {
  return glob.sync(`${baseDir}/**/*.{tsx,ts}`, {
    ignore: ['**/*.test.tsx', '**/*.stories.tsx', '**/node_modules/**']
  });
}

// Parse imports from a file
function parseImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = [];
  
  // Match ES6 imports
  const importPattern = /import\s+(?:{([^}]+)}|\*\s+as\s+([^\s;]+)|([^\s{},;]+))\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importPattern.exec(content)) !== null) {
    const [_, namedImports, namespaceImport, defaultImport, importPath] = match;
    
    if (namedImports) {
      const components = namedImports.split(',').map(s => s.trim())
        .filter(s => s.match(/^[A-Z]/)); // Components typically start with uppercase
      
      if (components.length > 0) {
        imports.push({
          type: 'named',
          components,
          path: importPath
        });
      }
    }
    
    if (defaultImport && defaultImport.match(/^[A-Z]/)) {
      imports.push({
        type: 'default',
        components: [defaultImport],
        path: importPath
      });
    }
  }
  
  return imports;
}

// Extract component name from file
function extractComponentName(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  if (fileName === 'index') {
    // For index files, use the directory name as component name
    const dirName = path.basename(path.dirname(filePath));
    return dirName.charAt(0).toUpperCase() + dirName.slice(1);
  }
  return fileName;
}

// Check if file exports a component
function exportsComponent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Check for common component export patterns
    return (
      content.includes('export default') ||
      content.includes('export function') ||
      content.includes('export const') ||
      content.includes('export class')
    ) && (
      content.includes('React.') || 
      content.includes('from "react"') || 
      content.includes("from 'react'")
    );
  } catch (err) {
    console.error(`Error checking component export in ${filePath}:`, err);
    return false;
  }
}

// Build dependency graph
function buildDependencyGraph() {
  try {
    const files = findComponentFiles();
    console.log(`Found ${files.length} potential component files`);
    
    const graph = {
      nodes: [],
      edges: [],
      componentMap: {} // Maps import paths to component names
    };
    
    // First pass: gather all component files and names
    files.forEach(file => {
      if (exportsComponent(file)) {
        const componentName = extractComponentName(file);
        const relativePath = file.replace(/^src\//, '');
        
        graph.nodes.push({
          id: componentName,
          path: relativePath,
          fullPath: file
        });
        
        // Map the relative import path to component name
        const importPath = './' + relativePath.replace(/\.[jt]sx?$/, '');
        graph.componentMap[importPath] = componentName;
      }
    });
    
    console.log(`Identified ${graph.nodes.length} React components`);
    
    // Second pass: analyze imports and build edges
    graph.nodes.forEach(node => {
      try {
        const imports = parseImports(node.fullPath);
        
        imports.forEach(imp => {
          // Convert relative imports to absolute for matching
          let importPath = imp.path;
          if (importPath.startsWith('.')) {
            const basePath = path.dirname(node.fullPath);
            importPath = path.resolve(basePath, importPath);
            // Convert back to relative from src
            importPath = './' + path.relative('src', importPath);
          }
          
          // Find target component
          const targetComponent = graph.componentMap[importPath] || 
                                  graph.componentMap[importPath + '/index'];
          
          if (targetComponent) {
            imp.components.forEach(component => {
              graph.edges.push({
                source: node.id,
                target: targetComponent,
                componentName: component
              });
            });
          }
        });
      } catch (err) {
        console.error(`Error processing imports for ${node.fullPath}:`, err);
      }
    });
    
    console.log(`Identified ${graph.edges.length} component dependencies`);
    
    // Find foundation components (those with many dependents)
    const dependentCount = {};
    graph.edges.forEach(edge => {
      if (!dependentCount[edge.target]) {
        dependentCount[edge.target] = 0;
      }
      dependentCount[edge.target]++;
    });
    
    // Mark foundation components
    graph.nodes.forEach(node => {
      node.dependents = dependentCount[node.id] || 0;
      node.isFoundation = node.dependents >= 3; // Arbitrary threshold
    });
    
    // Generate foundation component report
    const foundationComponents = graph.nodes
      .filter(node => node.isFoundation)
      .sort((a, b) => b.dependents - a.dependents);
    
    let foundationReport = `# Foundation Components\n\n`;
    foundationReport += `These components are used by multiple other components and should be prioritized for remediation.\n\n`;
    
    foundationReport += `| Component | Path | Dependents |\n`;
    foundationReport += `|-----------|------|------------|\n`;
    
    foundationComponents.forEach(comp => {
      foundationReport += `| ${comp.id} | ${comp.path} | ${comp.dependents} |\n`;
    });
    
    fs.writeFileSync('analysis/errors/foundation-components.md', foundationReport);
    
    // Write graph to file
    fs.writeFileSync(
      'analysis/errors/component-hierarchy.json',
      JSON.stringify(graph, null, 2)
    );
    
    // Generate visualization data (D3 format)
    const d3Graph = {
      nodes: graph.nodes.map(n => ({
        id: n.id,
        group: n.isFoundation ? 1 : 2,
        dependents: n.dependents,
        path: n.path
      })),
      links: graph.edges.map(e => ({
        source: e.source,
        target: e.target,
        value: 1
      }))
    };
    
    fs.writeFileSync(
      'analysis/errors/component-visualization.json',
      JSON.stringify(d3Graph, null, 2)
    );
    
    console.log(`Generated component hierarchy with ${graph.nodes.length} components and ${graph.edges.length} dependencies`);
    console.log(`Identified ${foundationComponents.length} foundation components`);
  } catch (err) {
    console.error('Error building dependency graph:', err);
  }
}

buildDependencyGraph(); 