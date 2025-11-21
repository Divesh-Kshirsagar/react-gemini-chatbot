import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(envApiKey);
  const [isConfigured, setIsConfigured] = useState(!!envApiKey);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      const botMessage = { role: 'bot', content: text };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        role: 'bot', 
        content: `Error: ${error.message}. Please check your API key.` 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConfigureApi = () => {
    if (apiKey.trim()) {
      setIsConfigured(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
    }
  };

  const handleResetApiKey = () => {
    if (window.confirm('Reset API key? This will clear your chat history.')) {
      setIsConfigured(false);
      setApiKey('');
      setMessages([]);
    }
  };

  if (!isConfigured) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#1e1e1e' }}>
        <div className="row justify-content-center w-100">
          <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0" style={{ backgroundColor: '#2a2b32', color: '#e3e3e3' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="rounded-circle d-inline-flex p-4 mb-3" style={{ backgroundColor: '#8e918f' }}>
                    <i className="bi bi-stars text-white" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h2 className="fw-bold text-white">Gemini</h2>
                  <p className="text-white-50">Powered by Gemini 2.0 Flash</p>
                </div>
                <div className="mb-4">
                  <label htmlFor="apiKey" className="form-label fw-semibold">
                    <i className="bi bi-key-fill me-2"></i>
                    API Key
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg text-white"
                    id="apiKey"
                    placeholder="Enter your Gemini API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleConfigureApi()}
                    style={{ backgroundColor: '#40414f', border: '1px solid #565869' }}
                  />
                  <div className="form-text mt-2 text-white-50">
                    <i className="bi bi-info-circle me-1"></i>
                    Don't have an API key?{' '}
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-decoration-none fw-semibold"
                      style={{ color: '#8ab4f8' }}
                    >
                      Get one here
                    </a>
                  </div>
                </div>
                <button
                  className="btn btn-lg w-100 text-white fw-semibold"
                  onClick={handleConfigureApi}
                  disabled={!apiKey.trim()}
                  style={{ backgroundColor: '#8e918f', border: 'none' }}
                >
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  Start Chatting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100" style={{ backgroundColor: '#1e1e1e' }}>
      {/* Header */}
      <nav className="navbar navbar-dark py-2 px-3 border-bottom" style={{ backgroundColor: '#131314', borderColor: '#2a2b32 !important' }}>
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h5 fw-bold text-white">
            <i className="bi bi-robot me-2"></i>
            Gemini
          </span>
          <div className="d-flex gap-2 align-items-center">
            <a
              href="https://github.com/Divesh-Kshirsagar/react-gemini-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              title="View source on GitHub"
              className="btn btn-sm text-white"
              style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
            >
              <i className="bi bi-github" style={{ fontSize: '1.5rem' }}></i>
            </a>
            <button
              className="btn btn-sm text-white"
              onClick={handleClearChat}
              title="New chat"
              disabled={messages.length === 0}
              style={{ backgroundColor: 'transparent', border: '1px solid #565869' }}
            >
              <i className="bi bi-trash me-1"></i>
              <span className="d-none d-sm-inline">New chat</span>
            </button>
            <button
              className="btn btn-sm text-white"
              onClick={handleResetApiKey}
              title="Settings"
              style={{ backgroundColor: 'transparent', border: '1px solid #565869' }}
            >
              <i className="bi bi-gear"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Messages Area */}
      <div className="flex-grow-1 overflow-auto">
        <div className="container-fluid px-0">
          {messages.length === 0 && (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', color: '#e3e3e3' }}>
              <div className="mb-4">
                <i className="bi bi-stars" style={{ fontSize: '3.5rem', color: '#8e918f' }}></i>
              </div>
              <h2 className="fw-bold mb-3" style={{ color: '#e3e3e3' }}>Hello, User</h2>
              <p className="mb-5" style={{ color: '#9aa0a6' }}>How can I help you today?</p>
              <div className="row g-3 w-100" style={{ maxWidth: '900px' }}>
                <div className="col-12 col-md-6">
                  <div 
                    className="card border text-white h-100"
                    style={{ cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#2a2b32', borderColor: '#444654' }}
                    onClick={() => setInput('What is artificial intelligence?')}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#353740'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2b32'}
                  >
                    <div className="card-body p-3">
                      <i className="bi bi-lightbulb me-2" style={{ color: '#fbbf24' }}></i>
                      <span>Explain a concept</span>
                      <p className="small mt-2 mb-0" style={{ color: '#9aa0a6' }}>What is artificial intelligence?</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div 
                    className="card border text-white h-100"
                    style={{ cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#2a2b32', borderColor: '#444654' }}
                    onClick={() => setInput('Tell me a joke')}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#353740'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2b32'}
                  >
                    <div className="card-body p-3">
                      <i className="bi bi-emoji-smile me-2" style={{ color: '#34a853' }}></i>
                      <span>Get creative</span>
                      <p className="small mt-2 mb-0" style={{ color: '#9aa0a6' }}>Tell me a joke</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div 
                    className="card border text-white h-100"
                    style={{ cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#2a2b32', borderColor: '#444654' }}
                    onClick={() => setInput('How do I learn programming?')}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#353740'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2b32'}
                  >
                    <div className="card-body p-3">
                      <i className="bi bi-code-slash me-2" style={{ color: '#8ab4f8' }}></i>
                      <span>Get advice</span>
                      <p className="small mt-2 mb-0" style={{ color: '#9aa0a6' }}>How do I learn programming?</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div 
                    className="card border text-white h-100"
                    style={{ cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#2a2b32', borderColor: '#444654' }}
                    onClick={() => setInput('Write a short story')}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#353740'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2b32'}
                  >
                    <div className="card-body p-3">
                      <i className="bi bi-book me-2" style={{ color: '#ea4335' }}></i>
                      <span>Write something</span>
                      <p className="small mt-2 mb-0" style={{ color: '#9aa0a6' }}>Write a short story</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`py-4`}
              style={{ 
                animation: 'fadeIn 0.3s ease-in',
                backgroundColor: message.role === 'user' ? 'transparent' : '#2a2b32'
              }}
            >
              <div className="container" style={{ maxWidth: '800px' }}>
                <div className="d-flex gap-3">
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`}
                    style={{ 
                      width: '36px', 
                      height: '36px',
                      backgroundColor: message.role === 'user' ? '#5f6368' : '#8e918f'
                    }}
                  >
                    <i className={`bi ${message.role === 'user' ? 'bi-person-fill' : 'bi-stars'} text-white`}></i>
                  </div>
                  <div className="flex-grow-1 pt-1" style={{ color: '#e3e3e3' }}>
                    <div className="fw-semibold mb-2">
                      {message.role === 'user' ? 'You' : 'Gemini'}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                      {message.role === 'bot' ? (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="py-4" style={{ backgroundColor: '#2a2b32' }}>
              <div className="container" style={{ maxWidth: '800px' }}>
                <div className="d-flex gap-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '36px', height: '36px', backgroundColor: '#8e918f' }}
                  >
                    <i className="bi bi-stars text-white"></i>
                  </div>
                  <div className="flex-grow-1 pt-1" style={{ color: '#e3e3e3' }}>
                    <div className="fw-semibold mb-2">Gemini</div>
                    <div className="d-flex gap-1">
                      <div className="spinner-grow spinner-grow-sm text-light" role="status" style={{ width: '0.5rem', height: '0.5rem' }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="spinner-grow spinner-grow-sm text-light" role="status" style={{ width: '0.5rem', height: '0.5rem', animationDelay: '0.1s' }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="spinner-grow spinner-grow-sm text-light" role="status" style={{ width: '0.5rem', height: '0.5rem', animationDelay: '0.2s' }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="py-3" style={{ backgroundColor: '#1e1e1e' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="position-relative">
            <input
              ref={inputRef}
              type="text"
              className="form-control form-control-lg text-white border-0 shadow-sm"
              placeholder="Ask Gemini..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{ 
                backgroundColor: '#2a2b32',
                borderRadius: '24px',
                paddingRight: '60px',
                paddingLeft: '20px',
                border: '1px solid #444654'
              }}
            />
            <button
              className="btn position-absolute top-50 end-0 translate-middle-y me-2"
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              style={{ 
                backgroundColor: input.trim() ? '#8e918f' : 'transparent',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                padding: 0
              }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm text-white" role="status" aria-hidden="true"></span>
              ) : (
                <i className={`bi bi-arrow-up-short ${input.trim() ? 'text-white' : 'text-muted'}`} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}></i>
              )}
            </button>
          </div>
          <div className="text-center mt-2">
            <small style={{ fontSize: '0.75rem', color: '#9aa0a6' }}>
              Gemini can make mistakes, so double-check it.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
