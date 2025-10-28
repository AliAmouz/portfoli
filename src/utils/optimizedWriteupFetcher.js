// Optimized Writeup Fetcher - Backend caching with minimal API calls
// This utility handles efficient writeup fetching with smart caching

import { WRITEUP_CONFIG } from '../config/writeupConfig';
import machinesData from '../Assets/machines.json';

// Local storage keys
const STORAGE_KEYS = {
  WRITEUPS: 'github_writeups_cache',
  LAST_FETCH: 'github_writeups_last_fetch',
  FETCH_COUNT: 'github_writeups_fetch_count'
};

// Cache settings
const CACHE_SETTINGS = {
  DURATION: 24 * 60 * 60 * 1000, // 24 hours
  MAX_FETCHES_PER_DAY: 3, // Maximum API calls per day
  MIN_FETCH_INTERVAL: 2 * 60 * 60 * 1000 // 2 hours minimum between fetches
};

/**
 * Get cached writeups from localStorage
 */
export const getCachedWriteups = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.WRITEUPS);
    const lastFetch = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
    
    if (cached && lastFetch) {
      const cacheAge = Date.now() - parseInt(lastFetch);
      if (cacheAge < CACHE_SETTINGS.DURATION) {
        console.log('📦 Using cached writeups');
        return JSON.parse(cached);
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading cached writeups:', error);
    return null;
  }
};

/**
 * Save writeups to localStorage
 */
export const saveCachedWriteups = (writeups) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WRITEUPS, JSON.stringify(writeups));
    localStorage.setItem(STORAGE_KEYS.LAST_FETCH, Date.now().toString());
    console.log('💾 Writeups cached successfully');
  } catch (error) {
    console.error('Error caching writeups:', error);
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
      console.log('🚫 Daily API limit reached for writeups');
      return false;
    }
    
    // Check minimum interval
    if (lastFetch) {
      const timeSinceLastFetch = Date.now() - parseInt(lastFetch);
      if (timeSinceLastFetch < CACHE_SETTINGS.MIN_FETCH_INTERVAL) {
        console.log('⏰ Too soon since last writeup fetch');
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
 * Fast GitHub API call - get repository tree for writeups
 */
export const fetchWriteupsFast = async () => {
  try {
    console.log('🚀 Fast fetch writeups from GitHub API...');
    const { username, repo, branch } = WRITEUP_CONFIG.github;
    
    // Get repository tree for writeup folders
    const treeUrl = `${WRITEUP_CONFIG.api.githubApiUrl}/repos/${username}/${repo}/git/trees/${branch}?recursive=1`;
    const response = await fetch(treeUrl);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const treeData = await response.json();
    console.log(`✅ Fetched repository tree with ${treeData.tree.length} items`);
    
    // Process writeups quickly from tree data
    const writeups = [];
    
    for (const platform of WRITEUP_CONFIG.github.platforms) {
      // Find all markdown files in this platform folder
      const platformFiles = treeData.tree.filter(item => 
        item.path.startsWith(`${platform}/`) && 
        (item.path.endsWith('.md') || (!item.path.includes('.') && item.type === 'blob'))
      );
      
      for (const file of platformFiles) {
        const writeupId = file.path.endsWith('.md') 
          ? file.path.replace(`${platform}/`, '').replace('.md', '')
          : file.path.replace(`${platform}/`, '');
        
        // Check if there's a corresponding image
        const imagePath = `${platform}/${writeupId}.png`;
        const hasImage = treeData.tree.some(item => item.path === imagePath);
        
        // Create writeup object quickly
        const writeup = {
          id: writeupId,
          platform: platform === 'hackthbox' ? 'HackTheBox' : 
                     platform === 'tryhackme' ? 'TryHackMe' : 
                     platform.charAt(0).toUpperCase() + platform.slice(1),
          title: writeupId.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `A detailed writeup for ${writeupId} on ${platform}`,
          difficulty: 'Easy', // Default difficulty
          date: new Date().toISOString().split('T')[0], // Default to today
          writeupLink: `/writeup/${writeupId}`,
          machineLink: getMachineLink(writeupId, platform),
          imgPath: hasImage 
            ? `${WRITEUP_CONFIG.api.rawContentUrl}/${username}/${repo}/${branch}/${imagePath}`
            : getRandomFallbackImage(platform),
          source: 'github',
          lastUpdated: new Date().toISOString()
        };
        
        writeups.push(writeup);
      }
    }
    
    // Sort by date (newest first)
    writeups.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Cache the results
    saveCachedWriteups(writeups);
    incrementFetchCounter();
    
    console.log(`✅ Processed ${writeups.length} writeups from GitHub`);
    return writeups;
  } catch (error) {
    console.error('Error in fast writeup fetch:', error);
    return getCachedWriteups() || [];
  }
};

/**
 * Get machine link based on platform
 */
const getMachineLink = (writeupId, platform) => {
  switch (platform.toLowerCase()) {
    case 'tryhackme':
      return `https://tryhackme.com/room/${writeupId}`;
    case 'hackthbox':
      return `https://app.hackthebox.com/machines/${writeupId}`;
    default:
      return null;
  }
};

/**
 * Get random fallback image for a platform
 */
const getRandomFallbackImage = (platform) => {
  const images = WRITEUP_CONFIG.images.fallback[platform.toLowerCase()] || WRITEUP_CONFIG.images.fallback.tryhackme;
  return images[Math.floor(Math.random() * images.length)];
};

/**
 * Load local writeups as fallback
 */
export const loadLocalWriteups = () => {
  try {
    const localWriteups = machinesData.machines.map((machine, index) => ({
      ...machine,
      id: machine.id,
      source: 'local',
      lastUpdated: new Date().toISOString()
    }));
    console.log(`📁 Loaded ${localWriteups.length} local writeups`);
    return localWriteups;
  } catch (error) {
    console.error('Error loading local writeups:', error);
    return [];
  }
};

/**
 * Main function to get writeups (optimized)
 */
export const getOptimizedWriteups = async (forceRefresh = false) => {
  // Try cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = getCachedWriteups();
    if (cached && cached.length > 0) {
      return cached;
    }
  }
  
  // Check if we should fetch from API
  if (!forceRefresh && !shouldFetchFromAPI()) {
    const cached = getCachedWriteups();
    if (cached && cached.length > 0) {
      console.log('📦 Using cached writeups (API limit reached)');
      return cached;
    }
  }
  
  // Try to fetch from GitHub API
  try {
    console.log('🌐 Fetching writeups from GitHub API...');
    const githubWriteups = await fetchWriteupsFast();
    
    if (githubWriteups && githubWriteups.length > 0) {
      return githubWriteups;
    }
  } catch (error) {
    console.error('GitHub fetch failed, trying local fallback:', error);
  }
  
  // Fallback to local writeups
  console.log('📁 Falling back to local writeups');
  return loadLocalWriteups();
};

/**
 * Clear all caches
 */
export const clearWriteupCache = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.WRITEUPS);
    localStorage.removeItem(STORAGE_KEYS.LAST_FETCH);
    localStorage.removeItem(STORAGE_KEYS.FETCH_COUNT);
    console.log('🗑️ Writeup cache cleared');
  } catch (error) {
    console.error('Error clearing writeup cache:', error);
  }
};

