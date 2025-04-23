import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Component for displaying font samples
 */
export const FontSample = ({ family, size, weight = 'normal', sample = 'The quick brown fox jumps over the lazy dog' }) => {
    return (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("div", { style: {
                    fontFamily: family,
                    fontSize: size,
                    fontWeight: weight,
                    marginBottom: '0.5rem'
                }, children: sample }), _jsxs("div", { style: {
                    display: 'flex',
                    fontSize: '0.875rem',
                    color: '#666',
                    gap: '1rem'
                }, children: [_jsxs("span", { children: [_jsx("strong", { children: "Family:" }), " ", family] }), _jsxs("span", { children: [_jsx("strong", { children: "Size:" }), " ", size] }), _jsxs("span", { children: [_jsx("strong", { children: "Weight:" }), " ", weight] })] })] }));
};
/**
 * Component for displaying a spacing visualization
 */
export const SpacingTable = () => {
    const spacingValues = [
        { name: '--space-1', value: '0.25rem', px: '4px' },
        { name: '--space-2', value: '0.5rem', px: '8px' },
        { name: '--space-3', value: '0.75rem', px: '12px' },
        { name: '--space-4', value: '1rem', px: '16px' },
        { name: '--space-6', value: '1.5rem', px: '24px' },
        { name: '--space-8', value: '2rem', px: '32px' },
        { name: '--space-12', value: '3rem', px: '48px' },
        { name: '--space-16', value: '4rem', px: '64px' },
    ];
    return (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: spacingValues.map((spacing) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsx("div", { style: {
                        width: spacing.value,
                        height: spacing.value,
                        backgroundColor: '#0ea5e9',
                        borderRadius: '4px'
                    } }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 'bold' }, children: spacing.name }), _jsxs("div", { style: { fontSize: '0.875rem', color: '#666' }, children: [spacing.value, " / ", spacing.px] })] })] }, spacing.name))) }));
};
/**
 * Grid display for theme elements
 */
export const ThemeGrid = ({ children, columns = 2 }) => {
    return (_jsx("div", { style: {
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '2rem',
            marginBottom: '2rem'
        }, children: children }));
};
