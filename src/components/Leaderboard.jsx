import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_CLASS = ["top-1", "top-2", "top-3"];

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "quinielas"), orderBy("points", "desc"));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEntries(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loader-full" style={{minHeight:"40vh"}}>
            <div className="spinner" />
            <span style={{color:"var(--text-muted)"}}>Cargando tabla...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">

        {/* Hero */}
        <div className="hero">
          <div className="hero-badge">🏆 Clasificación en vivo</div>
          <h1 className="hero-title">Tabla de<br />Posiciones</h1>
          <p className="hero-sub">
            {entries.length} participante{entries.length !== 1 ? "s" : ""} — Actualización en tiempo real
          </p>
        </div>

        {/* Legend */}
        <div className="points-legend" style={{marginBottom:"1.5rem"}}>
          <div className="legend-item">
            <div className="legend-dot" style={{background:"#4ade80"}}></div>
            <span><strong style={{color:"#4ade80"}}>3 pts</strong> resultado exacto</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{background:"#60a5fa"}}></div>
            <span><strong style={{color:"#60a5fa"}}>1 pt</strong> ganador correcto</span>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <p>Aún no hay quinielas guardadas. ¡Sé el primero!</p>
          </div>
        ) : (
          <div className="leaderboard">
            {entries.map((entry, i) => {
              const isMe = user && entry.id === user.uid;
              const rankClass = i < 3 ? RANK_CLASS[i] : "";
              const rankLabel = MEDALS[i] ?? `${i + 1}`;

              return (
                <div
                  key={entry.id}
                  id={`lb-row-${i + 1}`}
                  className={`lb-row${rankClass ? ` ${rankClass}` : ""}${isMe ? " is-me" : ""}`}
                >
                  <div className={`lb-rank${i === 0 ? " gold" : i === 1 ? " silver" : i === 2 ? " bronze" : ""}`}>
                    {rankLabel}
                  </div>

                  <img
                    src={entry.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&background=1a2235&color=ffd700&bold=true`}
                    alt={entry.name}
                    className="lb-avatar"
                  />

                  <div className="lb-info">
                    <div className="lb-name">
                      {entry.name}
                      {isMe && <span className="lb-me-tag">Tú</span>}
                    </div>
                    <div className="lb-breakdown">
                      <span className="lb-exact">⬢ {entry.exactCount ?? 0} exactos</span>
                      <span className="lb-result">◈ {entry.resultCount ?? 0} resultado</span>
                    </div>
                  </div>

                  <div className="lb-pts">
                    <span className="lb-pts-num">{entry.points ?? 0}</span>
                    <span className="lb-pts-label">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
