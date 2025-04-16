import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useFormContext } from '../../context/FormContext';
import { Button, FormInput, FormCheckbox, Accordion, AccordionItem, FormSelect, FormTextArea } from "../common";
import { GlobeAltIcon, CurrencyPoundIcon, BriefcaseIcon, HomeIcon, BanknotesIcon, BuildingLibraryIcon, DocumentIcon, CalculatorIcon, CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Define the shape of the form data for this section
interface ForeignIncomeFormValues {
  // Selection state
  selectedIncomeSources: {
    residencyAndRemittance: boolean;
    savingsIncome: boolean;
    dividendIncome: boolean;
    employmentIncome: boolean;
    pensionIncome: boolean;
    propertyIncome: boolean;
    partnershipIncome: boolean;
    otherIncome: boolean;
    taxCreditRelief: boolean;
    additionalNotes: boolean;
  };
  
  // Section 1: Residency & Remittance
  livedOrWorkedOutsideUK: boolean;
  claimingRemittanceBasis: boolean;
  
  // Section 2: Foreign Savings Income
  savingsCountry: string;
  savingsGrossInterest: string;
  savingsForeignTax: string;
  savingsExchangeRate: string;
  
  // Section 3: Foreign Dividends
  dividendsCountry: string;
  dividendsGrossAmount: string;
  dividendsForeignTax: string;
  dividendsExchangeRate: string;
  
  // Section 4: Foreign Employment
  employerName: string;
  employmentCountry: string;
  employmentGrossSalary: string;
  employmentForeignTax: string;
  employmentBenefits: string;
  taxedUnderUKPAYE: boolean;
  
  // Section 5: Foreign Pension
  pensionCountry: string;
  pensionGrossAmount: string;
  pensionForeignTax: string;
  pensionExchangeRate: string;
  
  // Section 6: Foreign Property
  propertyCountry: string;
  propertyRentalIncome: string;
  propertyExpenses: string | { details?: string; hasDocuments?: boolean };
  propertyNetProfit: string;
  propertyForeignTax: string;
  propertyExchangeRate: string;
  
  // Section 7: Foreign Partnerships
  isMemberOfForeignPartnership: boolean;
  foreignPartnershipName: string;
  foreignPartnershipCountry: string;
  foreignPartnershipShareOfProfit: string;
  foreignPartnershipForeignTax: string;
  
  // Section 8: Other Income
  otherIncomeType: string;
  otherIncomeCountry: string;
  otherIncomeGrossAmount: string;
  otherIncomeForeignTax: string;
  otherIncomeExchangeRate: string;
  
  // Section 9: Foreign Tax Credit Relief
  claimingForeignTaxRelief: boolean;
  foreignTaxReliefDetails: string;
  
  // Section 10: Additional Notes
  additionalNotes: string;
  
  // For backward compatibility with original form
  typeOfIncome?: string;
  countryOfOrigin?: string;
  amountBeforeForeignTax?: string;
  foreignTaxPaid?: string;
  exchangeRateUsed?: string;
}

interface ForeignIncomeSectionProps {
  onComplete: (data: Partial<ForeignIncomeFormValues>) => void;
}

// Define ref type
export interface ForeignIncomeSectionRef {
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

// Card selection component
interface IncomeTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const IncomeTypeCard: React.FC<IncomeTypeCardProps> = ({ title, description, icon, selected, onClick }) => {
  return (
    <div
      className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
        selected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`rounded-full p-2 mr-3 ${selected ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {icon}
        </div>
        <div className="flex-grow">
          <h3 className={`font-medium ${selected ? 'text-blue-700' : 'text-gray-700'}`}>{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
          selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
        }`}>
          {selected && <CheckIcon className="w-3 h-3 text-white" />}
        </div>
      </div>
    </div>
  );
};

// Update to use forwardRef
const ForeignIncomeSection = forwardRef<ForeignIncomeSectionRef, ForeignIncomeSectionProps>(
  function ForeignIncomeSection(props, ref) {
    const { onComplete } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSelectionView, setShowSelectionView] = useState(true);
    const [selectedIncomeTypes, setSelectedIncomeTypes] = useState<string[]>(
      formData.selectedIncomeTypes || []
    );

    const {
      handleSubmit,
      control,
      watch,
      setValue,
      register,
      formState: { errors },
    } = useForm<ForeignIncomeFormValues>({
      defaultValues: {
        // Selection state - default to all false
        selectedIncomeSources: formData.selectedIncomeSources || {
          residencyAndRemittance: true, // This should always be shown
          savingsIncome: false,
          dividendIncome: false,
          employmentIncome: false,
          pensionIncome: false,
          propertyIncome: false,
          partnershipIncome: false,
          otherIncome: false,
          taxCreditRelief: false,
          additionalNotes: false,
        },
        
        // Section 1: Residency & Remittance
        livedOrWorkedOutsideUK: formData.livedOrWorkedOutsideUK || false,
        claimingRemittanceBasis: formData.claimingRemittanceBasis || false,
        
        // Section 2: Foreign Savings Income
        savingsCountry: formData.savingsCountry || '',
        savingsGrossInterest: formData.savingsGrossInterest || '',
        savingsForeignTax: formData.savingsForeignTax || '',
        savingsExchangeRate: formData.savingsExchangeRate || '',
        
        // Section 3: Foreign Dividends
        dividendsCountry: formData.dividendsCountry || '',
        dividendsGrossAmount: formData.dividendsGrossAmount || '',
        dividendsForeignTax: formData.dividendsForeignTax || '',
        dividendsExchangeRate: formData.dividendsExchangeRate || '',
        
        // Section 4: Foreign Employment
        employerName: formData.employerName || '',
        employmentCountry: formData.employmentCountry || '',
        employmentGrossSalary: formData.employmentGrossSalary || '',
        employmentForeignTax: formData.employmentForeignTax || '',
        employmentBenefits: formData.employmentBenefits || '',
        taxedUnderUKPAYE: formData.taxedUnderUKPAYE || false,
        
        // Section 5: Foreign Pension
        pensionCountry: formData.pensionCountry || '',
        pensionGrossAmount: formData.pensionGrossAmount || '',
        pensionForeignTax: formData.pensionForeignTax || '',
        pensionExchangeRate: formData.pensionExchangeRate || '',
        
        // Section 6: Foreign Property
        propertyCountry: formData.propertyCountry || '',
        propertyRentalIncome: formData.propertyRentalIncome || '',
        propertyExpenses: formData.propertyExpenses || '',
        propertyNetProfit: formData.propertyNetProfit || '',
        propertyForeignTax: formData.propertyForeignTax || '',
        propertyExchangeRate: formData.propertyExchangeRate || '',
        
        // Section 7: Foreign Partnerships
        isMemberOfForeignPartnership: formData.isMemberOfForeignPartnership || false,
        foreignPartnershipName: formData.foreignPartnershipName || '',
        foreignPartnershipCountry: formData.foreignPartnershipCountry || '',
        foreignPartnershipShareOfProfit: formData.foreignPartnershipShareOfProfit || '',
        foreignPartnershipForeignTax: formData.foreignPartnershipForeignTax || '',
        
        // Section 8: Other Income
        otherIncomeType: formData.otherIncomeType || '',
        otherIncomeCountry: formData.otherIncomeCountry || '',
        otherIncomeGrossAmount: formData.otherIncomeGrossAmount || '',
        otherIncomeForeignTax: formData.otherIncomeForeignTax || '',
        otherIncomeExchangeRate: formData.otherIncomeExchangeRate || '',
        
        // Section 9: Foreign Tax Credit Relief
        claimingForeignTaxRelief: formData.claimingForeignTaxRelief || false,
        foreignTaxReliefDetails: formData.foreignTaxReliefDetails || '',
        
        // Section 10: Additional Notes
        additionalNotes: formData.additionalNotes || '',
        
        // Legacy fields from original form
        typeOfIncome: formData.typeOfIncome || '',
        countryOfOrigin: formData.countryOfOrigin || '',
        amountBeforeForeignTax: formData.amountBeforeForeignTax || '',
        foreignTaxPaid: formData.foreignTaxPaid || '',
        exchangeRateUsed: formData.exchangeRateUsed || '',
      },
      mode: 'onChange',
    });
    
    // Watch values for conditional rendering
    const livedOrWorkedOutsideUK = watch('livedOrWorkedOutsideUK');
    const isMemberOfForeignPartnership = watch('isMemberOfForeignPartnership');
    const claimingForeignTaxRelief = watch('claimingForeignTaxRelief');
    const selectedIncomeSources = watch('selectedIncomeSources');

    // Check if any income sources are selected
    const hasSelectedSources = Object.values(selectedIncomeSources).some(value => value);

    // Toggle an income source selection
    const toggleIncomeSource = (source: keyof ForeignIncomeFormValues['selectedIncomeSources']) => {
      setValue(`selectedIncomeSources.${source}`, !selectedIncomeSources[source]);
    };

    // Proceed to form after selection
    const proceedToForm = () => {
      setShowSelectionView(false);
    };
    
    // Go back to selection view
    const goBackToSelection = () => {
      setShowSelectionView(true);
    };

    // Input change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      setValue(name as any, newValue);
    };

    const onSubmit = (data: ForeignIncomeFormValues) => {
      setIsSubmitting(true);
      // Convert data to the expected format
      const formDataToUpdate = {
        ...data,
        propertyExpenses: typeof data.propertyExpenses === 'string' ? 
          { details: data.propertyExpenses } : data.propertyExpenses
      };
      updateFormData(formDataToUpdate as any);
      setSectionCompleted('foreignIncome', true);
      if (onComplete) {
        onComplete(data);
      }
      setIsSubmitting(false);
    };

    // Fix for auto-calculate net profit for property income
    React.useEffect(() => {
      const income = parseFloat(watch("propertyRentalIncome")) || 0;
      const expensesValue = watch("propertyExpenses");
      const expenses = parseFloat(
        typeof expensesValue === 'string' 
          ? expensesValue 
          : (expensesValue as { details?: string })?.details || '0'
      ) || 0;
      
      if (income || expenses) {
        const netProfit = (income - expenses).toFixed(2);
        setValue("propertyNetProfit", netProfit);
      }
    }, [watch("propertyRentalIncome"), watch("propertyExpenses"), setValue]);

    // Expose submitForm
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit as any)()
    }));

    // Income type cards for selection view
    const incomeTypeCards = [
      {
        key: 'savingsIncome',
        title: 'Foreign Savings Income',
        description: 'Interest from foreign bank accounts',
        icon: <BanknotesIcon className="w-5 h-5 text-blue-500" />,
      },
      {
        key: 'dividendIncome',
        title: 'Foreign Dividends',
        description: 'Income from shares in foreign companies',
        icon: <CurrencyPoundIcon className="w-5 h-5 text-green-500" />,
      },
      {
        key: 'employmentIncome',
        title: 'Foreign Employment',
        description: 'Income from working abroad',
        icon: <BriefcaseIcon className="w-5 h-5 text-purple-500" />,
      },
      {
        key: 'pensionIncome',
        title: 'Foreign Pension',
        description: 'Overseas state or private pensions',
        icon: <DocumentIcon className="w-5 h-5 text-amber-500" />,
      },
      {
        key: 'propertyIncome',
        title: 'Foreign Property Income',
        description: 'Rental income from overseas properties',
        icon: <HomeIcon className="w-5 h-5 text-red-500" />,
      },
      {
        key: 'partnershipIncome',
        title: 'Foreign Partnerships',
        description: 'Income from overseas partnerships',
        icon: <BuildingLibraryIcon className="w-5 h-5 text-indigo-500" />,
      },
      {
        key: 'otherIncome',
        title: 'Other Overseas Income',
        description: 'Trust income, royalties, and other sources',
        icon: <DocumentIcon className="w-5 h-5 text-teal-500" />,
      },
      {
        key: 'taxCreditRelief',
        title: 'Foreign Tax Credit Relief',
        description: 'Relief for foreign tax paid',
        icon: <CalculatorIcon className="w-5 h-5 text-sky-500" />,
      },
      {
        key: 'additionalNotes',
        title: 'Additional Notes',
        description: 'Other relevant information about foreign income',
        icon: <DocumentIcon className="w-5 h-5 text-gray-500" />,
      },
    ];

    return (
      <motion.div
        className="max-w-4xl mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <motion.h2 
            className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Foreign Income Information
          </motion.h2>
          <motion.p className="text-gray-600" variants={itemVariants}>
            Please provide details about any income you received from overseas sources.
          </motion.p>
        </div>
        
        {showSelectionView ? (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 mb-6">
              <p className="text-sm text-blue-700">
                Select the types of foreign income you received in the tax year. This will help us tailor the form to your specific situation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomeTypeCards.map((card) => (
                <IncomeTypeCard 
                  key={card.key}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  selected={selectedIncomeSources[card.key as keyof ForeignIncomeFormValues['selectedIncomeSources']]}
                  onClick={() => toggleIncomeSource(card.key as keyof ForeignIncomeFormValues['selectedIncomeSources'])}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={() => setShowSelectionView(false)} 
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                variant="primary"
              >
                <span>Show Selected Sections</span>
                <ChevronRightIcon className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit as any)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            variants={containerVariants}
          >
            <div className="flex justify-end mb-4">
              <Button
                type="button"
                onClick={goBackToSelection}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                Edit Income Sources
              </Button>
            </div>
            
            <Accordion allowMultiple defaultOpenIndex={0}>
              {/* Section 1: Residency & Remittance Basis Check */}
              <AccordionItem 
                key="section1" 
                title="Residency & Remittance Basis" 
                description="Your residence status and tax treatment"
                icon={<GlobeAltIcon className="w-5 h-5" />}
              >
                <div className="space-y-4 p-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 mb-6">
                    <p className="text-sm text-blue-700">
                      Your answers to these questions help determine the appropriate tax treatment for your foreign income.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">
                      Did you live or work outside the UK in the tax year?
                    </h3>
                    <div className="flex flex-col space-y-3">
                      <div 
                        className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 border ${watch('livedOrWorkedOutsideUK') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                        onClick={() => setValue('livedOrWorkedOutsideUK', true)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${watch('livedOrWorkedOutsideUK') ? 'border-blue-600' : 'border-gray-400'}`}>
                              {watch('livedOrWorkedOutsideUK') && (
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
                        className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 border ${watch('livedOrWorkedOutsideUK') === false ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                        onClick={() => setValue('livedOrWorkedOutsideUK', false)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${watch('livedOrWorkedOutsideUK') === false ? 'border-blue-600' : 'border-gray-400'}`}>
                              {watch('livedOrWorkedOutsideUK') === false && (
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
                  
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">
                      Are you claiming the Remittance Basis of taxation?
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      (i.e., only pay tax on foreign income brought into the UK)
                    </p>
                    <div className="flex flex-col space-y-3">
                      <div 
                        className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 border ${watch('claimingRemittanceBasis') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                        onClick={() => setValue('claimingRemittanceBasis', true)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${watch('claimingRemittanceBasis') ? 'border-blue-600' : 'border-gray-400'}`}>
                              {watch('claimingRemittanceBasis') && (
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
                        className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 border ${watch('claimingRemittanceBasis') === false ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                        onClick={() => setValue('claimingRemittanceBasis', false)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${watch('claimingRemittanceBasis') === false ? 'border-blue-600' : 'border-gray-400'}`}>
                              {watch('claimingRemittanceBasis') === false && (
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
                  
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                      <span className="mr-2">ℹ️</span> About Remittance Basis
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Claiming the Remittance Basis means you'll only pay UK tax on foreign income or gains that you bring (remit) to the UK. 
                      However, you may lose tax-free allowances and need to pay the Remittance Basis Charge if you've been UK resident for 7 out of the last 9 tax years.
                    </p>
                  </div>
                </div>
              </AccordionItem>
              
              {/* Section 2: Foreign Savings Income */}
              {selectedIncomeSources.savingsIncome && (
                <AccordionItem 
                  key="section2"
                  title="Foreign Savings Income" 
                  description="Interest from foreign bank accounts"
                  icon={<BanknotesIcon className="w-5 h-5" />}
                >
                  <div className="space-y-4 p-4">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Foreign Bank Interest</h3>
                      <div className="space-y-4">
                        <Controller
                          name="savingsCountry"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Country Source of Income"
                              placeholder="e.g., USA, France, Australia"
                              error={errors.savingsCountry?.message}
                              tooltip="The country where the bank or financial institution is located"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="savingsGrossInterest"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Total Gross Interest Received (before tax)"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.savingsGrossInterest?.message}
                              tooltip="Enter the full amount of interest before any tax was deducted"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="savingsForeignTax"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Foreign Tax Deducted"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.savingsForeignTax?.message}
                              tooltip="Enter any tax already deducted in the foreign country"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="savingsExchangeRate"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Exchange Rate Used"
                              placeholder="e.g., HMRC average rate, 1.25 USD/GBP"
                              error={errors.savingsExchangeRate?.message}
                              tooltip="Specify the exchange rate used for conversion to GBP"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                        <span className="mr-2">💡</span> Tax Tip
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        You may be able to claim Foreign Tax Credit Relief for any tax already paid overseas on your savings 
                        income to avoid being taxed twice on the same income.
                      </p>
                    </div>
                  </div>
                </AccordionItem>
              )}
              
              {/* Section 3: Foreign Dividends */}
              {selectedIncomeSources.dividendIncome && (
                <AccordionItem 
                  key="section3"
                  title="Foreign Dividends" 
                  description="Shares in foreign companies"
                  icon={<CurrencyPoundIcon className="w-5 h-5" />}
                >
                  <div className="space-y-4 p-4">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Dividend Income</h3>
                      <div className="space-y-4">
                        <Controller
                          name="dividendsCountry"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Country Source of Dividends"
                              placeholder="e.g., USA, Japan, Germany"
                              error={errors.dividendsCountry?.message}
                              tooltip="The country where the company paying dividends is based"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="dividendsGrossAmount"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Total Gross Dividends Received"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.dividendsGrossAmount?.message}
                              tooltip="Enter the full amount of dividends before any tax was deducted"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="dividendsForeignTax"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Foreign Tax Deducted"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.dividendsForeignTax?.message}
                              tooltip="Enter any withholding tax already deducted in the foreign country"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="dividendsExchangeRate"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Exchange Rate Used"
                              placeholder="e.g., HMRC average rate, 1.25 USD/GBP"
                              error={errors.dividendsExchangeRate?.message}
                              tooltip="Specify the exchange rate used for conversion to GBP"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800">Important Note</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Foreign dividends often have withholding tax deducted at source. UK residents can usually claim 
                        relief for this under double taxation agreements with many countries.
                      </p>
                    </div>
                  </div>
                </AccordionItem>
              )}
              
              {/* Section 4: Foreign Employment Income */}
              {selectedIncomeSources.employmentIncome && (
                <AccordionItem
                  key="section4"
                  title="Foreign Employment Income"
                  description="Income from working abroad"
                  icon={<BriefcaseIcon className="w-5 h-5" />}
                >
                  <div className="space-y-4 p-4">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Foreign Employment</h3>
                      <div className="space-y-4">
                        <Controller
                          name="employerName"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Employer Name"
                              placeholder="e.g., ABC Company"
                              error={errors.employerName?.message}
                              tooltip="The name of the employer"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="employmentCountry"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Country of Employment"
                              placeholder="e.g., USA, UK"
                              error={errors.employmentCountry?.message}
                              tooltip="The country where the employment took place"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="employmentGrossSalary"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Total Gross Salary Received"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.employmentGrossSalary?.message}
                              tooltip="Enter the full amount of salary before any tax was deducted"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="employmentForeignTax"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Foreign Tax Deducted"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.employmentForeignTax?.message}
                              tooltip="Enter any tax already deducted in the foreign country"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="employmentBenefits"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Benefits Received"
                              placeholder="e.g., Car, Housing Allowance"
                              error={errors.employmentBenefits?.message}
                              tooltip="Any benefits received in addition to salary"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="taxedUnderUKPAYE"
                          control={control}
                          render={({ field }) => (
                            <FormCheckbox
                              label="I was taxed under UK PAYE for this employment"
                              checked={field.value}
                              onChange={field.onChange}
                              name={field.name}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              )}
              
              {/* Section 5: Foreign Pension Income */}
              {selectedIncomeSources.pensionIncome && (
                <AccordionItem
                  key="section5"
                  title="Foreign Pension Income"
                  description="Overseas state or private pensions"
                  icon={<DocumentIcon className="w-5 h-5" />}
                >
                  <div className="space-y-4 p-4">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Foreign Pension</h3>
                      <div className="space-y-4">
                        <Controller
                          name="pensionCountry"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Country of Pension"
                              placeholder="e.g., USA, UK"
                              error={errors.pensionCountry?.message}
                              tooltip="The country where the pension is paid"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="pensionGrossAmount"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Total Gross Pension Received"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.pensionGrossAmount?.message}
                              tooltip="Enter the full amount of pension before any tax was deducted"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="pensionForeignTax"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Foreign Tax Deducted"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.pensionForeignTax?.message}
                              tooltip="Enter any tax already deducted in the foreign country"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="pensionExchangeRate"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Exchange Rate Used"
                              placeholder="e.g., HMRC average rate, 1.25 USD/GBP"
                              error={errors.pensionExchangeRate?.message}
                              tooltip="Specify the exchange rate used for conversion to GBP"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              )}
              
              {/* Section 6: Foreign Property Income */}
              {selectedIncomeSources.propertyIncome && (
                <AccordionItem
                  key="section6"
                  title="Foreign Property Income"
                  description="Rental income from overseas properties"
                  icon={<HomeIcon className="w-5 h-5" />}
                >
                  <div className="space-y-4 p-4">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Foreign Property</h3>
                      <div className="space-y-4">
                        <Controller
                          name="propertyCountry"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Country of Property"
                              placeholder="e.g., USA, UK"
                              error={errors.propertyCountry?.message}
                              tooltip="The country where the property is located"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="propertyRentalIncome"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Total Gross Rental Income"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.propertyRentalIncome?.message}
                              tooltip="Enter the full amount of rental income before any tax was deducted"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="propertyExpenses"
                          control={control}
                          render={({ field }) => (
                            <FormTextArea
                              label="Allowable expenses"
                              value={String(field.value || '')}
                              onChange={field.onChange}
                              name={field.name}
                              placeholder="Enter property expenses"
                              tooltip="Include maintenance, repairs, insurance, management fees, etc."
                            />
                          )}
                        />
                        
                        <Controller
                          name="propertyNetProfit"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Net Profit"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.propertyNetProfit?.message}
                              tooltip="Enter the net profit from the property"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="propertyForeignTax"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Foreign Tax Deducted"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.propertyForeignTax?.message}
                              tooltip="Enter any tax already deducted in the foreign country"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="propertyExchangeRate"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Exchange Rate Used"
                              placeholder="e.g., HMRC average rate, 1.25 USD/GBP"
                              error={errors.propertyExchangeRate?.message}
                              tooltip="Specify the exchange rate used for conversion to GBP"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              )}
              
              {/* Section 7: Foreign Partnerships */}
              {selectedIncomeSources.partnershipIncome && (
                <AccordionItem
                  key="section7"
                  title="Foreign Partnerships"
                  description="Income from overseas partnerships"
                  icon={<BuildingLibraryIcon className="w-5 h-5" />}
                >
                  <div className="space-y-4 p-4">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Foreign Partnerships</h3>
                      <div className="space-y-4">
                        <Controller
                          name="isMemberOfForeignPartnership"
                          control={control}
                          render={({ field }) => (
                            <FormCheckbox
                              label="I am a member of a foreign partnership"
                              checked={field.value}
                              onChange={field.onChange}
                              name={field.name}
                            />
                          )}
                        />
                        
                        <Controller
                          name="foreignPartnershipName"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Partnership Name"
                              placeholder="e.g., XYZ Partnership"
                              error={errors.foreignPartnershipName?.message}
                              tooltip="The name of the foreign partnership"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="foreignPartnershipCountry"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Country of Partnership"
                              placeholder="e.g., USA, UK"
                              error={errors.foreignPartnershipCountry?.message}
                              tooltip="The country where the partnership is located"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="foreignPartnershipShareOfProfit"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Share of Profit"
                              type="number"
                              placeholder="e.g., 50%"
                              error={errors.foreignPartnershipShareOfProfit?.message}
                              tooltip="Enter the percentage of profit from the partnership"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="foreignPartnershipForeignTax"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Foreign Tax Deducted"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.foreignPartnershipForeignTax?.message}
                              tooltip="Enter any tax already deducted in the foreign country"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              )}
              
              {/* Section 8: Other Overseas Income */}
              {selectedIncomeSources.otherIncome && (
                <AccordionItem
                  key="section8"
                  title="Other Overseas Income"
                  description="Trust income, royalties, and other sources"
                  icon={<DocumentIcon className="w-5 h-5" />}
                >
                  <div className="space-y-4 p-4">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Other Overseas Income</h3>
                      <div className="space-y-4">
                        <Controller
                          name="otherIncomeType"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Type of Income"
                              placeholder="e.g., Trust Income, Royalties"
                              error={errors.otherIncomeType?.message}
                              tooltip="The type of income received"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="otherIncomeCountry"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Country of Income"
                              placeholder="e.g., USA, UK"
                              error={errors.otherIncomeCountry?.message}
                              tooltip="The country where the income was received"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="otherIncomeGrossAmount"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Total Gross Income Received"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.otherIncomeGrossAmount?.message}
                              tooltip="Enter the full amount of income before any tax was deducted"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="otherIncomeForeignTax"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Foreign Tax Deducted"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.otherIncomeForeignTax?.message}
                              tooltip="Enter any tax already deducted in the foreign country"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="otherIncomeExchangeRate"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Exchange Rate Used"
                              placeholder="e.g., HMRC average rate, 1.25 USD/GBP"
                              error={errors.otherIncomeExchangeRate?.message}
                              tooltip="Specify the exchange rate used for conversion to GBP"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              )}
              
              {/* Section 9: Foreign Tax Credit Relief */}
              {selectedIncomeSources.taxCreditRelief && (
                <AccordionItem
                  key="section9"
                  title="Foreign Tax Credit Relief"
                  description="Relief for foreign tax paid"
                  icon={<CalculatorIcon className="w-5 h-5" />}
                >
                  <div className="space-y-4 p-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 mb-6">
                      <p className="text-sm text-blue-700">
                        Claim Foreign Tax Credit Relief for any tax already paid overseas on your foreign income.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Foreign Tax Credit Relief</h3>
                      <div className="flex flex-col space-y-3">
                        <div 
                          className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 border ${watch('claimingForeignTaxRelief') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                          onClick={() => setValue('claimingForeignTaxRelief', true)}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${watch('claimingForeignTaxRelief') ? 'border-blue-600' : 'border-gray-400'}`}>
                                {watch('claimingForeignTaxRelief') && (
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
                          className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 border ${watch('claimingForeignTaxRelief') === false ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                          onClick={() => setValue('claimingForeignTaxRelief', false)}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${watch('claimingForeignTaxRelief') === false ? 'border-blue-600' : 'border-gray-400'}`}>
                                {watch('claimingForeignTaxRelief') === false && (
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
                    
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                        <span className="mr-2">ℹ️</span> About Foreign Tax Credit Relief
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Claiming Foreign Tax Credit Relief allows you to claim tax relief for any tax already paid overseas on your foreign income.
                      </p>
                    </div>
                  </div>
                </AccordionItem>
              )}
              
              {/* Section 10: Additional Notes */}
              {selectedIncomeSources.additionalNotes && (
                <AccordionItem
                  key="section10"
                  title="Additional Notes"
                  description="Other relevant information about foreign income"
                  icon={<DocumentIcon className="w-5 h-5" />}
                >
                  <div className="space-y-4 p-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 mb-6">
                      <p className="text-sm text-blue-700">
                        Add any additional relevant information about your foreign income.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Additional Notes</h3>
                      <div className="space-y-4">
                        <Controller
                          name="foreignTaxReliefDetails"
                          control={control}
                          render={({ field }) => (
                            <FormTextArea
                              label="Foreign Tax Credit Relief Details"
                              placeholder="Enter details about the foreign tax credit relief"
                              error={errors.foreignTaxReliefDetails?.message}
                              tooltip="Enter any details about the foreign tax credit relief"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="additionalNotes"
                          control={control}
                          render={({ field }) => (
                            <FormTextArea
                              label="Additional Notes"
                              placeholder="Enter any additional notes about your foreign income"
                              error={errors.additionalNotes?.message}
                              tooltip="Enter any additional notes about your foreign income"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              )}
            </Accordion>
            
            {/* Hidden submit button for form submission */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                variant="primary"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Foreign Income Details</span>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </motion.div>
    );
  }
);

export default ForeignIncomeSection; 