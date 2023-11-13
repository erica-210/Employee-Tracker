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
db.query("SELECT * FROM department_name", function (err, result) {
  console.log(result);
});

app.get("/api/department", (req, res) => {
  db.query("SELECT id, department_name FROM department;", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Sorry, something went wrong." });
    }
    res.status(200).json(results);
  });
});

app.post("/api/department", (req, res) => {
  db.query(
    "INSERT INTO department (department_name) VALUES (?);",
    req.body.department_name,
    (err, result) => {
      if (err) {
        res.status(400).json({ message: "You might have sent invalid data." });
      }
      res.status(201).json(result);
    }
  );
});

app.get("/api/department/:id/role", (req, res) => {
  db.query(
    "SELECT id, salary FROM role WHERE department_id = ?;",
    req.params.id,
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Sorry, something went wrong." });
      }
      res.status(200).json(results);
    }
  );
});

app.post("/api/department/:id/role", (req, res) => {
  db.query(
    "INSERT INTO role (department_id, department_name AS dn, title, salary) VALUES (?, ?);",
    [req.params.id, req.body.dn, req.body.title, req.body.salary],
    (err, result) => {
      if (err) {
        res.status(400).json({ message: "You might have sent invalid data." });
      }
      res.status(201).json(result);
    }
  );
});

app.get("/api/department/role", (req, res) => {
  db.query(
    "SELECT d.id, d.department_name, r.id AS role_id, r.role FROM department AS d INNER JOIN role as r ON d.id = r.department_id;",
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Sorry, something went wrong." });
      }
      res.status(202).json(results);
    }
  );
});

app.put("/api/role/:id", (req, res) => {
  if (!req.body.salary) {
    res
      .status(400)
      .json({
        message: "Please provide a review property in your JSON body.;",
      });
  }
  db.query(
    "UPDATE role SET salary = ? WHERE id = ?;",
    [req.params.salary, req.body.id],
    (err, result) => {
      if (err) {
        res.status(400).json({ message: "You might have sent invalid data." });
      }
      res.status(200).json(result);
    }
  );
});

app.delete("/api/department/:id", (req, res) => {
  db.query(
    "DELETE FROM department WHERE id = ?;",
    req.params.id,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: "Sorry, something went wrong." });
      }
      res.status(204).json(result);
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
