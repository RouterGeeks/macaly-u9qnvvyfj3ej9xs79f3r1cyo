'use client';

import { useState, useEffect } from 'react';
import { LiveMatch, Standing } from '@/lib/sportsApi';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  loading: boolean;
}

// Hook for fetching live matches
export function useLiveMatches() {
  const [state, setState] = useState<ApiResponse<LiveMatch[]>>({
    success: false,
    loading: true,
  });

  useEffect(() => {
    const fetchLiveMatches = async () => {
      console.log('Hook: Fetching live matches...');
      setState(prev => ({ ...prev, loading: true }));

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(`/api/matches/live?t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Hook: Live matches response:', result);

        if (result.success) {
          setState({
            success: true,
            data: result.matches,
            loading: false,
          });
        } else {
          console.log('Hook: API response unsuccessful:', result);
          setState({
            success: false,
            error: result.error || result.message || 'Failed to fetch live matches',
            loading: false,
          });
        }
      } catch (error) {
        console.error('Hook: Error fetching live matches:', error);
        const errorMessage = error instanceof Error ? error.message : 'Network error';
        const isAborted = errorMessage.includes('aborted') || error.name === 'AbortError';
        
        setState({
          success: false,
          error: isAborted ? 'Request timed out - please try again' : errorMessage,
          loading: false,
        });
      }
    };

    // Delay initial fetch to allow page to load first
    const initialDelay = setTimeout(() => {
      fetchLiveMatches();
    }, 1500);

    // Refresh live matches every 30 seconds after initial fetch
    const interval = setTimeout(() => {
      const refreshInterval = setInterval(fetchLiveMatches, 30000);
      return () => clearInterval(refreshInterval);
    }, 32000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(interval);
    };
  }, []);

  return state;
}

// Hook for fetching fixtures
export function useFixtures(dateFrom?: string, dateTo?: string) {
  console.log('useFixtures hook initialized with:', { dateFrom, dateTo });
  
  const [state, setState] = useState<ApiResponse<LiveMatch[]>>({
    success: false,
    loading: true,
  });

  useEffect(() => {
    const fetchFixtures = async () => {
      console.log('Hook: Fetching fixtures with date range:', { dateFrom, dateTo });
      setState(prev => ({ ...prev, loading: true }));

      try {
        const params = new URLSearchParams();
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(`/api/matches/fixtures?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Hook: Fixtures response:', result);

        if (result.success) {
          setState({
            success: true,
            data: result.matches,
            loading: false,
          });
        } else {
          setState({
            success: false,
            error: result.error || 'Failed to fetch fixtures',
            loading: false,
          });
        }
      } catch (error) {
        console.error('Hook: Error fetching fixtures:', error);
        setState({
          success: false,
          error: error instanceof Error ? error.message : 'Network error',
          loading: false,
        });
      }
    };

    fetchFixtures();
  }, [dateFrom, dateTo]);

  return state;
}

// Hook for fetching standings
export function useStandings(competitionId: number) {
  const [state, setState] = useState<ApiResponse<Standing[]>>({
    success: false,
    loading: true,
  });

  useEffect(() => {
    if (!competitionId) return;

    const fetchStandings = async () => {
      console.log(`Hook: Fetching standings for competition ${competitionId}...`);
      setState(prev => ({ ...prev, loading: true }));

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(`/api/standings/${competitionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Hook: Standings response:', result);

        if (result.success) {
          setState({
            success: true,
            data: result.standings,
            loading: false,
          });
        } else {
          setState({
            success: false,
            error: result.error || 'Failed to fetch standings',
            loading: false,
          });
        }
      } catch (error) {
        console.error('Hook: Error fetching standings:', error);
        setState({
          success: false,
          error: error instanceof Error ? error.message : 'Network error',
          loading: false,
        });
      }
    };

    fetchStandings();
  }, [competitionId]);

  return state;
}

// Hook for today's matches
export function useTodaysMatches() {
  const today = new Date().toISOString().split('T')[0];
  return useFixtures(today, today);
}