import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '../common/FormInput';
import { useFormContext } from '../../context/FormContext';

// Define the shape of the form data for this section
interface InvestmentSchemeFormValues {
  schemeType: 'EIS' | 'SEIS' | 'VCT' | ''; // Use radio buttons
  amountInvested: string;
  dateOfInvestment: string;
  companyName?: string; // Optional
}

interface InvestmentSchemeSectionProps {
  onComplete: (data: Partial<InvestmentSchemeFormValues>) => void;
}

// Define ref type
export interface InvestmentSchemeSectionRef {
  submitForm: () => void;
}

// Update to use forwardRef
const InvestmentSchemeSection = forwardRef<InvestmentSchemeSectionRef, InvestmentSchemeSectionProps>(
  function InvestmentSchemeSection(props, ref) {
    const { onComplete } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();

    const {
      control,
      handleSubmit,
      watch,
      formState: { errors },
      setValue,
    } = useForm<InvestmentSchemeFormValues>({
      defaultValues: {
        schemeType: formData.schemeType || '',
        amountInvested: formData.amountInvested || '',
        dateOfInvestment: formData.dateOfInvestment || '',
        companyName: formData.companyName || '',
      },
      mode: 'onChange',
    });
    
    // Initialize form with existing values using useEffect
    useEffect(() => {
        setValue('schemeType', formData.schemeType || '');
        setValue('amountInvested', formData.amountInvested || '');
        setValue('dateOfInvestment', formData.dateOfInvestment || '');
        setValue('companyName', formData.companyName || '');
    }, [formData, setValue]);

    const onSubmit = (data: InvestmentSchemeFormValues) => {
      updateFormData(data);
      setSectionCompleted('investmentSchemes', true);
      if (onComplete) {
        onComplete(data);
      }
    };

    // Expose submitForm
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)()
    }));

    const schemeOptions = [
        { label: 'EIS (Enterprise Investment Scheme)', value: 'EIS' },
        { label: 'SEIS (Seed Enterprise Investment Scheme)', value: 'SEIS' },
        { label: 'VCT (Venture Capital Trust)', value: 'VCT' },
    ];

    return (
      <form className="space-y-6">
        
        <div className="card bg-blue-50 p-4 border-l-4 border-blue-400">
          <p className="text-sm text-blue-700">
            Provide details of any investments made into qualifying EIS, SEIS, or VCT schemes during the tax year. You'll typically receive certificates for these investments.
          </p>
        </div>

        {/* Scheme Type Choice */}
        <div className="space-y-2">
           <label className={`form-label ${errors.schemeType ? 'text-red-600' : ''}`}>
              Scheme Type {errors.schemeType && <span className="text-red-500">*</span>}
            </label>
          <Controller
            name="schemeType"
            control={control}
            rules={{ required: 'Please select the scheme type' }}
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                {schemeOptions.map((option) => (
                  <label 
                    key={option.value} 
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors duration-200 
                              ${field.value === option.value 
                                ? 'bg-blue-100 border-blue-300 ring-1 ring-blue-300' 
                                : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={option.value}
                      checked={field.value === option.value}
                      name={field.name}
                    />
                    <span className="ml-3 text-sm text-gray-800">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          />
           {errors.schemeType && (
              <p className="mt-1 text-sm text-red-500">{errors.schemeType.message}</p>
           )}
        </div>

        <Controller
          name="amountInvested"
          control={control}
          rules={{ 
              required: 'Amount invested is required', 
              pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
          }}
          render={({ field, fieldState }) => (
            <FormInput
              label="Amount Invested (£)"
              type="number"
              placeholder="e.g., 10000"
              prefix="£"
              error={fieldState.error?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="dateOfInvestment"
          control={control}
          rules={{ required: 'Date of investment is required' }}
          render={({ field, fieldState }) => (
            <FormInput
              label="Date of Investment"
              type="date"
              error={fieldState.error?.message}
              required
              tooltip="The date the investment was made (usually shown on your certificate)."
              {...field}
            />
          )}
        />
        
        <Controller
          name="companyName"
          control={control}
          render={({ field, fieldState }) => (
             <FormInput
              label="Company Name (Optional)"
              placeholder="e.g., Tech Innovate Ltd (for EIS/SEIS)"
              error={fieldState.error?.message}
              tooltip="The name of the company invested in (EIS/SEIS) or the VCT manager."
              {...field}
              value={field.value || ''} // Handle optional field
            />
          )}
        />

        <p className="text-xs text-gray-500">Keep your EIS3, SEIS3, or VCT certificates safe as they contain important details needed for your tax return.</p>
      </form>
    );
  }
);

export default InvestmentSchemeSection; 