const express = require("express");
const routes = express.Router();
const books = require("./database.js");
const jwtVerify = require("./user.js").jwtVerify;

//  Get book reviews
routes.get("/:isbn", (req, res) => {
	let search = req.params.isbn;

	// Search book by ISBN
	let list = books.filter(([bookId, book]) => book.isbn === search);
	if (list.length == 0) {
		return res.status(404).json({ "status": 404, "description": "Book not found" });
	}

	let result = list
		// Map [bookId,book] pairs to book.entries as a collection
		.flatMap(([bookId, book]) => Object.entries(book.reviews))

		// Extract only the review from [userId,review] pair
		.flatMap(([userId, review]) => review);

	// Return reviews
	return res.status(200).json(result);
});

routes.put("/:isbn", (req, res) => {
	let username = jwtVerify(req.headers.authorization);
	if (username == null) {
		return res.status(401).json({ "status": 401, "description": "Unauthorized" });
	}

	const { review } = req.body;

	let search = req.params.isbn;
	let result = books.map(([bookId, book]) => book).filter((book) => book.isbn === search);

	switch (result.length) {
		case 0:
			return res.status(404).json({ "status": 404, "description": "Book not found" });
		case 1:
			let book = result[0];
			book.reviews[username] = review;

			return res.status(200).json({ "status": 200, "description": "OK" });
		default:
			return res.status(409).json({ "status": 409, "description": "Multiple book entires with this ISBN code" });
	}
});

routes.delete("/:isbn", (req, res) => {
	let username = jwtVerify(req.headers.authorization);
	if (username == null) {
		return res.status(401).json({ "status": 401, "description": "Unauthorized" });
	}

	let search = req.params.isbn;
	let result = books.map(([bookId, book]) => book).filter((book) => book.isbn === search);
	switch (result.length) {
		case 0:
			return res.status(404).json({ "status": 404, "description": "Book not found" });
		case 1:
			let book = result[0];
			let review = book.reviews[username];
			if (review != null) {
				delete book.reviews[username];

				return res.status(200).json({ "status": 200, "description": "OK" });
			} else {
				return res.status(404).json({ "status": 404, "description": "Review not found" });
			}
		default:
			return res.status(409).json({ "status": 409, "description": "Multiple book entires with this ISBN code" });
	}
});

module.exports.routes = routes;
