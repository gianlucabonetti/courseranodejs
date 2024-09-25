const express = require("express");
const routes = express.Router();
const books = require("./database.js");

// Get the book list available in the shop
routes.get("/", (req, res) => {
	let result = books
		.map(([bookId, book]) => book)
		.map((book) => structuredClone(book));

	// Remove reviews
	result.forEach((book) => delete book.reviews);

	if (result.length == 0) {
		return res.status(404).json({ "status": 404, "description": "Book not found" });
	} else {
		return res.status(200).json(result);
	}
});

// Get book details based on ISBN
routes.get("/isbn/:isbn", (req, res) => {
	let search = req.params.isbn;
	let result = books
		.map(([bookId, book]) => book)
		.filter((book) => book.isbn === search)
		.map((book) => structuredClone(book));

	// Remove reviews
	result.forEach((book) => delete book.reviews);

	if (result.length == 0) {
		return res.status(404).json({ "status": 404, "description": "Book not found" });
	} else {
		return res.status(200).json(result);
	}
});

// Get book details based on author
routes.get("/author/:author", (req, res) => {
	let search = req.params.author.toLowerCase();
	let result = books
		.map(([bookId, book]) => book)
		.filter((book) => book.author.toLowerCase().includes(search))
		.map((book) => structuredClone(book));

	// Remove reviews
	result.forEach((book) => delete book.reviews);

	if (result.length == 0) {
		return res.status(404).json({ "status": 404, "description": "Book not found" });
	} else {
		return res.status(200).json(result);
	}
});

// Get all books based on title
routes.get("/title/:title", (req, res) => {
	let search = req.params.title.toLowerCase();
	let result = books
		.map(([bookId, book]) => book)
		.filter((book) => book.title.toLowerCase().includes(search))
		.map((book) => structuredClone(book));

	// Remove reviews
	result.forEach((book) => delete book.reviews);

	if (result.length == 0) {
		return res.status(404).json({ "status": 404, "description": "Book not found" });
	} else {
		return res.status(200).json(result);
	}
});

module.exports.routes = routes;
