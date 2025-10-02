#!/usr/bin/env node

/**
 * Setup script for automatic writeup integration
 * Run this script to configure your writeup system
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Automatic Writeup Integration...\n');

// Configuration questions
const questions = [
  {
    name: 'githubUsername',
    message: 'Enter your GitHub username:',
    default: 'AliAmouz'
  },
  {
    name: 'repositoryName',
    message: 'Enter your writeups repository name:',
    default: 'writeups'
  },
  {
    name: 'branch',
    message: 'Enter the default branch:',
    default: 'main'
  }
];

// Mock answers for now - in a real implementation, you'd use a prompt library
const answers = {
  githubUsername: 'AliAmouz',
  repositoryName: 'writeups',
  branch: 'main'
};

console.log('📝 Configuration:');
console.log(`   GitHub Username: ${answers.githubUsername}`);
console.log(`   Repository: ${answers.repositoryName}`);
console.log(`   Branch: ${answers.branch}\n`);

// Update the configuration file
const configPath = path.join(__dirname, 'src', 'config', 'writeupConfig.js');
const configContent = `// Configuration file for writeup integration
// Update these settings to match your GitHub repository

export const WRITEUP_CONFIG = {
  // GitHub Repository Settings
  github: {
    username: '${answers.githubUsername}', // Your GitHub username
    repo: '${answers.repositoryName}', // Your writeups repository name
    branch: '${answers.branch}', // Default branch
    platforms: ['tryhackme', 'hackthebox'] // Supported platforms
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
      hackthebox: [
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
  return \`https://github.com/\${username}/\${repo}/blob/\${branch}/\${platform.toLowerCase()}/\${writeupId}.md\`;
};

export const getRawGitHubUrl = (writeupId, platform) => {
  const { username, repo, branch } = WRITEUP_CONFIG.github;
  return \`https://raw.githubusercontent.com/\${username}/\${repo}/\${branch}/\${platform.toLowerCase()}/\${writeupId}.md\`;
};

export const getImageUrl = (writeupId, platform) => {
  const { username, repo, branch } = WRITEUP_CONFIG.github;
  return \`https://raw.githubusercontent.com/\${username}/\${repo}/\${branch}/\${platform.toLowerCase()}/\${writeupId}.png\`;
};

export const getMachineLink = (writeupId, platform) => {
  switch (platform.toLowerCase()) {
    case 'tryhackme':
      return \`https://tryhackme.com/room/\${writeupId}\`;
    case 'hackthebox':
      return \`https://app.hackthebox.com/machines/\${writeupId}\`;
    default:
      return null;
  }
};

export default WRITEUP_CONFIG;`;

try {
  fs.writeFileSync(configPath, configContent);
  console.log('✅ Configuration file updated successfully!');
} catch (error) {
  console.error('❌ Error updating configuration file:', error.message);
  process.exit(1);
}

console.log('\n📋 Next Steps:');
console.log('1. Ensure your GitHub repository has the following structure:');
console.log('   writeups/');
console.log('   ├── tryhackme/');
console.log('   │   ├── machine1.md');
console.log('   │   ├── machine1.png (optional)');
console.log('   │   └── ...');
console.log('   └── hackthebox/');
console.log('       ├── machine1.md');
console.log('       ├── machine1.png (optional)');
console.log('       └── ...');
console.log('');
console.log('2. Make sure your repository is public');
console.log('3. Start your React application: npm start');
console.log('4. Navigate to the writeups section to see your content');
console.log('');
console.log('🎉 Setup complete! Your writeups will now be automatically fetched from GitHub.');
console.log('   New writeups will appear within 5 minutes of being added to your repository.');
