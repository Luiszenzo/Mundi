// ─────────────────────────────────────────────────────────────
// football-data.org API service
// Free tier: 10 requests/minute, register at football-data.org
// ─────────────────────────────────────────────────────────────

// Map from team names in football-data.org → our internal team names
// The API returns English names, we store Spanish names
const TEAM_NAME_MAP = {
  // Group A
  "Mexico":           "México",
  "South Africa":     "Sudáfrica",
  "Korea Republic":   "Corea del Sur",
  "Czechia":          "Chequia",
  "Czech Republic":   "Chequia",

  // Group B
  "Canada":           "Canadá",
  "Bosnia and Herzegovina": "Bosnia y Herzegovina",
  "Qatar":            "Catar",
  "Switzerland":      "Suiza",

  // Group C
  "Brazil":           "Brasil",
  "Morocco":          "Marruecos",
  "Haiti":            "Haití",
  "Scotland":         "Escocia",

  // Group D
  "United States":    "EUA",
  "USA":              "EUA",
  "Paraguay":         "Paraguay",
  "Australia":        "Australia",
  "Türkiye":          "Türkiye",
  "Turkey":           "Türkiye",

  // Group E
  "Germany":          "Alemania",
  "Curaçao":          "Curazao",
  "Curaçao (Netherlands Antilles)": "Curazao",
  "Ivory Coast":      "Costa de Marfil",
  "Côte d'Ivoire":    "Costa de Marfil",
  "Ecuador":          "Ecuador",

  // Group F
  "Netherlands":      "Países Bajos",
  "Japan":            "Japón",
  "Azerbaijan":       "Azerbaiyán",
  "Sweden":           "Suecia",
  "Tunisia":          "Túnez",

  // Group G
  "Belgium":          "Bélgica",
  "Egypt":            "Egipto",
  "Iran":             "Irán",
  "New Zealand":      "Nueva Zelanda",

  // Group H
  "Spain":            "España",
  "Cape Verde":       "Cabo Verde",
  "Saudi Arabia":     "Arabia Saudita",
  "Uruguay":          "Uruguay",

  // Group I
  "France":           "Francia",
  "Senegal":          "Senegal",
  "Venezuela":        "Venezuela",
  "Iraq":             "Irak",
  "Norway":           "Noruega",

  // Group J
  "Argentina":        "Argentina",
  "Algeria":          "Argelia",
  "Austria":          "Austria",
  "Jordan":           "Jordania",

  // Group K
  "Portugal":         "Portugal",
  "Indonesia":        "Indonesia",
  "Congo":            "República del Congo",
  "Congo DR":         "República del Congo",
  "Congo Republic":   "República del Congo",
  "Republic of the Congo": "República del Congo",
  "Democratic Republic of the Congo": "República del Congo",
  "DR Congo":         "República del Congo",
  "Uzbekistan":       "Uzbekistán",
  "Colombia":         "Colombia",

  // Group L
  "England":          "Inglaterra",
  "Croatia":          "Croacia",
  "Ghana":            "Ghana",
  "Panama":           "Panamá",
};

function normalizeTeam(name) {
  return TEAM_NAME_MAP[name] || name;
}

// Build a lookup: "HomeTeam vs AwayTeam" → our match ID
// We import MATCHES and GROUPS from matches.js at call time
export function buildMatchLookup(MATCHES, GROUPS) {
  const lookup = {};
  for (const match of MATCHES) {
    const group = GROUPS[match.group];
    const home = group.teams[match.home];
    const away = group.teams[match.away];
    lookup[`${home}||${away}`] = match.id;
  }
  return lookup;
}

/**
 * Fetches all World Cup 2026 group-stage results from football-data.org
 * Returns an object: { [matchId]: { homeScore, awayScore } }
 * Only includes matches that are FINISHED.
 *
 * In dev: uses Vite proxy (/api/fd) to avoid CORS issues on localhost.
 * In production: calls the API directly (CORS allowed on real domains).
 */
export async function fetchWorldCupResults(apiKey, MATCHES, GROUPS) {
  const endpoint = "competitions/WC/matches?stage=GROUP_STAGE";

  let url;
  let options = {};

  if (import.meta.env.DEV) {
    url = `/api/fd/${endpoint}`;
    options = {
      headers: {
        "X-Auth-Token": apiKey,
      },
    };
  } else {
    // In production, use corsproxy.io with query parameters to pass the header
    // This makes it a simple GET request without custom headers, completely avoiding preflight OPTIONS requests!
    const targetUrl = `https://api.football-data.org/v4/${endpoint}`;
    url = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}&reqHeaders=X-Auth-Token:${encodeURIComponent(apiKey)}`;
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    if (res.status === 403) throw new Error("API key inválida o sin permisos para el Mundial.");
    if (res.status === 429) throw new Error("Demasiadas solicitudes. Espera un minuto.");
    throw new Error(`Error de API: ${res.status}`);
  }

  const data = await res.json();
  const lookup = buildMatchLookup(MATCHES, GROUPS);
  const results = {};

  for (const match of data.matches) {
    if (match.status !== "FINISHED") continue;

    const homeTeam = normalizeTeam(match.homeTeam.name);
    const awayTeam = normalizeTeam(match.awayTeam.name);

    const matchId =
      lookup[`${homeTeam}||${awayTeam}`] ||
      lookup[`${awayTeam}||${homeTeam}`];

    if (!matchId) continue;

    const score = match.score?.fullTime;
    if (score?.home == null || score?.away == null) continue;

    results[matchId] = {
      homeScore: score.home,
      awayScore: score.away,
    };
  }

  return results;
}
