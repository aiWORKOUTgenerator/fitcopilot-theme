import { jsx as _jsx } from "react/jsx-runtime";
const Section = ({ id, children, background = 'dark', paddingY = 'lg', className = '', }) => {
    const paddingClasses = {
        none: '',
        sm: 'py-4',
        md: 'py-8',
        lg: 'py-12',
        xl: 'py-16',
    };
    const backgroundClasses = {
        dark: 'bg-gray-900',
        light: 'bg-gray-100',
    };
    return (_jsx("section", { id: id, className: `
        ${backgroundClasses[background]}
        ${paddingClasses[paddingY]}
        ${className}
      `, children: _jsx("div", { className: "container mx-auto px-4", children: children }) }));
};
export default Section;
