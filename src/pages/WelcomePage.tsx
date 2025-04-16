import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { ArrowRightIcon, ShieldCheckIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';

// Define brand colors for easier reference
const brandColors = {
  royalBlue: '#104b8d',
  metallicBlue: '#5ea1db',
  orange: '#f39200',
  gold: '#f9be29',
};

// Countdown component for the self-assessment deadline
const DeadlineCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set deadline to January 31, 2026
    const deadline = new Date('2026-01-31T23:59:59').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-[#5ea1db]/30 w-full max-w-xs mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="flex items-center justify-center gap-2 mb-2 text-[#104b8d]">
        <CalendarIcon className="h-4 w-4" />
        <h3 className="font-semibold text-sm">Tax Deadline: 31 Jan 2026</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-1">
        {[
          { label: 'D', value: timeLeft.days },
          { label: 'H', value: timeLeft.hours },
          { label: 'M', value: timeLeft.minutes },
          { label: 'S', value: timeLeft.seconds }
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="bg-gradient-to-b from-white to-[#f7f9fc] rounded-lg shadow-sm border border-[#5ea1db]/10 p-1">
              <div className="text-base md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#104b8d] to-[#5ea1db]">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-gray-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#f7f9fc] to-[#eef4fb] p-4 md:p-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -right-32 w-[35rem] h-[35rem] rounded-full bg-[#5ea1db]/10 mix-blend-multiply opacity-30 filter blur-3xl"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute -top-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-[#f39200]/10 mix-blend-multiply opacity-30 filter blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.2, 0.15]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
      </div>
      
      <motion.div
        className="max-w-2xl w-full text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="w-full flex justify-center mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Premium branding element with brand colors */}
          <div className="h-14 bg-gradient-to-r from-[#104b8d] via-[#2a69a5] to-[#5ea1db] text-white text-xl font-bold rounded-xl px-8 py-3 shadow-lg shadow-[#104b8d]/20 border border-white/20 backdrop-blur-sm">
            WIS Accountancy
          </div>
        </motion.div>
        
        {/* Countdown Timer */}
        <DeadlineCountdown />
        
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#104b8d] mt-8 mb-3 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Let's Make Tax <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#104b8d] to-[#5ea1db]">Simple</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-600 mb-8 max-w-lg mx-auto font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          A quick questionnaire that helps us handle your tax return efficiently, without confusing jargon.
        </motion.p>

        <motion.div 
          className="flex flex-col md:flex-row gap-6 mb-10"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.5
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="bg-white/80 backdrop-filter backdrop-blur-sm rounded-xl border border-[#5ea1db]/20 p-5 flex-1 shadow-sm"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-[#104b8d] to-[#5ea1db] mr-3 shadow-sm">
                <DocumentTextIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-[#104b8d]">What We Need</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-[#f39200] mr-2 flex-shrink-0" />
                <span>Basic personal information</span>
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-[#f39200] mr-2 flex-shrink-0" />
                <span>Details about your income sources</span>
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-[#f39200] mr-2 flex-shrink-0" />
                <span>Eligible tax relief information</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="bg-white/80 backdrop-filter backdrop-blur-sm rounded-xl border border-[#5ea1db]/20 p-5 flex-1 shadow-sm"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-[#f39200] to-[#f9be29] mr-3 shadow-sm">
                <ClockIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-[#104b8d]">Our Process</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="bg-gradient-to-r from-[#104b8d] to-[#5ea1db] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] mt-0.5 mr-2 flex-shrink-0">1</span>
                <span>Complete form (5-10 mins)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gradient-to-r from-[#104b8d] to-[#5ea1db] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] mt-0.5 mr-2 flex-shrink-0">2</span>
                <span>Our team reviews it</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gradient-to-r from-[#104b8d] to-[#5ea1db] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] mt-0.5 mr-2 flex-shrink-0">3</span>
                <span>We'll guide you on next steps</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        <Link to="/onboarding">
          <motion.div 
            className="inline-block"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button 
              className="px-8 py-4 text-base text-white font-medium rounded-full shadow-lg shadow-[#104b8d]/20 relative overflow-hidden group bg-gradient-to-r from-[#104b8d] via-[#2a69a5] to-[#5ea1db] hover:shadow-[#104b8d]/30 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center">
                Start My Tax Questionnaire
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </motion.span>
              </span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-25 bg-gradient-to-r from-[#f39200] to-[#f9be29] transition-opacity duration-300"></span>
            </button>
          </motion.div>
        </Link>
        
        <motion.div 
          className="mt-6 text-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <p className="flex items-center justify-center text-xs text-gray-500">
            <ShieldCheckIcon className="h-4 w-4 mr-1 text-[#104b8d]" />
            Safe. Secure. Confidential. Protected by bank-level security.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomePage; 