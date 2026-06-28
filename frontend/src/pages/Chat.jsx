import { useRef, useEffect } from 'react';
import './Chat.css';

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Chat({ messages, message, setMessage, onSend, onNext }) {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Focus input on mount */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="chat-page">

      {/* ── Header ── */}
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar" aria-hidden="true">A</div>
          <div className="chat-header-info">
            <span className="chat-header-name">Anonymous</span>
            <span className="chat-header-status">
              <span className="status-dot" />
              Online now
            </span>
          </div>
        </div>

        <div className="chat-header-actions">
          <button
            className="header-icon-btn"
            aria-label="More options"
            title="More options"
          >
            {/* Kebab icon — three vertical dots */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="5"  r="1.2" fill="currentColor" stroke="none"/>
              <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>
              <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/>
            </svg>
          </button>

          <button className="next-btn" onClick={onNext}>
            {/* Arrow right icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
            <span>Next person</span>
          </button>
        </div>
      </header>

      {/* ── Messages ── */}
      <main className="chat-messages" role="log" aria-live="polite">

        <div className="system-msg">
          You're now connected to a stranger. Say hi!
        </div>

        {messages.map((msg, index) => {
          const isMe = msg.sender === 'me';
          return (
            <div
              key={index}
              className={`msg-row ${isMe ? 'me' : 'them'}`}
            >
              {!isMe && (
                <div className="msg-mini-avatar" aria-hidden="true">A</div>
              )}
              <div className={`bubble ${isMe ? 'me' : 'them'}`}>
                {msg.text}
                <span className="bubble-time">
                  {msg.time || formatTime()}
                  {isMe && ' ✓✓'}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </main>

      {/* ── Input Bar ── */}
      <footer className="chat-input-bar">
        <button className="input-emoji-btn" aria-label="Emoji">
          {/* Smile icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </button>

        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message input"
        />

        <button
          className="send-btn"
          onClick={onSend}
          aria-label="Send message"
        >
          {/* Send icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </footer>

    </div>
  );
}

export default Chat;