import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '../common/FormInput';
import FormCheckbox from '../common/FormCheckbox';
import FileUpload from '../common/FileUpload';
import { useFormContext } from '../../context/FormContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

// Define brand colors for easier reference and consistency
const brandColors = {
  royalBlue: '#104b8d',
  metallicBlue: '#5ea1db',
  orange: '#f39200',
  gold: '#f9be29',
};

interface EmploymentSectionProps {
  onComplete?: (data: any) => void;
  initialData?: any;
  isConversation?: boolean;
}

// Define the ref interface
export interface EmploymentSectionRef {
  submitForm: () => void;
}

type FormValues = {
  isEmployed: boolean;
  employerName: string;
  employerPayeReference: string;
  totalPayFromP60: string;
  taxDeducted: string;
  benefitsFromP11D: string;
  // Additional employment details
  tipsAndOtherPayments: string;
  isCompanyDirector: boolean;
  directorshipCeaseDate: string;
  isCloseCompany: boolean;
  isOffPayroll: boolean;
  // Benefits details
  carBenefit: string;
  fuelBenefit: string;
  medicalBenefit: string;
  vouchersBenefit: string;
  goodsBenefit: string;
  accommodationBenefit: string;
  otherBenefits: string;
  expensePayments: string;
  // Expenses
  travelExpenses: string;
  professionalFees: string;
  otherExpenses: string;
};

