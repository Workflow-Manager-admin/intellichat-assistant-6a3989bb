import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main App component - contains authentication, chatbot UI, history, profile panel, and theming.
 * Layout: Header (logo), center chat, sidebar (profile), bottom input, message history above input.
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "assistant",
      content: "Hi! I'm your AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  ]);
  const messagesEndRef = useRef(null);

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const handleAuthInput = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  // PUBLIC_INTERFACE
  // Demo placeholder authentication: Accepts any non-empty username/password
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authForm.username || !authForm.password) {
      setAuthError('Please provide username and password.');
      return;
    }
    // Simulate loading & authentication
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser({
        username: authForm.username,
        fullName: authForm.username.charAt(0).toUpperCase() + authForm.username.slice(1) + ' User',
        email: authForm.username + '@email.com',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(authForm.username)
      });
    }, 500);
  };

  // PUBLIC_INTERFACE
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAuthForm({ username: '', password: '' });
    setAuthError('');
    setChatHistory([
      {
        sender: "assistant",
        content: "Hi! I'm your AI assistant. How can I help you today?",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
    ]);
  };

  // PUBLIC_INTERFACE
  // Simulate chatbot reply (replace with API call as needed)
  const simulateBotReply = (userMessage) => {
    setTimeout(() => {
      const assistantResponse = {
        sender: "assistant",
        content: `You said: "${userMessage}"\n\nHere's an intelligent response from your AI assistant! 🤖`,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setChatHistory(prev => [...prev, assistantResponse]);
    }, 1400);
  };

  // PUBLIC_INTERFACE
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const msgObj = {
      sender: "user",
      content: message,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    setChatHistory(prev => [...prev, msgObj]);
    setMessage('');
    simulateBotReply(message);
  };

  // PUBLIC_INTERFACE
  // Authentication form component
  const AuthForm = () => (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleLogin}>
        <div className="logo-area">
          <span className="brand-avatar">
            <img src="/favicon.ico" alt="Logo" height="42" />
          </span>
          <div className="brand-title">IntelliChat</div>
        </div>
        <div className="auth-fields">
          <input
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Username"
            value={authForm.username}
            onChange={handleAuthInput}
            required
          />
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={authForm.password}
            onChange={handleAuthInput}
            required
          />
        </div>
        {authError && <div className="auth-error">{authError}</div>}
        <button type="submit" className="btn-accent auth-btn">Sign In</button>
        <div className="auth-note">Demo: Any username/password</div>
      </form>
    </div>
  );

  // PUBLIC_INTERFACE
  // User profile/side panel component
  const Sidebar = () => (
    <aside className="profile-sidebar">
      <div className="profile-avatar">
        <img src={user.avatar} alt={user.username} />
      </div>
      <div className="profile-details">
        <strong>{user.fullName}</strong>
        <span className="profile-email">{user.email}</span>
      </div>
      <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
      <div className="sidebar-footer">IntelliChat Assistant v1.0</div>
    </aside>
  );

  // PUBLIC_INTERFACE
  // Chat message bubble
  const MessageItem = ({msg}) => (
    <div className={`msg-bubble ${msg.sender === "user" ? 'from-user' : 'from-assistant'}`}>
      <div className="bubble-meta">
        <span className="bubble-sender">{msg.sender === 'user' ? 'You' : 'Assistant'}</span>
        <span className="bubble-time">{msg.time}</span>
      </div>
      <div className="bubble-content">{msg.content}</div>
    </div>
  );

  // PUBLIC_INTERFACE
  // Main chat area
  const ChatUI = () => (
    <div className="chat-app-shell">
      <header className="chat-header">
        <div className="header-left">
          <img src="/favicon.ico" alt="Logo" className="header-logo" />
          <span className="header-title">IntelliChat</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <main className="chat-layout">
        <div className="chat-center">
          <div className="chat-history">
            {chatHistory.map((msg, i) =>
              <MessageItem msg={msg} key={i} />
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input-row" onSubmit={handleSendMessage}>
            <input
              className="chat-input"
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              disabled={!isAuthenticated}
              aria-label="Type your message"
              autoFocus
            />
            <button className="btn-accent send-btn" type="submit" disabled={!message.trim()}>Send</button>
          </form>
        </div>
        <Sidebar />
      </main>
    </div>
  );

  return (
    <div className="App" data-theme={theme}>
      {!isAuthenticated ? <AuthForm /> : <ChatUI />}
    </div>
  );
}

export default App;
