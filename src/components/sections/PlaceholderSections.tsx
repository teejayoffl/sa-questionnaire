import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useFormContext } from '../../context/FormContext';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import FormCheckbox from '../common/FormCheckbox';
import FileUpload from '../common/FileUpload';
import { motion, AnimatePresence } from 'framer-motion';

// Type for Self-Employment form values
type SelfEmploymentFormValues = {
  isSelfEmployed: boolean;
  businessName: string;
  businessDescription: string;
  accountingPeriodStartDate: string;
  accountingPeriodEndDate: string;
  totalTurnover: string;
  allowableExpenses: string;
};

interface SelfEmploymentSectionProps {
  onComplete?: (data: any) => void;
  initialData?: any;
  isConversation?: boolean;
}

// SelfEmploymentSection Implementation
export const SelfEmploymentSection: React.FC<SelfEmploymentSectionProps> = ({
  onComplete,
  initialData,
  isConversation = false
}) => {
  const { formData, updateFormData, setSectionCompleted } = useFormContext();
  
  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SelfEmploymentFormValues>({
    defaultValues: {
      isSelfEmployed: formData.isSelfEmployed !== undefined ? formData.isSelfEmployed : false,
      businessName: formData.businessName || '',
      businessDescription: formData.businessDescription || '',
      accountingPeriodStartDate: formData.accountingPeriodStartDate || '',
      accountingPeriodEndDate: formData.accountingPeriodEndDate || '',
      totalTurnover: formData.totalTurnover || '',
      allowableExpenses: formData.allowableExpenses || '',
    },
    mode: 'onChange',
  });

  const isSelfEmployed = watch('isSelfEmployed');

  useEffect(() => {
    setValue('isSelfEmployed', formData.isSelfEmployed !== undefined ? formData.isSelfEmployed : false);
    setValue('businessName', formData.businessName || '');
    setValue('businessDescription', formData.businessDescription || '');
    setValue('accountingPeriodStartDate', formData.accountingPeriodStartDate || '');
    setValue('accountingPeriodEndDate', formData.accountingPeriodEndDate || '');
    setValue('totalTurnover', formData.totalTurnover || '');
    setValue('allowableExpenses', formData.allowableExpenses || '');
  }, [formData, setValue]);

  const onSubmit = (data: SelfEmploymentFormValues) => {
    console.log(">>> SelfEmploymentSection: onSubmit called with data:", data);
    updateFormData(data);
    console.log(">>> SelfEmploymentSection: updateFormData completed.");
    setSectionCompleted('selfEmployment', true);
    console.log(">>> SelfEmploymentSection: setSectionCompleted completed.");
    if (isConversation && onComplete) {
      console.log(">>> SelfEmploymentSection: Calling onComplete...");
      onComplete(data);
    } else {
      console.log(">>> SelfEmploymentSection: NOT calling onComplete. isConversation:", isConversation, "onComplete exists:", !!onComplete);
    }
  };

  const handleFieldChange = (name: keyof SelfEmploymentFormValues, value: any) => {
    setValue(name, value, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
        <h3 className="font-medium text-yellow-800 mb-1 font-inter">Self-Employment Details</h3>
        <p className="text-sm text-yellow-700 font-inter">
          This section is for any self-employment income you received during the tax year. 
          This includes freelance work, sole trader businesses, and any work where you weren't employed under PAYE.
        </p>
      </div>
      
      <FormCheckbox
        label="Were you self-employed during the tax year?"
        name="isSelfEmployed"
        checked={isSelfEmployed}
        onChange={(e) => handleFieldChange('isSelfEmployed', e.target.checked)}
        tooltip="Tick this box if you worked for yourself or ran your own business."
      />
      
      <AnimatePresence>
        {isSelfEmployed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <div className="border border-blue-100 bg-blue-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-blue-700 mb-1 font-inter">Upload Self-Employment Statements (Optional)</h3>
              <p className="text-xs text-blue-600 mb-2 font-inter">
                Uploading your business accounts, invoices, or other financial records can help us with your return.
              </p>
              <FileUpload
                label="Business Records"
                acceptedFileTypes=".pdf,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
                onChange={(file) => console.log('Self-employment file uploaded:', file)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Business Name"
                name="businessName"
                value={watch('businessName')}
                onChange={(e) => handleFieldChange('businessName', e.target.value)}
                placeholder="e.g., Smith Consulting"
                required={isSelfEmployed}
                tooltip="The name your business trades under."
              />
              
              <FormInput
                label="Business Description"
                name="businessDescription"
                value={watch('businessDescription')}
                onChange={(e) => handleFieldChange('businessDescription', e.target.value)}
                placeholder="e.g., Web Design Services"
                required={isSelfEmployed}
                tooltip="A brief description of your business activities."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Accounting Period Start Date"
                name="accountingPeriodStartDate"
                type="date"
                value={watch('accountingPeriodStartDate')}
                onChange={(e) => handleFieldChange('accountingPeriodStartDate', e.target.value)}
                required={isSelfEmployed}
                tooltip="The start date of your business's accounting year."
              />
              
              <FormInput
                label="Accounting Period End Date"
                name="accountingPeriodEndDate"
                type="date"
                value={watch('accountingPeriodEndDate')}
                onChange={(e) => handleFieldChange('accountingPeriodEndDate', e.target.value)}
                required={isSelfEmployed}
                tooltip="The end date of your business's accounting year."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Total Turnover"
                name="totalTurnover"
                type="number"
                value={getValues('totalTurnover')}
                onChange={(e) => handleFieldChange('totalTurnover', e.target.value)}
                placeholder="e.g., 30000"
                prefix="£"
                required={isSelfEmployed}
                tooltip="The total income received by your business before expenses."
              />
              
              <FormInput
                label="Allowable Expenses"
                name="allowableExpenses"
                type="number"
                value={getValues('allowableExpenses')}
                onChange={(e) => handleFieldChange('allowableExpenses', e.target.value)}
                placeholder="e.g., 8000"
                prefix="£"
                required={isSelfEmployed}
                tooltip="Total costs incurred wholly and exclusively for business purposes. You can claim the £1,000 trading allowance instead if your expenses are lower."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary" className="action-button">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// PartnershipSection
export const PartnershipSection: React.FC = () => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionCompleted('partnership', true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to partnership income.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// PropertySection
export const PropertySection: React.FC = () => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionCompleted('property', true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to UK property income.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// ForeignIncomeSection
export const ForeignIncomeSection: React.FC = () => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionCompleted('foreignIncome', true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to foreign income.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// CapitalGainsSection
export const CapitalGainsSection: React.FC = () => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionCompleted('capitalGains', true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to capital gains.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// ResidenceSection
export const ResidenceSection: React.FC = () => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionCompleted('residence', true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to residence and remittance basis.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// TrustsSection
export const TrustsSection: React.FC = () => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionCompleted('trusts', true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to trusts and estates.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// OtherIncomeSection
export const OtherIncomeSection: React.FC = () => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionCompleted('otherIncome', true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to other types of income.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// TaxReliefsSection
interface TaxReliefsSectionProps {
  type: 'pension' | 'charity' | 'investmentSchemes' | 'loanInterest' | 'marriageAllowance';
}

export const TaxReliefsSection: React.FC<TaxReliefsSectionProps> = ({ type }) => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the dynamic type prop to mark the specific relief as complete
    setSectionCompleted(type, true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to tax relief: {type}.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// StudentLoanSection
export const StudentLoanSection: React.FC = () => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionCompleted('studentLoan', true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to student loan repayments.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// ChildBenefitSection
export const ChildBenefitSection: React.FC = () => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionCompleted('childBenefit', true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to High Income Child Benefit Charge.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

// MarriageAllowanceSection
export const MarriageAllowanceSection: React.FC = () => {
  const { setSectionCompleted } = useFormContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionCompleted('marriageAllowance', true);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-wis-silver-50 p-4 border-l-4 border-wis-gold-400">
        <p className="text-sm text-wis-silver-700">
          This section would contain all fields related to Marriage Allowance.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}; 