import { NextResponse } from 'next/server';
import { sportsDataService, Standing } from '@/lib/sportsApi';
import { mockTeams } from '@/lib/mockData';

// Generate mock standings for various women's leagues
function generateMockStandings(leagueId: number): Standing[] {
  const leagueData = getLeagueStandings(leagueId);
  if (!leagueData) return [];

  return leagueData.map((teamData, index) => ({
    position: index + 1,
    team: {
      id: 1000 + index,
      name: teamData.team.name,
      shortName: teamData.team.shortName,
      crest: teamData.team.logo
    },
    playedGames: teamData.won + teamData.draw + teamData.lost,
    won: teamData.won,
    draw: teamData.draw,
    lost: teamData.lost,
    points: teamData.points,
    goalsFor: teamData.goalsFor,
    goalsAgainst: teamData.goalsAgainst,
    goalDifference: teamData.goalsFor - teamData.goalsAgainst
  })).sort((a, b) => {
    // Sort by points (descending), then goal difference (descending), then goals for (descending)
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  }).map((team, index) => ({ ...team, position: index + 1 }));
}

function getLeagueName(leagueId: number): string {
  const leagueNames: { [key: number]: string } = {
    5012: "Northern Super League (NSL) 🇨🇦",
    5013: "National Women's Soccer League (NWSL) 🇺🇸",
    5014: "Barclays Women's Super League (WSL) 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    5015: "Liga F 🇪🇸",
    5016: "D1 Arkema 🇫🇷",
    5017: "Google Pixel Frauen-Bundesliga 🇩🇪",
    5018: "WE League 🇯🇵"
  };
  return leagueNames[leagueId] || "Women's League";
}

