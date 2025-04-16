import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useFormContext } from '../../context/FormContext';
import { Button, FormInput, FormCheckbox, Accordion, AccordionItem, FormSelect, FormTextArea } from "../common";
import { DocumentIcon, CurrencyPoundIcon, BuildingLibraryIcon, HomeIcon, PresentationChartBarIcon, GlobeAltIcon, CalculatorIcon } from '@heroicons/react/24/outline';

// Define the shape of the form data for this section
interface PartnershipFormValues {
  partnershipName: string;
  partnershipDescription: string;
  partnershipUTR: string;
  partnershipAddress: string;
  hasMultiplePartnerships: boolean;
  
  // Partnership Share Details
  shareOfProfitOrLoss: string;
  basisPeriodStartDate: string;
  basisPeriodEndDate: string;
  accountingMethod: 'cash' | 'accrual' | '';
  
  // Income Types
  tradingProfits: string;
  tradingLosses: string;
  ukPropertyProfits: string;
  ukPropertyLosses: string;
  savingsIncome: string;
  savingsTaxDeducted: string;
  dividendsFromUK: string;
  foreignIncome: string;
  foreignTaxPaid: string;
  
  // Adjustments & Claims
  claimOverlapRelief: boolean;
  claimLossRelief: boolean;
  claimCapitalAllowances: boolean;
  hasPrivateUseAdjustments: boolean;
  adjustmentsDetails: string;
  
  // NIC
  isOverNICThreshold: boolean;
  
  // Other
  hasPartnershipStatements: boolean;
  additionalNotes: string;
}

interface PartnershipSectionProps {
  onComplete: (data: Partial<PartnershipFormValues>) => void;
}

// Define ref type
export interface PartnershipSectionRef {
  submitForm: () => void;
}

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

