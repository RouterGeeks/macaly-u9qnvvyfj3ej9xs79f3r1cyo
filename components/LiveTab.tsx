"use client";

import LiveMatchCard from './LiveMatchCard';
import SectionHeader from './SectionHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Wifi } from 'lucide-react';
import { useLiveMatches } from '@/hooks/useSportsData';
import type { LiveMatch } from '@/lib/sportsApi';

export default function LiveTab() {
  const { data: matches, loading, error, success } = useLiveMatches();

  console.log('LiveTab state:', { matchCount: matches?.length || 0, loading, error, success });

  // Categorize matches
  const allowedLeagues = new Set<string>([
    'NSL', // Canada
    'A-League Women', // Australia
    'Chinese WSL', // China
    'Liga MX Femenil', // Mexico
    'Damallsvenskan', // Sweden
    'Toppserien', // Norway
    'Brasileirão', // Brazil
    'WE League', // Japan
    'NWSL', // USA
    'WSL', // UK
    'Liga F', // Spain
    'D1 Arkema', // France
    'Frauen-Bundesliga', // Germany
    'Concacaf W Champions Cup' // North America
  ]);

  const liveMatches = (matches || []).filter((match) => 
    (match.status === 'LIVE' || match.status === 'IN_PLAY') &&
    allowedLeagues.has(match.competition?.name || '')
  );
  
  const recentResults: LiveMatch[] = [];
  const upcomingMatches: LiveMatch[] = [];

  return (
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
            title="🔴 LIVE NOW!" 
            subtitle={`${liveMatches.length} women's soccer matches happening now`}
            showViewAll={false}
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

      {/* Recent Results */}
      {false && !loading && success && recentResults && recentResults.length > 0 && (
        <section>
          <SectionHeader 
            title="Recent Results" 
            subtitle="Latest finished matches"
            onViewAll={() => console.log('View all recent results')}
          />
          <div className="space-y-4">
            {recentResults.map((match) => (
              <LiveMatchCard key={`result-${match.id}`} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Fixtures */}
      {false && !loading && success && upcomingMatches && upcomingMatches.length > 0 && (
        <section>
          <SectionHeader 
            title="Next Up" 
            subtitle="Upcoming fixtures"
            onViewAll={() => console.log('View all upcoming fixtures')}
          />
          <div className="space-y-4">
            {upcomingMatches.map((match) => (
              <LiveMatchCard key={`upcoming-${match.id}`} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* No matches state */}
      {!loading && success && (!matches || matches.length === 0) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚽</div>
          <h3 className="text-xl font-bold text-woso-cream mb-2">No matches available</h3>
          <p className="text-woso-cream/70">Check back later for live women's soccer action from around the world!</p>
        </div>
      )}
    </div>
  );
}



