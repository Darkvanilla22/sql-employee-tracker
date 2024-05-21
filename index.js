// Required modules
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');  // Correct usage for console.table

// Load environment variables
require('dotenv').config();

// Create a database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,  // Default to 3306 if DB_PORT is not specified
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the database.');
  runMainMenu();
});

// Function to display the main menu and handle user input
function runMainMenu() {
    inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit'
      ]
    })
    .then(answer => {
        switch(answer.action) {
          case 'View All Departments':
            viewDepartments();
            break;
          case 'View All Roles':
            viewRoles();
            break;
          case 'View All Employees':
            viewEmployees();
            break;
          case 'Add a Department':
            addDepartment();
            break;
          case 'Add a Role':
            addRole();
            break;
          case 'Add an Employee':
            addEmployee();
            break;
          case 'Update an Employee Role':
            updateEmployeeRole();
            break;
          case 'Exit':
            connection.end();
            console.log('Goodbye!');
            break;
        }
    });
}

// Function to view all departments
function viewDepartments() {
    const query = 'SELECT * FROM departments';
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      runMainMenu();
    });
  }
  
  // Function to view all roles
  function viewRoles() {
    const query = `
      SELECT roles.role_id, roles.title, departments.name AS department, roles.salary
      FROM roles
      INNER JOIN departments ON roles.department_id = departments.department_id
    `;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      runMainMenu();
    });
  }
  
  // Function to view all employees
  function viewEmployees() {
    const query = `
      SELECT employees.employee_id, employees.first_name, employees.last_name, 
             roles.title AS job_title, departments.name AS department, roles.salary, 
             CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employees
      LEFT JOIN roles ON employees.role_id = roles.role_id
      LEFT JOIN departments ON roles.department_id = departments.department_id
      LEFT JOIN employees manager ON employees.manager_id = manager.employee_id
    `;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      runMainMenu();
    });
  }
  