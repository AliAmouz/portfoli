# Automatic Writeup Integration

This system automatically fetches and displays writeups from your GitHub repository, supporting both TryHackMe and HackTheBox platforms.

## Features

- ✅ **Automatic GitHub Integration**: Fetches writeups from your GitHub repository
- ✅ **Platform Support**: Supports TryHackMe and HackTheBox folders
- ✅ **Smart Image Handling**: Uses repository images or random fallback images
- ✅ **Real-time Updates**: Automatically refreshes content every 5 minutes
- ✅ **Caching**: Efficient caching system to reduce API calls
- ✅ **Error Handling**: Graceful fallback to local content
- ✅ **Manual Refresh**: Users can manually refresh content

## Repository Structure

Your GitHub repository should be organized as follows:

```
writeups/
├── tryhackme/
│   ├── machine1.md
│   ├── machine1.png (optional)
│   ├── machine2.md
│   └── machine2.png (optional)
└── hackthebox/
    ├── machine1.md
    ├── machine1.png (optional)
    ├── machine2.md
    └── machine2.png (optional)
```

## Configuration

Update the configuration in `src/config/writeupConfig.js`:

```javascript
export const WRITEUP_CONFIG = {
  github: {
    username: 'YourGitHubUsername', // Your GitHub username
    repo: 'writeups', // Your writeups repository name
    branch: 'main', // Default branch
    platforms: ['tryhackme', 'hackthebox'] // Supported platforms
  },
  // ... other settings
};
```

## How It Works

### 1. Automatic Fetching
- The system automatically fetches writeups from your GitHub repository
- Checks both `tryhackme` and `hackthebox` folders
- Updates every 5 minutes (configurable)

### 2. Image Handling
- **Repository Images**: If an image exists in the repository (e.g., `machine1.png`), it uses that
- **Fallback Images**: If no image is found, it uses random fallback images from Unsplash
- **Platform-specific**: Different fallback images for TryHackMe vs HackTheBox

### 3. Content Processing
- Extracts metadata from markdown files (title, description, difficulty, date)
- Converts markdown to HTML for display
- Handles code blocks, headers, and formatting

### 4. Error Handling
- If GitHub fetch fails, falls back to local content
- Shows error messages with retry options
- Maintains functionality even when offline

## File Structure

```
src/
├── components/writeups/
│   ├── Writeups.js (main component)
│   ├── WriteupCard.js (individual writeup cards)
│   ├── WriteupViewer.js (detailed writeup viewer)
│   └── writeupUtils.js (utility functions)
├── hooks/
│   └── useWriteups.js (custom hook for state management)
├── utils/
│   └── githubWriteupFetcher.js (GitHub API integration)
└── config/
    └── writeupConfig.js (configuration settings)
```

## Usage

### For Users
- Writeups are automatically loaded from GitHub
- Use filters to find specific writeups
- Click "Refresh from GitHub" to manually update
- View detailed writeups by clicking on cards

### For Developers
- Add new writeups to your GitHub repository
- Follow the folder structure (tryhackme/ or hackthebox/)
- Include images with the same name as the markdown file
- The system will automatically detect and display new content

## Adding New Writeups

1. **Create the markdown file** in the appropriate folder:
   - `tryhackme/machine-name.md`
   - `hackthebox/machine-name.md`

2. **Add an image** (optional):
   - `tryhackme/machine-name.png`
   - `hackthebox/machine-name.png`

3. **Include metadata** in your markdown:
   ```markdown
   # Machine Name
   
   ## Machine Information
   - **Platform**: TryHackMe
   - **Difficulty**: Easy
   - **OS**: Linux
   - **Completed**: 2024-01-15
   ```

4. **Commit and push** to your repository

The system will automatically detect and display the new writeup within 5 minutes.

## Customization

### Changing Refresh Interval
```javascript
// In src/config/writeupConfig.js
cache: {
  duration: 5 * 60 * 1000, // 5 minutes
  refreshInterval: 5 * 60 * 1000 // 5 minutes
}
```

### Adding Custom Fallback Images
```javascript
// In src/config/writeupConfig.js
images: {
  fallback: {
    tryhackme: [
      'https://your-custom-image-url.com/image1.jpg',
      'https://your-custom-image-url.com/image2.jpg'
    ],
    hackthebox: [
      'https://your-custom-image-url.com/image3.jpg',
      'https://your-custom-image-url.com/image4.jpg'
    ]
  }
}
```

### Disabling Auto-refresh
```javascript
// In src/config/writeupConfig.js
cache: {
  enableAutoRefresh: false
}
```

## Troubleshooting

### Common Issues

1. **Writeups not loading**
   - Check your GitHub username and repository name in config
   - Ensure the repository is public
   - Check browser console for errors

2. **Images not showing**
   - Verify image files exist in the repository
   - Check image file extensions (.png, .jpg, etc.)
   - Fallback images will be used if repository images fail

3. **Slow loading**
   - The system caches content for 5 minutes
   - First load may be slower due to API calls
   - Subsequent loads use cached data

### Debug Mode
Enable debug logging by opening browser console. The system logs:
- Fetch operations
- Cache hits/misses
- Error messages
- Image loading status

## API Limits

- GitHub API has rate limits (5000 requests/hour for authenticated users)
- The system uses efficient caching to minimize API calls
- Consider using a GitHub token for higher limits if needed

## Security

- All content is fetched from public GitHub repositories
- No authentication required for public repos
- Images are served directly from GitHub's CDN
- No sensitive data is stored locally

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your repository structure matches the requirements
3. Ensure your GitHub repository is public
4. Try manually refreshing the page
