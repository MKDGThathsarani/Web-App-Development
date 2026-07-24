const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyToken, requireRole, SECRET_KEY } = require('./middleware/auth');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Users data (mock database)
const users = [
    { id: 1, username: 'kamal', password: '1234', role: 'admin', name: 'Kamal Perera' },
    { id: 2, username: 'nimali', password: 'abcd', role: 'student', name: 'Nimali Fernando' }
];

// ============================================
// POST /login - Login route එක
// ============================================
app.post('/login', (req, res) => {
    console.log('🔐 Login attempt');
    
    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: '❌ Username and password are required.'
        });
    }

    const { username, password } = req.body;

    const foundUser = users.find(
        (user) => user.username === username && user.password === password
    );

    if (!foundUser) {
        console.log('❌ Invalid login attempt:', username);
        return res.status(401).json({
            success: false,
            message: '❌ Invalid username or password.'
        });
    }

    // Generate JWT token
    const token = jwt.sign(
        {
            id: foundUser.id,
            username: foundUser.username,
            role: foundUser.role,
            name: foundUser.name
        },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    console.log('✅ Login successful:', username);

    res.json({
        success: true,
        message: '✅ Login successful!',
        token: token,
        user: {
            id: foundUser.id,
            username: foundUser.username,
            role: foundUser.role,
            name: foundUser.name
        }
    });
});

// ============================================
// GET /dashboard - Protected route
// ============================================
app.get('/dashboard', verifyToken, (req, res) => {
    res.json({
        success: true,
        message: `👋 Welcome to your dashboard, ${req.user.name}!`,
        user: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role
        }
    });
});

// ============================================
// GET /admin - Admin only route
// ============================================
app.get('/admin', verifyToken, requireRole('admin'), (req, res) => {
    res.json({
        success: true,
        message: '👑 Welcome to Admin Panel!',
        users: users.map(u => ({
            id: u.id,
            username: u.username,
            role: u.role,
            name: u.name
        }))
    });
});

// ============================================
// GET / - Welcome
// ============================================
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Welcome to HICT 32022 Auth API',
        endpoints: {
            login: 'POST /login',
            dashboard: 'GET /dashboard (protected)',
            admin: 'GET /admin (admin only)'
        }
    });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `❌ Route ${req.method} ${req.url} not found`
    });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log('\n📋 Available Routes:');
    console.log('  POST /login        - Login & get token');
    console.log('  GET  /dashboard    - Protected (any user)');
    console.log('  GET  /admin        - Admin only');
    console.log('\n🔑 Test Users:');
    console.log('  kamal   / 1234     (role: admin)');
    console.log('  nimali  / abcd     (role: student)');
    console.log('========================================\n');
});