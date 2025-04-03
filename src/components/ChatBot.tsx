import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Maximize2, Minimize2, Briefcase, Code2, Brain, Mail } from 'lucide-react';
import { generateResponse } from '../lib/gemini-api';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface SuggestionBox {
  id: string;
  text: string;
  icon: React.ReactNode;
  message: string;
}

const initialMessage: Message = {
  id: '1',
  text: "Hi there! I'm Adi, Aditya's AI assistant. I'd be happy to tell you about my education, work experience, or any other aspect of the professional journey. What would you like to know?",
  sender: 'bot',
  timestamp: new Date(),
};

const suggestionBoxes: SuggestionBox[] = [
  {
    id: 'experience',
    text: 'Work Experience',
    icon: <Briefcase size={16} />,
    message: "Tell me about your work experience and professional background."
  },
  {
    id: 'skills',
    text: 'Technical Skills',
    icon: <Code2 size={16} />,
    message: "What technical skills and technologies do you specialize in?"
  },
  {
    id: 'projects',
    text: 'Projects',
    icon: <Brain size={16} />,
    message: "Can you showcase some of your notable projects?"
  },
  {
    id: 'contact',
    text: 'Contact Info',
    icon: <Mail size={16} />,
    message: "How can I get in touch with you?"
  }
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get all messages to provide context
      const currentMessages = [...messages, userMessage];
      
      // Call Gemini API with the full conversation history
      const response = await generateResponse(currentMessages);
      
      // Handle the new response format which includes text and suggestions
      const botMessage: Message = {
        id: Date.now().toString(),
        text: typeof response === 'string' ? response : response.text,
        sender: 'bot',
        timestamp: new Date(),
        // Add suggestions if they exist in the response
        suggestions: typeof response === 'object' && response.suggestions ? response.suggestions : [],
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Fallback response in case of API failure
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [],
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('skill') || lowerInput.includes('tech')) {
      return "I specialize in React, TypeScript, Node.js, and modern web development practices. I'm also experienced with cloud services and database technologies.";
    } else if (lowerInput.includes('contact') || lowerInput.includes('email')) {
      return "You can reach me through the contact form on my website or directly via email at [your@email.com].";
    } else if (lowerInput.includes('project') || lowerInput.includes('work')) {
      return "I've worked on various projects including web applications, e-commerce platforms, and data visualization tools. Check out my portfolio section for detailed case studies!";
    }
    return "I'm not sure how to help with that specific query. Feel free to ask about my skills, projects, or how to contact me!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: SuggestionBox) => {
    setInputValue(suggestion.message);
    handleSendMessage(suggestion.message);
  };

  const toggleExpand = () => {
    if (!isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Chat Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-4 md:bottom-4 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center z-50 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Widget */}
      <div
        className={`fixed transition-all duration-300 z-50 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${
          isExpanded || isMobile
            ? 'inset-0 md:inset-4'
            : 'bottom-20 right-4 md:bottom-4 md:right-6 w-[calc(100%-2rem)] md:w-[400px] h-[60vh] md:h-[600px] max-h-[calc(100vh-8rem)]'
        } bg-gray-900 shadow-xl flex flex-col rounded-lg overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <MessageCircle size={18} className="text-white" />
            </div>
            <h3 className="font-semibold text-white">Adi</h3>
          </div>
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <button
                onClick={toggleExpand}
                className="p-1.5 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {messages.map((message, index) => (
            <div key={message.id}>
              <div
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-800 text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm md:text-base">{message.text}</p>
                  <p className="text-xs mt-1 opacity-60">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              {/* Show suggestion boxes after bot messages */}
              {message.sender === 'bot' && (
                <div className="mt-3 flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 w-full">
                      {/* Show predefined suggestion boxes for the initial message */}
                      {index === 0 ? (
                        suggestionBoxes.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="flex items-center gap-1 p-2 bg-blue-700 rounded-xl hover:bg-blue-400 transition-colors text-left overflow-hidden w-full">
                            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white-600">
                              {suggestion.icon}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-200 truncate">
                              {suggestion.text}
                            </span>
                          </button>
                        ))
                      ) : (
                        /* Show dynamic suggestions for other bot messages if available */
                        message.suggestions && message.suggestions.length > 0 && 
                        message.suggestions.map((suggestionText, i) => {
                          // Map suggestion text to appropriate icon
                          let icon = <Brain size={16} />;
                          if (suggestionText.toLowerCase().includes('experience') || suggestionText.toLowerCase().includes('work')) {
                            icon = <Briefcase size={16} />;
                          } else if (suggestionText.toLowerCase().includes('skill') || suggestionText.toLowerCase().includes('tech')) {
                            icon = <Code2 size={16} />;
                          } else if (suggestionText.toLowerCase().includes('contact')) {
                            icon = <Mail size={16} />;
                          }
                          
                          return (
                            <button
                              key={`${message.id}-suggestion-${i}`}
                              onClick={() => handleSendMessage(`Tell me about your ${suggestionText}`)}
                              className="flex items-center gap-1 p-2 bg-blue-700 rounded-xl hover:bg-blue-400 transition-colors text-left overflow-hidden w-full">
                              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white-600">
                                {icon}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-200 truncate">
                                {suggestionText}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Boxes - Removed from here as they now appear after the initial message */}
        {/* Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Adi can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </>
  );
}

// Custom hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}