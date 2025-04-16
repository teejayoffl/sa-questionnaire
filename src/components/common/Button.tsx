import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'neutral';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
  icon,
  size = 'md',
}) => {
  // Premium gradient styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#104b8d] via-[#3a75b4] to-[#5ea1db] text-white shadow-md';
      case 'secondary':
        return 'bg-gradient-to-r from-slate-100 to-indigo-50 text-[#104b8d] border border-[#5ea1db]/30 shadow-sm';
      case 'success':
        return 'bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 text-white shadow-md';
      case 'danger':
        return 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-500 text-white shadow-md';
      case 'neutral':
        return 'bg-gradient-to-r from-slate-50 to-gray-100 text-slate-700 border border-slate-200 shadow-sm';
      default:
        return 'bg-gradient-to-r from-[#104b8d] via-[#3a75b4] to-[#5ea1db] text-white shadow-md';
    }
  };

  // Glow effect styles based on variant
  const getGlowStyles = () => {
    switch (variant) {
      case 'primary':
        return '0 0 20px rgba(16, 75, 141, 0.5)';
      case 'secondary':
        return '0 0 20px rgba(199, 210, 254, 0.4)';
      case 'success':
        return '0 0 20px rgba(16, 185, 129, 0.5)';
      case 'danger':
        return '0 0 20px rgba(225, 29, 72, 0.5)';
      case 'neutral':
        return '0 0 20px rgba(203, 213, 225, 0.4)';
      default:
        return '0 0 20px rgba(16, 75, 141, 0.5)';
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-6 py-1.5 text-sm';
      case 'md':
        return 'px-10 py-2 text-base';
      case 'lg':
        return 'px-12 py-3 text-lg';
      default:
        return 'px-10 py-2 text-base';
    }
  };

  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getButtonStyles()} 
        ${getSizeStyles()} 
        ${widthClass} 
        ${className} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
        rounded-full font-medium transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-60 relative
        ${variant === 'primary' ? 'focus:ring-[#104b8d]' : ''}
        ${variant === 'success' ? 'focus:ring-emerald-500' : ''}
        ${variant === 'danger' ? 'focus:ring-rose-500' : ''}
        flex items-center justify-center overflow-hidden group
      `}
      animate={variant === 'primary' && !disabled ? {
        filter: [
          'hue-rotate(0deg) brightness(1) saturate(1)',
          'hue-rotate(10deg) brightness(1.05) saturate(1.1)',
          'hue-rotate(5deg) brightness(1.02) saturate(1.05)',
          'hue-rotate(-5deg) brightness(1) saturate(1)',
          'hue-rotate(-10deg) brightness(0.98) saturate(0.95)',
          'hue-rotate(-5deg) brightness(1) saturate(1)',
          'hue-rotate(0deg) brightness(1) saturate(1)'
        ]
      } : {}}
      transition={variant === 'primary' && !disabled ? {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      whileHover={!disabled ? { 
        scale: 1.03, 
        y: -2,
        boxShadow: getGlowStyles(),
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.97,
        y: 1,
        boxShadow: "0 0 0 rgba(0,0,0,0)",
      } : {}}
      initial={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
    >
      {/* Glass effect */}
      <span className="absolute inset-0 rounded-full opacity-10 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      
      {/* Shine effect */}
      <span className="absolute inset-0 overflow-hidden rounded-full opacity-0 group-hover:opacity-100">
        <motion.span 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-25"
          animate={{ 
            x: ["200%", "-200%"] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "linear",
            repeatDelay: 0.5
          }}
          style={{ width: "150%", top: 0, height: "100%" }}
        />
      </span>
      
      {/* Icon with subtle animation */}
      {icon && (
        <motion.span 
          className="mr-3 inline-flex"
          whileHover={{ rotate: !disabled ? [0, -10, 10, -5, 5, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.span>
      )}
      
      {/* Button text with subtle hover animation */}
      <motion.span
        whileHover={{ 
          textShadow: !disabled ? "0 0 1px rgba(255,255,255,0.6)" : "none"
        }}
        className="tracking-wide"
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default Button; 