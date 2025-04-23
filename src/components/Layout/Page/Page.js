import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Page = ({ title, description, children }) => {
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: _jsx("div", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: _jsxs("div", { className: "px-4 py-6 sm:px-0", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: title }), description && (_jsx("p", { className: "mt-2 text-lg text-gray-600 dark:text-gray-300", children: description })), _jsx("div", { className: "mt-6", children: children })] }) }) }));
};
export default Page;
