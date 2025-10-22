const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const createBookObject = (book, isbn) => {
    return { "isbn": isbn, "author": book["author"], "title": book["title"], "reviews": book["reviews"] }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        const bookObject = createBookObject(books[isbn], isbn);
        res.send(JSON.stringify(bookObject, null, 4));
    } else {
        res.send(`No book listed with ISBN: ${isbn}`);
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorBooks = [];
    const author = req.params.author;
    for (isbn in books) {
        if (books[isbn]["author"] === author) {
            let booksObject = createBookObject(books[isbn], isbn);
            authorBooks.push(booksObject);
        }
    }
    if (authorBooks.length > 0) {
        res.send(JSON.stringify(authorBooks, null, 4));
    } else {
        res.send(`${author} not found`);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let bookObject;
    for (isbn in books) {
        if (books[isbn]["title"] === title) {
            bookObject = createBookObject(books[isbn], isbn);
        }
    }

    if (bookObject != undefined) {
        res.send(JSON.stringify(bookObject, null, 4));
    } else {
        res.send(`${title} not found`);
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn]["reviews"]);
    } else {
        res.send(`Book with ISBN ${isbn} not found`);
    }
});

module.exports.general = public_users;
