import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './FooterLinkGroup.scss';
/**
 * Renders a group of footer links with a title
 */
export const FooterLinkGroup = ({ title, links }) => {
    return (_jsxs("div", { className: "footer-link-group", children: [_jsx("h4", { className: "text-white text-lg font-semibold mb-4", children: title }), _jsx("ul", { className: "space-y-2", children: links.map(link => (_jsx("li", { children: _jsx("a", { href: link.url, className: "text-gray-400 hover:text-[#CCFF00] transition-colors duration-300", children: link.title }) }, link.id))) })] }));
};
