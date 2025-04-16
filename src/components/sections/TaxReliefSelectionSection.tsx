import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useFormContext } from '../../context/FormContext';
import { motion } from 'framer-motion';

// Define brand colors for easier reference and consistency
const brandColors = {
  royalBlue: '#104b8d',
  metallicBlue: '#5ea1db',
  orange: '#f39200',
  gold: '#f9be29',
};

interface TaxReliefSelectionSectionProps {
  onComplete?: (data: any) => void;
  initialData?: any;
  isConversation?: boolean;
}

export interface TaxReliefSelectionSectionRef {
  submitForm: () => void;
}

type TaxReliefType = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const taxReliefTypes: TaxReliefType[] = [
  { 
    id: 'pension', 
    label: 'Pension Contributions', 
    description: 'Payments into registered pension schemes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    id: 'charity', 
    label: 'Charitable Donations', 
    description: 'Donations to registered charities using Gift Aid',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  { 
    id: 'investmentSchemes', 
    label: 'Investment Schemes', 
    description: 'Investments in EIS, SEIS, or VCT schemes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    id: 'loanInterest', 
    label: 'Loan Interest Relief', 
    description: 'Interest on qualifying loans for certain purposes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  { 
    id: 'marriageAllowance', 
    label: 'Marriage Allowance', 
    description: 'Transfer of personal allowance to spouse/civil partner',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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

// Convert to use forwardRef explicitly
const TaxReliefSelectionSection = forwardRef<TaxReliefSelectionSectionRef, TaxReliefSelectionSectionProps>(
  function TaxReliefSelectionSection(props, ref) {
    const { onComplete, initialData, isConversation = false } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();

    // Use React Hook Form for form handling
    const { handleSubmit, setValue, watch } = useForm({
      defaultValues: {
        selectedTaxReliefs: formData.selectedTaxReliefs || []
      }
    });

    // Watch selected tax reliefs
    const selectedTaxReliefs = watch('selectedTaxReliefs') || [];

    useEffect(() => {
      // Initialize form with existing values
      setValue('selectedTaxReliefs', formData.selectedTaxReliefs || []);
    }, [formData, setValue]);

    const toggleTaxRelief = (taxReliefId: string) => {
      const currentSelections = [...selectedTaxReliefs];
      
      if (currentSelections.includes(taxReliefId)) {
        // Remove if already selected
        const updatedSelections = currentSelections.filter(id => id !== taxReliefId);
        setValue('selectedTaxReliefs', updatedSelections);
      } else {
        // Add if not selected
        setValue('selectedTaxReliefs', [...currentSelections, taxReliefId]);
      }
    };

    const onSubmit = (data: { selectedTaxReliefs: string[] }) => {
      console.log('TaxReliefSelectionSection - Tax reliefs selected:', data.selectedTaxReliefs);
      
      // Update form data in context
      updateFormData({
        selectedTaxReliefs: data.selectedTaxReliefs
      });

      // Mark section as completed
      setSectionCompleted('taxReliefSelection', true);
      
      // Call onComplete if provided
      if (onComplete) {
        console.log('TaxReliefSelectionSection - Calling onComplete with tax relief data:', data);
        onComplete(data);
      }
    };

    // Expose submitForm method to parent using useImperativeHandle
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)()
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6">
          <div className="bg-gradient-to-r from-[#104b8d]/10 to-[#5ea1db]/10 p-5 rounded-xl border border-[#5ea1db]/30 shadow-sm">
            <h3 className="font-medium text-[#104b8d] mb-2 text-lg">Tax Relief Schemes</h3>
            <p className="text-sm text-[#104b8d]/80">
              Select any tax relief schemes you've contributed to during the tax year.
              These may reduce your overall tax liability.
            </p>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm font-medium text-[#104b8d]">
              {selectedTaxReliefs.length === 0 
                ? 'Select any applicable tax reliefs' 
                : `${selectedTaxReliefs.length} tax relief${selectedTaxReliefs.length > 1 ? 's' : ''} selected`}
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
          {taxReliefTypes.map((taxRelief) => {
            const isSelected = selectedTaxReliefs.includes(taxRelief.id);
            return (
              <motion.div
                key={taxRelief.id}
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
                onClick={() => toggleTaxRelief(taxRelief.id)}
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
                    {taxRelief.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium text-base transition-colors duration-300 ${isSelected ? 'text-[#104b8d]' : 'text-gray-700'}`}>
                      {taxRelief.label}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {taxRelief.description}
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
              {selectedTaxReliefs.length === 0 
                ? "You can skip this section if you don't have any tax reliefs" 
                : "Click 'Next Step' when you're ready to continue"}
            </span>
          </div>
        </motion.div>
      </form>
    );
  }
);

export default TaxReliefSelectionSection; 