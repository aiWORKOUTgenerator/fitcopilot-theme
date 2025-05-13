#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Component type templates
const COMPONENT_TYPES = {
    UI: 'UI Component',
    FEATURE: 'Feature Component',
    LAYOUT: 'Layout Component',
    COMPOSITE: 'Composite Component'
};

// Setup readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt for input with validation
const prompt = (question, validator = null) => {
    return new Promise((resolve) => {
        const ask = () => {
            rl.question(question, (answer) => {
                if (validator && !validator(answer)) {
                    console.log('\x1b[31mInvalid input. Please try again.\x1b[0m');
                    ask();
                } else {
                    resolve(answer);
                }
            });
        };
        ask();
    });
};

// Select from a list of options
const select = async (question, options) => {
    console.log(question);
    Object.entries(options).forEach(([key, value], index) => {
        console.log(`${index + 1}. ${value}`);
    });

    const answer = await prompt('Enter selection number: ',
        (input) => {
            const num = parseInt(input);
            return !isNaN(num) && num >= 1 && num <= Object.keys(options).length;
        }
    );

    return Object.keys(options)[parseInt(answer) - 1];
};

// Get component details from user
const getComponentDetails = async () => {
    const name = await prompt('Component name (PascalCase): ',
        (input) => /^[A-Z][a-zA-Z0-9]*$/.test(input)
    );

    const type = await select('Component type:', COMPONENT_TYPES);

    const feature = await prompt('Feature name (e.g., Homepage, Authentication): ');

    const description = await prompt('Component description: ');

    const hasProps = (await prompt('Does this component have props? (y/n): ')).toLowerCase() === 'y';

    return { name, type, feature, description, hasProps };
};

// Generate the component files
const generateComponent = async (details) => {
    const { name, type, feature, description, hasProps } = details;

    // Create directory structure
    const featureDir = path.join(process.cwd(), 'src', 'features', feature);
    const componentDir = path.join(featureDir, name);

    // Ensure directories exist
    if (!fs.existsSync(featureDir)) {
        fs.mkdirSync(featureDir, { recursive: true });
    }

    if (!fs.existsSync(componentDir)) {
        fs.mkdirSync(componentDir, { recursive: true });
    }

    // Create component files
    generateComponentFile(componentDir, name, type, description, hasProps);
    generateStylesFile(componentDir, name);
    generateIndexFile(componentDir, name);
    generateTestFile(componentDir, name, type, hasProps);

    console.log(`\n✅ Component ${name} created successfully in ${componentDir}`);

    // Return for further processing
    return { name, componentDir };
};

// Generate the main component file
const generateComponentFile = (dir, name, type, description, hasProps) => {
    const propsInterface = hasProps ?
        `
export interface ${name}Props {
    /** Unique identifier for the component */
    id?: string;
    /** Custom CSS class name */
    className?: string;
    /** Children elements */
    children?: React.ReactNode;
}
` : '';

    const propsParam = hasProps ? `(props: ${name}Props)` : '()';
    const propsDestructure = hasProps ? `
    const {
        id,
        className,
        children
    } = props;
` : '';

    const template = `/**
 * ${description}
 * 
 * @component ${type}
 */
import React from 'react';
import './styles.scss';
${hasProps ? '' : '\n'}${propsInterface}
/**
 * ${name} component
 * 
 * @returns {JSX.Element} The rendered component
 */
export const ${name} = ${propsParam}: JSX.Element => {${propsDestructure}
    return (
        <div${hasProps ? ' id={id} className={className}' : ''}>
            ${name} Component${hasProps ? '\n            {children}' : ''}
        </div>
    );
};

export default ${name};
`;

    fs.writeFileSync(path.join(dir, `${name}.tsx`), template);
    console.log(`✅ Created ${name}.tsx`);
};

// Generate the styles file
const generateStylesFile = (dir, name) => {
    const template = `@import '../../styles/variables';
@import '../../styles/mixins';

.${name.toLowerCase()} {
    // Component styles go here
}
`;

    fs.writeFileSync(path.join(dir, 'styles.scss'), template);
    console.log(`✅ Created styles.scss`);
};

// Generate the index file
const generateIndexFile = (dir, name) => {
    const template = `export { default, ${name} } from './${name}';
`;

    fs.writeFileSync(path.join(dir, 'index.ts'), template);
    console.log(`✅ Created index.ts`);
};

// Generate the test file
const generateTestFile = (dir, name, type, hasProps) => {
    const propsSetup = hasProps ?
        `
    const defaultProps = {
        id: 'test-${name.toLowerCase()}',
        className: 'test-class'
    };` : '';

    const template = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';${propsSetup}

describe('${name} component', () => {
    it('renders correctly', () => {
        render(<${name}${hasProps ? ' {...defaultProps}' : ''} />);
        
        // Add your test assertions here
        expect(screen.getByText(/${name} Component/i)).toBeInTheDocument();
    });
    
    ${hasProps ? `it('renders children when passed', () => {
        render(
            <${name} {...defaultProps}>
                <div data-testid="child">Child Content</div>
            </${name}>
        );
        
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });` : '// Add more tests as needed'}
});
`;

    fs.writeFileSync(path.join(dir, `${name}.test.tsx`), template);
    console.log(`✅ Created ${name}.test.tsx`);
};

// Main execution
const main = async () => {
    console.log('🔷 FitCopilot Component Generator 🔷\n');

    try {
        const details = await getComponentDetails();
        await generateComponent(details);
    } catch (error) {
        console.error('Error generating component:', error);
    } finally {
        rl.close();
    }
};

// Allow direct execution or import
if (require.main === module) {
    main();
} else {
    module.exports = {
        generateComponent
    };
} 