// GitHub Writeup Fetcher - Automatically fetches writeups from GitHub repository
// This utility handles fetching writeups from tryhackme and hackthebox folders

import { WRITEUP_CONFIG } from '../config/writeupConfig';

// Cache for fetched writeups
let writeupsCache = null;
let lastFetchTime = null;
const CACHE_DURATION = WRITEUP_CONFIG.cache.duration;

/**
 * Fetches repository contents from GitHub API
 */
export const fetchRepoContents = async (path = '') => {
  try {
    const { username, repo } = WRITEUP_CONFIG.github;
    const url = `${WRITEUP_CONFIG.api.githubApiUrl}/repos/${username}/${repo}/contents/${path}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching repo contents:', error);
    return null;
  }
};

/**
 * Fetches a specific file from GitHub
 */
export const fetchFileContent = async (filePath) => {
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
 * Checks if an image exists in the repository
 */
export const checkImageExists = async (imagePath) => {
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
 * Gets a random fallback image for a platform
 */
export const getRandomFallbackImage = (platform) => {
  const images = WRITEUP_CONFIG.images.fallback[platform.toLowerCase()] || WRITEUP_CONFIG.images.fallback.tryhackme;
  return images[Math.floor(Math.random() * images.length)];
};

/**
 * Extracts metadata from markdown content
 */
export const extractMetadata = (content) => {
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
 * Fetches all writeups from the repository
 */
export const fetchAllWriteups = async (forceRefresh = false) => {
  // Check cache first
  if (!forceRefresh && writeupsCache && lastFetchTime && 
      (Date.now() - lastFetchTime) < CACHE_DURATION) {
    return writeupsCache;
  }

  const allWriteups = [];
  
  try {
    for (const platform of WRITEUP_CONFIG.github.platforms) {
      console.log(`Fetching writeups from ${platform}...`);
      
      // Fetch platform folder contents
      const platformContents = await fetchRepoContents(platform);
      if (!platformContents) continue;

      // Filter for markdown files (both .md and files without extension)
      const markdownFiles = platformContents.filter(file => 
        file.type === 'file' && (file.name.endsWith('.md') || !file.name.includes('.'))
      );

      for (const file of markdownFiles) {
        const writeupId = file.name.endsWith('.md') ? file.name.replace('.md', '') : file.name;
        const filePath = `${platform}/${file.name}`;
        
        // Fetch markdown content
        const content = await fetchFileContent(filePath);
        if (!content) continue;

        // Extract metadata
        const metadata = extractMetadata(content);
        
        // Check for image
        const imagePath = `${platform}/${writeupId}.png`;
        const imageExists = await checkImageExists(imagePath);
        
        let imgPath;
        if (imageExists) {
          const { username, repo, branch } = WRITEUP_CONFIG.github;
          imgPath = `${WRITEUP_CONFIG.api.rawContentUrl}/${username}/${repo}/${branch}/${imagePath}`;
        } else {
          imgPath = getRandomFallbackImage(platform);
        }

        // Create writeup object
        const writeup = {
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
          source: 'github',
          lastUpdated: new Date().toISOString()
        };

        allWriteups.push(writeup);
      }
    }

    // Sort by date (newest first)
    allWriteups.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update cache
    writeupsCache = allWriteups;
    lastFetchTime = Date.now();

    console.log(`Fetched ${allWriteups.length} writeups from GitHub`);
    return allWriteups;

  } catch (error) {
    console.error('Error fetching writeups:', error);
    return writeupsCache || [];
  }
};

/**
 * Gets machine link based on platform
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
 * Fetches a specific writeup by ID
 */
export const fetchWriteupById = async (writeupId, platform) => {
  try {
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
      const { username, repo, branch } = WRITEUP_CONFIG.github;
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
 * Clears the writeups cache
 */
export const clearWriteupsCache = () => {
  writeupsCache = null;
  lastFetchTime = null;
};

/**
 * Gets cache status
 */
export const getCacheStatus = () => {
  return {
    hasCache: !!writeupsCache,
    lastFetch: lastFetchTime,
    cacheAge: lastFetchTime ? Date.now() - lastFetchTime : null,
    isExpired: lastFetchTime ? (Date.now() - lastFetchTime) > CACHE_DURATION : true
  };
};
