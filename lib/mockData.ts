// Mock data removed - now using live API data only
export interface Team {
  name: string;
  shortName: string;
  logo: string;
  color: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'finished' | 'scheduled';
  minute?: number;
  league: string;
  date: string;
  time: string;
  venue?: string;
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  country: string;
  logo: string;
}

// Empty arrays - all data now comes from live API
export const mockTeams: Team[] = [];
export const mockLeagues: League[] = [];
export const mockMatches: Match[] = [];

// Utility functions now return empty arrays
export const getMatches = (status?: 'live' | 'finished' | 'scheduled') => {
  console.log('Mock data disabled - using live API');
  return [];
};

export const getLiveMatches = () => {
  console.log('Mock data disabled - using live API');
  return [];
};

export const getMatchesByLeague = (league: string) => {
  console.log('Mock data disabled - using live API');
  return [];
};










