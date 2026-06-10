import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { MATCHES, GROUPS, getMatchTeams } from "../data/matches";

const GROUP_KEYS = Object.keys(GROUPS);

export default function MyQuiniela() {
  const { user } = useAuth();
  const [quiniela, setQuiniela] = useState(null);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState("A");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getDoc(doc(db, "quinielas", user.uid)),
      getDoc(doc(db, "results", "official")),
    ]).then(([qSnap, rSnap]) => {
      if (qSnap.exists()) setQuiniela(qSnap.data());
      if (rSnap.exists()) setResults(rSnap.data().scores || {});
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="loader-full" style={{minHeight:"40vh"}}>
        <div className="spinner" />
      </div>
    );
  }

  if (!quiniela) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="icon">📝</div>
            <p>Aún no tienes una quiniela guardada.</p>
            <button className="btn btn-gold" onClick={() => window.scrollTo(0,0)}>
              Llenar mi quiniela
            </button>
          </div>
        </div>
      </div>
    );
  }

  const preds = quiniela.predictions || {};

  // Stats
  let exactCount = 0, resultCount = 0, wrongCount = 0, pendingCount = 0;
  MATCHES.forEach(m => {
    const pred = preds[m.id];
    const real = results[m.id];
    if (!real) { pendingCount++; return; }
    if (!pred) { wrongCount++; return; }
    if (pred.homeScore === real.homeScore && pred.awayScore === real.awayScore) exactCount++;
    else if (Math.sign(pred.homeScore - pred.awayScore) === Math.sign(real.homeScore - real.awayScore)) resultCount++;
    else wrongCount++;
  });
  const pts = exactCount * 3 + resultCount * 1;

  const groupMatches = MATCHES.filter(m => m.group === activeGroup);

  return (
    <div className="page">
      <div className="container">

        {/* Hero */}
        <div className="hero">
          <div className="hero-badge">📊 Mi progreso</div>
          <h1 className="hero-title">Mi Quiniela</h1>
          <p className="hero-sub">Guardada el {new Date(quiniela.savedAt).toLocaleDateString("es-MX", {day:"numeric",month:"long"})}</p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num" style={{color:"var(--gold)"}}>{pts}</div>
            <div className="stat-label">Puntos totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{color:"#4ade80"}}>{exactCount}</div>
            <div className="stat-label">Exactos (×3)</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{color:"#60a5fa"}}>{resultCount}</div>
            <div className="stat-label">Resultado (×1)</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{color:"#f87171"}}>{wrongCount}</div>
            <div className="stat-label">Incorrectos</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{color:"var(--text-muted)"}}>{pendingCount}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>

        {/* Points legend */}
        <div className="points-legend">
          <div className="legend-item"><div className="legend-dot result-exact"></div><span>Exacto</span></div>
          <div className="legend-item"><div className="legend-dot result-partial"></div><span>Resultado correcto</span></div>
          <div className="legend-item"><div className="legend-dot result-wrong"></div><span>Incorrecto</span></div>
          <div className="legend-item"><div className="legend-dot result-none"></div><span>Pendiente</span></div>
        </div>

        {/* Group tabs */}
        <div className="tabs">
          {GROUP_KEYS.map(g => (
            <button
              key={g}
              className={`tab-btn${activeGroup === g ? " active" : ""}`}
              onClick={() => setActiveGroup(g)}
            >
              Grupo {g}
            </button>
          ))}
        </div>

        {/* Group card */}
        <div className="card">
          <div className="group-header">
            <div className="group-badge">{activeGroup}</div>
            <h3>Grupo {activeGroup}</h3>
          </div>

          {groupMatches.map(match => {
            const { home, away, homeFlag, awayFlag } = getMatchTeams(match);
            const pred = preds[match.id];
            const real = results[match.id];

            let indicator = "result-none";
            if (pred && real) {
              if (pred.homeScore === real.homeScore && pred.awayScore === real.awayScore) indicator = "result-exact";
              else if (Math.sign(pred.homeScore - pred.awayScore) === Math.sign(real.homeScore - real.awayScore)) indicator = "result-partial";
              else indicator = "result-wrong";
            }

            return (
              <div key={match.id} className="pred-row">
                <div className={`result-indicator ${indicator}`} />
                <span style={{fontSize:"1.1rem"}}>{homeFlag}</span>
                <span className="team-name home" style={{flex:1,textAlign:"right",fontSize:"0.85rem"}}>{home}</span>

                <div className={`pred-score${!pred ? " no-pred" : ""}`}>
                  {pred
                    ? `${pred.homeScore} – ${pred.awayScore}`
                    : "–"
                  }
                </div>

                {real && (
                  <div style={{fontSize:"0.7rem",color:"var(--text-muted)",background:"rgba(42,54,80,0.5)",padding:"0.15rem 0.4rem",borderRadius:"4px"}}>
                    Real: {real.homeScore}–{real.awayScore}
                  </div>
                )}

                <span className="team-name away" style={{flex:1,fontSize:"0.85rem"}}>{away}</span>
                <span style={{fontSize:"1.1rem"}}>{awayFlag}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
