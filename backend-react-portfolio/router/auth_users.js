const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let isValid = users.filter((user) => user.username === username);
  if (isValid.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.find(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", async (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username or password is required" });
  }

  if (authenticatedUser(username, password)) {
    try {
      let accessToken = jwt.sign(
        {
          username: username,
          password: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );

      req.session.authentication = {
        accessToken: accessToken,
      };
      return res
        .status(200)
        .json({ message: " User logged in sucessfully!", accessToken });
    } catch (error) {
      res.status(403).send("User not authenticated");
    }
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   const isbn = req.params.isbn;
//   const { review } = req.body;
//   let token = req.session.authentication.accessToken;

//   if (!token) {
//     return res.status(404).json({ message: "User not authenticated" });
//   }

//   try {
//     let decoded = jwt.verify(token, "access");
//     const username = decoded.username;

//     if (!books[isbn]) {
//       return res.status(404).json({ message: "book not found" });
//     }
//     books[isbn].reviews[username] = review;
//     const rev = books[isbn].reviews[username];
//     return res.status(200).json({ message: "Review addedd successfully", rev });
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });

regd_users.put("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const token = req.session.authentication.accessToken;
  if (!token) {
    res.status(404).json({ message: "User not authenticated!" });
  }

  try {
    const decodded = jwt.verify(token, "access");
    const username = decodded.username;
    const book = books[isbn];
    if (!book) {
      res.status(404).json({ message: "Book not found" });
    }
    book.reviews[username] = review;
    const rev = book.reviews[username];
    res.status(200).json({
      message: `Review for the ${book} has been added successfully.`,
      rev,
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token!" });
  }
});

// Add logout logic
regd_users.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(404).json({ message: "error logged out" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "successfully logged out" });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;