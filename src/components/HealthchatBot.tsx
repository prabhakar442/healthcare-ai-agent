import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Bot, Clock, Heart } from 'lucide-react';
import { AadhaarData } from '../App';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface HealthchatBotProps {
  patientData: AadhaarData | null;
}

export const HealthchatBot: React.FC<HealthchatBotProps> = ({ patientData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello${patientData ? ` ${patientData.name.split(' ')[0]}` : ''}! I'm your AI health assistant. I'm here to answer any health-related questions you might have, provide general medical information, and offer guidance on when to seek medical care. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple response logic - in a real app, this would be AI-powered
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return "For fever management: Stay hydrated, rest well, and take paracetamol as needed. If fever exceeds 101.3°F (38.5°C) or persists for more than 3 days, please consult a doctor. Monitor for additional symptoms like difficulty breathing or severe headache.";
    }
    
    if (lowerMessage.includes('headache')) {
      return "Headaches can have various causes. For mild headaches: ensure adequate hydration, rest in a dark quiet room, and consider over-the-counter pain relievers. Seek immediate medical attention if you experience sudden severe headache, headache with fever and stiff neck, or headache after head injury.";
    }
    
    if (lowerMessage.includes('cough')) {
      return "For cough relief: Stay hydrated, use a humidifier, try honey (not for children under 1 year), and avoid irritants. See a doctor if cough persists more than 3 weeks, produces blood, or is accompanied by high fever or difficulty breathing.";
    }
    
    if (lowerMessage.includes('medicine') || lowerMessage.includes('medication')) {
      return "I can provide general medication information, but I cannot prescribe medications. Always consult with a healthcare provider or pharmacist for specific medication advice. Never share prescription medications, and always take medications as directed by your doctor.";
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return "For medical emergencies, please call emergency services immediately (108 in India, 911 in US). Signs of emergency include: chest pain, difficulty breathing, severe bleeding, loss of consciousness, severe allergic reactions, or signs of stroke. Don't delay seeking help for serious symptoms.";
    }
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('doctor')) {
      return "To find the right healthcare provider: Consider your symptoms and our previous diagnosis suggestions. For routine care, start with a general practitioner. For specialized conditions, you may need a referral to the recommended department. Many hospitals now offer online appointment booking.";
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('nutrition')) {
      return "A balanced diet supports overall health and recovery. Include plenty of fruits, vegetables, lean proteins, and whole grains. Stay hydrated, especially when ill. Avoid processed foods and excessive sugar. For specific dietary needs related to medical conditions, consult with a nutritionist or your doctor.";
    }
    
    // Default response
    return "I understand you're asking about a health concern. While I can provide general health information, it's important to consult with a qualified healthcare professional for personalized medical advice. Can you tell me more about your specific symptoms or concerns so I can provide more relevant guidance?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: generateBotResponse(userMessage.content),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What should I do about fever?",
    "When should I see a doctor?",
    "How to manage headaches?",
    "Home remedies for cold",
    "Emergency warning signs"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Health Assistant Chat</h2>
              <p className="text-blue-100">24/7 AI-powered health guidance</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-100' 
                  : 'bg-gradient-to-br from-teal-500 to-blue-600'
              }`}>
                {message.type === 'user' ? (
                  patientData ? (
                    <img 
                      src={patientData.photo} 
                      alt="User" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-blue-600" />
                  )
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`max-w-md ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <div className={`flex items-center mt-1 text-xs text-gray-500 space-x-1 ${
                  message.type === 'user' ? 'justify-end' : ''
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your health concerns..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-center space-x-2 text-xs text-yellow-700">
            <Heart className="w-3 h-3" />
            <p>This chatbot provides general health information only. Always consult healthcare professionals for medical advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};