/**
 * Fetch a specific writeup by ID with content
 */
export const fetchWriteupById = async (writeupId, platform) => {
  try {
    const { username, repo, branch } = WRITEUP_CONFIG.github;
    
    // Try with .md extension first, then without extension
    let filePath = `${platform.toLowerCase()}/${writeupId}.md`;
    let content = await fetchFileContent(filePath);
    
    // If not found with .md extension, try without extension
    if (!content) {
      filePath = `${platform.toLowerCase()}/${writeupId}`;
      content = await fetchFileContent(filePath);
    }
    
    if (!content) {
      return null;
    }

    const metadata = extractMetadata(content);
    const imagePath = `${platform.toLowerCase()}/${writeupId}.png`;
    const imageExists = await checkImageExists(imagePath);
    
    let imgPath;
    if (imageExists) {
      imgPath = `${WRITEUP_CONFIG.api.rawContentUrl}/${username}/${repo}/${branch}/${imagePath}`;
    } else {
      imgPath = getRandomFallbackImage(platform);
    }

    return {
      id: writeupId,
      platform: platform === 'hackthbox' ? 'HackTheBox' : 
                 platform === 'tryhackme' ? 'TryHackMe' : 
                 platform.charAt(0).toUpperCase() + platform.slice(1),
      title: metadata.title || writeupId,
      description: metadata.description || 'A detailed writeup of this machine.',
      difficulty: metadata.difficulty,
      date: metadata.date,
      writeupLink: `/writeup/${writeupId}`,
      machineLink: getMachineLink(writeupId, platform),
      imgPath: imgPath,
      content: content,
      source: 'github'
    };
  } catch (error) {
    console.error('Error fetching writeup:', error);
    return null;
  }
};

/**
 * Helper function to fetch file content
 */
const fetchFileContent = async (filePath) => {
  try {
    const { username, repo, branch } = WRITEUP_CONFIG.github;
    const url = `${WRITEUP_CONFIG.api.rawContentUrl}/${username}/${repo}/${branch}/${filePath}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error fetching file content:', error);
    return null;
  }
};

/**
 * Helper function to check if image exists
 */
const checkImageExists = async (imagePath) => {
  try {
    const { username, repo, branch } = WRITEUP_CONFIG.github;
    const url = `${WRITEUP_CONFIG.api.rawContentUrl}/${username}/${repo}/${branch}/${imagePath}`;
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Helper function to extract metadata from markdown content
 */
const extractMetadata = (content) => {
  const metadata = {
    title: '',
    description: '',
    difficulty: 'Easy',
    date: new Date().toISOString().split('T')[0]
  };

  // Extract title from first # heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    metadata.title = titleMatch[1];
  }

  // Extract description from first paragraph
  const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
  if (paragraphs.length > 0) {
    metadata.description = paragraphs[0].replace(/[#*`]/g, '').trim().substring(0, 150) + '...';
  }

  // Extract difficulty from content
  const difficultyMatch = content.match(/(?:difficulty|level):\s*(easy|medium|hard)/i);
  if (difficultyMatch) {
    metadata.difficulty = difficultyMatch[1].charAt(0).toUpperCase() + difficultyMatch[1].slice(1);
  }

  // Extract date from content
  const dateMatch = content.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    metadata.date = dateMatch[1];
  }

  return metadata;
};

/**
 * Get cache status
 */
export const getCacheStatus = () => {
  try {
    const lastFetch = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
    const fetchCount = parseInt(localStorage.getItem(STORAGE_KEYS.FETCH_COUNT) || '0');
    const cached = getCachedWriteups();
    
    return {
      hasCache: !!cached,
      lastFetch: lastFetch ? new Date(parseInt(lastFetch)) : null,
      fetchCount,
      canFetch: shouldFetchFromAPI(),
      cacheAge: lastFetch ? Date.now() - parseInt(lastFetch) : null
    };
  } catch (error) {
    console.error('Error getting writeup cache status:', error);
    return { hasCache: false, canFetch: true };
  }
};
