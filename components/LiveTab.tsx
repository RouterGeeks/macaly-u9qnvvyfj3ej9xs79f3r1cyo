



"use client";

import LiveMatchCard from './LiveMatchCard';
import SectionHeader from './SectionHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Wifi, Filter } from 'lucide-react';
import { useLiveMatches } from '@/hooks/useSportsData';
import { useState, useMemo } from 'react';
import type { LiveMatch } from '@/lib/sportsApi';

const LEAGUES_ORDER = [
  { "name": "National Women's Soccer League", "short": "NWSL", "country": "USA", "region": "North America", "rank": 1 },
  { "name": "FA Women's Super League", "short": "WSL", "country": "England", "region": "Europe", "rank": 2 },
  { "name": "Liga F", "short": "Liga F", "country": "Spain", "region": "Europe", "rank": 3 },
  { "name": "Frauen-Bundesliga", "short": "Bundesliga", "country": "Germany", "region": "Europe", "rank": 4 },
  { "name": "USL Super League Women", "short": "USL SP", "country": "USA", "region": "North America", "rank": 5 },
  { "name": "Northern Super League", "short": "NSL", "country": "Canada", "region": "North America", "rank": 6 },
  { "name": "Liga MX Femenil", "short": "Liga MX Femenil", "country": "Mexico", "region": "North America", "rank": 7 },
  { "name": "League1 Canada Women", "short": "League1 Canada", "country": "Canada", "region": "North America", "rank": 8 },
  { "name": "TST Women", "short": "TST", "country": "USA", "region": "North America", "rank": 9 },
  { "name": "Division 1 Féminine", "short": "D1F", "country": "France", "region": "Europe", "rank": 10 },
  { "name": "Serie A Women", "short": "Serie A", "country": "Italy", "region": "Europe", "rank": 11 },
  { "name": "Eredivisie Women", "short": "Eredivisie", "country": "Netherlands", "region": "Europe", "rank": 12 },
  { "name": "Scottish Women's Premier League", "short": "SWPL", "country": "Scotland", "region": "Europe", "rank": 13 },
  { "name": "Damallsvenskan", "short": "Damallsvenskan", "country": "Sweden", "region": "Europe", "rank": 14 },
  { "name": "Toppserien Women", "short": "Toppserien", "country": "Norway", "region": "Europe", "rank": 15 },
  { "name": "NIFL Women's Premiership", "short": "NIFL Premiership", "country": "Northern Ireland", "region": "Europe", "rank": 16 },
  { "name": "WE League", "short": "WE League", "country": "Japan", "region": "Asia & Oceania", "rank": 17 },
  { "name": "WK League", "short": "WK League", "country": "South Korea", "region": "Asia & Oceania", "rank": 18 },
  { "name": "A-League Women", "short": "A-League", "country": "Australia", "region": "Asia & Oceania", "rank": 19 },
  { "name": "Indian Women's League", "short": "IWL", "country": "India", "region": "Asia & Oceania", "rank": 20 },
  { "name": "Brasileirão Feminino A1", "short": "Brasileirão A1", "country": "Brazil", "region": "South America", "rank": 21 },
  { "name": "Primera Division A Women (Argentina)", "short": "Primera A", "country": "Argentina", "region": "South America", "rank": 22 },
  { "name": "Hollywoodbets Super League", "short": "Hollywoodbets", "country": "South Africa", "region": "Africa", "rank": 23 },
  { "name": "CAF Women's Champions League", "short": "CAF WCL", "country": "Africa", "region": "Africa", "rank": 24 }
];

