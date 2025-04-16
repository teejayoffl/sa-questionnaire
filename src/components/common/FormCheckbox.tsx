import React from 'react';
import { motion } from 'framer-motion';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tooltip?: string;
  className?: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
  tooltip,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center">
        <motion.input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-5 w-5 rounded border-wis-silver-300 text-wis-gold-500 focus:ring-wis-gold-400"
          whileTap={{ scale: 0.95 }}
        />
        
        <div className="ml-3 flex items-center">
          <label htmlFor={name} className="text-sm font-medium text-wis-silver-800">
            {label}
          </label>
          
          {tooltip && (
            <div className="group tooltip ml-2">
              <QuestionMarkCircleIcon className="h-4 w-4 text-wis-silver-500" />
              <div className="tooltip-text">
                {tooltip}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCheckbox; 