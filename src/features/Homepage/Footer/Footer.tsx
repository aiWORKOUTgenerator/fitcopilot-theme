import { Facebook, Github, Instagram, Twitter } from 'lucide-react';
import React from 'react';
import { FooterLinkGroup } from './components/FooterLinkGroup';
import './Footer.scss';
import { FooterProps } from './types';

/**
 * Footer component - Displays the site footer
 */
export const Footer: React.FC<FooterProps> = ({ links = [] }) => {
  // Default footer links if none provided from props
  const defaultLinks = links.length > 0 ? links : [
    {
      id: 1,
      title: 'Product',
      links: [
        { id: 101, title: 'Features', url: '#features' },
        { id: 102, title: 'How It Works', url: '#how-it-works' },
        { id: 103, title: 'Pricing', url: '#pricing' },
        { id: 104, title: 'FAQs', url: '#faqs' }
      ]
    },
    {
      id: 2,
      title: 'Resources',
      links: [
        { id: 201, title: 'Blog', url: '/blog' },
        { id: 202, title: 'Documentation', url: '/docs' },
        { id: 203, title: 'Guides', url: '/guides' },
        { id: 204, title: 'Support', url: '/support' }
      ]
    },
    {
      id: 3,
      title: 'Company',
      links: [
        { id: 301, title: 'About Us', url: '/about' },
        { id: 302, title: 'Careers', url: '/careers' },
        { id: 303, title: 'Privacy Policy', url: '/privacy' },
        { id: 304, title: 'Terms of Service', url: '/terms' }
      ]
    }
  ];

  return (
      <footer className="footer-section py-16">
          <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  {/* Logo and social links */}
                  <div className="md:col-span-3">
                      <div className="mb-6 flex flex-col items-start">
                          <span className="text-gray-400 text-lg tracking-wider">ai</span>
                          <span className="text-white text-2xl font-bold tracking-wide">WORKOUT</span>
                          <span className="bg-[#CCFF00] text-[#0B1121] text-sm px-4 py-0.5 rounded-full font-medium tracking-wider">
                              GENERATOR
                          </span>
                      </div>

                      <p className="text-gray-400 mb-6">
                          Transforming fitness journeys with AI-powered workout plans tailored to your unique goals.
                      </p>

                      <div className="flex space-x-4">
                          <a href="#" className="text-gray-400 hover:text-[#CCFF00] transition-colors duration-300">
                              <Facebook size={20} />
                          </a>
                          <a href="#" className="text-gray-400 hover:text-[#CCFF00] transition-colors duration-300">
                              <Twitter size={20} />
                          </a>
                          <a href="#" className="text-gray-400 hover:text-[#CCFF00] transition-colors duration-300">
                              <Instagram size={20} />
                          </a>
                          <a href="#" className="text-gray-400 hover:text-[#CCFF00] transition-colors duration-300">
                              <Github size={20} />
                          </a>
                      </div>
                  </div>

                  {/* Footer link groups */}
                  <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
                      {defaultLinks.map(group => (
                          <FooterLinkGroup
                              key={group.id}
                              title={group.title}
                              links={group.links}
              />
            ))}
                  </div>

                  {/* Newsletter signup */}
                  <div className="md:col-span-3">
                      <h4 className="text-white text-lg font-semibold mb-4">Stay Updated</h4>
                      <p className="text-gray-400 mb-4">
                          Subscribe to our newsletter for the latest updates and fitness tips.
                      </p>

                      <form className="flex flex-col sm:flex-row gap-2">
                          <input
                              type="email"
                              placeholder="Enter your email"
                              className="bg-[#151F38] text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-[#CCFF00]"
              />
                          <button
                              type="submit"
                              className="bg-[#CCFF00] text-[#0B1121] rounded-lg px-4 py-2 font-medium hover:bg-[#D8FF33] transition-colors duration-300"
              >
                              Subscribe
                          </button>
                      </form>
                  </div>
              </div>

              <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                  <p>© {new Date().getFullYear()} AI Workout Generator. All rights reserved.</p>
              </div>
          </div>
      </footer>
  );
};

export default Footer; 