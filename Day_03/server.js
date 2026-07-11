// 1. Import Express
const express = require('express');

// 2. Initialize Express app
const app = express();
const port = 3000;

// 3. MIDDLEWARE - Unpack JSON data (THIS IS VERY IMPORTANT!)
app.use(express.json());

// 4. Initial book data array (acts as a temporary "database")
let books = [
    { id: 1, title: "150" },
    { id: 2, title: "The Great Gatsby" }
];

// 5. GET route - Get all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

// 6. POST route - Add a new book
app.post('/api/books', (req, res) => {
    const newBook = req.body;
    books.push(newBook);
    res.json({ message: "Book added successfully!" });
});

// 7. 🆕 මුල් පිටුව සඳහා route එක (මෙතන add කරන්න!)
app.get('/', (req, res) => {
    res.send('Welcome to the Book API! Visit /api/books to see all books.');
});

// 8. Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});