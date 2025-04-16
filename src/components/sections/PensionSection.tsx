import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '../common/FormInput';
import { useFormContext } from '../../context/FormContext';

// Define the shape of the form data for this section
interface PensionFormValues {
  pensionContributionAmount: string;
  pensionSchemeType?: string; // Optional
}

interface PensionSectionProps {
  onComplete: (data: Partial<PensionFormValues>) => void;
}

// Define ref type
export interface PensionSectionRef {
  submitForm: () => void;
}

// Update to use forwardRef
const PensionSection = forwardRef<PensionSectionRef, PensionSectionProps>(
  function PensionSection(props, ref) {
    const { onComplete } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();

    const {
      handleSubmit,
      control,
      formState: { errors },
      setValue,
    } = useForm<PensionFormValues>({
      defaultValues: {
        pensionContributionAmount: formData.pensionContributionAmount || '',
        pensionSchemeType: formData.pensionSchemeType || '',
      },
      mode: 'onChange',
    });
    
    // Initialize form with existing values using useEffect
    useEffect(() => {
        setValue('pensionContributionAmount', formData.pensionContributionAmount || '');
        setValue('pensionSchemeType', formData.pensionSchemeType || '');
    }, [formData, setValue]);

    const onSubmit = (data: PensionFormValues) => {
      updateFormData(data);
      setSectionCompleted('pension', true);
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
            Enter details of any personal contributions made to registered pension schemes during the tax year. This does not include employer contributions made through your workplace pension.
          </p>
        </div>

        <Controller
          name="pensionContributionAmount"
          control={control}
          rules={{ 
              required: 'Contribution amount is required', 
              pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
          }}
          render={({ field, fieldState }) => (
            <FormInput
              label="Total Personal Pension Contributions (£)"
              type="number"
              placeholder="e.g., 2000"
              prefix="£"
              error={fieldState.error?.message}
              required
              tooltip="Enter the total gross amount you personally contributed (including any basic rate tax relief added by the provider)."
              {...field}
            />
          )}
        />
        
        <Controller
          name="pensionSchemeType"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              label="Pension Scheme Type/Provider (Optional)"
              placeholder="e.g., SIPP, Personal Pension with Aviva"
              error={fieldState.error?.message}
              {...field}
              value={field.value || ''} // Handle optional field
            />
          )}
        />

      </form>
    );
  }
);

export default PensionSection; 