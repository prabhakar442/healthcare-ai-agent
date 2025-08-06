import React, { useState, useRef } from 'react';
import { Camera, Upload, User, CreditCard, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { AadhaarData } from '../App';

interface AadhaarScannerProps {
  onComplete: (data: AadhaarData) => void;
}

export const AadhaarScanner: React.FC<AadhaarScannerProps> = ({ onComplete }) => {
  const [scanMode, setScanMode] = useState<'upload' | 'camera' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<AadhaarData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const simulateOCR = async (imageFile: File): Promise<AadhaarData> => {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock extracted data
    return {
      name: 'RAJESH KUMAR SHARMA',
      aadhaarNumber: '1234 5678 9012',
      dateOfBirth: '15/08/1985',
      address: 'House No. 123, Sector 45, Gurgaon, Haryana - 122001',
      photo: URL.createObjectURL(imageFile)
    };
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const data = await simulateOCR(file);
      setExtractedData(data);
    } catch (err) {
      setError('Failed to process Aadhaar card. Please try again with a clear image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Unable to access camera. Please use file upload instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'aadhaar-capture.jpg', { type: 'image/jpeg' });
          handleImageUpload(file);
        }
      });
    }
  };

  const handleConfirm = () => {
    if (extractedData) {
      onComplete(extractedData);
    }
  };

  if (extractedData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Aadhaar Details Extracted</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-900">{extractedData.name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Aadhaar Number</p>
                  <p className="font-semibold text-gray-900 font-mono">{extractedData.aadhaarNumber}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-semibold text-gray-900">{extractedData.dateOfBirth}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-900">{extractedData.address}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src={extractedData.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">Profile Photo</p>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              onClick={() => setExtractedData(null)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Rescan Card
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aadhaar Card Verification</h2>
          <p className="text-gray-600">
            We need to verify your identity before proceeding with the health assessment. 
            Your data is secure and encrypted.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!scanMode && (
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setScanMode('upload')}
              className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
            >
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 mb-1">Upload Image</h3>
              <p className="text-sm text-gray-600">Select Aadhaar card image from your device</p>
            </button>

            <button
              onClick={() => {
                setScanMode('camera');
                startCamera();
              }}
              className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
            >
              <Camera className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 mb-1">Take Photo</h3>
              <p className="text-sm text-gray-600">Capture Aadhaar card using your camera</p>
            </button>
          </div>
        )}

        {scanMode === 'upload' && (
          <div className="text-center">
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isProcessing ? 'Processing...' : 'Select Aadhaar Card Image'}
              </button>
            </div>
            <button
              onClick={() => setScanMode(null)}
              className="text-gray-600 hover:text-gray-900 underline"
            >
              Back to options
            </button>
          </div>
        )}

        {scanMode === 'camera' && (
          <div className="text-center">
            <div className="mb-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={capturePhoto}
                disabled={isProcessing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isProcessing ? 'Processing...' : 'Capture Photo'}
              </button>
              <button
                onClick={() => setScanMode(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-3 text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Extracting data from Aadhaar card...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};