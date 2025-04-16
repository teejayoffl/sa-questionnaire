import React from 'react';
import { motion } from 'framer-motion';

const SubmissionComponent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-gray-100 flex flex-col items-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          delay: 0.3, 
          duration: 0.8, 
          type: "spring", 
          bounce: 0.4 
        }}
        className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-2xl font-medium text-gray-900 mb-3 tracking-tight"
      >
        Thank You!
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-center text-gray-600 max-w-md mb-8 leading-relaxed font-light"
      >
        Your self-assessment information has been successfully saved and is ready for submission. We'll process your tax return promptly.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          View Dashboard
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SubmissionComponent; 