// server/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2'); // ensure mysql2 package is available
const path = require('path');
require('dotenv').config();

// Create two separate Express apps
const app = express();      // Web server app: serves static files
const apiApp = express();   // API/data service app: handles API endpoints

// Ports
const WEB_PORT = 3000;      // Web server port
const API_PORT = 3001;      // API server port

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for both apps
app.use(cors());
app.use(bodyParser.json());
apiApp.use(cors());
apiApp.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle requests to '/' by serving landing-page.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/landing-page.html'));
});

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

/* ------------------- Authentication Middleware ------------------- */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token)
    return res.status(401).json({ message: 'Access token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: 'Invalid access token.' });
    req.user = user;
    next();
  });
}

/* ------------------- API Endpoints on apiApp ------------------- */

// Test Database Connection Endpoint
apiApp.get('/test-db-connection', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connection successful.', solution: rows[0].solution });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed.' });
  }
});

// Registration Endpoint
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

// Login Endpoint
apiApp.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Find user by username
    const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Include the immutable user id in the token payload
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Get User Profile Endpoint
apiApp.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Use the id from the token

  try {
    const [rows] = await promisePool.query('SELECT business_name, username FROM users WHERE id = ?', [userId]);
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

// Update Business Name Endpoint
apiApp.post('/update-business-name', authenticateToken, async (req, res) => {
  const { newBusinessName } = req.body;
  const userId = req.user.id;

  if (!newBusinessName || newBusinessName.trim().length < 3) {
    return res.status(400).json({ message: 'Business name must be at least 3 characters.' });
  }

  try {
    await promisePool.query(
      'UPDATE users SET business_name = ? WHERE id = ?',
      [newBusinessName.trim(), userId]
    );
    res.status(200).json({ message: 'Business name updated successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error updating business name.' });
  }
});

// Update Username Endpoint (API Server)
apiApp.post('/update-username', authenticateToken, async (req, res) => {
  const { newUsername } = req.body;
  const currentUserId = req.user.id;  // immutable user id from token

  // Validate input
  if (!newUsername || newUsername.trim().length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters.' });
  }

  try {
    // Optionally, check if the new username already exists
    const [existingRows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [newUsername.trim()]);
    if (existingRows.length > 0) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    // Update the username in the database
    await promisePool.query('UPDATE users SET username = ? WHERE id = ?', [newUsername.trim(), currentUserId]);

    // Retrieve the updated user record
    const [updatedRows] = await promisePool.query('SELECT * FROM users WHERE id = ?', [currentUserId]);
    const updatedUser = updatedRows[0];

    // Generate a new JWT token with the updated username and the same user id
    const newToken = jwt.sign({ id: updatedUser.id, username: updatedUser.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Username updated successfully.', token: newToken });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error updating username.' });
  }
});


// Change Password Endpoint
apiApp.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new passwords are required.' });
  }

  try {
    // Find user by id
    const [rows] = await promisePool.query('SELECT * FROM users WHERE id = ?', [userId]);
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

    // Update password in the database
    await promisePool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error changing password.' });
  }
});

// Start the API server
apiApp.listen(API_PORT, () => {
  console.log(`Data service is running on http://localhost:${API_PORT}`);
});
