import { NextResponse } from 'next/server';
import { sportsDataService, isAPIKeyConfigured } from '@/lib/sportsApi';

// Simple in-memory cache for fixtures to reduce upstream API calls
const __fixturesCache = new Map<string, { payload: any; expires: number }>();
const __FIXTURES_TTL_MS = 5 * 60 * 1000; // INCREASED to 5 minutes cache

export async function GET(request: Request) {
  console.log('🏆 API: Fetching fixtures and recent results from external API');
  
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  // Cache key per date range
  const cacheKey = `fixtures:${dateFrom || 'none'}:${dateTo || 'none'}`;
  const now = Date.now();
  const cached = __fixturesCache.get(cacheKey);
  if (cached && cached.expires > now) {
    console.log('🗃️ Fixtures route cache hit:', cacheKey);
    return NextResponse.json(cached.payload);
  }

  try {
    // Check if API is configured
    if (!isAPIKeyConfigured()) {
      console.log('⚠️ API key not configured, returning empty results');
      const payload = {
        success: false,
        configured: false,
        matches: [],
        count: 0,
        message: 'API key not configured. Please add THESPORTSDB_API_KEY to environment variables.'
      };
      __fixturesCache.set(cacheKey, { payload, expires: now + __FIXTURES_TTL_MS });
      return NextResponse.json(payload, { status: 200 });
    }

    // Add delay to prevent immediate rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get fixtures from external API with timeout protection
    let allMatches: any[] = [];
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('API timeout after 20 seconds')), 20000); // INCREASED timeout
      });
      
      // First try with date parameters
      let apiPromise = sportsDataService.getFixtures(
        dateFrom || undefined, 
        dateTo || undefined
      );
      
      // Race between API call and timeout
      allMatches = await Promise.race([apiPromise, timeoutPromise]);
      console.log(`✅ API: Found ${allMatches.length} total matches from external API with date filter`);
      
      // If no matches found with date filter, try without date filter and filter client-side
      if (allMatches.length === 0 && (dateFrom || dateTo)) {
        console.log('🔄 No matches found with date filter, trying without date parameters...');
        apiPromise = sportsDataService.getFixtures();
        allMatches = await Promise.race([apiPromise, timeoutPromise]);
        console.log(`✅ API: Found ${allMatches.length} total matches without date filter`);
        
        // Filter matches by date range client-side
        if (dateFrom || dateTo) {
          const fromDate = dateFrom ? new Date(dateFrom + 'T00:00:00Z') : new Date('1900-01-01');
          const toDate = dateTo ? new Date(dateTo + 'T23:59:59Z') : new Date('2100-01-01');
          
          allMatches = allMatches.filter((match: any) => {
            const matchDate = new Date(match.utcDate);
            return matchDate >= fromDate && matchDate <= toDate;
          });
          console.log(`📅 Client-side filtered to ${allMatches.length} matches for date range ${dateFrom} to ${dateTo}`);
        }
      }
    } catch (apiError: any) {
      console.log(`⚠️ API failed/timeout: ${apiError.message}`);
      
      // Handle rate limiting specifically
      if (apiError.message?.includes('429') || apiError.message?.includes('Rate limit')) {
        const payload = {
          success: false,
          configured: true,
          matches: [],
          count: 0,
          error: 'Rate limit exceeded',
          message: 'API rate limit exceeded. Please wait a moment and try again.',
          retryAfter: 60
        };
        __fixturesCache.set(cacheKey, { payload, expires: now + 30_000 }); // 30s cache for rate limit
        return NextResponse.json(payload, { status: 429 });
      }
      
      const payload = {
        success: false,
        configured: true,
        matches: [],
        count: 0,
        error: 'API timeout or unavailable',
        message: 'External API is temporarily unavailable. Please try again later.'
      };
      __fixturesCache.set(cacheKey, { payload, expires: now + 30_000 }); // INCREASED failure cache
      return NextResponse.json(payload, { status: 200 });
    }
    
    // Rely on sportsDataService to handle date scoping
    let fixturesAndResults = allMatches;
    
    console.log(`📅 API: Filtered to ${fixturesAndResults.length} fixtures and results`);
    
    // Sort by date (most recent first)
    const sortedMatches = fixturesAndResults.sort((a, b) => {
      return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime();
    });
    
    console.log(`📊 API: Total fixtures/results to return: ${sortedMatches.length}`);
    
    const payload = {
      success: true,
      configured: true,
      matches: sortedMatches,
      count: sortedMatches.length,
      dateRange: { dateFrom, dateTo },
      message: sortedMatches.length > 0 ? 
        'Fixtures and results retrieved successfully from external API! 🌍⚽' : 
        'No fixtures found for this period'
    };

    __fixturesCache.set(cacheKey, { payload, expires: Date.now() + __FIXTURES_TTL_MS });
    return NextResponse.json(payload);
    
  } catch (error: any) {
    console.error('❌ API Error (fixtures):', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle rate limiting specifically
    if (errorMessage.includes('429') || errorMessage.includes('Rate limit')) {
      const payload = {
        success: false,
        configured: true,
        matches: [],
        count: 0,
        dateRange: { dateFrom, dateTo },
        error: 'Rate limit exceeded',
        message: 'API rate limit exceeded. Please wait a moment and try again.',
        retryAfter: 60
      };
      __fixturesCache.set(cacheKey, { payload, expires: Date.now() + 30_000 });
      return NextResponse.json(payload, { status: 429 });
    }
    
    const payload = { 
      success: false,
      configured: true,
      matches: [],
      count: 0,
      dateRange: { dateFrom, dateTo },
      error: 'API error',
      details: errorMessage,
      message: 'External API is temporarily unavailable. Please try again later.'
    };

    __fixturesCache.set(cacheKey, { payload, expires: Date.now() + 30_000 }); // INCREASED failure cache
    return NextResponse.json(payload, { status: 200 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds for live updates






