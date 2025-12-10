import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
        Generating your personalized plan...
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500 text-center max-w-md">
        Our AI is analyzing your information to create the perfect diet and fitness recommendations for you.
      </p>
    </div>
  );
};

export default LoadingSpinner;