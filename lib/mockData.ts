export interface Team {
  name: string;
  shortName: string;
  logo: string;
  color: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'finished' | 'scheduled';
  minute?: number;
  league: string;
  date: string;
  time: string;
  venue?: string;
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  country: string;
  logo: string;
}

export const mockTeams: Team[] = [
  // NWSL (USA) 🇺🇸
  { name: "Angel City FC", shortName: "ACFC", logo: "⭐", color: "#FF69B4" },
  { name: "Orlando Pride", shortName: "ORL", logo: "🦁", color: "#633195" },
  { name: "Portland Thorns", shortName: "POR", logo: "🌹", color: "#AB9958" },
  { name: "San Diego Wave", shortName: "SD", logo: "🌊", color: "#1E90FF" },
  { name: "OL Reign", shortName: "REI", logo: "👑", color: "#58B3D9" },
  { name: "North Carolina Courage", shortName: "NC", logo: "💙", color: "#001F5B" },
  { name: "Kansas City Current", shortName: "KC", logo: "⚡", color: "#9FC5E8" },
  { name: "Houston Dash", shortName: "HOU", logo: "🔥", color: "#F47A20" },

  // WSL (England) 🏴󠁧󠁢󠁥󠁮󠁧󠁿
  { name: "Chelsea Women", shortName: "CHE", logo: "💙", color: "#034694" },
  { name: "Arsenal Women", shortName: "ARS", logo: "🔴", color: "#EF0107" },
  { name: "Manchester City Women", shortName: "MCI", logo: "💙", color: "#6CABDD" },
  { name: "Manchester United Women", shortName: "MUN", logo: "👹", color: "#DA020E" },
  { name: "Liverpool Women", shortName: "LIV", logo: "🔴", color: "#C8102E" },

  // Liga F (Spain) 🇪🇸
  { name: "Barcelona Femení", shortName: "BAR", logo: "🔵", color: "#A50044" },
  { name: "Real Madrid Femenino", shortName: "RMA", logo: "👑", color: "#FEDE00" },
  { name: "Atlético Madrid Femenino", shortName: "ATM", logo: "🔴", color: "#CE3524" },
  { name: "Real Sociedad Femenino", shortName: "RSO", logo: "🔵", color: "#004890" },

  // D1 Arkema (France) 🇫🇷
  { name: "Lyon Féminin", shortName: "LYN", logo: "🦁", color: "#DA020E" },
  { name: "Paris Saint-Germain Féminin", shortName: "PSG", logo: "🗼", color: "#004170" },
  { name: "Paris FC Féminin", shortName: "PFC", logo: "💙", color: "#1E3A8A" },

  // Frauen-Bundesliga (Germany) 🇩🇪
  { name: "Bayern München Frauen", shortName: "FCB", logo: "🔴", color: "#DC052D" },
  { name: "VfL Wolfsburg Frauen", shortName: "WOB", logo: "🐺", color: "#65B32E" },
  { name: "Eintracht Frankfurt Frauen", shortName: "SGE", logo: "🦅", color: "#E1000F" },

  // Serie A Femminile (Italy) 🇮🇹
  { name: "Juventus Women", shortName: "JUV", logo: "⚪", color: "#000000" },
  { name: "AS Roma Femminile", shortName: "ROM", logo: "🐺", color: "#FFD700" },
  { name: "AC Milan Femminile", shortName: "MIL", logo: "🔴", color: "#FB090B" },

  // WE League (Japan) 🇯🇵
  { name: "INAC Kobe Leonessa", shortName: "KOB", logo: "🦁", color: "#FF1493" },
  { name: "Urawa Red Diamonds Ladies", shortName: "URD", logo: "🔴", color: "#E60012" },
  { name: "Tokyo Verdy Beleza", shortName: "TOK", logo: "💚", color: "#00A652" },

  // A-League Women (Australia) 🇦🇺
  { name: "Melbourne City FC", shortName: "MLC", logo: "💙", color: "#6CABDD" },
  { name: "Sydney FC", shortName: "SYD", logo: "💙", color: "#0099CC" },
  { name: "Adelaide United", shortName: "ADL", logo: "🔴", color: "#FF0000" },

  // Liga MX Femenil (Mexico) 🇲🇽
  { name: "Club de Fútbol Monterrey Femenil", shortName: "MTY", logo: "🔵", color: "#003DA5" },
  { name: "Club América Femenil", shortName: "AME", logo: "🦅", color: "#FFD700" },
  { name: "Chivas Femenil", shortName: "CHV", logo: "🔴", color: "#E31E24" },

  // Damallsvenskan (Sweden) 🇸🇪
  { name: "FC Rosengård", shortName: "ROS", logo: "🌹", color: "#FF69B4" },
  { name: "BK Häcken", shortName: "HÄC", logo: "💛", color: "#FFD700" },

  // Toppserien (Norway) 🇳🇴
  { name: "LSK Kvinner", shortName: "LSK", logo: "💛", color: "#FFD700" },
  { name: "Rosenborg Kvinner", shortName: "RBK", logo: "⚪", color: "#000000" },

  // Campeonato Brasileiro Feminino (Brazil) 🇧🇷
  { name: "Corinthians Feminino", shortName: "COR", logo: "⚪", color: "#000000" },
  { name: "Palmeiras Feminino", shortName: "PAL", logo: "💚", color: "#006A3B" },
  { name: "Santos Feminino", shortName: "SAN", logo: "⚪", color: "#000000" },

  // Northern Super League (Canada) 🇨🇦
  { name: "Vancouver Rise FC", shortName: "VAN", logo: "https://assets.macaly-user-data.dev/lqya212xf2v8ds14rlaczojb/u9qnvvyfj3ej9xs79f3r1cyo/L9nOYqipoMnmmBf_yutG8/tmp7iowumem.jpg", color: "#004225" },
  { name: "Calgary Wild FC", shortName: "CGY", logo: "https://assets.macaly-user-data.dev/lqya212xf2v8ds14rlaczojb/u9qnvvyfj3ej9xs79f3r1cyo/WfH4kCBEdjh1jo8pAsYQC/tmpvwvawgjz.jpg", color: "#C41E3A" },
  { name: "AFC Toronto", shortName: "TOR", logo: "https://assets.macaly-user-data.dev/lqya212xf2v8ds14rlaczojb/u9qnvvyfj3ej9xs79f3r1cyo/bgyoLtLICBF_3LnwiHpRW/tmp0b5ksj0l.jpg", color: "#FF0000" },
  { name: "Ottawa Rapid FC", shortName: "OTT", logo: "https://assets.macaly-user-data.dev/lqya212xf2v8ds14rlaczojb/u9qnvvyfj3ej9xs79f3r1cyo/e4mYerxMPwMaKb8lpORUj/tmpbsv21zd8.jpg", color: "#000000" },
  { name: "Montreal Roses FC", shortName: "MTL", logo: "https://assets.macaly-user-data.dev/lqya212xf2v8ds14rlaczojb/u9qnvvyfj3ej9xs79f3r1cyo/mHXTKYHBYwYQuqF-YDSZh/tmp4y7ncerh.jpg", color: "#1E3A8A" },
  { name: "Halifax Tides FC", shortName: "HAL", logo: "https://assets.macaly-user-data.dev/lqya212xf2v8ds14rlaczojb/u9qnvvyfj3ej9xs79f3r1cyo/ygqYIdZ4d4UhbQ84QpXsD/tmp0mx6zol5.jpg", color: "#0EA5E9" },

  // Chinese Women's Super League 🇨🇳
  { name: "Shanghai Shengli", shortName: "SHA", logo: "🐲", color: "#FF0000" },
  { name: "Jiangsu Suning", shortName: "JIA", logo: "💛", color: "#FFD700" },
];

