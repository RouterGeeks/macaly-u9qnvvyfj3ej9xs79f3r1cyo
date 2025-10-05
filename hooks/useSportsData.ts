'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

        if (result.success) {
          // Defense-in-depth: ensure only truly live matches are stored
          const filtered = Array.isArray(result.matches)
            ? result.matches.filter((m: any) => m?.status === 'LIVE' || m?.status === 'IN_PLAY')
            : [];
          setState({
            success: true,
            data: filtered,
            loading: false,
          });
        } else {
          setState({
            success: false,
            error: result.error || result.message || 'Failed to fetch live matches',
            loading: false,
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Network error';
        const isAborted = errorMessage.includes('aborted') || (error as any).name === 'AbortError';
        
        setState({
          success: false,
          error: isAborted ? 'Request timed out - please try again' : errorMessage,
          loading: false,
        });
      }
    };

    // Initial fetch
    fetchLiveMatches();

    // Refresh every 60 seconds
    const intervalId = setInterval(fetchLiveMatches, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return state;
}

// Hook for fetching fixtures - SIMPLIFIED VERSION
export function useFixtures(dateFrom?: string, dateTo?: string) {
  console.log('🚀 useFixtures called with:', { dateFrom, dateTo });
  
  const [state, setState] = useState<ApiResponse<LiveMatch[]>>({
    success: false,
    loading: true,
  });

  // Create a stable reference for the fetch function
  const fetchFixtures = useCallback(async () => {
    console.log('🔥 fetchFixtures executing with:', { dateFrom, dateTo });
    
    setState(prev => ({ ...prev, loading: true }));

    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const url = `/api/matches/fixtures?${params.toString()}&t=${Date.now()}`;
      console.log('🌐 Making API call to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ API response received:', { success: result.success, matchCount: result.matches?.length });

      setState({
        success: result.success,
        data: result.matches || [],
        loading: false,
        error: result.success ? undefined : (result.error || 'Failed to fetch fixtures')
      });
    } catch (error) {
      console.error('❌ Error in fetchFixtures:', error);
      setState({
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        loading: false,
      });
    }
  }, [dateFrom, dateTo]);

  // Execute immediately on mount and when dependencies change
  useEffect(() => {
    console.log('🔥 useEffect triggered, calling fetchFixtures');
    fetchFixtures();
    
    // Set up interval
    const interval = setInterval(() => {
      console.log('⏰ Interval tick, calling fetchFixtures');
      fetchFixtures();
    }, 60000);

    return () => {
      console.log('🧹 Cleaning up interval');
      clearInterval(interval);
    };
  }, [fetchFixtures]);

  console.log('🔄 useFixtures returning state:', { 
    loading: state.loading, 
    success: state.success, 
    dataLength: state.data?.length,
    error: state.error 
  });

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
























