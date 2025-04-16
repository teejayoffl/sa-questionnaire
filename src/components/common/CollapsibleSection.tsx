import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isCompleted: boolean;
  isActive: boolean;
  onToggle: () => void;
  stepNumber: number;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  isCompleted,
  isActive,
  onToggle,
  stepNumber,
}) => {
  return (
    <div className="mb-6">
      <motion.div
        className={`card cursor-pointer mb-2 ${isActive ? 'border-wis-blue-400' : ''}`}
        whileHover={{ 
          scale: isActive ? 1 : 1.01,
          boxShadow: isActive ? '' : '0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
              isCompleted ? 'bg-green-100' : 'bg-wis-blue-100'
            }`}>
              {isCompleted ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <span className="text-sm font-medium text-wis-blue-700">{stepNumber}</span>
              )}
            </div>
            <h3 className="text-lg font-medium text-wis-silver-800">{title}</h3>
          </div>
          
          <div>
            {isActive ? (
              <ChevronUpIcon className="w-5 h-5 text-wis-blue-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-wis-silver-500" />
            )}
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="card border-t-0 rounded-t-none">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection; 