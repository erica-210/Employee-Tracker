INSERT INTO department (department_name)
VALUES ("Head of House"),
       ("Slayer"),
       ("Demon"),
       ("Ranked Demon");


INSERT INTO roles (title, salary, department_id)
VALUES ("Demon Corps Leader", 500000, 1),
       ("Demon King", 1000000, 1),
       ("Hashira", 120000, 2),
       ("Kanoe", 40000, 2),
       ("Kanoto", 30000, 2),
       ("Slayer Backup", 25000, 3),
       ("Doctor", 55000, 3),
       ("Standard Demon", 15000, 3),
       ("Upper Rank", 130000, 4),
       ("Lower Rank", 50000, 4);


INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Kagaya", "Ubuyashiki", 1, NULL),
       ("Muzan", "Kibutsuji", 1, NULL),
       ("Giyu", "Tomioka", 3, 1),
       ("Tanjiro", "Kamado", 4, 3),
       ("Nezuko", "Kamado", 6, 4),
       ("Susamaru", "Temari", 8, 2),
       ("Akaza", "San", 9, 2),
       ("Rui", "Shi", 10, 2);