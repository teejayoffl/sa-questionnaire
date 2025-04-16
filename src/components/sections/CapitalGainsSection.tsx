import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PresentationChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  HomeIcon,
  ShoppingBagIcon,
  CalculatorIcon,
  PencilSquareIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

import { 
  Button, 
  FormInput, 
  FormTextArea, 
  FormSelect, 
  FormCheckbox,
  FormRadioGroup,
  Accordion, 
  AccordionItem 
} from '../common';

export interface CapitalGainsFormValues {
  // General questions
  disposedOfAssets: boolean;
  reportedViaPropertyService: boolean;
  
  // Disposal details
  assetDescription: string;
  assetType: string;
  acquisitionDate: string;
  disposalDate: string;
  proceedsAmount: string;
  acquisitionCosts: string;
  saleCosts: string;
  improvementCosts: string;
  otherAllowableCosts: string;
  netGainOrLoss: string;
  netChargeableGains: string;
  annualExemptAmount: string;
  taxableGainsAfterExemption: string;
  
  // Losses and exemptions
  claimLossesAgainstGains: boolean;
  currentYearLosses: string;
  broughtForwardLosses: string;
  previousLossesUsed: string;
  annualExemption: string;
  
  // Shares and securities
  soldShares: boolean;
  companyName: string;
  numberOfShares: string;
  listedOnStockExchange: boolean;
  soldCrypto: boolean;
  cryptoType: string;
  
  // Property details
  soldUKProperty: boolean;
  wasMainHome: boolean;
  wasPropertyLet: boolean;
  submittedPropertyCGTReturn: boolean;
  usedForBusinessPurposes: boolean;
  
  // Business Asset Disposal Relief
  claimingBusinessAssetDisposalRelief: boolean;
  businessAssetDescription: string;
  businessCeaseDate: string;
  ownershipPercentage: string;
  qualifyingPeriodMet: boolean;
  businessReliefAmountClaimed: string;
  
  // Additional notes
  additionalNotes: string;
}

export interface CapitalGainsSectionRef {
  submitForm: () => Promise<CapitalGainsFormValues>;
}

