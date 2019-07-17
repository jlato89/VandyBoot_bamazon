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
   connection.query('SELECT * FROM departments', function (err, res) {
      if (err) throw err;
      // console.log(res);
      // connection.end(); //! Close Connection
      showOptions(res);
   });
}

// -----------------------------------------------------------------------------
// FUNCTIONS
// -----------------------------------------------------------------------------

//* Selection Screen
function showOptions(res) {
   var myChoices = [
      'View Product Sales by Department',
      'Create New Department'];

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
               showDeptSales(res);
               break;

            case 1:
               creatDept(res);
               break;

            default:
               break;
         }
      });
}


//* View Product Sales
function showDeptSales(res) {
   // CLI TABLE INIT
   var products = new Table({
      head: ['Department ID', 'Department', 'Over Head Costs', 'Product Sales', 'Total Profit']
      , colWidths: [10, 20, 15, 15, 15]
   });

   // Grab low Inventory Items
   connection.query("SELECT * FROM products", 
   function (err, product) {
      if (err) throw err;
      console.log('product res: '+product);
      console.log('dept res: '+res);

      // run through the database and store the values in a table
      for (i = 0; i < res.length; i++) {
         var dept = res[i];
         var product = product[i];
         var tProfit = 'something';
         products.push(
            [dept.department_id, dept.department_name, dept.over_head_costs, product.product_sales, tProfit]
         );
      }
      console.log(products.toString());
   });
   connection.end(); //! Close Connection
}
