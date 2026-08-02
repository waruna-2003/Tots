import { useRef, useEffect } from "react";
import "./Chat.css";

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Chat({
  myId,
  messages,
  message,
  setMessage,
  onSend,
  onNext,
  onReport,
  notice,
  canSend,
}) {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar">A</div>

          <div className="chat-header-info">
            <span className="chat-header-name">
              Anonymous
            </span>

            <span className="chat-header-status">
              <span className="status-dot"></span>
              Online now
            </span>
          </div>
        </div>

        <div className="chat-header-actions">
          <button
            className="header-icon-btn"
            title="Report this person"
            aria-label="Report this person"
            onClick={onReport}
          >
            Report
          </button>

          <button
            className="next-btn"
            onClick={onNext}
          >
            <span className="next-label">Next person</span><span className="next-icon" aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      {/* Messages */}

      <main className="chat-messages">

        <div className="system-msg">
          {notice || "You're now connected to a stranger."}
        </div>

        {messages.map((msg, index) => {

          const isMe =
            msg.senderId === myId;

          return (

            <div
              key={msg.id || index}
              className={`msg-row ${
                isMe ? "me" : "them"
              }`}
            >

              {!isMe && (
                <div className="msg-mini-avatar">
                  A
                </div>
              )}

              <div
                className={`bubble ${
                  isMe ? "me" : "them"
                }`}
              >

                <div>{msg.text}</div>

                <span className="bubble-time">
                  {msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : formatTime()}

                  {isMe && " ✓✓"}

                </span>

              </div>

            </div>

          );

        })}

        <div ref={messagesEndRef}></div>

      </main>

      {/* Input */}

      <footer className="chat-input-bar">

        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          onKeyDown={handleKeyDown}
          disabled={!canSend}
        />

        <button
          className="send-btn"
          onClick={onSend}
          disabled={!canSend || !message.trim()}
        >
          <span aria-hidden="true">➤</span><span className="visually-hidden">Send</span>
        </button>

      </footer>
    </div>
  );
}

export default Chat;
