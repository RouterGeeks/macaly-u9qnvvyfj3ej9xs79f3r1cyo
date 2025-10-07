import { NextResponse } from 'next/server';
import { sportsDataService, isAPIKeyConfigured } from '@/lib/sportsApi';

// Simple in-memory cache for live matches to reduce upstream API calls
const __liveCache = new Map<string, { payload: any; expires: number }>();
const __LIVE_TTL_MS = 2 * 60 * 1000; // INCREASED to 2 minutes cache for live endpoint

export async function GET() {
  console.log('🚀 API: Fetching LIVE women\'s soccer matches from external API');
  
  const cacheKey = 'live:all';
  const now = Date.now();
  const cached = __liveCache.get(cacheKey);
  if (cached && cached.expires > now) {
    console.log('🗃️ Live route cache hit');
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
      __liveCache.set(cacheKey, { payload, expires: now + __LIVE_TTL_MS });
      return NextResponse.json(payload, { status: 200 });
    }

    // Add delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API timeout after 20 seconds')), 20000); // INCREASED timeout
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

    const payload = {
      success: true,
      configured: true,
      matches: actuallyLiveMatches,
      count: actuallyLiveMatches.length,
      message: actuallyLiveMatches.length > 0 ? 
        `${actuallyLiveMatches.length} live matches found across women's soccer leagues` : 
        'No live matches right now. Check back soon!'
    };

    __liveCache.set(cacheKey, { payload, expires: Date.now() + __LIVE_TTL_MS });
    return NextResponse.json(payload);

  } catch (error: any) {
    console.error('❌ API Error (live matches):', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle rate limiting specifically
    if (errorMessage.includes('429') || errorMessage.includes('Rate limit')) {
      const payload = {
        success: false,
        configured: true,
        matches: [],
        count: 0,
        error: 'Rate limit exceeded',
        message: 'API rate limit exceeded. Please wait a moment and try again.',
        retryAfter: 120
      };
      __liveCache.set(cacheKey, { payload, expires: Date.now() + 60_000 }); // 1 minute cache for rate limit
      return NextResponse.json(payload, { status: 429 });
    }
    
    const payload = {
      success: false,
      configured: true,
      matches: [],
      count: 0,
      error: 'API temporarily unavailable',
      details: errorMessage,
      message: 'No live matches due to a temporary issue. Please refresh shortly.'
    };
    __liveCache.set(cacheKey, { payload, expires: Date.now() + 60_000 }); // INCREASED failure cache
    return NextResponse.json(payload, { status: 200 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds for live updates





