import { NextResponse } from 'next/server';
import { sportsDataService, isAPIKeyConfigured, LiveMatch } from '@/lib/sportsApi';
import { mockMatches } from '@/lib/mockData';

// Convert mock data to LiveMatch format with proper league mapping
function convertMockToLiveMatch(mockMatch: any): LiveMatch {
  const leagueMapping = {
    'NWSL': { id: 5013, name: 'NWSL', emblem: '🇺🇸' },
    'WSL': { id: 5014, name: 'WSL', emblem: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    'Liga F': { id: 5015, name: 'Liga F', emblem: '🇪🇸' },
    'D1 Arkema': { id: 5016, name: 'D1 Arkema', emblem: '🇫🇷' },
    'Frauen-Bundesliga': { id: 5017, name: 'Frauen-Bundesliga', emblem: '🇩🇪' },
    'WE League': { id: 5018, name: 'WE League', emblem: '🇯🇵' },
    'A-League Women': { id: 5020, name: 'A-League Women', emblem: '🇦🇺' },
    'Liga MX Femenil': { id: 5021, name: 'Liga MX Femenil', emblem: '🇲🇽' },
    'Damallsvenskan': { id: 5022, name: 'Damallsvenskan', emblem: '🇸🇪' },
    'Toppserien': { id: 5023, name: 'Toppserien', emblem: '🇳🇴' },
    'Brasileirão': { id: 5024, name: 'Brasileirão', emblem: '🇧🇷' },
    'Chinese WSL': { id: 5025, name: 'Chinese WSL', emblem: '🇨🇳' },
    'NSL': { id: 5012, name: 'NSL', emblem: '🇨🇦' },
    'Concacaf W Champions Cup': { id: 5027, name: 'Concacaf W Champions Cup', emblem: '🏆' }
  };

  const competition = leagueMapping[mockMatch.league] || { 
    id: 5000, 
    name: 'Women\'s Soccer League', 
    emblem: '⚽' 
  };

  return {
    id: parseInt(mockMatch.id.replace(/[^\d]/g, '')) || Math.random() * 1000000,
    homeTeam: {
      id: 1000 + Math.random() * 1000,
      name: mockMatch.homeTeam.name,
      shortName: mockMatch.homeTeam.shortName,
      crest: mockMatch.homeTeam.logo
    },
    awayTeam: {
      id: 1000 + Math.random() * 1000,
      name: mockMatch.awayTeam.name,
      shortName: mockMatch.awayTeam.shortName,
      crest: mockMatch.awayTeam.logo
    },
    score: {
      fullTime: {
        home: mockMatch.homeScore,
        away: mockMatch.awayScore
      },
      halfTime: {
        home: null,
        away: null
      }
    },
    status: mockMatch.status === 'live' ? 'LIVE' : mockMatch.status === 'finished' ? 'FINISHED' : 'SCHEDULED',
    minute: mockMatch.minute || null,
    competition: {
      id: competition.id,
      name: competition.name,
      emblem: competition.emblem
    },
    utcDate: new Date(`${mockMatch.date}T${mockMatch.time || '00:00'}:00.000Z`).toISOString(),
    venue: mockMatch.venue || 'TBD'
  };
}

export async function GET() {
  console.log('🚀 API: Fetching LIVE women\'s soccer matches only');
  
  try {
    // Allowed leagues (women's only) for the Live tab
    const allowedLeagues = new Set<string>([
      'NSL', // Canada
      'A-League Women',        // Australia
      'Chinese WSL', // China
      'Liga MX Femenil',       // Mexico
      'Damallsvenskan',        // Sweden
      'Toppserien',            // Norway
      'Brasileirão', // Brazil
      'WE League',             // Japan
      'NWSL', // USA
      'WSL', // UK
      'Liga F',                // Spain
      'D1 Arkema',             // France
      'Frauen-Bundesliga', // Germany
      'Concacaf W Champions Cup' // North America
    ]);

    // Get our mock women's soccer matches first and restrict to LIVE + allowed leagues
    const womensSoccerMatches = mockMatches
      .map(mockMatch => convertMockToLiveMatch(mockMatch))
      .filter(match => match.status === 'LIVE' && allowedLeagues.has(match.competition.name));
    
    console.log(`✅ API: Found ${womensSoccerMatches.length} LIVE women\'s matches for specified leagues`);

    return NextResponse.json({
      success: true,
      configured: true,
      matches: womensSoccerMatches,
      count: womensSoccerMatches.length,
      message: womensSoccerMatches.length > 0 ? 
        `${womensSoccerMatches.length} live matches found across NSL 🇨🇦, A-League Women 🇦🇺, China WSL 🇨🇳, Liga MX Femenil 🇲🇽, Damallsvenskan 🇸🇪, Toppserien 🇳🇴, Brasileirão Feminino 🇧🇷, WE League 🇯🇵, NWSL 🇺🇸, WSL 🏴󠁧󠁢󠁥󠁮󠁧󠁿, Liga F 🇪🇸, D1 Arkema 🇫🇷, Frauen-Bundesliga 🇩🇪, Concacaf W Champions Cup 🏆` : 
        'No live matches right now for the selected leagues. Check back soon!'
    });

  } catch (error) {
    console.error('❌ API Error (women\'s soccer matches):', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // On error, return an empty but successful response to avoid showing non-live data
    return NextResponse.json({
      success: true,
      configured: true,
      matches: [],
      count: 0,
      error: 'API temporarily unavailable',
      details: errorMessage,
      message: 'No live matches due to a temporary issue. Please refresh shortly.'
    }, { status: 200 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 30; // Revalidate every 30 seconds for live scores











