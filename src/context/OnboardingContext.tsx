import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for our onboarding context
interface OnboardingContextData {
  // Current active section
  activeSection: string;
  
  // Form data storage for all sections
  formData: Record<string, any>;
  
  // Completed sections
  completedSections: string[];
}

// Define the context type
interface OnboardingContextType {
  onboardingData: OnboardingContextData;
  setActiveSection: (section: string) => void;
  updateFormData: (section: string, data: any) => void;
  markSectionCompleted: (section: string) => void;
  markSectionIncomplete: (section: string) => void;
  isSectionCompleted: (section: string) => boolean;
}

// Initial context state
const initialOnboardingData: OnboardingContextData = {
  activeSection: 'personalInfo',
  formData: {},
  completedSections: [],
};

// Create the context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Create context provider component
interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingContextData>(() => {
    // Try to load state from localStorage
    try {
      const savedData = localStorage.getItem('onboarding_data');
      return savedData ? JSON.parse(savedData) : initialOnboardingData;
    } catch (error) {
      console.error('Error loading onboarding data from localStorage:', error);
      return initialOnboardingData;
    }
  });

  // Save to localStorage whenever state changes
  const saveToLocalStorage = (data: OnboardingContextData) => {
    try {
      localStorage.setItem('onboarding_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving onboarding data to localStorage:', error);
    }
  };

  // Set active section
  const setActiveSection = (section: string) => {
    setOnboardingData((prev) => {
      const newData = { ...prev, activeSection: section };
      saveToLocalStorage(newData);
      return newData;
    });
  };

  // Update form data for a specific section
  const updateFormData = (section: string, data: any) => {
    setOnboardingData((prev) => {
      const newData = {
        ...prev,
        formData: {
          ...prev.formData,
          [section]: { ...prev.formData[section], ...data },
        },
      };
      saveToLocalStorage(newData);
      return newData;
    });
  };

  // Mark a section as completed
  const markSectionCompleted = (section: string) => {
    setOnboardingData((prev) => {
      if (prev.completedSections.includes(section)) {
        return prev;
      }
      
      const newData = {
        ...prev,
        completedSections: [...prev.completedSections, section],
      };
      saveToLocalStorage(newData);
      return newData;
    });
  };

  // Mark a section as incomplete
  const markSectionIncomplete = (section: string) => {
    setOnboardingData((prev) => {
      const newData = {
        ...prev,
        completedSections: prev.completedSections.filter((s) => s !== section),
      };
      saveToLocalStorage(newData);
      return newData;
    });
  };

  // Check if a section is completed
  const isSectionCompleted = (section: string): boolean => {
    return onboardingData.completedSections.includes(section);
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        setActiveSection,
        updateFormData,
        markSectionCompleted,
        markSectionIncomplete,
        isSectionCompleted,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook to use the onboarding context
export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingContext; 