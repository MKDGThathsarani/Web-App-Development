const express = require('express');
const mockData = require('./data');

const app = express();
const PORT = 3000;

app.get('/', (request, response) => {
    response.send("Hello! My Node.js server is running!");
});

app.get('/api/users', (request, response) => {
    response.json(mockData);
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});