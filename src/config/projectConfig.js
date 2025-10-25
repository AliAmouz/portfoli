// Configuration file for GitHub project integration
// Update these settings to match your GitHub account

export const PROJECT_CONFIG = {
  // GitHub Repository Settings
  github: {
    username: 'AliAmouz', // Your GitHub username
    apiUrl: 'https://api.github.com',
    maxRepos: 20, // Maximum number of repositories to fetch
    excludeRepos: ['writeups', 'portfoli-1'], // Repositories to exclude
    includeTopics: ['javascript', 'python', 'react', 'node', 'web', 'app', 'project'], // Topics to prioritize
  },

  // Image Settings
  images: {
    // Fallback images for when no repository image is found
    fallback: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'
    ],
    // Image file extensions to look for in repositories
    extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    // Common paths to search for images in repositories
    searchPaths: [
      'README.md',
      'readme.md',
      'assets/',
      'images/',
      'img/',
      'screenshots/',
      'docs/'
    ]
  },

  // Caching Settings
  cache: {
    duration: 10 * 60 * 1000, // 10 minutes in milliseconds
    enableAutoRefresh: true,
    refreshInterval: 10 * 60 * 1000 // 10 minutes
  },

  // UI Settings
  ui: {
    showLastUpdated: true,
    showRefreshButton: true,
    showErrorAlerts: true,
    enableRetryOnError: true,
    defaultShowCount: 6, // Number of projects to show by default
    enableShowMore: true
  },

  // Filtering Settings
  filtering: {
    minRepoSize: 0, // Minimum repository size in KB (set to 0 to include all)
    minStars: 0, // Minimum number of stars
    minForks: 0, // Minimum number of forks
    excludeForks: false, // Whether to exclude forked repositories
    includeArchived: true, // Whether to include archived repositories
    includePrivate: false // Whether to include private repositories (requires authentication)
  }
};

export default PROJECT_CONFIG;
