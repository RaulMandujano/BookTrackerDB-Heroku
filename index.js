const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./server/config/db');
const Book = require('./server/Models/Book');

const app = express();

// enabling cors
app.use(cors());
// Load env variables
dotenv.config({ path: './server/config/config.env' });

// connecting to database

connectDB();

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

app.post('/api/v1/rating', async (req, res) => {
	const rating = req.query.rating;
	const bookId = req.query.bookId;

	console.log(rating + ', ' + bookId);
	const book = await Book.findOne({ bookId: bookId });
	console.log(book);
	let newOrUpdatedBook = undefined;

	try {
		if (book) {
			newOrUpdatedBook = await Book.findByIdAndUpdate(
				book._id,
				{ rating },
				{
					new: true,
					runValidators: true,
				}
			);

			res.status(200).json({
				success: true,
			});
		} else {
			console.log('here');
			newOrUpdatedBook = await Book.create({
				bookId: bookId,
				rating: rating,
			});

			res.status(200).json({
				success: true,
			});
		}
	} catch (err) {
		res.status(400).json({
			success: false,
			data: err,
		});
	}
});

app.get('/api/v1/rating', async (req, res) => {
	const allRatedBooks = await Book.find();

	try {
		if (allRatedBooks !== []) {
			res.status(200).json({
				succuss: true,
				data: allRatedBooks,
			});
		} else {
			res.status(400).json({
				success: false,
				data: 'some error!!',
			});
		}
	} catch (err) {
		res.status(400).json({
			success: false,
			data: err,
		});
	}
});
