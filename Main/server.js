// Import and require mysql2
const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: process.env.DB_USER,
    // MySQL password
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the company_db database.`)
);

// Query database
db.query("SELECT * FROM movie_name", function (err, result) {
  console.log(result);
});

app.get("/api/movies", (req, res) => {
  db.query("SELECT id, movie_name FROM  movies;", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Sorry, something went wrong." });
    }
    res.status(200).json(results);
  });
});

app.post("/api/movies", (req, res) => {
  db.query(
    "INSERT INTO movies (movie_name) VALUES (?);",
    req.body.movie_name,
    (err, result) => {
      if (err) {
        res.status(400).json({ message: "You might have sent invalid data." });
      }
      res.status(201).json(result);
    }
  );
});

app.get("/api/movies/:id/reviews", (req, res) => {
  db.query(
    "SELECT id, review FROM reviews WHERE movie_id = ?;",
    req.params.id,
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Sorry, something went wrong." });
      }
      res.status(200).json(results);
    }
  );
});

app.post("/api/movies/:id/reviews", (req, res) => {
  db.query(
    "INSERT INTO reviews (movie_id, review) VALUES (?, ?);",
    [req.params.id, req.body.review],
    (err, result) => {
      if (err) {
        res.status(400).json({ message: "You might have sent invalid data." });
      }
      res.status(201).json(result);
    }
  );
});

app.delete("/api/movies/:id", (req, res) => {
  db.query("DELETE FROM movies WHERE id = ?;", req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Sorry, something went wrong." });
    }
    res.status(204).json(result);
  });
});

app.get("/api/movie/reviews", (req, res) => {
  db.query(
    "SELECT m.id, m.movie_name, r.id AS review_id, r.review FROM movies AS M INNER JOIN reviews as r ON m.id = r.movie_id;",
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Sorry, something went wrong." });
      }
      res.status(202).json(results);
    }
  );
});

app.put("/api/reviews/:id", (req, res) => {
  if (!req.body.review) {
    res
      .status(400)
      .json({ message: "Please provide a review property in your JSON body.;" });
  }
  db.query(
    "UPDATE reviews SET review = ? WHERE id = ?;",
    [req.params.review, req.body.id],
    (err, result) => {
      if (err) {
        res.status(400).json({ message: "You might have sent invalid data." });
      }
      res.status(200).json(result);
    }
  );
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
