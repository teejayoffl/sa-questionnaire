import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useFormContext } from '../../context/FormContext';
import { Button, FormInput, FormCheckbox, Accordion, AccordionItem, FormSelect, FormTextArea, FileUpload } from "../common";
import { DocumentIcon, CurrencyPoundIcon, CalculatorIcon, CheckCircleIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

// Interface for form values
interface SelfEmploymentFormValues {
  isSelfEmployed: boolean;
  accountPreparationOption: 'self' | 'wis' | '';
  businessName: string;
  businessDescription: string;
  businessStartDate: string;
  utr: string;
  accountingMethod: string;
  turnover: string;
  expenses: Record<string, string>;
  netProfit: string;
  taxDeductions: string[];
  documents: string[];
  additionalNotes: string;
  [key: string]: any;
}

// Props interface
interface SelfEmploymentSectionProps {
  onComplete: (data: any) => void;
}

// Ref interface
export interface SelfEmploymentSectionRef {
  submitForm: () => void;
}

// Expense categories
const EXPENSE_CATEGORIES = [
  { id: 'officeCosts', label: 'Office Costs', description: 'Stationery, phone, internet' },
  { id: 'travelCosts', label: 'Travel and Vehicle', description: 'Business travel, fuel, vehicle insurance' },
  { id: 'staffCosts', label: 'Staff Costs', description: 'Salaries, wages, and subcontractor costs' },
  { id: 'premisesCosts', label: 'Premises Costs', description: 'Rent, rates, utilities for business premises' },
  { id: 'advertisingCosts', label: 'Advertising', description: 'Marketing and promotional costs' },
  { id: 'insuranceCosts', label: 'Insurance', description: 'Business insurance policies' },
  { id: 'legalCosts', label: 'Legal and Financial', description: 'Accountant, legal, bank charges' },
  { id: 'equipmentCosts', label: 'Equipment', description: 'Tools and equipment under £1,000' },
  { id: 'otherCosts', label: 'Other Expenses', description: 'Any other allowable business expenses' }
];

// Tax deduction options
const TAX_DEDUCTION_OPTIONS = [
  { id: 'homeworking', label: 'Working from Home Allowance', description: 'Simplified flat rate for home working' },
  { id: 'annualInvestmentAllowance', label: 'Annual Investment Allowance', description: 'For equipment, machinery and business vehicles' },
  { id: 'structuresBuildingsAllowance', label: 'Structures & Buildings Allowance', description: 'For construction and renovation of business premises' },
  { id: 'tradingAllowance', label: 'Trading Allowance', description: 'Tax-free allowance of £1,000 for small businesses' }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      when: "beforeChildren" 
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

// Component
const SelfEmploymentSection = forwardRef<SelfEmploymentSectionRef, SelfEmploymentSectionProps>(
  (props, ref) => {
    const { onComplete } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showTaxPlanning, setShowTaxPlanning] = useState(false);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [calculatedProfit, setCalculatedProfit] = useState('0');

    // Form setup
    const { 
      handleSubmit, 
      watch, 
      setValue,
      control,
      register,
      formState: { errors } 
    } = useForm<SelfEmploymentFormValues>({
      defaultValues: {
        isSelfEmployed: formData.isSelfEmployed || false,
        accountPreparationOption: formData.accountPreparationOption || '',
        businessName: formData.businessName || '',
        businessDescription: formData.businessDescription || '',
        businessStartDate: formData.businessStartDate || '',
        utr: formData.utr || '',
        accountingMethod: formData.accountingMethod || 'cash',
        turnover: formData.turnover || '',
        expenses: formData.expenses || {},
        netProfit: formData.netProfit || '',
        taxDeductions: formData.taxDeductions || [],
        documents: formData.documents || [],
        additionalNotes: formData.additionalNotes || ''
      }
    });

    const isSelfEmployed = watch("isSelfEmployed");
    const accountPreparationOption = watch("accountPreparationOption");
    const turnover = watch("turnover");
    const expenses = watch("expenses");

    // Handle account preparation option change
    const handleOptionChange = (option: 'self' | 'wis') => {
      setValue("accountPreparationOption", option);
    };

    // Calculate net profit when turnover or expenses change
    React.useEffect(() => {
      if (turnover) {
        const turnoverValue = parseFloat(turnover) || 0;
        const totalExpenses = Object.values(expenses || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        const profit = Math.max(0, turnoverValue - totalExpenses).toFixed(2);
        setCalculatedProfit(profit);
        setValue("netProfit", profit);
      }
    }, [turnover, expenses, setValue]);

    // Form submission handler
    const onSubmit = (data: SelfEmploymentFormValues) => {
      setIsSubmitting(true);
      
      updateFormData({
        ...data,
        netProfit: calculatedProfit
      });

      setSectionCompleted('selfEmployment', true);
      
      if (onComplete) {
        onComplete(data);
      }
      
      setIsSubmitting(false);
    };

    // Input change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      setValue(name as any, newValue);
    };

    // Expose submit method via ref
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)()
    }));

    return (
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        variants={containerVariants}
      >
        <div className="mb-8">
          <motion.h2 
            className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Self Employment Information
          </motion.h2>
          <motion.p className="text-gray-600" variants={itemVariants}>
            Please provide details about your self-employment business, income, and expenses.
          </motion.p>
        </div>

        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <FormCheckbox
              label="I am self-employed"
              name="isSelfEmployed"
              checked={isSelfEmployed}
              onChange={handleInputChange}
            />
          </motion.div>

          {isSelfEmployed && (
            <motion.div 
              className="mt-6 space-y-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">How would you like to prepare your self-employment accounts?</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Client prepares accounts */}
                  <div 
                    className={`relative p-5 rounded-lg cursor-pointer transition-all duration-300 border-2 
                      ${accountPreparationOption === 'self' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'}`}
                    onClick={() => handleOptionChange('self')}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center
                          ${accountPreparationOption === 'self' ? 'border-blue-600' : 'border-gray-400'}`}>
                          {accountPreparationOption === 'self' && (
                            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                          )}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">I'll provide my details</p>
                        <p className="text-sm text-gray-600 mt-1">
                          I have my business income and expenses ready to enter, and WIS will review my supporting documents.
                        </p>
                      </div>
                    </div>
                    {accountPreparationOption === 'self' && (
                      <motion.div 
                        className="absolute -top-3 -right-3 bg-blue-500 text-white px-2 py-1 text-xs rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        Selected
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Option 2: WIS prepares accounts */}
                  <div 
                    className={`relative p-5 rounded-lg cursor-pointer transition-all duration-300 border-2 
                      ${accountPreparationOption === 'wis' 
                        ? 'border-amber-500 bg-amber-50' 
                        : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50'}`}
                    onClick={() => handleOptionChange('wis')}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center
                          ${accountPreparationOption === 'wis' ? 'border-amber-600' : 'border-gray-400'}`}>
                          {accountPreparationOption === 'wis' && (
                            <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                          )}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">WIS to prepare my accounts</p>
                        <p className="text-sm text-gray-600 mt-1">
                          I'd like WIS to prepare my self-employment accounts based on my documents.
                        </p>
                        <p className="text-xs text-amber-600 mt-1 font-medium">Premium service - requires document upload</p>
                      </div>
                    </div>
                    {accountPreparationOption === 'wis' && (
                      <motion.div 
                        className="absolute -top-3 -right-3 bg-amber-500 text-white px-2 py-1 text-xs rounded-full flex items-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <SparklesIcon className="h-3 w-3 mr-1" />
                        Premium
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {accountPreparationOption === 'self' && (
                <Accordion defaultOpenIndex={0} allowMultiple={true}>
                  {/* Business Details Section */}
                  <AccordionItem 
                    title="Business Details" 
                    description="Information about your business"
                    icon={<DocumentIcon className="w-5 h-5" />}
                  >
                    <div className="space-y-6 p-6">
                      <FormInput
                        label="Business Name"
                        name="businessName"
                        placeholder="Enter your business name"
                        value={watch("businessName")}
                        onChange={handleInputChange}
                        error={errors.businessName?.message}
                      />

                      <FormTextArea
                        label="Business Description"
                        name="businessDescription"
                        placeholder="Describe your business activity"
                        value={watch("businessDescription")}
                        onChange={(e) => setValue("businessDescription", e.target.value)}
                        error={errors.businessDescription?.message}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Business Start Date"
                          name="businessStartDate"
                          type="date"
                          value={watch("businessStartDate")}
                          onChange={handleInputChange}
                          error={errors.businessStartDate?.message}
                        />

                        <FormInput
                          label="Unique Taxpayer Reference (UTR)"
                          name="utr"
                          placeholder="10 digit number"
                          value={watch("utr")}
                          onChange={handleInputChange}
                          error={errors.utr?.message}
                        />
                      </div>

                      <Controller
                        name="accountingMethod"
                        control={control}
                        render={({ field }) => (
                          <FormSelect
                            label="Accounting Method"
                            name="accountingMethod"
                            options={[
                              { value: 'cash', label: 'Cash Basis' },
                              { value: 'accrual', label: 'Traditional (Accruals) Basis' }
                            ]}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            error={errors.accountingMethod?.message}
                            tooltip="Cash basis: Record income when received and expenses when paid. Accruals: Record when invoiced or incurred."
                          />
                        )}
                      />
                    </div>
                  </AccordionItem>

                  {/* Income & Turnover Section */}
                  <AccordionItem 
                    title="Income & Turnover" 
                    description="Details of your business income"
                    icon={<CurrencyPoundIcon className="w-5 h-5" />}
                  >
                    <div className="space-y-6 p-6">
                      <FormInput
                        label="Total Turnover"
                        name="turnover"
                        type="number"
                        placeholder="£0.00"
                        value={watch("turnover")}
                        onChange={handleInputChange}
                        error={errors.turnover?.message}
                        tooltip="Total income received from your business before expenses"
                      />

                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                          <span className="mr-2">💡</span> Tax Tip
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Include all income from your business, including cash payments, bank transfers, and online payments. 
                          Don't forget to include any income paid to you personally for your business services.
                        </p>
                      </div>
                    </div>
                  </AccordionItem>

                  {/* Expenses Section */}
                  <AccordionItem 
                    title="Business Expenses" 
                    description="Track your deductible business expenses"
                    icon={<DocumentIcon className="w-5 h-5" />}
                  >
                    <div className="space-y-6 p-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-2">Allowable Business Expenses</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Enter expenses that are wholly and exclusively for business purposes.
                        </p>

                        <div className="space-y-4">
                          {EXPENSE_CATEGORIES.map(category => (
                            <div key={category.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                              <FormInput
                                label={category.label}
                                name={`expenses.${category.id}`}
                                type="number"
                                placeholder="£0.00"
                                value={watch(`expenses.${category.id}`) || ''}
                                onChange={handleInputChange}
                                tooltip={category.description}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="text-green-800 font-medium">Net Profit</p>
                          <p className="text-sm text-green-700">(Turnover minus expenses)</p>
                        </div>
                        <div className="text-xl font-bold text-green-700 bg-white py-2 px-4 rounded-lg shadow-sm">
                          £{calculatedProfit}
                        </div>
                      </div>
                    </div>
                  </AccordionItem>

                  {/* Tax Deductions Section */}
                  <AccordionItem 
                    title="Tax Deductions & Allowances" 
                    description="Claim additional tax relief and allowances"
                    icon={<CalculatorIcon className="w-5 h-5" />}
                  >
                    <div className="space-y-6 p-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Select any additional tax deductions or allowances you wish to claim:
                      </p>

                      <div className="space-y-4">
                        {TAX_DEDUCTION_OPTIONS.map(option => (
                          <div key={option.id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors duration-150 shadow-sm">
                            <div className="pt-0.5">
                              <input
                                type="checkbox"
                                id={option.id}
                                {...register(`taxDeductions`)}
                                value={option.id}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label htmlFor={option.id} className="font-medium text-gray-800 block">
                                {option.label}
                              </label>
                              <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                        <h4 className="text-sm font-semibold text-amber-800">Did you know?</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          If you work from home, you may be able to claim a proportion of your household costs as business expenses, 
                          or use the simplified working from home allowance.
                        </p>
                      </div>
                    </div>
                  </AccordionItem>

                  {/* Document Upload Section */}
                  <AccordionItem 
                    title="Supporting Documents" 
                    description="Upload invoices, receipts and other evidence"
                    icon={<DocumentIcon className="w-5 h-5" />}
                  >
                    <div className="space-y-6 p-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Upload supporting documents for your self-employment income and expenses. 
                        These might include invoices, receipts, bank statements, etc.
                      </p>

                      <FileUpload
                        label="Upload Documents"
                        acceptedFileTypes="image/*, application/pdf"
                        onChange={(file) => {
                          // Convert File to string[] for storage
                          if (file) {
                            setValue("documents", [file.name]);
                          } else {
                            setValue("documents", []);
                          }
                        }}
                      />

                      <div className="mt-2 text-sm text-gray-500">
                        Accepted file types: Images, PDFs (up to 10MB each)
                      </div>

                      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex">
                          <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                          <h4 className="text-sm font-semibold text-blue-800">Recommended Documents</h4>
                        </div>
                        <ul className="mt-2 text-sm text-blue-700 ml-7 list-disc">
                          <li>Business bank statements</li>
                          <li>Invoices issued to customers</li>
                          <li>Receipts for business expenses</li>
                          <li>Evidence of business mileage</li>
                          <li>Home working calculation (if applicable)</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionItem>

                  {/* Tax Planning Section */}
                  <AccordionItem 
                    title="Tax Planning" 
                    description="Optimize your tax position"
                    icon={<CalculatorIcon className="w-5 h-5" />}
                  >
                    <div className="space-y-6 p-6">
                      <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <div className="flex-shrink-0 mt-0.5">
                          <input
                            id="taxPlanning"
                            name="taxPlanning"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            onChange={(e) => setShowTaxPlanning(e.target.checked)}
                            checked={showTaxPlanning}
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="taxPlanning" className="font-medium text-gray-700">
                            I'm interested in tax planning strategies
                          </label>
                          <p className="text-sm text-gray-500">
                            Get personalized tax optimization recommendations
                          </p>
                        </div>
                      </div>

                      {showTaxPlanning && (
                        <div className="mt-4 space-y-4">
                          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <h4 className="font-medium text-gray-800">Pension Contributions</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              As a self-employed person, you can get tax relief on pension contributions. 
                              Consider setting up a personal pension to reduce your tax bill.
                            </p>
                          </div>

                          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <h4 className="font-medium text-gray-800">Business Structure</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Depending on your income level, it might be more tax-efficient to operate as a limited company 
                              rather than a sole trader.
                            </p>
                          </div>

                          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <h4 className="font-medium text-gray-800">Income Timing</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              If your income fluctuates, consider timing your income and expenses to optimize tax efficiency 
                              across tax years.
                            </p>
                          </div>

                          <div className="mt-4 text-center">
                            <Button
                              type="button"
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                            >
                              Schedule a tax planning consultation
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionItem>
                </Accordion>
              )}

              {accountPreparationOption === 'wis' && (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* WIS to prepare accounts section */}
                  <div className="p-6 bg-gradient-to-br from-amber-50 via-amber-50 to-yellow-50 rounded-xl border border-amber-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <SparklesIcon className="h-6 w-6 text-amber-500 mr-2" />
                      <h3 className="text-lg font-semibold text-amber-800">WIS Account Preparation Service</h3>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      Our team of expert accountants will prepare your self-employment accounts based on the 
                      documents you provide. We'll ensure everything is accurate and optimized for tax efficiency.
                    </p>

                    <div className="space-y-6">
                      {/* Basic Business Details */}
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-4">Essential Business Information</h4>
                        
                        <div className="space-y-4">
                          <FormInput
                            label="Business Name"
                            name="businessName"
                            placeholder="Enter your business name"
                            value={watch("businessName")}
                            onChange={handleInputChange}
                            error={errors.businessName?.message}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                              label="Business Start Date"
                              name="businessStartDate"
                              type="date"
                              value={watch("businessStartDate")}
                              onChange={handleInputChange}
                              error={errors.businessStartDate?.message}
                            />

                            <FormInput
                              label="Unique Taxpayer Reference (UTR)"
                              name="utr"
                              placeholder="10 digit number"
                              value={watch("utr")}
                              onChange={handleInputChange}
                              error={errors.utr?.message}
                            />
                          </div>

                          <FormTextArea
                            label="Business Description"
                            name="businessDescription"
                            placeholder="Briefly describe your business activity"
                            value={watch("businessDescription")}
                            onChange={(e) => setValue("businessDescription", e.target.value)}
                            error={errors.businessDescription?.message}
                          />
                        </div>
                      </div>

                      {/* Document Upload */}
                      <div className="bg-white p-5 rounded-lg border border-amber-200 shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                          <DocumentIcon className="h-5 w-5 text-amber-500 mr-2" />
                          Upload Your Financial Documents
                        </h4>
                        
                        <p className="text-sm text-gray-600 mb-4">
                          Please provide as many of the following documents as possible. Our accountants will review these to prepare your accounts.
                        </p>

                        <FileUpload
                          label="Upload Documents"
                          acceptedFileTypes="image/*, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          onChange={(file) => {
                            if (file) {
                              setValue("documents", [file.name]);
                            } else {
                              setValue("documents", []);
                            }
                          }}
                          tooltip="Upload bank statements, invoices, receipts, spreadsheets, etc."
                        />

                        <div className="mt-4 bg-amber-50 p-4 rounded-lg">
                          <h5 className="text-sm font-semibold text-amber-800 mb-2">Required Documents</h5>
                          <ul className="text-sm text-amber-700 ml-5 list-disc space-y-1">
                            <li>Business bank statements (for the entire tax year)</li>
                            <li>Sales invoices issued to customers</li>
                            <li>Purchase receipts and expenses</li>
                            <li>Previous year's accounts (if available)</li>
                            <li>Any accountant prepared reports</li>
                          </ul>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-4">Additional Notes for Your Accountant</h4>
                        
                        <FormTextArea
                          label="Any specific information or questions"
                          name="additionalNotes"
                          placeholder="Add any details that might help us prepare your accounts, e.g., changes in business circumstances, specific tax concerns, etc."
                          value={watch("additionalNotes")}
                          onChange={(e) => setValue("additionalNotes", e.target.value)}
                        />
                      </div>

                      {/* Service Benefits */}
                      <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                        <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Benefits of WIS Account Preparation
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          <li className="flex items-center text-sm text-amber-700">
                            <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                            Expert accountant review
                          </li>
                          <li className="flex items-center text-sm text-amber-700">
                            <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                            Maximized tax deductions
                          </li>
                          <li className="flex items-center text-sm text-amber-700">
                            <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                            Compliance with HMRC rules
                          </li>
                          <li className="flex items-center text-sm text-amber-700">
                            <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                            Time-saving solution
                          </li>
                          <li className="flex items-center text-sm text-amber-700">
                            <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                            Reduced risk of errors
                          </li>
                          <li className="flex items-center text-sm text-amber-700">
                            <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                            Personalized tax advice
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!accountPreparationOption && (
                <div className="mt-4 text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-600">Please select how you would like to prepare your accounts to continue.</p>
                </div>
              )}
            </motion.div>
          )}

          {!isSelfEmployed && (
            <motion.div 
              className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-blue-800">Not Self-Employed?</h3>
              <p className="mt-2 text-blue-700">
                If you're not self-employed, please continue to the next section. 
                Your tax return will not include a self-employment section.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Remove the motion.div containing the Save & Continue button and replace with a hidden submit button */}
        <motion.div className="sr-only">
          <Button
            type="submit"
            disabled={isSubmitting || (isSelfEmployed && !accountPreparationOption)}
          >
            Submit
          </Button>
        </motion.div>
      </motion.form>
    );
  }
);

export default SelfEmploymentSection; 