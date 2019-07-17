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
   connection.query(
      'SELECT DISTINCT '+
      'products.product_sales,'+
      'products.department_name,'+
      'departments.department_id,'+
      'departments.department_name,'+
      'departments.over_head_costs '+
      'FROM products '+
      'INNER JOIN departments ON products.department_name = departments.department_name', 
      function (err, res) {
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
      head: ['Dept ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit']
      , colWidths: [9, 18, 18, 15, 14]
   });
   // Grab Inventory Items

      // run through the database and store the values in a table
      for (i = 0; i < res.length; i++) {
         var dept = res[i];
         var profit = dept.product_sales - dept.over_head_costs;
         products.push(
            [dept.department_id, dept.department_name, dept.over_head_costs, '$'+dept.product_sales, '$'+profit]
         );
      }
      console.log(products.toString());
   connection.end(); //! Close Connection
}
