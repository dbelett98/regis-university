// public/js/settings.js

document.addEventListener('DOMContentLoaded', () => {
  // Handle username update
  const updateUsernameForm = document.getElementById('updateUsernameForm');
  if (updateUsernameForm) {
      updateUsernameForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const token = localStorage.getItem('token');
          const newUsername = document.getElementById('newUsername').value.trim();

          if (newUsername.length < 3) {
              alert('Username must be at least 3 characters.');
              return;
          }

          try {
              const response = await fetch('http://localhost:3001/update-username', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ newUsername })
              });
              const result = await response.json();
              if (response.ok) {
                  alert(result.message);
                  // Update the token in localStorage with the new token
                  if (result.token) {
                      localStorage.setItem('token', result.token);
                  }
                  // Optionally update displayed username on the portal if needed
              } else {
                  alert(result.message);
              }
          } catch (error) {
              console.error('Error:', error);
              alert('An error occurred while updating username.');
          }
      });
  }
  
  // ... handle password update similarly ...



  // Handle password update
  const updatePasswordForm = document.getElementById('updatePasswordForm');
  if (updatePasswordForm) {
      updatePasswordForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const token = localStorage.getItem('token');
          const currentPassword = document.getElementById('currentPassword').value;
          const newPassword = document.getElementById('newPassword').value;
          const confirmNewPassword = document.getElementById('confirmNewPassword').value;

          if (newPassword.length < 6) {
              alert('New password must be at least 6 characters.');
              return;
          }
          if (newPassword !== confirmNewPassword) {
              alert('New password and confirmation do not match.');
              return;
          }

          try {
              const response = await fetch('http://localhost:3001/change-password', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ oldPassword: currentPassword, newPassword })
              });
              const result = await response.json();
              if (response.ok) {
                  alert(result.message);
              } else {
                  alert(result.message);
              }
          } catch (error) {
              console.error('Error:', error);
              alert('An error occurred while updating password.');
          }
      });
  }
});
