import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, UserIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface FormData {
  [key: string]: any;
}

interface FormProps {
  onComplete: (data: FormData) => void;
  initialData?: FormData;
  isConversation?: boolean;
}

interface ConversationNode {
  id: string;
  type: 'message' | 'form' | 'options';
  content: string;
  component?: React.ComponentType<FormProps>;
  options?: Option[];
  next?: string | ((state: FormData) => string);
}

interface Option {
  label: string;
  value: string;
  next: string;
}

interface ConversationItem {
  id: string;
  type: 'assistant' | 'user';
  content: string | React.ReactNode;
  timestamp: Date;
}

interface PremiumChatInterfaceProps {
  currentNode?: ConversationNode;
  conversation: ConversationItem[];
  isTyping: boolean;
  handleOptionSelect: (option: Option) => void;
  renderForm: () => React.ReactNode;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    }
  }
};

const optionVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
    backgroundColor: "#EFF6FF",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  },
  tap: {
    scale: 0.98,
    backgroundColor: "#DBEAFE"
  }
};

const PremiumChatInterface: React.FC<PremiumChatInterfaceProps> = ({
  currentNode,
  conversation,
  isTyping,
  handleOptionSelect,
  renderForm
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced scroll function to handle both chat and form containers
  const scrollToView = () => {
    // First scroll chat to bottom
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    
    // Then scroll to the form container if it exists
    if (formContainerRef.current && currentNode?.type === 'form') {
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Also try to scroll premium-form-container into view
        const formScrollContainer = document.getElementById('premium-form-container');
        if (formScrollContainer) {
          formScrollContainer.scrollTop = 0;
        }
      }, 300);
    }
  };
  
  // Scroll to bottom of chat when conversation updates
  useEffect(() => {
    scrollToView();
  }, [conversation, isTyping, currentNode]);
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex-1 flex flex-col max-h-[calc(100vh-72px)] relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-100 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-purple-100 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Chat messages - adjusted for more compact design and better scrolling */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 z-10 scroll-smooth scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" id="chat-container">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {conversation.map((item, index) => (
              <motion.div
                key={item.id}
                className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  delay: index * 0.1 
                }}
              >
                <div className={`flex items-start max-w-[85%] md:max-w-[70%] ${item.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div 
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      item.type === 'assistant' 
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white' 
                        : 'bg-gray-100'
                    }`}
                  >
                    {item.type === 'assistant' ? (
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  
                  <div 
                    className={`mx-2 relative ${
                      item.type === 'assistant' 
                        ? 'bg-white/70 backdrop-blur-sm text-gray-800 rounded-tr-xl rounded-br-xl rounded-bl-xl' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tl-xl rounded-bl-xl rounded-br-xl'
                    } px-4 py-3 shadow-sm border border-gray-100/50`}
                  >
                    <div className="text-sm font-inter">{item.content}</div>
                    <span className={`text-xs mt-1 block ${item.type === 'assistant' ? 'text-gray-500' : 'text-blue-100'}`}>
                      {formatTime(item.timestamp)}
                    </span>
                    
                    {/* Arrow for the speech bubble */}
                    <div 
                      className={`absolute top-4 w-2 h-2 transform rotate-45 ${
                        item.type === 'assistant' 
                          ? 'bg-white border-l border-t border-gray-100/50 -left-1' 
                          : 'bg-blue-600 -right-1'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start max-w-[85%] md:max-w-[70%]">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  </div>
                  
                  <div className="mx-2 relative bg-white/70 backdrop-blur-sm text-gray-800 rounded-tr-xl rounded-br-xl rounded-bl-xl px-4 py-3 shadow-sm border border-gray-100/50">
                    <div className="flex space-x-1">
                      <motion.div 
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop", delay: 0 }}
                      />
                      <motion.div 
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop", delay: 0.15 }}
                      />
                      <motion.div 
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop", delay: 0.3 }}
                      />
                    </div>
                    
                    {/* Arrow for the speech bubble */}
                    <div className="absolute top-4 w-2 h-2 transform rotate-45 bg-white border-l border-t border-gray-100/50 -left-1" />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={chatEndRef} className="h-2" />
          </motion.div>
        </div>
      </div>
      
      {/* Option buttons or form - responsive layout without scrolling */}
      <div id="premium-form-container" className="p-4 border-t border-gray-100 z-10 backdrop-blur-sm bg-white/70">
        <div className="max-w-4xl mx-auto" ref={formContainerRef}>
          {currentNode?.type === 'options' && currentNode.options && (
            <motion.div 
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentNode.options.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => {
                      console.log('Option clicked in PremiumChat:', option);
                      handleOptionSelect(option);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl shadow-sm border 
                     text-left transition-all duration-300 font-medium
                     ${option.value === 'ready' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-300/30 relative overflow-hidden'
                        : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-100 hover:border-gray-200'
                     }`}
                    variants={optionVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {option.value === 'ready' && (
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse-subtle rounded-xl"></div>
                    )}
                    <span className="flex-1 text-base font-inter">{option.label}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      className={`w-5 h-5 ml-2 ${option.value === 'ready' ? 'text-white' : 'text-blue-600'}`}
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
          
          {currentNode?.type === 'form' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="bg-white border border-blue-200 rounded-xl shadow-sm p-4"
            >
              <h3 className="text-base font-medium mb-3 text-blue-700 font-inter">{currentNode.content}</h3>
              
              {/* Form scroll indicator - top */}
              <div className="flex justify-center mb-2">
                <div className="text-xs text-gray-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div id="premium-form-container" className="p-4 border-t border-gray-100 z-10 backdrop-blur-sm bg-white/70">
                {renderForm()}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumChatInterface; 