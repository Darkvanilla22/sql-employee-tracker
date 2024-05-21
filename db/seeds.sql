-- Insert initial departments
INSERT INTO departments (name) VALUES
('Sales'),
('Engineering'),
('Finance'),
('Human Resources');

-- Insert initial roles
INSERT INTO roles (title, salary, department_id) VALUES
('Sales Associate', 50000.00, 1),
('Sales Manager', 80000.00, 1),
('Software Engineer', 75000.00, 2),
('Senior Software Engineer', 95000.00, 2),
('Financial Analyst', 60000.00, 3),
('Accountant', 65000.00, 3),
('HR Coordinator', 55000.00, 4),
('HR Manager', 75000.00, 4);

-- Insert initial employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Mike', 'Johnson', 3, NULL),
('Emily', 'Williams', 4, 3),
('Chris', 'Brown', 5, NULL),
('Alice', 'Davis', 6, 5),
('Sarah', 'Jones', 7, NULL),
('David', 'Clark', 8, 7);