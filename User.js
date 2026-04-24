const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');

const User = require('./UserSchema');

router.post('/register', (req, res) => {
	let { name, email, password } = req.body;

	name = name.trim();
	email = email.trim();
	password = password.trim();

	if (name == '' || email == '' || password == '') {
		res.json({
			status: 'FAILED',
			message: 'Empty input fields!',
		});
	} else if (!/^[a-zA-Z ]*$/.test(name)) {
		res.json({
			status: 'FAILED',
			message: 'Invalid name entered!',
		});
	} else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
		res.json({
			status: 'FAILED',
			message: 'Invalid email entered!',
		});
	} else if (password.length < 8 || password.length > 12) {
		res.json({
			status: 'FAILED',
			message: 'Password must be at least 8 to 12 characters!',
		});
	} else {
		//Checking if user already exists
		User.find({ email })
			.then((users) => {
				if (users.length) {
					//A User already exists
					res.json({
						status: 'FAILED',
						message: 'User with the provided email already exists!',
					});
				} else {
					User.create({ name, email, password })
						.then((user) => {
							return res.json({
								status: 'SUCCESS',
								message: 'Signup successful',
								data: user,
							});
						})
						.catch((err) => {
							return res.json({
								status: 'FAILED',
								message: 'An error occurred while creating user!',
							});
						});
				}
			})
			.catch((err) => {
				res.json({
					status: 'FAILED',
					message: 'An error occured while checking email!',
				});
			});
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
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
		});

		res.json({
			status: 'SUCCESS',
			message: 'Login successful',
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
