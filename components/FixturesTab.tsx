"use client";

import { useState, useMemo } from 'react';
import LiveMatchCard from './LiveMatchCard';
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, AlertCircle, Wifi } from 'lucide-react';
import { useFixtures } from '@/hooks/useSportsData';

export default function FixturesTab() {
  const [selectedDate, setSelectedDate] = useState('today');
  const { data: fixtures, loading, error, success } = useFixtures();

  console.log('FixturesTab state:', { fixtureCount: fixtures?.length || 0, loading, error, success });

  // Calculate date ranges
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Filter fixtures based on selected date
  const filteredFixtures = useMemo(() => {
    if (!fixtures || selectedDate === 'all') return fixtures || [];
    
    return fixtures.filter(fixture => {
      const fixtureDate = new Date(fixture.utcDate);
      const fixtureDateStr = fixtureDate.toISOString().split('T')[0];
      
      switch (selectedDate) {
        case 'today':
          return fixtureDateStr === today;
        case 'tomorrow':
          return fixtureDateStr === tomorrow;
        case 'week':
          const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          return fixtureDateStr >= today && fixtureDateStr <= weekEnd;
        default:
          return true;
      }
    });
  }, [fixtures, selectedDate, today, tomorrow]);

  // Group fixtures by competition
  const fixturesByCompetition = useMemo(() => {
    const grouped: { [key: string]: typeof filteredFixtures } = {};
    filteredFixtures.forEach(fixture => {
      const competitionName = fixture.competition.name || 'Other Competitions';
      if (!grouped[competitionName]) {
        grouped[competitionName] = [];
      }
      grouped[competitionName].push(fixture);
    });
    
    // Sort matches within each competition by date (earliest upcoming first, then most recent finished)
    Object.keys(grouped).forEach(competitionName => {
      grouped[competitionName].sort((a, b) => {
        const now = new Date();
        const aDate = new Date(a.utcDate);
        const bDate = new Date(b.utcDate);
        
        // Upcoming matches first (earliest first)
        if (aDate >= now && bDate >= now) {
          return aDate.getTime() - bDate.getTime();
        }
        
        // Past matches second (most recent first)
        if (aDate < now && bDate < now) {
          return bDate.getTime() - aDate.getTime();
        }
        
        // Mixed: upcoming before past
        if (aDate >= now && bDate < now) return -1;
        if (aDate < now && bDate >= now) return 1;
        
        return 0;
      });
    });
    
    return grouped;
  }, [filteredFixtures]);

  const filterButtons = [
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'week', label: 'This Week' },
    { id: 'all', label: 'All' }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <SectionHeader 
        title="Fixtures & Results" 
        subtitle="All matches across women's football"
        showViewAll={false}
      />

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Wifi className="h-4 w-4 animate-pulse" />
            <span>Loading fixtures and results...</span>
          </div>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
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
              Fixture data may be temporarily unavailable.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Content - only show when not loading */}
      {!loading && success && (
        <>
          {/* Date Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filterButtons.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedDate === filter.id ? "default" : "outline"}
                onClick={() => {
                  console.log('Date filter selected:', filter.id);
                  setSelectedDate(filter.id);
                }}
                className={`whitespace-nowrap ${
                  selectedDate === filter.id 
                    ? 'bg-wosolive-gradient border-0 text-white hover:opacity-90' 
                    : 'border-woso-purple text-woso-purple hover:bg-woso-purple/10'
                }`}
              >
                <Calendar size={16} className="mr-2" />
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Competitions Section */}
          {Object.keys(fixturesByCompetition).length > 0 && (
            <div className="space-y-6">
              {Object.entries(fixturesByCompetition).map(([competitionName, matches]) => (
                <section key={competitionName}>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">⚽</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900" data-macaly="competition-name">
                        {competitionName}
                      </h3>
                      <p className="text-sm text-gray-600">{matches.length} matches</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <LiveMatchCard key={`fixture-${match.id}`} match={match} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}

      {/* No fixtures state */}
      {!loading && success && filteredFixtures.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">No fixtures found</h3>
          <p className="text-gray-500">
            {selectedDate === 'all' 
              ? 'Check back later for upcoming matches' 
              : `No matches found for ${selectedDate === 'today' ? 'today' : selectedDate === 'tomorrow' ? 'tomorrow' : 'the selected period'}`}
          </p>
        </div>
      )}
    </div>
  );
}