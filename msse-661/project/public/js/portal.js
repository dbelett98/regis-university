

async function loadUserProfile() {
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch('http://localhost:3001/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user profile.');
      }
  
      const user = await response.json();
      document.getElementById('displayUsername').textContent = user.username;
      document.getElementById('displayBusinessName').textContent = user.business_name;
    } catch (error) {
      console.error('Error:', error);
      alert('Could not load user profile.');
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadUserProfile);
  