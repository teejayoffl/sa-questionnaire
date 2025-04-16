import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import { useFormContext } from '../../context/FormContext';
import { motion } from 'framer-motion';

interface IncomeSelectionSectionProps {
  onComplete?: (data: any) => void;
  initialData?: any;
  isConversation?: boolean;
}

export interface IncomeSelectionSectionRef {
  submitForm: () => void;
}

type IncomeType = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const incomeTypes: IncomeType[] = [
  { 
    id: 'employment', 
    label: 'Employment Income', 
    description: 'Salary, wages, bonuses, and benefits from employment',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: 'selfEmployment', 
    label: 'Self-Employment', 
    description: 'Income from your business or freelance work',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  { 
    id: 'property', 
    label: 'Property Income', 
    description: 'Rental income from properties in the UK',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    id: 'partnership', 
    label: 'Partnership', 
    description: 'Income from being a partner in a business partnership',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    id: 'foreignIncome', 
    label: 'Foreign Income', 
    description: 'Income from sources outside the UK',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    id: 'capitalGains', 
    label: 'Capital Gains', 
    description: 'Profit from selling assets like property or shares',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  { 
    id: 'otherIncome', 
    label: 'Other Income', 
    description: 'Dividends, interest, state benefits, etc.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

// Correctly implement forwardRef
const IncomeSelectionSection = forwardRef<IncomeSelectionSectionRef, IncomeSelectionSectionProps>(
  function IncomeSelectionSection(props, ref) {
    const { onComplete, initialData, isConversation = false } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();

    const { handleSubmit, setValue, watch } = useForm({
      defaultValues: {
        selectedIncomeTypes: formData.selectedIncomeTypes || []
      }
    });

    const selectedIncomeTypes = watch('selectedIncomeTypes') || [];

    useEffect(() => {
      setValue('selectedIncomeTypes', formData.selectedIncomeTypes || []);
    }, [formData, setValue]);

    const toggleIncomeType = (incomeTypeId: string) => {
      const currentSelections = [...selectedIncomeTypes];
      if (currentSelections.includes(incomeTypeId)) {
        setValue('selectedIncomeTypes', currentSelections.filter(id => id !== incomeTypeId));
      } else {
        setValue('selectedIncomeTypes', [...currentSelections, incomeTypeId]);
      }
    };

    const onSubmit = (data: { selectedIncomeTypes: string[] }) => {
      updateFormData({ selectedIncomeTypes: data.selectedIncomeTypes });
      setSectionCompleted('incomeSelection', true);
      if (onComplete) {
        onComplete(data);
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)()
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <div className="bg-gradient-to-r from-[#104b8d]/10 to-[#5ea1db]/10 p-5 rounded-xl border border-[#5ea1db]/30 shadow-sm">
            <h3 className="font-medium text-[#104b8d] mb-2 text-lg">Income Sources</h3>
            <p className="text-sm text-[#104b8d]/80">
              Please select all sources of income you received during the tax year.
              We'll guide you through the necessary details for each selected option.
            </p>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm font-medium text-[#104b8d]">
              {selectedIncomeTypes.length === 0 
                ? 'Select which types of income apply to you' 
                : `${selectedIncomeTypes.length} income source${selectedIncomeTypes.length > 1 ? 's' : ''} selected`}
            </p>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Select all that apply
            </span>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {incomeTypes.map((incomeType) => {
            const isSelected = selectedIncomeTypes.includes(incomeType.id);
            return (
              <motion.div
                key={incomeType.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative rounded-xl p-4 cursor-pointer transition-all duration-300
                  ${isSelected 
                    ? 'bg-gradient-to-br from-white to-amber-50 border border-amber-300 shadow-md' 
                    : 'bg-white border border-gray-200 hover:border-[#3a75b4]/40 shadow-sm'}
                `}
                onClick={() => toggleIncomeType(incomeType.id)}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <motion.div 
                    className="absolute top-0 right-0 m-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#104b8d] to-amber-500 flex items-center justify-center shadow-md">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </motion.div>
                )}
                
                <div className="flex items-start">
                  <div className={`
                    flex-shrink-0 p-3 rounded-full mr-4 transition-all duration-300
                    ${isSelected 
                      ? 'bg-gradient-to-br from-[#104b8d]/10 to-amber-100 text-[#104b8d]' 
                      : 'bg-gray-100 text-[#104b8d]/70'}
                  `}>
                    {incomeType.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium text-base transition-colors duration-300 ${isSelected ? 'text-[#104b8d]' : 'text-gray-700'}`}>
                      {incomeType.label}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {incomeType.description}
                    </p>
                    
                    {/* Fade-in tag for selected items */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-2"
                      >
                        <span className="inline-block px-2 py-1 text-xs rounded-md bg-[#104b8d]/10 text-[#104b8d] font-medium">
                          Selected
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center text-sm">
            <svg className="h-5 w-5 text-[#104b8d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[#104b8d]">
              {selectedIncomeTypes.length === 0 
                ? "Select at least one income source to continue" 
                : "Click 'Next Step' when you're ready to continue"}
            </span>
          </div>
        </motion.div>
      </form>
    );
  }
);

export default IncomeSelectionSection; 