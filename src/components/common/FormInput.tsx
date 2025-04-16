import React from 'react';
import { motion } from 'framer-motion';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  tooltip?: string;
  error?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
  autoComplete?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  tooltip,
  error,
  className = '',
  prefix,
  suffix,
  autoComplete,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={name} className="text-sm font-medium text-gray-700 tracking-tight">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        
        {tooltip && (
          <div className="group relative">
            <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors" />
            <div className="absolute right-0 bottom-full mb-2 w-64 rounded-lg bg-gray-800 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-xl transform">
              {tooltip}
              <div className="absolute bottom-0 right-0 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">{prefix}</span>
          </div>
        )}
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">{suffix}</span>
          </div>
        )}
        
        <motion.input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-2.5 
            ${prefix ? 'pl-7' : ''} 
            ${suffix ? 'pr-7' : ''}
            bg-white border 
            ${error ? 'border-rose-300 focus:border-rose-500 focus:ring focus:ring-rose-200' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200'} 
            rounded-xl shadow-sm 
            transition-all duration-200 ease-in-out 
            text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-opacity-50
          `}
          whileFocus={{ scale: 1.005 }}
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      {error && (
        <motion.p 
          className="mt-1.5 text-xs text-rose-500 flex items-center" 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Error icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormInput; 