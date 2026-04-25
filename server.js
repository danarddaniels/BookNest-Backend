require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const app = express();
const UserRouter = require('./User');

const BookRouter = require('./BookRoutes');
const PORT = process.env.PORT || 4000;

const corsOptions = {
	origin: 'https://book-nest-sandy.vercel.app',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

connectDB();

app.get('/cors-test', (req, res) => {
	res.json({ message: 'CORS is working' });
});

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
