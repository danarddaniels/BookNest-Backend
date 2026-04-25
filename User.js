const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('./UserSchema');

router.post('/register', async (req, res) => {
	try {
		let { name, email, password } = req.body;

		name = name.trim();
		email = email.trim().toLowerCase();
		password = password.trim();

		if (name === '' || email === '' || password === '') {
			return res.json({ status: 'FAILED', message: 'Empty input fields!' });
		}

		if (!/^[a-zA-Z ]*$/.test(name)) {
			return res.json({ status: 'FAILED', message: 'Invalid name entered!' });
		}

		if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			return res.json({ status: 'FAILED', message: 'Invalid email entered!' });
		}

		if (password.length < 8 || password.length > 12) {
			return res.json({
				status: 'FAILED',
				message: 'Password must be 8 to 12 characters!',
			});
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.json({
				status: 'FAILED',
				message: 'User with the provided email already exists!',
			});
		}

		const user = await User.create({ name, email, password });

		return res.json({
			status: 'SUCCESS',
			message: 'Signup successful',
			data: user,
		});
	} catch (err) {
		return res.json({
			status: 'FAILED',
			message: 'Server error during signup',
		});
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		email = email.trim().toLowerCase();
		password = password.trim();

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
			});
		}

		if (password !== user.password) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
			});
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		});

		res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			success: true,
			message: 'Login successful',
			user: {
				id: user._id,
				email: user.email,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server error',
		});
	}
});

module.exports = router;
