import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OnboardingLayout from './pages/OnboardingLayout';
import CompletionPage from './pages/CompletionPage';
import TestRoutes from './pages/TestRoutes';
import WelcomePage from './pages/WelcomePage';
import { FormProvider } from './context/FormContext';

function App() {
  return (
    <BrowserRouter>
      <FormProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/onboarding" element={<OnboardingLayout />} />
          <Route path="/completion" element={<CompletionPage />} />
          <Route path="/test" element={<TestRoutes />} />
        </Routes>
      </FormProvider>
    </BrowserRouter>
  );
}

export default App;
