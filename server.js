require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const app = express();
const UserRouter = require('./User');
const cookieParser = require('cookie-parser');
const BookRouter = require('./BookRoutes');
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
app.use(
	cors({
		origin: process.env.FRONTEND_URL, 
		credentials: true,
	}),
);

connectDB();

app.get('/', (req, res) => {
	res.send('BookNest backend is live');
});

app.use('/user', UserRouter);
app.use('/books', BookRouter);

app.get('/api/books', async (req, res) => {
	const { title, author } = req.query;

	try {
		const query = `intitle:${title}+inauthor:${author}`;

		const data = await fetch(
			`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`,
		);

		const response = await data.json();
		res.json(response);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch books' });
	}
});

app.listen(PORT, '0.0.0.0', () => {
	console.log('Server is running');
});
