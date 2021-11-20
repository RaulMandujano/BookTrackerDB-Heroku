const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
	bookId: String,
	rating: Number,
});

module.exports = mongoose.model('Book', bookSchema);
