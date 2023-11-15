// pulling in packages
const mysql = require("mysql2");
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

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
 userInput();
});

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

function viewAllDepartments() {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("Viewing All Departments: ");
    console.table(res);
    userInput();
  });
}

function viewAllRoles() {
  const query = "SELECT * FROM roles";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("Viewing All Roles: ");
    console.table(res);
    userInput();
  });
}

function viewAllEmployees() {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("Viewing All Employees: ");
    console.table(res);
    userInput();
  });
}

function addADepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "What is the name of the dpeartment?",
    })
    .then((answer) => {
      console.log(answer.name);
      const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
      connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(`Added department ${answer.name} to the database!`);
        console.table(res);
        userInput();
        console.log(answer.name);
      });
    });
}

function addARole() {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of the new role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary of the new role:",
        },
        {
          type: "list",
          name: "department",
          message: "Select the department for the new role:",
          choices: res.map((department) => department.department_name),
        },
      ])
      .then((answers) => {
        const department = res.find(
          (department) => department.name === answers.department
        );
        const query = "INSERT INTO roles SET ?";
        connection.query(
          query,
          {
            title: answers.title,
            salary: answers.salary,
            department_id: department,
          },
          (err, res) => {
            if (err) throw err;
            console.log(
              `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
            );
            // restart the application
            userInput();
          }
        );
      });
  });
}

function addAnEmployee() {
  const rolesArray = [];
  const newEmployee = [];
  db.query(`SELECT * FROM roles`, function (err, res) {
    for (let i = 0; i < res.length; i++) {
      rolesArray.push(res[i].title);
    }

    db.query(`SELECT * FROM employee`, function (err, res) {
      for (let i = 0; i < results.length; i++) {
        let employeeName = `${results[i].first_name} ${res[i].last_name}`;
        newEmployee.push(employeeName);
      }
      return inquirer
        .prompt([
          {
            type: "input",
            message: "First name?",
            name: "first_name",
          },
          {
            type: "input",
            message: "Last name?",
            name: "last_name",
          },
          {
            type: "list",
            message: "Employee's role?",
            name: "role",
            choices: rolesArray,
          },
          {
            type: "list",
            message: "Does the employee have a manager?",
            name: "has_manager",
            choices: ["Yes", "No"],
          },
        ])
        .then((data) => {
          let roleName = data.role;
          let first_name = data.first_name;
          let last_name = data.last_name;
          let role_id = "";
          let manager = "";
          // populates role id
          db.query(
            `SELECT id FROM role WHERE role.title = ?`,
            data.role,
            (err, res) => {
              role_id = res[0].id;
            }
          );
          if (data.has_manager === "Yes") {
            return inquirer
              .prompt([
                {
                  type: "list",
                  message: "Who is the employees manager?",
                  name: "manager",
                  choices: newEmployee,
                },
              ])
              .then((data) => {
                // get role id
                db.query(
                  `SELECT id FROM roles WHERE roles.title = ?`,
                  roleName,
                  (err, res) => {
                    roles_id = res[0].id;
                  }
                );
                db.query(
                  `SELECT id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?;`,
                  data.manager.split(" "),
                  (err, res) => {
                    manager = res[0].id;
                    db.query(
                      `INSERT INTO employee (first_name, last_name, roles_id, manager_id) 
                        VALUES (?,?,?,?)`,
                      [first_name, last_name, roles_id, manager],
                      (err, res) => {
                        console.log("\nNew employee added. See below:");
                        viewAllEmployees();
                      }
                    );
                  }
                );
              });
          } else {
            manager = null;

            db.query(
              `SELECT id FROM role WHERE roles.title = ?`,
              roleName,
              (err, res) => {
                role_id = res[0].id;

                db.query(
                  `INSERT INTO employee (first_name, last_name, roles_id, manager_id) 
                    VALUES (?,?,?,?)`,
                  [data.first_name, data.last_name, role_id, manager],
                  (err, res) => {
                    console.log("\nNew employee added. See below:");
                    viewAllEmployees();
                  }
                );
              }
            );
          }
        });
    });
  });
}

function updateAnEmployeeRole() {
  const queryEmployees = "SELECT * FROM employee";
  const queryRoles = "SELECT * FROM roles";
  connection.query(queryEmployees, (err, resEmployees) => {
    if (err) throw err;
    connection.query(queryRoles, (err, resRoles) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employees role do you want to update?",
            choices: () => {
              var array = [];
              for (var i = 0; i < res.length; i++) {
                array.push(res[i].last_name);
              }
              var newEmployee = [...new Set(array)];
              return newEmployee;
            },
          },
        ])
        .then((answers) => {
          const employee = resEmployees.find(
            (employee) =>
              `${employee.first_name} ${employee.last_name}` ===
              answers.employee
          );
          const role = resRoles.find((role) => role.title === answers.role);
          const query = "UPDATE employee SET roles_id = ? WHERE id = ?";
          connection.query(query, [role.id, employee.id], (err, res) => {
            if (err) throw err;
            console.log(
              `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
            );

            userInput();
          });
        });
    });
  });
}
