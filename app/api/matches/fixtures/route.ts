import { NextResponse } from 'next/server';
import { sportsDataService, isAPIKeyConfigured, LiveMatch } from '@/lib/sportsApi';
import { mockMatches } from '@/lib/mockData';

// Convert mock data to LiveMatch format
function convertMockToLiveMatch(mockMatch: any): LiveMatch {
  return {
    id: parseInt(mockMatch.id.replace('nsl-', '')) || Math.random() * 1000000,
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
      id: 5012,
      name: 'Northern Super League',
      emblem: 'https://r2.thesportsdb.com/images/media/league/badge/default.png'
    },
    utcDate: new Date(`${mockMatch.date}T${mockMatch.time || '00:00'}:00.000Z`).toISOString(),
    venue: mockMatch.venue || 'TBD'
  };
}

export async function GET(request: Request) {
  console.log('🏆 API: Fetching fixtures and recent results (excluding live matches)');
  
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  
  try {
    // Try to get API matches with timeout protection
    let allApiMatches: any[] = [];
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('API timeout after 8 seconds')), 8000);
      });
      
      const apiPromise = sportsDataService.getFixtures(
        dateFrom || undefined, 
        dateTo || undefined
      );
      
      // Race between API call and timeout
      allApiMatches = await Promise.race([apiPromise, timeoutPromise]);
      console.log(`✅ API: Found ${allApiMatches.length} total matches from TheSportsDB`);
    } catch (apiError) {
      console.log(`⚠️ API failed/timeout: ${apiError.message} - continuing with NSL data only`);
      allApiMatches = [];
    }
    
    // Filter out live matches (those should only appear in live endpoint) and apply date filtering
    let fixturesAndResults = allApiMatches.filter(match => {
      const isNotLive = match.status !== 'LIVE' && match.status !== 'IN_PLAY';
      return isNotLive;
    });
    
    // Apply date filtering if dateFrom/dateTo are specified
    if (dateFrom || dateTo) {
      fixturesAndResults = fixturesAndResults.filter(match => {
        const matchDate = match.utcDate.split('T')[0]; // Get YYYY-MM-DD part
        
        if (dateFrom && matchDate < dateFrom) return false;
        if (dateTo && matchDate > dateTo) return false;
        
        // For "Today" filter, exclude matches that happened very early in the morning
        // (before 6 AM UTC) as they would be "yesterday" in most local timezones
        if (dateFrom && dateTo && dateFrom === dateTo) {
          const today = new Date().toISOString().split('T')[0];
          if (dateFrom === today) {
            const matchDateTime = new Date(match.utcDate);
            const matchHour = matchDateTime.getUTCHours();
            // Exclude matches between midnight and 6 AM UTC for "Today" view
            if (matchHour >= 0 && matchHour < 6) {
              return false;
            }
          }
        }
        
        return true;
      });
    }
    
    console.log(`📅 API: Filtered to ${fixturesAndResults.length} fixtures and results (excluding live)`);
    
    // Add NSL matches from mock data - but exclude live matches and filter by date
    let nslMatches = mockMatches
      .filter(match => match.league === 'NSL' && match.status !== 'live')
      .map(mockMatch => convertMockToLiveMatch(mockMatch));
    
    // Apply date filtering if dateFrom/dateTo are specified
    if (dateFrom || dateTo) {
      nslMatches = nslMatches.filter(match => {
        const matchDate = match.utcDate.split('T')[0]; // Get YYYY-MM-DD part
        
        if (dateFrom && matchDate < dateFrom) return false;
        if (dateTo && matchDate > dateTo) return false;
        
        // For "Today" filter, exclude matches that happened very early in the morning
        // (before 6 AM UTC) as they would be "yesterday" in most local timezones
        if (dateFrom && dateTo && dateFrom === dateTo) {
          const today = new Date().toISOString().split('T')[0];
          if (dateFrom === today) {
            const matchDateTime = new Date(match.utcDate);
            const matchHour = matchDateTime.getUTCHours();
            // Exclude matches between midnight and 6 AM UTC for "Today" view
            if (matchHour >= 0 && matchHour < 6) {
              return false;
            }
          }
        }
        
        return true;
      });
    }
    
    console.log(`🇨🇦 API: Adding ${nslMatches.length} NSL fixtures/results from Canada (no live)`);
    
    // Combine all matches and sort by date (earliest first)
    const allMatches = [...nslMatches, ...fixturesAndResults].sort((a, b) => {
      return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
    });
    
    console.log(`📊 API: Total fixtures/results to return: ${allMatches.length}`);
    
    return NextResponse.json({
      success: true,
      configured: true,
      matches: allMatches,
      count: allMatches.length,
      dateRange: { dateFrom, dateTo },
      message: allMatches.length > 0 ? 
        (allApiMatches.length > 0 ? 'Fixtures with NSL matches retrieved successfully! 🇨🇦⚽' : 'NSL fixtures retrieved (external API temporarily unavailable)') : 
        'No fixtures found for this period',
      warning: allApiMatches.length === 0 ? 'External API temporarily unavailable - showing NSL data only' : undefined
    });
  } catch (error) {
    console.error('❌ API Error (fixtures):', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return NSL data even if there's an error
    const nslMatches = mockMatches
      .filter(match => match.league === 'NSL' && match.status !== 'live')
      .map(mockMatch => convertMockToLiveMatch(mockMatch));
    
    return NextResponse.json(
      { 
        success: true,
        configured: true,
        matches: nslMatches,
        count: nslMatches.length,
        dateRange: { dateFrom, dateTo },
        warning: 'External API unavailable - showing NSL data only',
        message: nslMatches.length > 0 ? 'NSL fixtures retrieved (API unavailable)' : 'No fixtures available'
      },
      { status: 200 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes for fixtures