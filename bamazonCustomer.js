var mysql = require('mysql');
var Table = require('cli-table')

// MYSQL CONNECTION
var connection = mysql.createConnection({
host: 'localhost',
port: 3306,
user: 'root',
password: 'password',
database: 'bamazon_db'
});

connection.connect(function (err) {
if (err) throw err;
console.log('connected as id ' + connection.threadId);
afterConnection();
});

function afterConnection() {
connection.query('SELECT * FROM products', function (err, res) {
if (err) throw err;
// console.log(res);
showProducts(res);
connection.end();
});
}

function showProducts(res) {
   // CLI TABLE INIT
   var products = new Table({
      head: ['ID', 'Product', 'Department', 'Price', 'Stock']
      , colWidths: [5, 20, 20, 10, 10]
   });

   // run through the database and store the values in a table
   for (i = 0; i < res.length; i++) {
      data = res[i];
      products.push(
         [data.id, data.product_name, data.department_name, '$' + data.price, data.stock_quantity]
      );
   }
   console.log(products.toString());
}