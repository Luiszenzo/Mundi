import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { GROUPS, MATCHES, DEADLINE, getMatchTeams } from "../data/matches";
import { useAuth } from "../hooks/useAuth";

const GROUP_KEYS = Object.keys(GROUPS);

function Toast({ msg, type, show }) {
  return (
    <div className={`toast${show ? " show" : ""} ${type}`}>{msg}</div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ["#FFD700","#4ade80","#60a5fa","#f472b6","#fb923c"][i % 5],
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 10,
  }));

  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}vw`,
          background: p.color,
          width: p.size,
          height: p.size,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </>
  );
}

export default function QuinielaForm() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState({});
  const [savedPredictions, setSavedPredictions] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "", show: false });
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeGroup, setActiveGroup] = useState("A");

  const isPastDeadline = new Date() > DEADLINE;
  const isLocked = savedPredictions !== null || isPastDeadline;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "quinielas", user.uid)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setSavedPredictions(data.predictions);
        setPredictions(data.predictions);
      }
    });
  }, [user]);

  const handleScore = useCallback((matchId, side, value) => {
    const parsed = value === "" ? "" : Math.max(0, Math.min(99, parseInt(value) || 0));
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: parsed },
    }));
  }, []);

  const groupMatches = MATCHES.filter(m => m.group === activeGroup);

  const totalFilled = MATCHES.filter(m => {
    const p = predictions[m.id];
    return p && p.homeScore !== "" && p.homeScore !== undefined && p.awayScore !== "" && p.awayScore !== undefined;
  }).length;

  const handleSave = async () => {
    if (isLocked) return;
    const missing = MATCHES.filter(m => {
      const p = predictions[m.id];
      return !p || p.homeScore === "" || p.homeScore === undefined || p.awayScore === "" || p.awayScore === undefined;
    });
    if (missing.length > 0) {
      showToast(`Faltan ${missing.length} partidos por predecir`, "error");
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, "quinielas", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        predictions,
        points: 0,
        exactCount: 0,
        resultCount: 0,
        savedAt: new Date().toISOString(),
      });
      setSavedPredictions(predictions);
      setShowConfetti(true);
      showToast("🎉 ¡Quiniela guardada con éxito!", "success");
      setTimeout(() => setShowConfetti(false), 4000);
    } catch (e) {
      showToast("Error al guardar. Intenta de nuevo.", "error");
    }
    setSaving(false);
  };

  const displayPredictions = savedPredictions || predictions;

  return (
    <div className="page">
      {showConfetti && <Confetti />}
      <div className="container">

        {/* Hero */}
        <div className="hero">
          <div className="hero-badge">⚽ Mundial 2026 — Fase de Grupos</div>
          <h1 className="hero-title">Tu Quiniela</h1>
          <p className="hero-sub">Predice los 72 partidos de la fase de grupos</p>
          {isPastDeadline && (
            <div className="deadline-banner">
              🔒 Quinielas cerradas — El torneo ya comenzó
            </div>
          )}
          {!isPastDeadline && !savedPredictions && (
            <div className="deadline-banner">
              ⏰ Cierre: 11 Jun 2026 antes del partido inaugural
            </div>
          )}
        </div>

        {/* Points legend */}
        <div className="points-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{background:"#4ade80"}}></div>
            <span><strong style={{color:"#4ade80"}}>3 pts</strong> — Resultado exacto</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{background:"#60a5fa"}}></div>
            <span><strong style={{color:"#60a5fa"}}>1 pt</strong> — Ganador correcto</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{background:"#f87171"}}></div>
            <span><strong style={{color:"#f87171"}}>0 pts</strong> — Incorrecto</span>
          </div>
        </div>

        {/* Status banner if saved */}
        {savedPredictions && (
          <div className="admin-notice" style={{marginBottom:"1.5rem"}}>
            ✅ Tu quiniela está guardada. No se puede modificar una vez enviada.
          </div>
        )}

        {/* Group tabs */}
        <div className="tabs" id="group-tabs">
          {GROUP_KEYS.map(g => (
            <button
              key={g}
              id={`tab-group-${g}`}
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
            <div>
              <h3 style={{marginBottom:"0.15rem"}}>Grupo {activeGroup}</h3>
              <div style={{fontSize:"0.8rem", color:"var(--text-muted)"}}>
                {GROUPS[activeGroup].teams.map((t, i) => `${GROUPS[activeGroup].flag[i]} ${t}`).join("  ·  ")}
              </div>
            </div>
          </div>

          {groupMatches.map(match => {
            const { home, away, homeFlag, awayFlag } = getMatchTeams(match);
            const pred = displayPredictions[match.id] || {};
            const dateObj = new Date(match.date + "T" + match.time);
            const dateStr = dateObj.toLocaleDateString("es-MX", { day:"numeric", month:"short" });

            return (
              <div key={match.id} className="match-row">
                <span className="match-flag">{homeFlag}</span>
                <span className="team-name home">{home}</span>

                <div className="score-inputs">
                  <input
                    id={`score-${match.id}-home`}
                    type="number"
                    min="0" max="99"
                    className={`score-input${pred.homeScore !== undefined && pred.homeScore !== "" ? " filled" : ""}`}
                    value={pred.homeScore ?? ""}
                    onChange={e => handleScore(match.id, "homeScore", e.target.value)}
                    disabled={isLocked}
                    placeholder="–"
                  />
                  <span className="score-sep">:</span>
                  <input
                    id={`score-${match.id}-away`}
                    type="number"
                    min="0" max="99"
                    className={`score-input${pred.awayScore !== undefined && pred.awayScore !== "" ? " filled" : ""}`}
                    value={pred.awayScore ?? ""}
                    onChange={e => handleScore(match.id, "awayScore", e.target.value)}
                    disabled={isLocked}
                    placeholder="–"
                  />
                </div>

                <span className="team-name away">{away}</span>
                <span className="match-flag">{awayFlag}</span>
                <span className="match-date-tag">{dateStr}</span>
              </div>
            );
          })}
        </div>

        {/* Save bar */}
        {!isLocked && (
          <div className="save-bar">
            <div className="save-bar-info">
              <span>{totalFilled}</span> / {MATCHES.length} partidos predichos
            </div>
            <div className="progress-bar-outer">
              <div
                className="progress-bar-inner"
                style={{ width: `${(totalFilled / MATCHES.length) * 100}%` }}
              />
            </div>
            <button
              id="btn-save-quiniela"
              className="btn btn-gold"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "💾 Guardar Quiniela"}
            </button>
          </div>
        )}
      </div>

      <Toast msg={toast.msg} type={toast.type} show={toast.show} />
    </div>
  );
}
