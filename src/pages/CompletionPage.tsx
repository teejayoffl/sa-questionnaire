import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const CompletionPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 p-8">
      <CheckCircleIcon className="h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Submission Complete!</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Thank you for completing the questionnaire. Your information has been successfully recorded.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Return to Start
      </Link>
    </div>
  );
};

export default CompletionPage; 