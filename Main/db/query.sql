SELECT department.department_name AS dn, role.title,
department.department_name
FROM department
INNER JOIN role on department.id = role.department_id
INNER JOIN employee ON role.id = employee.role_id
INNER JOIN employee ON employee.id = employee.manager_id;