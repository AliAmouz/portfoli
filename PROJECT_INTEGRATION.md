# Automatic Project Integration

This system automatically fetches and displays your GitHub repositories as projects, with smart image detection and filtering.

## Features

- ✅ **Automatic GitHub Integration**: Fetches repositories from your GitHub account
- ✅ **Smart Image Detection**: Finds images in repositories or uses fallback images
- ✅ **Intelligent Filtering**: Excludes certain repos, prioritizes relevant projects
- ✅ **Real-time Updates**: Automatically refreshes content every 10 minutes
- ✅ **Caching**: Efficient caching system to reduce API calls
- ✅ **Error Handling**: Graceful fallback and retry mechanisms
- ✅ **Show More/Less**: Displays 6 projects by default with option to show all

## Configuration

Update the configuration in `src/config/projectConfig.js`:

```javascript
export const PROJECT_CONFIG = {
  github: {
    username: 'AliAmouz', // Your GitHub username
    maxRepos: 20, // Maximum repositories to fetch
    excludeRepos: ['writeups', 'portfoli-1'], // Repos to exclude
    includeTopics: ['javascript', 'python', 'react', 'node', 'web', 'app', 'project']
  },
  // ... other settings
};
```

## How It Works

### 1. Repository Fetching
- Fetches your public repositories from GitHub API
- Sorts by update date (most recent first)
- Applies intelligent filtering based on size, stars, forks, and topics

### 2. Image Detection
- Searches for images in common locations:
  - `README.md` files
  - `assets/`, `images/`, `img/` folders
  - `screenshots/`, `docs/` folders
- Uses fallback images from Unsplash if no repository image found

### 3. Project Information
- **Title**: Repository name (formatted nicely)
- **Description**: Repository description or auto-generated
- **GitHub Link**: Direct link to repository
- **Demo Link**: Homepage URL if available
- **Language**: Primary programming language
- **Stars/Forks**: Repository statistics

### 4. Filtering Logic
- Excludes specified repositories
- Filters by minimum size, stars, forks
- Prioritizes repositories with relevant topics
- Excludes archived repositories (configurable)
- Excludes forks (configurable)

## File Structure

```
src/
├── components/Projects/
│   ├── Projects.js (main component)
│   └── ProjectCards.js (individual project cards)
├── hooks/
│   └── useProjects.js (custom hook for state management)
├── utils/
│   └── githubProjectFetcher.js (GitHub API integration)
└── config/
    └── projectConfig.js (configuration settings)
```

## Customization

### Excluding Repositories
```javascript
// In src/config/projectConfig.js
excludeRepos: ['writeups', 'portfoli-1', 'test-repo']
```

### Changing Image Fallbacks
```javascript
// In src/config/projectConfig.js
images: {
  fallback: [
    'https://your-custom-image-url.com/image1.jpg',
    'https://your-custom-image-url.com/image2.jpg'
  ]
}
```

### Adjusting Filtering Criteria
```javascript
// In src/config/projectConfig.js
filtering: {
  minRepoSize: 100, // Minimum size in KB
  minStars: 0, // Minimum stars required
  minForks: 0, // Minimum forks required
  excludeForks: false, // Whether to exclude forks
  includeArchived: false // Whether to include archived repos
}
```

### Changing Display Settings
```javascript
// In src/config/projectConfig.js
ui: {
  defaultShowCount: 6, // Projects shown by default
  enableShowMore: true // Enable show more/less button
}
```

## Adding Repository Images

To have custom images for your projects, add image files to your repositories in these locations:

1. **Root directory**: `screenshot.png`, `preview.jpg`, etc.
2. **Assets folder**: `assets/preview.png`
3. **Images folder**: `images/screenshot.png`
4. **Screenshots folder**: `screenshots/demo.png`

The system will automatically detect and use these images.

## API Limits

- GitHub API has rate limits (5000 requests/hour for unauthenticated users)
- The system uses efficient caching to minimize API calls
- Consider using a GitHub token for higher limits if needed

## Troubleshooting

### Common Issues

1. **No projects showing**
   - Check your GitHub username in config
   - Ensure repositories are public
   - Check browser console for errors

2. **Images not loading**
   - Verify image files exist in repositories
   - Check image file extensions (.png, .jpg, etc.)
   - Fallback images will be used if repository images fail

3. **Slow loading**
   - The system caches content for 10 minutes
   - First load may be slower due to API calls
   - Subsequent loads use cached data

### Debug Mode
Enable debug logging by opening browser console. The system logs:
- Repository fetching operations
- Image detection results
- Filtering decisions
- Cache hits/misses

## Security

- All content is fetched from public GitHub repositories
- No authentication required for public repos
- Images are served directly from GitHub's CDN
- No sensitive data is stored locally

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your GitHub username in the configuration
3. Ensure your repositories are public
4. Try manually refreshing the page
5. Check the GitHub API status

## Example Repository Structure

For best results, structure your repositories like this:

```
your-project/
├── README.md
├── assets/
│   └── preview.png
├── src/
└── package.json
```

The system will automatically find the `preview.png` image and use it for the project card.