export const mockLeagues: League[] = [
  // North America
  { id: "nwsl", name: "National Women's Soccer League", shortName: "NWSL", country: "USA", logo: "🇺🇸" },
  { id: "nsl", name: "Northern Super League", shortName: "NSL", country: "Canada", logo: "🇨🇦" },
  { id: "liga-mx-fem", name: "Liga MX Femenil", shortName: "Liga MX", country: "Mexico", logo: "🇲🇽" },

  // Europe - Top Tier
  { id: "wsl", name: "Barclays Women's Super League", shortName: "WSL", country: "England", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "d1-arkema", name: "Première Ligue / D1 Arkema", shortName: "D1", country: "France", logo: "🇫🇷" },
  { id: "liga-f", name: "Liga F", shortName: "Liga F", country: "Spain", logo: "🇪🇸" },
  { id: "frauen-bundesliga", name: "Google Pixel Frauen-Bundesliga", shortName: "Bundesliga", country: "Germany", logo: "🇩🇪" },
  { id: "serie-a-fem", name: "Serie A Femminile", shortName: "Serie A", country: "Italy", logo: "🇮🇹" },
  
  // Europe - Other Professional Leagues
  { id: "damallsvenskan", name: "Damallsvenskan", shortName: "Damallsvenskan", country: "Sweden", logo: "🇸🇪" },
  { id: "toppserien", name: "Toppserien", shortName: "Toppserien", country: "Norway", logo: "🇳🇴" },
  { id: "oefb-frauenliga", name: "ÖFB Frauenliga", shortName: "Austria", country: "Austria", logo: "🇦🇹" },
  { id: "liga-bpi-fem", name: "Liga BPI Feminina", shortName: "Portugal", country: "Portugal", logo: "🇵🇹" },
  { id: "czech-women", name: "Czech Women's First League", shortName: "Czech Rep", country: "Czech Republic", logo: "🇨🇿" },
  { id: "ukraine-women", name: "Ukrainian Women's League", shortName: "Ukraine", country: "Ukraine", logo: "🇺🇦" },

  // Asia & Oceania
  { id: "we-league", name: "WE League", shortName: "WE League", country: "Japan", logo: "🇯🇵" },
  { id: "a-league-women", name: "A-League Women", shortName: "A-League W", country: "Australia", logo: "🇦🇺" },
  { id: "chinese-wsl", name: "Chinese Women's Super League", shortName: "China WSL", country: "China", logo: "🇨🇳" },
  { id: "indian-women", name: "Indian Women's League", shortName: "IWL", country: "India", logo: "🇮🇳" },
  { id: "liga-1-putri", name: "Liga 1 Putri", shortName: "Indonesia", country: "Indonesia", logo: "🇮🇩" },
  { id: "kowsar-league", name: "Kowsar Women Football League", shortName: "Iran", country: "Iran", logo: "🇮🇷" },

  // Latin America
  { id: "brasileiro-fem", name: "Campeonato Brasileiro de Futebol Feminino", shortName: "Brasileirão", country: "Brazil", logo: "🇧🇷" },
  { id: "argentina-fem", name: "Campeonato de Fútbol Femenino", shortName: "Argentina", country: "Argentina", logo: "🇦🇷" },

  // UEFA Women's Champions League
  { id: "uwcl", name: "UEFA Women's Champions League", shortName: "UWCL", country: "Europe", logo: "🏆" },
];

