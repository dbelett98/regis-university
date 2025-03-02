// server/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2'); 
const path = require('path');
require('dotenv').config();

// Create two separate Express apps
const app = express();      // Web server app
const apiApp = express();   // API/data service app

// Ports
const WEB_PORT = 3000;      // Web server port
const API_PORT = 3001;      // API server port

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for both apps
app.use(cors());
app.use(bodyParser.json());
apiApp.use(cors());
apiApp.use(bodyParser.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Start the web server
app.listen(WEB_PORT, () => {
  console.log(`Web server is running on http://localhost:${WEB_PORT}`);
});

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Promisify pool queries for async/await
const promisePool = pool.promise();

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid access token.' });
    req.user = user;
    next();
  });
}

// Test Database Connection Endpoint (API Server)
apiApp.get('/test-db-connection', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connection successful.', solution: rows[0].solution });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed.' });
  }
});

// Registration Endpoint (API Server)
apiApp.post('/register', async (req, res) => {
  const { business_name, username, password } = req.body;

  // Validate inputs
  if (!business_name || business_name.trim().length < 3) {
    return res.status(400).json({ message: 'Business name must be at least 3 characters.' });
  }
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    // Check if user exists
    const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    await promisePool.query(
      'INSERT INTO users (business_name, username, password) VALUES (?, ?, ?)',
      [business_name, username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

// Login Endpoint (API Server)
apiApp.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate inputs
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Find user
    const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const user = rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Generate token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Change Password Endpoint (API Server)
apiApp.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.user.username;

  // Validate inputs
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new passwords are required.' });
  }

  try {
    // Find user
    const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const user = rows[0];

    // Verify old password
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Incorrect old password.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await promisePool.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error changing password.' });
  }
});

// Get User Profile Endpoint (API Server)
apiApp.get('/profile', authenticateToken, async (req, res) => {
  const username = req.user.username;

  try {
    const [rows] = await promisePool.query('SELECT business_name, username FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = rows[0];
    res.status(200).json({ business_name: user.business_name, username: user.username });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching user profile.' });
  }
});

// Update Business Name Endpoint (API Server)
apiApp.post('/update-business-name', authenticateToken, async (req, res) => {
  const { newBusinessName } = req.body;
  const username = req.user.username;

  // Validate input
  if (!newBusinessName || newBusinessName.trim().length < 3) {
    return res.status(400).json({ message: 'Business name must be at least 3 characters.' });
  }

  try {
    // Update business_name
    await promisePool.query(
      'UPDATE users SET business_name = ? WHERE username = ?',
      [newBusinessName.trim(), username]
    );

    res.status(200).json({ message: 'Business name updated successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error updating business name.' });
  }
});

// Start the API server
apiApp.listen(API_PORT, () => {
  console.log(`Data service is running on http://localhost:${API_PORT}`);
});