export const CapitalGainsSection = forwardRef<CapitalGainsSectionRef, {}>(
  (props, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
      reset,
    } = useForm<CapitalGainsFormValues>({
      defaultValues: {
        disposedOfAssets: false,
        reportedViaPropertyService: false,
        assetDescription: '',
        assetType: '',
        acquisitionDate: '',
        disposalDate: '',
        proceedsAmount: '',
        acquisitionCosts: '',
        saleCosts: '',
        improvementCosts: '',
        otherAllowableCosts: '',
        netGainOrLoss: '0.00',
        netChargeableGains: '0.00',
        annualExemptAmount: '0.00',
        taxableGainsAfterExemption: '0.00',
        claimLossesAgainstGains: false,
        currentYearLosses: '',
        broughtForwardLosses: '',
        previousLossesUsed: '',
        annualExemption: '',
        soldShares: false,
        companyName: '',
        numberOfShares: '',
        listedOnStockExchange: false,
        soldCrypto: false,
        cryptoType: '',
        soldUKProperty: false,
        wasMainHome: false,
        wasPropertyLet: false,
        submittedPropertyCGTReturn: false,
        usedForBusinessPurposes: false,
        claimingBusinessAssetDisposalRelief: false,
        businessAssetDescription: '',
        businessCeaseDate: '',
        ownershipPercentage: '',
        qualifyingPeriodMet: false,
        businessReliefAmountClaimed: '',
        additionalNotes: ''
      }
    });

    // Watch for values we need for conditional rendering
    const disposedOfAssets = watch('disposedOfAssets');
    const claimLossesAgainstGains = watch('claimLossesAgainstGains');
    const soldShares = watch('soldShares');
    const soldCrypto = watch('soldCrypto');
    const soldUKProperty = watch('soldUKProperty');
    const claimingBusinessAssetDisposalRelief = watch('claimingBusinessAssetDisposalRelief');

    // Calculate net gain or loss when relevant values change
    useEffect(() => {
      const proceeds = parseFloat(watch('proceedsAmount') || '0');
      const acquisition = parseFloat(watch('acquisitionCosts') || '0');
      const saleCosts = parseFloat(watch('saleCosts') || '0');
      const improvementCosts = parseFloat(watch('improvementCosts') || '0');
      const otherCosts = parseFloat(watch('otherAllowableCosts') || '0');
      
      const totalCosts = acquisition + saleCosts + improvementCosts + otherCosts;
      const netGainOrLoss = proceeds - totalCosts;
      
      setValue('netGainOrLoss', netGainOrLoss.toFixed(2));
      
      // Calculate net chargeable gains (after losses but before annual exemption)
      let netChargeable = netGainOrLoss;
      if (claimLossesAgainstGains && netGainOrLoss > 0) {
        const currentYearLosses = parseFloat(watch('currentYearLosses') || '0');
        const broughtForwardLosses = parseFloat(watch('broughtForwardLosses') || '0');
        netChargeable = Math.max(0, netGainOrLoss - currentYearLosses - broughtForwardLosses);
      }
      
      setValue('netChargeableGains', netChargeable.toFixed(2));
      
      // Apply annual exemption (£3,000 for 2024/25)
      const annualExemption = Math.min(3000, netChargeable);
      setValue('annualExemptAmount', annualExemption.toFixed(2));
      
      // Calculate final taxable gains
      const taxableGains = Math.max(0, netChargeable - annualExemption);
      setValue('taxableGainsAfterExemption', taxableGains.toFixed(2));
    }, [
      watch('proceedsAmount'),
      watch('acquisitionCosts'),
      watch('saleCosts'),
      watch('improvementCosts'),
      watch('otherAllowableCosts'),
      watch('currentYearLosses'),
      watch('broughtForwardLosses'),
      claimLossesAgainstGains,
      setValue,
      watch
    ]);

    const onSubmit = (data: CapitalGainsFormValues) => {
      console.log('Form submitted with data:', data);
      return data;
    };

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        return new Promise<CapitalGainsFormValues>((resolve, reject) => {
          handleSubmit((data) => {
            resolve(data);
          })();
        });
      },
    }));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      setValue(name as keyof CapitalGainsFormValues, newValue as any);
    };

    // Animation variants for motion components
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
        },
      },
    };

    const assetTypes = [
      { label: 'Property', value: 'property' },
      { label: 'Shares/Securities', value: 'shares' },
      { label: 'Cryptocurrency', value: 'crypto' },
      { label: 'Business Asset', value: 'business' },
      { label: 'Personal Possession (>£6,000)', value: 'possession' },
      { label: 'Other', value: 'other' },
    ];

    return (
      <motion.form
        className="space-y-8 pb-12 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit(onSubmit)}
        data-testid="capital-gains-form"
      >
        <h2 className="text-2xl font-semibold text-indigo-800 ml-4 mb-6">Capital Gains Details</h2>
        
        <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-lg overflow-hidden m-4">
          <div className="px-8 py-6">
            <div className="bg-blue-600 rounded-xl px-6 py-4 mb-8">
              <h3 className="text-xl font-semibold text-white">Capital Gains Information</h3>
              <p className="text-blue-100 mt-1">
                Please provide details about any chargeable assets you've disposed of during the tax year.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start">
              <div className="text-blue-500 mr-3 mt-0.5">
                <InformationCircleIcon className="h-5 w-5" />
              </div>
              <p className="text-blue-800">
                Capital Gains Tax may apply when you sell or 'dispose of' an asset that has increased in value. For tax purposes, 'disposing of an asset' includes selling, gifting, exchanging, or receiving compensation for it (such as an insurance payout).
              </p>
            </div>

            {/* Card-based selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                onClick={() => setValue('disposedOfAssets', true, { shouldValidate: true })}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 ${disposedOfAssets ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className={`h-6 w-6 mr-3 ${disposedOfAssets ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${disposedOfAssets ? 'text-blue-700' : 'text-gray-700'}`}>Yes, I disposed of assets</span>
                  </div>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${disposedOfAssets ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {disposedOfAssets && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-9">Select this if you sold, gifted, or exchanged chargeable assets.</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.03 }}
                onClick={() => setValue('disposedOfAssets', false, { shouldValidate: true })}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 ${!disposedOfAssets ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className={`h-6 w-6 mr-3 ${!disposedOfAssets ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${!disposedOfAssets ? 'text-blue-700' : 'text-gray-700'}`}>No, I did not dispose of assets</span>
                  </div>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${!disposedOfAssets ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {!disposedOfAssets && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-9">Select this if you did not dispose of any chargeable assets this year.</p>
              </motion.div>
            </div>

            {/* Conditional section for UK Property Reporting Service */}
            <AnimatePresence>
              {disposedOfAssets && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '2rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <FormCheckbox
                    label="Have you already reported any disposals via the UK Property Reporting Service?"
                    name="reportedViaPropertyService"
                    checked={watch('reportedViaPropertyService')}
                    onChange={handleInputChange}
                    tooltip="For UK property disposals that were reported within 60 days"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {disposedOfAssets && (
          <motion.div variants={itemVariants} className="mt-8 mx-4">
            <Accordion defaultOpenIndex={0}>
              {/* Section 1: Disposal Details */}
              <AccordionItem 
                title="Disposal Details" 
                description="Information about the asset disposed of"
                icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
              >
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      Please provide information about the asset you disposed of. If you disposed of multiple assets, use the 'Additional Notes' section to provide details of other disposals.
                    </p>
                  </div>
                  
                  <Controller
                    name="assetDescription"
                    control={control}
                    rules={{ required: 'Asset description is required' }}
                    render={({ field }) => (
                      <FormInput
                        label="Description of Asset"
                        placeholder="e.g., 100 shares in Company XYZ, 2-bedroom flat"
                        error={errors.assetDescription?.message}
                        required
                        tooltip="Provide a clear description of what was sold or disposed of"
                        {...field}
                      />
                    )}
                  />
                  
                  <Controller
                    name="assetType"
                    control={control}
                    rules={{ required: 'Asset type is required' }}
                    render={({ field }) => (
                      <FormSelect
                        label="Type of Asset"
                        error={errors.assetType?.message}
                        required
                        options={assetTypes}
                        tooltip="The category of asset that was disposed of"
                        {...field}
                      />
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                      name="acquisitionDate"
                      control={control}
                      rules={{ required: 'Acquisition date is required' }}
                      render={({ field }) => (
                        <FormInput
                          label="Date of Acquisition"
                          type="date"
                          error={errors.acquisitionDate?.message}
                          required
                          tooltip="When you originally purchased or acquired the asset"
                          {...field}
                        />
                      )}
                    />
                    
                    <Controller
                      name="disposalDate"
                      control={control}
                      rules={{ required: 'Disposal date is required' }}
                      render={({ field }) => (
                        <FormInput
                          label="Date of Disposal"
                          type="date"
                          error={errors.disposalDate?.message}
                          required
                          tooltip="When you sold, gifted or otherwise disposed of the asset"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  
                  <Controller
                    name="proceedsAmount"
                    control={control}
                    rules={{ 
                      required: 'Proceeds amount is required',
                      pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
                    }}
                    render={({ field }) => (
                      <FormInput
                        label="Proceeds from Disposal"
                        type="number"
                        placeholder="£0.00"
                        prefix="£"
                        error={errors.proceedsAmount?.message}
                        required
                        tooltip="The amount you received from selling or disposing of the asset"
                        {...field}
                      />
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                      name="acquisitionCosts"
                      control={control}
                      rules={{ 
                        required: 'Acquisition cost is required',
                        pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
                      }}
                      render={({ field }) => (
                        <FormInput
                          label="Original Cost"
                          type="number"
                          placeholder="£0.00"
                          prefix="£"
                          error={errors.acquisitionCosts?.message}
                          required
                          tooltip="What you originally paid for the asset"
                          {...field}
                        />
                      )}
                    />
                    
                    <Controller
                      name="saleCosts"
                      control={control}
                      rules={{ 
                        pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
                      }}
                      render={({ field }) => (
                        <FormInput
                          label="Selling Costs"
                          type="number"
                          placeholder="£0.00"
                          prefix="£"
                          error={errors.saleCosts?.message}
                          tooltip="Fees paid when selling, e.g., estate agent, legal fees, auction fees"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                      name="improvementCosts"
                      control={control}
                      rules={{ 
                        pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
                      }}
                      render={({ field }) => (
                        <FormInput
                          label="Improvement Costs"
                          type="number"
                          placeholder="£0.00"
                          prefix="£"
                          error={errors.improvementCosts?.message}
                          tooltip="Cost of capital improvements that enhanced the value (e.g., property renovations)"
                          {...field}
                        />
                      )}
                    />
                    
                    <Controller
                      name="otherAllowableCosts"
                      control={control}
                      rules={{ 
                        pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
                      }}
                      render={({ field }) => (
                        <FormInput
                          label="Other Allowable Costs"
                          type="number"
                          placeholder="£0.00"
                          prefix="£"
                          error={errors.otherAllowableCosts?.message}
                          tooltip="Any other costs related to acquisition or disposal that are allowable"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="text-green-700 font-medium">Net Gain/(Loss):</p>
                      <p className={`font-semibold text-lg ${parseFloat(watch('netGainOrLoss')) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                        £{watch('netGainOrLoss')}
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionItem>
              
              {/* Section 2: Losses and Exemptions */}
              <AccordionItem 
                title="Losses and Exemptions" 
                description="Information about available losses and exemptions"
                icon={<BanknotesIcon className="w-5 h-5 text-blue-600" />}
              >
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                    <p className="text-sm text-blue-700">
                      You can offset capital losses against gains to reduce your tax liability. Losses from the current year are automatically set against gains. You can also claim to use losses from previous years.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <FormCheckbox
                      label="Do you want to claim losses against your gains?"
                      name="claimLossesAgainstGains"
                      checked={claimLossesAgainstGains}
                      onChange={handleInputChange}
                      tooltip="If you have capital losses to offset against your gains"
                    />
                    
                    {claimLossesAgainstGains && (
                      <div className="mt-6 ml-7 space-y-4">
                        <Controller
                          name="currentYearLosses"
                          control={control}
                          rules={{ 
                            pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
                          }}
                          render={({ field }) => (
                            <FormInput
                              label="Current Year Losses"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.currentYearLosses?.message}
                              tooltip="Losses from other asset disposals in the current tax year"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="broughtForwardLosses"
                          control={control}
                          rules={{ 
                            pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
                          }}
                          render={({ field }) => (
                            <FormInput
                              label="Losses Brought Forward from Previous Years"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.broughtForwardLosses?.message}
                              tooltip="Unused capital losses from previous tax years"
                              {...field}
                            />
                          )}
                        />
                        
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700">
                            Note: Capital losses must be claimed within 4 years of the end of the tax year in which they arose.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm">
                    <p className="text-sm text-indigo-700">
                      <span className="font-medium">Annual Exempt Amount:</span> For the 2024/25 tax year, the first £3,000 of total gains are exempt from Capital Gains Tax.
                    </p>
                  </div>
                </div>
              </AccordionItem>
              
              {/* Section 3: Shares and Securities */}
              <AccordionItem 
                title="Shares and Securities" 
                description="Information about share disposals and crypto assets"
                icon={<ChartBarIcon className="w-5 h-5 text-blue-600" />}
              >
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                    <p className="text-sm text-blue-700">
                      Provide details about any shares, securities or crypto assets you've disposed of during the tax year.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <FormCheckbox
                        label="Did you sell shares or securities?"
                        name="soldShares"
                        checked={soldShares}
                        onChange={handleInputChange}
                        tooltip="Including shares in companies, unit trusts, or investment trusts"
                      />
                      
                      {soldShares && (
                        <div className="mt-6 ml-7 space-y-4">
                          <Controller
                            name="companyName"
                            control={control}
                            rules={{ required: soldShares ? 'Company name is required' : false }}
                            render={({ field }) => (
                              <FormInput
                                label="Company/Fund Name"
                                placeholder="e.g., Apple Inc., FTSE 100 Index Fund"
                                error={errors.companyName?.message}
                                required={soldShares}
                                tooltip="The name of the company or fund whose shares you sold"
                                {...field}
                              />
                            )}
                          />
                          
                          <Controller
                            name="numberOfShares"
                            control={control}
                            rules={{ 
                              required: soldShares ? 'Number of shares is required' : false,
                              pattern: { value: /^[0-9]+$/, message: 'Enter a valid number' } 
                            }}
                            render={({ field }) => (
                              <FormInput
                                label="Number of Shares/Units"
                                type="number"
                                placeholder="e.g., 100"
                                error={errors.numberOfShares?.message}
                                required={soldShares}
                                tooltip="How many shares or units you sold"
                                {...field}
                              />
                            )}
                          />
                          
                          <FormCheckbox
                            label="Were the shares listed on a recognized stock exchange?"
                            name="listedOnStockExchange"
                            checked={watch('listedOnStockExchange')}
                            onChange={handleInputChange}
                            tooltip="If they were traded on a recognized exchange like London Stock Exchange, NYSE, etc."
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <FormCheckbox
                        label="Did you sell or dispose of any crypto assets?"
                        name="soldCrypto"
                        checked={soldCrypto}
                        onChange={handleInputChange}
                        tooltip="Including Bitcoin, Ethereum, NFTs, or other cryptocurrencies/tokens"
                      />
                      
                      {soldCrypto && (
                        <div className="mt-6 ml-7 space-y-4">
                          <Controller
                            name="cryptoType"
                            control={control}
                            rules={{ required: soldCrypto ? 'Crypto type is required' : false }}
                            render={({ field }) => (
                              <FormInput
                                label="Type of Cryptocurrency/Asset"
                                placeholder="e.g., Bitcoin, Ethereum, NFT"
                                error={errors.cryptoType?.message}
                                required={soldCrypto}
                                tooltip="The type of crypto asset you disposed of"
                                {...field}
                              />
                            )}
                          />
                          
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
                            <p className="text-sm text-amber-700">
                              <span className="font-medium">Important:</span> HMRC treats crypto assets as property for Capital Gains Tax purposes. Each separate disposal (including crypto-to-crypto exchanges) is a taxable event.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionItem>

              {/* Section 4: Property */}
              <AccordionItem 
                title="Property" 
                description="Information about property disposals"
                icon={<HomeIcon className="w-5 h-5 text-blue-600" />}
              >
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                    <p className="text-sm text-blue-700">
                      Provide details about any property you've sold or disposed of during the tax year.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <FormCheckbox
                        label="Did you sell or dispose of a UK residential or commercial property?"
                        name="soldUKProperty"
                        checked={soldUKProperty}
                        onChange={handleInputChange}
                        tooltip="Including houses, flats, land, commercial premises"
                      />
                      
                      {soldUKProperty && (
                        <div className="mt-6 ml-7 space-y-4">
                          <FormCheckbox
                            label="Was this your main home?"
                            name="wasMainHome"
                            checked={watch('wasMainHome')}
                            onChange={handleInputChange}
                            tooltip="Your primary residence (principal private residence)"
                          />
                          
                          {watch('wasMainHome') && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                              <p className="text-sm text-green-700">
                                <span className="font-medium">Note:</span> If this was your only home and you lived in it for the entire period of ownership, you may be eligible for Principal Private Residence (PPR) Relief, which means no Capital Gains Tax is due.
                              </p>
                            </div>
                          )}
                          
                          <FormCheckbox
                            label="Was the property let out at any time?"
                            name="wasPropertyLet"
                            checked={watch('wasPropertyLet')}
                            onChange={handleInputChange}
                            tooltip="Rented to tenants for any period of ownership"
                          />
                          
                          {watch('wasPropertyLet') && watch('wasMainHome') && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
                              <p className="text-sm text-amber-700">
                                You may be eligible for Lettings Relief if you let out part or all of your main home.
                              </p>
                            </div>
                          )}
                          
                          <FormCheckbox
                            label="Did you submit a 60-day property CGT return?"
                            name="submittedPropertyCGTReturn"
                            checked={watch('submittedPropertyCGTReturn')}
                            onChange={handleInputChange}
                            tooltip="UK residents must report and pay CGT on UK residential property within 60 days of completion"
                          />
                          
                          <FormCheckbox
                            label="Was any part of the property used for business purposes?"
                            name="usedForBusinessPurposes"
                            checked={watch('usedForBusinessPurposes')}
                            onChange={handleInputChange}
                            tooltip="Such as a home office with business property relief claimed"
                          />
                          
                          {watch('usedForBusinessPurposes') && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
                              <p className="text-sm text-amber-700">
                                If part of the property was used exclusively for business purposes, that portion may not qualify for Principal Private Residence relief.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionItem>
              
              {/* Section 5: Business Asset Disposal Relief */}
              <AccordionItem 
                title="Business Asset Disposal Relief" 
                description="Formerly Entrepreneurs' Relief"
                icon={<ShoppingBagIcon className="w-5 h-5 text-blue-600" />}
              >
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                    <p className="text-sm text-blue-700">
                      Business Asset Disposal Relief (formerly Entrepreneurs' Relief) reduces the rate of Capital Gains Tax to 10% when you dispose of qualifying business assets, up to a lifetime limit of £1 million of gains.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <FormCheckbox
                      label="Are you claiming Business Asset Disposal Relief?"
                      name="claimingBusinessAssetDisposalRelief"
                      checked={claimingBusinessAssetDisposalRelief}
                      onChange={handleInputChange}
                      tooltip="For disposals of qualifying business assets"
                    />
                    
                    {claimingBusinessAssetDisposalRelief && (
                      <div className="mt-6 ml-7 space-y-4">
                        <Controller
                          name="businessAssetDescription"
                          control={control}
                          rules={{ required: claimingBusinessAssetDisposalRelief ? 'Business asset description is required' : false }}
                          render={({ field }) => (
                            <FormInput
                              label="Description of Business Asset"
                              placeholder="e.g., Shares in XYZ Ltd, Business premises"
                              error={errors.businessAssetDescription?.message}
                              required={claimingBusinessAssetDisposalRelief}
                              tooltip="The qualifying business asset you disposed of"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="businessCeaseDate"
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              label="Date Business Ceased (if applicable)"
                              type="date"
                              error={errors.businessCeaseDate?.message}
                              tooltip="If you're disposing of assets after closing your business"
                              {...field}
                            />
                          )}
                        />
                        
                        <Controller
                          name="ownershipPercentage"
                          control={control}
                          rules={{ 
                            pattern: { value: /^(100|[1-9]?[0-9])$/, message: 'Enter a valid percentage (0-100)' } 
                          }}
                          render={({ field }) => (
                            <FormInput
                              label="Your Ownership Percentage"
                              type="number"
                              placeholder="e.g., 25"
                              suffix="%"
                              error={errors.ownershipPercentage?.message}
                              tooltip="Your percentage ownership of the business"
                              {...field}
                            />
                          )}
                        />
                        
                        <FormCheckbox
                          label="Did you meet the qualifying period of 2 years?"
                          name="qualifyingPeriodMet"
                          checked={watch('qualifyingPeriodMet')}
                          onChange={handleInputChange}
                          tooltip="You must have owned the business asset for at least 2 years to qualify"
                        />
                        
                        <Controller
                          name="businessReliefAmountClaimed"
                          control={control}
                          rules={{ 
                            required: claimingBusinessAssetDisposalRelief ? 'Relief amount is required' : false,
                            pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid amount' } 
                          }}
                          render={({ field }) => (
                            <FormInput
                              label="Amount of Relief Claimed"
                              type="number"
                              placeholder="£0.00"
                              prefix="£"
                              error={errors.businessReliefAmountClaimed?.message}
                              required={claimingBusinessAssetDisposalRelief}
                              tooltip="The amount of gain on which you're claiming the relief"
                              {...field}
                            />
                          )}
                        />
                        
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
                          <p className="text-sm text-amber-700">
                            <span className="font-medium">Important:</span> The lifetime limit for Business Asset Disposal Relief is £1 million. Any gains above this limit will be taxed at the standard CGT rates.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionItem>
              
              {/* Section 6: Capital Gains Summary */}
              <AccordionItem 
                title="Capital Gains Summary" 
                description="Summary of your capital gains position"
                icon={<CalculatorIcon className="w-5 h-5 text-blue-600" />}
              >
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                    <p className="text-sm text-blue-700">
                      This is a summary of your capital gains position based on the information provided. Your accountant will use this to complete your tax return.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                      <h3 className="font-medium text-gray-800">Capital Gains Summary</h3>
                    </div>
                    
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Total Proceeds:</span>
                          <span className="font-medium">£{watch('proceedsAmount') || '0.00'}</span>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Total Allowable Costs:</span>
                          <span className="font-medium">£{(
                            parseFloat(watch('acquisitionCosts') || '0') +
                            parseFloat(watch('saleCosts') || '0') +
                            parseFloat(watch('improvementCosts') || '0') +
                            parseFloat(watch('otherAllowableCosts') || '0')
                          ).toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Gross Gain/(Loss):</span>
                          <span className={`font-medium ${parseFloat(watch('netGainOrLoss')) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            £{watch('netGainOrLoss')}
                          </span>
                        </div>
                        
                        {claimLossesAgainstGains && (
                          <>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Current Year Losses Used:</span>
                              <span className="font-medium">£{watch('currentYearLosses') || '0.00'}</span>
                            </div>
                            
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Brought Forward Losses Used:</span>
                              <span className="font-medium">£{watch('broughtForwardLosses') || '0.00'}</span>
                            </div>
                          </>
                        )}
                        
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Net Chargeable Gains:</span>
                          <span className="font-medium">£{watch('netChargeableGains')}</span>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Annual Exempt Amount Used:</span>
                          <span className="font-medium">£{watch('annualExemptAmount')}</span>
                        </div>
                        
                        <div className="flex justify-between py-2">
                          <span className="text-gray-800 font-medium">Taxable Gains:</span>
                          <span className="text-gray-800 font-semibold">£{watch('taxableGainsAfterExemption')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
                    <p className="text-sm text-amber-700">
                      <span className="font-medium">Note:</span> This is an estimate based on the information provided. Your final tax liability may differ after your accountant completes your tax return. CGT rates vary depending on your income tax band and the type of asset disposed of.
                    </p>
                  </div>
                </div>
              </AccordionItem>
              
              {/* Section 7: Additional Notes */}
              <AccordionItem 
                title="Additional Notes" 
                description="Any other relevant information"
                icon={<PencilSquareIcon className="w-5 h-5 text-blue-600" />}
              >
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                    <p className="text-sm text-blue-700">
                      Please provide any additional information that may be relevant to your capital gains. If you have multiple disposals, consider uploading a separate schedule.
                    </p>
                  </div>
                  
                  <Controller
                    name="additionalNotes"
                    control={control}
                    render={({ field }) => (
                      <FormTextArea
                        label="Additional Notes"
                        placeholder="Enter any additional information about your capital gains here..."
                        rows={5}
                        error={errors.additionalNotes?.message}
                        tooltip="Any other relevant information that doesn't fit elsewhere"
                        {...field}
                      />
                    )}
                  />
                </div>
              </AccordionItem>
            </Accordion>
          </motion.div>
        )}
        
        {/* Hidden submit button for form validation */}
        <button type="submit" className="hidden" data-testid="capital-gains-submit-button" />
      </motion.form>
    );
  }
);

export default CapitalGainsSection; 