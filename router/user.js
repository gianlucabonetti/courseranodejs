const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");

const secretKey = "ThisIsOneVeryLongSecret!!!";

let users = [];

const isValidUser = (username) => { // returns boolean
	username = username.trim().toLowerCase();

	return users.find((user) => user.username === username);
}

const authenticateUser = (username, password) => { // returns boolean
	username = username.trim().toLowerCase();

	return users.find((user) => user.username.trim().toLowerCase() === username && user.password === password);
}

const jwtVerify = (token) => {
	if (!token) {
		return false;
	}
	
	if (token.startsWith("Bearer ")) {
		token = token.slice(7, token.length).trim();
	}

	try {
		return jwt.verify(token, secretKey).username;
	} catch (e) {
		return null;
	}
}

// Register API
routes.post("/register", (req, res) => {
	const { username, password, firstName, lastName, city } = req.body;
	const user = {
		"username": username,
		"password": password, // this should be encrypted in real world apps
		"firstName": firstName,
		"lastName": lastName,
		"city": city
	};

	if (isValidUser(username)) {
		return res.status(409).json({ "status": 409, "description": "User already exists" });
	} else {
		users.push(user);

		return res.status(200).json({ "status": 200, "description": "OK" });
	}
});

// Login API
routes.post("/login", (req, res) => {
	const { username, password } = req.body;

	if (authenticateUser(username, password)) {
		// Generate JWT with username payload
		const token = jwt.sign({ "username": username }, secretKey, { expiresIn: '1h' });

		return res.status(200).json({ "status": 200, "description": "OK", "token": token });
	} else {
		return res.status(401).json({ "status": 401, "description": "Invalid credentials" });
	}
});

module.exports.routes = routes;
module.exports.users = users;
module.exports.jwtVerify = jwtVerify;

