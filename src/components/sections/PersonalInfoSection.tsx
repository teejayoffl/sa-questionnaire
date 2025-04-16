import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import type { Path } from 'react-hook-form';

// Workaround for zod and zodResolver type issues
// @ts-ignore - Working around module resolution issues
import * as z from 'zod';
// @ts-ignore - Working around module resolution issues
import { zodResolver } from '@hookform/resolvers/zod';

import { useFormContext } from '../../context/FormContext';
import { FormInput } from '../common';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

// Validation Schema
const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  nationalInsuranceNumber: z
    .string()
    .regex(/^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D\s]$/, {
      message: 'Invalid National Insurance number format',
    })
    .optional()
    .or(z.string().refine((val: string) => val === '', { message: 'Must be empty' })),
  utr: z
    .string()
    .regex(/^[0-9]{10}$/, { message: 'UTR must be 10 digits' })
    .optional()
    .or(z.string().refine((val: string) => val === '', { message: 'Must be empty' })),
  dateOfBirth: z.string().refine((val: string) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Invalid email address'),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoSectionProps {
  onComplete: (data: PersonalInfoFormData) => void;
}

// Define the type for the exposed ref methods
export interface PersonalInfoSectionRef {
  submitForm: () => void;
}

// Form step interface
interface FormStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  fields: string[];
}

// Define form steps with a more logical grouping
const formSteps: FormStep[] = [
  {
    id: 'personal',
    title: 'Personal Details',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10C12.0711 10 13.75 8.32107 13.75 6.25C13.75 4.17893 12.0711 2.5 10 2.5C7.92893 2.5 6.25 4.17893 6.25 6.25C6.25 8.32107 7.92893 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.25 17.5C16.25 14.7386 13.4518 12.5 10 12.5C6.54822 12.5 3.75 14.7386 3.75 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    fields: ['fullName', 'dateOfBirth', 'nationalInsuranceNumber', 'utr']
  },
  {
    id: 'address',
    title: 'Address',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 7.5L10 2.5L2.5 7.5V17.5H17.5V7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 17.5V10H12.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    fields: ['addressLine1', 'addressLine2', 'city', 'postcode']
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 13.9167V16.4167C17.5 16.9029 17.3068 17.3692 16.963 17.713C16.6192 18.0568 16.1529 18.25 15.6667 18.25C13.2851 18.25 10.9761 17.4551 9.00403 16.0447C7.17464 14.7594 5.65055 13.2353 4.36526 11.4059C2.94486 9.42391 2.14999 7.10499 2.15 4.7234C2.15006 4.23812 2.3428 3.77271 2.68527 3.42918C3.02774 3.08564 3.49253 2.89168 3.97792 2.89168H6.47792C6.89588 2.88755 7.30032 3.02847 7.61443 3.2875C7.92854 3.54654 8.13332 3.90934 8.19167 4.31251C8.30066 5.11766 8.4907 5.9102 8.76167 6.67501C8.87443 6.9821 8.89203 7.31513 8.81248 7.63153C8.73293 7.94794 8.55972 8.23142 8.3175 8.44584L7.20834 9.55501C8.38236 11.4592 9.95417 13.031 11.8583 14.205L12.9675 13.0959C13.1819 12.8536 13.4654 12.6804 13.7818 12.6009C14.0982 12.5213 14.4312 12.5389 14.7383 12.6517C15.5031 12.9226 16.2956 13.1127 17.1008 13.2217C17.5089 13.2806 17.8761 13.4887 18.1371 13.8074C18.3981 14.1261 18.5374 14.5359 18.5283 14.9584L17.5 13.9167Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    fields: ['contactNumber', 'email']
  }
];

// Animation variants
const formVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { opacity: 0, x: -20 }
};

// Field animation variants
const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.3 } 
  })
};

// Tab animation variants
const tabVariants = {
  inactive: { 
    opacity: 0.7,
    scale: 0.95,
    y: 0
  },
  active: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
};

