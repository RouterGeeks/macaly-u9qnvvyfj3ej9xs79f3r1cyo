




"use client";

import { useState, useEffect } from 'react';
import LiveMatchCard from './LiveMatchCard';
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, AlertCircle, Wifi, Filter } from 'lucide-react';

// League ordering data (same as StandingsTab)
const LEAGUES_ORDER = [
  { "name": "National Women's Soccer League", "short": "NWSL", "country": "USA", "region": "North America", "rank": 1 },
  { "name": "USL Super League Women", "short": "USL SP", "country": "USA", "region": "North America", "rank": 2 },
  { "name": "Liga MX Femenil", "short": "Liga MX Femenil", "country": "Mexico", "region": "North America", "rank": 3 },
  { "name": "Northern Super League", "short": "NSL", "country": "Canada", "region": "North America", "rank": 4 },
  { "name": "FA Women's Super League", "short": "WSL", "country": "England", "region": "Europe", "rank": 5 },
  { "name": "Frauen-Bundesliga", "short": "Bundesliga", "country": "Germany", "region": "Europe", "rank": 6 },
  { "name": "Division 1 Féminine", "short": "D1F", "country": "France", "region": "Europe", "rank": 7 },
  { "name": "Serie A Women", "short": "Serie A", "country": "Italy", "region": "Europe", "rank": 8 },
  { "name": "Liga F", "short": "Liga F", "country": "Spain", "region": "Europe", "rank": 9 },
  { "name": "Primera Division Femenina", "short": "Primera F", "country": "Spain", "region": "Europe", "rank": 10 },
  { "name": "Eredivisie Women", "short": "Eredivisie", "country": "Netherlands", "region": "Europe", "rank": 11 },
  { "name": "Scottish Women's Premier League", "short": "SWPL", "country": "Scotland", "region": "Europe", "rank": 12 },
  { "name": "Damallsvenskan", "short": "Damallsvenskan", "country": "Sweden", "region": "Europe", "rank": 13 },
  { "name": "Toppserien Women", "short": "Toppserien", "country": "Norway", "region": "Europe", "rank": 14 },
  { "name": "NIFL Women's Premiership", "short": "NIFL Premiership", "country": "Northern Ireland", "region": "Europe", "rank": 15 },
  { "name": "WE League", "short": "WE League", "country": "Japan", "region": "Asia & Oceania", "rank": 16 },
  { "name": "WK League", "short": "WK League", "country": "South Korea", "region": "Asia & Oceania", "rank": 17 },
  { "name": "A-League Women", "short": "A-League", "country": "Australia", "region": "Asia & Oceania", "rank": 18 },
  { "name": "Indian Women's League", "short": "IWL", "country": "India", "region": "Asia & Oceania", "rank": 19 },
  { "name": "Brasileirão Feminino A1", "short": "Brasileirão A1", "country": "Brazil", "region": "South America", "rank": 20 },
  { "name": "Primera Division A Women (Argentina)", "short": "Primera A", "country": "Argentina", "region": "South America", "rank": 21 },
  { "name": "Hollywoodbets Super League", "short": "Hollywoodbets", "country": "South Africa", "region": "Africa", "rank": 22 },
  { "name": "CAF Women's Champions League", "short": "CAF WCL", "country": "Africa", "region": "Africa", "rank": 23 }
];

// Map league names to competition IDs
const getOrderedCompetitions = () => {
  const competitionMap: { [key: string]: { id: number; logo: string } } = {
    "National Women's Soccer League": { id: 4521, logo: "🇺🇸" },
    "USL Super League Women": { id: 5498, logo: "🇺🇸" },
    "Liga MX Femenil": { id: 5206, logo: "🇲🇽" },
    "Northern Super League": { id: 5602, logo: "🇨🇦" },
    "FA Women's Super League": { id: 4849, logo: "🏴" },
    "Frauen-Bundesliga": { id: 5204, logo: "🇩🇪" },
    "Division 1 Féminine": { id: 5010, logo: "🇫🇷" },
    "Division 1 Feminine": { id: 5010, logo: "🇫🇷" },
    "Serie A Women": { id: 5205, logo: "🇮🇹" },
    "Liga F": { id: 5013, logo: "🇪🇸" },
    "Primera Division Femenina": { id: 5013, logo: "🇪🇸" },
    "Eredivisie Women": { id: 5207, logo: "🇳🇱" },
    "Scottish Women's Premier League": { id: 5223, logo: "🏴" },
    "Damallsvenskan": { id: 5014, logo: "🇸🇪" },
    "Toppserien Women": { id: 5015, logo: "🇳🇴" },
    "NIFL Women's Premiership": { id: 5224, logo: "🇬🇧" },
    "WE League": { id: 5016, logo: "🇯🇵" },
    "WK League": { id: 5225, logo: "🇰🇷" },
    "A-League Women": { id: 4805, logo: "🇦🇺" },
    "Indian Women's League": { id: 5226, logo: "🇮🇳" },
    "Brasileirão Feminino A1": { id: 5201, logo: "🇧🇷" },
    "Brasileirao Feminino A1": { id: 5201, logo: "🇧🇷" },
    "Primera Division A Women (Argentina)": { id: 5227, logo: "🇦🇷" },
    "Hollywoodbets Super League": { id: 5228, logo: "🇿🇦" },
    "CAF Women's Champions League": { id: 5210, logo: "🌍" }
  };

  const ordered = LEAGUES_ORDER
    .sort((a, b) => a.rank - b.rank)
    .map(league => {
      const comp = competitionMap[league.name];
      if (!comp) {
        console.warn('Missing competition mapping for league:', league.name);
        return null;
      }
      return {
        id: comp.id,
        name: league.name,
        shortName: league.short,
        logo: comp.logo
      };
    })
    .filter(Boolean) as Array<{ id: number; name: string; shortName: string; logo: string }>;

  return ordered;
};

