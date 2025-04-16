import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import FormInput from '../common/FormInput';
import FormCheckbox from '../common/FormCheckbox';
import Button from '../common/Button';
import { useFormContext } from '../../context/FormContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon, 
  InformationCircleIcon, 
  HeartIcon, 
  CurrencyPoundIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

// Interface for a single donation entry
interface DonationEntry {
  charityName: string;
  donationAmount: string;
  donationDate?: string; // Optional date per donation
}

// Main form values including the array of donations
interface CharitableDonationsFormValues {
  donations: DonationEntry[];
  usedGiftAid: boolean;
}

// Update props
interface CharitableDonationsSectionProps {
  onComplete: (data: Partial<{ donations: DonationEntry[], usedGiftAid: boolean }>) => void;
}

// Define ref type
export interface CharitableDonationsSectionRef {
  submitForm: () => void;
}

// Update to use forwardRef
const CharitableDonationsSection = forwardRef<CharitableDonationsSectionRef, CharitableDonationsSectionProps>(
  function CharitableDonationsSection(props, ref) {
    const { onComplete } = props;
    const { formData, updateFormData, setSectionCompleted } = useFormContext();

    const {
      control,
      handleSubmit,
      watch,
      formState: { errors },
      setValue
    } = useForm<CharitableDonationsFormValues>({
      defaultValues: {
        donations: formData.donations || [],
        usedGiftAid: formData.usedGiftAid || false,
      },
      mode: 'onChange',
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "donations"
    });

    const donationsData = useWatch({ control, name: "donations" });
    const totalDonationAmount = donationsData?.reduce((sum, donation) => {
        const amount = parseFloat(donation.donationAmount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0) || 0;

    const usedGiftAid = watch('usedGiftAid');
    
    // Initialize form with existing values using useEffect
    useEffect(() => {
        setValue('donations', formData.donations || []);
        setValue('usedGiftAid', formData.usedGiftAid || false);
    }, [formData, setValue]);

    const onSubmit = (data: CharitableDonationsFormValues) => {
      const validDonations = data.donations?.filter(d => d.charityName && d.donationAmount) || [];
      const submissionData = { donations: validDonations, usedGiftAid: data.usedGiftAid };
      
      updateFormData(submissionData);
      setSectionCompleted('charity', true);
      if (onComplete) {
        onComplete(submissionData);
      }
    };

    // Expose submitForm
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)()
    }));

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
      }
    };

    return (
      <motion.form 
        className="space-y-8 max-w-4xl mx-auto pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <HeartIcon className="h-6 w-6 mr-2" />
                Charitable Donations
              </h2>
              <p className="text-purple-100 mt-1">
                Record your charitable contributions to claim tax relief on your donations.
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-blue-50 rounded-lg border border-blue-100 p-4 flex">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p>List your charitable donations made during the tax year. Only include donations made to charities registered with HMRC.</p>
                  <p className="mt-2">
                    You can <a href="https://www.gov.uk/find-charity-information" target="_blank" rel="noopener noreferrer" className="underline text-blue-800 hover:text-blue-600 font-medium">check if a charity is registered here</a>.
                  </p>
                </div>
              </div>
              
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium text-gray-800 flex items-center">
                      <CurrencyPoundIcon className="h-5 w-5 mr-2 text-indigo-500" />
                      Your Donations
                    </h3>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Count: {fields.length}</p>
                      <p className="text-sm font-medium text-indigo-600">Total: £{totalDonationAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {fields.length === 0 && (
                    <div className="text-center py-8 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                        <HeartIcon className="h-6 w-6 text-indigo-400" />
                      </div>
                      <p className="text-gray-600 font-medium">No donations added yet.</p>
                      <p className="text-sm text-gray-500 mt-1">Click the button below to add your first donation.</p>
                    </div>
                  )}

                  <div className="space-y-4 mt-4">
                    <AnimatePresence>
                      {fields.map((item, index) => (
                        <motion.div 
                          key={item.id} 
                          className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm relative"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                          transition={{ duration: 0.3 }}
                          layout
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <Controller
                              name={`donations.${index}.charityName`}
                              control={control}
                              rules={{ required: 'Charity name is required' }}
                              render={({ field, fieldState }) => (
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HeartIcon className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <FormInput
                                    label={`Charity #${index + 1}`}
                                    placeholder="e.g., Cancer Research UK"
                                    error={fieldState.error?.message}
                                    required
                                    className="pl-10"
                                    {...field}
                                  />
                                </div>
                              )}
                            />
                            <Controller
                              name={`donations.${index}.donationAmount`}
                              control={control}
                              rules={{ 
                                required: 'Amount is required', 
                                pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' }
                              }}
                              render={({ field, fieldState }) => (
                                <FormInput
                                  label="Amount"
                                  type="number"
                                  placeholder="e.g., 50.00"
                                  error={fieldState.error?.message}
                                  required
                                  prefix="£"
                                  {...field}
                                />
                              )}
                            />
                            <Controller
                              name={`donations.${index}.donationDate`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <FormInput
                                    label="Date (Optional)"
                                    type="date"
                                    error={fieldState.error?.message}
                                    className="pl-10"
                                    {...field}
                                    value={field.value || ''}
                                  />
                                </div>
                              )}
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => remove(index)}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none shadow-sm"
                            aria-label="Remove donation"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-center pt-5 mt-5 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => append({ charityName: '', donationAmount: '', donationDate: '' })} 
                      className="flex items-center text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Donation
                    </Button>
                  </div>
                </div>
              </motion.div>

              <div className="mt-8 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <Controller
                  name="usedGiftAid"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <FormCheckbox
                      label="Did you make these donations using Gift Aid?"
                      name={name}
                      checked={value}
                      onChange={onChange}
                      tooltip="Selecting this may allow you to claim higher/additional rate tax relief. We may need proof of donation."
                    />
                  )}
                />
                
                <AnimatePresence>
                  {usedGiftAid && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4"
                    >
                      <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                        <InformationCircleIcon className="h-5 w-5 mr-2 text-yellow-600" />
                        Gift Aid Declaration
                      </h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        By confirming you used Gift Aid, you declare that you have paid sufficient UK Income Tax and/or Capital Gains Tax to cover the amount HMRC will reclaim on your donations (25p for every £1 donated). 
                      </p>
                      <a href="https://www.gov.uk/donating-to-charity/gift-aid" target="_blank" rel="noopener noreferrer" className="text-xs text-yellow-800 underline hover:text-yellow-600 font-medium">
                        Learn more about Gift Aid
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.form>
    );
  }
);

export default CharitableDonationsSection; 