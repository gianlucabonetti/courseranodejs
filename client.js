const axios = require('axios');

getAllBooks();
searchByISBN('9780140448955');
searchByAuthor('dante');
searchByTitle('comedy');

async function getAllBooks() {
	axios.get('http://localhost:5000/book').then(response => {
		console.log("Get All Books");
		console.table(response.data);
	}).catch(error => {
		console.error('Error fetching books', error.message);
	});
}

function searchByISBN(isbn) {
	return new Promise((resolve, reject) => {
		axios.get(`http://localhost:5000/book/isbn/${isbn}`)
			.then(response => {
				console.log("\n\nSearch by ISBN");
				console.table(response.data);
				resolve(response.data);
			})
			.catch(error => {
				console.error('Error fetching book by ISBN:', error.message);
				reject(error);
			});
	});
}

async function searchByAuthor(author) {
	try {
		const response = await axios.get(`http://localhost:5000/book/author/${author}`);
		console.log("\n\nSearch by author");
		console.table(response.data);
	} catch (error) {
		console.error('Error fetching book by author:', error.message);
	}
}

async function searchByTitle(title) {
	try {
		const response = await axios.get(`http://localhost:5000/book/title/${title}`);
		console.log("\n\nSearch by title");
		console.table(response.data);
	} catch (error) {
		console.error('Error fetching book by title:', error.message);
	}
}
