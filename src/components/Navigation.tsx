import React from 'react';
import { CheckCircle, Circle, Camera, ClipboardList, FileText, MessageCircle } from 'lucide-react';

interface NavigationProps {
  currentStep: 'aadhaar' | 'symptoms' | 'diagnosis' | 'chat';
  onStepChange: (step: 'aadhaar' | 'symptoms' | 'diagnosis' | 'chat') => void;
  hasAadhaarData: boolean;
  hasSymptomData: boolean;
  hasDiagnosisData: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentStep,
  onStepChange,
  hasAadhaarData,
  hasSymptomData,
  hasDiagnosisData
}) => {
  const steps = [
    {
      id: 'aadhaar' as const,
      title: 'Identity Verification',
      subtitle: 'Aadhaar Card Scan',
      icon: Camera,
      completed: hasAadhaarData,
      enabled: true
    },
    {
      id: 'symptoms' as const,
      title: 'Symptom Assessment',
      subtitle: 'Health Questionnaire',
      icon: ClipboardList,
      completed: hasSymptomData,
      enabled: hasAadhaarData
    },
    {
      id: 'diagnosis' as const,
      title: 'AI Diagnosis',
      subtitle: 'Health Analysis',
      icon: FileText,
      completed: hasDiagnosisData,
      enabled: hasSymptomData
    },
    {
      id: 'chat' as const,
      title: 'Health Assistant',
      subtitle: '24/7 Chatbot',
      icon: MessageCircle,
      completed: false,
      enabled: true
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto py-4 space-x-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isClickable = step.enabled;
            
            return (
              <button
                key={step.id}
                onClick={() => isClickable && onStepChange(step.id)}
                disabled={!isClickable}
                className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                    : isClickable
                    ? 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="relative">
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isActive ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                      {isActive ? (
                        <Icon className="w-3 h-3 text-white" />
                      ) : (
                        <Icon className={`w-3 h-3 ${isClickable ? 'text-gray-400' : 'text-gray-300'}`} />
                      )}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className={`text-sm font-medium ${isActive ? 'text-blue-700' : ''}`}>
                    {step.title}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};