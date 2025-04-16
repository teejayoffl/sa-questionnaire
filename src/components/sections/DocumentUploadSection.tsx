import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import { useFormContext } from '../../context/FormContext';
import FileUpload from '../common/FileUpload';
import FormInput from '../common/FormInput';
import { motion } from 'framer-motion';

// Import FormTextArea component directly here to fix the missing module error
const FormTextArea: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  tooltip?: string;
  rows?: number;
  className?: string;
  error?: string;
}> = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  tooltip = '',
  rows = 3,
  className = '',
  error = ''
}) => {
  return (
    <div className={`form-field ${className}`}>
      <div className="flex items-center mb-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {required && <span className="ml-1 text-red-500">*</span>}
        
        {tooltip && (
          <div className="ml-2 relative group">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div className="absolute z-10 w-48 p-2 mt-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -left-20 top-6">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`form-textarea block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
          focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
          ${error ? 'border-red-300' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

interface DocumentUploadSectionProps {
  onComplete?: (data: any) => void;
  initialData?: any;
  isConversation?: boolean;
  type: 'employment' | 'property' | 'charity';
}

// Define a type for our form fields
type FormValues = {
  employmentExpensesDetails: string;
  propertyExpensesDetails: string;
  charityDonationDetails: string;
};

// Define interface for section data
interface SectionData {
  details?: string;
  hasDocuments?: boolean;
}

// Define interface for formData that allows string indexing
interface FormDataWithStringIndex {
  [key: string]: any;
  employmentExpenses?: SectionData;
  propertyExpenses?: SectionData;
  charitableDonations?: SectionData;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  onComplete,
  initialData,
  isConversation = false,
  type
}) => {
  const { formData, updateFormData, setSectionCompleted } = useFormContext();
  // Cast formData to our interface that allows string indexing
  const typedFormData = formData as FormDataWithStringIndex;
  
  // Configure title and description based on type
  let title = '';
  let description = '';
  let sectionKey = '';
  
  if (type === 'employment') {
    title = 'Employment Expenses';
    description = 'Please provide details of any employment-related expenses you had during the tax year. These might include professional subscriptions, work uniforms, travel expenses, etc.';
    sectionKey = 'employmentExpenses';
  } else if (type === 'property') {
    title = 'Property Expenses';
    description = 'Please provide details of the expenses related to your rental property. These might include mortgage interest, repairs, insurance, etc.';
    sectionKey = 'propertyExpenses';
  } else {
    title = 'Charitable Donations';
    description = 'Please provide details of your charitable donations made during the tax year. Include the amount donated and whether Gift Aid was used.';
    sectionKey = 'charitableDonations';
  }
  
  // Get details value safely
  const getDetailsValue = (): string => {
    if (sectionKey === 'employmentExpenses' && typedFormData.employmentExpenses?.details) {
      return typedFormData.employmentExpenses.details;
    } else if (sectionKey === 'propertyExpenses' && typedFormData.propertyExpenses?.details) {
      return typedFormData.propertyExpenses.details;
    } else if (sectionKey === 'charitableDonations' && typedFormData.charitableDonations?.details) {
      return typedFormData.charitableDonations.details;
    }
    return '';
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`DocumentUploadSection - ${title} form submitted`);
    
    // Get the text area value safely
    const detailsElement = document.getElementById('details') as HTMLTextAreaElement;
    const detailsValue = detailsElement ? detailsElement.value : '';
    
    // Create a properly typed data object
    const sectionData: SectionData = {
      details: detailsValue,
      hasDocuments: false // Would be true if files were uploaded
    };
    
    // Update form data with the typed object
    const updateData = {
      [sectionKey]: sectionData
    };
    
    updateFormData(updateData);
    
    // Mark section as completed
    setSectionCompleted(sectionKey, true);
    
    // Call onComplete if in conversation mode
    if (isConversation && onComplete) {
      onComplete(updateData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
        <h3 className="font-medium text-blue-700 mb-2 font-inter text-base">{title}</h3>
        <p className="text-sm text-blue-600 font-inter">
          {description}
        </p>
      </div>
      
      <textarea
        id="details"
        className="form-textarea mt-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-inter"
        rows={4}
        placeholder={`Please provide details about your ${title.toLowerCase()}`}
        defaultValue={getDetailsValue()}
      ></textarea>
      
      <div className="border border-blue-100 bg-blue-50 rounded-lg p-3 mt-3">
        <h3 className="text-sm font-medium text-blue-700 mb-2 font-inter">Supporting Documents</h3>
        <p className="text-xs text-blue-600 mb-3 font-inter">
          Upload copies of your receipts or documentation to support your claim.
        </p>
        <button 
          type="button" 
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-inter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
          Upload Document
        </button>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button 
          type="submit" 
          variant="primary"
          className="action-button py-2.5 px-5"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

export default DocumentUploadSection; 