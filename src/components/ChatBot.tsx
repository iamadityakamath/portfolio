import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Maximize2, Minimize2, Briefcase, Code2, Brain, Mail, FileText } from 'lucide-react';
import { generateStreamingResponse } from '../lib/chat-api';
import { convertMarkdownToHTML } from '../lib/markdown';

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
    message: "Tell me about your work experience"
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
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Create a temporary bot message for streaming updates
    const tempBotMessageId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tempBotMessage: Message = {
      id: tempBotMessageId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [],
    };
    setMessages(prev => [...prev, tempBotMessage]);

    try {
      const currentMessages = [...messages, userMessage];
      
      // Use streaming response with callbacks
      await generateStreamingResponse(
        currentMessages,
        {
          onTextUpdate: (text: string) => {
            setMessages(prev => prev.map(msg =>
              msg.id === tempBotMessageId
                ? { ...msg, text: msg.text + text }
                : msg
            ));
          },
          onComplete: (suggestions: string[]) => {
            setMessages(prev => prev.map(msg =>
              msg.id === tempBotMessageId
                ? { ...msg, suggestions }
                : msg
            ));
            setIsTyping(false);
          },
          onError: (error: Error) => {
            console.error('Error in streaming response:', error);
            setMessages(prev => prev.map(msg =>
              msg.id === tempBotMessageId
                ? { ...msg, text: "I'm having trouble connecting right now. Please try again later." }
                : msg
            ));
            setIsTyping(false);
          }
        }
      );
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === tempBotMessageId
          ? { ...msg, text: "I'm having trouble connecting right now. Please try again later." }
          : msg
      ));
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
        className={`fixed bottom-24 right-4 md:bottom-6 md:right-6 w-14 h-14 bg-accent-solid text-accent-contrast rounded-full shadow-[0_6px_20px_rgb(var(--accent)/0.4)] hover:scale-105 transition-all duration-base ease-out-expo flex items-center justify-center z-50 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Widget */}
      <div
        className={`fixed transition-all duration-slow ease-out-expo z-50 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${
          isExpanded || isMobile
            ? 'inset-0 md:inset-4'
            : 'bottom-24 right-4 md:bottom-6 md:right-6 w-[calc(100%-2rem)] md:w-[400px] h-[60vh] md:h-[620px] max-h-[calc(100vh-9rem)]'
        } bg-surface-elevated border border-hairline shadow-2xl flex rounded-2xl overflow-hidden`}
      >
        {/* PDF Viewer - Only visible in desktop expanded view */}
        {isExpanded && !isMobile && (
          <div className="flex flex-col w-1/2 bg-surface-subtle border-r border-hairline">
            <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-hairline">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-accent-solid flex items-center justify-center">
                  <FileText size={18} className="text-accent-contrast" />
                </div>
                <h3 className="font-semibold text-content">Resume</h3>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-surface flex items-center justify-center p-4">
              {/* Use iframe for reliable PDF rendering */}
              <iframe
                src="/pdf/Aditya Kamath Resume.pdf#view=FitH"
                className="w-full h-full shadow-lg"
                style={{ minHeight: '500px', border: 'none' }}
                title="Aditya Kamath Resume"
              />
            </div>
          </div>
        )}
        
        {/* Chat Content */}
        <div className={`flex flex-col ${isExpanded && !isMobile ? 'w-1/2' : 'w-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-hairline">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-accent-solid flex items-center justify-center">
              <MessageCircle size={18} className="text-accent-contrast" />
            </div>
            <h3 className="font-semibold text-content">Adi</h3>
          </div>
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <button
                onClick={toggleExpand}
                className="w-11 h-11 flex items-center justify-center hover:bg-content/10 rounded-full transition-colors text-content-tertiary hover:text-content"
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-11 h-11 flex items-center justify-center hover:bg-content/10 rounded-full transition-colors text-content-tertiary hover:text-content"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface custom-scrollbar">
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
                      ? 'bg-accent-solid text-accent-contrast rounded-br-none'
                      : 'bg-surface-subtle text-content rounded-bl-none'
                  }`}
                >
                  <div className="text-sm md:text-base" dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(message.text) }}></div>
                  <p className="text-xs mt-1 opacity-80">
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
                            className="flex items-center gap-2 px-3 py-3 bg-accent-solid rounded-xl hover:brightness-110 transition-all duration-base ease-out-expo hover:-translate-y-0.5 text-left overflow-hidden w-full">
                            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-accent-contrast">
                              {suggestion.icon}
                            </span>
                            <span className="text-xs sm:text-sm text-accent-contrast truncate">
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
                              className="flex items-center gap-2 px-3 py-3 bg-accent-solid rounded-xl hover:brightness-110 transition-all duration-base ease-out-expo hover:-translate-y-0.5 text-left overflow-hidden w-full">
                              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-accent-contrast">
                                {icon}
                              </span>
                              <span className="text-xs sm:text-sm text-accent-contrast truncate">
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
              <div className="bg-surface-subtle p-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-content-tertiary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-content-tertiary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-content-tertiary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-hairline bg-surface-subtle">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 bg-surface border border-hairline text-content rounded-full placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-accent text-sm md:text-base"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="w-11 h-11 flex items-center justify-center shrink-0 bg-accent-solid text-accent-contrast rounded-full hover:brightness-110 transition-all duration-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-content-tertiary mt-2 text-center">
            Adi can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

// Custom hook to detect mobile viewport
function useIsMobile(): boolean {
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