const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	title: String,
	author: String,
	completed: String,
	readPages: Number,
	remainingPages: Number,
	cover: String,
});

module.exports = mongoose.model("Book", BookSchema);