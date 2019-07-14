var mysql = require('mysql');
var Table = require('cli-table')
var inquirer = require('inquirer');

//* MYSQL CONNECTION
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
mainProc()
connection.end();
});
}

//* FUNCTIONS
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

function mainProc() {
   console.log('');
   inquirer
      .prompt([
         {
            type: 'number',
            name: 'product_id',
            message: "Which product would you like to buy?(please use Products ID)"
         },
         {
            type: 'number',
            name: 'quantity',
            message: "How many would you like to purchase?"
         }
      ])
      .then(answers => {
         // Use user feedback for... whatever!!
      });
}