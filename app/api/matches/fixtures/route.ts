import { NextResponse } from 'next/server';
import { sportsDataService, isAPIKeyConfigured } from '@/lib/sportsApi';

export async function GET(request: Request) {
  console.log('🏆 API: Fetching fixtures and recent results from external API');
  
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  
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

    // Get fixtures from external API with timeout protection
    let allMatches: any[] = [];
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('API timeout after 15 seconds')), 15000);
      });
      
      const apiPromise = sportsDataService.getFixtures(
        dateFrom || undefined, 
        dateTo || undefined
      );
      
      // Race between API call and timeout
      allMatches = await Promise.race([apiPromise, timeoutPromise]);
      console.log(`✅ API: Found ${allMatches.length} total matches from external API`);
    } catch (apiError) {
      console.log(`⚠️ API failed/timeout: ${apiError.message}`);
      return NextResponse.json({
        success: false,
        configured: true,
        matches: [],
        count: 0,
        error: 'API timeout or unavailable',
        message: 'External API is temporarily unavailable. Please try again later.'
      }, { status: 200 });
    }
    
    // Rely on sportsDataService to handle date scoping (it already fetches per-day when dateFrom/dateTo are present)
    // This prevents accidental exclusions due to timezone conversions on utcDate.
    let fixturesAndResults = allMatches;
    
    console.log(`📅 API: Filtered to ${fixturesAndResults.length} fixtures and results`);
    
    // Sort by date (most recent first)
    const sortedMatches = fixturesAndResults.sort((a, b) => {
      return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime();
    });
    
    console.log(`📊 API: Total fixtures/results to return: ${sortedMatches.length}`);
    
    return NextResponse.json({
      success: true,
      configured: true,
      matches: sortedMatches,
      count: sortedMatches.length,
      dateRange: { dateFrom, dateTo },
      message: sortedMatches.length > 0 ? 
        'Fixtures and results retrieved successfully from external API! 🌍⚽' : 
        'No fixtures found for this period'
    });
    
  } catch (error) {
    console.error('❌ API Error (fixtures):', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        configured: true,
        matches: [],
        count: 0,
        dateRange: { dateFrom, dateTo },
        error: 'API error',
        details: errorMessage,
        message: 'External API is temporarily unavailable. Please try again later.'
      },
      { status: 200 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds for live updates





