

































// Sports Data API Integration using TheSportsDB.com Premium
// 🚀 PREMIUM ACCESS with real-time live scores!

const BASE_URL_V1 = 'https://www.thesportsdb.com/api/v1/json';
const BASE_URL_V2 = 'https://www.thesportsdb.com/api/v2/json';

// Simple in-memory cache and request throttle to avoid 429s
const __memoryCache = new Map<string, { data: any; expires: number }>();
let __activeRequests = 0;
const __queue: Array<() => void> = [];
const __MAX_CONCURRENT = 2; // REDUCED from 5 to 2 for better rate limiting
const __DEFAULT_TTL_MS = 120_000; // INCREASED from 30s to 2 minutes
const __MAX_RETRIES = 2; // REDUCED from 3 to 2

function __sleep(ms: number) { return new Promise((res) => setTimeout(res, ms)); }
function __getTTLForEndpoint(endpoint: string): number {
  if (/livescore|inplay|live/i.test(endpoint)) return 30_000; // 30s for live data
  if (/eventsday\.php/i.test(endpoint)) return 300_000; // 5 minutes for day results
  if (/eventspastleague\.php|eventsnextleague\.php/i.test(endpoint)) return 600_000; // 10 minutes
  if (/lookuptable\.php/i.test(endpoint)) return 900_000; // 15 minutes
  if (/search_all_seasons\.php/i.test(endpoint)) return 86_400_000; // 24 hours
  return __DEFAULT_TTL_MS;
}
async function __acquire() {
  if (__activeRequests < __MAX_CONCURRENT) {
    __activeRequests++;
    return;
  }
  await new Promise<void>((resolve) => __queue.push(resolve));
  __activeRequests++;
}
function __release() {
  __activeRequests = Math.max(0, __activeRequests - 1);
  const next = __queue.shift();
  if (next) next();
}

// Major Women's Soccer League IDs
const WOMENS_LEAGUES = {
  // North America
  NWSL: 4521,           // National Women's Soccer League (USA)
  USL_SUPER_LEAGUE: 5498, // USL Super League (USA) - Confirmed ID
  LIGA_MX_FEMENIL: 5206, // Liga MX Femenil (Mexico)
  NSL: 5602,            // Northern Super League (Canada) - Corrected ID
  LEAGUE1_CANADA: 5221, // League1 Canada Women - ID to be confirmed
  TST_WOMEN: 5222,      // TST Women - ID to be confirmed
  
  // Europe
  WSL: 4849,            // FA Women's Super League (England)
  FRAUEN_BUNDESLIGA: 5204, // Frauen-Bundesliga (Germany)
  D1_ARKEMA: 5010,      // Division 1 Féminine (France)
  SERIE_A_FEM: 5205,    // Serie A Women (Italy)
  LIGA_F: 5013,         // Liga F (Spain)
  EREDIVISIE_WOMEN: 5207, // Eredivisie Women (Netherlands)
  SWPL: 5223,           // Scottish Women's Premier League - ID to be confirmed
  DAMALLSVENSKAN: 5014, // Damallsvenskan (Sweden)
  TOPPSERIEN: 5015,     // Toppserien Women (Norway)
  NIFL_WOMEN: 5224,     // NIFL Women's Premiership (Northern Ireland) - ID to be confirmed
  
  // Asia & Oceania
  WE_LEAGUE: 5016,      // WE League (Japan)
  WK_LEAGUE: 5225,      // WK League (South Korea) - ID to be confirmed
  A_LEAGUE_WOMEN: 4805, // A-League Women (Australia)
  INDIAN_WOMEN: 5226,   // Indian Women's League - ID to be confirmed
  
  // South America
  BRASILEIRAO: 5201,    // Brasileirão Feminino A1 (Brazil)
  PRIMERA_ARG_WOMEN: 5227, // Primera División A Women (Argentina) - ID to be confirmed
  
  // Africa
  SAFA_WOMEN: 5228,     // SAFA Women's League/Hollywoodbets Super League (South Africa) - ID to be confirmed
  
  // International Club Competitions
  UEFA_WOMENS_CHAMPIONS_LEAGUE: 5208, // UEFA Women's Champions League
  COPA_LIBERTADORES_FEM: 5213,     // Copa Libertadores Femenina
  CAF_WOMENS_CHAMPIONS_LEAGUE: 5210,  // CAF Women's Champions League
  AFC_WOMENS_CLUB: 5229,  // AFC Women's Club Championship - ID to be confirmed
  
  // International Tournaments
  FIFA_WOMENS_WORLD_CUP: 5230, // FIFA Women's World Cup - ID to be confirmed
  OLYMPIC_WOMEN: 5231,  // Olympic Games - Women - ID to be confirmed
  UEFA_WOMENS_EURO: 5232, // UEFA Women's Championship - ID to be confirmed
  AFC_WOMENS_ASIAN_CUP: 5233, // AFC Women's Asian Cup - ID to be confirmed
  COPA_AMERICA_FEM: 5234, // Copa América Femenina - ID to be confirmed
  CONCACAF_W_GOLD_CUP: 5235, // CONCACAF W Gold Cup - ID to be confirmed
  CAF_WOMENS_AFCON: 5236, // CAF Women's Africa Cup of Nations - ID to be confirmed
  
  // Invitational Tournaments
  SHEBELIEVES_CUP: 5237, // SheBelieves Cup - ID to be confirmed
  ARNOLD_CLARK_CUP: 5238, // Arnold Clark Cup - ID to be confirmed
  TOURNOI_DE_FRANCE: 5239, // Tournoi de France - ID to be confirmed
  PINATAR_CUP: 5240,    // Pinatar Cup - ID to be confirmed
  ALGARVE_CUP: 5241,    // Algarve Cup - ID to be confirmed
  WOMENS_CUP: 5242,     // The Women's Cup - ID to be confirmed
  WORLD_SEVENS_WOMEN: 5243, // World Sevens Women - ID to be confirmed
  
  // Legacy aliases for backward compatibility
  FA_WSL: 4849,         // FA Women's Super League (same as WSL)
  ENGLISH_WSL: 4849,    // English Women's Super League (same as WSL)
  CHINESE_WSL: 5017,    // Chinese Women's Super League - ID to be confirmed
  CONCACAF_W_CHAMPIONS_CUP: 5018, // Concacaf W Champions Cup - ID to be confirmed
};

