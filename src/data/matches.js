// World Cup 2026 Official Group Stage Matches
// Format: { id, group, home, away, date, time, venue }
// Emoji flags for visual flair

export const GROUPS = {
  A: { teams: ["México", "Sudáfrica", "Corea del Sur", "Chequia"], flag: ["🇲🇽", "🇿🇦", "🇰🇷", "🇨🇿"] },
  B: { teams: ["Canadá", "Bosnia y Herzegovina", "Catar", "Suiza"], flag: ["🇨🇦", "🇧🇦", "🇶🇦", "🇨🇭"] },
  C: { teams: ["Brasil", "Marruecos", "Haití", "Escocia"], flag: ["🇧🇷", "🇲🇦", "🇭🇹", "🏴󠁧󠁢󠁳󠁣󠁴󠁿"] },
  D: { teams: ["EUA", "Paraguay", "Australia", "Türkiye"], flag: ["🇺🇸", "🇵🇾", "🇦🇺", "🇹🇷"] },
  E: { teams: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"], flag: ["🇩🇪", "🇨🇼", "🇨🇮", "🇪🇨"] },
  F: { teams: ["Países Bajos", "Japón", "Azerbaiyán", "Túnez"], flag: ["🇳🇱", "🇯🇵", "🇦🇿", "🇹🇳"] },
  G: { teams: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"], flag: ["🇧🇪", "🇪🇬", "🇮🇷", "🇳🇿"] },
  H: { teams: ["España", "Cabo Verde", "Arabia Saudita", "Uruguay"], flag: ["🇪🇸", "🇨🇻", "🇸🇦", "🇺🇾"] },
  I: { teams: ["Francia", "Senegal", "Venezuela", "Noruega"], flag: ["🇫🇷", "🇸🇳", "🇻🇪", "🇳🇴"] },
  J: { teams: ["Argentina", "Argelia", "Austria", "Jordania"], flag: ["🇦🇷", "🇩🇿", "🇦🇹", "🇯🇴"] },
  K: { teams: ["Portugal", "Indonesia", "Uzbekistán", "Colombia"], flag: ["🇵🇹", "🇮🇩", "🇺🇿", "🇨🇴"] },
  L: { teams: ["Inglaterra", "Croacia", "Ghana", "Panamá"], flag: ["🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🇭🇷", "🇬🇭", "🇵🇦"] },
};

// Generate matches for each group (each team plays the other 3 once)
// 3 matchdays per group
export const MATCHES = [
  // ── GROUP A ──
  { id: "A1", group: "A", home: 0, away: 1, matchday: 1, date: "2026-06-11", time: "17:00" },
  { id: "A2", group: "A", home: 2, away: 3, matchday: 1, date: "2026-06-11", time: "20:00" },
  { id: "A3", group: "A", home: 0, away: 2, matchday: 2, date: "2026-06-15", time: "17:00" },
  { id: "A4", group: "A", home: 1, away: 3, matchday: 2, date: "2026-06-15", time: "20:00" },
  { id: "A5", group: "A", home: 0, away: 3, matchday: 3, date: "2026-06-19", time: "16:00" },
  { id: "A6", group: "A", home: 1, away: 2, matchday: 3, date: "2026-06-19", time: "16:00" },

  // ── GROUP B ──
  { id: "B1", group: "B", home: 0, away: 1, matchday: 1, date: "2026-06-12", time: "14:00" },
  { id: "B2", group: "B", home: 2, away: 3, matchday: 1, date: "2026-06-12", time: "20:00" },
  { id: "B3", group: "B", home: 0, away: 2, matchday: 2, date: "2026-06-16", time: "14:00" },
  { id: "B4", group: "B", home: 1, away: 3, matchday: 2, date: "2026-06-16", time: "17:00" },
  { id: "B5", group: "B", home: 0, away: 3, matchday: 3, date: "2026-06-20", time: "16:00" },
  { id: "B6", group: "B", home: 1, away: 2, matchday: 3, date: "2026-06-20", time: "16:00" },

  // ── GROUP C ──
  { id: "C1", group: "C", home: 0, away: 1, matchday: 1, date: "2026-06-12", time: "11:00" },
  { id: "C2", group: "C", home: 2, away: 3, matchday: 1, date: "2026-06-12", time: "17:00" },
  { id: "C3", group: "C", home: 0, away: 2, matchday: 2, date: "2026-06-16", time: "20:00" },
  { id: "C4", group: "C", home: 1, away: 3, matchday: 2, date: "2026-06-17", time: "11:00" },
  { id: "C5", group: "C", home: 0, away: 3, matchday: 3, date: "2026-06-21", time: "16:00" },
  { id: "C6", group: "C", home: 1, away: 2, matchday: 3, date: "2026-06-21", time: "16:00" },

  // ── GROUP D ──
  { id: "D1", group: "D", home: 0, away: 1, matchday: 1, date: "2026-06-13", time: "17:00" },
  { id: "D2", group: "D", home: 2, away: 3, matchday: 1, date: "2026-06-13", time: "20:00" },
  { id: "D3", group: "D", home: 0, away: 2, matchday: 2, date: "2026-06-17", time: "14:00" },
  { id: "D4", group: "D", home: 1, away: 3, matchday: 2, date: "2026-06-17", time: "17:00" },
  { id: "D5", group: "D", home: 0, away: 3, matchday: 3, date: "2026-06-22", time: "16:00" },
  { id: "D6", group: "D", home: 1, away: 2, matchday: 3, date: "2026-06-22", time: "16:00" },

  // ── GROUP E ──
  { id: "E1", group: "E", home: 0, away: 1, matchday: 1, date: "2026-06-13", time: "11:00" },
  { id: "E2", group: "E", home: 2, away: 3, matchday: 1, date: "2026-06-13", time: "14:00" },
  { id: "E3", group: "E", home: 0, away: 2, matchday: 2, date: "2026-06-17", time: "20:00" },
  { id: "E4", group: "E", home: 1, away: 3, matchday: 2, date: "2026-06-18", time: "11:00" },
  { id: "E5", group: "E", home: 0, away: 3, matchday: 3, date: "2026-06-22", time: "16:00" },
  { id: "E6", group: "E", home: 1, away: 2, matchday: 3, date: "2026-06-22", time: "16:00" },

  // ── GROUP F ──
  { id: "F1", group: "F", home: 0, away: 1, matchday: 1, date: "2026-06-14", time: "11:00" },
  { id: "F2", group: "F", home: 2, away: 3, matchday: 1, date: "2026-06-14", time: "14:00" },
  { id: "F3", group: "F", home: 0, away: 2, matchday: 2, date: "2026-06-18", time: "14:00" },
  { id: "F4", group: "F", home: 1, away: 3, matchday: 2, date: "2026-06-18", time: "17:00" },
  { id: "F5", group: "F", home: 0, away: 3, matchday: 3, date: "2026-06-23", time: "16:00" },
  { id: "F6", group: "F", home: 1, away: 2, matchday: 3, date: "2026-06-23", time: "16:00" },

  // ── GROUP G ──
  { id: "G1", group: "G", home: 0, away: 1, matchday: 1, date: "2026-06-14", time: "17:00" },
  { id: "G2", group: "G", home: 2, away: 3, matchday: 1, date: "2026-06-14", time: "20:00" },
  { id: "G3", group: "G", home: 0, away: 2, matchday: 2, date: "2026-06-18", time: "20:00" },
  { id: "G4", group: "G", home: 1, away: 3, matchday: 2, date: "2026-06-19", time: "11:00" },
  { id: "G5", group: "G", home: 0, away: 3, matchday: 3, date: "2026-06-23", time: "16:00" },
  { id: "G6", group: "G", home: 1, away: 2, matchday: 3, date: "2026-06-23", time: "16:00" },

  // ── GROUP H ──
  { id: "H1", group: "H", home: 0, away: 1, matchday: 1, date: "2026-06-15", time: "11:00" },
  { id: "H2", group: "H", home: 2, away: 3, matchday: 1, date: "2026-06-15", time: "14:00" },
  { id: "H3", group: "H", home: 0, away: 2, matchday: 2, date: "2026-06-19", time: "14:00" },
  { id: "H4", group: "H", home: 1, away: 3, matchday: 2, date: "2026-06-19", time: "17:00" },
  { id: "H5", group: "H", home: 0, away: 3, matchday: 3, date: "2026-06-24", time: "16:00" },
  { id: "H6", group: "H", home: 1, away: 2, matchday: 3, date: "2026-06-24", time: "16:00" },

  // ── GROUP I ──
  { id: "I1", group: "I", home: 0, away: 1, matchday: 1, date: "2026-06-15", time: "17:00" },
  { id: "I2", group: "I", home: 2, away: 3, matchday: 1, date: "2026-06-15", time: "20:00" },
  { id: "I3", group: "I", home: 0, away: 2, matchday: 2, date: "2026-06-20", time: "11:00" },
  { id: "I4", group: "I", home: 1, away: 3, matchday: 2, date: "2026-06-20", time: "14:00" },
  { id: "I5", group: "I", home: 0, away: 3, matchday: 3, date: "2026-06-25", time: "16:00" },
  { id: "I6", group: "I", home: 1, away: 2, matchday: 3, date: "2026-06-25", time: "16:00" },

  // ── GROUP J ──
  { id: "J1", group: "J", home: 0, away: 1, matchday: 1, date: "2026-06-16", time: "11:00" },
  { id: "J2", group: "J", home: 2, away: 3, matchday: 1, date: "2026-06-16", time: "14:00" },
  { id: "J3", group: "J", home: 0, away: 2, matchday: 2, date: "2026-06-20", time: "17:00" },
  { id: "J4", group: "J", home: 1, away: 3, matchday: 2, date: "2026-06-20", time: "20:00" },
  { id: "J5", group: "J", home: 0, away: 3, matchday: 3, date: "2026-06-25", time: "16:00" },
  { id: "J6", group: "J", home: 1, away: 2, matchday: 3, date: "2026-06-25", time: "16:00" },

  // ── GROUP K ──
  { id: "K1", group: "K", home: 0, away: 1, matchday: 1, date: "2026-06-16", time: "17:00" },
  { id: "K2", group: "K", home: 2, away: 3, matchday: 1, date: "2026-06-16", time: "20:00" },
  { id: "K3", group: "K", home: 0, away: 2, matchday: 2, date: "2026-06-21", time: "11:00" },
  { id: "K4", group: "K", home: 1, away: 3, matchday: 2, date: "2026-06-21", time: "14:00" },
  { id: "K5", group: "K", home: 0, away: 3, matchday: 3, date: "2026-06-26", time: "16:00" },
  { id: "K6", group: "K", home: 1, away: 2, matchday: 3, date: "2026-06-26", time: "16:00" },

  // ── GROUP L ──
  { id: "L1", group: "L", home: 0, away: 1, matchday: 1, date: "2026-06-17", time: "14:00" },
  { id: "L2", group: "L", home: 2, away: 3, matchday: 1, date: "2026-06-17", time: "20:00" },
  { id: "L3", group: "L", home: 0, away: 2, matchday: 2, date: "2026-06-21", time: "17:00" },
  { id: "L4", group: "L", home: 1, away: 3, matchday: 2, date: "2026-06-21", time: "20:00" },
  { id: "L5", group: "L", home: 0, away: 3, matchday: 3, date: "2026-06-26", time: "16:00" },
  { id: "L6", group: "L", home: 1, away: 2, matchday: 3, date: "2026-06-26", time: "16:00" },
];

export const DEADLINE = new Date("2026-06-17T23:59:59-06:00"); // June 17 deadline

export function getMatchTeams(match) {
  const group = GROUPS[match.group];
  return {
    home: group.teams[match.home],
    away: group.teams[match.away],
    homeFlag: group.flag[match.home],
    awayFlag: group.flag[match.away],
  };
}

export function calcPoints(predictions, results) {
  let pts = 0;
  for (const matchId in results) {
    const pred = predictions[matchId];
    const real = results[matchId];
    if (!pred || real.homeScore === null) continue;
    if (pred.homeScore === real.homeScore && pred.awayScore === real.awayScore) {
      pts += 3; // exact
    } else {
      const predWinner = Math.sign(pred.homeScore - pred.awayScore);
      const realWinner = Math.sign(real.homeScore - real.awayScore);
      if (predWinner === realWinner) pts += 1; // correct result (W/D/L)
    }
  }
  return pts;
}
