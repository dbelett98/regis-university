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


// Array of small businesses with updated fields
let businesses = [
  {
    id: 1,
    name: "Bella's Bakery",
    description: 'A family-owned bakery offering fresh bread and pastries daily.',
    email: 'contact@bellasbakery.com',
    phone: '(555) 123-4567',
    image: '/images/bellas_bakery.jpg',
  },
  {
    id: 2,
    name: 'Tech Solutions Inc.',
    description: 'Providing affordable tech support for small businesses.',
    email: 'info@techsolutions.com',
    phone: '(555) 987-6543',
    image: '/images/tech_solutions.png',
  },
  {
    id: 3,
    name: 'Green Thumb Nursery',
    description: 'Your local plant nursery with a wide selection of plants and gardening supplies.',
    email: 'sales@greenthumbnursery.com',
    phone: '(555) 555-1212',
    image: '/images/green_thumb_nursery.jpg',
  },
];

// Serve static images from the 'public/images' directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Protected endpoint to get the list of businesses
app.get('/businesses', authenticateToken, (req, res) => {
  res.json(businesses);
});