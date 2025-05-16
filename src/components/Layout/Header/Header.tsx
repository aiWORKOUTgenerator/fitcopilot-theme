import React from 'react';

interface NavigationItem {
    label: string;
    href: string;
}

interface HeaderProps {
    logo: string;
    navigation: NavigationItem[];
    showLogin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ logo, navigation, showLogin = false }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {showLogin && (
            <div className="flex items-center">
              <a
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 