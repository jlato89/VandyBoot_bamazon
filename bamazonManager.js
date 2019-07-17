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
      showOptions(res);
   });
}

// -----------------------------------------------------------------------------
// FUNCTIONS
// -----------------------------------------------------------------------------

//* Selection Screen
function showOptions(res) {
   var myChoices = [
      'View Products',
      'View Low Inventory',
      'Add to Inventory',
      'Add New Product'];

   inquirer
      .prompt([
         {
            type: 'list',
            name: 'options',
            message: 'What do you want to do?',
            choices: myChoices,
            filter: function (val) {
               return myChoices.indexOf(val);
            }
         }
      ])
      .then(answers => {
         var answer = answers.options;

         switch (answer) {
            case 0:
               showInv(res);
               break;
         
            case 1:
               showLowInv(res);
               break;
         
            case 2:
               addInv(res);
               break;
         
            case 3:
               addProduct(res);
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


//* Add to Inventory
function addInv(res) {
   inquirer   
      .prompt([
         {
            type: 'rawlist',
            name: 'id',
            message: 'Which item would you like to update',
            choices: function () {
               var products = [];
               for (i = 0; i < res.length; i++) {
                  products.push({ name: res[i].product_name, value: res[i].id });
               }
               return products;
            }
         },
         {
            type: 'input',
            name: 'quantity',
            message: 'What would you like to set the quantity of to?',
            validate: function (value) {
               var num = value.match('^[0-9]*$');
               if (num) {
                  return true;
               }
               return 'Please enter a number only';
            }
         }
      ])
      .then(answers => {
         var id = answers.id;
         var quantity = answers.quantity;
         // console.log('ID: ' + id +'\nQuantity: '+quantity);

         // run through the database and update the selected values in a table
         connection.query("UPDATE products SET ? WHERE ?",
            [
               {
                  stock_quantity: quantity
               },
               {
                  id: id
               }
            ], 
            function (err) {
            if (err) throw err;
            var product = res[id-1].product_name;
            console.log(product+'\s have been updated to a quantity of '+quantity);
         });
         connection.end(); //! Close Connection
      });
}


//* Add New Product
function addProduct(res) {
   inquirer
      .prompt([
         {
            type: 'input',
            name: 'product_name',
            message: 'Item Name'
         },
         {
            type: 'input',
            name: 'department_name',
            message: 'Item Department'
         },
         {
            type: 'input',
            name: 'price',
            message: 'Price of Item'
         },
         {
            type: 'input',
            name: 'quantity',
            message: 'Item Quantity' 
         }
      ])
      .then(answers => {
         var product = answers.product_name;
         var department = answers.department_name;
         var price = answers.price;
         var quantity = answers.quantity;
         console.log('Product: ' + product + '\nDepartment: ' + department);
         console.log('\nPrice: ' + price + '\nQuantity: ' +quantity);

         // run through the database and update the selected values in a table
         connection.query("INSERT INTO products SET ?",
            [
               {
                  product_name: product,
                  department_name: department,
                  price: price,
                  stock_quantity: quantity
               },
            ],
            function (err) {
               if (err) throw err;
               console.log(product + '\s have been added with a quantity of ' + quantity);
            });
         connection.end(); //! Close Connection
      });
}