import React from 'react';
import { motion } from 'framer-motion';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  tooltip?: string;
  error?: string;
  className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  required = false,
  tooltip,
  error,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {tooltip && (
          <div className="group tooltip">
            <QuestionMarkCircleIcon className="h-4 w-4 text-wis-silver-500" />
            <div className="tooltip-text">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      
      <motion.select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-select ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <option value="">Please select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
      
      {error && (
        <motion.p 
          className="mt-1 text-sm text-red-500" 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FormSelect; 