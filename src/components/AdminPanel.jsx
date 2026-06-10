import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc, getDoc, setDoc, collection, getDocs, writeBatch
} from "firebase/firestore";
import { MATCHES, GROUPS, getMatchTeams } from "../data/matches";
import { fetchWorldCupResults } from "../services/footballApi";

const GROUP_KEYS = Object.keys(GROUPS);

// ─── API Key Storage ─────────────────────────────────────────────────────────
const ENV_API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || "";
function loadApiKey() { return localStorage.getItem("fd_api_key") || ENV_API_KEY; }
function saveApiKey(key) { localStorage.setItem("fd_api_key", key); }

export default function AdminPanel() {
  const [results, setResults]         = useState({});
  const [saving, setSaving]           = useState(false);
  const [syncing, setSyncing]         = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [status, setStatus]           = useState("");
  const [statusType, setStatusType]   = useState(""); // "ok" | "err"
  const [activeGroup, setActiveGroup] = useState("A");
  const [apiKey, setApiKey]           = useState(loadApiKey);
  const [showKeyInput, setShowKeyInput] = useState(false); // hidden by default since key is pre-configured

  // Load existing results from Firestore
  useEffect(() => {
    getDoc(doc(db, "results", "official")).then(snap => {
      if (snap.exists()) setResults(snap.data().scores || {});
    });
  }, []);

  const setOk  = (msg) => { setStatus(msg); setStatusType("ok"); };
  const setErr = (msg) => { setStatus(msg); setStatusType("err"); };

  // ── Sync from API ─────────────────────────────────────────────────────────
  const handleSync = async () => {
    if (!apiKey.trim()) { setErr("⚠️ Ingresa tu API key de football-data.org"); setShowKeyInput(true); return; }
    saveApiKey(apiKey.trim());
    setSyncing(true);
    setStatus("🔄 Consultando football-data.org...");
    setStatusType("");
    try {
      const fetched = await fetchWorldCupResults(apiKey.trim(), MATCHES, GROUPS);
      const count = Object.keys(fetched).length;
      if (count === 0) {
        setOk("✅ Sin partidos terminados aún (o equipos no mapeados).");
      } else {
        // Merge with existing results (don't overwrite manual entries for unfinished games)
        setResults(prev => ({ ...prev, ...fetched }));
        setOk(`✅ ${count} resultado${count !== 1 ? "s" : ""} importado${count !== 1 ? "s" : ""} desde la API`);
      }
    } catch (e) {
      setErr(`❌ ${e.message}`);
    }
    setSyncing(false);
  };

  // ── Save results to Firestore ─────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setStatus("Guardando en Firestore...");
    setStatusType("");
    await setDoc(doc(db, "results", "official"), { scores: results });
    setOk("✅ Resultados guardados en Firestore");
    setSaving(false);
  };

  // ── Recalculate all points ────────────────────────────────────────────────
  const handleRecalc = async () => {
    setRecalculating(true);
    setStatus("⚙️ Recalculando puntos...");
    setStatusType("");
    const snap = await getDocs(collection(db, "quinielas"));
    const batch = writeBatch(db);
    let count = 0;
    snap.forEach(d => {
      const preds = d.data().predictions || {};
      let exactCount = 0, resultCount = 0;
      MATCHES.forEach(m => {
        const pred = preds[m.id];
        const real = results[m.id];
        if (!pred || real?.homeScore === undefined || real?.awayScore === undefined) return;
        if (pred.homeScore === real.homeScore && pred.awayScore === real.awayScore) exactCount++;
        else if (Math.sign(pred.homeScore - pred.awayScore) === Math.sign(real.homeScore - real.awayScore)) resultCount++;
      });
      batch.update(doc(db, "quinielas", d.id), {
        points: exactCount * 3 + resultCount,
        exactCount,
        resultCount,
      });
      count++;
    });
    await batch.commit();
    setOk(`✅ ${count} quiniela${count !== 1 ? "s" : ""} recalculada${count !== 1 ? "s" : ""}`);
    setRecalculating(false);
  };

  // ── Sync + Save + Recalc in one click ────────────────────────────────────
  const handleSyncAll = async () => {
    if (!apiKey.trim()) { setErr("⚠️ Ingresa tu API key primero"); setShowKeyInput(true); return; }
    saveApiKey(apiKey.trim());
    setSyncing(true);
    setStatus("🔄 Importando resultados...");
    setStatusType("");
    try {
      const fetched = await fetchWorldCupResults(apiKey.trim(), MATCHES, GROUPS);
      const merged = { ...results, ...fetched };
      setResults(merged);
      await setDoc(doc(db, "results", "official"), { scores: merged });

      // Recalc
      setStatus("⚙️ Recalculando puntos...");
      const snap = await getDocs(collection(db, "quinielas"));
      const batch = writeBatch(db);
      let count = 0;
      snap.forEach(d => {
        const preds = d.data().predictions || {};
        let exactCount = 0, resultCount = 0;
        MATCHES.forEach(m => {
          const pred = preds[m.id];
          const real = merged[m.id];
          if (!pred || real?.homeScore === undefined || real?.awayScore === undefined) return;
          if (pred.homeScore === real.homeScore && pred.awayScore === real.awayScore) exactCount++;
          else if (Math.sign(pred.homeScore - pred.awayScore) === Math.sign(real.homeScore - real.awayScore)) resultCount++;
        });
        batch.update(doc(db, "quinielas", d.id), {
          points: exactCount * 3 + resultCount,
          exactCount,
          resultCount,
        });
        count++;
      });
      await batch.commit();
      const finishedCount = Object.keys(fetched).length;
      setOk(`✅ ${finishedCount} resultado${finishedCount !== 1 ? "s" : ""} importados · ${count} quiniela${count !== 1 ? "s" : ""} actualizadas`);
    } catch (e) {
      setErr(`❌ ${e.message}`);
    }
    setSyncing(false);
  };

  const groupMatches = MATCHES.filter(m => m.group === activeGroup);
  const finishedCount = Object.keys(results).length;

  return (
    <div className="page">
      <div className="container">

        {/* Hero */}
        <div className="hero">
          <div className="hero-badge">🔧 Panel de Administrador</div>
          <h1 className="hero-title">Resultados<br />Oficiales</h1>
          <p className="hero-sub">Importa automáticamente desde football-data.org</p>
        </div>

        {/* API Key section */}
        <div className="card" style={{marginBottom:"1.5rem"}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: showKeyInput ? "1rem" : 0, flexWrap:"wrap", gap:"0.5rem"}}>
            <div>
              <h3 style={{marginBottom:"0.25rem"}}>⚡ Sync Automático — football-data.org</h3>
              <p style={{color:"var(--text-muted)", fontSize:"0.85rem"}}>
                {apiKey ? `API key guardada: ${apiKey.slice(0,8)}...` : "Sin API key configurada"}
              </p>
            </div>
            <div style={{display:"flex", gap:"0.5rem", flexWrap:"wrap"}}>
              <button
                className="btn btn-outline"
                style={{fontSize:"0.85rem", padding:"0.5rem 1rem"}}
                onClick={() => setShowKeyInput(v => !v)}
              >
                {showKeyInput ? "Ocultar" : "🔑 API Key"}
              </button>
              <button
                id="btn-sync-all"
                className="btn btn-gold"
                onClick={handleSyncAll}
                disabled={syncing || recalculating}
                style={{fontSize:"0.85rem", padding:"0.5rem 1.25rem"}}
              >
                {syncing ? "⏳ Sincronizando..." : "⚡ Sync + Guardar + Recalcular"}
              </button>
            </div>
          </div>

          {showKeyInput && (
            <div style={{display:"flex", gap:"0.5rem", flexWrap:"wrap"}}>
              <input
                id="input-api-key"
                type="text"
                placeholder="Pega tu API key de football-data.org aquí"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  background: "rgba(42,54,80,0.8)",
                  border: "1px solid var(--blue-border)",
                  borderRadius: "8px",
                  color: "var(--text)",
                  padding: "0.6rem 1rem",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                }}
              />
              <button
                className="btn btn-outline"
                style={{fontSize:"0.85rem", padding:"0.5rem 1rem"}}
                onClick={() => { saveApiKey(apiKey); setOk("✅ API key guardada"); setShowKeyInput(false); }}
              >
                Guardar Key
              </button>
            </div>
          )}

          {!apiKey && (
            <div style={{marginTop:"0.75rem", fontSize:"0.82rem", color:"var(--text-muted)"}}>
              👉 Regístrate gratis en{" "}
              <a href="https://www.football-data.org/client/register" target="_blank" rel="noreferrer"
                style={{color:"var(--gold)"}}>
                football-data.org
              </a>
              {" "}y te mandan el API key por correo.
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="stats-row" style={{marginBottom:"1.5rem"}}>
          <div className="stat-card">
            <div className="stat-num">{finishedCount}</div>
            <div className="stat-label">Resultados guardados</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{MATCHES.length - finishedCount}</div>
            <div className="stat-label">Partidos pendientes</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{MATCHES.length}</div>
            <div className="stat-label">Total partidos</div>
          </div>
        </div>

        <div className="admin-notice">
          🔒 Solo el administrador puede ver esta sección. También puedes editar marcadores manualmente abajo.
        </div>

        {/* Group tabs */}
        <div className="tabs">
          {GROUP_KEYS.map(g => {
            const gMatches = MATCHES.filter(m => m.group === g);
            const gFinished = gMatches.filter(m => results[m.id] !== undefined).length;
            return (
              <button
                key={g}
                className={`tab-btn${activeGroup === g ? " active" : ""}`}
                onClick={() => setActiveGroup(g)}
              >
                {g} {gFinished > 0 && <span style={{fontSize:"0.7rem"}}>({gFinished}/{gMatches.length})</span>}
              </button>
            );
          })}
        </div>

        {/* Manual score editing */}
        <div className="card">
          <div className="group-header">
            <div className="group-badge">{activeGroup}</div>
            <h3>Grupo {activeGroup} — Resultados</h3>
          </div>

          {groupMatches.map(match => {
            const { home, away, homeFlag, awayFlag } = getMatchTeams(match);
            const res = results[match.id] || {};
            const dateStr = new Date(match.date).toLocaleDateString("es-MX", {day:"numeric", month:"short"});
            const isFinished = res.homeScore !== undefined;

            return (
              <div key={match.id} className="match-row">
                {isFinished
                  ? <span style={{fontSize:"0.65rem", color:"#4ade80", background:"rgba(74,222,128,0.1)", padding:"0.1rem 0.4rem", borderRadius:"4px", flexShrink:0}}>FIN</span>
                  : <span style={{fontSize:"0.65rem", color:"var(--text-muted)", background:"rgba(42,54,80,0.5)", padding:"0.1rem 0.4rem", borderRadius:"4px", flexShrink:0}}>PEN</span>
                }
                <span className="match-flag">{homeFlag}</span>
                <span className="team-name home">{home}</span>
                <div className="score-inputs">
                  <input
                    type="number" min="0" max="99"
                    className={`score-input${isFinished ? " filled" : ""}`}
                    value={res.homeScore ?? ""}
                    onChange={e => {
                      const v = e.target.value === "" ? undefined : Math.max(0, Math.min(99, parseInt(e.target.value) || 0));
                      setResults(prev => ({ ...prev, [match.id]: { ...prev[match.id], homeScore: v } }));
                    }}
                    placeholder="–"
                  />
                  <span className="score-sep">:</span>
                  <input
                    type="number" min="0" max="99"
                    className={`score-input${isFinished ? " filled" : ""}`}
                    value={res.awayScore ?? ""}
                    onChange={e => {
                      const v = e.target.value === "" ? undefined : Math.max(0, Math.min(99, parseInt(e.target.value) || 0));
                      setResults(prev => ({ ...prev, [match.id]: { ...prev[match.id], awayScore: v } }));
                    }}
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

        {/* Action bar */}
        <div className="save-bar">
          <div style={{
            fontSize:"0.88rem",
            color: statusType === "ok" ? "#4ade80" : statusType === "err" ? "#f87171" : "var(--text-muted)",
            flex: 1,
          }}>
            {status || "Listo para sincronizar"}
          </div>
          <button
            id="btn-save-results"
            className="btn btn-outline"
            onClick={handleSave}
            disabled={saving}
            style={{fontSize:"0.85rem"}}
          >
            {saving ? "Guardando..." : "💾 Guardar Manual"}
          </button>
          <button
            id="btn-recalc"
            className="btn btn-gold"
            onClick={handleRecalc}
            disabled={recalculating}
            style={{fontSize:"0.85rem"}}
          >
            {recalculating ? "Calculando..." : "🔄 Recalcular Puntos"}
          </button>
        </div>
      </div>
    </div>
  );
}
