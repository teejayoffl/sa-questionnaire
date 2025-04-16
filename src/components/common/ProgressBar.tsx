import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  showMessage?: boolean;
  variant?: 'default' | 'success' | 'primary';
  totalSteps?: number;
  currentStep?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = true,
  showMessage = true,
  variant = 'default',
  totalSteps = 5,
  currentStep = 1,
}) => {
  const [prevProgress, setPrevProgress] = useState(progress);
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Trigger pulse animation when progress changes
  useEffect(() => {
    if (progress !== prevProgress) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 1000);
      setPrevProgress(progress);
      return () => clearTimeout(timer);
    }
  }, [progress, prevProgress]);

  // Generate a personalized message based on progress
  const getMessage = (progress: number): string => {
    if (progress === 0) return "Let's start your tax return journey!";
    if (progress < 25) return "Great start — you're making progress!";
    if (progress < 50) return "Keep going — you're doing great!";
    if (progress < 75) return "Halfway there — almost home!";
    if (progress < 100) return "Nearly there — the finish line is in sight!";
    return "Excellent! You've completed all sections.";
  };

  // Define progress bar gradient colors based on variant
  const getProgressBarStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-gradient-to-r from-[#104b8d] via-amber-500 to-orange-400';
      case 'primary':
        return 'bg-gradient-to-r from-[#104b8d] via-[#3a75b4] to-amber-500';
      default:
        return 'bg-gradient-to-r from-[#104b8d] via-[#3a75b4] to-amber-500';
    }
  };
  
  // Generate step indicators
  const renderStepIndicators = () => {
    return Array.from({ length: totalSteps }).map((_, index) => {
      const stepPosition = ((index + 1) / totalSteps) * 100;
      const isCompleted = progress >= stepPosition;
      const isActive = index + 1 === currentStep;
      
      // Color based on position in progress bar
      const getStepColor = (position: number) => {
        if (position < 33) return 'border-[#104b8d]'; // Beginning (blue)
        if (position < 66) return 'border-[#3a75b4]'; // Middle (medium blue)
        return 'border-amber-500'; // End (gold)
      };
      
      return (
        <motion.div
          key={`step-${index}`}
          className={`absolute top-0 w-4 h-4 rounded-full flex items-center justify-center -mt-1 border-2
                     transition-all duration-300 transform -translate-x-1/2
                     ${isCompleted ? getStepColor(stepPosition) : 'border-gray-200'} bg-white
                     ${isActive && !isCompleted ? 'scale-110' : ''}
                     ${isActive && isCompleted ? 'ring-2 ring-gray-100 scale-110' : ''}`}
          style={{ left: `${stepPosition}%` }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: isActive ? 1.1 : 1, 
            opacity: 1,
            boxShadow: isActive ? '0 0 10px rgba(58, 117, 180, 0.4)' : 'none'
          }}
          transition={{ duration: 0.3 }}
        >
          {isCompleted && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.1 }}
              className={`w-2 h-2 ${stepPosition < 66 ? 'text-[#104b8d]' : 'text-amber-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </motion.svg>
          )}
        </motion.div>
      );
    });
  };

  return (
    <div className="mb-4 relative">
      <div className="flex justify-between items-center mb-2">
        <AnimatePresence>
          {showMessage && (
            <motion.p 
              className="text-sm font-medium text-[#104b8d] tracking-tight"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.5 }}
              key={getMessage(progress)} // Animate when message changes
            >
              {getMessage(progress)}
            </motion.p>
          )}
        </AnimatePresence>
        
        {showPercentage && (
          <motion.span 
            className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#104b8d] to-amber-500"
            animate={{ 
              scale: isPulsing ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.span>
        )}
      </div>
      
      <div className="h-2 w-full bg-blue-50 rounded-full overflow-hidden shadow-inner relative">
        {/* Main progress indicator */}
        <motion.div
          className={`h-full ${getProgressBarStyles()} backdrop-blur-sm relative z-10`}
          initial={{ width: 0 }}
          animate={{ 
            width: `${progress}%`,
            boxShadow: isPulsing ? '0 0 8px rgba(16, 75, 141, 0.5)' : '0 1px 3px rgba(0,0,0,0.1)',
          }}
          transition={{ 
            width: { duration: 0.7, ease: "easeOut" },
            boxShadow: { duration: 0.3 }
          }}
        >
          {/* Animated shine effect */}
          <motion.div 
            className="absolute inset-0 w-full h-full"
            animate={{ 
              backgroundPosition: ['200% 0%', '-200% 0%'],
            }}
            transition={{ 
              duration: 3, 
              ease: "linear", 
              repeat: Infinity 
            }}
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
              backgroundSize: '200% 100%'
            }}
          />
          
          {/* Leading edge pulse */}
          <motion.div
            className="absolute right-0 top-0 h-full w-2 bg-white opacity-80 rounded-full"
            animate={{ 
              opacity: isPulsing ? [0, 0.8, 0] : 0,
              scale: isPulsing ? [1, 1.5, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
        
        {/* Step indicators */}
        {renderStepIndicators()}
      </div>
    </div>
  );
};

export default ProgressBar; 