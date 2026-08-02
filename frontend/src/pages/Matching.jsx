import "./Matching.css";

function Matching({ onCancel, onlineCount = 0, notice = "" }) {
  return (
    <div className="matching-page">
      <header className="matching-header"><div className="matching-brand"><span>T</span>Tots</div></header>
      <main className="matching-content">
        <section className="matching-card" aria-live="polite">
          <div className="matching-animation" aria-hidden="true">
            <div className="matching-avatar matching-avatar-left">You</div>
            <div className="matching-line"><span /><span /><span /></div>
            <div className="matching-avatar matching-avatar-right">?</div>
          </div>
          <h1>Finding someone for you</h1>
          <p>{notice || "Stay on this page while Tots searches for another available person."}</p>
          <div className="matching-status"><span className="matching-spinner" />Searching securely…</div>
          {onlineCount > 0 && <div className="matching-online">{onlineCount.toLocaleString()} {onlineCount === 1 ? "person" : "people"} online</div>}
          {onCancel && <button type="button" className="cancel-search-button" onClick={onCancel}>Cancel search</button>}
        </section>
      </main>
    </div>
  );
}

export default Matching;
