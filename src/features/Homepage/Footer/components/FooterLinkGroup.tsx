import React from 'react';
import { FooterLink } from '../types';
import './FooterLinkGroup.scss';

interface FooterLinkGroupProps {
  title: string;
  links: FooterLink[];
}

/**
 * Renders a group of footer links with a title
 */
export const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links }) => {
  return (
    <div className="footer-link-group">
      <h4 className="text-white text-lg font-semibold mb-4">{title}</h4>
      
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.id}>
            <a 
              href={link.url} 
              className="text-gray-400 hover:text-[#CCFF00] transition-colors duration-300"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}; 