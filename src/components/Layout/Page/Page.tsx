import React from 'react';

interface PageProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, description, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
          <div className="mt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page; 