export default function LiveTab() {
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  
  const { data: liveMatchesData, loading: liveLoading, error: liveError, success: liveSuccess } = useLiveMatches();
  
  console.log('LiveTab state:', { matchCount: liveMatchesData?.length || 0, loading: liveLoading, error: liveError, success: liveSuccess });

  // Only use live matches data
  const excludedLeaguePatterns = [
    /costa\s*rica/i,
    /liga\s*fpd/i,
    /\bfpd\b/i,
    /\bafl\b/i,
    /\baflw\b/i,
    /australian\s*football/i,
    /afl\s*women/i,
    /women['’]?s\s*afl/i,
    /swiss\s*super\s*league/i,
    /super\s*league.*swiss/i,
    /switzerland.*super/i,
    /uzbekistan\s*super\s*league/i,
    /super\s*league.*uzbekistan/i,
    /netherlands\s*derde\s*divisie/i,
    /derde\s*divisie.*netherlands/i,
    /derde\s*divisie\s*sunday/i,
    /sunday.*derde\s*divisie/i,
    // More comprehensive patterns
    /^swiss\s*super/i,
    /^super\s*league$/i,
    /uzbekistan.*league/i,
    /netherlands.*divisie/i,
    /divisie.*netherlands/i
  ];
  const allMatches = (liveMatchesData || []).filter(m => !excludedLeaguePatterns.some(re => re.test(m.competition?.name || '')));

  // Canonicalize league names from API to ensure ordering works even if names vary
  const canonicalLeagueName = (name: string): string => {
    const n = name.trim();
    if (/\bnwsl\b|national\s*wom?e?n'?s\s*soccer\s*league/i.test(n)) return "National Women's Soccer League";
    if (/fa\s*wom?e?n'?s?\s*super\s*league|english\s*wom?e?n'?s\s*super\s*league|\bWSL\b/i.test(n)) return "FA Women's Super League";
    if (/^liga\s*f(\b|\s)/i.test(n) && !/fpd/i.test(n)) return "Liga F"; // avoid Costa Rica FPD
    if (/frauen[-\s]?bundesliga|german(y)?\s*wom?e?n'?s?\s*bundesliga/i.test(n)) return "Frauen-Bundesliga";
    if (/usl\s*super\s*league/i.test(n)) return "USL Super League Women";
    if (/northern\s*super\s*league|\bNSL\b/i.test(n)) return "Northern Super League";
    if (/liga\s*mx\s*femenil/i.test(n)) return "Liga MX Femenil";
    return n;
  };

  // Hybrid league ordering: Top tier -> Regional favorites -> Alphabetical
  const getOrderedLeagues = (presentLeagues: string[]): string[] => {
    const topTier = ['National Women\'s Soccer League', 'FA Women\'s Super League', 'Liga F', 'Frauen-Bundesliga'];
    const regionalFavorites = ['USL Super League Women', 'Northern Super League', 'Liga MX Femenil'];

    // Only show leagues that actually have matches
    const topTierPresent = topTier.filter(league => presentLeagues.includes(league));
    const regionalPresent = regionalFavorites.filter(league => presentLeagues.includes(league));
    const remaining = presentLeagues.filter(league => 
      !topTier.includes(league) && !regionalFavorites.includes(league)
    ).sort();

    return [...topTierPresent, ...regionalPresent, ...remaining];
  };

  // Compute canonical present leagues and ordered list
  const presentLeagues = Array.from(new Set(
    allMatches
      .map(match => canonicalLeagueName(match.competition?.name || ''))
      .filter(name => name && name !== '')
  ));

  const availableLeagues = getOrderedLeagues(presentLeagues);

  console.log('LiveTab presentLeagues:', presentLeagues);
  console.log('LiveTab availableLeagues (ordered):', availableLeagues);

  // Filter matches by selected league (use canonical names for comparison)
  const filterMatchesByLeague = (matches: LiveMatch[]) => {
    if (selectedLeague === 'all') return matches;
    return matches.filter(match => canonicalLeagueName(match.competition?.name || '') === selectedLeague);
  };

  // Only show live matches - no recent results or upcoming matches
  const liveMatches = filterMatchesByLeague(allMatches.filter((match) => 
    match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED'
  ));

  // Simplified loading and error states - only live matches
  const loading = liveLoading;
  const error = liveError;
  const success = liveSuccess;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Sticky Sub-Navigation */}
      <div className="sticky top-0 z-10 sticky-nav-blur -mx-2 sm:-mx-4 px-2 sm:px-4 py-2">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-3 w-3 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">League Filter:</span>
        </div>
        
        {/* League Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={selectedLeague === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLeague('all')}
            className={`whitespace-nowrap font-normal text-xs ${
              selectedLeague === 'all'
                ? 'bg-woso-purple-500 text-white hover:bg-woso-purple-600 border-woso-purple-500'
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
            }`}
          >
            All Leagues
            <Badge variant="secondary" className="ml-2 text-xs bg-gray-200 text-gray-600">
              {availableLeagues.length}
            </Badge>
          </Button>
          
          {availableLeagues.map((league) => {
            const leagueMatchCount = allMatches.filter(m => canonicalLeagueName(m.competition?.name || '') === league).length;
            return (
              <Button
                key={league}
                variant={selectedLeague === league ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLeague(league)}
                className={`whitespace-nowrap font-normal text-xs ${
                  selectedLeague === league
                    ? 'bg-woso-purple-500 text-white hover:bg-woso-purple-600 border-woso-purple-500'
                    : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                {league.replace(/^(English |Germany |Spanish |French |American |Australian |Chinese |Japanese |Mexican |Brazilian |Swedish |Norwegian |Netherlands |Italian )/, '')}
                <Badge variant="secondary" className="ml-2 text-xs bg-gray-200 text-gray-600">
                  {leagueMatchCount}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-woso-cream/70">
              <Wifi className="h-4 w-4 animate-pulse" />
              <span>Fetching live women's soccer matches...</span>
            </div>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert className="border-red-200 bg-red-50 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Connection Issue:</strong> {error}
              <br />
              <span className="text-sm text-red-600 mt-1 block">
                Data may be temporarily unavailable. Please try refreshing.
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Live Matches - Only Current Live Games */}
        {!loading && success && liveMatches.length > 0 && (
          <section>
            <SectionHeader 
              title={
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                  LIVE NOW!
                </div>
              } 
              subtitle={`${liveMatches.length} women's soccer matches happening now${selectedLeague !== 'all' ? ` in ${selectedLeague}` : ''}`}
              showViewAll={false}
              titleClassName="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight"
              subtitleClassName="text-gray-700 text-sm sm:text-base mt-1 leading-snug"
            />
            <div className="space-y-4">
              {liveMatches.map((match) => (
                <LiveMatchCard 
                  key={`live-${match.id}`}
                  match={match}
                />
              ))}
            </div>
          </section>
        )}

        {/* No matches state - only check for live matches */}
        {!loading && success && liveMatches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="text-xl font-bold text-woso-cream mb-2">
              {selectedLeague === 'all' ? 'No live matches right now' : `No live matches in ${selectedLeague}`}
            </h3>
            <p className="text-woso-cream/70">
              {selectedLeague === 'all' 
                ? 'Check back later for live women\'s soccer action from around the world!' 
                : 'Try selecting "All Leagues" or choose a different league.'
              }
            </p>
            {selectedLeague !== 'all' && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedLeague('all')}
                className="mt-4"
              >
                View All Leagues
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}








