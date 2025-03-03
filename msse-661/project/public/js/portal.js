// public/js/portal.js

async function loadUserProfile() {
    const token = localStorage.getItem('token');
    console.log('Token:', token); //debugging

    try {
        const response = await fetch('http://localhost:3001/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Response Status:', response.status); //debugging

        if (!response.ok) {
            throw new Error('Failed to fetch user profile.');
        }

        const user = await response.json();
        console.log('User Data:', user); //debugging

        // update DOM with user data
        document.getElementById('displayBusinessName').textContent = user.business_name;
        document.getElementById('businessName').value = user.business_name;
        document.getElementById('profileBusinessName').textContent = user.business_name;
    } catch (error) {
        console.error('Error:', error);
        alert('Could not load user profile.');
    }
}

document.addEventListener('DOMContentLoaded', loadUserProfile);

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const businessName = document.getElementById('businessName').value.trim();

    if (businessName.length < 3) {
        alert('Business name must be at least 3 characters.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/update-business-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newBusinessName: businessName })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            // Update displayed business name
            document.getElementById('displayBusinessName').textContent = businessName;
            document.getElementById('profileBusinessName').textContent = businessName;
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating business name.');
    }
});
