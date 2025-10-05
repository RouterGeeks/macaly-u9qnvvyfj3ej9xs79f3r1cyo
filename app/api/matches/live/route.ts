import { NextResponse } from 'next/server';
import { sportsDataService, isAPIKeyConfigured } from '@/lib/sportsApi';

export async function GET() {
  console.log('🚀 API: Fetching LIVE women\'s soccer matches from external API');
  
  try {
    // Check if API is configured
    if (!isAPIKeyConfigured()) {
      console.log('⚠️ API key not configured, returning empty results');
      return NextResponse.json({
        success: false,
        configured: false,
        matches: [],
        count: 0,
        message: 'API key not configured. Please add THESPORTSDB_API_KEY to environment variables.'
      }, { status: 200 });
    }

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API timeout after 15 seconds')), 15000);
    });

    // Get live matches from external API with timeout
    const liveMatches = await Promise.race([
      sportsDataService.getLiveMatches(),
      timeoutPromise
    ]) as any[];
    
    // Filter to only show actually live matches
    const actuallyLiveMatches = liveMatches.filter(match => 
      match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED'
    );
    
    console.log(`✅ API: Found ${actuallyLiveMatches.length} LIVE women's matches`);

    return NextResponse.json({
      success: true,
      configured: true,
      matches: actuallyLiveMatches,
      count: actuallyLiveMatches.length,
      message: actuallyLiveMatches.length > 0 ? 
        `${actuallyLiveMatches.length} live matches found across women's soccer leagues` : 
        'No live matches right now. Check back soon!'
    });

  } catch (error) {
    console.error('❌ API Error (live matches):', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
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
export const revalidate = 60; // Revalidate every 60 seconds for live updates



