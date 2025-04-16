import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';

/**
 * TestRoutes Component
 * 
 * A component for testing and verifying all routes and navigation in the tax return application.
 * This provides quick access to different routes and simulates various user flows.
 */
const TestRoutes: React.FC = () => {
  const navigate = useNavigate();
  
  // Add a new TestCelebrationAction to directly test the CelebrationModal
  const celebrationTestData = {
    fullName: 'Jane Smith',
    nationalInsuranceNumber: 'AB123456C', 
    utr: '1234567890',
    dateOfBirth: '1985-06-15',
    address: '123 High Street, London, SW1A 1AA',
    contactNumber: '07123456789',
    email: 'jane.smith@example.com',
    selectedIncomeTypes: ['employment', 'property'],
    selectedTaxReliefs: ['pension', 'charity'],
    employerName: 'Acme Corporation',
    employerPayeReference: '123/AB456',
    totalPayFromP60: '45000',
    taxDeducted: '8500',
    businessName: 'Jane Smith Consulting',
    businessIncome: '25000',
    rentalIncomeReceived: '12000',
    pensionContributions: '5000',
  };

  // Update the testRoutes array with more test cases
  const testRoutes = [
    { name: 'Main Onboarding Flow', path: '/', description: 'Start the full tax return questionnaire process' },
    { name: 'Completion Page', path: '/completion', description: 'View the completion page that displays after submission' },
    { name: 'Test Celebration Modal', action: () => {
      // Store comprehensive test data in localStorage to simulate completed form
      localStorage.setItem('test_form_data', JSON.stringify(celebrationTestData));
      
      // Navigate to main page to trigger modal display
      navigate('/');
    }, description: 'Directly test the celebration modal with complete form data' },
    { name: 'Reset Form Data', action: () => {
      localStorage.removeItem('form_data');
      localStorage.removeItem('test_form_data');
      alert('Form data has been reset');
      navigate('/');
    }, description: 'Clear all stored form data and start fresh' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Tax Return Assistant - Route Testing</h1>
            <p className="text-blue-100 text-sm mt-1">
              Use this page to test all routes and navigation flows in the application
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Routes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testRoutes.map((route, index) => (
                  <motion.div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="font-medium text-lg text-blue-800">{route.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{route.description}</p>
                    
                    {route.path ? (
                      <Link 
                        to={route.path}
                        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        Navigate to {route.name}
                      </Link>
                    ) : (
                      <button
                        onClick={route.action}
                        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        Simulate {route.name}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Testing Instructions</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Click on "Main Onboarding Flow" to start the tax return questionnaire from the beginning.</li>
                <li>Click on "Completion Page" to view the final page that appears after submission.</li>
                <li>Click on "Test Celebration Modal" to directly test the celebration modal with complete form data.</li>
                <li>Click on "Reset Form Data" to clear all stored form data and start fresh.</li>
                <li>Ensure all routes navigate correctly and render the expected components.</li>
                <li>Test that form data persists between routes and resets after submission.</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            onClick={() => navigate('/')}
            variant="secondary"
            className="bg-white shadow-md text-sm px-4 py-2"
          >
            Return to Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestRoutes; 