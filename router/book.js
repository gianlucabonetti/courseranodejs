const express = require("express");
const routes = express.Router();
const books = require("./database.js");

// Get the book list available in the shop
routes.get("/", async (req, res) => {
    try {
        // Simulate async behavior, like fetching from a database in future cases
        let result = await books
            .map(([bookId, book]) => book)
            .map((book) => structuredClone(book));

        if (result.length === 0) {
            return res.status(404).json({ "status": 404, "description": "Book not found" });
        } else {
            return res.status(200).json(result);
        }
    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({ "status": 500, "description": "Internal Server Error" });
    }
});

// Get book details based on ISBN
routes.get("/isbn/:isbn", (req, res) => {
	let search = req.params.isbn;

	// Create a promise for the book search
	let bookSearchPromise = new Promise((resolve, reject) => {
		let result = books
			.map(([bookId, book]) => book)
			.filter((book) => book.isbn === search)
			.map((book) => structuredClone(book));

		if (result.length === 0) {
			// Reject if no book is found
			reject({ "status": 404, "description": "Book not found" });
		} else {
			// Resolve with the found book
			resolve(result);
		}
	});

	// Handle the promise result
	bookSearchPromise
		.then((result) => {
			// Send the resolved result
			return res.status(200).json(result);
		})
		.catch((error) => {
			// Handle any errors or rejection
			if (error.status === 404) {
				return res.status(404).json(error);
			} else {
				return res.status(500).json({ "status": 500, "description": "Server error", "error": error.message });
			}
		});
});

// Get book details based on author
routes.get("/author/:author", (req, res) => {
	let search = req.params.author.toLowerCase();

	// Create a promise for the book search
	let authorSearchPromise = new Promise((resolve, reject) => {
		let result = books
			.map(([bookId, book]) => book)
			.filter((book) => book.author.toLowerCase().includes(search))
			.map((book) => structuredClone(book));

		if (result.length === 0) {
			// Reject if no book is found
			reject({ "status": 404, "description": "Book not found" });
		} else {
			// Resolve with the found books
			resolve(result);
		}
	});

	// Handle the promise result
	authorSearchPromise
		.then((result) => {
			// Send the resolved result
			return res.status(200).json(result);
		})
		.catch((error) => {
			// Handle the rejection or any errors
			if (error.status === 404) {
				return res.status(404).json(error);
			} else {
				return res.status(500).json({ "status": 500, "description": "Server error", "error": error.message });
			}
		});
});

// Get all books based on title
routes.get("/title/:title", (req, res) => {
	let search = req.params.title.toLowerCase();

	// Create a promise for the title search
	let titleSearchPromise = new Promise((resolve, reject) => {
		let result = books
			.map(([bookId, book]) => book)
			.filter((book) => book.title.toLowerCase().includes(search))
			.map((book) => structuredClone(book));

		if (result.length === 0) {
			// Reject if no book is found
			reject({ "status": 404, "description": "Book not found" });
		} else {
			// Resolve with the found books
			resolve(result);
		}
	});

	// Handle the promise result
	titleSearchPromise
		.then((result) => {
			// Send the resolved result
			return res.status(200).json(result);
		})
		.catch((error) => {
			// Handle the rejection or any errors
			if (error.status === 404) {
				return res.status(404).json(error);
			} else {
				return res.status(500).json({ "status": 500, "description": "Server error", "error": error.message });
			}
		});
});

module.exports.routes = routes;
