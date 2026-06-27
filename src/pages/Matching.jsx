import './Matching.css';

function Matching({ onCancel }) {
  return (
    <div className="matching-page">

      {/* ── Navbar ── */}
      <nav className="nav" aria-label="Main navigation">
        <span className="nav-logo">Tots</span>
        <button className="nav-cancel" onClick={onCancel}>
          Cancel
        </button>
      </nav>

      {/* ── Main Content ── */}
      <main className="matching-body">

        {/* Pulse Ring */}
        <div className="ring-wrap" aria-hidden="true">
          <div className="ring-outer" />
          <div className="ring-mid" />
          <div className="ring-inner">
            <svg className="ring-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <h1 className="matching-heading">Finding someone...</h1>

        <p className="matching-sub">
          Scanning for people around the world.{' '}
          This only takes a moment.
        </p>

        {/* Bouncing Dots */}
        <div className="dots" role="status" aria-label="Searching">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>

        {/* Live count — swap hardcoded value with real socket data later */}
        <p className="online-count">
          <strong>1,284</strong> people online right now
        </p>

      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <a className="footer-link" href="#">Privacy</a>
        <a className="footer-link" href="#">Terms</a>
        <a className="footer-link" href="#">Contact</a>
      </footer>

    </div>
  );
}

export default Matching;