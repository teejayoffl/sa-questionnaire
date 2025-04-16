import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { useFormContext } from '../../context/FormContext';
import Button from '../common/Button';
import { ChevronRightIcon, PencilIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface SummarySectionProps {
  onComplete: () => void;
}

export interface SummarySectionRef {
  submitForm: () => void;
}

// Animation variants for cards with staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  }
};

const SummarySection = forwardRef<SummarySectionRef, SummarySectionProps>(
  function SummarySection(props, ref) {
    const { onComplete } = props;
    const { formData } = useFormContext();
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [validation, setValidation] = useState({
      personalInfo: true,
      incomeInfo: true,
      taxReliefs: true
    });
    
    const isComplete = () => {
      const isPersonalInfoValid = Boolean(formData.fullName && formData.nationalInsuranceNumber && formData.utr);
      const isIncomeInfoValid = Array.isArray(formData.selectedIncomeTypes) && formData.selectedIncomeTypes.length > 0;
      
      return isPersonalInfoValid && isIncomeInfoValid;
    };

    const triggerSubmit = () => {
      setSubmitAttempted(true);
      
      const isPersonalInfoValid = Boolean(formData.fullName && formData.nationalInsuranceNumber && formData.utr);
      const isIncomeInfoValid = Array.isArray(formData.selectedIncomeTypes) && formData.selectedIncomeTypes.length > 0;
      
      setValidation({
        personalInfo: isPersonalInfoValid,
        incomeInfo: isIncomeInfoValid,
        taxReliefs: true
      });

      if (isPersonalInfoValid && isIncomeInfoValid) {
        console.log("Summary section validation passed. Triggering onComplete.");
        if (onComplete) {
          onComplete();
        }
      } else {
        console.log("Summary section validation failed.");
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: triggerSubmit
    }));

    const formatIncomeTypes = () => {
      const incomeTypes = formData.selectedIncomeTypes || [];
      if (incomeTypes.length === 0) return 'None selected';
      
      const incomeMap: Record<string, string> = {
        'employment': 'Employment Income',
        'selfEmployment': 'Self-Employment',
        'property': 'Property Income',
        'partnership': 'Partnership',
        'foreignIncome': 'Foreign Income',
        'capitalGains': 'Capital Gains',
        'otherIncome': 'Other Income'
      };
      
      return incomeTypes.map(type => incomeMap[type] || type).join(', ');
    };
    
    const formatTaxReliefs = () => {
      const taxReliefs = formData.selectedTaxReliefs || [];
      if (taxReliefs.length === 0) return 'None selected';
      
      const reliefMap: Record<string, string> = {
        'pension': 'Pension Contributions',
        'charity': 'Charitable Donations',
        'investmentSchemes': 'Investment Schemes',
        'loanInterest': 'Loan Interest Relief',
        'marriageAllowance': 'Marriage Allowance'
      };
      
      return taxReliefs.map(type => reliefMap[type] || type).join(', ');
    };

    return (
      <div 
        className="space-y-6 overflow-y-auto custom-scrollbar pr-2" 
        style={{ maxHeight: 'calc(100vh - 280px)' }}
      >
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 border border-green-200 rounded-xl shadow-sm"
        >
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-green-800 font-medium font-inter">Almost Done!</p>
              <p className="text-sm text-green-700 font-inter">
                Please review your information below. Once you submit, your accountant will review this information to prepare your tax return.
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className={`border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 
              ${!validation.personalInfo && submitAttempted ? 'border-red-300 bg-red-50' : 'border-blue-100'}`}
          >
            <div className={`px-5 py-3 border-b flex items-center justify-between
              ${!validation.personalInfo && submitAttempted 
                ? 'bg-red-50 border-red-200' 
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}
            >
              <h3 className={`text-lg font-medium flex items-center font-inter
                ${!validation.personalInfo && submitAttempted ? 'text-red-800' : 'text-blue-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 
                  ${!validation.personalInfo && submitAttempted ? 'text-red-600' : 'text-blue-600'}`} 
                  viewBox="0 0 20 20" fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Personal Information
              </h3>
              {!validation.personalInfo && submitAttempted && (
                <span className="text-sm text-red-600 font-inter">Required information missing</span>
              )}
              <button 
                type="button"
                className="text-xs flex items-center px-2 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-inter"
                onClick={() => {
                  console.log('Navigate to edit personal info');
                }}
              >
                <PencilIcon className="h-3.5 w-3.5 mr-1" />
                Edit
              </button>
            </div>
            <div className="p-5 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Full Name</p>
                  <p className="font-medium text-gray-800 font-inter">{formData.fullName || 'Not provided'}</p>
                </div>
                <div className="group">
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">National Insurance Number</p>
                  <p className="font-medium text-gray-800 font-inter">{formData.nationalInsuranceNumber || 'Not provided'}</p>
                </div>
                <div className="group">
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">UTR</p>
                  <p className="font-medium text-gray-800 font-inter">{formData.utr || 'Not provided'}</p>
                </div>
                <div className="group">
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Date of Birth</p>
                  <p className="font-medium text-gray-800 font-inter">{formData.dateOfBirth || 'Not provided'}</p>
                </div>
                <div className="group md:col-span-2">
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Address</p>
                  <p className="font-medium text-gray-800 font-inter">{formData.address || 'Not provided'}</p>
                </div>
                <div className="group">
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Contact Number</p>
                  <p className="font-medium text-gray-800 font-inter">{formData.contactNumber || 'Not provided'}</p>
                </div>
                <div className="group">
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Email</p>
                  <p className="font-medium text-gray-800 font-inter">{formData.email || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300
              ${!validation.incomeInfo && submitAttempted ? 'border-red-300 bg-red-50' : 'border-blue-100'}`}
          >
            <div className={`px-5 py-3 border-b flex items-center justify-between
              ${!validation.incomeInfo && submitAttempted
                ? 'bg-red-50 border-red-200' 
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}
            >
              <h3 className={`text-lg font-medium flex items-center font-inter
                ${!validation.incomeInfo && submitAttempted ? 'text-red-800' : 'text-blue-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2
                  ${!validation.incomeInfo && submitAttempted ? 'text-red-600' : 'text-blue-600'}`} 
                  viewBox="0 0 20 20" fill="currentColor"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                Income Sources
              </h3>
              {!validation.incomeInfo && submitAttempted && (
                <span className="text-sm text-red-600 font-inter">Please select at least one income source</span>
              )}
              <button 
                type="button"
                className="text-xs flex items-center px-2 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-inter"
                onClick={() => {
                  console.log('Navigate to edit income sources');
                }}
              >
                <PencilIcon className="h-3.5 w-3.5 mr-1" />
                Edit
              </button>
            </div>
            <div className="p-5 bg-white">
              <div className="space-y-4">
                <div className="group">
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Selected Income Types</p>
                  <p className="font-medium text-gray-800 font-inter">{formatIncomeTypes()}</p>
                </div>
                
                {formData.selectedIncomeTypes?.includes('employment') && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2 font-inter">Employment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="group">
                        <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Employer Name</p>
                        <p className="font-medium text-gray-800 font-inter">{formData.employerName || 'Not provided'}</p>
                      </div>
                      <div className="group">
                        <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">PAYE Reference</p>
                        <p className="font-medium text-gray-800 font-inter">{formData.employerPayeReference || 'Not provided'}</p>
                      </div>
                      <div className="group">
                        <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Total Pay from P60</p>
                        <p className="font-medium text-gray-800 font-inter">{formData.totalPayFromP60 ? `£${formData.totalPayFromP60}` : 'Not provided'}</p>
                      </div>
                      <div className="group">
                        <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Tax Deducted</p>
                        <p className="font-medium text-gray-800 font-inter">{formData.taxDeducted ? `£${formData.taxDeducted}` : 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.selectedIncomeTypes?.includes('selfEmployment') && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2 font-inter">Self-Employment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="group">
                        <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Business Name</p>
                        <p className="font-medium text-gray-800 font-inter">{formData.businessName || 'Not provided'}</p>
                      </div>
                      <div className="group">
                        <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Business Income</p>
                        <p className="font-medium text-gray-800 font-inter">{formData.businessIncome ? `£${formData.businessIncome}` : 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.selectedIncomeTypes?.includes('property') && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2 font-inter">Property Income Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="group md:col-span-2">
                        <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Property Address</p>
                        <p className="font-medium text-gray-800 font-inter">{formData.propertyAddress || 'Not provided'}</p>
                      </div>
                      <div className="group">
                        <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Rental Income Received</p>
                        <p className="font-medium text-gray-800 font-inter">{formData.rentalIncomeReceived ? `£${formData.rentalIncomeReceived}` : 'Not provided'}</p>
                      </div>
                      <div className="group">
                        <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Allowable Expenses</p>
                        <p className="font-medium text-gray-800 font-inter">{formData.propertyAllowableExpenses ? `£${formData.propertyAllowableExpenses}` : (formData.usePropertyAllowance ? '£1000 Allowance Claimed' : 'Not provided')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.selectedIncomeTypes?.includes('partnership') && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2 font-inter">Partnership Income Details</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="group">
                          <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Partnership Name</p>
                          <p className="font-medium text-gray-800 font-inter">{formData.partnershipName || 'Not provided'}</p>
                        </div>
                        <div className="group">
                          <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Share of Profit/Loss</p>
                          <p className="font-medium text-gray-800 font-inter">{formData.shareOfProfitOrLoss ? `£${formData.shareOfProfitOrLoss}` : 'Not provided'}</p>
                        </div>
                      </div>
                  </div>
                )}

                {formData.selectedIncomeTypes?.includes('foreignIncome') && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2 font-inter">Foreign Income Details</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="group">
                          <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Type of Income</p>
                          <p className="font-medium text-gray-800 font-inter">{formData.typeOfIncome || 'Not provided'}</p>
                        </div>
                        <div className="group">
                          <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Amount Before Tax</p>
                          <p className="font-medium text-gray-800 font-inter">{formData.amountBeforeForeignTax ? `£${formData.amountBeforeForeignTax}` : 'Not provided'}</p>
                        </div>
                     </div>
                  </div>
                )}

                {formData.selectedIncomeTypes?.includes('capitalGains') && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2 font-inter">Capital Gains Details</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="group">
                          <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Asset Description</p>
                          <p className="font-medium text-gray-800 font-inter">{formData.assetDescription || 'Not provided'}</p>
                        </div>
                        <div className="group">
                          <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Proceeds from Disposal</p>
                          <p className="font-medium text-gray-800 font-inter">{formData.proceedsFromDisposal ? `£${formData.proceedsFromDisposal}` : 'Not provided'}</p>
                        </div>
                     </div>
                  </div>
                )}

                {formData.selectedIncomeTypes?.includes('otherIncome') && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2 font-inter">Other Income Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="group">
                          <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Type of Income</p>
                          <p className="font-medium text-gray-800 font-inter">{formData.otherIncomeType || 'Not provided'}</p>
                        </div>
                        <div className="group">
                          <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Amount</p>
                          <p className="font-medium text-gray-800 font-inter">{formData.otherIncomeAmount ? `£${formData.otherIncomeAmount}` : 'Not provided'}</p>
                        </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-blue-100 flex items-center justify-between">
              <h3 className="text-lg font-medium text-blue-800 flex items-center font-inter">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                Tax Reliefs
              </h3>
              <button 
                type="button"
                className="text-xs flex items-center px-2 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-inter"
                onClick={() => {
                  console.log('Navigate to edit tax reliefs');
                }}
              >
                <PencilIcon className="h-3.5 w-3.5 mr-1" />
                Edit
              </button>
            </div>
            <div className="p-5 bg-white">
              <div className="space-y-4">
                <div className="group">
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Selected Tax Reliefs</p>
                  <p className="font-medium text-gray-800 font-inter">{formatTaxReliefs()}</p>
                </div>

                {formData.selectedTaxReliefs?.includes('pension') && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2 font-inter">Pension Contributions</h4>
                    <div className="group">
                      <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Total Contributions</p>
                      <p className="font-medium text-gray-800 font-inter">{formData.pensionContributions ? `£${formData.pensionContributions}` : 'Not provided'}</p>
                    </div>
                  </div>
                )}

                {formData.selectedTaxReliefs?.includes('charity') && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2 font-inter">Charitable Donations</h4>
                    <div className="group">
                      <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Total Donations</p>
                      <p className="font-medium text-gray-800 font-inter">
                        {Array.isArray(formData.donations) && formData.donations.length > 0
                          ? `£${formData.donations.reduce((sum: number, d: any) => sum + (parseFloat(d.donationAmount) || 0), 0).toFixed(2)} (${formData.donations.length} ${formData.donations.length === 1 ? 'donation' : 'donations'})`
                          : 'Not provided'}
                      </p>
                       <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter mt-1">Gift Aid Used: {formData.usedGiftAid ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                )}

                {formData.selectedTaxReliefs?.includes('investmentSchemes') && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2 font-inter">Investment Schemes (EIS/SEIS/VCT)</h4>
                    <div className="group">
                      <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-inter">Details</p>
                      <p className="font-medium text-gray-800 font-inter">{formData.investmentSchemeDetails || 'Not provided'}</p> 
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="pt-6 border-t border-gray-200 mt-8 sticky bottom-0 bg-white/90 backdrop-blur-sm pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircleIcon className={`h-6 w-6 mr-2 ${isComplete() ? 'text-green-500' : 'text-gray-300'}`} />
              <span className={`font-medium ${isComplete() ? 'text-green-700' : 'text-gray-500'} font-inter`}>
                {isComplete() ? 'Ready to submit' : 'Please complete all required fields'}
              </span>
            </div>
          </div>
          
          {submitAttempted && !isComplete() && (
            <p className="text-red-600 text-sm mt-2 font-inter">
              Please complete all required information before submitting.
            </p>
          )}
        </motion.div>
      </div>
    );
  }
);

export default SummarySection; 