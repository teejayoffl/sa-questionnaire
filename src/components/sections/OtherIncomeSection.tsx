import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '../common/FormInput';
import { useFormContext } from '../../context/FormContext';

// Define the shape of the form data for this section
interface OtherIncomeFormValues {
  otherIncomeType: string;
  otherIncomeAmount: string;
  otherIncomeTaxDeducted?: string; // Optional
}

interface OtherIncomeSectionProps {
  onComplete: (data: Partial<OtherIncomeFormValues>) => void;
}

// Define ref type
export interface OtherIncomeSectionRef {
  submitForm: () => void;
}

// Update to use forwardRef
const OtherIncomeSection = forwardRef<OtherIncomeSectionRef, OtherIncomeSectionProps>(
  function OtherIncomeSection(props, ref) {
    const { onComplete } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();

    const {
      handleSubmit,
      control,
      formState: { errors },
      setValue,
    } = useForm<OtherIncomeFormValues>({
      defaultValues: {
        otherIncomeType: formData.otherIncomeType || '',
        otherIncomeAmount: formData.otherIncomeAmount || '',
        otherIncomeTaxDeducted: formData.otherIncomeTaxDeducted || '',
      },
      mode: 'onChange',
    });
    
    // Initialize form with existing values using useEffect
    useEffect(() => {
        setValue('otherIncomeType', formData.otherIncomeType || '');
        setValue('otherIncomeAmount', formData.otherIncomeAmount || '');
        setValue('otherIncomeTaxDeducted', formData.otherIncomeTaxDeducted || '');
    }, [formData, setValue]);

    const onSubmit = (data: OtherIncomeFormValues) => {
      updateFormData(data);
      setSectionCompleted('otherIncome', true);
      if (onComplete) {
        onComplete(data);
      }
    };

    // Expose submitForm
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)()
    }));

    return (
      <form className="space-y-6">
        
        <div className="card bg-blue-50 p-4 border-l-4 border-blue-400">
          <p className="text-sm text-blue-700">
            Detail any other taxable income you received during the tax year that wasn't covered in the previous sections.
          </p>
        </div>

        <Controller
          name="otherIncomeType"
          control={control}
          rules={{ required: 'Type of income is required' }}
          render={({ field, fieldState }) => (
            <FormInput
              label="Type of Other Income"
              placeholder="e.g., Casual earnings, Commission, Income from a trust"
              error={fieldState.error?.message}
              required
              {...field}
            />
          )}
        />
        
        <Controller
          name="otherIncomeAmount"
          control={control}
          rules={{ 
              required: 'Amount is required', 
              pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
          }}
          render={({ field, fieldState }) => (
            <FormInput
              label="Amount Received (£)"
              type="number"
              placeholder="e.g., 500"
              prefix="£"
              error={fieldState.error?.message}
              required
              {...field}
            />
          )}
        />
        
        <Controller
          name="otherIncomeTaxDeducted"
          control={control}
          rules={{ 
              pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
          }}
          render={({ field, fieldState }) => (
            <FormInput
              label="Tax Deducted (Optional, £)"
              type="number"
              placeholder="e.g., 100"
              prefix="£"
              error={fieldState.error?.message}
              tooltip="Enter any UK tax that was already deducted from this income, if applicable."
              {...field}
              value={field.value || ''} // Handle optional field
            />
          )}
        />
      
      </form>
    );
  }
);

export default OtherIncomeSection; 