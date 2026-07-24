const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./data/database');  // Database connection

const app = express();
app.use(express.json());

const SECRET_KEY = 'your-secret-key';

////////////////////////////////////////////////////////////////
app.post('/register', (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Username and password are required.'
    });
  }
  const { username, password } = req.body;
  try {
    const result = db
      .prepare(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
      )
      .run(username, password, 'student');
    res.status(201).json({
      message: 'User created!',
      id: result.lastInsertRowid
    });
  } catch (error) {
    // UNIQUE constraint fires if the username already exists.
    return res.status(409).json({
      message: 'That username is already taken.'
    });
  }
});
////////////////////////////////////////////////////////////////


// ============================================
// POST /login - Authenticate user
// ============================================
app.post('/login', (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Username and password are required.'
    });
  }
  const { username, password } = req.body;

  // Ask the database for one row matching this username.
  const foundUser = db
    .prepare('SELECT * FROM users WHERE username = ?')
    .get(username);

  if (!foundUser || foundUser.password !== password) {
    return res.status(401).json({
      message: 'Invalid username or password.'
    });
  }

  const token = jwt.sign(
    { id: foundUser.id, username: foundUser.username, role: foundUser.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
  res.json({ message: 'Login successful!', token: token });
});

// ============================================
// POST /register - Create new user
// ============================================
app.post('/register', (req, res) => {
  // Check if username and password are provided
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Username and password are required.'
    });
  }

  const { username, password } = req.body;

  try {
    // Insert new user into database
    const result = db
      .prepare(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
      )
      .run(username, password, 'student');

    // Return success response with new user ID
    res.status(201).json({
      message: 'User created!',
      id: result.lastInsertRowid
    });

  } catch (error) {
    // UNIQUE constraint error - username already exists
    return res.status(409).json({
      message: 'That username is already taken.'
    });
  }
});

// ============================================
// GET /users - List all users (stretch goal)
// ============================================
app.get('/users', (req, res) => {
  const users = db
    .prepare('SELECT id, username, role FROM users')
    .all();
  res.json(users);
});

// ============================================
// Start server
// ============================================
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});