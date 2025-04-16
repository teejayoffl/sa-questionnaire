import React, { useState, useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import ProgressBar from '../components/common/ProgressBar';
import { useFormContext, FormData } from '../context/FormContext';
import Button from '../components/common/Button';
import {
  PersonalInfoSection,
  EmploymentSection,
  SelfEmploymentSection,
  IncomeSelectionSection,
  TaxReliefSelectionSection,
  PropertySection,
  PartnershipSection,
  ForeignIncomeSection,
  CapitalGainsSection,
  OtherIncomeSection,
  CharitableDonationsSection,
  InvestmentSchemeSection,
  SummarySection,
  PensionSection,
  DocumentUploadSection,
  SubmissionComponent
} from '../components/sections';

// Define Step structure
interface OnboardingStep {
  id: string;
  title: string;
  component: React.ComponentType<any>; // Accept props like onComplete, onInvalid
  // We might add validation logic links here later
}

// --- Define the Multi-Step Flow (Full list including all possible steps) ---
const allOnboardingSteps: OnboardingStep[] = [
  { id: 'personal_info', title: 'Personal Information', component: PersonalInfoSection },
  { id: 'income_selection', title: 'Income Sources Selection', component: IncomeSelectionSection },
  { id: 'tax_relief_selection', title: 'Tax Relief Selection', component: TaxReliefSelectionSection },
  // --- Optional Income Detail Steps ---
  { id: 'employment_details', title: 'Employment Details', component: EmploymentSection },
  { id: 'self_employment_details', title: 'Self-Employment Details', component: SelfEmploymentSection },
  { id: 'property_details', title: 'Property Income Details', component: PropertySection },
  { id: 'partnership_details', title: 'Partnership Income Details', component: PartnershipSection },
  { id: 'foreign_income_details', title: 'Foreign Income Details', component: ForeignIncomeSection },
  { id: 'capital_gains_details', title: 'Capital Gains Details', component: CapitalGainsSection },
  { id: 'other_income_details', title: 'Other Income Details', component: OtherIncomeSection },
  // --- Optional Tax Relief Detail Steps ---
  { id: 'pension_details', title: 'Pension Contributions', component: PensionSection },
  { id: 'charity_details', title: 'Charitable Donations', component: CharitableDonationsSection },
  { id: 'investment_details', title: 'Investment Schemes', component: InvestmentSchemeSection },
  // --- Fixed Final Steps ---
  { id: 'summary', title: 'Summary & Review', component: SummarySection },
  { id: 'submission', title: 'Submission', component: SubmissionComponent },
];

// Mappings for dynamic steps
const incomeStepMap: Record<string, string> = {
  employment: 'employment_details',
  selfEmployment: 'self_employment_details',
  property: 'property_details',
  partnership: 'partnership_details',
  foreignIncome: 'foreign_income_details',
  capitalGains: 'capital_gains_details',
  otherIncome: 'other_income_details',
};

const reliefStepMap: Record<string, string> = {
  pension: 'pension_details',
  charity: 'charity_details',
  investmentSchemes: 'investment_details',
};

// --- Main Layout Component ---
const OnboardingLayout: React.FC = () => {
  const {
    formData, 
    updateFormData, 
    resetFormData, 
    // sectionsCompleted, // Might adapt or remove
    // setSectionCompleted 
  } = useFormContext();
  
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // --- Remove or comment out conversational state ---
  // const [currentNodeId, setCurrentNodeId] = useState('welcome');
  // const [conversation, setConversation] = useState<ConversationItem[]>([]);
  // const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);
  // const [showCelebration, setShowCelebration] = useState<boolean>(false);
  // const chatEndRef = useRef<HTMLDivElement>(null);
  // const formContainerRef = useRef<HTMLDivElement>(null);
  // const currentNode = conversationFlow.find(node => node.id === currentNodeId);

  // Ref for triggering child form submission
  const formRef = useRef<any | null>(null);

  // Debug log to check if formRef is being set correctly
  useEffect(() => {
    console.log('FormRef updated:', formRef.current);
  }, [formRef.current]);

  // --- Calculate Active Steps Dynamically ---
  const activeSteps = useMemo(() => {
    const steps: OnboardingStep[] = [];
    
    // 1. Add Fixed Initial Steps
    steps.push(allOnboardingSteps.find(s => s.id === 'personal_info')!);
    steps.push(allOnboardingSteps.find(s => s.id === 'income_selection')!);
    steps.push(allOnboardingSteps.find(s => s.id === 'tax_relief_selection')!);

    // 2. Add Selected Income Detail Steps (in predefined order)
    const selectedIncome = formData.selectedIncomeTypes || [];
    const incomeOrder = ['employment', 'selfEmployment', 'property', 'partnership', 'foreignIncome', 'capitalGains', 'otherIncome'];
    incomeOrder.forEach(incomeKey => {
      if (selectedIncome.includes(incomeKey)) {
        const stepId = incomeStepMap[incomeKey];
        const step = allOnboardingSteps.find(s => s.id === stepId);
        if (step) steps.push(step);
      }
    });

    // 3. Add Selected Tax Relief Detail Steps (in predefined order)
    const selectedReliefs = formData.selectedTaxReliefs || [];
    const reliefOrder = ['pension', 'charity', 'investmentSchemes'];
    reliefOrder.forEach(reliefKey => {
      if (selectedReliefs.includes(reliefKey)) {
        const stepId = reliefStepMap[reliefKey];
        const step = allOnboardingSteps.find(s => s.id === stepId);
        if (step) steps.push(step);
      }
    });

    // 4. Add Fixed Final Steps
    steps.push(allOnboardingSteps.find(s => s.id === 'summary')!);
    steps.push(allOnboardingSteps.find(s => s.id === 'submission')!);
    
    console.log("Calculated Active Steps:", steps.map(s => s.id));
    return steps;

  }, [formData.selectedIncomeTypes, formData.selectedTaxReliefs]); // Recalculate when selections change

  // Ensure currentStepIndex is valid if activeSteps changes length
  useEffect(() => {
     if (currentStepIndex >= activeSteps.length) {
        // Index is out of bounds, perhaps reset to last step (summary)?
        setCurrentStepIndex(Math.max(0, activeSteps.length - 1)); 
     }
  }, [activeSteps, currentStepIndex]);

  // --- Step Navigation Logic (Uses activeSteps) ---
  const currentStep = activeSteps[currentStepIndex];
  const totalSteps = activeSteps.length;
  
  const handleNext = (stepData?: any) => {
    console.log(`Step ${currentStep.id} completed with data:`, stepData);
    // Persist data from the step if needed (already handled by components via context)
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Handle final submission
      console.log("Reached end of steps, handling submission...");
      handleFinalSubmit();
    }
  };

  // New function to force navigation regardless of form state
  const handleForceNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      console.log(`Forcing navigation from step ${currentStep.id} to next step`);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFinalSubmit = () => {
    // In a real application, submit formData to backend
    console.log('Final Form Data:', formData);
    resetFormData();
    // Potentially navigate to a completion page or show modal
    // navigate('/completion'); 
    alert("Questionnaire Submitted Successfully!"); // Simple alert for now
  };
  
  // --- Remove or comment out conversational useEffects and handlers ---
  // useEffect(() => { /* Initialize conversation */ }, []);
  // useEffect(() => { /* Scroll to bottom */ }, [conversation, isTyping]);
  // useEffect(() => { /* Handle automatic message progression */ }, [currentNodeId, currentNode, formData]);
  // const handleOptionSelect = (option: Option) => { /* ... */ };
  // const handleFormComplete = (data: FormData) => { /* Now handled by handleNext */ };
  // const handleInvalidForm = (errors: any) => { /* ... */ };
  // const renderForm = () => { /* Replaced by direct rendering */ };
  // const renderOptions = () => { /* Removed */ };

  // --- Render Logic (Uses activeSteps) ---
  const CurrentComponent = currentStep?.component; // Add safe navigation in case activeSteps is briefly empty
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  // Handle case where CurrentComponent might be undefined briefly
  if (!CurrentComponent) {
     return <div>Loading step...</div>; // Or some loading indicator
  }

  // Check if we're on the submission step to handle it differently
  const isSubmissionStep = currentStep.id === 'submission';

  // Card variants for animated transitions
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.98,
      boxShadow: "0 0px 0px rgba(0, 0, 0, 0)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
      transition: { 
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.98,
      transition: { 
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  // Child element variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white font-inter overflow-hidden">
      {/* Header with premium animation */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative backdrop-blur-lg backdrop-saturate-150 border-b border-indigo-100 px-6 py-4 z-10 flex-shrink-0 shadow-sm bg-white/70"
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-indigo-600 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-indigo-50 group">
              <motion.div
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftIcon className="h-5 w-5 group-hover:text-blue-700 transition-colors" />
              </motion.div>
            </Link>
             
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-600">
                Self-Assessment Questionnaire
              </h1>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="w-1/2 max-w-md">
            <div className="text-right text-xs text-indigo-700 mb-1 font-medium">
              <motion.span
                key={`step-${currentStepIndex}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                Step {currentStepIndex + 1} of {totalSteps}
              </motion.span>
            </div>
            <ProgressBar 
              progress={progress} 
              totalSteps={totalSteps} 
              currentStep={currentStepIndex + 1}
              variant="primary"
            />
          </div>
        </div>
      </motion.header>
      
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-200 mix-blend-multiply opacity-20 filter blur-3xl"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.15, 0.2, 0.15]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-blue-200 mix-blend-multiply opacity-15 filter blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-indigo-100 mix-blend-multiply opacity-15 filter blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2.5
          }}
        />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          {/* Title for the current step with typed animation effect */}
          <AnimatePresence>
            <motion.h2 
              key={`title-${currentStep.id}`}
              initial={{ opacity: 0, x: -10, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 10, filter: "blur(8px)" }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-blue-700 mb-6"
            >
              {currentStep.title}
            </motion.h2>
          </AnimatePresence>
          
          {/* Render the current step's component with enhanced animations */}
          <AnimatePresence>
            <motion.div 
              key={`content-${currentStep.id}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-6 md:p-8 rounded-2xl border border-indigo-50 shadow-lg shadow-indigo-100/30 relative overflow-hidden"
            >
              {/* Subtle gradient overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-indigo-50/10 pointer-events-none" />
              
              {/* Content with staggered children animations */}
              <motion.div className="relative z-10" variants={itemVariants}>
                {isSubmissionStep ? (
                  <CurrentComponent key={currentStep.id} />
                ) : (
                  <CurrentComponent 
                    ref={formRef}
                    key={currentStep.id} 
                    onComplete={handleNext} 
                  />
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Buttons with enhanced animations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-between mt-8 pt-6 border-t border-indigo-100"
          >
             <Button 
                variant="secondary" 
                onClick={handlePrevious} 
                disabled={currentStepIndex === 0}
                icon={<ArrowLeftIcon className="h-4 w-4" />}
                size="md"
              >
                Previous
              </Button>
              
              {/* Primary button with additional safeguards */}
              <Button
                variant={currentStep.id === 'summary' ? 'success' : 'primary'}
                size="md"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                   // Record double-click to force navigation
                   const now = Date.now();
                   // @ts-ignore - Add a custom property to the button element
                   const lastClick = e.currentTarget._lastClickTime || 0;
                   // @ts-ignore
                   e.currentTarget._lastClickTime = now;
                   
                   // If double-clicked within 300ms, force navigation
                   if (now - lastClick < 300) {
                     console.log("Double-click detected, forcing navigation");
                     handleForceNext();
                     return;
                   }
                
                   if (currentStep.id === 'submission') {
                      handleFinalSubmit(); // Final step action
                   } else if (formRef.current) {
                     console.log(`Triggering submission for step: ${currentStep.id}`);
                     console.log('Form ref available:', formRef.current);
                     
                     // Check if submitForm exists before calling it
                     if (typeof formRef.current.submitForm === 'function') {
                       formRef.current.submitForm(); // Trigger child form submit
                     } else {
                       console.warn("submitForm method not found on form ref, using direct navigation");
                       // Fallback to direct navigation if submitForm doesn't exist
                       handleForceNext();
                     }
                   } else {
                     console.warn("Form ref not available for submission, using direct navigation");
                     // Fallback to direct navigation if form ref is not available
                     handleForceNext();
                   }
                }}
                icon={currentStep.id === 'summary' ? <CheckCircleIcon className="h-4 w-4" /> : null}
              >
                <span className="flex items-center whitespace-nowrap">
                  {currentStep.id === 'summary' ? 'Confirm & Submit' : (currentStep.id === 'submission' ? 'Finish' : 'Next Step')}
                  {currentStep.id !== 'submission' && currentStep.id !== 'summary' && <ArrowRightIcon className="h-4 w-4 ml-2" />}
                </span>
              </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default OnboardingLayout; 