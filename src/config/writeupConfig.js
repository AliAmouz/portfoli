// Configuration file for writeup integration
// Update these settings to match your GitHub repository

export const WRITEUP_CONFIG = {
  // GitHub Repository Settings
  github: {
    username: 'AliAmouz', // Your GitHub username
    repo: 'writeups', // Your writeups repository name
    branch: 'main', // Default branch
    platforms: ['tryhackme', 'hackthbox'] // Supported platforms
  },

  // Image Settings
  images: {
    // Fallback images for when no image is found in the repository
    fallback: {
      tryhackme: [
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop'
      ],
      hackthbox: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop'
      ]
    },
    // Image file extensions to look for
    extensions: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    // Default image if no fallback is found
    default: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
  },

  // Caching Settings
  cache: {
    duration: 5 * 60 * 1000, // 5 minutes in milliseconds
    enableAutoRefresh: true,
    refreshInterval: 5 * 60 * 1000 // 5 minutes
  },

  // API Settings
  api: {
    githubApiUrl: 'https://api.github.com',
    rawContentUrl: 'https://raw.githubusercontent.com',
    timeout: 10000 // 10 seconds
  },

  // UI Settings
  ui: {
    showLastUpdated: true,
    showRefreshButton: true,
    showErrorAlerts: true,
    enableRetryOnError: true
  }
};

// Helper functions
export const getGitHubUrl = (writeupId, platform) => {
  const { username, repo, branch } = WRITEUP_CONFIG.github;
  return `https://github.com/${username}/${repo}/blob/${branch}/${platform.toLowerCase()}/${writeupId}.md`;
};

export const getRawGitHubUrl = (writeupId, platform) => {
  const { username, repo, branch } = WRITEUP_CONFIG.github;
  return `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${platform.toLowerCase()}/${writeupId}.md`;
};

export const getImageUrl = (writeupId, platform) => {
  const { username, repo, branch } = WRITEUP_CONFIG.github;
  return `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${platform.toLowerCase()}/${writeupId}.png`;
};

export const getMachineLink = (writeupId, platform) => {
  switch (platform.toLowerCase()) {
    case 'tryhackme':
      return `https://tryhackme.com/room/${writeupId}`;
    case 'hackthbox':
      return `https://app.hackthebox.com/machines/${writeupId}`;
    default:
      return null;
  }
};

export default WRITEUP_CONFIG;
