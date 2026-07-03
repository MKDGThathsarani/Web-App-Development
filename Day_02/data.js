const express = require('express');
const mockData = require('./data'); // Importing our data file

const app = express();
const PORT = 3000;

// This is a GET Route. When the browser visits '/', it sends a message.
app.get('/', (request, response) => {
    response.send("Hello My Node.js server is running!");
});

// This is an API Route. It returns our mock data as JSON.
app.get('/api/users', (request, response) => {
    response.json(mockData);
});

// This tells the server to start listening on port 3000
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});