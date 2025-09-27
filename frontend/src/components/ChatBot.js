import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Lightbulb, MessageCircle, RotateCcw } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
    fetchTips();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get('/api/chat/history');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const fetchTips = async () => {
    try {
      const response = await axios.get('/api/chat/tips');
      setTips(response.data.tips);
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      _id: Date.now(),
      message: inputMessage.trim(),
      isFromUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat/message', {
        message: inputMessage.trim()
      });

      const { aiResponse } = response.data;
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        _id: Date.now() + 1,
        message: inputMessage.trim(),
        response: "I'm sorry, I'm having trouble connecting right now. Please try again later!",
        isFromUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTip = (tip) => {
    setInputMessage(tip);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">
          <MessageCircle size={24} style={{ marginRight: '0.5rem' }} />
          Financial Advisor Chat
        </h1>
        <button
          onClick={clearChat}
          className="btn btn-secondary btn-sm"
        >
          <RotateCcw size={16} style={{ marginRight: '0.5rem' }} />
          Clear Chat
        </button>
      </div>

      {/* Quick Tips */}
      {tips.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <Lightbulb size={20} style={{ marginRight: '0.5rem', color: '#f59e0b' }} />
            Quick Tips
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {tips.map((tip, index) => (
              <button
                key={index}
                onClick={() => handleQuickTip(tip)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.875rem' }}
              >
                {tip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="card">
        <div className="chat-container">
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                color: '#64748b'
              }}>
                <Bot size={60} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Welcome to your Financial Advisor!</h3>
                <p style={{ marginBottom: '1rem' }}>
                  I'm here to help you with saving tips, budgeting advice, and achieving your financial goals.
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  Try asking me about:
                </p>
                <ul style={{ 
                  textAlign: 'left', 
                  display: 'inline-block', 
                  marginTop: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <li>How to save money effectively</li>
                  <li>Budgeting strategies</li>
                  <li>Investment advice</li>
                  <li>Goal planning tips</li>
                </ul>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message._id}>
                  {message.isFromUser ? (
                    <div className="message user">
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <User size={16} style={{ marginRight: '0.5rem' }} />
                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          You • {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div>{message.message}</div>
                    </div>
                  ) : (
                    <div className="message bot">
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <Bot size={16} style={{ marginRight: '0.5rem' }} />
                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          Financial Advisor • {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {message.response || message.message}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {loading && (
              <div className="message bot">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Bot size={16} style={{ marginRight: '0.5rem' }} />
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    Financial Advisor
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about saving money, budgeting, or financial planning..."
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              style={{ 
                opacity: loading || !inputMessage.trim() ? 0.5 : 1,
                cursor: loading || !inputMessage.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Sample Questions */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Sample Questions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {[
            "How can I save $1000 in 3 months?",
            "What's the best way to budget my monthly income?",
            "Should I prioritize paying off debt or saving?",
            "How much should I save for an emergency fund?",
            "What are some ways to reduce my monthly expenses?",
            "How can I stay motivated to save money?"
          ].map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickTip(question)}
              className="btn btn-secondary btn-sm"
              style={{ 
                textAlign: 'left', 
                padding: '0.75rem',
                fontSize: '0.875rem',
                lineHeight: '1.4'
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