// Progress indicator for form completion
const ProgressIndicator: React.FC<{ steps: FormStep[], currentStep: number, onClick: (step: number) => void, completedSteps: Record<string, boolean> }> = 
  ({ steps, currentStep, onClick, completedSteps }) => {
  return (
    <div className="flex justify-between items-center mb-8 px-2">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step indicator */}
          <div className="flex flex-col items-center">
            <motion.button
              variants={tabVariants}
              initial="inactive"
              animate={currentStep === index + 1 ? "active" : "inactive"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(index + 1);
              }}
              disabled={!completedSteps[step.id] && index + 1 > currentStep}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                transition-all duration-300 shadow-md
                ${currentStep === index + 1 
                  ? 'bg-gradient-to-r from-[#104b8d] to-[#5ea1db] text-white' 
                  : completedSteps[step.id] 
                    ? 'bg-gradient-to-r from-[#5ea1db] to-[#9ed1ff] text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
              `}
            >
              <span className="flex items-center justify-center">{step.icon}</span>
            </motion.button>
            
            {/* Step title */}
            <span className={`text-xs mt-2 font-medium ${currentStep === index + 1 ? 'text-[#104b8d]' : 'text-gray-500'}`}>
              {step.title}
            </span>
          </div>
          
          {/* Connector line (only between steps) */}
          {index < steps.length - 1 && (
            <div className={`w-12 h-[2px] ${
              completedSteps[step.id] ? 'bg-[#5ea1db]' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Wrap component with forwardRef
const PersonalInfoSection = forwardRef<PersonalInfoSectionRef, PersonalInfoSectionProps>(({ onComplete }, ref) => {
  const { formData, updateFormData } = useFormContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formDirection, setFormDirection] = useState<'next' | 'prev'>('next');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    personal: false,
    address: false,
    contact: false
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields, touchedFields },
    reset,
    trigger,
    watch,
    setValue,
    getValues
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: formData.fullName || '',
      nationalInsuranceNumber: formData.nationalInsuranceNumber || '',
      utr: formData.utr || '',
      dateOfBirth: formData.dateOfBirth || '',
      addressLine1: formData.addressLine1 || '',
      addressLine2: formData.addressLine2 || '',
      city: formData.city || '',
      postcode: formData.postcode || '',
      contactNumber: formData.contactNumber || '',
      email: formData.email || '',
    }
  });

  // Watch all fields to enable real-time validation
  const formValues = watch();

  // Set default values if they exist in formData
  useEffect(() => {
    // Check if there's existing data and set completed steps
    if (formData.fullName && formData.dateOfBirth) {
      setCompletedSteps(prev => ({ ...prev, personal: true }));
    }
    
    if (formData.addressLine1 && formData.city && formData.postcode) {
      setCompletedSteps(prev => ({ ...prev, address: true }));
    }
    
    if (formData.contactNumber && formData.email) {
      setCompletedSteps(prev => ({ ...prev, contact: true }));
    }
  }, [formData]);

  // Handle postcode lookup
  const handlePostcodeLookup = async () => {
    const postcode = getValues('postcode');
    if (!postcode) return;
    
    // This would normally call an API, but for this example we'll just simulate
    if (postcode.toUpperCase() === 'SW1A 1AA') {
      setValue('addressLine1', '10 Downing Street');
      setValue('city', 'London');
      // Trigger validation
      await trigger(['addressLine1', 'city']);
    }
  };

  const isFieldValid = (fieldName: keyof PersonalInfoFormData) => {
    const isDirty = dirtyFields[fieldName as string];
    const isTouched = touchedFields[fieldName as string];
    const hasError = !!errors[fieldName as string];
    
    return isDirty && isTouched && !hasError;
  };

  const handleTabClick = (step: number) => {
    if (completedSteps[formSteps[step-1].id] || step <= currentStep) {
      setFormDirection(step > currentStep ? 'next' : 'prev');
      setCurrentStep(step);
      
      // Prevent navigation by returning false
      return false;
    }
  };

  const goToNextStep = async () => {
    // Get fields for current step
    const currentFields = formSteps[currentStep - 1].fields as Array<string>;
    
    // Validate current step fields
    const isStepValid = await trigger(currentFields);
    
    if (isStepValid) {
      // Save current progress
      updateFormData(getValues());
      
      // Mark current step as completed
      setCompletedSteps(prev => ({ 
        ...prev, 
        [formSteps[currentStep - 1].id]: true 
      }));
      
      // Move to next step if not on the last step
      if (currentStep < formSteps.length) {
        setFormDirection('next');
        setCurrentStep(prev => prev + 1);
      } else {
        // If on the last step, submit the form
        handleSubmit(onSubmit)();
      }
    }
  };

  const goToPrevStep = () => {
    setFormDirection('prev');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: PersonalInfoFormData) => {
    updateFormData(data);
    onComplete(data);
  };

  // Modify the existing useImperativeHandle
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      // If we're not on the last step, move to the next step
      if (currentStep < formSteps.length) {
        const result = goToNextStep();
        // Return false to prevent parent from proceeding to next section
        return false;
      } 
      // If we're on the last step, submit the form
      else {
        return handleSubmit(() => {
          onSubmit(getValues());
          return true; // Return true to allow the parent to proceed
        })();
      }
    },
    isValid: Object.keys(errors).length === 0,
    currentStep,
    totalSteps: formSteps.length
  }));

  // Helper to get fields for current step
  const getCurrentStepFields = (): Record<string, string> => {
    return formSteps[currentStep - 1].fields.reduce((acc, field) => {
      acc[field] = field;
      return acc;
    }, {} as Record<string, string>);
  };
  
  // Helper to trigger validation for specific fields
  const validateFields = (fields: Record<string, string>) => {
    Object.keys(fields).forEach(field => {
      trigger(field as Path<PersonalInfoFormData>);
    });
  };

  const renderFormStep = (step: FormStep, stepIndex: number) => {
    // Only render current step
    if (stepIndex + 1 !== currentStep) return null;

    return (
      <motion.div
        key={step.id}
        custom={formDirection}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-5"
      >
        <div className="space-y-4">
          {step.fields.map((fieldName, index) => {
            // Cast to the correct type
            const field = fieldName as keyof PersonalInfoFormData;
            
            // Check if field is valid
            const valid = isFieldValid(field);
            
            return (
              <motion.div 
                key={fieldName}
                custom={index}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {field === 'fullName' && (
                  <>
                    <label className="block text-sm font-medium text-[#104b8d] font-inter" htmlFor="fullName">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="fullName"
                        type="text"
                        className={`w-full py-2 px-3 border ${errors.fullName ? 'border-red-300 bg-red-50' : valid ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5ea1db] focus:border-transparent transition duration-200`}
                        placeholder="Your full name"
                        {...register('fullName')}
                      />
                      {valid && (
                        <CheckCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1 font-inter">{errors.fullName.message?.toString()}</p>
                    )}
                  </>
                )}
                
                {field === 'nationalInsuranceNumber' && (
                  <>
                    <label className="block text-sm font-medium text-[#104b8d] font-inter" htmlFor="nationalInsuranceNumber">
                      National Insurance Number
                    </label>
                    <div className="relative">
                      <input
                        id="nationalInsuranceNumber"
                        type="text"
                        className={`w-full py-2 px-3 border ${errors.nationalInsuranceNumber ? 'border-red-300 bg-red-50' : valid ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5ea1db] focus:border-transparent transition duration-200`}
                        placeholder="e.g. QQ123456C"
                        {...register('nationalInsuranceNumber')}
                      />
                      {valid && (
                        <CheckCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-inter">Format: 2 letters, 6 numbers, 1 letter</p>
                    {errors.nationalInsuranceNumber && (
                      <p className="text-xs text-red-500 mt-1 font-inter">{errors.nationalInsuranceNumber.message?.toString()}</p>
                    )}
                  </>
                )}
                
                {field === 'utr' && (
                  <>
                    <label className="block text-sm font-medium text-[#104b8d] font-inter" htmlFor="utr">
                      Unique Taxpayer Reference (UTR)
                    </label>
                    <div className="relative">
                      <input
                        id="utr"
                        type="text"
                        className={`w-full py-2 px-3 border ${errors.utr ? 'border-red-300 bg-red-50' : valid ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5ea1db] focus:border-transparent transition duration-200`}
                        placeholder="e.g. 1234567890"
                        {...register('utr')}
                      />
                      {valid && (
                        <CheckCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-inter">UTR is a 10-digit number</p>
                    {errors.utr && (
                      <p className="text-xs text-red-500 mt-1 font-inter">{errors.utr.message?.toString()}</p>
                    )}
                  </>
                )}
                
                {field === 'dateOfBirth' && (
                  <>
                    <label className="block text-sm font-medium text-[#104b8d] font-inter" htmlFor="dateOfBirth">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        id="dateOfBirth"
                        type="date"
                        className={`w-full py-2 px-3 border ${errors.dateOfBirth ? 'border-red-300 bg-red-50' : valid ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5ea1db] focus:border-transparent transition duration-200`}
                        max={new Date().toISOString().split('T')[0]} // Prevent future dates
                        {...register('dateOfBirth')}
                      />
                      {valid && (
                        <CheckCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {errors.dateOfBirth && (
                      <p className="text-xs text-red-500 mt-1 font-inter">{errors.dateOfBirth.message?.toString()}</p>
                    )}
                  </>
                )}
                
                {field === 'addressLine1' && (
                  <>
                    <label className="block text-sm font-medium text-[#104b8d] font-inter" htmlFor="addressLine1">
                      Address Line 1
                    </label>
                    <div className="relative">
                      <input
                        id="addressLine1"
                        type="text"
                        className={`w-full py-2 px-3 border ${errors.addressLine1 ? 'border-red-300 bg-red-50' : valid ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5ea1db] focus:border-transparent transition duration-200`}
                        placeholder="Street address"
                        {...register('addressLine1')}
                      />
                      {valid && (
                        <CheckCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {errors.addressLine1 && (
                      <p className="text-xs text-red-500 mt-1 font-inter">{errors.addressLine1.message?.toString()}</p>
                    )}
                  </>
                )}
                
                {field === 'addressLine2' && (
                  <>
                    <label className="block text-sm font-medium text-[#104b8d] font-inter" htmlFor="addressLine2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      id="addressLine2"
                      type="text"
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5ea1db] focus:border-transparent transition duration-200"
                      placeholder="Apartment, suite, etc."
                      {...register('addressLine2')}
                    />
                  </>
                )}
                
                {field === 'postcode' && (
                  <>
                    <label className="block text-sm font-medium text-[#104b8d] font-inter" htmlFor="postcode">
                      Postcode
                    </label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <input
                          id="postcode"
                          type="text"
                          className={`w-full py-2 px-3 border ${errors.postcode ? 'border-red-300 bg-red-50' : valid ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5ea1db] focus:border-transparent transition duration-200`}
                          placeholder="Your postcode"
                          {...register('postcode')}
                        />
                        {valid && (
                          <CheckCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handlePostcodeLookup}
                        className="px-3 py-2 text-sm font-medium bg-[#104b8d] text-white rounded-lg hover:bg-[#0d3d75] transition duration-200 whitespace-nowrap"
                      >
                        Find Address
                      </button>
                    </div>
                    {errors.postcode && (
                      <p className="text-xs text-red-500 mt-1 font-inter">{errors.postcode.message?.toString()}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 font-inter">Try "SW1A 1AA" for demo</p>
                  </>
                )}
                
                {field === 'city' && (
                  <>
                    <label className="block text-sm font-medium text-[#104b8d] font-inter" htmlFor="city">
                      City
                    </label>
                    <div className="relative">
                      <input
                        id="city"
                        type="text"
                        className={`w-full py-2 px-3 border ${errors.city ? 'border-red-300 bg-red-50' : valid ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5ea1db] focus:border-transparent transition duration-200`}
                        placeholder="Your city"
                        {...register('city')}
                      />
                      {valid && (
                        <CheckCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1 font-inter">{errors.city.message?.toString()}</p>
                    )}
                  </>
                )}
                
                {field === 'contactNumber' && (
                  <>
                    <label className="block text-sm font-medium text-[#104b8d] font-inter" htmlFor="contactNumber">
                      Contact Number
                    </label>
                    <div className="relative">
                      <input
                        id="contactNumber"
                        type="tel"
                        className={`w-full py-2 px-3 border ${errors.contactNumber ? 'border-red-300 bg-red-50' : valid ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5ea1db] focus:border-transparent transition duration-200`}
                        placeholder="Your phone number"
                        {...register('contactNumber')}
                      />
                      {valid && (
                        <CheckCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {errors.contactNumber && (
                      <p className="text-xs text-red-500 mt-1 font-inter">{errors.contactNumber.message?.toString()}</p>
                    )}
                  </>
                )}
                
                {field === 'email' && (
                  <>
                    <label className="block text-sm font-medium text-[#104b8d] font-inter" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        className={`w-full py-2 px-3 border ${errors.email ? 'border-red-300 bg-red-50' : valid ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5ea1db] focus:border-transparent transition duration-200`}
                        placeholder="Your email address"
                        {...register('email')}
                      />
                      {valid && (
                        <CheckCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1 font-inter">{errors.email.message?.toString()}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 font-inter">We'll never share your email with anyone else</p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }} 
      className="space-y-6 w-full" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Step navigator */}
      <ProgressIndicator 
        steps={formSteps} 
        currentStep={currentStep}
        onClick={handleTabClick}
        completedSteps={completedSteps}
      />

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="overflow-hidden">
          <AnimatePresence exitBeforeEnter>
            {formSteps.map((step, index) => renderFormStep(step, index))}
          </AnimatePresence>
        </div>
      </div>

      {/* Only show Previous button - Next Step is handled by parent */}
      <div className="flex justify-start pt-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToPrevStep();
          }}
          disabled={currentStep === 1}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-all
            ${currentStep === 1 ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-white text-[#104b8d] hover:bg-gray-50 border border-[#104b8d]/20'}
          `}
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Previous
        </button>
      </div>
    </form>
  );
});

export default PersonalInfoSection; 