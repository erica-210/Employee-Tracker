SELECT
  department.department_name AS department_name,
  roles.title AS role_title,
  employee.first_name AS employee_first_name,
  employee.last_name AS employee_last_name
FROM
  department
INNER JOIN
  roles ON department.id = roles.department_id
INNER JOIN
  employee ON roles.id = employee.roles_id;

SELECT
    e1.id AS employee_id,
    e1.first_name AS employee_first_name,
    e1.last_name AS employee_last_name,
    e1.roles_id AS employee_roles_id,
    e2.id AS manager_id,
    e2.first_name AS manager_first_name,
    e2.last_name AS manager_last_name,
    e2.roles_id AS manager_roles_id
FROM
    employee e1
LEFT JOIN
    employee e2 ON e1.manager_id = e2.id;