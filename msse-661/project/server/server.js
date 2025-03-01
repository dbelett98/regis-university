// set up //
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// UPDATE Registration Endpoint //

const bcrypt = require('bcrypt');

let users = []; // In-memory user storage (replace with database in production)

// Registration Endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});



// UPDATE authentication middleware and the change password endpoint //

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });

    req.user = user;
    next();
  });
}

// Change Password Endpoint
app.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.user.username;

  // Find the user
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Compare old password
  try {
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password' });
  }
});


//UPDATE allow users to modify their username and add other relevant settings.//


// Update Username Endpoint
app.post('/update-username', authenticateToken, (req, res) => {
  const { newUsername } = req.body;
  const username = req.user.username;

  // Check if new username is taken
  const userExists = users.find(user => user.username === newUsername);
  if (userExists) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  // Update username
  const user = users.find(user => user.username === username);
  user.username = newUsername;

  res.status(200).json({ message: 'Username updated successfully' });
});
