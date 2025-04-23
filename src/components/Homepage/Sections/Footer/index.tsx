import React from 'react';
import Section from '../../Layout/Section';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About', url: '#' },
        { name: 'Careers', url: '#' },
        { name: 'Contact', url: '#' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', url: '#' },
        { name: 'Guides', url: '#' },
        { name: 'Support', url: '#' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', url: '#' },
        { name: 'Terms', url: '#' },
        { name: 'Cookies', url: '#' },
      ]
    }
  ];

  return (
    <Section id="footer" background="light" paddingY="lg">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">
              AI Workout Generator
            </h3>
          </div>
          <p className="text-gray-400 mb-4 max-w-md">
            Placeholder text for the footer section. This will be replaced with actual content.
          </p>
          <div className="flex space-x-4">
            {/* Social icons placeholder */}
            {['facebook', 'twitter', 'instagram'].map((social) => (
              <a 
                key={social}
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-lime-300/20 transition-colors"
              >
                <div className="w-5 h-5 bg-lime-300/70 rounded-full"></div>
              </a>
            ))}
          </div>
        </div>
        
        {footerLinks.map((category) => (
          <div key={category.title}>
            <h4 className="text-lg font-semibold mb-4">{category.title}</h4>
            <ul className="space-y-2">
              {category.links.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.url} 
                    className="text-gray-400 hover:text-lime-300 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="pt-8 mt-8 border-t border-gray-700 text-center md:text-left md:flex md:justify-between md:items-center">
        <p className="text-gray-400 text-sm mb-4 md:mb-0">
          © {currentYear} AI Workout Generator. All rights reserved.
        </p>
        <div className="flex justify-center md:justify-end space-x-4">
          <a href="#" className="text-gray-400 hover:text-lime-300 text-sm transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-400 hover:text-lime-300 text-sm transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </Section>
  );
};

export default Footer; 