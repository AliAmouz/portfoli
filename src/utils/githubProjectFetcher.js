// GitHub Project Fetcher - Fetches repositories from GitHub API
// This utility handles fetching public repositories and their metadata

import { PROJECT_CONFIG } from '../config/projectConfig';

// Cache for fetched projects
let projectsCache = null;
let lastFetchTime = null;
const CACHE_DURATION = PROJECT_CONFIG.cache.duration;

/**
 * Fetches repositories from GitHub API
 */
export const fetchGitHubRepositories = async () => {
  try {
    const { username, apiUrl, maxRepos } = PROJECT_CONFIG.github;
    const url = `${apiUrl}/users/${username}/repos?sort=updated&per_page=${maxRepos}`;
    console.log(`Fetching repositories from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repos = await response.json();
    console.log(`Fetched ${repos.length} repositories`);
    return repos;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return null;
  }
};

/**
 * Checks if a repository has a README with image
 */
export const checkRepositoryImage = async (repoName) => {
  try {
    const { username, apiUrl } = PROJECT_CONFIG.github;
    const { extensions, searchPaths } = PROJECT_CONFIG.images;
    
    for (const path of searchPaths) {
      const url = `${apiUrl}/repos/${username}/${repoName}/contents/${path}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const contents = await response.json();
        if (Array.isArray(contents)) {
          // Look for image files
          const imageFile = contents.find(file => 
            extensions.some(ext => file.name.toLowerCase().endsWith(`.${ext}`))
          );
          if (imageFile) {
            return `https://raw.githubusercontent.com/${username}/${repoName}/main/${imageFile.path}`;
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error checking image for ${repoName}:`, error);
    return null;
  }
};

/**
 * Gets a random fallback image
 */
export const getRandomFallbackImage = () => {
  const images = PROJECT_CONFIG.images.fallback;
  return images[Math.floor(Math.random() * images.length)];
};

/**
 * Extracts project description from repository
 */
export const extractProjectDescription = (repo) => {
  if (repo.description) {
    return repo.description;
  }
  
  // Generate description based on repository name and language
  const name = repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const language = repo.language || 'Project';
  
  return `A ${language} project: ${name}`;
};

/**
 * Determines if a repository should be included
 */
export const shouldIncludeRepository = (repo) => {
  const { excludeRepos, includeTopics } = PROJECT_CONFIG.github;
  const { minRepoSize, minStars, minForks, excludeForks, includeArchived } = PROJECT_CONFIG.filtering;
  
  // Exclude specific repositories
  if (excludeRepos.includes(repo.name)) {
    return false;
  }
  
  // Exclude archived repositories if not included
  if (!includeArchived && repo.archived) {
    return false;
  }
  
  // Exclude forks if configured
  if (excludeForks && repo.fork) {
    return false;
  }
  
  // Check minimum size
  if (repo.size < minRepoSize) {
    return false;
  }
  
  // Check minimum stars
  if (repo.stargazers_count < minStars) {
    return false;
  }
  
  // Check minimum forks
  if (repo.forks_count < minForks) {
    return false;
  }
  
  // Prioritize repositories with topics
  if (repo.topics && repo.topics.length > 0) {
    const hasRelevantTopic = repo.topics.some(topic => 
      includeTopics.some(includedTopic => 
        topic.toLowerCase().includes(includedTopic.toLowerCase())
      )
    );
    if (hasRelevantTopic) {
      return true;
    }
  }
  
  // Include repositories with good activity
  return repo.stargazers_count > 0 || repo.forks_count > 0 || repo.updated_at > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
};

/**
 * Fetches all projects from GitHub
 */
export const fetchAllProjects = async (forceRefresh = false) => {
  // Check cache first
  if (!forceRefresh && projectsCache && lastFetchTime && 
      (Date.now() - lastFetchTime) < CACHE_DURATION) {
    console.log('Using cached projects:', projectsCache.length);
    return projectsCache;
  }

  try {
    console.log('Fetching projects from GitHub...');
    const repositories = await fetchGitHubRepositories();
    
    if (!repositories) {
      return projectsCache || [];
    }

    const projects = [];
    
    for (const repo of repositories) {
      if (!shouldIncludeRepository(repo)) {
        continue;
      }
      
      // Check for repository image
      const imageUrl = await checkRepositoryImage(repo.name);
      
      const project = {
        id: repo.id,
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: extractProjectDescription(repo),
        imgPath: imageUrl || getRandomFallbackImage(),
        ghLink: repo.html_url,
        demoLink: repo.homepage || null,
        language: repo.language || 'Other',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated: repo.updated_at,
        topics: repo.topics || [],
        isBlog: false,
        source: 'github'
      };
      
      projects.push(project);
    }
    
    // Sort by stars, then by update date
    projects.sort((a, b) => {
      if (a.stars !== b.stars) {
        return b.stars - a.stars;
      }
      return new Date(b.updated) - new Date(a.updated);
    });
    
    // Update cache
    projectsCache = projects;
    lastFetchTime = Date.now();
    
    console.log(`Fetched ${projects.length} projects from GitHub`);
    return projects;
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return projectsCache || [];
  }
};

/**
 * Clears the projects cache
 */
export const clearProjectsCache = () => {
  projectsCache = null;
  lastFetchTime = null;
};

/**
 * Gets cache status
 */
export const getCacheStatus = () => {
  return {
    hasCache: !!projectsCache,
    lastFetch: lastFetchTime,
    cacheAge: lastFetchTime ? Date.now() - lastFetchTime : null,
    isExpired: lastFetchTime ? (Date.now() - lastFetchTime) > CACHE_DURATION : true
  };
};
