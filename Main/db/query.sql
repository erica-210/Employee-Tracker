SELECT department.department_name AS dn, roles.title,
department.department_name
FROM department
INNER JOIN roles on department.id = roles.department_id
INNER JOIN employee ON roles.id = employee.roles_id
INNER JOIN employee ON employee.id = employee.manager_id;