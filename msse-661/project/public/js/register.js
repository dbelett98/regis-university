// Handle the form submission

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const data = { username, password };
  
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        window.location.href = 'login.html';
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration.');
    }
  });
  