const domesticCompetitions = getOrderedCompetitions();

// Helper function to get date range
const getDateRange = (period: string) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(today.getDate() + 7);

  switch (period) {
    case 'today':
      return {
        dateFrom: today.toISOString().split('T')[0],
        dateTo: today.toISOString().split('T')[0]
      };
    case 'tomorrow':
      return {
        dateFrom: tomorrow.toISOString().split('T')[0],
        dateTo: tomorrow.toISOString().split('T')[0]
      };
    case 'week':
      return {
        dateFrom: today.toISOString().split('T')[0],
        dateTo: weekFromNow.toISOString().split('T')[0]
      };
    default:
      return {
        dateFrom: today.toISOString().split('T')[0],
        dateTo: today.toISOString().split('T')[0]
      };
  }
};

export default function FixturesTab() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null); // null means all leagues
  const [mounted, setMounted] = useState(false);

  console.log('FixturesTab: Component rendering, loading:', loading, 'fixtures count:', fixtures.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    console.log('FixturesTab: useEffect triggered, selectedDate:', selectedDate, 'selectedLeague:', selectedLeague);
    
    const fetchData = async () => {
      console.log('FixturesTab: fetchData called');
      try {
        setLoading(true);
        setError(null);
        
        const { dateFrom, dateTo } = getDateRange(selectedDate);
        const url = `/api/matches/fixtures?dateFrom=${dateFrom}&dateTo=${dateTo}`;
        console.log('FixturesTab: Fetching from:', url);
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('FixturesTab: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('FixturesTab: Response data received, matches count:', data.matches?.length || 0);
        
        if (data.success && data.matches) {
          // Apply client-side league filtering - first filter to women's leagues only
          let filteredMatches = data.matches.filter((match: any) => {
            return domesticCompetitions.some(c => c.id === match.competition.id);
          });
          console.log('FixturesTab: After women\'s league filter:', filteredMatches.length, 'matches');
          
          if (selectedLeague) {
            filteredMatches = filteredMatches.filter((match: any) => {
              // Check if match belongs to selected league using competition.id
              return match.competition && match.competition.id === selectedLeague;
            });
            console.log('FixturesTab: Filtered to', filteredMatches.length, 'matches for league', selectedLeague);
          }
          
          setFixtures(filteredMatches);
          console.log('FixturesTab: Set fixtures:', filteredMatches.length, 'matches');
        } else {
          setError(data.error || 'No data available');
          console.log('FixturesTab: Error:', data.error);
        }
      } catch (err) {
        console.error('FixturesTab: Fetch error:', err);
        setError(`Failed to load fixtures: ${err.message}`);
      } finally {
        setLoading(false);
        console.log('FixturesTab: Loading complete, setting loading to false');
      }
    };

    fetchData();
  }, [mounted, selectedDate, selectedLeague]);

  console.log('FixturesTab: Render state - loading:', loading, 'error:', error, 'fixtures:', fixtures.length);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <SectionHeader
        title="Fixtures & Results"
        subtitle="All matches across women's football"
        showViewAll={false}
      />

      {/* Date Filter */}
      <div className="flex space-x-2 mb-4">
        <Button
          variant={selectedDate === 'today' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDate('today')}
        >
          Today
        </Button>
        <Button
          variant={selectedDate === 'tomorrow' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDate('tomorrow')}
        >
          Tomorrow
        </Button>
        <Button
          variant={selectedDate === 'week' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDate('week')}
        >
          This Week
        </Button>
      </div>

      {/* League Filter */}
      <div className="sticky top-0 z-10 sticky-nav-blur -mx-2 sm:-mx-4 px-2 sm:px-4 py-2">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-3 w-3 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">League Filter:</span>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={selectedLeague === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLeague(null)}
            className={`whitespace-nowrap font-normal text-xs ${
              selectedLeague === null 
                ? 'bg-woso-purple-500 text-white hover:bg-woso-purple-600 border-woso-purple-500' 
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
            }`}
          >
            All Leagues
          </Button>
          {domesticCompetitions.map((competition) => (
            <Button
              key={competition.id}
              variant={selectedLeague === competition.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLeague(competition.id)}
              className={`whitespace-nowrap font-normal text-xs ${
                selectedLeague === competition.id 
                  ? 'bg-woso-purple-500 text-white hover:bg-woso-purple-600 border-woso-purple-500' 
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{competition.logo}</span>
              {competition.shortName}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Wifi className="h-4 w-4 animate-pulse" />
            <span>Loading fixtures...</span>
          </div>
          <div className="text-sm text-gray-500">
            <p>⏳ Fetching data from TheSportsDB API (this may take 10-15 seconds)</p>
            <p>🌍 Loading women's soccer matches...</p>
          </div>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {fixtures.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">
                Found {fixtures.length} fixture{fixtures.length !== 1 ? 's' : ''}
                {selectedLeague && ` for ${domesticCompetitions.find(c => c.id === selectedLeague)?.shortName || 'selected league'}`}
              </h3>
              {fixtures.slice(0, 20).map((match) => (
                <LiveMatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚽</div>
              <h3 className="text-xl font-bold mb-2">No fixtures found</h3>
              <p className="text-gray-600">
                No matches available for the selected date{selectedLeague ? ' and league' : ''}.
              </p>
              {(selectedDate !== 'today' || selectedLeague) && (
                <p className="text-sm text-gray-400 mt-2">
                  Try selecting "Today" or "All Leagues" to see more matches.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}







