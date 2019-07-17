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
      options(res);
      // showProducts(res);
   });
}

// -----------------------------------------------------------------------------
// FUNCTIONS
// -----------------------------------------------------------------------------

//* Selection Screen
function options(res) {
   var myChoices = [
      'View Products',
      'View Low Inventory',
      'Add to Inventory',
      'Add New Product']

   inquirer
      .prompt([
         {
            type: 'list',
            name: 'theme',
            message: 'What do you want to do?',
            // choices: [
            //    'View Products',
            //    'View Low Inventory',
            //    new inquirer.Separator(),
            //    'Add to Inventory',
            //    'Add New Product'
            // ],
            choices: myChoices,
            filter: function (val) {
               return myChoices.indexOf(val);
            }
         }
      ])
      .then(answers => {
         var answer = answers.theme;

         switch (answer) {
            case 0:
               showInv(res);
               break;
         
            case 1:
               showLowInv(res);
               break;
         
            case 2:
               console.log('3');
               break;
         
            case 3:
               console.log('4');
               break;
         
            default:
               break;
         }
      });
}

//* Show products
function showInv(res) {
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
   connection.end(); //! Close Connection
}

//* View Low Inventory
function showLowInv(res) {
   // CLI TABLE INIT
   var products = new Table({
      head: ['ID', 'Product', 'Department', 'Price', 'Stock']
      , colWidths: [5, 20, 20, 10, 10]
   });

   // Grab low Inventory Items
   connection.query("SELECT * FROM products WHERE stock_quantity<?", [5], function (err, res) {
      if (err) throw err;
      console.log('lowInv: '+ res);

      // run through the database and store the values in a table
      for (i = 0; i < res.length; i++) {
         var data = res[i];
         products.push(
            [data.id, data.product_name, data.department_name, '$' + data.price, data.stock_quantity]
         );
      }
      console.log(products.toString());
   });
   connection.end(); //! Close Connection
}