import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm Vasanth's AI assistant. Ask me anything about his experience, skills, projects, or education!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(messageToSend);
      const botMessage = {
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
        provider: response.provider,
        model: response.model,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: `Sorry, I encountered an error: ${error.message}. Please make sure the backend server is running.`,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        text: "Hi! I'm Vasanth's AI assistant. Ask me anything about his experience, skills, projects, or education!",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-button"
          aria-label="Open chat"
        >
          <svg className="chatbot-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="chatbot-badge">AI</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-status-dot"></div>
              <h3 className="chatbot-title">Chat with Vasanth's AI</h3>
            </div>
            <div className="chatbot-header-right">
              <button onClick={clearChat} className="chatbot-icon-button" title="Clear chat">
                <svg className="chatbot-small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="chatbot-icon-button" aria-label="Close chat">
                <svg className="chatbot-small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chatbot-message-wrapper ${message.sender === 'user' ? 'chatbot-message-user' : 'chatbot-message-bot'}`}>
                <div className={`chatbot-message ${
                  message.sender === 'user'
                    ? 'chatbot-message-user-bubble'
                    : message.isError
                    ? 'chatbot-message-error'
                    : 'chatbot-message-bot-bubble'
                }`}>
                  <p className="chatbot-message-text">{message.text}</p>
                  {message.provider && (
                    <p className="chatbot-message-meta">Powered by {message.provider} ({message.model})</p>
                  )}
                  <p className="chatbot-message-time">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-message-wrapper chatbot-message-bot">
                <div className="chatbot-message chatbot-message-bot-bubble">
                  <div className="chatbot-loading">
                    <div className="chatbot-loading-dot"></div>
                    <div className="chatbot-loading-dot chatbot-loading-dot-delay-1"></div>
                    <div className="chatbot-loading-dot chatbot-loading-dot-delay-2"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <div className="chatbot-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="chatbot-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="chatbot-send-button"
              >
                {isLoading ? (
                  <svg className="chatbot-spinner" viewBox="0 0 24 24">
                    <circle className="chatbot-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="chatbot-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="chatbot-send-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="chatbot-input-hint">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;