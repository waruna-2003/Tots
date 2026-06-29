import { useEffect, useRef } from 'react';
import './Matching.css';

const COUNT    = 7;
const DURATION = 5600;
const CX = 130, CY = 130, R = 110;

function PersonIcon({ color, size = 36 }) {
  return (
    <svg width={size} height={Math.round(size * 48 / 44)} viewBox="0 0 44 48" aria-hidden="true">
      <circle cx="22" cy="14" r="10" fill={color} />
      <path d="M2 46c0-11.046 8.954-20 20-20s20 8.954 20 20" fill={color} />
    </svg>
  );
}

function Matching({ onCancel, onlineCount = 1284 }) {
  const orbitRef  = useRef(null);
  const rafRef    = useRef(null);
  const startRef  = useRef(null);
  const figsRef   = useRef([]);

  useEffect(() => {
    const container = orbitRef.current;
    if (!container) return;

    const figs = [];

    for (let i = 0; i < COUNT; i++) {
      const wrap = document.createElement('div');
      wrap.style.cssText =
        'position:absolute;width:40px;height:44px;display:flex;align-items:center;justify-content:center;';

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width',  '36');
      svg.setAttribute('height', '40');
      svg.setAttribute('viewBox', '0 0 44 48');

      const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      head.setAttribute('cx', '22'); head.setAttribute('cy', '14'); head.setAttribute('r', '10');

      const body = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      body.setAttribute('d', 'M2 46c0-11.046 8.954-20 20-20s20 8.954 20 20');

      svg.appendChild(head);
      svg.appendChild(body);
      wrap.appendChild(svg);
      container.appendChild(wrap);

      figs.push({ wrap, head, body, baseAngle: (i / COUNT) * Math.PI * 2 });
    }

    figsRef.current = figs;

    let lit = -1;

    function tick(ts) {
      if (!startRef.current) startRef.current = ts;
      const elapsed  = ts - startRef.current;
      const progress = (elapsed % DURATION) / DURATION;
      const angle    = progress * Math.PI * 2;

      figs.forEach((f) => {
        const a = f.baseAngle + angle;
        const x = CX + R * Math.sin(a) - 20;
        const y = CY - R * Math.cos(a) - 22;
        f.wrap.style.left = x + 'px';
        f.wrap.style.top  = y + 'px';
      });

      const newLit = Math.floor(progress * COUNT);
      if (newLit !== lit) {
        lit = newLit;
        figs.forEach((f, i) => {
          const color = i <= lit ? '#77DD77' : '#C4CAD4';
          f.head.setAttribute('fill', color);
          f.body.setAttribute('fill', color);
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      figs.forEach((f) => f.wrap.remove());
    };
  }, []);

  return (
    <div className="matching-page">

      {/* ── Navbar ── */}

      {/* ── Body ── */}
      <main className="matching-body">

        {/* Orbit animation */}
        <div
          className="orbit-wrap"
          ref={orbitRef}
          role="img"
          aria-label="Searching for a match"
        >
          <div className="orbit-ring" aria-hidden="true" />

          {/* Fixed green center figure */}
          <div className="center-fig" aria-hidden="true">
            <PersonIcon color="#77DD77" size={44} />
          </div>

          {/* Orbit figures are injected imperatively by the useEffect above */}
        </div>

        <h1 className="matching-heading">Finding someone...</h1>
        <p className="matching-sub">
          Scanning for people around the world.{' '}
          This only takes a moment.
        </p>

        {/* Replace onlineCount with live socket value when backend reconnects */}
        <p className="online-count">
          <strong>{onlineCount.toLocaleString()}</strong> people online right now
        </p>

      </main>

      {/* ── Footer ── */}

    </div>
  );
}

export default Matching;