// Update to use forwardRef
const PartnershipSection = forwardRef<PartnershipSectionRef, PartnershipSectionProps>(
  function PartnershipSection(props, ref) {
    const { onComplete } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
      handleSubmit,
      control,
      watch,
      setValue,
      register,
      formState: { errors },
    } = useForm<PartnershipFormValues>({
      defaultValues: {
        partnershipName: formData.partnershipName || '',
        partnershipDescription: formData.partnershipDescription || '',
        partnershipUTR: formData.partnershipUTR || '',
        partnershipAddress: formData.partnershipAddress || '',
        hasMultiplePartnerships: formData.hasMultiplePartnerships || false,
        
        shareOfProfitOrLoss: formData.shareOfProfitOrLoss || '',
        basisPeriodStartDate: formData.basisPeriodStartDate || '',
        basisPeriodEndDate: formData.basisPeriodEndDate || '',
        accountingMethod: formData.accountingMethod || '',
        
        tradingProfits: formData.tradingProfits || '',
        tradingLosses: formData.tradingLosses || '',
        ukPropertyProfits: formData.ukPropertyProfits || '',
        ukPropertyLosses: formData.ukPropertyLosses || '',
        savingsIncome: formData.savingsIncome || '',
        savingsTaxDeducted: formData.savingsTaxDeducted || '',
        dividendsFromUK: formData.dividendsFromUK || '',
        foreignIncome: formData.foreignIncome || '',
        foreignTaxPaid: formData.foreignTaxPaid || '',
        
        claimOverlapRelief: formData.claimOverlapRelief || false,
        claimLossRelief: formData.claimLossRelief || false,
        claimCapitalAllowances: formData.claimCapitalAllowances || false,
        hasPrivateUseAdjustments: formData.hasPrivateUseAdjustments || false,
        adjustmentsDetails: formData.adjustmentsDetails || '',
        
        isOverNICThreshold: formData.isOverNICThreshold || false,
        
        hasPartnershipStatements: formData.hasPartnershipStatements || false,
        additionalNotes: formData.additionalNotes || '',
      },
      mode: 'onChange',
    });
    
    const hasMultiplePartnerships = watch('hasMultiplePartnerships');
    const claimOverlapRelief = watch('claimOverlapRelief');
    const claimLossRelief = watch('claimLossRelief');
    const claimCapitalAllowances = watch('claimCapitalAllowances');
    const hasPrivateUseAdjustments = watch('hasPrivateUseAdjustments');

    // Input change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      setValue(name as any, newValue);
    };

    const onSubmit = (data: PartnershipFormValues) => {
      setIsSubmitting(true);
      updateFormData(data);
      setSectionCompleted('partnership', true);
      if (onComplete) {
        onComplete(data);
      }
      setIsSubmitting(false);
    };

    // Expose submitForm
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)()
    }));

    return (
      <motion.form 
        className="max-w-4xl mx-auto w-full"
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        variants={containerVariants}
      >
        <div className="mb-8">
          <motion.h2 
            className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Partnership Information
          </motion.h2>
          <motion.p className="text-gray-600" variants={itemVariants}>
            Please provide details about your partnership income and related information.
          </motion.p>
        </div>
        
        <motion.div className="space-y-6" variants={containerVariants}>
          <Accordion defaultOpenIndex={0} allowMultiple={true}>
            {/* Section 1: Partnership Details */}
            <AccordionItem 
              title="Partnership Details" 
              description="Basic information about the partnership"
              icon={<BuildingLibraryIcon className="w-5 h-5" />}
            >
              <div className="space-y-6 p-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 mb-6">
                  <p className="text-sm text-blue-700">
                    This section collects essential information about the partnership you're a part of. 
                    If you participate in multiple partnerships, you'll need to complete separate pages for each.
                  </p>
                </div>
                
                <Controller
                  name="partnershipName"
                  control={control}
                  rules={{ required: 'Partnership name is required' }}
                  render={({ field }) => (
                    <FormInput
                      label="Name of Partnership"
                      placeholder="e.g., Smith & Jones Associates"
                      error={errors.partnershipName?.message}
                      required
                      {...field}
                    />
                  )}
                />
                
                <Controller
                  name="partnershipDescription"
                  control={control}
                  render={({ field }) => (
                    <FormTextArea
                      label="Description of Partnership Business Activity"
                      name="partnershipDescription"
                      placeholder="Describe the main business activities of the partnership"
                      error={errors.partnershipDescription?.message}
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  )}
                />
                
                <Controller
                  name="partnershipUTR"
                  control={control}
                  rules={{ 
                    required: 'Partnership UTR is required', 
                    pattern: { value: /^[0-9]{10}$/, message: 'UTR must be 10 digits' } 
                  }}
                  render={({ field }) => (
                    <FormInput
                      label="Partnership UTR (Unique Taxpayer Reference)"
                      placeholder="Enter the 10-digit UTR for the partnership"
                      error={errors.partnershipUTR?.message}
                      required
                      tooltip="This is the partnership's own UTR, not your personal one."
                      {...field}
                    />
                  )}
                />
                
                <Controller
                  name="partnershipAddress"
                  control={control}
                  rules={{ required: 'Partnership address is required' }}
                  render={({ field }) => (
                    <FormTextArea
                      label="Address of Partnership Business"
                      name="partnershipAddress"
                      placeholder="Enter the full address of the partnership"
                      error={errors.partnershipAddress?.message}
                      required
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  )}
                />
                
                <div className="mt-4">
                  <FormCheckbox
                    label="Are you a partner in more than one partnership?"
                    name="hasMultiplePartnerships"
                    checked={hasMultiplePartnerships}
                    onChange={handleInputChange}
                  />
                  
                  {hasMultiplePartnerships && (
                    <motion.div 
                      className="mt-3 ml-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-amber-700">
                        <span className="font-medium">Important:</span> You will need to complete separate SA104 pages for each partnership.
                        Please ensure you have documentation for all partnerships ready.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </AccordionItem>
            
            {/* Section 2: Your Share of Partnership Details */}
            <AccordionItem 
              title="Your Share of Partnership Details" 
              description="Your individual share and accounting period"
              icon={<PresentationChartBarIcon className="w-5 h-5" />}
            >
              <div className="space-y-6 p-6">
                <div className="mb-6">
                  <Controller
                    name="shareOfProfitOrLoss"
                    control={control}
                    rules={{ 
                      required: 'Share of profit/loss is required'
                    }}
                    render={({ field }) => (
                      <FormInput
                        label="Share of Profit or Loss for the tax year (£)"
                        type="number"
                        placeholder="e.g., 15000 (profit) or -2000 (loss)"
                        prefix="£"
                        error={errors.shareOfProfitOrLoss?.message}
                        required
                        tooltip="Enter your individual share of the partnership's profit or loss for the period."
                        {...field}
                      />
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="basisPeriodStartDate"
                    control={control}
                    rules={{ required: 'Start date is required' }}
                    render={({ field }) => (
                      <FormInput
                        label="Basis Period Start Date"
                        type="date"
                        error={errors.basisPeriodStartDate?.message}
                        required
                        tooltip="The start date of the accounting period that forms the basis of your tax return"
                        {...field}
                      />
                    )}
                  />
                  
                  <Controller
                    name="basisPeriodEndDate"
                    control={control}
                    rules={{ required: 'End date is required' }}
                    render={({ field }) => (
                      <FormInput
                        label="Basis Period End Date"
                        type="date"
                        error={errors.basisPeriodEndDate?.message}
                        required
                        tooltip="The end date of the accounting period that forms the basis of your tax return"
                        {...field}
                      />
                    )}
                  />
                </div>
                
                <Controller
                  name="accountingMethod"
                  control={control}
                  rules={{ required: 'Accounting method is required' }}
                  render={({ field }) => (
                    <FormSelect
                      label="Accounting Method used by the Partnership"
                      name="accountingMethod"
                      options={[
                        { value: 'cash', label: 'Cash Basis' },
                        { value: 'accrual', label: 'Traditional Accounting (Accruals Basis)' }
                      ]}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      error={errors.accountingMethod?.message}
                      required
                      tooltip="Cash basis: Record income when received and expenses when paid. Accruals: Record when invoiced or incurred."
                    />
                  )}
                />
                
                <div className="mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                    <span className="mr-2">ℹ️</span> Basis Period Information
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    The basis period is the period of account that ends in the tax year. 
                    For partnerships, this is typically the accounting year that ends in the tax year.
                  </p>
                </div>
              </div>
            </AccordionItem>
            
            {/* Section 3: Partnership Income Types */}
            <AccordionItem 
              title="Partnership Income Types" 
              description="Various income streams from the partnership"
              icon={<CurrencyPoundIcon className="w-5 h-5" />}
            >
              <div className="space-y-6 p-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">Trading or Professional Income</h3>
                  <div className="space-y-4">
                    <Controller
                      name="tradingProfits"
                      control={control}
                      render={({ field }) => (
                        <FormInput
                          label="Your share of trading/professional profits"
                          type="number"
                          placeholder="£0.00"
                          prefix="£"
                          error={errors.tradingProfits?.message}
                          tooltip="Enter your share of the partnership's trading or professional profits"
                          {...field}
                        />
                      )}
                    />
                    
                    <Controller
                      name="tradingLosses"
                      control={control}
                      render={({ field }) => (
                        <FormInput
                          label="Any trading losses to claim or carry forward"
                          type="number"
                          placeholder="£0.00"
                          prefix="£"
                          error={errors.tradingLosses?.message}
                          tooltip="Enter any trading losses you wish to claim or carry forward"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">Partnership UK Property Income</h3>
                  <div className="space-y-4">
                    <Controller
                      name="ukPropertyProfits"
                      control={control}
                      render={({ field }) => (
                        <FormInput
                          label="Your share of UK property profits"
                          type="number"
                          placeholder="£0.00"
                          prefix="£"
                          error={errors.ukPropertyProfits?.message}
                          tooltip="Enter your share of profits from UK property owned by the partnership"
                          {...field}
                        />
                      )}
                    />
                    
                    <Controller
                      name="ukPropertyLosses"
                      control={control}
                      render={({ field }) => (
                        <FormInput
                          label="Your share of UK property losses"
                          type="number"
                          placeholder="£0.00"
                          prefix="£"
                          error={errors.ukPropertyLosses?.message}
                          tooltip="Enter your share of losses from UK property owned by the partnership"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 h-full">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Partnership Savings Income</h3>
                    <div className="space-y-4">
                      <Controller
                        name="savingsIncome"
                        control={control}
                        render={({ field }) => (
                          <FormInput
                            label="Your share of savings income"
                            type="number"
                            placeholder="£0.00"
                            prefix="£"
                            error={errors.savingsIncome?.message}
                            tooltip="Enter your share of interest or other savings income"
                            {...field}
                          />
                        )}
                      />
                      
                      <Controller
                        name="savingsTaxDeducted"
                        control={control}
                        render={({ field }) => (
                          <FormInput
                            label="Tax deducted on savings income"
                            type="number"
                            placeholder="£0.00"
                            prefix="£"
                            error={errors.savingsTaxDeducted?.message}
                            tooltip="Enter any tax already deducted from savings income"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 h-full">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Partnership Dividends & Foreign Income</h3>
                    <div className="space-y-4">
                      <Controller
                        name="dividendsFromUK"
                        control={control}
                        render={({ field }) => (
                          <FormInput
                            label="Your share of dividends from UK companies"
                            type="number"
                            placeholder="£0.00"
                            prefix="£"
                            error={errors.dividendsFromUK?.message}
                            tooltip="Enter your share of dividend income received by the partnership"
                            {...field}
                          />
                        )}
                      />
                      
                      <Controller
                        name="foreignIncome"
                        control={control}
                        render={({ field }) => (
                          <FormInput
                            label="Your share of foreign income"
                            type="number"
                            placeholder="£0.00"
                            prefix="£"
                            error={errors.foreignIncome?.message}
                            tooltip="Enter your share of any income from overseas sources"
                            {...field}
                          />
                        )}
                      />
                      
                      <Controller
                        name="foreignTaxPaid"
                        control={control}
                        render={({ field }) => (
                          <FormInput
                            label="Tax paid on foreign income"
                            type="number"
                            placeholder="£0.00"
                            prefix="£"
                            error={errors.foreignTaxPaid?.message}
                            tooltip="Enter any foreign tax paid on overseas income"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                    <span className="mr-2">💡</span> Tax Tip
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Ensure you accurately report all income types from your partnership. The information should match
                    what's provided on your Partnership Statement (SA800). If in doubt, consult your partnership's accountant.
                  </p>
                </div>
              </div>
            </AccordionItem>
            
            {/* Section 4: Adjustments & Claims */}
            <AccordionItem 
              title="Adjustments & Claims" 
              description="Special tax claims and adjustments"
              icon={<CalculatorIcon className="w-5 h-5" />}
            >
              <div className="space-y-6 p-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">Are you claiming any of the following?</h3>
                  <div className="space-y-3">
                    <FormCheckbox
                      label="Overlap Relief (due to accounting periods)"
                      name="claimOverlapRelief"
                      checked={claimOverlapRelief}
                      onChange={handleInputChange}
                      tooltip="Claim relief for overlap profits when your accounting date changes or you cease trading"
                    />
                    
                    <FormCheckbox
                      label="Loss Relief from prior year(s)"
                      name="claimLossRelief"
                      checked={claimLossRelief}
                      onChange={handleInputChange}
                      tooltip="Offset losses from previous tax years against current profits"
                    />
                    
                    <FormCheckbox
                      label="Capital Allowances on partnership assets"
                      name="claimCapitalAllowances"
                      checked={claimCapitalAllowances}
                      onChange={handleInputChange}
                      tooltip="Claim tax relief for assets purchased for use in the business"
                    />
                    
                    <FormCheckbox
                      label="Private use adjustments"
                      name="hasPrivateUseAdjustments"
                      checked={hasPrivateUseAdjustments}
                      onChange={handleInputChange}
                      tooltip="Adjustments for partnership assets used partly for private purposes"
                    />
                  </div>
                </div>
                
                {(claimOverlapRelief || claimLossRelief || claimCapitalAllowances || hasPrivateUseAdjustments) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Controller
                      name="adjustmentsDetails"
                      control={control}
                      render={({ field }) => (
                        <FormTextArea
                          label="Provide details of any adjustments or claims"
                          name="adjustmentsDetails"
                          placeholder="Please explain the nature of your claims or adjustments, including amounts and applicable tax years"
                          error={errors.adjustmentsDetails?.message}
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                        />
                      )}
                    />
                  </motion.div>
                )}
                
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800">Did you know?</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Claiming capital allowances can significantly reduce your tax liability on business assets.
                    You may be eligible for the Annual Investment Allowance (AIA), which allows 100% tax relief 
                    on qualifying expenditure up to the annual limit.
                  </p>
                </div>
              </div>
            </AccordionItem>
            
            {/* Section 5: Class 4 National Insurance Contributions */}
            <AccordionItem 
              title="Class 4 National Insurance Contributions" 
              description="NIC payable on partnership profits"
              icon={<HomeIcon className="w-5 h-5" />}
            >
              <div className="space-y-6 p-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Were your partnership profits over the Class 4 NIC threshold (£12,570)?
                  </h3>
                  <div className="flex flex-col space-y-3">
                    <div 
                      className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 border ${watch('isOverNICThreshold') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                      onClick={() => setValue('isOverNICThreshold', true)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${watch('isOverNICThreshold') ? 'border-blue-600' : 'border-gray-400'}`}>
                            {watch('isOverNICThreshold') && (
                              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                            )}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">Yes — Class 4 NIC payable on profits</p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 border ${watch('isOverNICThreshold') === false ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                      onClick={() => setValue('isOverNICThreshold', false)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${watch('isOverNICThreshold') === false ? 'border-blue-600' : 'border-gray-400'}`}>
                            {!watch('isOverNICThreshold') && (
                              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                            )}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">No — No Class 4 NIC payable</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                    <span className="mr-2">ℹ️</span> About Class 4 NICs
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Class 4 National Insurance is payable on profits between the lower threshold (£12,570) 
                    and upper threshold (£50,270). The rate is 9% on profits between these thresholds, 
                    and 2% on profits above the upper threshold.
                  </p>
                </div>
              </div>
            </AccordionItem>
            
            {/* Section 6 & 7: Other Information and Declaration */}
            <AccordionItem 
              title="Other Information & Declaration" 
              description="Additional notes and partnership statements"
              icon={<DocumentIcon className="w-5 h-5" />}
            >
              <div className="space-y-6 p-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Have you received any Partnership Statements (SA800) from the Partnership?
                  </h3>
                  <div className="flex flex-col space-y-3">
                    <div 
                      className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 border ${watch('hasPartnershipStatements') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                      onClick={() => setValue('hasPartnershipStatements', true)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${watch('hasPartnershipStatements') ? 'border-blue-600' : 'border-gray-400'}`}>
                            {watch('hasPartnershipStatements') && (
                              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                            )}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">Yes</p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 border ${watch('hasPartnershipStatements') === false ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                      onClick={() => setValue('hasPartnershipStatements', false)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${watch('hasPartnershipStatements') === false ? 'border-blue-600' : 'border-gray-400'}`}>
                            {watch('hasPartnershipStatements') === false && (
                              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                            )}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">No</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {watch('hasPartnershipStatements') && (
                  <motion.div 
                    className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-amber-700">
                      <span className="font-medium">Important:</span> Please submit a copy of your Partnership Statement (SA800)
                      as supporting documentation when you file your tax return.
                    </p>
                  </motion.div>
                )}
                
                <Controller
                  name="additionalNotes"
                  control={control}
                  render={({ field }) => (
                    <FormTextArea
                      label="Any additional notes or information for HMRC"
                      name="additionalNotes"
                      placeholder="Add any relevant information that may help with the processing of your partnership tax return"
                      error={errors.additionalNotes?.message}
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  )}
                />
                
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                    <span className="mr-2">💡</span> Tip
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Providing clear and comprehensive information in this section can help avoid HMRC queries
                    and ensure your partnership tax return is processed correctly.
                  </p>
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </motion.div>
        
        {/* Hidden submit button for form submission */}
        <div className="sr-only">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </motion.form>
    );
  }
);

export default PartnershipSection; 