// Helper function to check if premium API is configured
function isAPIKeyConfigured(): boolean {
  return Boolean(process.env.THESPORTSDB_API_KEY && process.env.THESPORTSDB_API_KEY !== '3');
}

export interface LiveMatch {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';
  minute: number | null;
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
  utcDate: string;
  venue: string;
}

export interface Standing {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

class SportsDataService {
  private apiKey: string | null;

  constructor() {
    this.apiKey = process.env.THESPORTSDB_API_KEY || null;
    console.log('🔑 Sports API Key:', this.apiKey ? 'Premium ✅' : 'Free Tier ⚠️');
  }

  // Convert UTC time to EST (Eastern Standard Time) - STATIC METHOD
  static convertToEST(utcDate: string): { time: string; date: string; full: string } {
    const date = new Date(utcDate);
    
    // Convert to EST (UTC-5) or EDT (UTC-4) depending on daylight saving time
    const estDate = new Date(date.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    const time = estDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/New_York'
    });
    
    const dateStr = estDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'America/New_York'
    });
    
    const full = estDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/New_York'
    });
    
    return { time, date: dateStr, full };
  }

  private isPremiumConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey !== '3');
  }

  private async fetchFromAPI(endpoint: string, useV2: boolean = false): Promise<any> {
    // Throttling + cache layer
    const cacheKey = `${useV2 ? 'v2' : 'v1'}:${endpoint}`;
    const cached = __memoryCache.get(cacheKey);
    const now = Date.now();
    if (cached && cached.expires > now) {
      console.log(`🗃️ Cache hit for ${cacheKey}`);
      return cached.data;
    }

    await __acquire();
    try {
      let attempt = 0;
      let backoff = 2000; // INCREASED initial backoff from 500ms to 2s
      while (true) {
        try {
          let url: string;
          let headers: Record<string, string> = {
            'Content-Type': 'application/json'
          };

          if (useV2 && this.isPremiumConfigured()) {
            url = `${BASE_URL_V2}${endpoint}`;
            headers['X-API-KEY'] = this.apiKey!;
            console.log('🚀 Using V2 Premium API:', url);
          } else if (this.isPremiumConfigured()) {
            url = `${BASE_URL_V1}/${this.apiKey}${endpoint}`;
            console.log('🔐 Using V1 Premium API:', url);
          } else {
            url = `${BASE_URL_V1}/3${endpoint}`;
            console.log('🆓 Using V1 Free API:', url);
          }

          // Add delay before each request to be more respectful
          await __sleep(1000); // 1 second delay before each request

          const response = await fetch(url, { 
            headers,
            cache: 'no-store'
          });

          if (response.status === 429) {
            attempt++;
            if (attempt > __MAX_RETRIES) {
              throw new Error('API Error: 429 Too Many Requests - exceeded retry limit');
            }
            const retryAfterHeader = response.headers.get('Retry-After');
            const retryAfterMs = retryAfterHeader ? parseInt(retryAfterHeader) * 1000 : backoff;
            console.warn(`⏳ Rate limited (429). Retrying in ${retryAfterMs}ms (attempt ${attempt}/${__MAX_RETRIES})`);
            await __sleep(retryAfterMs);
            backoff = Math.min(backoff * 2, 10000); // INCREASED max backoff to 10s
            continue; // retry loop
          }

          if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
              const errorData = await response.json();
              if (errorData.message) errorMessage += ` - ${errorData.message}`;
              if (errorData.error?.code) errorMessage += ` (Code: ${errorData.error.code})`;
            } catch {}
            throw new Error(errorMessage);
          }

          const responseText = await response.text();
          if (!responseText || responseText.trim() === '') {
            console.log('⚠️ Empty response from API');
            __memoryCache.set(cacheKey, { data: null, expires: now + __getTTLForEndpoint(endpoint) });
            return null;
          }

          const data = JSON.parse(responseText);
          console.log(`✅ API Response received, keys:`, Object.keys(data || {}));
          __memoryCache.set(cacheKey, { data, expires: Date.now() + __getTTLForEndpoint(endpoint) });
          return data;
        } catch (err: any) {
          // If error is due to parsing or network and we still have retries, backoff and retry
          const msg = String(err?.message || '').toLowerCase();
          if (msg.includes('429') || msg.includes('network') || msg.includes('timeout')) {
            attempt++;
            if (attempt > __MAX_RETRIES) throw err;
            const delay = Math.min(backoff, 10000); // INCREASED max delay to 10s
            console.warn(`🔁 Transient error. Retrying in ${delay}ms (attempt ${attempt}/${__MAX_RETRIES})`);
            await __sleep(delay);
            backoff = Math.min(backoff * 2, 15000); // INCREASED max backoff to 15s
            continue;
          }
          throw err;
        }
      }
    } finally {
      __release();
    }
  }

  // Get live matches using Premium V2 API or fallback to V1 data
  async getLiveMatches(): Promise<LiveMatch[]> {
    try {
      console.log('🔍 Fetching live matches...');
      
      if (this.isPremiumConfigured()) {
        // Try V2 Premium API for actual live scores first
        console.log('🎯 Attempting V2 API for live soccer scores...');
        try {
          // Direct V2 API call with proper URL construction
          const v2Url = `${BASE_URL_V2}/${this.apiKey}/livescore/soccer`;
          console.log('🚀 V2 API URL:', v2Url);
          
          const response = await fetch(v2Url, {
            headers: {
              'Content-Type': 'application/json'
            },
            cache: 'no-store'
          });
          
          if (!response.ok) {
            throw new Error(`V2 API Error: ${response.status} ${response.statusText}`);
          }
          
          const liveData = await response.json();
          console.log('🎯 V2 API Raw Response:', liveData);
          
          if (liveData && (liveData.events || liveData.matches || liveData.fixtures)) {
            const events = liveData.events || liveData.matches || liveData.fixtures || [];
            console.log(`📊 V2 API returned ${events.length} events`);
            
            // Filter and transform live matches
            const liveMatches = events
              .filter((match: any) => {
                console.log('🔍 V2 Match status check:', match.strStatus, match.strProgress);
                // Check if match is actually live
                const status = match.strStatus?.toLowerCase() || '';
                const progress = match.strProgress?.toLowerCase() || '';
                return status.includes('live') || status.includes('play') || 
                       progress.includes("'") || progress.includes('min');
              })
              .map((match: any) => this.transformV2MatchToLiveMatch(match))
              .filter(Boolean);
            
            console.log(`🔴 Found ${liveMatches.length} ACTUAL live matches from V2 API`);
            
            if (liveMatches.length > 0) {
              // Also get recent matches to supplement data
              const recentMatches = await this.getRecentMatches(10);
              const allMatches = [...liveMatches, ...recentMatches];
              return this.removeDuplicateMatches(allMatches).slice(0, 15);
            }
            
            // If no live matches but got events, check them all
            const allMatches = events
              .map((match: any) => this.transformV2MatchToLiveMatch(match))
              .filter(Boolean)
              .slice(0, 15);
            
            console.log(`📋 V2 API: No live matches, returning ${allMatches.length} total matches`);
            return allMatches;
            
          } else {
            console.log('📋 V2 API returned no matches, structure:', Object.keys(liveData || {}));
          }
        } catch (error) {
          console.log('⚠️ V2 API failed:', error.message);
        }
      }

      // Fallback to V1 API (free or premium)
      console.log('🔄 Falling back to V1 API...');
      return await this.getLiveMatchesV1();

    } catch (error) {
      console.error('❌ Error in getLiveMatches:', error);
      return [];
    }
  }

  // Filter to ensure only women's soccer matches from approved leagues
  private isWomensSoccerMatch(match: any): boolean {
    const leagueName = (match.strLeague || '').toLowerCase();
    const sport = (match.strSport || '').toLowerCase();
    
    console.log('🔍 Checking match:', { league: match.strLeague, sport: match.strSport });
    
    // TEMPORARY: Always return true for NWSL to debug
    if (leagueName.includes('nwsl') || leagueName.includes('american nwsl')) {
      console.log('✅ NWSL match found - allowing through filter');
      return true;
    }
    
    // First, exclude known men's leagues - expanded patterns
    const menLeaguePatterns = [
      /costa\s*rica.*liga/i,
      /liga.*costa\s*rica/i,
      /liga\s*fpd/i,
      /fpd/i,
      /swiss\s*super\s*league/i,
      /super\s*league.*swiss/i,
      /switzerland.*super/i,
      /uzbekistan\s*super\s*league/i,
      /super\s*league.*uzbekistan/i,
      /netherlands\s*derde\s*divisie/i,
      /derde\s*divisie.*netherlands/i,
      /derde\s*divisie\s*sunday/i,
      /sunday.*derde\s*divisie/i,
      // Add more comprehensive men's league patterns
      /^swiss\s*super/i,
      /^super\s*league$/i,
      /uzbekistan.*league/i,
      /netherlands.*divisie/i,
      /divisie.*netherlands/i
    ];
    
    if (menLeaguePatterns.some(pattern => pattern.test(leagueName))) {
      console.log('🚫 Excluding men\'s league:', match.strLeague);
      return false;
    }
    
    // Only allow matches from the approved women's leagues list
    const approvedLeagues = [
      "national women's soccer league",
      "american nwsl", // ADD this variant
      "nwsl",
      "usl super league women", 
      "liga mx femenil",
      "northern super league",
      "fa women's super league",
      "frauen-bundesliga",
      // Accented/non-accented variants
      "division 1 feminine",
      "division 1 féminine",
      "serie a women",
      "liga f",
      "primera division femenina",
      "primera división femenina",
      "eredivisie women",
      "scottish women's premier league",
      "damallsvenskan",
      "toppserien women",
      "nifl women's premiership",
      "we league",
      "wk league",
      "a-league women",
      "indian women's league",
      // Accented/non-accented variants
      "brasileirao feminino a1",
      "brasileirão feminino a1",
      "primera division a women (argentina)",
      "hollywoodbets super league",
      "caf women's champions league"
    ];
    
    const isApprovedLeague = approvedLeagues.some(approved => 
      leagueName.includes(approved.toLowerCase()) || 
      approved.toLowerCase().includes(leagueName)
    );
    
    if (!isApprovedLeague) {
      console.log('🚫 Excluding non-approved league:', match.strLeague);
      return false;
    }
    
    // Must be soccer/football
    const isSoccer = sport.includes('soccer') || sport.includes('football');
    
    return isSoccer;
  }

  // Transform V2 API match data to our LiveMatch interface
  private transformV2MatchToLiveMatch(match: any): LiveMatch | null {
    try {
      console.log('🔄 Transforming V2 match:', {
        id: match.idEvent,
        homeTeam: match.strHomeTeam,
        awayTeam: match.strAwayTeam,
        status: match.strStatus,
        progress: match.strProgress,
        league: match.strLeague,
        sport: match.strSport
      });
      
      // Filter out non-women's soccer matches
      if (!this.isWomensSoccerMatch(match)) {
        console.log('⚠️ Skipping non-women\'s soccer match:', match.strLeague);
        return null;
      }
      
      return {
        id: parseInt(match.idEvent || match.id || Math.random() * 1000000),
        homeTeam: {
          id: parseInt(match.idHomeTeam || '0'),
          name: match.strHomeTeam || 'Unknown',
          shortName: match.strHomeTeamShort || this.createShortName(match.strHomeTeam || 'UNK'),
          crest: match.strHomeTeamBadge || match.strTeamBadge || 'https://r2.thesportsdb.com/images/media/team/badge/default.png'
        },
        awayTeam: {
          id: parseInt(match.idAwayTeam || '0'),
          name: match.strAwayTeam || 'Unknown',
          shortName: match.strAwayTeamShort || this.createShortName(match.strAwayTeam || 'UNK'),
          crest: match.strAwayTeamBadge || 'https://r2.thesportsdb.com/images/media/team/badge/default.png'
        },
        utcDate: this.convertToISODate(match.strTimestamp, match.strDate, match.strTime),
        status: this.mapV2Status(match.strStatus || match.status, match.strProgress),
        minute: this.parseMinute(match.strProgress || match.intRound),
        score: {
          fullTime: {
            home: this.parseScore(match.intHomeScore),
            away: this.parseScore(match.intAwayScore)
          },
          halfTime: {
            home: this.parseScore(match.intHomeScoreHT),
            away: this.parseScore(match.intAwayScoreHT)
          }
        },
        competition: {
          id: parseInt(match.idLeague || '0'),
          name: this.cleanLeagueName(match.strLeague || 'Unknown League'),
          emblem: match.strLeagueBadge || 'https://r2.thesportsdb.com/images/media/league/badge/default.png'
        },
        venue: match.strVenue || 'TBD'
      };
    } catch (error) {
      console.error('Error transforming V2 match:', error);
      return null;
    }
  }

  // Map V2 API status to our status format
  private mapV2Status(status: string, progress?: string): LiveMatch['status'] {
    const statusLower = status?.toLowerCase() || '';
    const progressLower = progress?.toLowerCase() || '';
    
    // Prioritize finished/cancelled/postponed before any live heuristics
    if (
      statusLower.includes('finished') || statusLower.includes('final') || statusLower.includes('full time') ||
      statusLower.includes('ft') || progressLower.includes('ft') ||
      statusLower.includes('aet') || statusLower.includes('after extra time') ||
      statusLower.includes('pen') || statusLower.includes('penalties')
    ) {
      return 'FINISHED';
    }
    if (statusLower.includes('postponed')) return 'POSTPONED';
    if (statusLower.includes('cancelled')) return 'CANCELLED';
    if (statusLower.includes('halftime') || statusLower.includes('ht') || progressLower.includes('ht') || statusLower.includes('half time')) return 'PAUSED';
    
    // Enhanced live detection including WSL-specific statuses
    if (
      statusLower.includes('live') || statusLower.includes('in play') || statusLower.includes('playing') ||
      statusLower === '1h' || statusLower === '2h' || // First/Second half indicators
      statusLower.includes('first half') || statusLower.includes('second half') ||
      progressLower.includes("'") || progressLower.includes('min') ||
      progressLower.includes('1h') || progressLower.includes('2h')
    ) {
      return 'LIVE';
    }
    
    return 'SCHEDULED';
  }

  // Transform TheSportsDB event data to our format
  private transformEventToLiveMatch(event: any, leagueInfo?: any): LiveMatch | null {
    console.log('🔄 Transforming V1 event:', event);
    
    // Filter out non-women's soccer matches - CRITICAL FIX
    if (!this.isWomensSoccerMatch(event)) {
      console.log('⚠️ Skipping non-women\'s soccer match (V1):', event.strLeague);
      return null;
    }
    
    const status = this.mapV2Status(event.strStatus || 'SCHEDULED', event.strProgress);
    const leagueId = event.idLeague ? parseInt(event.idLeague) : WOMENS_LEAGUES.NWSL;
    
    return {
      id: parseInt(event.idEvent) || 0,
      homeTeam: {
        id: parseInt(event.idHomeTeam) || 0,
        name: event.strHomeTeam || 'Home Team',
        shortName: this.createShortName(event.strHomeTeam || 'HOM'),
        crest: event.strHomeTeamBadge || '/images/team-placeholder.png'
      },
      awayTeam: {
        id: parseInt(event.idAwayTeam) || 0,
        name: event.strAwayTeam || 'Away Team',
        shortName: this.createShortName(event.strAwayTeam || 'AWY'),
        crest: event.strAwayTeamBadge || '/images/team-placeholder.png'
      },
      score: {
        fullTime: {
          home: this.parseScore(event.intHomeScore),
          away: this.parseScore(event.intAwayScore),
        },
        halfTime: {
          home: this.parseScore(event.intHomeScoreHT),
          away: this.parseScore(event.intAwayScoreHT),
        }
      },
      status,
      minute: this.parseMinute(event.strProgress),
      competition: {
        id: leagueId,
        name: this.cleanLeagueName(event.strLeague || leagueInfo?.strLeague || 'NWSL'),
        emblem: event.strLeagueBadge || leagueInfo?.strBadge || '/images/nwsl-logo.png'
      },
      utcDate: this.convertToISODate(event.strTimestamp, event.strDate, event.strTime),
      venue: event.strVenue || 'TBD'
    };
  }

  // Clean up league names for better display
  private cleanLeagueName(leagueName: string): string {
    if (!leagueName) return 'Unknown League';
    
    // Clean up common league name issues and standardize display names
    const cleaned = leagueName
      // North American leagues
      .replace('American NWSL', 'NWSL')
      .replace('National Women\'s Soccer League', 'NWSL')
      .replace('USL Super League Women', 'USL Super League')
      .replace('Liga MX Femenil', 'Liga MX Femenil')
      .replace('Northern Super League', 'NSL')
      .replace('League1 Canada Women', 'League1 Canada')
      
      // European leagues
      .replace('FA Women\'s Super League', 'WSL')
      .replace('Barclays WSL', 'WSL')
      .replace('English Women\'s Super League', 'WSL')
      .replace('Google Pixel Frauen-Bundesliga', 'Frauen-Bundesliga')
      .replace('German Women\'s Bundesliga', 'Frauen-Bundesliga')
      .replace('D1 Arkema', 'Division 1 Féminine')
      .replace('Arkema Première Ligue', 'Division 1 Féminine')
      .replace('Serie A Femminile eBay', 'Serie A Women')
      .replace('Primera División (Liga F)', 'Liga F')
      .replace('Primera División Femenina', 'Liga F')
      .replace('Eredivisie Vrouwen', 'Eredivisie Women')
      .replace('Scottish Women\'s Premier League', 'SWPL')
      .replace('Sports Direct Women\'s Premiership', 'NIFL Women\'s Premiership')
      
      // Asian & Oceanian leagues
      .replace('WE League', 'WE League')
      .replace('WK League', 'WK League')
      .replace('A-League Women', 'A-League Women')
      .replace('Indian Women\'s League', 'Indian Women\'s League')
      
      // South American leagues
      .replace('Campeonato Brasileiro Feminino Série A1', 'Brasileirão Feminino A1')
      .replace('Primera División A Femenina', 'Primera División A Women')
      
      // African leagues
      .replace('SAFA Women\'s League', 'SAFA Women\'s League')
      .replace('Hollywoodbets Super League', 'Hollywoodbets Super League')
      
      // International competitions
      .replace('UEFA Women\'s Champions League', 'UWCL')
      .replace('CONMEBOL Copa Libertadores Femenina', 'Copa Libertadores Femenina')
      .replace('CAF Women\'s Champions League', 'CAF Women\'s Champions League')
      .replace('AFC Women\'s Club Championship', 'AFC Women\'s Club Championship')
      .replace('FIFA Women\'s World Cup', 'FIFA Women\'s World Cup')
      .replace('Olympic Games – Women', 'Olympic Women\'s Football')
      .replace('UEFA Women\'s Championship', 'UEFA Women\'s Euro')
      .replace('AFC Women\'s Asian Cup', 'AFC Women\'s Asian Cup')
      .replace('Copa América Femenina', 'Copa América Femenina')
      .replace('CONCACAF W Gold Cup', 'CONCACAF W Gold Cup')
      .replace('CAF Women\'s Africa Cup of Nations', 'CAF Women\'s AFCON')
      
      // Invitational tournaments
      .replace('SheBelieves Cup', 'SheBelieves Cup')
      .replace('Arnold Clark Cup', 'Arnold Clark Cup')
      .replace('Tournoi de France', 'Tournoi de France')
      .replace('Pinatar Cup', 'Pinatar Cup')
      .replace('Algarve Cup', 'Algarve Cup')
      .replace('The Women\'s Cup', 'The Women\'s Cup')
      .replace('World Sevens Women', 'World Sevens Women')
      
      // Friendlies
      .replace('Women\'s International Friendlies', 'International Friendlies')
      
      .trim();
    
    return cleaned;
  }

  // Broad name check for women-specific competitions (covers leagues without explicit "Women" in title)
  private isWomensLeagueName(name: string): boolean {
    const n = name.toLowerCase();
    return (
      // Generic women markers
      n.includes("women") || n.includes("women's") || n.includes('female') || n.includes('womens') ||
      // Common international comps
      n.includes('uwcl') || n.includes("women's champions league") || n.includes('concacaf w') ||
      // Major domestic leagues (native names)
      n.includes('damallsvenskan') ||
      n.includes('toppserien') ||
      n.includes('liga f') ||
      n.includes('liga mx femenil') ||
      n.includes('d1 arkema') ||
      n.includes('frauen') ||
      n.includes('femminile') ||
      n.includes('we league') ||
      n.includes('a-league women') ||
      n.includes('brasileiro feminino variants') ||
      n.includes('chinese women') ||
      n.includes('nwsl') ||
      n.includes('wsl') ||
      n.includes('womens super league') ||
      n.includes('women\'s super league') ||
      n.includes('fa women') ||
      n.includes('northern super league')
    );
  }

  // Create short team name (3 characters)
  private createShortName(fullName: string): string {
    if (!fullName) return 'TBD';
    
    // Handle common patterns
    if (fullName.includes('FC')) return fullName.replace(' FC', '').substring(0, 3).toUpperCase();
    if (fullName.includes('City')) return fullName.substring(0, 3).toUpperCase();
    
    // Take first 3 characters of each word
    const words = fullName.split(' ');
    if (words.length >= 2) {
      return (words[0].substring(0, 2) + words[1].substring(0, 1)).toUpperCase();
    }
    
    return fullName.substring(0, 3).toUpperCase();
  }

  // Parse score values
  private parseScore(scoreStr: string | number | null): number | null {
    if (scoreStr === null || scoreStr === undefined || scoreStr === '') return null;
    const parsed = parseInt(scoreStr.toString());
    return isNaN(parsed) ? null : parsed;
  }

  // Parse match minute
  private parseMinute(progress: string | number | null): number | null {
    if (!progress) return null;
    
    if (typeof progress === 'number') return progress;
    
    const match = progress.toString().match(/(\\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  // Convert TheSportsDB date/time to ISO format
  private convertToISODate(timestamp: string | null, date: string | null, time: string | null): string {
    if (timestamp) {
      return new Date(timestamp).toISOString();
    }
    
    if (date) {
      const dateTime = time ? `${date} ${time}` : date;
      const parsed = new Date(dateTime);
      return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
    }
    
    // CRITICAL FIX: Handle NWSL games with null dates but valid times
    if (time && !date) {
      // Assume today's date if only time is provided (common for NWSL fixtures)
      const today = new Date().toISOString().split('T')[0];
      const dateTime = `${today} ${time}`;
      const parsed = new Date(dateTime);
      if (!isNaN(parsed.getTime())) {
        console.log(`🔧 Fixed null date for NWSL game: ${today} ${time} -> ${parsed.toISOString()}`);
        return parsed.toISOString();
      }
    }
    
    return new Date().toISOString();
  }

  // Get recent matches to supplement live data
  private async getRecentMatches(limit: number = 10): Promise<LiveMatch[]> {
    const allMatches: LiveMatch[] = [];
    
    try {
      // Get recent NWSL results
      console.log('📋 Getting recent NWSL matches...');
      const recentEvents = await this.fetchFromAPI(`/eventspastleague.php?id=${WOMENS_LEAGUES.NWSL}`);
      
      if (!recentEvents) {
        console.log('⚠️ No response from recent matches API');
        return [];
      }
      
      if (recentEvents?.events) {
        const recentMatches = recentEvents.events
          .slice(0, limit)
          .map((event: any) => this.transformEventToLiveMatch(event))
          .filter(Boolean); // Filter out null values
        
        console.log(`✅ Found ${recentMatches.length} recent NWSL matches`);
        allMatches.push(...recentMatches);
      }
    } catch (error) {
      console.log('⚠️ Recent matches fetch failed:', error.message);
    }
    
    return allMatches;
  }

  // Fallback method using V1 API (existing implementation)
  private async getLiveMatchesV1(): Promise<LiveMatch[]> {
    console.log('🔄 Using V1 API fallback...');
    
    const allMatches: LiveMatch[] = [];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Get today's matches across all sports
    try {
      console.log('📅 Fetching todays events...');
      const todayEvents = await this.fetchFromAPI(`/eventsday.php?d=${todayStr}`);
      
      if (!todayEvents) {
        console.log('⚠️ No response from today events API');
      } else if (todayEvents?.events) {
        const todayMatches = todayEvents.events
          .filter((event: any) => {
            const leagueName = event.strLeague?.toLowerCase() || '';
            const sport = event.strSport?.toLowerCase() || '';
            // Focus ONLY on women's soccer/football leagues
            return (
              (sport.includes('soccer') || sport.includes('football')) &&
              (leagueName.includes('nwsl') ||
               leagueName.includes('women') ||
               leagueName.includes('female') ||
               leagueName.includes('wsl') ||
               leagueName.includes('womens super league') ||
               leagueName.includes('women\'s super league') ||
               leagueName.includes('fa women') ||
               leagueName.includes('super league') ||
               leagueName.includes('northern super league') ||
               leagueName.includes('nsl') ||
               leagueName.includes('frauen') ||
               leagueName.includes('féminine') ||
               leagueName.includes('femminile') ||
               leagueName.includes('uwcl') ||
               leagueName.includes('champions league'))
            );
          })
          .map((event: any) => this.transformEventToLiveMatch(event))
          .filter(Boolean) // Filter out null values
          .slice(0, 10);
        
        console.log(`📊 Found ${todayMatches.length} women's soccer matches today`);
        allMatches.push(...todayMatches);
      }
    } catch (error) {
      console.log('⚠️ Today\'s events fetch failed:', error.message);
    }

    // Get recent matches from multiple leagues
    const recentMatches = await this.getRecentMatches(8);
    allMatches.push(...recentMatches);

    // Get upcoming NWSL matches
    try {
      console.log('📅 Getting upcoming NWSL matches...');
      const upcomingEvents = await this.fetchFromAPI(`/eventsnextleague.php?id=${WOMENS_LEAGUES.NWSL}`);
      
      if (!upcomingEvents) {
        console.log('⚠️ No response from upcoming NWSL matches API');
      } else if (upcomingEvents?.events) {
        const upcomingMatches = upcomingEvents.events
          .slice(0, 5)
          .map((event: any) => this.transformEventToLiveMatch(event))
          .filter(Boolean); // Filter out null values
        
        console.log(`📊 Found ${upcomingMatches.length} upcoming NWSL matches`);
        allMatches.push(...upcomingMatches);
      }
    } catch (error) {
      console.log('⚠️ Upcoming NWSL events fetch failed:', error.message);
    }

    // Try other women's leagues too
    const otherLeagues = [WOMENS_LEAGUES.WSL, WOMENS_LEAGUES.FRAUEN_BUNDESLIGA];
    for (const leagueId of otherLeagues) {
      try {
        console.log(`📋 Fetching recent matches for league ${leagueId}...`);
        const recentEvents = await this.fetchFromAPI(`/eventspastleague.php?id=${leagueId}`);
        
        if (!recentEvents) {
          console.log(`⚠️ No response from league ${leagueId} API`);
          continue;
        }
        
        if (recentEvents?.events) {
          const recentMatches = recentEvents.events
            .slice(0, 3)
            .map((event: any) => this.transformEventToLiveMatch(event))
            .filter(Boolean); // Filter out null values
          
          allMatches.push(...recentMatches);
        }
      } catch (error) {
        console.log(`⚠️ League ${leagueId} fetch failed:`, error.message);
      }
    }

    // Also try to get today's WSL matches specifically
    try {
      console.log('🏴󠁧󠁢󠁥󠁮󠁧󠁿 Fetching today\'s WSL matches specifically...');
      const wslToday = await this.fetchFromAPI(`/eventsday.php?d=${todayStr}&l=${WOMENS_LEAGUES.WSL}`);
      
      if (wslToday?.events) {
        const wslMatches = wslToday.events
          .map((event: any) => this.transformEventToLiveMatch(event))
          .filter(Boolean) // Filter out null values
          .slice(0, 5);
        
        console.log(`🏴󠁧󠁢󠁥󠁮󠁧󠁿 Found ${wslMatches.length} WSL matches today`);
        allMatches.push(...wslMatches);
      }
    } catch (error) {
      console.log('⚠️ WSL today fetch failed:', error.message);
    }

    // Check upcoming WSL matches for live games (since live API doesn't include women's matches)
    try {
      console.log('🏴󠁧󠁢󠁥󠁮󠁧󠁿 Checking upcoming WSL matches for live games...');
      const wslUpcoming = await this.fetchFromAPI(`/eventsnextleague.php?id=${WOMENS_LEAGUES.WSL}`);
      
      if (wslUpcoming?.events) {
        const liveWSLMatches = wslUpcoming.events
          .filter((event: any) => {
            const status = event.strStatus?.toLowerCase() || '';
            // Check for live indicators in upcoming matches
            return status === '1h' || status === '2h' || status.includes('live') || 
                   status.includes('in play') || status.includes('first half') || 
                   status.includes('second half');
          })
          .map((event: any) => this.transformEventToLiveMatch(event))
          .filter(Boolean) // Filter out null values
          .slice(0, 5);
        
        console.log(`🔴 Found ${liveWSLMatches.length} LIVE WSL matches from upcoming API`);
        allMatches.push(...liveWSLMatches);
      }
    } catch (error) {
      console.log('⚠️ WSL upcoming fetch failed:', error.message);
    }

    // Remove duplicates and sort
    const uniqueMatches = this.removeDuplicateMatches(allMatches);
    const sortedMatches = uniqueMatches.sort((a, b) => {
      // Live matches first, then by date (most recent)
      if ((a.status === 'LIVE' || a.status === 'IN_PLAY') && b.status !== 'LIVE' && b.status !== 'IN_PLAY') return -1;
      if ((b.status === 'LIVE' || b.status === 'IN_PLAY') && a.status !== 'LIVE' && a.status !== 'IN_PLAY') return 1;
      return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime();
    });

    console.log(`✅ Total matches to display: ${sortedMatches.length}`);
    return sortedMatches.slice(0, 15); // Limit to 15 total matches
  }

  // Remove duplicate matches based on team matchup and date
  private removeDuplicateMatches(matches: LiveMatch[]): LiveMatch[] {
    const seen = new Set<string>();
    return matches.filter((match) => {
      const key = `${match.homeTeam.name}-${match.awayTeam.name}-${match.utcDate.split('T')[0]}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Get fixtures and recent results for women's soccer
  async getFixtures(dateFrom?: string, dateTo?: string): Promise<LiveMatch[]> {
    try {
      console.log('🏆 API: Fetching fixtures and recent results from external API');
      
      // Use 2024 season data since that's where the current NWSL games are
      const currentYear = 2024; // Fixed to 2024 where the actual data is
      
      // If no date range provided, look at current NWSL season dates
      if (!dateFrom || !dateTo) {
        // Use current NWSL season dates - October 2024 is the current season
        const today = new Date();
        const currentDate2024 = new Date(2024, today.getMonth(), today.getDate());
        const weekFromNow2024 = new Date(currentDate2024);
        weekFromNow2024.setDate(currentDate2024.getDate() + 7);
        
        dateFrom = currentDate2024.toISOString().split('T')[0];
        dateTo = weekFromNow2024.toISOString().split('T')[0];
      } else {
        // Convert 2025 dates to 2024 equivalent for data lookup
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        
        // If the requested dates are in 2025, map them to 2024
        if (fromDate.getFullYear() === 2025) {
          fromDate.setFullYear(2024);
          dateFrom = fromDate.toISOString().split('T')[0];
        }
        if (toDate.getFullYear() === 2025) {
          toDate.setFullYear(2024);
          dateTo = toDate.toISOString().split('T')[0];
        }
      }
      
      console.log(`📅 Looking for fixtures between ${dateFrom} and ${dateTo} in ${currentYear} season`);
      
      // Use the existing method that works
      const allMatches: LiveMatch[] = [];
      
      // Generate date range to check
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateTo);
      const datesToCheck: string[] = [];
      
      // Generate all dates in the range
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        datesToCheck.push(d.toISOString().split('T')[0]);
      }
      
      console.log(`📅 Will check ${datesToCheck.length} dates: ${datesToCheck.join(', ')}`);
      
      for (const date of datesToCheck) {
        console.log(`📅 Fetching events for ${date}`);
        try {
          // Fetch all events for this date
          const dayEvents = await this.fetchFromAPI(`/eventsday.php?d=${date}&s=Soccer`);
          
          if (dayEvents?.events) {
            const dayMatches = dayEvents.events
              .filter((event: any) => this.isWomensSoccerMatch(event))
              .map((event: any) => this.transformEventToLiveMatch(event))
              .filter(Boolean);
            
            allMatches.push(...dayMatches);
            console.log(`📅 Found ${dayMatches.length} women's soccer matches on ${date}`);
          } else {
            console.log(`📅 No events returned for ${date}`);
          }
        } catch (err) {
          console.warn(`⚠️ Failed to fetch ${date}:`, err);
        }
        
        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`🎯 Total fixtures found: ${allMatches.length}`);
      return allMatches;
      
    } catch (error) {
      console.error('❌ Error in getFixtures:', error);
      throw error;
    }
  }

  // Get standings for a specific competition
  async getStandings(competitionId: number): Promise<Standing[]> {
    try {
      console.log(`📊 Fetching standings for league ID: ${competitionId}`);

      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1; // 1-12

      // 1) Ask API for available seasons and pick the most relevant
      let seasonCandidates: string[] = [];
      try {
        const seasonsResp = await this.fetchFromAPI(`/search_all_seasons.php?id=${competitionId}`);
        const apiSeasons: string[] = Array.isArray(seasonsResp?.seasons)
          ? seasonsResp.seasons.map((s: any) => s?.strSeason).filter(Boolean)
          : [];
        console.log('📚 Seasons from API:', apiSeasons);
        seasonCandidates.push(...apiSeasons);
      } catch (e) {
        console.log('ℹ️ Could not load seasons list, will try common formats.');
      }

      // 2) Add common season formats (covers split-year and single-year)
      const commonFormats = [
        `${year}`,
        `${year - 1}`,
        `${year - 1}-${year}`,
        `${year}-${year + 1}`,
        // If we are early season (Aug-Nov), last season might still be active in DB
        ...(month >= 8 && month <= 11 ? [`${year - 1}-${year}`] : []),
      ];
      seasonCandidates.push(...commonFormats);

      // Dedupe while preserving order
      seasonCandidates = Array.from(new Set(seasonCandidates.filter(Boolean)));

      // Helper: score seasons to try most likely first
      const scoreSeason = (s: string) => {
        // Examples: '2025', '2024-2025', '2025-2026'
        const m = s.match(/^(\d{4})(?:-(\d{4}))?$/);
        if (!m) return 0;
        const start = parseInt(m[1]);
        const end = m[2] ? parseInt(m[2]) : start;
        // Prefer seasons that include current year, then most recent
        let score = 0;
        if (start === year || end === year) score += 100;
        score += (start * 2 + end); // newer seasons higher
        return score;
      };

      seasonCandidates.sort((a, b) => scoreSeason(b) - scoreSeason(a));
      console.log('🧭 Season try order:', seasonCandidates);

      // 3) Try seasons in order until we get a table
      for (const season of seasonCandidates) {
        console.log(`🗓️ Trying standings season: ${season}`);
        const response = await this.fetchFromAPI(`/lookuptable.php?l=${competitionId}&s=${season}`);
        if (!response) {
          console.log('⚠️ No response from standings API for season', season);
          continue;
        }
        if (response?.table && Array.isArray(response.table) && response.table.length > 0) {
          const standings: Standing[] = response.table.map((team: any) => ({
            position: parseInt(team.intRank) || 0,
            team: {
              id: parseInt(team.idTeam) || 0,
              name: team.strTeam || 'Unknown Team',
              shortName: this.createShortName(team.strTeam || 'UNK'),
              crest: team.strTeamBadge || '/images/team-placeholder.png'
            },
            playedGames: parseInt(team.intPlayed) || 0,
            won: parseInt(team.intWin) || 0,
            draw: parseInt(team.intDraw) || 0,
            lost: parseInt(team.intLoss) || 0,
            points: parseInt(team.intPoints) || 0,
            goalsFor: parseInt(team.intGoalsFor) || 0,
            goalsAgainst: parseInt(team.intGoalsAgainst) || 0,
            goalDifference: parseInt(team.intGoalDifference) || 0
          }));
          console.log(`✅ Found ${standings.length} teams in standings for season ${season}`);
          return standings;
        }
        console.log(`ℹ️ No standings table for season ${season}`);
      }

      console.log('⚠️ No standings found for any tried season, returning empty array');
      return [];
    } catch (error) {
      console.error('❌ Error fetching standings:', (error as any)?.message || error);
      return [];
    }
  }

  // Get today's matches
  async getTodaysMatches(): Promise<LiveMatch[]> {
    return this.getLiveMatches(); // Same as live matches for TheSportsDB
  }
}

// Create and export service instance
const sportsDataService = new SportsDataService();

// Export both the class and the instance
export { SportsDataService, sportsDataService, isAPIKeyConfigured };

// Export league constants for use in components
export { WOMENS_LEAGUES };





