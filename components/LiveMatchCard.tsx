"use client";

import { LiveMatch } from '@/lib/sportsApi';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';

interface LiveMatchCardProps {
  match: LiveMatch;
}

export default function LiveMatchCard({ match }: LiveMatchCardProps) {
  console.log('LiveMatchCard rendered for match:', match.id);

  const getStatusBadge = () => {
    switch (match.status) {
      case 'LIVE':
      case 'IN_PLAY':
        return (
          <Badge className="bg-woso-gradient-electric text-woso-cream font-black shadow-xl border border-woso-purple-400">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>LIVE {match.minute ? `${match.minute}'` : ''}
          </Badge>
        );
      case 'FINISHED':
        return (
          <Badge variant="secondary" className="bg-woso-gray-700 text-woso-cream font-black shadow-lg">
            FT
          </Badge>
        );
      case 'PAUSED':
        return (
          <Badge className="bg-yellow-500 text-white font-bold">
            HT
          </Badge>
        );
      case 'SCHEDULED':
        const matchTime = new Date(match.utcDate).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        return (
          <Badge variant="outline" className="border-woso-blue text-woso-blue font-bold">
            {matchTime}
          </Badge>
        );
      case 'POSTPONED':
        return (
          <Badge variant="destructive" className="bg-red-600 text-white font-bold">
            POSTPONED
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="destructive" className="bg-red-600 text-white font-bold">
            CANCELLED
          </Badge>
        );
      default:
        return null;
    }
  };

  const getScoreDisplay = () => {
    if (match.status === 'SCHEDULED') {
      return (
        <div className="text-center">
          <div className="inline-flex items-center justify-center text-lg md:text-2xl font-black text-woso-purple-400 bg-woso-black/60 px-2 py-1 rounded-lg whitespace-nowrap leading-none tracking-tight w-[72px] md:w-[96px]">vs</div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center text-xl md:text-3xl font-black text-woso-cream bg-woso-black/80 px-2 py-1 rounded-lg shadow-xl border border-woso-purple-400 whitespace-nowrap leading-none tracking-tight w-[88px] md:w-[108px]">
          {match.score?.fullTime?.home ?? 0} - {match.score?.fullTime?.away ?? 0}
        </div>
      </div>
    );
  };

  return (
    <Card className={`p-4 bg-woso-gradient-card border border-woso-purple-500/40 shadow-2xl hover:shadow-3xl hover:border-woso-teal-400/70 transition-all duration-300 backdrop-blur-lg ${
      (match.status === 'LIVE' || match.status === 'IN_PLAY') ? 'ring-2 ring-woso-purple-500 border-l-4 border-l-woso-teal-400 shadow-woso-purple-500/30' : ''
    }`}>
      {/* League and Status */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-bold text-woso-teal-400 uppercase tracking-wide" data-macaly="match-league">
          {(match as any).competition?.name || (match as any).league || 'Unknown League'}
        </div>
        {getStatusBadge()}
      </div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between mb-4 gap-2">
        {/* Home Team */}
        <div className="flex-1 text-center">
          <div className="flex justify-center mb-2" data-macaly="home-team-logo">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img 
                src={match.homeTeam.crest} 
                alt={`${match.homeTeam.name} logo`}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '⚽';
                }}
              />
            </div>
          </div>
          <div className="font-black text-woso-cream text-sm leading-tight" data-macaly="home-team-name">
            {match.homeTeam.shortName}
          </div>
        </div>

        {/* Score */}
        <div className="flex-1 px-4">
          {getScoreDisplay()}
        </div>

        {/* Away Team */}
        <div className="flex-1 text-center">
          <div className="flex justify-center mb-2" data-macaly="away-team-logo">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img 
                src={match.awayTeam.crest} 
                alt={`${match.awayTeam.name} logo`}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '⚽';
                }}
              />
            </div>
          </div>
          <div className="font-black text-woso-cream text-sm leading-tight" data-macaly="away-team-name">
            {match.awayTeam.shortName}
          </div>
        </div>
      </div>

      {/* Match Details */}
      {(match.venue || match.utcDate) && (
        <div className="flex items-center justify-center space-x-4 text-xs text-woso-purple-600 border-t border-woso-purple-200 pt-3">
          {match.venue && match.venue !== 'TBD' && (
            <div className="flex items-center space-x-1">
              <MapPin size={12} />
              <span data-macaly="match-venue">{match.venue}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span data-macaly="match-date">
              {new Date(match.utcDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
