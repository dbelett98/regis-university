

async function loadUserProfile() {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debugging

    try {
        const response = await fetch('http://localhost:3001/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Response Status:', response.status); // Debugging

        if (!response.ok) {
            throw new Error('Failed to fetch user profile.');
        }

        const user = await response.json();
        console.log('User Data:', user); // Debugging

        // Update DOM with user data
        const displayBusinessNameEl = document.getElementById('displayBusinessName');
        if (displayBusinessNameEl) {
            displayBusinessNameEl.textContent = user.business_name;
        } else {
            console.warn('Element with ID "displayBusinessName" not found.');
        }

   
    } catch (error) {
        console.error('Error:', error);
        alert('Could not load user profile.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();

   
});
