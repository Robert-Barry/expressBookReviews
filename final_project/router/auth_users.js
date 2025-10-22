const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any user with the same username is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password are missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in." });
    }
    console.log(authenticatedUser(username, password));
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password    
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).send("User successfully logged in.");
    } else {
        return res.status(208).json({ message: "Invalid login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const user = req.session.authorization.username;
    let i = 0; // Keep i for after the loop
    // Check if there are multiple reviews
    if (books[isbn]["reviews"].length > 0) { 
        // Loop through the reviews looking for the logged in user.
        // If the user is found, change their review.
        for (; i < books[isbn]["reviews"].length; i++) {
            if (books[isbn]["reviews"][i].username === user) {
                books[isbn]["reviews"][i] = { "username": user, "review": review };
                return res.status(200).json({ message: `Review added: ${books[isbn]["reviews"][i].username}, ${books[isbn]["reviews"][i].review}` });
            }
        }
    }
    // Add a new review
    books[isbn]["reviews"].push({ "username": user, "review": review });
    return res.status(200).json({ message: `Review added: ${books[isbn]["reviews"][i].username}, ${books[isbn]["reviews"][i].review}` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const user = req.session.authorization.username;
    if (books[isbn]["reviews"].length > 0) {
        let filteredReviews = books[isbn]["reviews"].filter((review) => {
            return review.username !== user;
        });
        books[isbn]["reviews"] = filteredReviews;
        return res.status(200).json({ message: `Review deleted for ISBN ${isbn}` });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
