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

// CLI TABLE INIT
var table = new Table({
   head: ['ID', 'Product', 'Department', 'Price', 'Stock']
   , colWidths: [5, 20, 20, 10, 10]
});

for (i = 0; i < res.length; i++) {
   data = res[i];
   table.push(
      [data.id, data.product_name, data.department_name, '$'+data.price, data.stock_quantity]
   );
}
console.log(table.toString());

connection.end();
});
}