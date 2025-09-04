"use client";

import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, TrendingUp, TrendingDown, AlertCircle, Wifi } from 'lucide-react';
import { useStandings } from '@/hooks/useSportsData';

// Available competitions with comprehensive global coverage
const availableCompetitions = [
  // North America
  { id: 5013, name: "NWSL", shortName: "NWSL", logo: "🇺🇸" },
  { id: 5012, name: "NSL", shortName: "NSL", logo: "🇨🇦" },
  { id: 5021, name: "Liga MX Femenil", shortName: "Liga MX", logo: "🇲🇽" },
  { id: 5027, name: "Concacaf W Champions Cup", shortName: "Concacaf W", logo: "🏆" },
  
  // Europe - Top Tier  
  { id: 5014, name: "WSL", shortName: "WSL", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 5015, name: "Liga F", shortName: "Liga F", logo: "🇪🇸" },
  { id: 5016, name: "D1 Arkema", shortName: "D1 Arkema", logo: "🇫🇷" },
  { id: 5017, name: "Frauen-Bundesliga", shortName: "Bundesliga", logo: "🇩🇪" },
  { id: 5022, name: "Damallsvenskan", shortName: "Damallsvenskan", logo: "🇸🇪" },
  { id: 5023, name: "Toppserien", shortName: "Toppserien", logo: "🇳🇴" },
  { id: 5024, name: "Brasileirão", shortName: "Brasileirão", logo: "🇧🇷" },
  
  // Asia & Global Expansion
  { id: 5018, name: "WE League", shortName: "WE League", logo: "🇯🇵" },
  { id: 5020, name: "A-League Women", shortName: "A-League W", logo: "🇦🇺" },
  { id: 5025, name: "Chinese WSL", shortName: "China WSL", logo: "🇨🇳" },
];



export default function StandingsTab() {
  const [selectedLeague, setSelectedLeague] = useState(5013); // Default to NWSL
  const { data: standings, loading, error, success } = useStandings(selectedLeague);

  console.log('StandingsTab state:', { 
    selectedLeague, 
    standingsCount: standings?.length || 0, 
    loading, 
    error, 
    success 
  });

  const selectedCompetition = availableCompetitions.find(comp => comp.id === selectedLeague) || availableCompetitions[0];

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
        subtitle="Current standings across all competitions"
        showViewAll={false}
      />

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
          {/* League Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {availableCompetitions.map((competition) => (
              <Button
                key={competition.id}
                variant={selectedLeague === competition.id ? "default" : "outline"}
                onClick={() => {
                  console.log('Competition selected:', competition.id);
                  setSelectedLeague(competition.id);
                }}
                className={`whitespace-nowrap ${
                  selectedLeague === competition.id 
                    ? 'bg-wosolive-gradient border-0 text-white hover:opacity-90' 
                    : 'border-woso-purple text-woso-purple hover:bg-woso-purple/10'
                }`}
              >
                <span className="mr-2">{competition.logo}</span>
                {competition.shortName}
              </Button>
            ))}
          </div>

          {/* Standings Table */}
          {success && standings && standings.length > 0 && (
            <Card className="overflow-hidden">
              <div className="bg-wosolive-gradient p-4">
                <div className="flex items-center space-x-2 text-white">
                  <Trophy size={20} />
                  <h3 className="font-bold text-lg">{selectedCompetition.name}</h3>
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


