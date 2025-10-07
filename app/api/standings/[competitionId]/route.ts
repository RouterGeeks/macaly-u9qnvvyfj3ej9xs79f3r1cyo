import { NextResponse } from 'next/server';
import { sportsDataService } from '@/lib/sportsApi';

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
    
    // Use TheSportsDB API exclusively - no more mock data
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
        message: standings.length > 0 ? 'Live standings retrieved successfully' : 'No standings available for this competition'
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
export const revalidate = 60; // Revalidate every 60 seconds for live updates