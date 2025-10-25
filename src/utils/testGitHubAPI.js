// Simple test to verify GitHub API access
export const testGitHubAPI = async () => {
  try {
    console.log('🧪 Testing GitHub API access...');
    
    const url = 'https://api.github.com/users/AliAmouz/repos?per_page=5';
    console.log('📡 Fetching:', url);
    
    const response = await fetch(url);
    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const repos = await response.json();
      console.log('✅ Success! Found repositories:', repos.length);
      console.log('📁 Repository names:', repos.map(r => r.name));
      return repos;
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    return null;
  }
};

export default testGitHubAPI;
