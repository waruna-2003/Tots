import './Home.css';

function Home({ onStart }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ── */}
      <nav className="nav" aria-label="Main navigation">
        <span className="nav-logo">Tots</span>
        <a className="nav-link" href="#">About</a>
      </nav>

      {/* ── Hero ── */}
      <main className="hero">
        <h1 className="hero-logo">Tots</h1>

        <h2 className="hero-heading">
          Meet someone<br />new instantly.
        </h2>

        <p className="hero-subtitle">
          Anonymous conversations with people around the world.<br />
          No account required.
        </p>

        <button className="cta-button" onClick={onStart}>
          Start Chat
        </button>

        <div className="divider" aria-hidden="true" />
      </main>

      {/* ── Feature Cards ── */}
      <section className="cards" aria-label="Features">
        <div className="card">
          <div className="card-icon" aria-hidden="true">🎭</div>
          <div className="card-title">Anonymous</div>
          <div className="card-body">No personal information required.</div>
        </div>

        <div className="card">
          <div className="card-icon" aria-hidden="true">⚡</div>
          <div className="card-title">Instant</div>
          <div className="card-body">Connect within seconds.</div>
        </div>

        <div className="card">
          <div className="card-icon" aria-hidden="true">🌱</div>
          <div className="card-title">Free</div>
          <div className="card-body">No subscriptions, ever.</div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-links">
          <a className="footer-link" href="#">Privacy</a>
          <a className="footer-link" href="#">Terms</a>
          <a className="footer-link" href="#">Contact</a>
        </div>
        <span className="footer-copy">© 2026 Tots</span>
      </footer>

    </div>
  );
}

export default Home;