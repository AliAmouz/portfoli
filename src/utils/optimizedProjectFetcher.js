// Optimized Project Fetcher - Backend caching with minimal API calls
// This utility handles efficient project fetching with smart caching

import { PROJECT_CONFIG } from '../config/projectConfig';

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: 'github_projects_cache',
  LAST_FETCH: 'github_projects_last_fetch',
  FETCH_COUNT: 'github_projects_fetch_count'
};

// Cache settings
const CACHE_SETTINGS = {
  DURATION: 24 * 60 * 60 * 1000, // 24 hours
  MAX_FETCHES_PER_DAY: 3, // Maximum API calls per day
  MIN_FETCH_INTERVAL: 2 * 60 * 60 * 1000 // 2 hours minimum between fetches
};

/**
 * Get cached projects from localStorage
 */
export const getCachedProjects = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const lastFetch = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
    
    if (cached && lastFetch) {
      const cacheAge = Date.now() - parseInt(lastFetch);
      if (cacheAge < CACHE_SETTINGS.DURATION) {
        console.log('📦 Using cached projects');
        return JSON.parse(cached);
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading cached projects:', error);
    return null;
  }
};

/**
 * Save projects to localStorage
 */
export const saveCachedProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEYS.LAST_FETCH, Date.now().toString());
    console.log('💾 Projects cached successfully');
  } catch (error) {
    console.error('Error caching projects:', error);
  }
};

/**
 * Check if we should fetch from API
 */
export const shouldFetchFromAPI = () => {
  try {
    const lastFetch = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
    const fetchCount = parseInt(localStorage.getItem(STORAGE_KEYS.FETCH_COUNT) || '0');
    const today = new Date().toDateString();
    const lastFetchDate = lastFetch ? new Date(parseInt(lastFetch)).toDateString() : null;
    
    // Reset daily counter
    if (lastFetchDate !== today) {
      localStorage.setItem(STORAGE_KEYS.FETCH_COUNT, '0');
    }
    
    // Check if we've exceeded daily limit
    if (fetchCount >= CACHE_SETTINGS.MAX_FETCHES_PER_DAY) {
      console.log('🚫 Daily API limit reached');
      return false;
    }
    
    // Check minimum interval
    if (lastFetch) {
      const timeSinceLastFetch = Date.now() - parseInt(lastFetch);
      if (timeSinceLastFetch < CACHE_SETTINGS.MIN_FETCH_INTERVAL) {
        console.log('⏰ Too soon since last fetch');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking fetch conditions:', error);
    return true;
  }
};

/**
 * Increment fetch counter
 */
export const incrementFetchCounter = () => {
  try {
    const count = parseInt(localStorage.getItem(STORAGE_KEYS.FETCH_COUNT) || '0');
    localStorage.setItem(STORAGE_KEYS.FETCH_COUNT, (count + 1).toString());
  } catch (error) {
    console.error('Error incrementing fetch counter:', error);
  }
};

/**
 * Fast GitHub API call - only get essential data
 */
export const fetchProjectsFast = async () => {
  try {
    console.log('🚀 Fast fetch from GitHub API...');
    const { username, apiUrl, maxRepos } = PROJECT_CONFIG.github;
    const url = `${apiUrl}/users/${username}/repos?sort=updated&per_page=${maxRepos}&type=all`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repos = await response.json();
    console.log(`✅ Fetched ${repos.length} repositories`);
    
    // Process repositories quickly
    const projects = repos
      .filter(repo => !PROJECT_CONFIG.github.excludeRepos.includes(repo.name))
      .map(repo => ({
        id: repo.id,
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || `A ${repo.language || 'Project'} project: ${repo.name}`,
        imgPath: getRandomFallbackImage(),
        ghLink: repo.html_url,
        demoLink: repo.homepage || null,
        language: repo.language || 'Other',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated: repo.updated_at,
        topics: repo.topics || [],
        technologies: getTechnologiesFast(repo),
        isBlog: false,
        source: 'github',
        lastFetched: new Date().toISOString()
      }))
      .sort((a, b) => b.stars - a.stars || new Date(b.updated) - new Date(a.updated));
    
    // Cache the results
    saveCachedProjects(projects);
    incrementFetchCounter();
    
    return projects;
  } catch (error) {
    console.error('Error in fast fetch:', error);
    return getCachedProjects() || [];
  }
};

/**
 * Get technologies quickly without extra API calls
 */
export const getTechnologiesFast = (repo) => {
  const technologies = [];
  
  // Add primary language
  if (repo.language) {
    technologies.push(repo.language);
  }
  
  // Add topics (limit to 5)
  if (repo.topics && repo.topics.length > 0) {
    technologies.push(...repo.topics.slice(0, 5));
  }
  
  // Remove duplicates
  return [...new Set(technologies)];
};

/**
 * Get random fallback image
 */
export const getRandomFallbackImage = () => {
  const images = PROJECT_CONFIG.images.fallback;
  return images[Math.floor(Math.random() * images.length)];
};

/**
 * Main function to get projects (optimized)
 */
export const getOptimizedProjects = async (forceRefresh = false) => {
  // Try cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = getCachedProjects();
    if (cached) {
      return cached;
    }
  }
  
  // Check if we should fetch from API
  if (!forceRefresh && !shouldFetchFromAPI()) {
    const cached = getCachedProjects();
    if (cached) {
      console.log('📦 Using cached projects (API limit reached)');
      return cached;
    }
  }
  
  // Fetch from API
  console.log('🌐 Fetching from GitHub API...');
  return await fetchProjectsFast();
};

/**
 * Clear all caches
 */
export const clearProjectCache = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.LAST_FETCH);
    localStorage.removeItem(STORAGE_KEYS.FETCH_COUNT);
    console.log('🗑️ Project cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Get cache status
 */
export const getCacheStatus = () => {
  try {
    const lastFetch = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
    const fetchCount = parseInt(localStorage.getItem(STORAGE_KEYS.FETCH_COUNT) || '0');
    const cached = getCachedProjects();
    
    return {
      hasCache: !!cached,
      lastFetch: lastFetch ? new Date(parseInt(lastFetch)) : null,
      fetchCount,
      canFetch: shouldFetchFromAPI(),
      cacheAge: lastFetch ? Date.now() - parseInt(lastFetch) : null
    };
  } catch (error) {
    console.error('Error getting cache status:', error);
    return { hasCache: false, canFetch: true };
  }
};
