import "./Home.css";

function Home({ onStart, onlineCount = 0 }) {
  return (
    <div className="home-page">
      <header className="home-navbar">
        <a className="home-brand" href="/" aria-label="Tots home">
          <span className="home-brand-mark">T</span><span>Tots</span>
        </a>
        <span className="online-indicator">
          <span className="online-indicator-dot" />
          {onlineCount > 0 ? `${onlineCount.toLocaleString()} online` : "Anonymous chat"}
        </span>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <div className="hero-badge"><span className="hero-badge-dot" />Private, instant and anonymous</div>
          <h1>Meet someone new.<span> Start a conversation.</span></h1>
          <p className="hero-description">
            Connect instantly without creating an account, sharing a profile, or revealing your identity.
          </p>
          <div className="hero-actions">
            <button type="button" className="start-chat-button" onClick={onStart}>
              <span aria-hidden="true">●</span> Start chatting
            </button>
            <span className="hero-action-note">No registration required</span>
          </div>
        </section>

        <section className="home-preview" aria-label="Example anonymous conversation">
          <div className="preview-window">
            <div className="preview-header">
              <div className="preview-avatar">A</div>
              <div><strong>Anonymous</strong><span><i className="preview-status-dot" />Online</span></div>
            </div>
            <div className="preview-messages">
              <div className="preview-message received">Hello! How is your day going?<small>10:25</small></div>
              <div className="preview-message sent">Pretty good. Nice to meet you!<small>10:26 ✓✓</small></div>
              <div className="preview-message received">Nice to meet you too.<small>10:26</small></div>
            </div>
            <div className="preview-input"><span>Type a message…</span><div className="preview-send-button" aria-hidden="true">➤</div></div>
          </div>
        </section>
      </main>

      <section className="home-features" aria-label="Why Tots">
        <article className="feature-card"><div className="feature-icon">01</div><h2>Anonymous</h2><p>No usernames, accounts, or personal profiles are required.</p></article>
        <article className="feature-card"><div className="feature-icon">02</div><h2>Instant</h2><p>Enter the queue and connect with another active person.</p></article>
        <article className="feature-card"><div className="feature-icon">03</div><h2>Temporary</h2><p>Your conversation disappears after the session finishes.</p></article>
      </section>

      <footer className="home-footer"><span>© 2026 Tots</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#safety">Safety</a></div></footer>
    </div>
  );
}

export default Home;
