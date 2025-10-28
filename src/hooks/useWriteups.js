import { useState, useEffect, useCallback } from 'react';
import { getOptimizedWriteups, clearWriteupCache } from '../utils/optimizedWriteupFetcher';

// Custom hook for managing writeups
export const useWriteups = (autoFetch = true, refreshInterval = 300000) => { // 5 minutes default
  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch writeups (optimized)
  const fetchWriteups = useCallback(async (forceRefresh = false) => {
    if (!autoFetch && !forceRefresh) return;

    setLoading(true);
    setError(null);

    try {
      const writeupsData = await getOptimizedWriteups(forceRefresh);
      
      if (writeupsData && writeupsData.length > 0) {
        setWriteups(writeupsData);
        setLastUpdated(new Date().toISOString());
        console.log(`Loaded ${writeupsData.length} writeups (optimized)`);
      } else {
        setError('No writeups found');
      }
    } catch (error) {
      console.error('Error fetching writeups:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [autoFetch]);

  // Manual refresh function
  const refreshWriteups = useCallback(() => {
    clearWriteupCache();
    fetchWriteups(true);
  }, [fetchWriteups]);

  // Initial load and periodic refresh
  useEffect(() => {
    fetchWriteups();

    // Set up periodic refresh
    const interval = setInterval(() => {
      fetchWriteups();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchWriteups, refreshInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't clear cache on unmount for persistence
    };
  }, []);

  return {
    writeups,
    loading,
    error,
    lastUpdated,
    refreshWriteups,
    refetch: fetchWriteups
  };
};

export default useWriteups;
