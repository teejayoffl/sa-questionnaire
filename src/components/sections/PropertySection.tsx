import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '../common/FormInput';
import DocumentUploadSection from './DocumentUploadSection';
import { useFormContext } from '../../context/FormContext';
import { motion, AnimatePresence } from 'framer-motion';
// Import relevant icons
import { 
  BuildingLibraryIcon, 
  CurrencyPoundIcon, 
  CalculatorIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
  UserGroupIcon,
  ClipboardDocumentIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

// Define brand colors for easier reference and consistency
const brandColors = {
  royalBlue: '#104b8d',
  metallicBlue: '#5ea1db',
  orange: '#f39200',
  gold: '#f9be29',
};

// Define the shape of the form data for this section
interface PropertyFormValues {
  propertyAddress: string;
  rentalIncomeReceived: string;
  numberOfProperties: string;
  jointOwnership: boolean;
  rentARoom: boolean;
  // New fields for expenses/allowance choice
  usePropertyAllowance: boolean | null; // Use null for unselected initial state
  // Detailed expense categories
  rentRatesInsurance: string;
  propertyRepairs: string;
  loanInterest: string;
  legalFees: string;
  servicesCosts: string;
  replacingItems: string;
  otherExpenses: string;
  // This total is computed from all the above expenses
  totalPropertyExpenses: string;
}

// Update props for the section component
interface PropertySectionProps {
  onComplete: (data: Partial<PropertyFormValues>) => void;
}

// Define the ref interface
export interface PropertySectionRef {
  submitForm: () => void;
}

// --- Accordion Section Helper Component ---
interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  icon?: React.ElementType; // Optional icon
  index?: number;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, children, isOpen, onToggle, icon: Icon, index = 0 }) => (
  <motion.div 
    className="rounded-xl overflow-hidden mb-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
  >
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex justify-between items-center p-4 focus:outline-none transition-all duration-300 ${
        isOpen 
          ? 'bg-gradient-to-r from-[#104b8d]/10 to-[#5ea1db]/5 shadow-sm' 
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center">
        {Icon && (
          <div className={`p-2 rounded-full mr-3 ${
            isOpen 
              ? 'bg-gradient-to-br from-[#104b8d]/20 to-[#5ea1db]/20 text-[#104b8d]' 
              : 'bg-gray-100 text-gray-500'
          }`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <span className={`font-medium ${isOpen ? 'text-[#104b8d]' : 'text-gray-700'}`}>{title}</span>
      </div>
      <div className={`p-1 rounded-full transition-all ${
        isOpen ? 'bg-[#104b8d]/10 text-[#104b8d]' : 'text-gray-400'
      }`}>
        {isOpen ? 
          <ChevronUpIcon className="h-5 w-5" /> : 
          <ChevronDownIcon className="h-5 w-5" />
        }
      </div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 }
          }}
          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="bg-white p-5 border-t border-gray-100"
        >
          <div className="space-y-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Helper component for expense category inputs
interface ExpenseCategoryInputProps {
  name: string;
  control: any;
  label: string;
  tooltip: string;
  icon: React.ElementType;
  placeholder?: string;
}

const ExpenseCategoryInput: React.FC<ExpenseCategoryInputProps> = ({
  name,
  control,
  label,
  tooltip,
  icon: Icon,
  placeholder = "0.00"
}) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
    <div className="flex items-start mb-2">
      <div className="p-2 rounded-full bg-[#104b8d]/10 text-[#104b8d] mr-3">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-medium text-gray-800">{label}</div>
        <div className="text-xs text-gray-500 mt-1">{tooltip}</div>
      </div>
    </div>
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          label=""
          type="number"
          placeholder={placeholder}
          prefix="£"
          {...field}
          value={field.value || ''}
          error={fieldState.error?.message}
        />
      )}
    />
  </div>
);

