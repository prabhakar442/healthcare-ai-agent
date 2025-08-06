import React from 'react';
import { AlertTriangle, CheckCircle, Guitar as Hospital, Home, User, Clock, Activity, ArrowLeft } from 'lucide-react';
import { AadhaarData, SymptomData, DiagnosisData } from '../App';

interface DiagnosisResultsProps {
  patientData: AadhaarData | null;
  symptomData: SymptomData | null;
  diagnosisData: DiagnosisData;
  onBackToSymptoms: () => void;
}

export const DiagnosisResults: React.FC<DiagnosisResultsProps> = ({
  patientData,
  symptomData,
  diagnosisData,
  onBackToSymptoms
}) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const UrgencyIcon = getUrgencyIcon(diagnosisData.urgency);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Patient Summary */}
      {patientData && symptomData && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Patient Summary</h3>
            <button
              onClick={onBackToSymptoms}
              className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Modify Symptoms</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                <img src={patientData.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{patientData.name}</p>
                <p className="text-sm text-gray-600">DOB: {patientData.dateOfBirth}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Primary:</span>
                <span className="text-sm font-medium text-gray-900">{symptomData.primarySymptom}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="text-sm font-medium text-gray-900">{symptomData.duration.replace('-', ' ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Diagnosis Results */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${getUrgencyColor(diagnosisData.urgency).replace('text-', 'bg-').replace('-600', '-100')}`}>
            <UrgencyIcon className={`w-8 h-8 ${getUrgencyColor(diagnosisData.urgency).split(' ')[0]}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Diagnosis Results</h2>
          <p className="text-gray-600">Based on your symptoms, here's what our AI analysis suggests</p>
        </div>

        {/* Possible Conditions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Possible Conditions
          </h3>
          <div className="space-y-3">
            {diagnosisData.conditions.map((condition, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{condition.name}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${condition.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-blue-600">{condition.confidence}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{condition.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recommended Department */}
          <div className="p-6 border border-blue-200 rounded-xl bg-blue-50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Hospital className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900">Recommended Department</h3>
            </div>
            <p className="text-blue-800 font-medium text-lg">{diagnosisData.department}</p>
            <p className="text-blue-600 text-sm mt-1">
              This department specializes in treating your type of symptoms
            </p>
          </div>

          {/* Urgency Level */}
          <div className={`p-6 border rounded-xl ${getUrgencyColor(diagnosisData.urgency)}`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getUrgencyColor(diagnosisData.urgency).replace('text-', 'bg-').replace('-600', '-100')}`}>
                <UrgencyIcon className={`w-6 h-6 ${getUrgencyColor(diagnosisData.urgency).split(' ')[0]}`} />
              </div>
              <h3 className={`font-semibold ${getUrgencyColor(diagnosisData.urgency).split(' ')[0]}`}>
                {diagnosisData.urgency === 'high' ? 'High Priority' : 
                 diagnosisData.urgency === 'medium' ? 'Moderate Priority' : 'Low Priority'}
              </h3>
            </div>
            <p className={`font-medium text-lg ${getUrgencyColor(diagnosisData.urgency).split(' ')[0]}`}>
              {diagnosisData.urgency === 'high' ? 'Seek immediate medical attention' :
               diagnosisData.urgency === 'medium' ? 'Schedule appointment within 2-3 days' :
               'Can be managed at home initially'}
            </p>
          </div>
        </div>

        {/* Treatment Advice */}
        <div className="mt-6 p-6 border border-gray-200 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Treatment Recommendations</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{diagnosisData.treatment}</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-800 font-medium mb-1">Important Disclaimer</p>
              <p className="text-xs text-yellow-700">
                This AI analysis is for informational purposes only and should not replace professional medical advice. 
                Please consult with a qualified healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};