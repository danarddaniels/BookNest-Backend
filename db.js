require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('DB Connected');
	} catch (err) {
		console.error(err);
		process.exit(1); // crash app if DB fails
	}
};

module.exports = connectDB;
