DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT default 0 NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Samsung TV", "Electronics", 499.99, 6),
("Xbox One", "Electronics", 349.99, 13),
("Milk", "Grocery", 3.49, 30),
("Donut", "Grocery", .75, 20),
("XL Men's T-shirt", "Cloths", 19.99, 8),
("Hat", "Cloths", 24.99, 18),
("Stapler", "Stationary", 9.99, 3),
("Printer Paper", "Stationary", 16.99, 23),
("Dog Food", "Pets", 15.99, 12),
("Cat Toy", "Pets", 2.99, 21);