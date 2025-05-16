import React, { useState } from 'react';
import ButtonImplementation from './ButtonImplementation';
import Implementation from './Implementation';
import { ButtonDebug, ButtonPropsTracing, ClassNameDebug, CSSVarInspector } from './index';

const DebugRunner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('buttonDebug');

  return (
    <div className="debug-runner p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Button Debugging Tools</h1>
        <p className="mb-4">Use these tools to diagnose styling issues with the Personal Training button component.</p>

        <div className="flex flex-wrap border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'buttonDebug' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('buttonDebug')}
          >
            Button Debug
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'propsTracing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('propsTracing')}
          >
            Props Tracing
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'cssVars' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('cssVars')}
          >
            CSS Variables
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'classNames' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('classNames')}
          >
            Class Names
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'implementation' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('implementation')}
          >
            Implementation
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'fixedImpl' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('fixedImpl')}
          >
            Fixed Implementation
          </button>
        </div>
      </div>

      <div className="debug-content">
        {activeTab === 'buttonDebug' && <ButtonDebug />}
        {activeTab === 'propsTracing' && <ButtonPropsTracing />}
        {activeTab === 'cssVars' && <CSSVarInspector />}
        {activeTab === 'classNames' && <ClassNameDebug />}
        {activeTab === 'implementation' && <ButtonImplementation />}
        {activeTab === 'fixedImpl' && <Implementation />}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Debug Instructions</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Check the browser console for detailed diagnostic information</li>
          <li>Compare the Personal Training button style with the inline styled reference button</li>
          <li>Examine CSS variable resolution across different contexts</li>
          <li>Verify proper class name generation from the Button component</li>
          <li>After testing, update the ButtonIssuesRegister.md with findings</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugRunner; 