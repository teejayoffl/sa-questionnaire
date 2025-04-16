import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for our form data
export interface FormData {
  // Personal Information
  fullName: string;
  nationalInsuranceNumber: string;
  utr: string;
  dateOfBirth: string;
  address: string;
  contactNumber: string;
  email: string;
  
  // Employment Details
  isEmployed: boolean;
  employerName?: string;
  employerPayeReference?: string;
  totalPayFromP60?: string;
  taxDeducted?: string;
  benefitsFromP11D?: string;
  
  // Self-Employment Income
  isSelfEmployed: boolean;
  businessName?: string;
  businessDescription?: string;
  accountingPeriodStart?: string;
  accountingPeriodEnd?: string;
  turnover?: string;
  allowableBusinessExpenses?: string;
  netProfitOrLoss?: string;
  capitalAllowancesClaimed?: string;
  
  // Partnership Income
  isPartner: boolean;
  partnershipName?: string;
  shareOfProfitOrLoss?: string;
  partnershipUTR?: string;
  
  // UK Property Income
  hasUKPropertyIncome: boolean;
  propertyAddress?: string;
  rentalIncomeReceived?: string;
  propertyAllowableExpenses?: string;
  propertyNetProfitOrLoss?: string;
  
  // Foreign Income
  hasForeignIncome: boolean;
  typeOfIncome?: string;
  countryOfOrigin?: string;
  amountBeforeForeignTax?: string;
  foreignTaxPaid?: string;
  exchangeRateUsed?: string;
  
  // Capital Gains
  hasCapitalGains: boolean;
  assetDescription?: string;
  dateOfDisposal?: string;
  proceedsFromDisposal?: string;
  costOrValueWhenAcquired?: string;
  reliefsClaimed?: string;
  
  // Residence and Remittance Basis
  isNonResident: boolean;
  daysSpentInUK?: string;
  countriesOfResidence?: string;
  incomeRemittedToUK?: string;
  
  // Trusts and Estates
  isTrusteeOrPersonalRep: boolean;
  trustOrEstateName?: string;
  trustOrEstateUTR?: string;
  incomeReceived?: string;
  expensesPaid?: string;
  distributionsMade?: string;
  
  // Other Income
  hasOtherIncome: boolean;
  otherIncomeType?: string;
  otherIncomeAmount?: string;
  otherIncomeTaxDeducted?: string;
  
  // Tax Reliefs and Allowances
  hasPensionContributions: boolean;
  pensionContributionAmount?: string;
  pensionSchemeType?: string;
  
  hasCharitableDonations: boolean;
  donationAmount?: string;
  charityName?: string;
  charitableDonations?: {
    details?: string;
    hasDocuments?: boolean;
  } | string;
  charityDonationDetails?: string;
  
  // Student Loan Repayments
  hasStudentLoan: boolean;
  studentLoanPlanType?: string;
  studentLoanAmountRepaid?: string;
  
  // High Income Child Benefit Charge
  receivesChildBenefit: boolean;
  totalIncomeForChildBenefit?: string;
  childBenefitAmount?: string;
  
  // Marriage Allowance
  transfersMarriageAllowance: boolean;
  spouseName?: string;
  spouseNationalInsuranceNumber?: string;
  
  // Selection fields for multi-select flow
  selectedIncomeTypes?: string[];
  selectedTaxReliefs?: string[];
  
  // New fields for employment expenses
  hasEmploymentExpenses: boolean;
  employmentExpensesDetails?: string;
  employmentExpensesDocuments?: File[];
  employmentExpenses?: {
    details?: string;
    hasDocuments?: boolean;
  };
  
  // New fields for property allowance
  usePropertyAllowance: boolean;
  propertyExpensesDetails?: string;
  propertyExpensesDocuments?: File[];
  propertyExpenses?: {
    details?: string;
    hasDocuments?: boolean;
  };
  
  // New fields for gift aid
  usedGiftAid: boolean;
  charityDocuments?: File[];
  
  // Add index signature to allow string indexing
  [key: string]: any;
}

