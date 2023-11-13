// pulling in packages
const mysql = require("mysql2");
const fs = require("fs");
const inquirer = require("inquirer");
require("dotenv").config();

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

// Creating an array of questions for user input
const userInput = () => {
  return (
    inquirer
      .prompt([
        {
          type: "list",
          message: "How would you like to proceed?",
          name: "actions",
          Choices: [
            "view all departments",
            "view all roles",
            "view all employees",
            "add a department",
            "add a role",
            "add an employee",
            "update an employee role",
            "Exit",
          ],
        },
      ])

      // sets up reaction to userInput choice
      .then((data) => {
        switch (data.actions) {
          case "view all departments":
           viewAllDepartments();
            break;
          case "view all roles":
            viewAllRoles();
            break;
          case "view all employees":
            viewAllEmployees();
            break;
          case "add a department":
            addADepartment();
            break;
          case "add a role":
            addARole();
            break;
          case "add an employee":
            addAnEmployee();
            break;
          case "update an employee role":
            updateAnEmployeeRole();
            break;
          default:
            db.end();
            console.log("Goodbye!");
            break;
        }
      })
  );
};

// 

// close the connection when the application exits
process.on("exit", () => {
  db.end();
});