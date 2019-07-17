DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(5, 2) NOT NULL,
  product_sales DECIMAL(5, 2) DEFAULT 0,
  stock_quantity INT default 0 NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE departments(
  department_id INT(2) ZEROFILL AUTO_INCREMENT,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs DECIMAL(5, 2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO products 
  (product_name, department_name, price, stock_quantity)
VALUES 
('Samsung TV', 'Electronics', 499.99, 6),
('Xbox One', 'Electronics', 349.99, 13),
('Milk', 'Grocery', 3.49, 30),
('Donut', 'Grocery', .75, 20),
('XL Mens T-shirt', 'Clothing', 19.99, 8),
('Hat', 'Clothing', 24.99, 18),
('Stapler', 'Stationary', 9.99, 3),
('Printer Paper', 'Stationary', 16.99, 23),
('Dog Food', 'Pets', 15.99, 12),
('Cat Toy', 'Pets', 2.99, 21);

INSERT INTO departments
  (department_name, over_head_costs)
VALUES 
('Electronics', 10000),
('Grocery', 30000),
('Clothing', 50000),
('Stationary', 70000),
('Pets', 90000);