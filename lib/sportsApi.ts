// Sports Data API Integration using TheSportsDB.com Premium
// 🚀 PREMIUM ACCESS with real-time live scores!

const BASE_URL_V1 = 'https://www.thesportsdb.com/api/v1/json';
const BASE_URL_V2 = 'https://www.thesportsdb.com/api/v2/json';

// Major Women's Soccer League IDs
const WOMENS_LEAGUES = {
  NWSL: 4521,           // American NWSL (excellent coverage!)
  WSL: 4328,            // FA Women's Super League (England) 
  FRAUEN_BUNDESLIGA: 4479, // German Women's Bundesliga
  D1_ARKEMA: 5010,      // French D1 Arkema (if available)
  SERIE_A_FEM: 5011,    // Italian Serie A Femminile (if available)
  NSL: 5012,            // Northern Super League (Canada) - TBD ID
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

  private isPremiumConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey !== '3');
  }

  private async fetchFromAPI(endpoint: string, useV2: boolean = false): Promise<any> {
    try {
      let url: string;
      let headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (useV2 && this.isPremiumConfigured()) {
        // V2 Premium API for live scores
        url = `${BASE_URL_V2}${endpoint}`;
        headers['X-API-KEY'] = this.apiKey!;
        console.log('🚀 Using V2 Premium API:', url);
      } else if (this.isPremiumConfigured()) {
        // V1 Premium API with key
        url = `${BASE_URL_V1}/${this.apiKey}${endpoint}`;
        console.log('🔑 Using V1 Premium API:', url);
      } else {
        // V1 Free API
        url = `${BASE_URL_V1}/3${endpoint}`;
        console.log('🆓 Using V1 Free API:', url);
      }

      const response = await fetch(url, { 
        headers,
        cache: 'no-store' // Always get fresh data for live scores
      });

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
          if (errorData.error?.code) {
            errorMessage += ` (Code: ${errorData.error.code})`;
          }
        } catch {
          // If we can't parse error details, continue with basic error
        }
        throw new Error(errorMessage);
      }

      // Check if response has content before parsing JSON
      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        console.log('⚠️ Empty response from API');
        return null;
      }
      
      try {
        const data = JSON.parse(responseText);
        console.log(`✅ API Response received, data keys:`, Object.keys(data || {}));
        return data;
      } catch (parseError) {
        console.error('❌ Failed to parse API response as JSON:', parseError.message);
        console.log('Raw response text:', responseText.substring(0, 200) + '...');
        return null;
      }

    } catch (error) {
      console.error('❌ API fetch failed:', error.message);
      throw error;
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

  // Filter to ensure only women's soccer matches
  private isWomensSoccerMatch(match: any): boolean {
    const leagueName = (match.strLeague || '').toLowerCase();
    const sport = (match.strSport || '').toLowerCase();
    
    return (
      (sport.includes('soccer') || sport.includes('football')) &&
      (
        leagueName.includes('nwsl') ||
        leagueName.includes('women') ||
        leagueName.includes('female') ||
        leagueName.includes('wsl') ||
        leagueName.includes('super league') ||
        leagueName.includes('northern super league') ||
        leagueName.includes('nsl') ||
        leagueName.includes('frauen') ||
        leagueName.includes('féminine') ||
        leagueName.includes('femminile') ||
        leagueName.includes('uwcl') ||
        leagueName.includes('champions league') ||
        // Concacaf W Champions Cup variants
        (leagueName.includes('concacaf') && (leagueName.includes("women") || leagueName.includes("women's") || leagueName.includes(' w ') || leagueName.endsWith(' w'))) &&
        leagueName.includes('champions cup')
      )
    );
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
    
    // Check if match is live based on progress indicators
    if (progressLower.includes("'") || progressLower.includes('min') || 
        progressLower.includes('1h') || progressLower.includes('2h') ||
        statusLower.includes('live') || statusLower.includes('play')) {
      return 'LIVE';
    }
    
    if (statusLower.includes('finished') || statusLower.includes('final') || statusLower.includes('ft')) return 'FINISHED';
    if (statusLower.includes('scheduled') || statusLower.includes('fixture')) return 'SCHEDULED';
    if (statusLower.includes('postponed')) return 'POSTPONED';
    if (statusLower.includes('cancelled')) return 'CANCELLED';
    if (statusLower.includes('halftime') || progressLower.includes('ht')) return 'PAUSED';
    
    return 'SCHEDULED';
  }

  // Transform TheSportsDB event data to our format
  private transformEventToLiveMatch(event: any, leagueInfo?: any): LiveMatch {
    console.log('🔄 Transforming V1 event:', event);
    
    const status = this.mapEventStatus(event);
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
    
    // Clean up common league name issues
    const cleaned = leagueName
      .replace('American NWSL', 'NWSL')
      .replace('FA Women\'s Super League', 'WSL')
      .replace('Northern Super League', 'NSL')
      .replace('German Women\'s Bundesliga', 'Frauen-Bundesliga')
      .trim();
    
    return cleaned;
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
    
    return new Date().toISOString();
  }

  // Map TheSportsDB event status to our format
  private mapEventStatus(event: any): LiveMatch['status'] {
    const status = event.strStatus?.toLowerCase() || '';
    const progress = event.strProgress?.toLowerCase() || '';
    
    console.log('🔄 Status mapping:', { status, progress, rawStatus: event.strStatus, rawProgress: event.strProgress });
    
    // Check if match is live/in progress - FIRST PRIORITY
    if (status.includes('1h') || status.includes('2h') || 
        status.includes('first half') || status.includes('second half') ||
        progress.includes("'") || progress.includes('min') || 
        progress.includes('1h') || progress.includes('2h') ||
        status.includes('live') || status.includes('in play') ||
        status.includes('playing')) {
      console.log('🔴 DETECTED LIVE MATCH!');
      return 'LIVE';
    }
    
    if (status.includes('halftime') || status.includes('ht') || progress.includes('ht')) {
      console.log('⏸️ DETECTED HALFTIME');
      return 'PAUSED';
    }
    
    // Check various status indicators for finished matches
    if (status.includes('match finished') || status.includes('ft') || status.includes('finished') ||
        status.includes('full time') || status.includes('final') ||
        (event.intHomeScore !== null && event.intAwayScore !== null && status !== 'not started')) {
      console.log('✅ DETECTED FINISHED MATCH');
      return 'FINISHED';
    }
    
    if (status.includes('postponed')) {
      console.log('📅 DETECTED POSTPONED');
      return 'POSTPONED';
    }
    if (status.includes('cancelled')) {
      console.log('❌ DETECTED CANCELLED');
      return 'CANCELLED';
    }
    
    // Default to scheduled for future matches
    console.log('📅 DETECTED SCHEDULED');
    return 'SCHEDULED';
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
          .map((event: any) => this.transformEventToLiveMatch(event));
        
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
          .map((event: any) => this.transformEventToLiveMatch(event));
        
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
            .map((event: any) => this.transformEventToLiveMatch(event));
          
          allMatches.push(...recentMatches);
        }
      } catch (error) {
        console.log(`⚠️ League ${leagueId} fetch failed:`, error.message);
      }
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

  // Get fixtures for specific date range
  async getFixtures(dateFrom?: string, dateTo?: string): Promise<LiveMatch[]> {
    try {
      console.log('📅 Fetching fixtures...');
      
      const allMatches: LiveMatch[] = [];
      
      // Get next NWSL matches
      const upcomingEvents = await this.fetchFromAPI(`/eventsnextleague.php?id=${WOMENS_LEAGUES.NWSL}`);
      
      if (!upcomingEvents) {
        console.log('⚠️ No response from fixtures API');
        return [];
      }
      
      if (upcomingEvents?.events) {
        const fixtures = upcomingEvents.events
          .map((event: any) => this.transformEventToLiveMatch(event))
          .slice(0, 15); // Limit to 15 fixtures
        
        allMatches.push(...fixtures);
      }

      // Get recent past matches too
      const pastEvents = await this.fetchFromAPI(`/eventspastleague.php?id=${WOMENS_LEAGUES.NWSL}`);
      
      if (!pastEvents) {
        console.log('⚠️ No response from past matches API');
      } else if (pastEvents?.events) {
        const recentResults = pastEvents.events
          .slice(0, 10)
          .map((event: any) => this.transformEventToLiveMatch(event));
        
        allMatches.push(...recentResults);
      }
      
      // Sort by date (most recent first)
      allMatches.sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime());
      
      console.log(`✅ Found ${allMatches.length} fixtures and results`);
      return allMatches;

    } catch (error) {
      console.error('❌ Error fetching fixtures:', error);
      return [];
    }
  }

  // Get standings for a specific competition
  async getStandings(competitionId: number): Promise<Standing[]> {
    try {
      console.log(`📊 Fetching standings for league ID: ${competitionId}`);
      
      const currentSeason = new Date().getFullYear();
      const response = await this.fetchFromAPI(`/lookuptable.php?l=${competitionId}&s=${currentSeason}`);
      
      if (!response) {
        console.log('⚠️ No response from standings API, returning empty standings');
        return [];
      }
      
      if (response?.table) {
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
        
        console.log(`✅ Found ${standings.length} teams in standings`);
        return standings;
      }

      return [];
    } catch (error) {
      console.error('❌ Error fetching standings:', error);
      return [];
    }
  }

  // Get today's matches
  async getTodaysMatches(): Promise<LiveMatch[]> {
    return this.getLiveMatches(); // Same as live matches for TheSportsDB
  }
}

export const sportsDataService = new SportsDataService();

// Export helper function for checking API configuration
export { isAPIKeyConfigured };

// Export league constants for use in components
export { WOMENS_LEAGUES };
