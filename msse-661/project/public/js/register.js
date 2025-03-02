// Event listeners, user input validation, feedback to user, navigation on successful registration

// Registration Form Submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;

  // Validate inputs
  if (!validateUsername(username)) {
    alert('Username must be at least 3 characters.');
    return;
  }

  if (!validatePassword(password)) {
    alert('Password must be at least 6 characters, including letters and numbers.');
    return;
  }

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
      // Optionally switch to login tab
      document.querySelector('#login-tab').click();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during registration.');
  }
});

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!validateUsername(username) || !validatePassword(password)) {
    alert('Please enter valid credentials.');
    return;
  }

  const data = { username, password };

  try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      // Save token
      localStorage.setItem('token', result.token);
      window.location.href = 'index.html';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during login.');
  }
});

// Validation Functions
function validateUsername(username) {
  return username.length >= 3;
}

function validatePassword(password) {
  // Password must be at least 6 characters, with at least one letter and one number
  const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return pattern.test(password);
}
