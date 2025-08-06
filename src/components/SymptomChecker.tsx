import React, { useState } from 'react';
import { ChevronRight, AlertCircle, Clock, Activity, Plus, X } from 'lucide-react';
import { AadhaarData, SymptomData } from '../App';

interface SymptomCheckerProps {
  patientData: AadhaarData | null;
  onComplete: (data: SymptomData) => void;
}

const commonSymptoms = [
  'Fever', 'Headache', 'Cough', 'Sore throat', 'Body aches', 'Fatigue',
  'Nausea', 'Vomiting', 'Diarrhea', 'Shortness of breath', 'Chest pain',
  'Abdominal pain', 'Dizziness', 'Loss of appetite'
];

const followUpQuestions = {
  'Fever': [
    { question: 'What is your current temperature?', key: 'temperature' },
    { question: 'Are you experiencing chills?', key: 'chills' },
    { question: 'Any sweating?', key: 'sweating' }
  ],
  'Headache': [
    { question: 'Where is the pain located?', key: 'location' },
    { question: 'Is it throbbing or constant?', key: 'type' },
    { question: 'Any sensitivity to light?', key: 'lightSensitivity' }
  ],
  'Cough': [
    { question: 'Is it a dry or productive cough?', key: 'coughType' },
    { question: 'Any blood in the cough?', key: 'blood' },
    { question: 'Does it worsen at night?', key: 'nighttime' }
  ]
};

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ patientData, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'primary' | 'additional' | 'followup'>('primary');
  const [primarySymptom, setPrimarySymptom] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [additionalSymptoms, setAdditionalSymptoms] = useState<string[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});

  const handlePrimarySymptomSubmit = () => {
    const symptom = customSymptom || primarySymptom;
    if (symptom && duration && severity) {
      setCurrentStep('additional');
    }
  };

  const toggleAdditionalSymptom = (symptom: string) => {
    setAdditionalSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAdditionalSymptomsSubmit = () => {
    setCurrentStep('followup');
  };

  const handleFollowUpAnswer = (key: string, value: string) => {
    setFollowUpAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    const symptomData: SymptomData = {
      primarySymptom: customSymptom || primarySymptom,
      duration,
      severity,
      additionalSymptoms,
      followUpAnswers
    };
    onComplete(symptomData);
  };

  const getFollowUpQuestions = () => {
    const mainSymptom = customSymptom || primarySymptom;
    return followUpQuestions[mainSymptom as keyof typeof followUpQuestions] || [];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {patientData && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full overflow-hidden">
                <img src={patientData.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Patient: {patientData.name}</p>
                <p className="text-sm text-blue-700">DOB: {patientData.dateOfBirth}</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'primary' && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Describe Your Main Symptom</h2>
              <p className="text-gray-600">Tell us about your primary health concern today</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What is your main symptom? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => {
                        setPrimarySymptom(symptom);
                        setCustomSymptom('');
                      }}
                      className={`px-3 py-2 text-sm border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors ${
                        primarySymptom === symptom
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={customSymptom}
                    onChange={(e) => {
                      setCustomSymptom(e.target.value);
                      setPrimarySymptom('');
                    }}
                    placeholder="Or describe your symptom in your own words..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    How long have you had this symptom? *
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select duration</option>
                    <option value="less-than-1-day">Less than 1 day</option>
                    <option value="1-3-days">1-3 days</option>
                    <option value="4-7-days">4-7 days</option>
                    <option value="1-2-weeks">1-2 weeks</option>
                    <option value="more-than-2-weeks">More than 2 weeks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    How severe is it? *
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select severity</option>
                    <option value="mild">Mild - Doesn't interfere with daily activities</option>
                    <option value="moderate">Moderate - Some interference with activities</option>
                    <option value="severe">Severe - Significant interference</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handlePrimarySymptomSubmit}
                disabled={!(customSymptom || primarySymptom) || !duration || !severity}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <span>Continue</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {currentStep === 'additional' && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Any Additional Symptoms?</h2>
              <p className="text-gray-600">Select any other symptoms you're experiencing</p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Select all that apply (optional):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonSymptoms
                    .filter(symptom => symptom !== primarySymptom && symptom !== customSymptom)
                    .map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleAdditionalSymptom(symptom)}
                      className={`px-3 py-2 text-sm border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors ${
                        additionalSymptoms.includes(symptom)
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {symptom}
                      {additionalSymptoms.includes(symptom) && (
                        <X className="w-3 h-3 inline ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {additionalSymptoms.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Selected additional symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {additionalSymptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep('primary')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleAdditionalSymptomsSubmit}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}

        {currentStep === 'followup' && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Follow-up Questions</h2>
              <p className="text-gray-600">Help us understand your symptoms better</p>
            </div>

            <div className="space-y-6">
              {getFollowUpQuestions().map((q) => (
                <div key={q.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {q.question}
                  </label>
                  <input
                    type="text"
                    value={followUpAnswers[q.key] || ''}
                    onChange={(e) => handleFollowUpAnswer(q.key, e.target.value)}
                    placeholder="Your answer..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}

              {getFollowUpQuestions().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No additional questions for your symptom.</p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep('additional')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <span>Get AI Diagnosis</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};