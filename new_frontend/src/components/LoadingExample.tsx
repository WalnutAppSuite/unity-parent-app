import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Example of a component that might take time to load
const SlowComponent = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Slow Loading Component</h2>
      <p>This component has loaded successfully!</p>
    </div>
  );
};

// Example of different loading spinner sizes
const LoadingExample: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Loading Spinner Examples</h1>
      
      {/* Different sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes:</h3>
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <LoadingSpinner size="sm" />
            <p className="mt-2 text-sm text-gray-600">Small</p>
          </div>
          <div className="text-center">
            <LoadingSpinner size="md" />
            <p className="mt-2 text-sm text-gray-600">Medium</p>
          </div>
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-2 text-sm text-gray-600">Large</p>
          </div>
        </div>
      </div>

      {/* Suspense example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Suspense Example:</h3>
        <div className="border rounded-lg p-4">
          <Suspense fallback={<LoadingSpinner size="md" />}>
            <SlowComponent />
          </Suspense>
        </div>
      </div>

      {/* Custom styling */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling:</h3>
        <div className="bg-blue-50 rounded-lg p-6">
          <LoadingSpinner 
            size="lg" 
            className="bg-blue-100 rounded-full p-4"
          />
          <p className="mt-4 text-center text-blue-700 font-medium">
            Loading with custom background...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingExample; 