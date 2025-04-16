import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  description?: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  description,
  icon,
  defaultOpen = false,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm border transition-all duration-300 ${isOpen ? 'border-amber-300 bg-gradient-to-br from-white to-amber-50' : 'border-gray-200 bg-white'}`}>
      <button
        type="button"
        onClick={toggle}
        className={`w-full flex items-center justify-between p-4 focus:outline-none text-left ${isOpen ? '' : 'hover:bg-gray-50'}`}
      >
        <div className="flex items-start">
          {icon && (
            <div className={`flex-shrink-0 p-3 rounded-full mr-4 transition-all duration-300 ${isOpen ? 'bg-gradient-to-br from-blue-100 to-amber-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className={`font-medium text-base transition-colors duration-300 ${isOpen ? 'text-blue-800' : 'text-gray-700'}`}>{title}</h3>
            {description && <p className={`text-sm mt-1 ${isOpen ? 'text-gray-600' : 'text-gray-500'}`}>{description}</p>}
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-2"
              >
                <span className="inline-block px-2 py-0.5 text-xs rounded-md bg-blue-100 text-blue-700 font-medium">
                  Active
                </span>
              </motion.div>
            )}
          </div>
        </div>
        <div>
          <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 border-t border-gray-200 bg-white">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  children: ReactNode;
  defaultOpenIndex?: number;
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpenIndex = -1,
  allowMultiple = false,
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex >= 0 ? [defaultOpenIndex] : []
  );

  const handleToggle = (index: number, isOpen: boolean) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        isOpen ? [...prev, index] : prev.filter((i) => i !== index)
      );
    } else {
      setOpenIndices(isOpen ? [index] : []);
    }
  };

  return (
    <div className="space-y-4 p-4">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        return React.cloneElement(child as React.ReactElement<AccordionItemProps>, {
          defaultOpen: openIndices.includes(index),
          onToggle: (isOpen: boolean) => handleToggle(index, isOpen),
        });
      })}
    </div>
  );
};

export default { Accordion, AccordionItem }; 