// Update component to use forwardRef
const PropertySection = forwardRef<PropertySectionRef, PropertySectionProps>(
  function PropertySection(props, ref) {
    const { onComplete } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();
    const [openSection, setOpenSection] = useState<string | null>('propertyDetails');
    const [expandedDetails, setExpandedDetails] = useState(false);

    const {
      control,
      handleSubmit,
      watch,
      formState: { errors },
      setValue,
      trigger,
      getValues
    } = useForm<PropertyFormValues>({
      defaultValues: {
        propertyAddress: formData.propertyAddress || '',
        rentalIncomeReceived: formData.rentalIncomeReceived || '',
        numberOfProperties: formData.numberOfProperties || '1',
        jointOwnership: formData.jointOwnership || false,
        rentARoom: formData.rentARoom || false,
        usePropertyAllowance: formData.usePropertyAllowance ?? null,
        rentRatesInsurance: formData.rentRatesInsurance || '',
        propertyRepairs: formData.propertyRepairs || '',
        loanInterest: formData.loanInterest || '',
        legalFees: formData.legalFees || '',
        servicesCosts: formData.servicesCosts || '',
        replacingItems: formData.replacingItems || '',
        otherExpenses: formData.otherExpenses || '',
        totalPropertyExpenses: formData.totalPropertyExpenses || '',
      },
      mode: 'onChange',
    });

    const useAllowance = watch('usePropertyAllowance');
    const rentRatesInsurance = watch('rentRatesInsurance') || '0';
    const propertyRepairs = watch('propertyRepairs') || '0';
    const loanInterest = watch('loanInterest') || '0';
    const legalFees = watch('legalFees') || '0';
    const servicesCosts = watch('servicesCosts') || '0';
    const replacingItems = watch('replacingItems') || '0';
    const otherExpenses = watch('otherExpenses') || '0';

    // Calculate total expenses whenever any expense changes
    useEffect(() => {
      if (useAllowance === false) {
        const total = [
          rentRatesInsurance,
          propertyRepairs,
          loanInterest,
          legalFees,
          servicesCosts,
          replacingItems,
          otherExpenses
        ].reduce((sum, expense) => sum + (parseFloat(expense) || 0), 0);
        
        setValue('totalPropertyExpenses', total.toFixed(2));
      }
    }, [
      rentRatesInsurance,
      propertyRepairs,
      loanInterest,
      legalFees,
      servicesCosts,
      replacingItems,
      otherExpenses,
      useAllowance,
      setValue
    ]);

    const onSubmit = (data: PropertyFormValues) => {
      const submissionData = {
        ...data,
        usePropertyAllowance: data.usePropertyAllowance ?? false
      };
      
      // Only include expense details if user is not using the property allowance
      if (data.usePropertyAllowance) {
        submissionData.rentRatesInsurance = '';
        submissionData.propertyRepairs = '';
        submissionData.loanInterest = '';
        submissionData.legalFees = '';
        submissionData.servicesCosts = '';
        submissionData.replacingItems = '';
        submissionData.otherExpenses = '';
        submissionData.totalPropertyExpenses = '';
      }
      
      updateFormData(submissionData as Partial<typeof formData>);
      setSectionCompleted('property', true);
      if (onComplete) {
        onComplete(submissionData);
      }
    };

    // Expose submitForm using useImperativeHandle
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)()
    }));

    // Function to toggle accordion sections
    const toggleSection = (sectionName: string) => {
      setOpenSection(openSection === sectionName ? null : sectionName);
    };
    
    // Modified handler for choice cards within accordion
    const handleChoice = (value: boolean | null) => {
      setValue('usePropertyAllowance', value, { shouldValidate: true });
    };

    return (
      <form className="space-y-6" onClick={(e) => e.stopPropagation()}>
        <motion.div 
          className="bg-gradient-to-r from-[#104b8d]/10 to-[#5ea1db]/10 p-5 rounded-xl border border-[#5ea1db]/30 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="font-medium text-[#104b8d] mb-2 text-lg">Property Income</h3>
          <p className="text-sm text-[#104b8d]/80">
            This section is for any income you received from letting property during the tax year.
            Please provide details about your rental properties and income.
          </p>
        </motion.div>

        {/* Accordion 1: Property & Income Details */}
        <AccordionSection
          title="Property & Income Details"
          isOpen={openSection === 'propertyDetails'}
          onToggle={() => toggleSection('propertyDetails')}
          icon={BuildingLibraryIcon}
          index={0}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
                <Controller
                  name="numberOfProperties"
                  control={control}
                  rules={{ required: 'Number of properties is required' }}
                  render={({ field, fieldState }) => (
                    <FormInput 
                      label="Number of Properties"
                      type="number"
                      placeholder="1"
                      tooltip="How many properties did you rent out during the tax year"
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
                <Controller
                  name="rentalIncomeReceived"
                  control={control}
                  rules={{
                    required: 'Rental income is required',
                    pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' }
                  }}
                  render={({ field, fieldState }) => (
                    <FormInput
                      label="Total Rental Income"
                      type="number"
                      placeholder="e.g., 12000"
                      prefix="£"
                      error={fieldState.error?.message}
                      required
                      tooltip="Enter the total gross rental income before any deductions"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
              <Controller
                name="propertyAddress"
                control={control}
                rules={{ required: 'Property address is required' }}
                render={({ field, fieldState }) => (
                  <FormInput 
                    label="Main Property Address"
                    placeholder="e.g., 123 Main Street, Anytown, AN1 2BC"
                    tooltip="If you have multiple properties, enter the address of your main rental property"
                    error={fieldState.error?.message}
                    required
                    {...field}
                  />
                )}
              />
            </div>

            <div className="flex flex-col space-y-2 mt-2">
              <button 
                type="button" 
                onClick={() => setExpandedDetails(!expandedDetails)}
                className="text-[#104b8d] text-sm flex items-center hover:underline"
              >
                {expandedDetails ? 'Hide' : 'Show'} additional details
                {expandedDetails ? 
                  <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                }
              </button>
              
              <AnimatePresence>
                {expandedDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-3 pt-3 border-t border-gray-200"
                  >
                    <div className="flex items-center p-3 bg-blue-50 rounded-md border border-blue-100">
                      <Controller
                        name="jointOwnership"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              id="jointOwnership"
                              className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <div className="ml-3">
                              <label 
                                htmlFor="jointOwnership" 
                                className="text-sm font-medium text-gray-700"
                              >
                                Joint Ownership
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                If you own property jointly, you only need to report your share of the income and expenses
                              </p>
                            </div>
                          </div>
                        )}
                      />
                    </div>

                    <div className="flex items-center p-3 bg-amber-50 rounded-md border border-amber-100">
                      <Controller
                        name="rentARoom"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              id="rentARoom"
                              className="h-4 w-4 mt-1 text-amber-600 border-gray-300 rounded"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <div className="ml-3">
                              <label 
                                htmlFor="rentARoom" 
                                className="text-sm font-medium text-gray-700"
                              >
                                Rent a Room Relief
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                If you let furnished rooms in your home and your total income was less than £7,500 (or £3,750 if let jointly)
                              </p>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </AccordionSection>

        {/* Accordion 2: Expense Calculation Method */}
        <AccordionSection
          title="Expense Calculation Method"
          isOpen={openSection === 'expenseCalculation'}
          onToggle={() => toggleSection('expenseCalculation')}
          icon={CalculatorIcon}
          index={1}
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-lg p-4 mb-4 border border-blue-100">
            <p className="text-sm text-[#104b8d]">
              Choose how to account for your property expenses. You can claim the £1,000 tax-free Property Allowance <span className="font-semibold">OR</span> deduct your actual allowable costs.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              <span className="font-medium">Tip:</span> Claiming the allowance is simpler if your expenses are below £1,000. Listing actual expenses may save you more tax if they exceed £1,000.
            </p>
          </div>
          
          {/* Display validation error for the choice */}
          {errors.usePropertyAllowance && (
            <p className="mb-3 text-sm text-red-600">*{errors.usePropertyAllowance.message}</p>
          )}
          
          {/* Interactive Choice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Option 1: Claim Allowance */}
            <div 
              onClick={() => handleChoice(true)} 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-start space-x-3
                          ${useAllowance === true 
                            ? 'border-[#104b8d] bg-[#104b8d]/5 shadow-md' 
                            : 'border-gray-300 hover:border-[#104b8d]/40 hover:bg-[#104b8d]/5'}`}
            >
              {useAllowance === true 
                 ? <CheckCircleIcon className="h-6 w-6 text-[#104b8d] flex-shrink-0 mt-0.5" />
                 : <div className="h-6 w-6 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5"></div> // Placeholder circle
              }
              <div>
                <span className="font-medium text-gray-800">Claim £1,000 Property Allowance</span>
                <p className="text-xs text-gray-500 mt-1">Simpler option, suitable if actual expenses are low.</p>
              </div>
            </div>

            {/* Option 2: List Actual Expenses */}
             <div 
              onClick={() => handleChoice(false)} 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-start space-x-3
                          ${useAllowance === false 
                            ? 'border-[#104b8d] bg-[#104b8d]/5 shadow-md' 
                            : 'border-gray-300 hover:border-[#104b8d]/40 hover:bg-[#104b8d]/5'}`}
            >
              {useAllowance === false 
                 ? <CheckCircleIcon className="h-6 w-6 text-[#104b8d] flex-shrink-0 mt-0.5" />
                 : <div className="h-6 w-6 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5"></div>
              }
              <div>
                <span className="font-medium text-gray-800">List Actual Expenses</span>
                <p className="text-xs text-gray-500 mt-1">Requires detailing costs, better if expenses exceed £1,000.</p>
              </div>
            </div>
          </div>
         
          {/* Conditionally show expense categories when actual expenses option is selected */}
          <AnimatePresence>
            {useAllowance === false && (
              <motion.div
                key="actualExpensesInput"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto'}}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden border-t border-gray-200 pt-6 mt-4"
              >
                <h4 className="text-lg font-medium text-[#104b8d] mb-4">Property Expenses</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the expenses you've incurred for your rental property. These must be wholly and exclusively for the property business.
                </p>
                
                <div className="space-y-5">
                  {/* Main expense categories grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ExpenseCategoryInput
                      name="rentRatesInsurance"
                      control={control}
                      label="Rent, Rates & Insurance"
                      tooltip="Property rent, council tax, ground rents, and insurance premiums"
                      icon={HomeIcon}
                    />
                    
                    <ExpenseCategoryInput
                      name="propertyRepairs"
                      control={control}
                      label="Repairs & Maintenance"
                      tooltip="Costs of maintaining and repairing your property (not improvements)"
                      icon={WrenchScrewdriverIcon}
                    />
                    
                    <ExpenseCategoryInput
                      name="loanInterest"
                      control={control}
                      label="Loan Interest"
                      tooltip="Interest on loans used to purchase or improve the property"
                      icon={CreditCardIcon}
                    />
                    
                    <ExpenseCategoryInput
                      name="legalFees"
                      control={control}
                      label="Legal & Professional Fees"
                      tooltip="Accountant, legal, and management fees for the property"
                      icon={ClipboardDocumentIcon}
                    />
                    
                    <ExpenseCategoryInput
                      name="servicesCosts"
                      control={control}
                      label="Services & Utilities"
                      tooltip="Costs of services provided to tenants including utilities"
                      icon={UserGroupIcon}
                    />
                    
                    <ExpenseCategoryInput
                      name="replacingItems"
                      control={control}
                      label="Replacing Domestic Items"
                      tooltip="Cost of replacing items like furniture, furnishings, appliances"
                      icon={HomeIcon}
                    />
                    
                    <ExpenseCategoryInput
                      name="otherExpenses"
                      control={control}
                      label="Other Expenses"
                      tooltip="Any other expenses wholly related to your property business"
                      icon={PlusCircleIcon}
                    />
                    
                    {/* Total expenses summary */}
                    <div className="bg-gradient-to-r from-[#104b8d]/10 to-[#5ea1db]/5 rounded-lg p-4 border border-[#104b8d]/20 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-[#104b8d]">Total Expenses</h4>
                          <p className="text-xs text-gray-600 mt-1">Sum of all your allowable expenses</p>
                        </div>
                        <div className="text-xl font-bold text-[#104b8d]">
                          £{getValues('totalPropertyExpenses') || '0.00'}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-[#104b8d]/10 flex items-center">
                        <QuestionMarkCircleIcon className="h-4 w-4 text-[#104b8d]/70 mr-2" />
                        <p className="text-xs text-[#104b8d]/70">
                          {parseFloat(getValues('totalPropertyExpenses') || '0') > 1000 
                            ? 'Your expenses exceed £1,000, so listing them is beneficial.' 
                            : 'Your expenses are below £1,000. Consider using the Property Allowance instead.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Optional Document Upload Section */}
                  <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500"/>
                      Upload Expense Documents (Optional)
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">Upload receipts or records for your property expenses if you have them readily available.</p>
                    <DocumentUploadSection type="property" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AccordionSection>

        {/* Optional Supporting Documents Section */}
        <AccordionSection
          title="Supporting Documents (Optional)"
          isOpen={openSection === 'documents'}
          onToggle={() => toggleSection('documents')}
          icon={DocumentTextIcon}
          index={2}
        >
          <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg p-5 border border-blue-100 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">
                <DocumentTextIcon className="h-6 w-6 text-[#104b8d]" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-base font-medium text-[#104b8d] mb-2">Supporting Documents</h3>
                <p className="text-sm text-[#104b8d]/70 mb-2">
                  Upload copies of rental statements, tenancy agreements, or other relevant documents to help us prepare your return accurately.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <DocumentUploadSection type="property" />
          </div>
        </AccordionSection>
        
        {/* Helpful information section */}
        <motion.div 
          className="mt-6 p-4 bg-gradient-to-r from-[#104b8d]/5 to-[#f9be29]/10 rounded-lg border border-[#f9be29]/20 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-[#f9be29]/20 p-2 rounded-full">
              <QuestionMarkCircleIcon className="h-5 w-5 text-[#f39200]" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-[#104b8d] mb-1">Helpful Information</h3>
              <p className="text-xs text-gray-600">
                For rental income, you only need to pay tax on your profits - what's left after allowable expenses are deducted. Keeping good records throughout the year will make this process easier.
              </p>
            </div>
          </div>
        </motion.div>
      </form>
    );
  }
);

export default PropertySection; 