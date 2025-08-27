// Utility functions for managing writeups

// Function to fetch writeup content from GitHub
export const fetchWriteupFromGitHub = async (writeupId, platform, githubUsername, repoName, branch = 'main') => {
  try {
    const url = `https://raw.githubusercontent.com/${githubUsername}/${repoName}/${branch}/${platform.toLowerCase()}/${writeupId}.md`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch writeup: ${response.status}`);
    }
    
    const content = await response.text();
    return content;
  } catch (error) {
    console.error('Error fetching writeup from GitHub:', error);
    return null;
  }
};

// Function to convert markdown to HTML (basic conversion)
export const markdownToHtml = (markdown) => {
  return markdown
    // Headers
    .replace(/^# (.*$)/gm, '<h1 style="color: #c770f0; border-bottom: 2px solid #c770f0; padding-bottom: 10px; margin: 30px 0 20px 0;">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 style="color: #c770f0; margin: 25px 0 15px 0;">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 style="color: #c770f0; margin: 20px 0 10px 0;">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 style="color: #c770f0; margin: 15px 0 10px 0;">$1</h4>')
    
    // Code blocks
    .replace(/```bash\n([\s\S]*?)\n```/g, '<pre style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; overflow-x: auto; margin: 15px 0; border: 1px solid rgba(255,255,255,0.1);"><code style="color: #00ff00; font-family: \'Courier New\', monospace;">$1</code></pre>')
    .replace(/```sql\n([\s\S]*?)\n```/g, '<pre style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; overflow-x: auto; margin: 15px 0; border: 1px solid rgba(255,255,255,0.1);"><code style="color: #ff6b6b; font-family: \'Courier New\', monospace;">$1</code></pre>')
    .replace(/```python\n([\s\S]*?)\n```/g, '<pre style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; overflow-x: auto; margin: 15px 0; border: 1px solid rgba(255,255,255,0.1);"><code style="color: #ffd700; font-family: \'Courier New\', monospace;">$1</code></pre>')
    .replace(/```\n([\s\S]*?)\n```/g, '<pre style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; overflow-x: auto; margin: 15px 0; border: 1px solid rgba(255,255,255,0.1);"><code style="color: #ffffff; font-family: \'Courier New\', monospace;">$1</code></pre>')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 3px; font-family: \'Courier New\', monospace;">$1</code>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffd700;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: #c770f0;">$1</em>')
    
    // Lists
    .replace(/^- (.*$)/gm, '<li style="margin: 5px 0; padding-left: 20px;">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li style="margin: 5px 0; padding-left: 20px;">$1</li>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #c770f0; text-decoration: none;">$1</a>')
    
    // Line breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
};

// Configuration for GitHub integration
export const GITHUB_CONFIG = {
  username: 'AliAmouz', // Replace with your GitHub username
  repo: 'writeups', // Replace with your writeups repository name
  branch: 'main'
};

// Function to get GitHub URL for a writeup
export const getGitHubUrl = (writeupId, platform) => {
  const { username, repo, branch } = GITHUB_CONFIG;
  return `https://github.com/${username}/${repo}/blob/${branch}/${platform.toLowerCase()}/${writeupId}.md`;
};

// Function to get raw GitHub URL for a writeup
export const getRawGitHubUrl = (writeupId, platform) => {
  const { username, repo, branch } = GITHUB_CONFIG;
  return `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${platform.toLowerCase()}/${writeupId}.md`;
};