// Animation variants
const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const formItemVariants = {
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

// Section header component for expandable sections
interface SectionHeaderProps {
  title: string;
  isExpanded: boolean;
  toggleExpand: () => void;
  badgeText?: string;
  badgeColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  isExpanded, 
  toggleExpand, 
  badgeText, 
  badgeColor = "bg-blue-100 text-[#104b8d]" 
}) => (
  <div 
    onClick={toggleExpand}
    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
  >
    <div className="flex items-center">
      <h3 className="font-medium text-gray-800">{title}</h3>
      {badgeText && (
        <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${badgeColor}`}>
          {badgeText}
        </span>
      )}
    </div>
    <div className={`p-1 rounded-full transition-all text-gray-500`}>
      {isExpanded ? 
        <ChevronUpIcon className="h-5 w-5" /> : 
        <ChevronDownIcon className="h-5 w-5" />
      }
    </div>
  </div>
);

// Update to use forwardRef
const EmploymentSection = forwardRef<EmploymentSectionRef, EmploymentSectionProps>(
  function EmploymentSection(props, ref) {
    const { onComplete, initialData, isConversation = false } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();
    
    // State for expandable sections
    const [expandedSections, setExpandedSections] = useState({
      additionalDetails: false,
      benefits: false,
      expenses: false
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };
    
    const {
      handleSubmit,
      setValue,
      control,
      watch,
    } = useForm<FormValues>({
      defaultValues: {
        isEmployed: formData.isEmployed !== undefined ? formData.isEmployed : false,
        employerName: formData.employerName || '',
        employerPayeReference: formData.employerPayeReference || '',
        totalPayFromP60: formData.totalPayFromP60 || '',
        taxDeducted: formData.taxDeducted || '',
        benefitsFromP11D: formData.benefitsFromP11D || '',
        // Additional fields
        tipsAndOtherPayments: formData.tipsAndOtherPayments || '',
        isCompanyDirector: formData.isCompanyDirector || false,
        directorshipCeaseDate: formData.directorshipCeaseDate || '',
        isCloseCompany: formData.isCloseCompany || false,
        isOffPayroll: formData.isOffPayroll || false,
        carBenefit: formData.carBenefit || '',
        fuelBenefit: formData.fuelBenefit || '',
        medicalBenefit: formData.medicalBenefit || '',
        vouchersBenefit: formData.vouchersBenefit || '',
        goodsBenefit: formData.goodsBenefit || '',
        accommodationBenefit: formData.accommodationBenefit || '',
        otherBenefits: formData.otherBenefits || '',
        expensePayments: formData.expensePayments || '',
        travelExpenses: formData.travelExpenses || '',
        professionalFees: formData.professionalFees || '',
        otherExpenses: formData.otherExpenses || '',
      },
      mode: 'onChange',
    });

    const isEmployed = watch('isEmployed');
    const isCompanyDirector = watch('isCompanyDirector');
    const hasBenefits = parseFloat(watch('benefitsFromP11D') || '0') > 0;

    useEffect(() => {
      // Initialize form with existing values
      setValue('isEmployed', formData.isEmployed !== undefined ? formData.isEmployed : false);
      setValue('employerName', formData.employerName || '');
      setValue('employerPayeReference', formData.employerPayeReference || '');
      setValue('totalPayFromP60', formData.totalPayFromP60 || '');
      setValue('taxDeducted', formData.taxDeducted || '');
      setValue('benefitsFromP11D', formData.benefitsFromP11D || '');

      // Additional fields
      setValue('tipsAndOtherPayments', formData.tipsAndOtherPayments || '');
      setValue('isCompanyDirector', formData.isCompanyDirector || false);
      setValue('directorshipCeaseDate', formData.directorshipCeaseDate || '');
      setValue('isCloseCompany', formData.isCloseCompany || false);
      setValue('isOffPayroll', formData.isOffPayroll || false);
      setValue('carBenefit', formData.carBenefit || '');
      setValue('fuelBenefit', formData.fuelBenefit || '');
      setValue('medicalBenefit', formData.medicalBenefit || '');
      setValue('vouchersBenefit', formData.vouchersBenefit || '');
      setValue('goodsBenefit', formData.goodsBenefit || '');
      setValue('accommodationBenefit', formData.accommodationBenefit || '');
      setValue('otherBenefits', formData.otherBenefits || '');
      setValue('expensePayments', formData.expensePayments || '');
      setValue('travelExpenses', formData.travelExpenses || '');
      setValue('professionalFees', formData.professionalFees || '');
      setValue('otherExpenses', formData.otherExpenses || '');
    }, [formData, setValue]);

    const onSubmit = (data: FormValues) => {
      updateFormData({
        isEmployed: data.isEmployed,
        employerName: data.employerName,
        employerPayeReference: data.employerPayeReference,
        totalPayFromP60: data.totalPayFromP60,
        taxDeducted: data.taxDeducted,
        benefitsFromP11D: data.benefitsFromP11D,
        // Additional fields
        tipsAndOtherPayments: data.tipsAndOtherPayments,
        isCompanyDirector: data.isCompanyDirector,
        directorshipCeaseDate: data.directorshipCeaseDate,
        isCloseCompany: data.isCloseCompany,
        isOffPayroll: data.isOffPayroll,
        carBenefit: data.carBenefit,
        fuelBenefit: data.fuelBenefit,
        medicalBenefit: data.medicalBenefit,
        vouchersBenefit: data.vouchersBenefit,
        goodsBenefit: data.goodsBenefit,
        accommodationBenefit: data.accommodationBenefit,
        otherBenefits: data.otherBenefits,
        expensePayments: data.expensePayments,
        travelExpenses: data.travelExpenses,
        professionalFees: data.professionalFees,
        otherExpenses: data.otherExpenses,
      });
      setSectionCompleted('employment', true);
      if (onComplete) {
        onComplete(data);
      }
    };

    // Expose submitForm method using useImperativeHandle
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)()
    }));

    return (
      <form className="space-y-6" onClick={(e) => e.stopPropagation()}>
        <motion.div 
          className="bg-gradient-to-r from-[#104b8d]/10 to-[#5ea1db]/10 p-5 rounded-xl border border-[#5ea1db]/30 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="font-medium text-[#104b8d] mb-2 text-lg">Employment Income</h3>
          <p className="text-sm text-[#104b8d]/80">
            This section relates to any employment income you received during the tax year. 
            This includes salaries, wages, bonuses, and benefits from all employers.
          </p>
        </motion.div>
        
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Controller
            name="isEmployed"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <div className="flex items-center p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow transition-all duration-300">
                <FormCheckbox
                  label="I was employed during the tax year"
                  name={name}
                  checked={value}
                  onChange={onChange}
                />
                <div className="ml-auto">
                  {value ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      <svg className="mr-1.5 h-2 w-2 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      <svg className="mr-1.5 h-2 w-2 text-gray-400" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            )}
          />
        </motion.div>
        
        <AnimatePresence>
          {isEmployed && (
            <motion.div
              key="employment-details"
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: { duration: 0.3 } 
              }}
              className="space-y-6 mt-4"
            >
              {/* Basic Employment Details */}
              <motion.div 
                variants={formItemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Controller
                  name="employerName"
                  control={control}
                  rules={{ required: isEmployed ? 'Employer name is required' : false }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
                      <FormInput
                        label="Employer Name"
                        {...field}
                        placeholder="e.g., Acme Corporation"
                        required={isEmployed}
                        tooltip="The full registered name of your employer"
                        error={error?.message}
                      />
                    </div>
                  )}
                />
                
                <Controller
                  name="employerPayeReference"
                  control={control}
                  rules={{ required: isEmployed ? 'PAYE reference is required' : false }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
                      <FormInput
                        label="Employer PAYE Reference"
                        {...field}
                        placeholder="e.g., 123/AB12345"
                        required={isEmployed}
                        tooltip="This can be found on your payslips or P60. If your employer doesn't have one, enter 'None'"
                        error={error?.message}
                      />
                    </div>
                  )}
                />
              </motion.div>
              
              <motion.div 
                variants={formItemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Controller
                  name="totalPayFromP60"
                  control={control}
                  rules={{ required: isEmployed ? 'Total pay is required' : false }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
                      <FormInput
                        label="Total Pay from P60"
                        {...field}
                        placeholder="e.g., 25000"
                        prefix="£"
                        required={isEmployed}
                        tooltip="Box 1 on your P60 - total earnings before tax as shown on your P60 or P45"
                        error={error?.message}
                      />
                    </div>
                  )}
                />
                
                <Controller
                  name="taxDeducted"
                  control={control}
                  rules={{ required: isEmployed ? 'Tax deducted is required' : false }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
                      <FormInput
                        label="Tax Deducted"
                        {...field}
                        placeholder="e.g., 5000"
                        prefix="£"
                        required={isEmployed}
                        tooltip="Box 2 on your P60 - amount of tax deducted from your pay, as per your P45 or P60"
                        error={error?.message}
                      />
                    </div>
                  )}
                />
              </motion.div>
              
              {/* Additional Employment Details Section - Expandable */}
              <motion.div 
                variants={formItemVariants}
                className="space-y-4"
              >
                <SectionHeader 
                  title="Additional Employment Details"
                  isExpanded={expandedSections.additionalDetails}
                  toggleExpand={() => toggleSection('additionalDetails')}
                  badgeText="Optional"
                />

                <AnimatePresence>
                  {expandedSections.additionalDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <Controller
                          name="tipsAndOtherPayments"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <FormInput
                              label="Tips and Other Payments"
                              {...field}
                              placeholder="e.g., 500"
                              prefix="£"
                              tooltip="Any additional income received directly from customers or clients not included on your P60"
                              error={error?.message}
                            />
                          )}
                        />
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <Controller
                          name="isCompanyDirector"
                          control={control}
                          render={({ field: { onChange, value, name } }) => (
                            <FormCheckbox
                              label="I was a company director during the tax year"
                              name={name}
                              checked={value}
                              onChange={onChange}
                              tooltip="Indicate if you were a director of the company during the tax year"
                            />
                          )}
                        />
                      </div>

                      {isCompanyDirector && (
                        <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <Controller
                              name="directorshipCeaseDate"
                              control={control}
                              render={({ field, fieldState: { error } }) => (
                                <FormInput
                                  label="Date Directorship Ceased (if applicable)"
                                  type="date"
                                  {...field}
                                  tooltip="If you stopped being a director during the tax year, enter the date"
                                  error={error?.message}
                                />
                              )}
                            />
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <Controller
                              name="isCloseCompany"
                              control={control}
                              render={({ field: { onChange, value, name } }) => (
                                <FormCheckbox
                                  label="This was a close company"
                                  name={name}
                                  checked={value}
                                  onChange={onChange}
                                  tooltip="A close company is one controlled by 5 or fewer participants, or by directors"
                                />
                              )}
                            />
                          </div>
                        </div>
                      )}

                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <Controller
                          name="isOffPayroll"
                          control={control}
                          render={({ field: { onChange, value, name } }) => (
                            <FormCheckbox
                              label="This employment was from off-payroll working"
                              name={name}
                              checked={value}
                              onChange={onChange}
                              tooltip="Indicate if your employment was through off-payroll working arrangements (IR35)"
                            />
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Benefits Section */}
              <motion.div 
                variants={formItemVariants}
                className="space-y-4"
              >
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
                  <Controller
                    name="benefitsFromP11D"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormInput
                        label="Total Benefits from P11D (if applicable)"
                        {...field}
                        placeholder="e.g., 1200"
                        prefix="£"
                        tooltip="The total value of benefits reported on your P11D form (e.g., company car, private healthcare)"
                        error={error?.message}
                      />
                    )}
                  />
                </div>

                {/* Expandable Benefits Details Section */}
                <SectionHeader 
                  title="Breakdown of Benefits"
                  isExpanded={expandedSections.benefits}
                  toggleExpand={() => toggleSection('benefits')}
                  badgeText={hasBenefits ? "Recommended" : "Optional"}
                  badgeColor={hasBenefits ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-[#104b8d]"}
                />

                <AnimatePresence>
                  {expandedSections.benefits && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <p className="text-xs text-[#104b8d]">
                          If you received benefits from your employer, these should be listed on your P11D form. 
                          Break down your benefits by category below to ensure accuracy in your tax return.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <Controller
                            name="carBenefit"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Company Car Benefit"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Cash equivalent value of company cars provided by your employer"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <Controller
                            name="fuelBenefit"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Fuel Benefit"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Cash equivalent value of fuel for company cars or vans provided by your employer"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <Controller
                            name="medicalBenefit"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Medical/Dental Insurance"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Cash equivalent value of private medical and dental insurance provided by your employer"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <Controller
                            name="vouchersBenefit"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Vouchers & Credit Cards"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Cash equivalent value of vouchers, credit cards, and excess mileage allowance"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <Controller
                            name="goodsBenefit"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Goods & Assets Provided"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Cash equivalent value of goods and other assets provided by your employer"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <Controller
                            name="accommodationBenefit"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Accommodation Benefit"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Cash equivalent value of accommodation provided by your employer"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <Controller
                            name="otherBenefits"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Other Benefits"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Cash equivalent value of other benefits including interest-free and low-interest loans"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <Controller
                            name="expensePayments"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Expense Payments"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Total amount of expenses payments received and balancing charges"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Expenses Section - Expandable */}
              <motion.div 
                variants={formItemVariants}
                className="space-y-4"
              >
                <SectionHeader 
                  title="Employment Expenses"
                  isExpanded={expandedSections.expenses}
                  toggleExpand={() => toggleSection('expenses')}
                  badgeText="Tax Relief Available"
                  badgeColor="bg-green-100 text-green-800"
                />

                <AnimatePresence>
                  {expandedSections.expenses && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <p className="text-xs text-green-800">
                          You may be eligible for tax relief on expenses that were necessary for your work. 
                          These must be costs incurred wholly, exclusively, and necessarily in the performance of your duties.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <Controller
                            name="travelExpenses"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Travel & Subsistence Expenses"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Costs for necessary business travel and meals during business trips"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <Controller
                            name="professionalFees"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Professional Fees & Subscriptions"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Fees paid to professional bodies approved by HMRC that are necessary for your work"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm md:col-span-2">
                          <Controller
                            name="otherExpenses"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <FormInput
                                label="Other Employment Expenses"
                                {...field}
                                placeholder="0.00"
                                prefix="£"
                                tooltip="Any other allowable expenses or capital allowances not covered above"
                                error={error?.message}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Document Upload Section */}
              <motion.div 
                variants={formItemVariants}
                className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg p-6 border border-blue-100 shadow-sm"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#104b8d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-base font-medium text-[#104b8d] mb-2">Supporting Documents</h3>
                    <p className="text-sm text-[#104b8d]/70 mb-4">
                      Upload copies of your employment documents to help us ensure accuracy.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <FileUpload
                          label="P60 Certificate"
                          acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                          onChange={(file) => console.log('P60 uploaded:', file)}
                        />
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <FileUpload
                          label="P11D Form (if applicable)"
                          acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                          onChange={(file) => console.log('P11D uploaded:', file)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                variants={formItemVariants}
                className="p-3 mt-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-[#104b8d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">
                    Please ensure all employment information matches your documentation
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isEmployed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg"
          >
            <div className="flex items-center text-sm">
              <svg className="h-5 w-5 text-[#104b8d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[#104b8d]">
                If you weren't employed during the tax year, you can proceed to the next section
              </span>
            </div>
          </motion.div>
        )}
      </form>
    );
  }
);

export default EmploymentSection; 