function getLeagueStandings(leagueId: number) {
  switch (leagueId) {
    case 5012: // NSL - Northern Super League 🇨🇦
      return [
        { team: mockTeams[47], points: 18, won: 5, draw: 3, lost: 2, goalsFor: 14, goalsAgainst: 8 }, // AFC Toronto
        { team: mockTeams[45], points: 16, won: 5, draw: 1, lost: 4, goalsFor: 16, goalsAgainst: 12 }, // Vancouver Rise FC
        { team: mockTeams[49], points: 15, won: 4, draw: 3, lost: 3, goalsFor: 11, goalsAgainst: 10 }, // Ottawa Rapid FC
        { team: mockTeams[46], points: 14, won: 4, draw: 2, lost: 4, goalsFor: 13, goalsAgainst: 14 }, // Calgary Wild FC
        { team: mockTeams[50], points: 12, won: 3, draw: 3, lost: 4, goalsFor: 9, goalsAgainst: 11 }, // Montreal Roses FC
        { team: mockTeams[51], points: 8, won: 2, draw: 2, lost: 6, goalsFor: 7, goalsAgainst: 15 }, // Halifax Tides FC
      ];
    
    case 5013: // NWSL 🇺🇸
      return [
        { team: mockTeams[1], points: 42, won: 13, draw: 3, lost: 2, goalsFor: 31, goalsAgainst: 12 }, // Orlando Pride
        { team: mockTeams[2], points: 35, won: 10, draw: 5, lost: 3, goalsFor: 28, goalsAgainst: 16 }, // Portland Thorns
        { team: mockTeams[0], points: 33, won: 10, draw: 3, lost: 5, goalsFor: 25, goalsAgainst: 18 }, // Angel City FC
        { team: mockTeams[6], points: 31, won: 9, draw: 4, lost: 5, goalsFor: 23, goalsAgainst: 19 }, // Kansas City Current
        { team: mockTeams[3], points: 28, won: 8, draw: 4, lost: 6, goalsFor: 22, goalsAgainst: 21 }, // San Diego Wave
        { team: mockTeams[4], points: 26, won: 7, draw: 5, lost: 6, goalsFor: 20, goalsAgainst: 22 }, // OL Reign
        { team: mockTeams[7], points: 24, won: 7, draw: 3, lost: 8, goalsFor: 19, goalsAgainst: 24 }, // Houston Dash
        { team: mockTeams[5], points: 21, won: 6, draw: 3, lost: 9, goalsFor: 18, goalsAgainst: 26 }, // North Carolina Courage
      ];
    
    case 5014: // WSL 🏴󠁧󠁢󠁥󠁮󠁧󠁿
      return [
        { team: mockTeams[8], points: 48, won: 15, draw: 3, lost: 0, goalsFor: 45, goalsAgainst: 8 }, // Chelsea Women
        { team: mockTeams[10], points: 41, won: 13, draw: 2, lost: 3, goalsFor: 39, goalsAgainst: 15 }, // Manchester City Women
        { team: mockTeams[9], points: 38, won: 12, draw: 2, lost: 4, goalsFor: 35, goalsAgainst: 18 }, // Arsenal Women
        { team: mockTeams[11], points: 35, won: 10, draw: 5, lost: 3, goalsFor: 32, goalsAgainst: 19 }, // Manchester United Women
        { team: mockTeams[12], points: 28, won: 8, draw: 4, lost: 6, goalsFor: 25, goalsAgainst: 25 }, // Liverpool Women
      ];
    
    case 5015: // Liga F 🇪🇸
      return [
        { team: mockTeams[13], points: 51, won: 16, draw: 3, lost: 0, goalsFor: 58, goalsAgainst: 8 }, // Barcelona Femení
        { team: mockTeams[14], points: 39, won: 12, draw: 3, lost: 4, goalsFor: 35, goalsAgainst: 18 }, // Real Madrid Femenino
        { team: mockTeams[15], points: 35, won: 10, draw: 5, lost: 4, goalsFor: 28, goalsAgainst: 19 }, // Atlético Madrid Femenino
        { team: mockTeams[16], points: 32, won: 9, draw: 5, lost: 5, goalsFor: 26, goalsAgainst: 22 }, // Real Sociedad Femenino
      ];
    
    case 5016: // D1 Arkema 🇫🇷
      return [
        { team: mockTeams[17], points: 44, won: 14, draw: 2, lost: 2, goalsFor: 42, goalsAgainst: 12 }, // Lyon Féminin
        { team: mockTeams[18], points: 38, won: 11, draw: 5, lost: 2, goalsFor: 35, goalsAgainst: 15 }, // Paris Saint-Germain Féminin
        { team: mockTeams[20], points: 32, won: 9, draw: 5, lost: 4, goalsFor: 28, goalsAgainst: 20 }, // Paris FC Féminin
      ];
    
    case 5017: // Frauen-Bundesliga 🇩🇪
      return [
        { team: mockTeams[22], points: 46, won: 14, draw: 4, lost: 0, goalsFor: 48, goalsAgainst: 10 }, // VfL Wolfsburg Frauen
        { team: mockTeams[21], points: 41, won: 13, draw: 2, lost: 3, goalsFor: 41, goalsAgainst: 16 }, // Bayern München Frauen
        { team: mockTeams[23], points: 35, won: 10, draw: 5, lost: 3, goalsFor: 32, goalsAgainst: 18 }, // Eintracht Frankfurt Frauen
      ];

    case 5018: // WE League 🇯🇵
      return [
        { team: mockTeams[30], points: 38, won: 12, draw: 2, lost: 4, goalsFor: 34, goalsAgainst: 15 }, // Urawa Red Diamonds Ladies
        { team: mockTeams[29], points: 35, won: 11, draw: 2, lost: 5, goalsFor: 31, goalsAgainst: 18 }, // INAC Kobe Leonessa
        { team: mockTeams[31], points: 32, won: 10, draw: 2, lost: 6, goalsFor: 28, goalsAgainst: 22 }, // Tokyo Verdy Beleza
      ];
    
    default:
      return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ competitionId: string }> }
) {
  const { competitionId: competitionIdStr } = await params;
  console.log(`🏆 API: Fetching standings for competition ${competitionIdStr}`);
  
  try {
    const competitionId = parseInt(competitionIdStr);
    
    if (isNaN(competitionId)) {
      return NextResponse.json(
        { 
          success: false,
          configured: true,
          error: 'Invalid competition ID',
          standings: [],
          count: 0
        },
        { status: 400 }
      );
    }
    
    // Check if we have mock data for this league
    const mockStandings = generateMockStandings(competitionId);
    if (mockStandings.length > 0) {
      const leagueName = getLeagueName(competitionId);
      console.log(`🏆 API: Returning mock standings for ${leagueName}`);
      
      return NextResponse.json({
        success: true,
        configured: true,
        standings: mockStandings,
        competitionId: competitionId,
        count: mockStandings.length,
        message: `${leagueName} standings retrieved successfully! ⚽`
      });
    }
    
    // For other competitions, use TheSportsDB with timeout protection
    console.log('✅ TheSportsDB is ready for standings fetch');
    
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('API timeout after 8 seconds')), 8000);
      });
      
      const standingsPromise = sportsDataService.getStandings(competitionId);
      
      // Race between API call and timeout
      const standings = await Promise.race([standingsPromise, timeoutPromise]);
      console.log(`✅ API: Found ${standings.length} teams in standings`);
      
      return NextResponse.json({
        success: true,
        configured: true,
        standings: standings,
        competitionId: competitionId,
        count: standings.length,
        message: standings.length > 0 ? 'Standings retrieved successfully' : 'No standings available for this competition'
      });
    } catch (apiError) {
      console.log(`⚠️ API failed/timeout for competition ${competitionId}: ${apiError.message}`);
      
      return NextResponse.json({
        success: false,
        configured: true,
        standings: [],
        competitionId: competitionId,
        count: 0,
        error: 'External API temporarily unavailable',
        message: 'Unable to fetch standings - please try again later'
      });
    }
  } catch (error) {
    console.error('❌ API Error (standings):', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isAuthError = errorMessage.includes('404') || 
                       errorMessage.includes('401') || 
                       errorMessage.includes('403');
    
    return NextResponse.json(
      { 
        success: false,
        configured: true,
        standings: [],
        count: 0,
        competitionId: competitionIdStr,
        error: isAuthError ? 'Competition not found' : 'Failed to fetch standings',
        details: errorMessage,
        message: isAuthError ? 'TheSportsDB connection issue' : 'API request failed'
      },
      { status: isAuthError ? 404 : 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 600; // Revalidate every 10 minutes for standings