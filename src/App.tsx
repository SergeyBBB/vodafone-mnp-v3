import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { NumberStep } from './components/NumberStep';
import { TariffStep } from './components/TariffStep';
import { SimStep } from './components/SimStep';
import { DeliveryStep } from './components/DeliveryStep';
import { StatusStep } from './components/StatusStep';
import { theme } from './theme';

interface StepData {
  number?: { phone: string; verificationMethod: string };
  tariff?: string;
  sim?: { type: string; isESim: boolean };
  delivery?: {
    method: string;
    firstName: string;
    lastName: string;
    novaPoshtaData?: {
      city: string;
      warehouse: string;
    };
  };
}

export function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({});

  const handleNext = (data: StepData) => {
    const newStepData = { ...stepData, ...data };
    setStepData(newStepData);
    
    // Skip delivery step for eSIM
    if (currentStep === 3 && data.sim?.isESim) {
      setCurrentStep(5);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <NumberStep onNext={handleNext} />;
      case 2:
        return <TariffStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <SimStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <DeliveryStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <StatusStep formData={stepData} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-gray-50 py-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <img
              src="/vodafone-logo.png"
              alt="Vodafone"
              className="h-8"
            />
            <h1 className="text-xl font-medium text-gray-900">
              Перенесення номера
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4">
          <div className="bg-white shadow rounded-lg max-w-2xl mx-auto">
            {/* Stepper */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between max-w-xl mx-auto">
                {[1, 2, 3, 4, 5].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step <= currentStep
                            ? 'bg-vodafone-red text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {step === 1 && 'Номер'}
                        {step === 2 && 'Тариф'}
                        {step === 3 && 'SIM-карта'}
                        {step === 4 && 'Доставка'}
                        {step === 5 && 'Статус'}
                      </div>
                    </div>
                    {step < 5 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          step < currentStep ? 'bg-vodafone-red' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-6">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
