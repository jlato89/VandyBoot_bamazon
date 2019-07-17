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
mainProc(res)
});
}

//* Show products
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

//* Start Prompt
function mainProc(res) {
   console.log('');
   inquirer
      .prompt([
         {
            type: 'rawlist',
            name: 'product_id',
            message: "Please select the ID of the product you would like to buy",
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
            message: "How many would you like to purchase?",
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
         // console.log('ID: '+answers.product_id);
         // console.log('User Wants: '+answers.quantity);
         
         var id = answers.product_id;
         var quantity = answers.quantity;

         connection.query('SELECT * FROM products WHERE id=?',[id] , function (err, res) {
            if (err) throw err;
            // console.log(res);

            var DBquantity = res[0].stock_quantity;
            // console.log('DB Quantity: '+DBquantity);

            if (quantity > DBquantity) {
               console.log('Store can NOT fulfil order! Please choose a lower Quantity.');
               connection.end(); //! Close Connection
            } else {
               var newQuantity = DBquantity - quantity;
               updateProduct(id, newQuantity, quantity);
               console.log('Store has fulfilled your order! Thank you for your purchase.');
            }
         });
         // connection.end(); // Close Connection
      });
}

function updateProduct(id, newQuantity, quantity) {
   // console.log("Updating quantities...\n");
   connection.query("UPDATE products SET ? WHERE ?",
      [
         {
            stock_quantity: newQuantity
         },
         {
            id: id
         }
      ],
      function (err, res) {
         if (err) {
            console.log('There was an issue with our database, please try again.');
            connection.end(); //! Close Connection
            throw err;
         }
         orderTotal(id, quantity)
         // console.log(res.affectedRows + " products updated!\n");
      }
   );
}
function orderTotal(id, quantity) {
   connection.query('SELECT * FROM products WHERE id=?', [id], 
   function (err, res) {
      if (err) throw err;
      var DBprice = res[0].price;
      var dbProductSales = res[0].product_sales;
      var purchaseTotal = DBprice * quantity;

      console.log('Total Price for this order is $'+purchaseTotal);

      // Add Purchase total to Product Sales
      connection.query("UPDATE products SET ? WHERE ?",
      [
         {
            product_sales: dbProductSales += purchaseTotal
         },
         {
            id: id
         }
      ],
      function (err, res) {
         if (err) {
            console.log('There was an issue with our database, please try again.');
            connection.end(); //! Close Connection
            throw err;
         }
         connection.end(); //! Close Connection
      });
   });
}