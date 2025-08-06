import React, { useState } from 'react';
import { Header } from './components/Header';
import { AadhaarScanner } from './components/AadhaarScanner';
import { SymptomChecker } from './components/SymptomChecker';
import { DiagnosisResults } from './components/DiagnosisResults';
import { HealthchatBot } from './components/HealthchatBot';
import { Navigation } from './components/Navigation';

export interface AadhaarData {
  name: string;
  aadhaarNumber: string;
  dateOfBirth: string;
  address: string;
  photo: string;
}

export interface SymptomData {
  primarySymptom: string;
  duration: string;
  severity: string;
  additionalSymptoms: string[];
  followUpAnswers: Record<string, string>;
}

export interface DiagnosisData {
  conditions: Array<{
    name: string;
    confidence: number;
    description: string;
  }>;
  department: string;
  treatment: string;
  urgency: 'low' | 'medium' | 'high';
}

function App() {
  const [currentStep, setCurrentStep] = useState<'aadhaar' | 'symptoms' | 'diagnosis' | 'chat'>('aadhaar');
  const [aadhaarData, setAadhaarData] = useState<AadhaarData | null>(null);
  const [symptomData, setSymptomData] = useState<SymptomData | null>(null);
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);

  const handleAadhaarComplete = (data: AadhaarData) => {
    setAadhaarData(data);
    setCurrentStep('symptoms');
  };

  const handleSymptomsComplete = (data: SymptomData) => {
    setSymptomData(data);
    // Simulate AI diagnosis
    const diagnosis: DiagnosisData = {
      conditions: [
        {
          name: 'Viral Fever',
          confidence: 85,
          description: 'Common viral infection causing fever, body aches, and fatigue'
        },
        {
          name: 'Common Cold',
          confidence: 70,
          description: 'Upper respiratory tract infection with mild symptoms'
        },
        {
          name: 'Flu',
          confidence: 60,
          description: 'Influenza virus causing fever, cough, and body aches'
        }
      ],
      department: 'General Medicine',
      treatment: 'Home rest, adequate fluids, and paracetamol for fever. Consult doctor if symptoms worsen.',
      urgency: 'low'
    };
    setDiagnosisData(diagnosis);
    setCurrentStep('diagnosis');
  };

  const handleBackToSymptoms = () => {
    setCurrentStep('symptoms');
    setDiagnosisData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Header />
      <Navigation 
        currentStep={currentStep} 
        onStepChange={setCurrentStep}
        hasAadhaarData={!!aadhaarData}
        hasSymptomData={!!symptomData}
        hasDiagnosisData={!!diagnosisData}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStep === 'aadhaar' && (
          <AadhaarScanner onComplete={handleAadhaarComplete} />
        )}
        
        {currentStep === 'symptoms' && (
          <SymptomChecker 
            patientData={aadhaarData}
            onComplete={handleSymptomsComplete} 
          />
        )}
        
        {currentStep === 'diagnosis' && diagnosisData && (
          <DiagnosisResults 
            patientData={aadhaarData}
            symptomData={symptomData}
            diagnosisData={diagnosisData}
            onBackToSymptoms={handleBackToSymptoms}
          />
        )}
        
        {currentStep === 'chat' && (
          <HealthchatBot patientData={aadhaarData} />
        )}
      </main>
    </div>
  );
}

export default App;