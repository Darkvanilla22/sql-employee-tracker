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
  database: process.env.DB_NAME
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
        'Delete a Department',
        'Delete a Role',
        'Delete an Employee',
        'Exit'
      ]
    }).then(answer => {
      switch (answer.action) {
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
        case 'Delete a Department':
          deleteDepartment();
          break;
        case 'Delete a Role':
          deleteRole();
          break;
        case 'Delete an Employee':
          deleteEmployee();
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
  
  // Function to add a new department
function addDepartment() {
    inquirer.prompt({
      name: 'name',
      type: 'input',
      message: 'What is the name of the department?'
    }).then(answer => {
      const query = 'INSERT INTO departments (name) VALUES (?)';
      connection.query(query, answer.name, (err, res) => {
        if (err) throw err;
        console.log(`Added ${answer.name} to departments.`);
        runMainMenu();
      });
    });
  }
  
  // Function to add a new role
  function addRole() {
    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is the title of the role?'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for the role?',
        validate: value => isNaN(value) === false || 'Please enter a valid number.'
      },
      {
        name: 'department_id',
        type: 'input',
        message: 'What is the department ID for this role?',
        validate: value => isNaN(value) === false || 'Please enter a valid department ID.'
      }
    ]).then(answers => {
      const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
      connection.query(query, [answers.title, answers.salary, answers.department_id], (err, res) => {
        if (err) throw err;
        console.log(`Added ${answers.title} to roles.`);
        runMainMenu();
      });
    });
  }
  
  // Function to add a new employee
  function addEmployee() {
    inquirer.prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'What is the employee\'s first name?'
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'What is the employee\'s last name?'
      },
      {
        name: 'role_id',
        type: 'input',
        message: 'What is the role ID for this employee?',
        validate: value => isNaN(value) === false || 'Please enter a valid role ID.'
      },
      {
        name: 'manager_id',
        type: 'input',
        message: 'What is the manager ID for this employee (enter if applicable, else leave blank)?',
        validate: value => (value === '' || isNaN(value) === false) || 'Please enter a valid manager ID or leave blank.',
        default: null
      }
    ]).then(answers => {
      const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      connection.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id || null], (err, res) => {
        if (err) throw err;
        console.log(`Added ${answers.first_name} ${answers.last_name} to employees.`);
        runMainMenu();
      });
    });
  }

// Function to delete a department
function deleteDepartment() {
    inquirer.prompt({
      name: 'department_id',
      type: 'input',
      message: 'Enter the ID of the department you want to delete:',
      validate: value => isNaN(value) === false || 'Please enter a valid department ID.'
    }).then(answer => {
      const query = 'DELETE FROM departments WHERE department_id = ?';
      connection.query(query, [answer.department_id], (err, res) => {
        if (err) throw err;
        console.log(`Deleted department with ID ${answer.department_id}.`);
        runMainMenu();
      });
    });
  }
  
  // Function to delete a role
  function deleteRole() {
    inquirer.prompt({
      name: 'role_id',
      type: 'input',
      message: 'Enter the ID of the role you want to delete:',
      validate: value => isNaN(value) === false || 'Please enter a valid role ID.'
    }).then(answer => {
      const query = 'DELETE FROM roles WHERE role_id = ?';
      connection.query(query, [answer.role_id], (err, res) => {
        if (err) throw err;
        console.log(`Deleted role with ID ${answer.role_id}.`);
        runMainMenu();
      });
    });
  }
  
  // Function to delete an employee
  function deleteEmployee() {
    inquirer.prompt({
      name: 'employee_id',
      type: 'input',
      message: 'Enter the ID of the employee you want to delete:',
      validate: value => isNaN(value) === false || 'Please enter a valid employee ID.'
    }).then(answer => {
      const query = 'DELETE FROM employees WHERE employee_id = ?';
      connection.query(query, [answer.employee_id], (err, res) => {
        if (err) throw err;
        console.log(`Deleted employee with ID ${answer.employee_id}.`);
        runMainMenu();
      });
    });
  }

// Function to update an employee's role
function updateEmployeeRole() {
    inquirer.prompt([
      {
        name: 'employee_id',
        type: 'input',
        message: 'Enter the ID of the employee whose role you want to update:',
        validate: value => isNaN(value) === false || 'Please enter a valid employee ID.'
      },
      {
        name: 'new_role_id',
        type: 'input',
        message: 'Enter the new role ID for the employee:',
        validate: value => isNaN(value) === false || 'Please enter a valid role ID.'
      }
    ]).then(answers => {
      const query = 'UPDATE employees SET role_id = ? WHERE employee_id = ?';
      connection.query(query, [answers.new_role_id, answers.employee_id], (err, res) => {
        if (err) throw err;
        console.log(`Updated role for employee ID ${answers.employee_id}.`);
        runMainMenu();
      });
    });
  }

// Function to view employees by manager
function viewEmployeesByManager() {
    inquirer.prompt({
      name: 'manager_id',
      type: 'input',
      message: 'Enter the ID of the manager to view their employees:'
    }).then(answer => {
      const query = `
        SELECT employees.id, employees.first_name, employees.last_name, roles.title
        FROM employees
        INNER JOIN roles ON employees.role_id = roles.id
        WHERE employees.manager_id = ?
      `;
      connection.query(query, [answer.manager_id], (err, res) => {
        if (err) throw err;
        console.table(res);
        runMainMenu();
      });
    });
  }

  // Function to view employees by department
function viewEmployeesByDepartment() {
    inquirer.prompt({
      name: 'department_id',
      type: 'input',
      message: 'Enter the ID of the department to view its employees:'
    }).then(answer => {
      const query = `
        SELECT employees.id, employees.first_name, employees.last_name, roles.title
        FROM employees
        INNER JOIN roles ON employees.role_id = roles.id
        WHERE roles.department_id = ?
      `;
      connection.query(query, [answer.department_id], (err, res) => {
        if (err) throw err;
        console.table(res);
        runMainMenu();
      });
    });
  }

  // Function to view the total budget of a department
function viewTotalBudget() {
    inquirer.prompt({
      name: 'department_id',
      type: 'input',
      message: 'Enter the ID of the department to view its total utilized budget:'
    }).then(answer => {
      const query = `
        SELECT SUM(roles.salary) AS total_budget
        FROM employees
        INNER JOIN roles ON employees.role_id = roles.id
        WHERE roles.department_id = ?
      `;
      connection.query(query, [answer.department_id], (err, res) => {
        if (err) throw err;
        console.log(`Total utilized budget of the department: $${res[0].total_budget}`);
        runMainMenu();
      });
    });
  }