export const mockMatches: Match[] = [
  // Recent finished matches - no live matches today
  {
    id: "finished-1",
    homeTeam: mockTeams[2], // Portland Thorns
    awayTeam: mockTeams[3], // San Diego Wave
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    league: "NWSL",
    date: "2025-09-01",
    time: "22:00",
    venue: "Providence Park"
  },
  {
    id: "finished-2",
    homeTeam: mockTeams[10], // Manchester City Women
    awayTeam: mockTeams[19], // Paris FC Féminin
    homeScore: 1,
    awayScore: 2,
    status: 'finished',
    league: "WSL",
    date: "2025-09-02",
    time: "20:00",
    venue: "Etihad Stadium"
  },
  {
    id: "finished-3",
    homeTeam: mockTeams[29], // Melbourne City FC
    awayTeam: mockTeams[30], // Sydney FC
    homeScore: 3,
    awayScore: 1,
    status: 'finished',
    league: "A-League Women",
    date: "2025-09-01",
    time: "12:00",
    venue: "Casey Fields"
  },
  {
    id: "scheduled-1",
    homeTeam: mockTeams[1], // Orlando Pride
    awayTeam: mockTeams[33], // Club América Femenil
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "Concacaf W Champions Cup",
    date: "2025-09-05",
    time: "22:30",
    venue: "Estadio Azteca"
  },
  {
    id: "scheduled-2",
    homeTeam: mockTeams[34], // Chivas Femenil
    awayTeam: mockTeams[0], // Angel City FC
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "Concacaf W Champions Cup",
    date: "2025-09-06",
    time: "20:00",
    venue: "Estadio Akron"
  },
  {
    id: "scheduled-3",
    homeTeam: mockTeams[32], // Club de Fútbol Monterrey Femenil
    awayTeam: mockTeams[2], // Portland Thorns
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "Concacaf W Champions Cup",
    date: "2025-09-07",
    time: "21:15",
    venue: "Estadio BBVA"
  },
  {
    id: "scheduled-4",
    homeTeam: mockTeams[6], // Kansas City Current
    awayTeam: mockTeams[42], // Vancouver Rise FC
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "Concacaf W Champions Cup",
    date: "2025-09-08",
    time: "19:30",
    venue: "CPKC Stadium"
  },

  // 🇺🇸 NWSL - USA's Premier League
  {
    id: "nwsl-1",
    homeTeam: mockTeams[0], // Angel City FC
    awayTeam: mockTeams[1], // Orlando Pride
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    league: "NWSL",
    date: "2025-08-12",
    time: "19:30",
    venue: "BMO Stadium"
  },
  {
    id: "nwsl-2",
    homeTeam: mockTeams[6], // Kansas City Current
    awayTeam: mockTeams[7], // Houston Dash
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "NWSL",
    date: "2025-08-14",
    time: "20:00",
    venue: "CPKC Stadium"
  },
  {
    id: "nwsl-3",
    homeTeam: mockTeams[4], // OL Reign
    awayTeam: mockTeams[5], // North Carolina Courage
    homeScore: 1,
    awayScore: 3,
    status: 'finished',
    league: "NWSL",
    date: "2025-08-11",
    time: "17:00",
    venue: "Lumen Field"
  },

  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 WSL - England's Elite
  {
    id: "wsl-1",
    homeTeam: mockTeams[8], // Chelsea Women
    awayTeam: mockTeams[9], // Arsenal Women
    homeScore: 4,
    awayScore: 1,
    status: 'finished',
    league: "WSL",
    date: "2025-08-12",
    time: "14:30",
    venue: "Stamford Bridge"
  },
  {
    id: "wsl-2",
    homeTeam: mockTeams[11], // Manchester United Women
    awayTeam: mockTeams[12], // Liverpool Women
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "WSL",
    date: "2025-08-15",
    time: "16:00",
    venue: "Leigh Sports Village"
  },

  // 🇪🇸 Liga F - Spanish Excellence
  {
    id: "liga-f-1",
    homeTeam: mockTeams[13], // Barcelona Femení
    awayTeam: mockTeams[14], // Real Madrid Femenino
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "Liga F",
    date: "2025-08-16",
    time: "18:00",
    venue: "Estadi Johan Cruyff"
  },
  {
    id: "liga-f-2",
    homeTeam: mockTeams[15], // Atlético Madrid Femenino
    awayTeam: mockTeams[16], // Real Sociedad Femenino
    homeScore: 2,
    awayScore: 0,
    status: 'finished',
    league: "Liga F",
    date: "2025-08-11",
    time: "17:00",
    venue: "Centro Deportivo Wanda Alcalá de Henares"
  },

  // 🇫🇷 D1 Arkema - French Powerhouse
  {
    id: "d1-1",
    homeTeam: mockTeams[17], // Lyon Féminin
    awayTeam: mockTeams[18], // Paris Saint-Germain Féminin
    homeScore: 1,
    awayScore: 1,
    status: 'finished',
    league: "D1 Arkema",
    date: "2025-08-10",
    time: "15:00",
    venue: "Groupama Stadium"
  },

  // 🇩🇪 Frauen-Bundesliga - German Precision
  {
    id: "bundesliga-1",
    homeTeam: mockTeams[21], // Bayern München Frauen
    awayTeam: mockTeams[22], // VfL Wolfsburg Frauen
    homeScore: 3,
    awayScore: 2,
    status: 'finished',
    league: "Frauen-Bundesliga",
    date: "2025-08-12",
    time: "14:00",
    venue: "FC Bayern Campus"
  },

  // 🇮🇹 Serie A Femminile - Italian Passion
  {
    id: "serie-a-1",
    homeTeam: mockTeams[24], // Juventus Women
    awayTeam: mockTeams[25], // AS Roma Femminile
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "Serie A Femminile",
    date: "2025-08-17",
    time: "15:00",
    venue: "Allianz Stadium"
  },

  // 🇯🇵 WE League - Japanese Innovation
  {
    id: "we-1",
    homeTeam: mockTeams[28], // Tokyo Verdy Beleza (corrected index)
    awayTeam: mockTeams[26], // INAC Kobe Leonessa (corrected index)
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "WE League",
    date: "2025-08-14",
    time: "14:00",
    venue: "Ajinomoto Stadium"
  },

  // 🇦🇺 A-League Women - Australian Spirit
  {
    id: "a-league-1",
    homeTeam: mockTeams[29], // Melbourne City FC (corrected index)
    awayTeam: mockTeams[30], // Sydney FC (corrected index)
    homeScore: 1,
    awayScore: 0,
    status: 'finished',
    league: "A-League Women",
    date: "2025-08-11",
    time: "16:00",
    venue: "Casey Fields"
  },

  // 🇲🇽 Liga MX Femenil - Mexican Flair
  {
    id: "liga-mx-1",
    homeTeam: mockTeams[32], // Club de Fútbol Monterrey Femenil (corrected index)
    awayTeam: mockTeams[33], // Club América Femenil (corrected index)
    homeScore: 2,
    awayScore: 2,
    status: 'finished',
    league: "Liga MX Femenil",
    date: "2025-08-12",
    time: "19:00",
    venue: "Estadio BBVA"
  },

  // 🇸🇪 Damallsvenskan - Swedish Excellence
  {
    id: "damall-1",
    homeTeam: mockTeams[35], // FC Rosengård (corrected index)
    awayTeam: mockTeams[36], // BK Häcken (corrected index)
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "Damallsvenskan",
    date: "2025-08-15",
    time: "15:00",
    venue: "Malmö IP"
  },

  // 🇳🇴 Toppserien - Norwegian Power
  {
    id: "topp-1",
    homeTeam: mockTeams[37], // LSK Kvinner (corrected index)
    awayTeam: mockTeams[38], // Rosenborg Kvinner (corrected index)
    homeScore: 1,
    awayScore: 2,
    status: 'finished',
    league: "Toppserien",
    date: "2025-08-11",
    time: "16:00",
    venue: "Åråsen Stadion"
  },

  // 🇧🇷 Campeonato Brasileiro Feminino (Brazil) 🇧🇷
  {
    id: "brasil-1",
    homeTeam: mockTeams[39], // Corinthians Feminino (corrected index)
    awayTeam: mockTeams[40], // Palmeiras Feminino (corrected index)
    homeScore: 3,
    awayScore: 1,
    status: 'finished',
    league: "Brasileirão",
    date: "2025-08-10",
    time: "15:00",
    venue: "Neo Química Arena"
  },

  // 🇨🇳 Chinese WSL - Asian Expansion
  {
    id: "china-1",
    homeTeam: mockTeams[48], // Shanghai Shengli (corrected index)
    awayTeam: mockTeams[49], // Jiangsu Suning (corrected index)
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "Chinese WSL",
    date: "2025-08-16",
    time: "16:00",
    venue: "Shanghai Stadium"
  },

  // 🇨🇦 NSL - Canada's Rising Stars
  {
    id: "nsl-1",
    homeTeam: mockTeams[42], // Vancouver Rise FC (corrected index)
    awayTeam: mockTeams[43], // Calgary Wild FC (corrected index)
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    league: "NSL",
    date: "2025-08-12",
    time: "19:00",
    venue: "BC Place"
  },
  {
    id: "nsl-2",
    homeTeam: mockTeams[44], // AFC Toronto (corrected index)
    awayTeam: mockTeams[45], // Ottawa Rapid FC (corrected index)
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    league: "NSL",
    date: "2025-08-15",
    time: "20:00",
    venue: "BMO Field"
  }
];

export const getMatches = (status?: 'live' | 'finished' | 'scheduled') => {
  console.log('Getting matches with status:', status);
  if (status) {
    return mockMatches.filter(match => match.status === status);
  }
  return mockMatches;
};

export const getLiveMatches = () => {
  console.log('Getting live matches');
  return mockMatches.filter(match => match.status === 'live');
};

export const getMatchesByLeague = (league: string) => {
  console.log('Getting matches for league:', league);
  return mockMatches.filter(match => match.league === league);
};






