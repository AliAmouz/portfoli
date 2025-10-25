import { useState, useEffect, useCallback } from 'react';
import { getOptimizedProjects, clearProjectCache } from '../utils/optimizedProjectFetcher';

// Custom hook for managing projects
export const useProjects = (autoFetch = true, refreshInterval = 600000) => { // 10 minutes default
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch projects from GitHub (optimized)
  const fetchProjects = useCallback(async (forceRefresh = false) => {
    if (!autoFetch && !forceRefresh) return;

    setLoading(true);
    setError(null);

    try {
      const githubProjects = await getOptimizedProjects(forceRefresh);
      
      if (githubProjects && githubProjects.length > 0) {
        setProjects(githubProjects);
        setLastUpdated(new Date().toISOString());
        console.log(`Loaded ${githubProjects.length} projects (optimized)`);
      } else {
        setError('No projects found');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [autoFetch]);

  // Manual refresh function
  const refreshProjects = useCallback(() => {
    clearProjectCache();
    fetchProjects(true);
  }, [fetchProjects]);

  // Initial load and periodic refresh
  useEffect(() => {
    fetchProjects();

    // Set up periodic refresh
    const interval = setInterval(() => {
      fetchProjects();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchProjects, refreshInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't clear cache on unmount for persistence
    };
  }, []);

  return {
    projects,
    loading,
    error,
    lastUpdated,
    refreshProjects,
    refetch: fetchProjects
  };
};

export default useProjects;
