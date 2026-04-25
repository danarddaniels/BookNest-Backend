const express = require('express');
const router = express.Router();
const Book = require('./BookSchema');
const verifyToken = require('./verifyToken');

// Get logged-in user's books
router.get('/', verifyToken, async (req, res) => {
	try {
		const books = await Book.find({ userId: req.user.userId });
		res.json({ success: true, books });
		console.log('cookies:', req.cookies);
		console.log('user:', req.user);
	} catch (err) {
		res.status(500).json({ message: 'Failed to get books' });
	}
});

// Add book for logged-in user
router.post('/', verifyToken, async (req, res) => {
	try {
		const book = await Book.create({
			...req.body,
			userId: req.user.userId,
		});

		res.json(book);
	} catch (err) {
		res.status(500).json({ message: 'Failed to save book' });
	}
});

// Delete user's book
router.delete('/:id', verifyToken, async (req, res) => {
	try {
		await Book.deleteOne({
			_id: req.params.id,
			userId: req.user.userId,
		});

		res.json({ message: 'Book deleted' });
	} catch (err) {
		res.status(500).json({ message: 'Failed to delete book' });
	}
});

module.exports = router;
