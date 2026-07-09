const express = require('express');
const mockData = require('./data');

const app = express();
const PORT = 3000;

// GET Route - Home page
app.get('/', (request, response) => {
    response.send('Hello! My Node.js server is running!!');
});

// GET Route - All users
app.get('/api/users', (request, response) => {
    response.json(mockData.users);
});

// ✅ GET Route - Specific user by ID (මෙය එකතු කරන්න)
app.get('/api/users/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const user = mockData.users.find(u => u.id === id);

    if (user) {
        response.json(user);
    } else {
        response.status(404).json({ message: 'User not found' });
    }
});

// Server starts listening
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});