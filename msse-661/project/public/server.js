// server/server.js
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.json());

const PORT = 3001;

// In-memory user storage (replace with a database in production)
let users = [];

// JWT secret key
const JWT_SECRET = 'your_jwt_secret_key'; // Consider using an environment variable

// Registration Endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store user
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully' });
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Compare password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Generate token
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: 'Login successful', token });
});

// Change Password Endpoint
app.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.user.username;

  // Find user
  const user = users.find(user => user.username === username);

  // Verify old password
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    return res.status(400).json({ message: 'Incorrect old password' });
  }

  // Update password
  user.password = await bcrypt.hash(newPassword, 10);
  res.status(200).json({ message: 'Password changed successfully' });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid access token' });
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