// Define the initial form data state
export const initialFormData: FormData = {
  // Personal Information
  fullName: '',
  nationalInsuranceNumber: '',
  utr: '',
  dateOfBirth: '',
  address: '',
  contactNumber: '',
  email: '',
  
  // Employment Details
  isEmployed: false,
  
  // Self-Employment Income
  isSelfEmployed: false,
  
  // Partnership Income
  isPartner: false,
  
  // UK Property Income
  hasUKPropertyIncome: false,
  
  // Foreign Income
  hasForeignIncome: false,
  
  // Capital Gains
  hasCapitalGains: false,
  
  // Residence and Remittance Basis
  isNonResident: false,
  
  // Trusts and Estates
  isTrusteeOrPersonalRep: false,
  
  // Other Income
  hasOtherIncome: false,
  
  // Tax Reliefs and Allowances
  hasPensionContributions: false,
  hasCharitableDonations: false,
  charityDonationDetails: '',
  
  // Student Loan Repayments
  hasStudentLoan: false,
  
  // High Income Child Benefit Charge
  receivesChildBenefit: false,
  
  // Marriage Allowance
  transfersMarriageAllowance: false,
  
  // Selection fields for multi-select flow
  selectedIncomeTypes: [],
  selectedTaxReliefs: [],
  
  // New fields for employment expenses
  hasEmploymentExpenses: false,
  employmentExpensesDetails: '',
  employmentExpensesDocuments: [],
  employmentExpenses: {
    details: '',
    hasDocuments: false
  },
  
  // New fields for property allowance
  usePropertyAllowance: false,
  propertyExpensesDetails: '',
  propertyExpensesDocuments: [],
  propertyExpenses: {
    details: '',
    hasDocuments: false
  },
  
  // New fields for gift aid
  usedGiftAid: false,
  charityDocuments: [],
  charitableDonations: {
    details: '',
    hasDocuments: false
  }
};

// Add types for the form context
interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  calculateProgress: () => number;
  sectionsCompleted: { [key: string]: boolean };
  setSectionCompleted: (section: string, completed: boolean) => void;
}

// Create the form context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Create a provider for the form context
interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  // Load initial form data from localStorage if available
  const loadInitialData = () => {
    try {
      const savedFormData = localStorage.getItem('form_data');
      if (savedFormData) {
        return JSON.parse(savedFormData);
      }
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    }
    return initialFormData;
  };

  // Initialize state with data from localStorage or default initialFormData
  const [formData, setFormData] = useState<FormData>(loadInitialData());
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [sectionsCompleted, setSectionsCompleted] = useState<{ [key: string]: boolean }>({
    personalInfo: false,
    employment: false,
    selfEmployment: false,
    partnership: false,
    ukProperty: false,
    foreignIncome: false,
    capitalGains: false,
    residence: false,
    trusts: false,
    otherIncome: false,
    taxReliefs: false,
    studentLoan: false,
    childBenefit: false,
    marriageAllowance: false,
  });
  
  const totalSteps = 14; // Total number of steps in the form

  // In the updateFormData function, add localStorage saving
  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prevData => {
      const updatedData = { ...prevData, ...newData };
      try {
        localStorage.setItem('form_data', JSON.stringify(updatedData));
      } catch (error) {
        console.error('Error saving form data to localStorage:', error);
      }
      return updatedData;
    });
  };

  // Update resetFormData to also clear localStorage
  const resetFormData = () => {
    setFormData(initialFormData);
    localStorage.removeItem('form_data');
    setCurrentStep(1);
    setSectionsCompleted({
      personalInfo: false,
      employment: false,
      selfEmployment: false,
      partnership: false,
      ukProperty: false,
      foreignIncome: false,
      capitalGains: false,
      residence: false,
      trusts: false,
      otherIncome: false,
      taxReliefs: false,
      studentLoan: false,
      childBenefit: false,
      marriageAllowance: false,
    });
  };

  const setSectionCompleted = (section: string, completed: boolean) => {
    setSectionsCompleted(prev => ({ ...prev, [section]: completed }));
  };

  const calculateProgress = (): number => {
    const completedSections = Object.values(sectionsCompleted).filter(Boolean).length;
    return Math.round((completedSections / totalSteps) * 100);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        currentStep,
        setCurrentStep,
        totalSteps,
        calculateProgress,
        sectionsCompleted,
        setSectionCompleted,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Create a hook for using the form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}; 