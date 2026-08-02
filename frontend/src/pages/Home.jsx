import './Home.css';

function Home({ onStart }) {
  return (
    <div className="home-page">

      {/* ── Navbar ── */}

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
