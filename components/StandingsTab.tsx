




"use client";

import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, TrendingUp, TrendingDown, AlertCircle, Wifi, Filter } from 'lucide-react';
import { useStandings } from '@/hooks/useSportsData';

// League ordering data
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

// Map league names to competition IDs and create ordered competitions list
const getOrderedCompetitions = () => {
  const competitionMap: { [key: string]: { id: number; logo: string } } = {
    "National Women's Soccer League": { id: 4521, logo: "🇺🇸" },
    "USL Super League Women": { id: 5498, logo: "🇺🇸" },
    "Liga MX Femenil": { id: 5206, logo: "🇲🇽" },
    "Northern Super League": { id: 5602, logo: "🇨🇦" },
    "FA Women's Super League": { id: 4849, logo: "🏴" },
    "Frauen-Bundesliga": { id: 5204, logo: "🇩🇪" },
    // Ensure both accented and non-accented keys map correctly
    "Division 1 Féminine": { id: 5010, logo: "🇫🇷" },
    "Division 1 Feminine": { id: 5010, logo: "🇫🇷" },
    "Serie A Women": { id: 5205, logo: "🇮🇹" },
    "Liga F": { id: 5013, logo: "🇪🇸" },
    "Primera Division Femenina": { id: 5013, logo: "🇪🇸" }, // Same as Liga F
    "Eredivisie Women": { id: 5207, logo: "🇳🇱" },
    "Scottish Women's Premier League": { id: 5223, logo: "🏴" },
    "Damallsvenskan": { id: 5014, logo: "🇸🇪" },
    "Toppserien Women": { id: 5015, logo: "🇳🇴" },
    "NIFL Women's Premiership": { id: 5224, logo: "🇬🇧" },
    "WE League": { id: 5016, logo: "🇯🇵" },
    "WK League": { id: 5225, logo: "🇰🇷" },
    "A-League Women": { id: 4805, logo: "🇦🇺" },
    "Indian Women's League": { id: 5226, logo: "🇮🇳" },
    // Ensure both accented and non-accented keys map correctly
    "Brasileirão Feminino A1": { id: 5201, logo: "🇧🇷" },
    "Brasileirao Feminino A1": { id: 5201, logo: "🇧🇷" },
    "Primera Division A Women (Argentina)": { id: 5227, logo: "🇦🇷" },
    "Hollywoodbets Super League": { id: 5228, logo: "🇿🇦" },
    "CAF Women's Champions League": { id: 5210, logo: "🌍" }
  };

  // Order by rank from LEAGUES_ORDER
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

// Available competitions ordered by rank
const domesticCompetitions = getOrderedCompetitions();

export default function StandingsTab() {
  const [selectedLeague, setSelectedLeague] = useState(4521); // Default to NWSL
  const { data: standings, loading, error, success } = useStandings(selectedLeague);

  console.log('StandingsTab state:', { 
    selectedLeague, 
    standingsCount: standings?.length || 0, 
    loading, 
    error, 
    success 
  });

  const selectedCompetition = domesticCompetitions.find(comp => comp.id === selectedLeague) || domesticCompetitions[0];

  const getFormIcon = (result: string) => {
    switch (result) {
      case 'W':
        return <div className="w-4 h-4 bg-green-500 rounded-full text-xs text-white flex items-center justify-center font-bold">W</div>;
      case 'D':
        return <div className="w-4 h-4 bg-yellow-500 rounded-full text-xs text-white flex items-center justify-center font-bold">D</div>;
      case 'L':
        return <div className="w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">L</div>;
      default:
        return null;
    }
  };

  const getPositionChange = (position: number) => {
    // Mock position changes
    if (position <= 2) return <TrendingUp className="text-green-500" size={16} />;
    if (position >= 7) return <TrendingDown className="text-red-500" size={16} />;
    return null;
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <SectionHeader 
        title="League Tables" 
        subtitle="Current standings for domestic women's soccer leagues worldwide"
        showViewAll={false}
        titleClassName="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight"
        subtitleClassName="text-gray-700 text-sm sm:text-base mt-1 leading-snug"
      />

      {/* Sticky Sub-Navigation */}
      <div className="sticky top-0 z-10 sticky-nav-blur -mx-2 sm:-mx-4 px-2 sm:px-4 py-2">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-3 w-3 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">Competition Filter:</span>
        </div>
        
        {/* League Filter - Domestic Only */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {domesticCompetitions.map((competition) => (
            <Button
              key={competition.id}
              variant={selectedLeague === competition.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log('Competition selected:', competition.id);
                setSelectedLeague(competition.id);
              }}
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
            <span>Loading {selectedCompetition.shortName} standings...</span>
          </div>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert className="border-red-200 bg-red-50 mb-6">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>Connection Issue:</strong> {error}
            <br />
            <span className="text-sm text-red-600 mt-1 block">
              Standings data may be temporarily unavailable.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Content - only show when not loading */}
      {!loading && (
        <>
          {/* Standings Table */}
          {success && standings && standings.length > 0 && (
            <Card className="overflow-hidden">
              <div className="bg-woso-purple p-4">
                <div className="flex items-center space-x-2 text-white">
                  <Trophy size={20} />
                  <h3 className="font-bold text-lg">{selectedCompetition.name}</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {standings.length} teams
                  </Badge>
                </div>
              </div>

              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-2 p-4 bg-gray-50 text-xs font-semibold text-gray-600 border-b">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Team</div>
                <div className="col-span-1">P</div>
                <div className="col-span-1">W</div>
                <div className="col-span-1">D</div>
                <div className="col-span-1">L</div>
                <div className="col-span-1">GD</div>
                <div className="col-span-1">Pts</div>
                <div className="col-span-2">Form</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y">
                {standings.map((team) => (
                  <div key={team.position} className="p-4 hover:bg-gray-50 transition-colors">
                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg w-6">{team.position}</span>
                            {getPositionChange(team.position)}
                          </div>

                          <div>
                            <div className="font-semibold" data-macaly="team-name">{team.team.name}</div>
                            <div className="text-sm text-gray-600">{team.playedGames} played</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-woso-purple">{team.points}</div>
                          <div className="text-sm text-gray-600">pts</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {team.won}W {team.draw}D {team.lost}L | GD: {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-12 gap-2 items-center">
                      <div className="col-span-1 flex items-center space-x-1">
                        <span className="font-bold">{team.position}</span>
                        {getPositionChange(team.position)}
                      </div>
                      <div className="col-span-3 flex items-center space-x-3">
                        <span className="font-semibold" data-macaly="team-name">{team.team.name}</span>
                      </div>
                      <div className="col-span-1">{team.playedGames}</div>
                      <div className="col-span-1">{team.won}</div>
                      <div className="col-span-1">{team.draw}</div>
                      <div className="col-span-1">{team.lost}</div>
                      <div className="col-span-1">
                        <span className={team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-600' : ''}>
                          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                        </span>
                      </div>
                      <div className="col-span-1 font-bold text-woso-purple">{team.points}</div>
                      <div className="col-span-2">
                        <span className="text-xs text-gray-500">Form: N/A</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* No standings state */}
      {!loading && success && (!standings || standings.length === 0) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Standings Available</h3>
          <p className="text-gray-500">Standings data for {selectedCompetition.name} is not currently available.</p>
          <p className="text-sm text-gray-400 mt-2">Try selecting a different competition from the filters above.</p>
        </div>
      )}

      {/* Legend */}
      <div className="text-xs text-gray-600 space-y-1">
        <div>P: Played, W: Won, D: Draw, L: Lost, GD: Goal Difference, Pts: Points</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <TrendingUp className="text-green-500" size={12} />
            <span>Position improved</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingDown className="text-red-500" size={12} />
            <span>Position declined</span>
          </div>
        </div>
      </div>
    </div>
  );
}






