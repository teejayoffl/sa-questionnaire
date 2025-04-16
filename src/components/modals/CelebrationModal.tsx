import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircleIcon, DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../context/FormContext';

interface CelebrationModalProps {
  onClose?: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ onClose }) => {
  const { formData } = useFormContext();
  
  // Trigger enhanced confetti effect when component mounts
  useEffect(() => {
    // Initial confetti burst
    const fireMainConfetti = () => {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#60a5fa', '#34d399', '#a78bfa', '#f87171'],
        scalar: 1.2
      });
    };

    // Side bursts
    const fireSideBursts = () => {
      // Left side burst
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.6 },
        colors: ['#60a5fa', '#34d399', '#a78bfa']
      });

      // Right side burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.6 },
          colors: ['#60a5fa', '#34d399', '#a78bfa']
        });
      }, 300);
    };

    // Sequence the confetti for a more dramatic effect
    fireMainConfetti();
    setTimeout(fireSideBursts, 500);
    
    // Final sprinkle after a delay
    setTimeout(() => {
      confetti({
        particleCount: 80,
        startVelocity: 30,
        spread: 360,
        origin: { x: 0.5, y: 0.4 },
        gravity: 0.8,
        ticks: 300,
        colors: ['#60a5fa', '#34d399', '#a78bfa', '#f87171']
      });
    }, 1500);
  }, []);

  // Get current date for the confirmation message
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentDate);

  // Set deadline date (30 days from now)
  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + 30);
  const formattedDeadline = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(deadlineDate);

  return (
    <motion.div 
      className="fixed inset-0 bg-blue-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1, bounce: 0.6 }}
          className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-6 shadow-inner"
        >
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-inter">Tax Return Submitted!</h2>
        <p className="text-gray-600 mb-6 font-inter">
          {formData.fullName ? `${formData.fullName}, your` : 'Your'} tax return questionnaire has been successfully submitted on {formattedDate}.
        </p>

        <motion.div
          className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start">
            <DocumentTextIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-medium text-blue-800 text-sm font-inter">What happens next?</h3>
              <p className="text-blue-700 text-xs mt-1 font-inter">
                Your accountant will review your information and prepare your tax return by <span className="font-medium">{formattedDeadline}</span>. 
                You'll receive an email confirmation shortly with a reference number.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-center text-green-800 text-sm font-medium font-inter">
            Reference #: <span className="font-bold">TR-{Math.floor(100000 + Math.random() * 900000)}</span>
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={onClose || (() => window.location.href = '/dashboard')}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center font-inter"
          >
            <span>Continue</span>
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CelebrationModal; 