import { useState, useEffect, useCallback } from 'react';
import { fetchAllWriteups, clearWriteupsCache } from '../utils/githubWriteupFetcher';
import machinesData from '../Assets/machines.json';

// Custom hook for managing writeups
export const useWriteups = (autoFetch = true, refreshInterval = 300000) => { // 5 minutes default
  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load local writeups as fallback
  const loadLocalWriteups = useCallback(() => {
    try {
      const localWriteups = machinesData.machines.map((machine, index) => ({
        ...machine,
        id: machine.id,
        source: 'local',
        lastUpdated: new Date().toISOString()
      }));
      return localWriteups;
    } catch (error) {
      console.error('Error loading local writeups:', error);
      return [];
    }
  }, []);

  // Fetch writeups from GitHub
  const fetchWriteups = useCallback(async (forceRefresh = false) => {
    if (!autoFetch && !forceRefresh) return;

    setLoading(true);
    setError(null);

    try {
      const githubWriteups = await fetchAllWriteups(forceRefresh);
      
      if (githubWriteups && githubWriteups.length > 0) {
        setWriteups(githubWriteups);
        setLastUpdated(new Date().toISOString());
        console.log(`Loaded ${githubWriteups.length} writeups from GitHub`);
      } else {
        // Fallback to local writeups if GitHub fetch fails
        const localWriteups = loadLocalWriteups();
        setWriteups(localWriteups);
        setLastUpdated(new Date().toISOString());
        console.log(`Fell back to ${localWriteups.length} local writeups`);
      }
    } catch (error) {
      console.error('Error fetching writeups:', error);
      setError(error.message);
      
      // Fallback to local writeups on error
      const localWriteups = loadLocalWriteups();
      setWriteups(localWriteups);
      setLastUpdated(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  }, [autoFetch, loadLocalWriteups]);

  // Manual refresh function
  const refreshWriteups = useCallback(() => {
    clearWriteupsCache();
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
      clearWriteupsCache();
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
